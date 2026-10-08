"""Question answering chain with grounding and citations (Phase 4)."""
import os
import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import chromadb
import dotenv
from openai import OpenAI

from src.config import (
    DEFAULT_SIMILARITY_THRESHOLD,
    DEFAULT_TOP_K,
    ENABLE_MULTI_QUERY,
    LLM_MODEL,
)
from src.cost_tracker import TokenUsage, track_usage
from src.retriever import (
    RetrievedChunk,
    classify_question,
    get_collection,
    retrieve_chunks,
)

dotenv.load_dotenv()

NOT_FOUND_RESPONSE = "I couldn't find this in the codebase."

SYSTEM_PROMPT = """You are CodeQuery, a precise and strictly grounded codebase Q&A assistant.
Your task is to answer the user's question solely based on the provided code snippets.

CRITICAL INSTRUCTIONS:
1. Grounding: Rely ONLY on the code context provided. Do NOT use outside programming knowledge, do NOT assume implementations, and do NOT extrapolate beyond what is directly shown.
2. Citation Requirement: You MUST cite the exact file path and line numbers for EVERY factual claim or code reference using the format `file_path:start_line-end_line` (e.g. `auth.py:8-11`).
3. Refusal Rule: If the provided code context does not contain enough information to answer the question, or if the functionality does not exist in the context, you MUST respond exactly: "I couldn't find this in the codebase." Do NOT attempt to guess, apologize, or provide generic examples.
4. Conciseness: When the answer is present, be concise, direct, and explain clearly while citing the relevant file and line ranges."""


def format_context(chunks: List[RetrievedChunk]) -> str:
    """Format retrieved code chunks into a context block with clear citation headers."""
    formatted_chunks = []
    for idx, chunk in enumerate(chunks, 1):
        header = f"--- Source [{idx}]: {chunk.citation} (Type: {chunk.chunk_type}, Symbol: {chunk.name or 'N/A'}, Similarity: {chunk.score:.4f}) ---"
        formatted_chunks.append(f"{header}\n{chunk.code_text}")
    return "\n\n".join(formatted_chunks)


def extract_citations(text: str) -> List[str]:
    """Extract file:start_line-end_line citations from the response text."""
    pattern = r'[a-zA-Z0-9_\-\./\\]+:\d+-\d+'
    matches = re.findall(pattern, text)
    # Deduplicate while preserving order
    seen = set()
    unique = []
    for m in matches:
        clean = m.strip("`'\"()[]{}.,")
        if clean and clean not in seen:
            seen.add(clean)
            unique.append(clean)
    return unique


@dataclass
class QAResponse:
    """Represents the final answer, citations, retrieved chunks, and token/cost usage."""
    question: str
    answer: str
    citations: List[str]
    retrieved_chunks: List[RetrievedChunk]
    found: bool
    total_tokens: int = 0
    prompt_tokens: int = 0
    completion_tokens: int = 0
    cost_usd: float = 0.0
    embedding_usage: Optional[TokenUsage] = None
    llm_usage: Optional[TokenUsage] = None
    query_expansion_usage: Optional[TokenUsage] = None
    query_variations: List[str] = field(default_factory=list)
    question_type: str = "lookup"

    @property
    def cost_breakdown(self) -> Any:
        """Construct detailed cost breakdown separating query expansion from answer generation."""
        from src.cost_tracker import create_cost_breakdown
        return create_cost_breakdown(
            embedding_usage=self.embedding_usage,
            query_expansion_usage=self.query_expansion_usage,
            answer_generation_usage=self.llm_usage,
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "question": self.question,
            "answer": self.answer,
            "citations": self.citations,
            "found": self.found,
            "total_tokens": self.total_tokens,
            "prompt_tokens": self.prompt_tokens,
            "completion_tokens": self.completion_tokens,
            "cost_usd": self.cost_usd,
            "embedding_usage": self.embedding_usage.to_dict() if self.embedding_usage else None,
            "llm_usage": self.llm_usage.to_dict() if self.llm_usage else None,
            "query_expansion_usage": self.query_expansion_usage.to_dict() if self.query_expansion_usage else None,
            "query_variations": self.query_variations,
            "question_type": self.question_type,
            "cost_breakdown": self.cost_breakdown.to_dict(),
            "retrieved_chunks": [c.to_dict() for c in self.retrieved_chunks],
        }


def generate_answer(
    question: str,
    chunks: List[RetrievedChunk],
    client: Optional[OpenAI] = None,
    model: str = LLM_MODEL,
    return_usage: bool = False,
) -> Any:
    """Call gpt-4o-mini with the strict system prompt and retrieved code context."""
    if not chunks:
        return (NOT_FOUND_RESPONSE, TokenUsage()) if return_usage else NOT_FOUND_RESPONSE

    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if client is None:
        client = OpenAI(api_key=api_key)

    context_str = format_context(chunks)
    user_prompt = f"""Code Context:
{context_str}

Question: {question}

Please answer the question based only on the code context above. Always cite `file_path:start_line-end_line` for every claim."""

    print("\n" + "-" * 75, flush=True)
    print("[DEBUG LLM CALL] System Prompt sent to LLM:", flush=True)
    print(SYSTEM_PROMPT, flush=True)
    print("-" * 75, flush=True)
    print(f"[DEBUG LLM CALL] Question: '{question}'", flush=True)
    print(f"[DEBUG LLM CALL] Context chunks count: {len(chunks)} (~{len(context_str)} characters)", flush=True)
    print("-" * 75, flush=True)

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.0,
    )

    answer_text = (response.choices[0].message.content or "").strip()
    usage = track_usage(getattr(response, "usage", None), model)

    print("-" * 75, flush=True)
    print(f"[DEBUG LLM RAW RESPONSE]:", flush=True)
    print(answer_text, flush=True)
    print("-" * 75 + "\n", flush=True)

    if return_usage:
        return answer_text, usage
    return answer_text


def ask_codebase(
    question: str,
    collection: Optional[chromadb.Collection] = None,
    top_k: int = DEFAULT_TOP_K,
    similarity_threshold: float = DEFAULT_SIMILARITY_THRESHOLD,
    client: Optional[OpenAI] = None,
    use_mock: bool = False,
    question_type: Optional[str] = None,
    enable_multi_query: Optional[bool] = None,
) -> QAResponse:
    """
    End-to-end RAG pipeline:
    1. Retrieve chunks matching the question (with optional multi-query expansion).
    2. Enforce similarity threshold.
    3. Generate cited answer via LLM.
    4. Compute and return unified token usage and itemized costs.
    """
    clean_question = question.strip()
    resolved_q_type = question_type or classify_question(clean_question)

    if not clean_question:
        return QAResponse(
            question=question,
            answer=NOT_FOUND_RESPONSE,
            citations=[],
            retrieved_chunks=[],
            found=False,
            embedding_usage=TokenUsage(),
            llm_usage=TokenUsage(),
            query_expansion_usage=TokenUsage(),
            query_variations=[],
            question_type=resolved_q_type,
        )

    if collection is None:
        collection = get_collection()

    # Step 1: Retrieve top-k chunks with embedding and expansion usage captured
    retrieved, emb_usage, qe_usage, variations = retrieve_chunks(
        query=clean_question,
        collection=collection,
        top_k=top_k,
        client=client,
        use_mock=use_mock,
        return_usage=True,
        return_details=True,
        question_type=resolved_q_type,
        enable_multi_query=enable_multi_query,
    )

    # Step 2: Check similarity threshold
    # If no chunk meets the threshold, reject early without calling the LLM for answer generation
    valid_chunks = [c for c in retrieved if c.score >= similarity_threshold]

    print("\n" + "=" * 75, flush=True)
    print(f"[DEBUG THRESHOLD CHECK] Question: '{clean_question}'", flush=True)
    print(f"  Similarity threshold: {similarity_threshold}", flush=True)
    print(f"  Total chunks retrieved: {len(retrieved)}", flush=True)
    print(f"  Chunks surviving threshold (score >= {similarity_threshold}): {len(valid_chunks)}", flush=True)
    if valid_chunks:
        print("  Chunks passed into LLM context:", flush=True)
        for idx, c in enumerate(valid_chunks, 1):
            print(f"    [{idx}] {c.citation} (Type: {c.chunk_type}, Symbol: {c.name or 'N/A'}, Best Similarity Score: {c.score:.4f}, Chroma Distance: {c.distance:.4f})", flush=True)
    else:
        print("  NO chunks survived threshold! LLM will NOT be called.", flush=True)
    print("=" * 75 + "\n", flush=True)

    if not valid_chunks:
        total_pre_llm = emb_usage + qe_usage
        return QAResponse(
            question=clean_question,
            answer=NOT_FOUND_RESPONSE,
            citations=[],
            retrieved_chunks=retrieved,
            found=False,
            total_tokens=total_pre_llm.total_tokens,
            prompt_tokens=total_pre_llm.prompt_tokens,
            completion_tokens=total_pre_llm.completion_tokens,
            cost_usd=total_pre_llm.cost_usd,
            embedding_usage=emb_usage,
            llm_usage=TokenUsage(0, 0, 0, 0.0),
            query_expansion_usage=qe_usage,
            query_variations=variations,
            question_type=resolved_q_type,
        )

    # Step 3: LLM generation
    if use_mock:
        # Mock mode for testing without OpenAI API access
        answer = f"Mock answer grounded in {valid_chunks[0].citation}."
        citations = [valid_chunks[0].citation]
        mock_llm_usage = TokenUsage(prompt_tokens=100, completion_tokens=20, total_tokens=120, cost_usd=0.0)
        total_usage = emb_usage + qe_usage + mock_llm_usage
        return QAResponse(
            question=clean_question,
            answer=answer,
            citations=citations,
            retrieved_chunks=valid_chunks,
            found=True,
            total_tokens=total_usage.total_tokens,
            prompt_tokens=total_usage.prompt_tokens,
            completion_tokens=total_usage.completion_tokens,
            cost_usd=total_usage.cost_usd,
            embedding_usage=emb_usage,
            llm_usage=mock_llm_usage,
            query_expansion_usage=qe_usage,
            query_variations=variations,
            question_type=resolved_q_type,
        )

    raw_answer, llm_usage = generate_answer(
        question=clean_question,
        chunks=valid_chunks,
        client=client,
        return_usage=True,
    )

    total_usage = emb_usage + qe_usage + llm_usage

    # Check if the LLM refused to answer
    is_refusal = (
        NOT_FOUND_RESPONSE.lower() in raw_answer.lower()
        or raw_answer.strip() == NOT_FOUND_RESPONSE
        or "couldn't find" in raw_answer.lower()
        or "could not find" in raw_answer.lower()
    )

    if is_refusal:
        print("[DEBUG REFUSAL CHECK] Refusal detected in raw answer! Overwriting response with NOT_FOUND_RESPONSE.", flush=True)
        return QAResponse(
            question=clean_question,
            answer=NOT_FOUND_RESPONSE,
            citations=[],
            retrieved_chunks=valid_chunks,
            found=False,
            total_tokens=total_usage.total_tokens,
            prompt_tokens=total_usage.prompt_tokens,
            completion_tokens=total_usage.completion_tokens,
            cost_usd=total_usage.cost_usd,
            embedding_usage=emb_usage,
            llm_usage=llm_usage,
            query_expansion_usage=qe_usage,
            query_variations=variations,
            question_type=resolved_q_type,
        )

    citations = extract_citations(raw_answer)
    # If no inline citations were parsed by regex but answer is grounded, include top chunk citations
    if not citations and valid_chunks:
        citations = [c.citation for c in valid_chunks[:2]]

    return QAResponse(
        question=clean_question,
        answer=raw_answer,
        citations=citations,
        retrieved_chunks=valid_chunks,
        found=True,
        total_tokens=total_usage.total_tokens,
        prompt_tokens=total_usage.prompt_tokens,
        completion_tokens=total_usage.completion_tokens,
        cost_usd=total_usage.cost_usd,
        embedding_usage=emb_usage,
        llm_usage=llm_usage,
        query_expansion_usage=qe_usage,
        query_variations=variations,
        question_type=resolved_q_type,
    )

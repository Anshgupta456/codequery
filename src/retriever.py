"""Similarity search and retrieval logic with Multi-Query support (Phase 3)."""
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import chromadb
from openai import OpenAI

from src.config import (
    CHROMA_PERSIST_DIR,
    COLLECTION_NAME,
    DEFAULT_TOP_K,
    ENABLE_MULTI_QUERY,
    LLM_MODEL,
)
from src.cost_tracker import TokenUsage, track_usage
from src.embedder import (
    generate_embeddings,
    get_chroma_client,
    get_or_create_collection,
)

# Patterns indicating exhaustive / analytical codebase questions
EXHAUSTIVE_PATTERNS = [
    r"\bwhich\s+files\b",
    r"\ball\s+files\b",
    r"\blist\s+all\b",
    r"\bfind\s+all\b",
    r"\bevery\s+file\b",
    r"\bevery\s+class\b",
    r"\bevery\s+function\b",
    r"\ball\s+occurrences\b",
    r"\ball\s+imports\b",
    r"\ball\s+routes\b",
    r"\ball\s+endpoints\b",
    r"\ball\s+models\b",
]


_DEBUG_QUERY_COUNT = 0


def _log_raw_chroma_results(
    query_text: str,
    results: Dict[str, Any],
    top_n: int = 5,
) -> None:
    """Temporary debug logger: print the top raw results returned by ChromaDB BEFORE any threshold filtering."""
    global _DEBUG_QUERY_COUNT
    _DEBUG_QUERY_COUNT += 1
    if _DEBUG_QUERY_COUNT > 3:
        return

    print("\n" + "=" * 75, flush=True)
    print(f"[DEBUG LOGGING #{_DEBUG_QUERY_COUNT}/3] User Question: '{query_text}'", flush=True)
    print("[DEBUG LOGGING] Top 5 raw ChromaDB results (BEFORE threshold filtering):", flush=True)
    print("-" * 75, flush=True)

    all_ids = results.get("ids", [])
    all_metas = results.get("metadatas", [])
    all_dists = results.get("distances", [])

    flat_results = []
    if all_ids and isinstance(all_ids[0], list):
        for q_idx in range(len(all_ids)):
            ids = all_ids[q_idx]
            metas = all_metas[q_idx] if q_idx < len(all_metas) else []
            dists = all_dists[q_idx] if q_idx < len(all_dists) else []
            for cid, meta, dist in zip(ids, metas, dists):
                flat_results.append((cid, meta, dist))
    else:
        for cid, meta, dist in zip(all_ids, all_metas, all_dists):
            flat_results.append((cid, meta, dist))

    seen: Dict[str, Dict[str, Any]] = {}
    for cid, meta, dist in flat_results:
        raw_dist = float(dist)
        if cid not in seen or raw_dist < seen[cid]["raw_dist"]:
            seen[cid] = {
                "cid": cid,
                "meta": meta,
                "raw_dist": raw_dist,
                "converted_sim": round(1.0 - raw_dist, 4),
            }

    sorted_items = sorted(seen.values(), key=lambda x: x["raw_dist"])[:top_n]

    if not sorted_items:
        print("  (No results returned by ChromaDB)", flush=True)
    else:
        for rank, item in enumerate(sorted_items, 1):
            meta = item["meta"] or {}
            fpath = meta.get("file_path", "unknown")
            ctype = meta.get("chunk_type", "unknown")
            sline = meta.get("start_line", "?")
            eline = meta.get("end_line", "?")
            cname = meta.get("name", "")
            raw_d = item["raw_dist"]
            conv_s = item["converted_sim"]

            print(
                f"  [{rank}] file_path: {fpath}:{sline}-{eline} | chunk_type: {ctype} ({cname})\n"
                f"      -> Chroma raw return: distance = {raw_d:.4f} (ChromaDB raw metric: lower is closer)\n"
                f"      -> CodeQuery metric:  converted similarity = {conv_s:.4f} (computed as 1.0 - distance)",
                flush=True,
            )
    print("=" * 75 + "\n", flush=True)


@dataclass
class RetrievedChunk:
    """Represents a chunk retrieved from vector search with similarity score and metadata."""
    chunk_id: str
    code_text: str
    file_path: str
    start_line: int
    end_line: int
    chunk_type: str
    name: str
    score: float       # Cosine similarity score: 1.0 - distance (higher is more relevant)
    distance: float    # Raw Chroma distance
    language: str = "unknown"

    @property
    def citation(self) -> str:
        """Formatted file:line citation (e.g. auth.py:8-11)."""
        return f"{self.file_path}:{self.start_line}-{self.end_line}"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "chunk_id": self.chunk_id,
            "citation": self.citation,
            "file_path": self.file_path,
            "start_line": self.start_line,
            "end_line": self.end_line,
            "chunk_type": self.chunk_type,
            "name": self.name,
            "score": self.score,
            "distance": self.distance,
            "code_text": self.code_text,
            "language": self.language,
        }


def classify_question(question: str) -> str:
    """
    Classify a question into 'lookup' or 'exhaustive'.
    - 'exhaustive' / 'analytical': questions asking for broad inventories or comprehensive
      cross-file listings (e.g. 'which files import X', 'list all endpoints').
    - 'lookup': targeted semantic searches for a specific function, class, or logic
      (e.g. 'where is user authentication handled', 'what does process_payment do').
    """
    clean = question.strip().lower()
    for pattern in EXHAUSTIVE_PATTERNS:
        if re.search(pattern, clean):
            return "exhaustive"
    return "lookup"


def generate_query_variations(
    question: str,
    client: Optional[OpenAI] = None,
    model: str = LLM_MODEL,
    use_mock: bool = False,
    return_usage: bool = False,
) -> Any:
    """
    Generate 3-4 reworded versions of the user's question using gpt-4o-mini
    to bridge vocabulary mismatches with the codebase (e.g., synonyms, function names).
    Keep this a cheap, single, fast LLM call.
    """
    clean_question = question.strip()
    if not clean_question:
        return ([], TokenUsage()) if return_usage else []

    if use_mock:
        mock_variations = [
            f"{clean_question} implementation",
            f"verify and check {clean_question}",
            f"{clean_question} handler function",
        ]
        mock_usage = TokenUsage(prompt_tokens=25, completion_tokens=20, total_tokens=45, cost_usd=0.0)
        return (mock_variations, mock_usage) if return_usage else mock_variations

    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if client is None:
        client = OpenAI(api_key=api_key)

    system_prompt = (
        "You are an expert developer assistant specialized in codebase search and code retrieval.\n"
        "Given a user's question or search query about a codebase, generate 3 to 4 reworded versions "
        "or alternative search queries. Vary the terminology, phrasing, and synonyms (e.g., function "
        "and method names, action verbs like verify vs validate vs check vs authenticate vs authorize, "
        "token vs credentials vs session, middleware vs handler vs service).\n"
        "Rules:\n"
        "1. Output exactly 3 to 4 alternative queries, one per line.\n"
        "2. Do NOT number them, and do not use bullet points, prefixes, or symbols.\n"
        "3. Output ONLY the queries — no preamble, quotes, or conversational text."
    )

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": clean_question},
            ],
            temperature=0.3,
            max_tokens=150,
        )

        raw_content = (response.choices[0].message.content or "").strip()
        usage = track_usage(getattr(response, "usage", None), model)

        variations: List[str] = []
        for line in raw_content.splitlines():
            cleaned_line = line.strip().lstrip("0123456789.-*•) ")
            cleaned_line = cleaned_line.strip("\"'")
            if cleaned_line and cleaned_line.lower() != clean_question.lower() and cleaned_line not in variations:
                variations.append(cleaned_line)

        variations = variations[:4]
        if return_usage:
            return variations, usage
        return variations

    except Exception:
        # Fallback gracefully if LLM API call fails
        fallback_usage = TokenUsage()
        if return_usage:
            return [], fallback_usage
        return []


def get_collection(
    persist_dir: Optional[str | Path] = None,
    collection_name: str = COLLECTION_NAME,
) -> chromadb.Collection:
    """Connect to the persistent Chroma store and return the collection."""
    client = get_chroma_client(persist_dir or CHROMA_PERSIST_DIR)
    return get_or_create_collection(client, collection_name=collection_name, reset=False)


def retrieve_chunks(
    query: str,
    collection: Optional[chromadb.Collection] = None,
    top_k: int = DEFAULT_TOP_K,
    client: Optional[OpenAI] = None,
    use_mock: bool = False,
    min_score: Optional[float] = None,
    return_usage: bool = False,
    question_type: Optional[str] = None,
    enable_multi_query: Optional[bool] = None,
    return_details: bool = False,
) -> Any:
    """
    Embed the query, perform similarity search against ChromaDB,
    and return matched chunks with metadata and similarity scores.
    
    If enable_multi_query is True and question_type is 'lookup', runs multi-query retrieval:
    1. Generates 3-4 query variations.
    2. Embeds all queries in a single embedding call.
    3. Queries Chroma for all queries.
    4. Merges and deduplicates chunks by chunk ID, retaining the highest similarity score.
    5. Re-ranks and returns the top-k chunks.
    
    If question_type is 'exhaustive' / 'analytical' or multi-query is disabled,
    bypasses multi-query and executes standard single-query retrieval.
    """
    clean_query = query.strip()
    if not clean_query:
        if return_details:
            return ([], TokenUsage(), TokenUsage(), []) if return_usage else ([], [])
        return ([], TokenUsage()) if return_usage else []

    if collection is None:
        collection = get_collection()

    # Determine question type ('lookup' vs 'exhaustive')
    q_type = (question_type or classify_question(clean_query)).lower()
    
    # Determine whether multi-query should be used
    mq_active = ENABLE_MULTI_QUERY if enable_multi_query is None else enable_multi_query
    should_use_multi_query = bool(mq_active) and (q_type == "lookup")

    qe_usage = TokenUsage()
    query_variations: List[str] = []

    if should_use_multi_query:
        # Step 1: Generate query variations
        query_variations, qe_usage = generate_query_variations(
            question=clean_query,
            client=client,
            use_mock=use_mock,
            return_usage=True,
        )

        all_queries = [clean_query] + [v for v in query_variations if v.strip()]

        # Step 2: Embed original question + variations in a single batch
        if return_usage:
            all_embeddings, emb_usage = generate_embeddings(
                texts=all_queries,
                client=client,
                use_mock=use_mock,
                return_usage=True,
            )
        else:
            all_embeddings = generate_embeddings(
                texts=all_queries,
                client=client,
                use_mock=use_mock,
                return_usage=False,
            )
            emb_usage = TokenUsage()

        if not all_embeddings:
            if return_details:
                return ([], emb_usage, qe_usage, query_variations) if return_usage else ([], query_variations)
            return ([], emb_usage) if return_usage else []

        # Step 3: Query Chroma for each query embedding
        results = collection.query(
            query_embeddings=all_embeddings,
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        # Temporary debug logging for raw ChromaDB output before any threshold filtering
        _log_raw_chroma_results(clean_query, results, top_n=5)

        # Step 4: Deduplicate by chunk_id and retain highest similarity score across all queries
        best_chunks_by_id: Dict[str, RetrievedChunk] = {}
        total_queries = len(all_queries)

        all_ids = results.get("ids", [[]] * total_queries)
        all_docs = results.get("documents", [[]] * total_queries)
        all_metas = results.get("metadatas", [[]] * total_queries)
        all_dists = results.get("distances", [[]] * total_queries)

        for q_idx in range(total_queries):
            ids_list = all_ids[q_idx] if q_idx < len(all_ids) else []
            docs_list = all_docs[q_idx] if q_idx < len(all_docs) else []
            metas_list = all_metas[q_idx] if q_idx < len(all_metas) else []
            dists_list = all_dists[q_idx] if q_idx < len(all_dists) else []

            for chunk_id, doc, meta, dist in zip(ids_list, docs_list, metas_list, dists_list):
                similarity_score = round(1.0 - float(dist), 4)

                if min_score is not None and similarity_score < min_score:
                    continue

                if chunk_id not in best_chunks_by_id or similarity_score > best_chunks_by_id[chunk_id].score:
                    best_chunks_by_id[chunk_id] = RetrievedChunk(
                        chunk_id=chunk_id,
                        code_text=doc,
                        file_path=meta.get("file_path", ""),
                        start_line=int(meta.get("start_line", 1)),
                        end_line=int(meta.get("end_line", 1)),
                        chunk_type=meta.get("chunk_type", "unknown"),
                        name=meta.get("name", ""),
                        score=similarity_score,
                        distance=round(float(dist), 4),
                        language=meta.get("language", "unknown"),
                    )

        # Step 5: Re-rank merged deduplicated set by similarity score descending, take top-k
        retrieved = sorted(best_chunks_by_id.values(), key=lambda c: c.score, reverse=True)[:top_k]

    else:
        # Standard single-query retrieval
        if return_usage:
            query_embeddings, emb_usage = generate_embeddings(
                texts=[clean_query],
                client=client,
                use_mock=use_mock,
                return_usage=True,
            )
        else:
            query_embeddings = generate_embeddings(
                texts=[clean_query],
                client=client,
                use_mock=use_mock,
                return_usage=False,
            )
            emb_usage = TokenUsage()

        if not query_embeddings:
            if return_details:
                return ([], emb_usage, qe_usage, query_variations) if return_usage else ([], query_variations)
            return ([], emb_usage) if return_usage else []

        results = collection.query(
            query_embeddings=query_embeddings,
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        # Temporary debug logging for raw ChromaDB output before any threshold filtering
        _log_raw_chroma_results(clean_query, results, top_n=5)

        retrieved = []
        ids_list = results.get("ids", [[]])[0]
        docs_list = results.get("documents", [[]])[0]
        metas_list = results.get("metadatas", [[]])[0]
        dists_list = results.get("distances", [[]])[0]

        for chunk_id, doc, meta, dist in zip(ids_list, docs_list, metas_list, dists_list):
            similarity_score = round(1.0 - float(dist), 4)

            if min_score is not None and similarity_score < min_score:
                continue

            retrieved.append(
                RetrievedChunk(
                    chunk_id=chunk_id,
                    code_text=doc,
                    file_path=meta.get("file_path", ""),
                    start_line=int(meta.get("start_line", 1)),
                    end_line=int(meta.get("end_line", 1)),
                    chunk_type=meta.get("chunk_type", "unknown"),
                    name=meta.get("name", ""),
                    score=similarity_score,
                    distance=round(float(dist), 4),
                    language=meta.get("language", "unknown"),
                )
            )

    if return_details:
        if return_usage:
            return retrieved, emb_usage, qe_usage, query_variations
        return retrieved, query_variations

    if return_usage:
        return retrieved, emb_usage
    return retrieved

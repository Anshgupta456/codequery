"""CodeQuery Streamlit Application with Token Usage and Cost Tracking."""
import os
import sys
from pathlib import Path

import streamlit as st

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from src.config import (
    CHROMA_PERSIST_DIR,
    COLLECTION_NAME,
    DEFAULT_SIMILARITY_THRESHOLD,
    DEFAULT_TOP_K,
    EMBEDDING_MODEL,
    ENABLE_MULTI_QUERY,
    LLM_MODEL,
    MODEL_PRICING,
)
from src.embedder import get_chroma_client, index_directory
from src.qa_chain import NOT_FOUND_RESPONSE, ask_codebase
from src.retriever import get_collection

st.set_page_config(
    page_title="CodeQuery: Codebase Q&A Assistant",
    page_icon="🔍",
    layout="wide",
)

# Initialize Session State
if "messages" not in st.session_state:
    st.session_state.messages = []
if "indexed_repo" not in st.session_state:
    st.session_state.indexed_repo = None
if "indexed_count" not in st.session_state:
    st.session_state.indexed_count = None
if "session_tokens" not in st.session_state:
    st.session_state.session_tokens = 0
if "session_cost" not in st.session_state:
    st.session_state.session_cost = 0.0
if "session_queries" not in st.session_state:
    st.session_state.session_queries = 0

# Sidebar Configuration
with st.sidebar:
    st.header("⚙️ Configuration")
    top_k = st.slider("Top-K Chunks", min_value=1, max_value=10, value=DEFAULT_TOP_K)
    threshold = st.slider(
        "Similarity Threshold",
        min_value=0.1,
        max_value=0.8,
        value=float(DEFAULT_SIMILARITY_THRESHOLD),
        step=0.05,
        help="Chunks with similarity score below this threshold are rejected to avoid hallucination.",
    )
    multi_query_toggle = st.checkbox(
        "Enable Multi-Query Retrieval",
        value=ENABLE_MULTI_QUERY,
        help="Generate 3-4 query variations for lookup queries to bridge vocabulary mismatches.",
    )
    st.markdown("---")
    st.subheader("📊 Session Usage & Cost")
    sidebar_metrics_box = st.container()

    def render_sidebar_metrics():
        with sidebar_metrics_box:
            m_col1, m_col2 = st.columns(2)
            m_col1.metric("Total Tokens", f"{st.session_state.session_tokens:,}")
            m_col2.metric("Total Cost", f"${st.session_state.session_cost:.5f}")
            st.caption(f"Queries answered this session: **{st.session_state.session_queries}**")

    render_sidebar_metrics()

    st.markdown("---")
    st.markdown(f"**Embedding Model:** `{EMBEDDING_MODEL}` (${MODEL_PRICING['text-embedding-3-small']['input_per_million']:.2f}/1M)")
    st.markdown(f"**LLM Model:** `{LLM_MODEL}` (${MODEL_PRICING['gpt-4o-mini']['input_per_million']:.2f} in / ${MODEL_PRICING['gpt-4o-mini']['output_per_million']:.2f} out)")
    st.markdown(f"**Vector Store:** ChromaDB (`{CHROMA_PERSIST_DIR}`)")

    if st.button("Clear Chat History", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

# Main Header
st.title("🔍 CodeQuery: Codebase Q&A Assistant")
st.markdown("Ask natural-language questions about any codebase with precise `file:line` citations.")

# Repository Indexing Section
st.subheader("1. Ingest & Index Codebase")
col1, col2 = st.columns([4, 1])

with col1:
    default_path = "sample_repos/small_repo"
    repo_input = st.text_input(
        "Codebase Directory Path",
        value=default_path,
        placeholder="e.g. sample_repos/small_repo or C:/path/to/repo",
    )

with col2:
    st.write("")  # spacing
    st.write("")
    index_clicked = st.button("Index Codebase", type="primary", use_container_width=True)

if index_clicked:
    target_path = Path(repo_input).resolve()
    if not target_path.exists() or not target_path.is_dir():
        st.error(f"Error: Directory '{target_path}' does not exist or is not a directory.")
    else:
        progress_bar = st.progress(0.0)
        status_box = st.empty()

        def on_progress(ratio: float, msg: str) -> None:
            progress_bar.progress(min(1.0, max(0.0, ratio)))
            status_box.caption(f"⏳ {msg}")

        try:
            count, collection = index_directory(
                root_dir=target_path,
                reset_collection=True,
                progress_callback=on_progress,
            )
            progress_bar.empty()
            status_box.empty()
            st.session_state.indexed_repo = str(target_path)
            st.session_state.indexed_count = count
            st.success(f"Successfully indexed {count} code chunks from `{target_path.name}` into ChromaDB!")
        except Exception as e:
            progress_bar.empty()
            status_box.empty()
            st.error(f"Failed to index repository: {e}")

if st.session_state.indexed_repo:
    st.info(f"📁 Active Repository: `{st.session_state.indexed_repo}` ({st.session_state.indexed_count} chunks indexed)")

st.markdown("---")

# Q&A Section
st.subheader("2. Ask Questions")

# Display previous conversation messages
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

        # Display Multi-Query variations if present
        if msg.get("query_variations"):
            with st.expander("🔀 Multi-Query Variations (Query Expansion)", expanded=False):
                st.markdown("Generated variations used for retrieval:")
                for var in msg["query_variations"]:
                    st.markdown(f"- `{var}`")

        # Display Sources section if available
        if msg.get("citations") or msg.get("sources"):
            with st.expander("📚 Sources & Citations", expanded=True):
                if msg.get("citations"):
                    st.markdown("**Citations:** " + ", ".join(f"`{c}`" for c in msg["citations"]))

                sources = msg.get("sources", [])
                for idx, src in enumerate(sources, 1):
                    src_lang = src.get("language", "python")
                    highlight_lang = "javascript" if src_lang in ("javascript", "jsx") else ("typescript" if src_lang in ("typescript", "tsx") else "python")
                    st.markdown(
                        f"**[{idx}] `{src['citation']}`** (Type: `{src.get('chunk_type', '')}`, "
                        f"Language: `{src_lang}`, Symbol: `{src.get('name') or '(none)'}`, Similarity Score: `{src.get('score', 0):.4f}`)"
                    )
                    st.code(src.get("code_text", ""), language=highlight_lang)

        # Display per-query Token Usage and Cost breakdown
        if msg.get("usage"):
            u = msg["usage"]
            qe_tokens = u.get("query_expansion_tokens", 0)
            qe_cost = u.get("query_expansion_cost", 0.0)
            emb_tokens = u.get("embedding_tokens", 0)
            emb_cost = u.get("embedding_cost", 0.0)
            ans_tokens = u.get("answer_tokens", 0)
            ans_cost = u.get("answer_cost", 0.0)

            if qe_tokens > 0:
                st.caption(
                    f"⚡ **Usage:** `{u['total_tokens']:,}` tokens • 💵 **Total Cost:** `${u['cost_usd']:.5f}`\n\n"
                    f"• **Query Expansion:** `{qe_tokens}` tokens (${qe_cost:.5f}) • "
                    f"**Embeddings:** `{emb_tokens}` tokens (${emb_cost:.5f}) • "
                    f"**Answer Generation:** `{ans_tokens}` tokens (${ans_cost:.5f})"
                )
            else:
                st.caption(
                    f"⚡ **Usage:** `{u['total_tokens']:,}` tokens • 💵 **Total Cost:** `${u['cost_usd']:.5f}`\n\n"
                    f"• **Embeddings:** `{emb_tokens}` tokens (${emb_cost:.5f}) • "
                    f"**Answer Generation:** `{ans_tokens}` tokens (${ans_cost:.5f})"
                )

# Chat input box
user_question = st.chat_input("Ask a question about the indexed codebase...")

if user_question:
    # Append user question
    st.session_state.messages.append({"role": "user", "content": user_question})

    with st.chat_message("user"):
        st.markdown(user_question)

    # Generate answer using Phase 3-4 pipeline
    with st.chat_message("assistant"):
        with st.spinner("Retrieving relevant code chunks and generating answer..."):
            try:
                response = ask_codebase(
                    question=user_question,
                    top_k=top_k,
                    similarity_threshold=threshold,
                    enable_multi_query=multi_query_toggle,
                )
                answer_text = response.answer
                citations = response.citations
                sources_data = [chunk.to_dict() for chunk in response.retrieved_chunks]
                query_variations = getattr(response, "query_variations", [])

                st.markdown(answer_text)

                if query_variations:
                    with st.expander("🔀 Multi-Query Variations (Query Expansion)", expanded=False):
                        st.markdown("Generated variations used for retrieval:")
                        for var in query_variations:
                            st.markdown(f"- `{var}`")

                if response.found and sources_data:
                    with st.expander("📚 Sources & Citations", expanded=True):
                        if citations:
                            st.markdown("**Citations:** " + ", ".join(f"`{c}`" for c in citations))

                        for idx, src in enumerate(sources_data, 1):
                            src_lang = src.get("language", "python")
                            highlight_lang = "javascript" if src_lang in ("javascript", "jsx") else ("typescript" if src_lang in ("typescript", "tsx") else "python")
                            st.markdown(
                                f"**[{idx}] `{src['citation']}`** (Type: `{src['chunk_type']}`, "
                                f"Language: `{src_lang}`, Symbol: `{src['name'] or '(none)'}`, Score: `{src['score']:.4f}`)"
                            )
                            st.code(src["code_text"], language=highlight_lang)

                # Extract tokens and cost breakdown defensively
                emb_usage = getattr(response, "embedding_usage", None)
                qe_usage = getattr(response, "query_expansion_usage", None)
                llm_usage = getattr(response, "llm_usage", None)

                emb_tokens = emb_usage.total_tokens if emb_usage else 0
                emb_cost = emb_usage.cost_usd if emb_usage else 0.0

                qe_tokens = qe_usage.total_tokens if qe_usage else 0
                qe_cost = qe_usage.cost_usd if qe_usage else 0.0

                prompt_tokens = llm_usage.prompt_tokens if llm_usage else 0
                comp_tokens = llm_usage.completion_tokens if llm_usage else 0
                ans_tokens = prompt_tokens + comp_tokens
                ans_cost = llm_usage.cost_usd if llm_usage else 0.0

                query_tokens = getattr(response, "total_tokens", emb_tokens + qe_tokens + ans_tokens)
                query_cost = getattr(response, "cost_usd", emb_cost + qe_cost + ans_cost)

                # Update running session totals
                st.session_state.session_tokens += query_tokens
                st.session_state.session_cost += query_cost
                st.session_state.session_queries += 1

                # Re-render sidebar metrics with new totals
                render_sidebar_metrics()

                usage_payload = {
                    "total_tokens": query_tokens,
                    "cost_usd": query_cost,
                    "embedding_tokens": emb_tokens,
                    "embedding_cost": emb_cost,
                    "query_expansion_tokens": qe_tokens,
                    "query_expansion_cost": qe_cost,
                    "prompt_tokens": prompt_tokens,
                    "completion_tokens": comp_tokens,
                    "answer_tokens": ans_tokens,
                    "answer_cost": ans_cost,
                }

                if qe_tokens > 0:
                    st.caption(
                        f"⚡ **Usage:** `{query_tokens:,}` tokens • 💵 **Total Cost:** `${query_cost:.5f}`\n\n"
                        f"• **Query Expansion:** `{qe_tokens}` tokens (${qe_cost:.5f}) • "
                        f"**Embeddings:** `{emb_tokens}` tokens (${emb_cost:.5f}) • "
                        f"**Answer Generation:** `{ans_tokens}` tokens (${ans_cost:.5f})"
                    )
                else:
                    st.caption(
                        f"⚡ **Usage:** `{query_tokens:,}` tokens • 💵 **Total Cost:** `${query_cost:.5f}`\n\n"
                        f"• **Embeddings:** `{emb_tokens}` tokens (${emb_cost:.5f}) • "
                        f"**Answer Generation:** `{ans_tokens}` tokens (${ans_cost:.5f})"
                    )

                # Save assistant response with usage to session state
                st.session_state.messages.append(
                    {
                        "role": "assistant",
                        "content": answer_text,
                        "citations": citations if response.found else [],
                        "sources": sources_data if response.found else [],
                        "query_variations": query_variations,
                        "usage": usage_payload,
                    }
                )

            except Exception as err:
                st.error(f"Error generating answer: {err}")

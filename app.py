"""CodeQuery Streamlit Application (Phase 5)."""
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
    LLM_MODEL,
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
    st.markdown("---")
    st.markdown(f"**Embedding Model:** `{EMBEDDING_MODEL}`")
    st.markdown(f"**LLM Model:** `{LLM_MODEL}`")
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
        with st.spinner(f"Ingesting and indexing '{target_path.name}' into ChromaDB..."):
            try:
                count, collection = index_directory(
                    root_dir=target_path,
                    reset_collection=True,
                )
                st.session_state.indexed_repo = str(target_path)
                st.session_state.indexed_count = count
                st.success(f"Successfully indexed {count} code chunks from `{target_path.name}` into ChromaDB!")
            except Exception as e:
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

        # Display Sources section if available
        if msg.get("citations") or msg.get("sources"):
            with st.expander("📚 Sources & Citations", expanded=True):
                if msg.get("citations"):
                    st.markdown("**Citations:** " + ", ".join(f"`{c}`" for c in msg["citations"]))

                sources = msg.get("sources", [])
                for idx, src in enumerate(sources, 1):
                    st.markdown(
                        f"**[{idx}] `{src['citation']}`** (Type: `{src.get('chunk_type', '')}`, "
                        f"Symbol: `{src.get('name') or '(none)'}`, Similarity Score: `{src.get('score', 0):.4f}`)"
                    )
                    st.code(src.get("code_text", ""), language="python")

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
                )
                answer_text = response.answer
                citations = response.citations
                sources_data = [chunk.to_dict() for chunk in response.retrieved_chunks]

                st.markdown(answer_text)

                if response.found and sources_data:
                    with st.expander("📚 Sources & Citations", expanded=True):
                        if citations:
                            st.markdown("**Citations:** " + ", ".join(f"`{c}`" for c in citations))

                        for idx, src in enumerate(sources_data, 1):
                            st.markdown(
                                f"**[{idx}] `{src['citation']}`** (Type: `{src['chunk_type']}`, "
                                f"Symbol: `{src['name'] or '(none)'}`, Score: `{src['score']:.4f}`)"
                            )
                            st.code(src["code_text"], language="python")

                # Save assistant response to session state
                st.session_state.messages.append(
                    {
                        "role": "assistant",
                        "content": answer_text,
                        "citations": citations if response.found else [],
                        "sources": sources_data if response.found else [],
                    }
                )

            except Exception as err:
                st.error(f"Error generating answer: {err}")

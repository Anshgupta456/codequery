"""Embedding generation and persistent ChromaDB storage (Phase 2)."""
import hashlib
import math
import os
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple

import chromadb
import dotenv
from openai import OpenAI

from src.chunker import CodeChunk, chunk_file
from src.config import (
    CHROMA_PERSIST_DIR,
    COLLECTION_NAME,
    EMBEDDING_MODEL,
)
from src.cost_tracker import TokenUsage, track_usage
from src.ingest import collect_files

# Ensure .env is loaded
dotenv.load_dotenv()


def get_chroma_client(persist_dir: Optional[str | Path] = None) -> chromadb.PersistentClient:
    """Initialize or get a persistent ChromaDB client."""
    path = Path(persist_dir or CHROMA_PERSIST_DIR).resolve()
    path.mkdir(parents=True, exist_ok=True)
    return chromadb.PersistentClient(path=str(path))


def get_or_create_collection(
    client: chromadb.PersistentClient,
    collection_name: str = COLLECTION_NAME,
    reset: bool = False,
) -> chromadb.Collection:
    """
    Get or create a ChromaDB collection configured for cosine similarity.
    If reset=True, any existing collection with that name will be deleted first.
    """
    if reset:
        try:
            client.delete_collection(name=collection_name)
        except Exception:
            pass

    return client.get_or_create_collection(
        name=collection_name,
        metadata={"hnsw:space": "cosine"},
    )


def generate_mock_embeddings(texts: List[str], dim: int = 1536) -> List[List[float]]:
    """
    Generate deterministic, normalized mock embeddings for offline testing/dry-runs.
    Uses SHA-256 hash of each text to generate reproducible float vectors of dimension dim.
    """
    embeddings: List[List[float]] = []
    for text in texts:
        # Deterministic pseudo-random vector based on text hash
        seed = hashlib.sha256(text.encode("utf-8")).digest()
        raw_vals: List[float] = []
        for i in range(dim):
            byte_val = seed[i % len(seed)]
            raw_vals.append((byte_val / 255.0) - 0.5)

        # L2-normalize
        norm = math.sqrt(sum(v * v for v in raw_vals)) or 1.0
        normalized = [v / norm for v in raw_vals]
        embeddings.append(normalized)
    return embeddings


def generate_embeddings(
    texts: List[str],
    client: Optional[OpenAI] = None,
    model: str = EMBEDDING_MODEL,
    batch_size: int = 100,
    use_mock: bool = False,
    return_usage: bool = False,
) -> Any:
    """
    Generate embeddings for a list of texts using OpenAI text-embedding-3-small
    (or deterministic mock embeddings if use_mock=True).
    If return_usage=True, returns (embeddings, TokenUsage).
    """
    if not texts:
        return ([], TokenUsage()) if return_usage else []

    total_usage = TokenUsage()
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    placeholder_keys = {"", "your-openai-api-key-here", "your_openai_api_key_here"}

    if use_mock or (api_key in placeholder_keys):
        if not use_mock and (api_key in placeholder_keys):
            # If no valid API key is available, warn and use mock embeddings for safety
            print("[Warning] No valid OPENAI_API_KEY found in .env; falling back to deterministic mock embeddings.")
        mock_embs = generate_mock_embeddings(texts)
        # Mock tokens: ~1 token per 4 characters
        mock_tokens = sum(max(1, len(t) // 4) for t in texts)
        mock_usage = TokenUsage(prompt_tokens=mock_tokens, total_tokens=mock_tokens, cost_usd=0.0)
        return (mock_embs, mock_usage) if return_usage else mock_embs

    if client is None:
        client = OpenAI(api_key=api_key)

    all_embeddings: List[List[float]] = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        response = client.embeddings.create(input=batch, model=model)
        for item in response.data:
            all_embeddings.append(item.embedding)

        if hasattr(response, "usage") and response.usage:
            batch_usage = track_usage(response.usage, model)
            total_usage = total_usage + batch_usage

    if return_usage:
        return all_embeddings, total_usage
    return all_embeddings


def store_chunks(
    chunks: List[CodeChunk],
    collection: chromadb.Collection,
    client: Optional[OpenAI] = None,
    batch_size: int = 100,
    use_mock: bool = False,
    progress_callback: Optional[Callable[[float, str], None]] = None,
) -> int:
    """
    Embed and upsert CodeChunks into a ChromaDB collection with all metadata attached.
    Returns the number of chunks stored.
    """
    if not chunks:
        return 0

    documents: List[str] = [chunk.code_text for chunk in chunks]
    ids: List[str] = []
    metadatas: List[Dict[str, Any]] = []

    for idx, chunk in enumerate(chunks):
        # Unique and deterministic chunk ID
        chunk_id = f"{chunk.file_path}:{chunk.start_line}-{chunk.end_line}:{idx}"
        ids.append(chunk_id)

        # ChromaDB requires primitive metadata values (strings, ints, floats, bools)
        metadata = {
            "file_path": chunk.file_path,
            "start_line": int(chunk.start_line),
            "end_line": int(chunk.end_line),
            "chunk_type": str(chunk.chunk_type),
            "name": str(chunk.name or ""),
            "language": str(getattr(chunk, "language", "python")),
        }
        metadatas.append(metadata)

    total_chunks = len(chunks)
    num_batches = math.ceil(total_chunks / batch_size)

    # Process and upsert in batches to avoid huge memory/API spikes
    for b_idx in range(num_batches):
        start_i = b_idx * batch_size
        end_i = min(start_i + batch_size, total_chunks)

        if progress_callback:
            ratio = 0.50 + 0.50 * (b_idx / max(1, num_batches))
            progress_callback(
                ratio,
                f"Embedding & indexing batch {b_idx + 1}/{num_batches} ({start_i + 1}-{end_i} of {total_chunks} chunks)...",
            )

        b_docs = documents[start_i:end_i]
        b_ids = ids[start_i:end_i]
        b_meta = metadatas[start_i:end_i]

        b_embs = generate_embeddings(
            texts=b_docs,
            client=client,
            batch_size=batch_size,
            use_mock=use_mock,
        )

        collection.upsert(
            ids=b_ids,
            documents=b_docs,
            embeddings=b_embs,
            metadatas=b_meta,
        )

    if progress_callback:
        progress_callback(1.0, f"Successfully indexed {total_chunks} chunks.")

    return len(chunks)


def index_directory(
    root_dir: str | Path,
    persist_dir: Optional[str | Path] = None,
    collection_name: str = COLLECTION_NAME,
    reset_collection: bool = False,
    use_mock: bool = False,
    progress_callback: Optional[Callable[[float, str], None]] = None,
) -> Tuple[int, chromadb.Collection]:
    """
    Run end-to-end ingestion -> chunking -> embedding -> ChromaDB storage on root_dir.
    Returns (total_chunks_stored, collection).
    """
    root_path = Path(root_dir).resolve()
    if progress_callback:
        progress_callback(0.02, "Scanning repository files...")

    files = collect_files(root_path)
    total_files = len(files)

    if progress_callback:
        progress_callback(0.05, f"Found {total_files} code files. Starting syntax chunking...")

    all_chunks: List[CodeChunk] = []
    for idx, file_path in enumerate(files):
        file_chunks = chunk_file(file_path, repo_root=root_path)
        all_chunks.extend(file_chunks)

        if progress_callback and (idx % 5 == 0 or idx == total_files - 1):
            ratio = 0.05 + 0.45 * ((idx + 1) / max(1, total_files))
            progress_callback(
                ratio,
                f"Chunking file {idx + 1}/{total_files} ({file_path.name}) - {len(all_chunks)} chunks parsed...",
            )

    if progress_callback:
        progress_callback(0.50, f"Initializing vector store for {len(all_chunks)} chunks...")

    chroma_client = get_chroma_client(persist_dir)
    collection = get_or_create_collection(
        chroma_client,
        collection_name=collection_name,
        reset=reset_collection,
    )

    stored_count = store_chunks(
        chunks=all_chunks,
        collection=collection,
        use_mock=use_mock,
        progress_callback=progress_callback,
    )

    return stored_count, collection

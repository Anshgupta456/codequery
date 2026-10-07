"""Unit tests for embedding generation and ChromaDB storage (Phase 2)."""
import math
from pathlib import Path
import pytest

from src.chunker import CodeChunk
from src.embedder import (
    generate_mock_embeddings,
    get_chroma_client,
    get_or_create_collection,
    index_directory,
    store_chunks,
)

SAMPLE_DIR = Path(__file__).parent.parent / "sample_repos" / "small_repo"


def test_mock_embeddings_properties():
    """Verify mock embeddings have correct dimension, normalization, and determinism."""
    texts = ["def foo(): pass", "class Bar: pass"]
    embs = generate_mock_embeddings(texts, dim=1536)

    assert len(embs) == 2
    assert len(embs[0]) == 1536
    assert len(embs[1]) == 1536

    # Verify L2 normalization (~1.0)
    norm0 = math.sqrt(sum(x * x for x in embs[0]))
    norm1 = math.sqrt(sum(x * x for x in embs[1]))
    assert abs(norm0 - 1.0) < 1e-4
    assert abs(norm1 - 1.0) < 1e-4

    # Verify determinism
    embs_again = generate_mock_embeddings(texts, dim=1536)
    assert embs[0] == embs_again[0]


def test_store_chunks_and_metadata_in_chroma(tmp_path):
    """Verify chunks and all specified metadata fields are correctly stored in Chroma."""
    client = get_chroma_client(tmp_path)
    collection = get_or_create_collection(client, "test_collection", reset=True)

    chunks = [
        CodeChunk(
            file_path="auth.py",
            start_line=1,
            end_line=10,
            chunk_type="function",
            code_text="def login():\n    return True",
            name="login",
        ),
        CodeChunk(
            file_path="models.py",
            start_line=5,
            end_line=20,
            chunk_type="class",
            code_text="class User:\n    pass",
            name="User",
        ),
    ]

    stored_count = store_chunks(chunks, collection, use_mock=True)
    assert stored_count == 2

    # Verify stored records
    res = collection.get(include=["metadatas", "documents"])
    assert len(res["ids"]) == 2
    assert len(res["metadatas"]) == 2
    assert len(res["documents"]) == 2

    meta0 = res["metadatas"][0]
    assert "file_path" in meta0
    assert "start_line" in meta0
    assert "end_line" in meta0
    assert "chunk_type" in meta0
    assert "name" in meta0


def test_index_directory_end_to_end(tmp_path):
    """Verify end-to-end ingestion -> chunking -> embedding on small_repo."""
    count, collection = index_directory(
        root_dir=SAMPLE_DIR,
        persist_dir=tmp_path,
        collection_name="test_small_repo",
        reset_collection=True,
        use_mock=True,
    )

    assert count > 0

    # Verify collection can be retrieved
    res = collection.get()
    assert len(res["ids"]) == count

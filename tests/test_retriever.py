"""Unit and integration tests for similarity search and retrieval (Phase 3)."""
from pathlib import Path
import pytest

from src.config import DEFAULT_TOP_K
from src.embedder import get_chroma_client, get_or_create_collection, index_directory
from src.retriever import RetrievedChunk, retrieve_chunks

SAMPLE_DIR = Path(__file__).parent.parent / "sample_repos" / "small_repo"


@pytest.fixture(scope="module")
def indexed_test_collection(tmp_path_factory):
    """Fixture that indexes sample repo into a temporary ChromaDB directory."""
    persist_dir = tmp_path_factory.mktemp("test_chroma_retrieval")
    count, collection = index_directory(
        root_dir=SAMPLE_DIR,
        persist_dir=persist_dir,
        collection_name="test_retrieval_collection",
        reset_collection=True,
        use_mock=True,
    )
    return collection


def test_empty_query_returns_empty(indexed_test_collection):
    """Verify empty or whitespace-only queries return an empty list."""
    assert retrieve_chunks("", collection=indexed_test_collection, use_mock=True) == []
    assert retrieve_chunks("   ", collection=indexed_test_collection, use_mock=True) == []


def test_retrieve_chunks_respects_top_k(indexed_test_collection):
    """Verify retriever respects the top_k parameter."""
    results_2 = retrieve_chunks(
        "user password authentication",
        collection=indexed_test_collection,
        top_k=2,
        use_mock=True,
    )
    assert len(results_2) == 2

    results_4 = retrieve_chunks(
        "user password authentication",
        collection=indexed_test_collection,
        top_k=4,
        use_mock=True,
    )
    assert len(results_4) == 4


def test_retrieved_chunk_fields_and_citation(indexed_test_collection):
    """Verify retrieved chunk objects have all required metadata, score, and citation."""
    results = retrieve_chunks(
        "process payment transaction",
        collection=indexed_test_collection,
        top_k=3,
        use_mock=True,
    )
    assert len(results) > 0

    chunk = results[0]
    assert isinstance(chunk, RetrievedChunk)
    assert isinstance(chunk.file_path, str)
    assert isinstance(chunk.start_line, int)
    assert isinstance(chunk.end_line, int)
    assert chunk.start_line <= chunk.end_line
    assert isinstance(chunk.score, float)
    assert isinstance(chunk.distance, float)
    assert chunk.citation == f"{chunk.file_path}:{chunk.start_line}-{chunk.end_line}"

    d = chunk.to_dict()
    assert "citation" in d
    assert "score" in d
    assert "distance" in d
    assert "file_path" in d
    assert "start_line" in d
    assert "end_line" in d


def test_retriever_min_score_threshold(indexed_test_collection):
    """Verify min_score filters out chunks below the threshold."""
    # With very high threshold, low-matching chunks should be filtered
    results_high_thresh = retrieve_chunks(
        "random query",
        collection=indexed_test_collection,
        top_k=5,
        min_score=0.9999,
        use_mock=True,
    )
    assert len(results_high_thresh) == 0


def test_classify_question_lookup_vs_exhaustive():
    """Verify classify_question distinguishes lookup queries from exhaustive inventory queries."""
    from src.retriever import classify_question

    assert classify_question("Where is user authentication handled?") == "lookup"
    assert classify_question("What does process_payment do?") == "lookup"
    assert classify_question("where is authentication checked") == "lookup"

    assert classify_question("Which files import the database module?") == "exhaustive"
    assert classify_question("List all API routes and endpoints") == "exhaustive"
    assert classify_question("Find all occurrences of secret key") == "exhaustive"
    assert classify_question("every function that returns a user") == "exhaustive"


def test_generate_query_variations_mock():
    """Verify generate_query_variations produces 3-4 variations and tracks usage in mock mode."""
    from src.retriever import generate_query_variations

    variations, usage = generate_query_variations(
        "where is user authentication checked",
        use_mock=True,
        return_usage=True,
    )

    assert len(variations) >= 3
    assert all(isinstance(v, str) and len(v) > 0 for v in variations)
    assert usage.total_tokens > 0


def test_retrieve_chunks_with_multi_query(indexed_test_collection):
    """Verify multi-query merges, deduplicates by chunk_id, and re-ranks by best score."""
    retrieved, emb_usage, qe_usage, variations = retrieve_chunks(
        query="where is user authentication checked",
        collection=indexed_test_collection,
        top_k=3,
        use_mock=True,
        enable_multi_query=True,
        return_usage=True,
        return_details=True,
        question_type="lookup",
    )

    assert len(retrieved) <= 3
    assert len(variations) >= 3
    assert qe_usage.total_tokens > 0
    assert emb_usage.total_tokens > 0

    # Ensure deduplicated chunk_ids
    chunk_ids = [c.chunk_id for c in retrieved]
    assert len(chunk_ids) == len(set(chunk_ids))

    # Ensure sorted in descending order of similarity score
    scores = [c.score for c in retrieved]
    assert scores == sorted(scores, reverse=True)


def test_exhaustive_path_skips_multi_query(indexed_test_collection):
    """Verify exhaustive question path skips query expansion to save cost."""
    retrieved, emb_usage, qe_usage, variations = retrieve_chunks(
        query="Which files import the database module?",
        collection=indexed_test_collection,
        top_k=3,
        use_mock=True,
        enable_multi_query=True,
        return_usage=True,
        return_details=True,
    )

    # Multi-query should be bypassed for exhaustive query
    assert len(variations) == 0
    assert qe_usage.total_tokens == 0
    assert emb_usage.total_tokens > 0


def test_toggle_multi_query_off(indexed_test_collection):
    """Verify setting enable_multi_query=False disables query expansion even for lookup."""
    retrieved, emb_usage, qe_usage, variations = retrieve_chunks(
        query="where is user authentication checked",
        collection=indexed_test_collection,
        top_k=3,
        use_mock=True,
        enable_multi_query=False,
        return_usage=True,
        return_details=True,
        question_type="lookup",
    )

    assert len(variations) == 0
    assert qe_usage.total_tokens == 0

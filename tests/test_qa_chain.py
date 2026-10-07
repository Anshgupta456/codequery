"""Unit and integration tests for grounded QA generation (Phase 4)."""
from pathlib import Path
import pytest

from src.embedder import index_directory
from src.qa_chain import (
    NOT_FOUND_RESPONSE,
    ask_codebase,
    extract_citations,
    format_context,
    generate_answer,
)
from src.retriever import RetrievedChunk

SAMPLE_DIR = Path(__file__).parent.parent / "sample_repos" / "small_repo"


@pytest.fixture(scope="module")
def indexed_collection(tmp_path_factory):
    """Index sample repo into temporary ChromaDB collection."""
    persist_dir = tmp_path_factory.mktemp("chroma_qa_tests")
    count, collection = index_directory(
        root_dir=SAMPLE_DIR,
        persist_dir=persist_dir,
        collection_name="qa_test_collection",
        reset_collection=True,
    )
    return collection


def test_extract_citations():
    """Verify regex correctly parses file:line citations from text."""
    text = "Authentication is in `auth.py:19-34` and uses `auth.py:8-11` for hashing."
    cites = extract_citations(text)
    assert "auth.py:19-34" in cites
    assert "auth.py:8-11" in cites


def test_format_context():
    """Verify retrieved chunks are formatted with clear citation headers."""
    chunks = [
        RetrievedChunk(
            chunk_id="c1",
            code_text="def test(): pass",
            file_path="test.py",
            start_line=1,
            end_line=2,
            chunk_type="function",
            name="test",
            score=0.8,
            distance=0.2,
        )
    ]
    formatted = format_context(chunks)
    assert "test.py:1-2" in formatted
    assert "def test(): pass" in formatted


# --- 3 Required "NOT FOUND" Cases to Confirm No Hallucination ---

def test_not_found_case_1_unrelated_domain(indexed_collection):
    """Case 1: Query about machine learning training (does not exist in repo)."""
    question = "Where is the deep learning neural network training loop defined?"
    response = ask_codebase(question, collection=indexed_collection)

    assert response.found is False
    assert NOT_FOUND_RESPONSE in response.answer


def test_not_found_case_2_missing_feature(indexed_collection):
    """Case 2: Query about OAuth2 Google sign-in (does not exist in repo)."""
    question = "Where is the Google OAuth2 social login authentication implemented?"
    response = ask_codebase(question, collection=indexed_collection)

    assert response.found is False
    assert NOT_FOUND_RESPONSE in response.answer


def test_not_found_case_3_nonexistent_function(indexed_collection):
    """Case 3: Query about calculate_shipping_tax function (does not exist in repo)."""
    question = "What does the calculate_shipping_tax function do?"
    response = ask_codebase(question, collection=indexed_collection)

    assert response.found is False
    assert NOT_FOUND_RESPONSE in response.answer


def test_llm_refusal_when_context_is_irrelevant():
    """
    Direct LLM test: Pass irrelevant chunks to generate_answer and confirm
    the LLM refuses from system prompt instructions rather than hallucinating.
    """
    irrelevant_chunk = RetrievedChunk(
        chunk_id="c1",
        code_text="def format_currency(amount: float) -> str:\n    return f'${amount:.2f}'",
        file_path="utils.py",
        start_line=5,
        end_line=7,
        chunk_type="function",
        name="format_currency",
        score=0.35,
        distance=0.65,
    )
    question = "How is user password encryption performed with bcrypt?"
    answer = generate_answer(question, chunks=[irrelevant_chunk])

    assert NOT_FOUND_RESPONSE in answer


# --- Grounded Positive Cases with Citations ---

def test_grounded_answer_with_citations_payment(indexed_collection):
    """Verify model answers process_payment question with exact file:line citations."""
    question = "What does the process_payment function do?"
    response = ask_codebase(question, collection=indexed_collection)

    assert response.found is True
    assert len(response.citations) > 0
    # Must cite payments.py
    assert any("payments.py" in cite for cite in response.citations)
    # Explanation must reference amount or transaction
    assert any(term in response.answer.lower() for term in ["amount", "transaction", "payment"])


def test_grounded_answer_with_citations_auth(indexed_collection):
    """Verify model answers password hashing question with exact file:line citations."""
    question = "How is password hashing implemented?"
    response = ask_codebase(question, collection=indexed_collection)

    assert response.found is True
    assert len(response.citations) > 0
    # Must cite auth.py:8-11
    assert any("auth.py" in cite for cite in response.citations)
    assert any(term in response.answer.lower() for term in ["sha-256", "sha256", "salt", "secret_key"])

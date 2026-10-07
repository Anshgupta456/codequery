"""Benchmark retrieval + answer latency and evaluate edge cases on small and large repos."""
import json
import sys
import time
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.qa_chain import ask_codebase
from src.retriever import get_collection, retrieve_chunks
from src.config import DEFAULT_SIMILARITY_THRESHOLD, DEFAULT_TOP_K


BENCHMARK_CASES = [
    # --- Small Repo Test Cases ---
    {
        "repo": "small_repo (4 files, 20 chunks)",
        "collection": "small_repo_collection",
        "category": "Non-existent Functionality",
        "question": "Where is the machine learning neural network training loop implemented?",
        "expected_behavior": "Refusal: 'I couldn't find this in the codebase.'",
    },
    {
        "repo": "small_repo (4 files, 20 chunks)",
        "collection": "small_repo_collection",
        "category": "Non-existent Functionality",
        "question": "How does the system send password reset verification emails via SMTP?",
        "expected_behavior": "Refusal: 'I couldn't find this in the codebase.'",
    },
    {
        "repo": "small_repo (4 files, 20 chunks)",
        "category": "Vague / Ambiguous Question",
        "collection": "small_repo_collection",
        "question": "How does the code handle passwords and security?",
        "expected_behavior": "Grounded answer citing auth.py:8-16 (hash_password, verify_password)",
    },
    {
        "repo": "small_repo (4 files, 20 chunks)",
        "collection": "small_repo_collection",
        "category": "Multi-file Interaction",
        "question": "How does user logout in AuthService interact with DatabaseClient session invalidation?",
        "expected_behavior": "Multi-file citations: auth.py:32-34 and database.py:17-22",
    },

    # --- Large Repo Test Cases ---
    {
        "repo": "large_repo (167 files, 923 chunks)",
        "collection": "large_repo_collection",
        "category": "Non-existent Functionality",
        "question": "Where is the cryptocurrency payment processing gateway with Ethereum or Bitcoin implemented?",
        "expected_behavior": "Refusal: 'I couldn't find this in the codebase.'",
    },
    {
        "repo": "large_repo (167 files, 923 chunks)",
        "collection": "large_repo_collection",
        "category": "Vague / Ambiguous Question",
        "question": "What do the handler components in this system do?",
        "expected_behavior": "General summary grounded in subsystem handlers and process_* methods",
    },
    {
        "repo": "large_repo (167 files, 923 chunks)",
        "collection": "large_repo_collection",
        "category": "Multi-file Interaction",
        "question": "How does CheckoutService coordinate user authentication and billing payment?",
        "expected_behavior": "Multi-file citations: services/checkout_service.py, auth_handler_1.py, billing_handler_1.py",
    },
    {
        "repo": "large_repo (167 files, 923 chunks)",
        "collection": "large_repo_collection",
        "category": "Multi-file Interaction",
        "question": "How does the AuditPipeline record security events using SecurityHandler?",
        "expected_behavior": "Multi-file citations: analytics/audit_pipeline.py and security_handler_1.py",
    },
]


def run_benchmark():
    results = []

    print("=" * 80)
    print("CodeQuery Latency & Edge Cases Benchmark (Phase 6)")
    print("=" * 80)

    for case in BENCHMARK_CASES:
        repo_name = case["repo"]
        col_name = case["collection"]
        cat = case["category"]
        q = case["question"]

        print(f"\nTarget: [{repo_name}] | Category: [{cat}]")
        print(f"Question: \"{q}\"")

        collection = get_collection(collection_name=col_name)

        # 1. Measure Retrieval Latency
        t0 = time.perf_counter()
        retrieved = retrieve_chunks(query=q, collection=collection, top_k=DEFAULT_TOP_K)
        t1 = time.perf_counter()
        retrieval_ms = (t1 - t0) * 1000

        # 2. Measure Full Pipeline Latency (Retrieval + Thresholding + LLM)
        t_start = time.perf_counter()
        qa_resp = ask_codebase(
            question=q,
            collection=collection,
            top_k=DEFAULT_TOP_K,
            similarity_threshold=DEFAULT_SIMILARITY_THRESHOLD,
        )
        t_end = time.perf_counter()
        total_ms = (t_end - t_start) * 1000
        answer_ms = max(0.0, total_ms - retrieval_ms) if qa_resp.found else 0.0

        top_score = retrieved[0].score if retrieved else 0.0

        result_item = {
            "repo": repo_name,
            "category": cat,
            "question": q,
            "found": qa_resp.found,
            "expected_behavior": case["expected_behavior"],
            "top_score": round(top_score, 4),
            "citations": qa_resp.citations,
            "retrieval_ms": round(retrieval_ms, 1),
            "answer_ms": round(answer_ms, 1),
            "total_ms": round(total_ms, 1),
            "answer_text": qa_resp.answer.strip(),
        }
        results.append(result_item)

        print(f"  Result:      {'FOUND' if qa_resp.found else 'REFUSED (NOT FOUND)'}")
        print(f"  Top Score:   {top_score:.4f} (Threshold: {DEFAULT_SIMILARITY_THRESHOLD})")
        print(f"  Citations:   {qa_resp.citations}")
        print(f"  Latency:     Retrieval={retrieval_ms:.1f}ms | Answer={answer_ms:.1f}ms | Total={total_ms:.1f}ms")
        print(f"  Snippet:     {qa_resp.answer[:160].replace(chr(10), ' ')}...")

    # Save to json file
    summary_path = Path("benchmark_results.json")
    summary_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"\n[Saved benchmark summary to {summary_path}]")
    return results


if __name__ == "__main__":
    run_benchmark()

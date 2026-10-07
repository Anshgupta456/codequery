"""Script to run ingestion -> chunking -> embedding end-to-end on a target repository."""
import argparse
import json
import sys
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.embedder import index_directory
from src.config import CHROMA_PERSIST_DIR, COLLECTION_NAME


def main():
    parser = argparse.ArgumentParser(description="Index a repository into ChromaDB.")
    parser.add_argument(
        "--repo",
        type=str,
        default="sample_repos/small_repo",
        help="Path to repository folder to index (default: sample_repos/small_repo)",
    )
    parser.add_argument(
        "--persist-dir",
        type=str,
        default=str(CHROMA_PERSIST_DIR),
        help=f"Path to ChromaDB persistence directory (default: {CHROMA_PERSIST_DIR})",
    )
    parser.add_argument(
        "--collection",
        type=str,
        default=COLLECTION_NAME,
        help=f"Collection name (default: {COLLECTION_NAME})",
    )
    parser.add_argument(
        "--mock",
        action="store_true",
        help="Force use of deterministic mock embeddings (useful for offline testing)",
    )

    args = parser.parse_args()
    repo_path = Path(args.repo).resolve()

    print(f"==================================================")
    print(f"CodeQuery End-to-End Indexing")
    print(f"Target repository: {repo_path}")
    print(f"Chroma directory:  {args.persist_dir}")
    print(f"Collection:        {args.collection}")
    print(f"==================================================")

    # Run end-to-end indexing (reset existing collection for clean run)
    count, collection = index_directory(
        root_dir=repo_path,
        persist_dir=args.persist_dir,
        collection_name=args.collection,
        reset_collection=True,
        use_mock=args.mock,
    )

    print(f"\n[Success] Stored {count} chunks in ChromaDB collection '{args.collection}'.\n")

    # Fetch and inspect 3 sample records from Chroma
    print("--------------------------------------------------")
    print("Sample Stored Records from ChromaDB:")
    print("--------------------------------------------------")

    sample_results = collection.get(
        limit=3,
        include=["metadatas", "documents"],
    )

    ids = sample_results["ids"]
    docs = sample_results["documents"]
    metas = sample_results["metadatas"]

    for idx, (doc_id, doc_text, meta) in enumerate(zip(ids, docs, metas), 1):
        print(f"\n--- Record #{idx} ---")
        print(f"ID:        {doc_id}")
        print(f"Metadata:  {json.dumps(meta, indent=2)}")
        print(f"Code Text (truncated):\n{doc_text[:200]}...")


if __name__ == "__main__":
    main()

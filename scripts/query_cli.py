"""Interactive manual-test script for Phase 3 retrieval inspection."""
import argparse
import sys
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.config import CHROMA_PERSIST_DIR, COLLECTION_NAME, DEFAULT_TOP_K
from src.retriever import get_collection, retrieve_chunks


def display_results(query: str, results: list):
    """Pretty-print retrieved chunks with scores and citations."""
    print("\n" + "=" * 70)
    print(f"QUERY: {query}")
    print(f"Retrieved {len(results)} chunk(s):")
    print("=" * 70)

    if not results:
        print("  [No matching chunks found]")
        return

    for idx, chunk in enumerate(results, 1):
        print(f"\n[{idx}] Citation: {chunk.citation}  |  Type: {chunk.chunk_type}  |  Symbol: {chunk.name or '(none)'}")
        print(f"    Similarity Score: {chunk.score:.4f}  (Distance: {chunk.distance:.4f})")
        print("    " + "-" * 60)
        # Indent code snippet for readability
        snippet_lines = chunk.code_text.splitlines()
        preview = "\n".join(f"      | {line}" for line in snippet_lines[:12])
        if len(snippet_lines) > 12:
            preview += f"\n      | ... [{len(snippet_lines) - 12} more lines]"
        print(preview)


def main():
    parser = argparse.ArgumentParser(description="Test CodeQuery retrieval against ChromaDB.")
    parser.add_argument(
        "query",
        nargs="?",
        default=None,
        help="Natural language question (if omitted, interactive mode is started).",
    )
    parser.add_argument(
        "--k",
        type=int,
        default=DEFAULT_TOP_K,
        help=f"Number of chunks to retrieve (default: {DEFAULT_TOP_K})",
    )
    parser.add_argument(
        "--persist-dir",
        type=str,
        default=str(CHROMA_PERSIST_DIR),
        help=f"Path to ChromaDB directory (default: {CHROMA_PERSIST_DIR})",
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
        help="Use mock embeddings instead of OpenAI",
    )

    args = parser.parse_args()

    collection = get_collection(persist_dir=args.persist_dir, collection_name=args.collection)

    # If single query provided via command line argument
    if args.query:
        results = retrieve_chunks(
            query=args.query,
            collection=collection,
            top_k=args.k,
            use_mock=args.mock,
        )
        display_results(args.query, results)
        return

    # Otherwise enter interactive loop
    print("=" * 70)
    print("CodeQuery Interactive Retrieval CLI (Phase 3)")
    print(f"Connected to collection: '{args.collection}' (top-k={args.k})")
    print("Type your question and press Enter. Type 'q' or 'exit' to quit.")
    print("=" * 70)

    while True:
        try:
            user_input = input("\nAsk question > ").strip()
            if not user_input:
                continue
            if user_input.lower() in {"q", "exit", "quit"}:
                print("Exiting.")
                break

            results = retrieve_chunks(
                query=user_input,
                collection=collection,
                top_k=args.k,
                use_mock=args.mock,
            )
            display_results(user_input, results)

        except (KeyboardInterrupt, EOFError):
            print("\nExiting.")
            break


if __name__ == "__main__":
    main()

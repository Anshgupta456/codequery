# CodeQuery: RAG-based Codebase Q&A Assistant

CodeQuery is a Retrieval-Augmented Generation (RAG) tool that lets a developer ask natural-language questions about any codebase and get answers with precise file and line citations.

## Project Structure
- `src/ingest.py`: File ingestion and filtering logic
- `src/chunker.py`: Syntax-aware code chunking (AST-based)
- `src/embedder.py`: Embedding generation and ChromaDB persistence
- `src/retriever.py`: Similarity search logic
- `src/qa_chain.py`: Grounded LLM answer generation with citations
- `src/config.py`: Configuration constants
- `app.py`: Streamlit user interface
- `tests/`: Automated unit and integration test suite
- `sample_repos/`: Sample repositories for evaluation and testing

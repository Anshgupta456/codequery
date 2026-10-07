"""Configuration constants for CodeQuery."""
from pathlib import Path

# Directories and files to ignore during file ingestion
IGNORED_DIRS = {
    "node_modules",
    ".git",
    "venv",
    ".venv",
    "__pycache__",
    "dist",
    "build",
    ".pytest_cache",
    ".chroma",
    "chroma_data",
    ".idea",
    ".vscode",
    ".eggs",
}

# File extensions and patterns to ignore
IGNORED_EXTENSIONS = {
    ".pyc",
    ".pyo",
    ".pyd",
    ".so",
    ".dll",
    ".exe",
    ".bin",
    ".lock",
    ".min.js",
    ".min.css",
}

IGNORED_FILENAMES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "poetry.lock",
    "Pipfile.lock",
}

# Supported file extensions for ingestion (starting with Python)
SUPPORTED_EXTENSIONS = {
    ".py",
}

# Embedding & LLM Models
EMBEDDING_MODEL = "text-embedding-3-small"
LLM_MODEL = "gpt-4o-mini"

# Retrieval parameters
DEFAULT_TOP_K = 5
DEFAULT_SIMILARITY_THRESHOLD = 0.5  # Cosine distance or similarity threshold

# Persistent Chroma store directory
CHROMA_PERSIST_DIR = Path("./chroma_data")
COLLECTION_NAME = "codequery_collection"

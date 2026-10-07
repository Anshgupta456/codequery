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
    ".next",
    "coverage",
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

# Supported file extensions for ingestion (Python + JS/TS MERN)
SUPPORTED_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
}

EXTENSION_TO_LANGUAGE = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "jsx",
    ".ts": "typescript",
    ".tsx": "tsx",
}

# Embedding & LLM Models
EMBEDDING_MODEL = "text-embedding-3-small"
LLM_MODEL = "gpt-4o-mini"

# Retrieval parameters
DEFAULT_TOP_K = 5
DEFAULT_SIMILARITY_THRESHOLD = 0.30  # Cosine similarity threshold (score = 1.0 - distance)

# Persistent Chroma store directory
CHROMA_PERSIST_DIR = Path("./chroma_data")
COLLECTION_NAME = "codequery_collection"

# Model Pricing in USD per 1,000,000 tokens
MODEL_PRICING = {
    "gpt-4o-mini": {
        "input_per_million": 0.15,
        "output_per_million": 0.60,
    },
    "text-embedding-3-small": {
        "input_per_million": 0.02,
        "output_per_million": 0.00,
    },
}

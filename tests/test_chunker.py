"""Unit tests for AST chunking and file ingestion (Phase 1)."""
from pathlib import Path
import pytest

from src.chunker import (
    CodeChunk,
    chunk_file,
    chunk_line_based,
    chunk_python_code,
)
from src.ingest import collect_files, is_binary_file, is_ignored_file


SAMPLE_DIR = Path(__file__).parent.parent / "sample_repos" / "sample_project"
AUTH_FILE = SAMPLE_DIR / "auth.py"
PAYMENTS_FILE = SAMPLE_DIR / "payments.py"


def test_collect_files_filters_ignored():
    """Verify file ingestion collects valid .py files and skips ignored dirs/files."""
    files = collect_files(SAMPLE_DIR)
    filenames = [f.name for f in files]

    # Valid files must be included
    assert "auth.py" in filenames
    assert "payments.py" in filenames
    assert "database.py" in filenames

    # Ignored files and dirs must NOT be included
    assert "index.py" not in filenames  # inside node_modules
    assert "lib.py" not in filenames    # inside venv
    assert "package-lock.json" not in filenames


def test_chunk_boundaries_on_sample_auth_file():
    """Verify chunk boundaries are exact on sample auth.py."""
    chunks = chunk_file(AUTH_FILE, repo_root=SAMPLE_DIR)

    # Required metadata fields on every chunk
    for chunk in chunks:
        assert isinstance(chunk.file_path, str)
        assert isinstance(chunk.start_line, int)
        assert isinstance(chunk.end_line, int)
        assert chunk.start_line <= chunk.end_line
        assert chunk.chunk_type in {"function", "class", "module"}
        assert len(chunk.code_text.strip()) > 0

    # Check specific chunks and boundaries
    # 1. Module preamble: lines 1-5 (docstring, imports, SECRET_KEY)
    mod_chunk = chunks[0]
    assert mod_chunk.chunk_type == "module"
    assert mod_chunk.start_line == 1
    assert mod_chunk.end_line == 5
    assert "SECRET_KEY" in mod_chunk.code_text

    # 2. Top-level function hash_password: lines 8-10
    fn_chunk = chunks[1]
    assert fn_chunk.chunk_type == "function"
    assert fn_chunk.name == "hash_password"
    assert fn_chunk.start_line == 8
    assert fn_chunk.end_line == 10
    assert "def hash_password(password: str) -> str:" in fn_chunk.code_text

    # 3. Class AuthService: lines 13-26
    cls_chunk = chunks[2]
    assert cls_chunk.chunk_type == "class"
    assert cls_chunk.name == "AuthService"
    assert cls_chunk.start_line == 13
    assert cls_chunk.end_line == 26
    assert "class AuthService:" in cls_chunk.code_text

    # 4. Method AuthService.__init__: lines 16-17
    init_chunk = chunks[3]
    assert init_chunk.chunk_type == "function"
    assert init_chunk.name == "AuthService.__init__"
    assert init_chunk.start_line == 16
    assert init_chunk.end_line == 17

    # 5. Method AuthService.login: lines 19-22
    login_chunk = chunks[4]
    assert login_chunk.chunk_type == "function"
    assert login_chunk.name == "AuthService.login"
    assert login_chunk.start_line == 19
    assert login_chunk.end_line == 22

    # 6. Method AuthService.logout: lines 24-26
    logout_chunk = chunks[5]
    assert logout_chunk.chunk_type == "function"
    assert logout_chunk.name == "AuthService.logout"
    assert logout_chunk.start_line == 24
    assert logout_chunk.end_line == 26


def test_chunk_metadata_to_dict():
    """Verify chunk metadata dict contains the exact specified fields."""
    chunk = CodeChunk(
        file_path="src/utils.py",
        start_line=10,
        end_line=25,
        chunk_type="function",
        code_text="def test():\n    pass",
        name="test",
    )
    d = chunk.to_dict()
    assert d["file_path"] == "src/utils.py"
    assert d["start_line"] == 10
    assert d["end_line"] == 25
    assert d["chunk_type"] == "function"
    assert d["code_text"] == "def test():\n    pass"


def test_decorated_functions_and_classes():
    """Verify decorated functions and classes start at their decorator line."""
    code = (
        "@decorator_one\n"
        "@decorator_two\n"
        "def decorated_fn(x: int) -> int:\n"
        "    return x * 2\n"
        "\n"
        "@dataclass\n"
        "class ConfigItem:\n"
        "    name: str\n"
        "    value: int\n"
    )
    chunks = chunk_python_code(code, "test_decorated.py")

    fn_chunk = next(c for c in chunks if c.chunk_type == "function")
    assert fn_chunk.start_line == 1
    assert fn_chunk.end_line == 4
    assert "@decorator_one" in fn_chunk.code_text

    cls_chunk = next(c for c in chunks if c.chunk_type == "class")
    assert cls_chunk.start_line == 6
    assert cls_chunk.end_line == 9
    assert "@dataclass" in cls_chunk.code_text


def test_async_functions():
    """Verify async functions are parsed and assigned chunk_type='function'."""
    code = (
        "async def fetch_user(user_id: int):\n"
        "    return {'id': user_id}\n"
    )
    chunks = chunk_python_code(code, "test_async.py")
    assert len(chunks) == 1
    assert chunks[0].chunk_type == "function"
    assert chunks[0].start_line == 1
    assert chunks[0].end_line == 2
    assert "async def fetch_user" in chunks[0].code_text


def test_nested_classes_and_methods():
    """Verify nested classes and their methods are extracted with correct prefixes."""
    code = (
        "class Outer:\n"
        "    class Inner:\n"
        "        def inner_method(self):\n"
        "            return 42\n"
    )
    chunks = chunk_python_code(code, "nested.py")
    names = [c.name for c in chunks]
    assert "Outer" in names
    assert "Outer.Inner" in names
    assert "Outer.Inner.inner_method" in names


def test_module_only_file():
    """Verify files without functions/classes produce a module chunk."""
    code = (
        "HOST = '127.0.0.1'\n"
        "PORT = 8080\n"
        "DEBUG = True\n"
    )
    chunks = chunk_python_code(code, "config.py")
    assert len(chunks) == 1
    assert chunks[0].chunk_type == "module"
    assert chunks[0].start_line == 1
    assert chunks[0].end_line == 3


def test_fallback_line_based_chunking():
    """Verify line-based chunking fallback handles arbitrary text with overlap."""
    lines = [f"line_{i}" for i in range(1, 101)]
    text = "\n".join(lines)

    chunks = chunk_line_based(text, "raw_data.txt", chunk_size=30, overlap=5)
    assert len(chunks) > 1

    # First chunk: lines 1 to 30
    assert chunks[0].start_line == 1
    assert chunks[0].end_line == 30
    assert chunks[0].chunk_type == "module"

    # Second chunk step: 30 - 5 = 25 -> starts at line 26
    assert chunks[1].start_line == 26
    assert chunks[1].end_line == 55


def test_syntax_error_fallback():
    """Verify syntax error in python file falls back to line-based chunking without failing."""
    invalid_python = "def broken_syntax(:\n    return\n"
    chunks = chunk_python_code(invalid_python, "broken.py")
    assert len(chunks) >= 1
    assert chunks[0].chunk_type == "module"


def test_empty_input():
    """Verify empty or whitespace-only code returns empty list of chunks."""
    assert chunk_python_code("", "empty.py") == []
    assert chunk_python_code("   \n\n  ", "empty.py") == []

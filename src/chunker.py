"""Syntax-aware code chunking logic using Python's AST."""
import ast
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional


@dataclass
class CodeChunk:
    """Represents a code chunk with location metadata."""
    file_path: str
    start_line: int
    end_line: int
    chunk_type: str  # "function", "class", "module"
    code_text: str
    name: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert chunk metadata to dictionary for storage or inspection."""
        data = {
            "file_path": self.file_path,
            "start_line": self.start_line,
            "end_line": self.end_line,
            "chunk_type": self.chunk_type,
            "code_text": self.code_text,
        }
        if self.name is not None:
            data["name"] = self.name
        return data


def get_node_start_line(node: ast.AST) -> int:
    """Get the 1-based start line of an AST node, accounting for decorators."""
    decorators = getattr(node, "decorator_list", [])
    if decorators:
        first_dec_line = min(d.lineno for d in decorators)
        return min(node.lineno, first_dec_line)
    return getattr(node, "lineno", 1)


def get_node_end_line(node: ast.AST) -> int:
    """Get the 1-based end line of an AST node."""
    return getattr(node, "end_lineno", None) or getattr(node, "lineno", 1)


def _extract_class_chunks(
    class_node: ast.ClassDef,
    lines: List[str],
    file_path: str,
    parent_prefix: str = "",
    include_methods: bool = True,
) -> List[CodeChunk]:
    """Extract chunks for a class and its member methods/nested classes."""
    chunks: List[CodeChunk] = []
    class_name = f"{parent_prefix}.{class_node.name}" if parent_prefix else class_node.name

    c_start = get_node_start_line(class_node)
    c_end = get_node_end_line(class_node)
    c_code = "\n".join(lines[c_start - 1 : c_end])

    chunks.append(
        CodeChunk(
            file_path=file_path,
            start_line=c_start,
            end_line=c_end,
            chunk_type="class",
            code_text=c_code,
            name=class_name,
        )
    )

    if include_methods:
        for child in class_node.body:
            if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                m_start = get_node_start_line(child)
                m_end = get_node_end_line(child)
                m_code = "\n".join(lines[m_start - 1 : m_end])
                chunks.append(
                    CodeChunk(
                        file_path=file_path,
                        start_line=m_start,
                        end_line=m_end,
                        chunk_type="function",
                        code_text=m_code,
                        name=f"{class_name}.{child.name}",
                    )
                )
            elif isinstance(child, ast.ClassDef):
                chunks.extend(
                    _extract_class_chunks(
                        child,
                        lines,
                        file_path,
                        parent_prefix=class_name,
                        include_methods=include_methods,
                    )
                )

    return chunks


def _flush_module_statements(
    statements: List[ast.AST],
    lines: List[str],
    file_path: str,
) -> Optional[CodeChunk]:
    """Create a module chunk from a contiguous sequence of module-level statements."""
    if not statements:
        return None

    start_line = get_node_start_line(statements[0])
    end_line = get_node_end_line(statements[-1])
    code_text = "\n".join(lines[start_line - 1 : end_line])

    if not code_text.strip():
        return None

    return CodeChunk(
        file_path=file_path,
        start_line=start_line,
        end_line=end_line,
        chunk_type="module",
        code_text=code_text,
    )


def chunk_python_code(
    code: str,
    file_path: str,
    include_methods: bool = True,
) -> List[CodeChunk]:
    """
    Parse Python code using the ast module and produce syntax-aware chunks
    (functions, classes, and module-level code blocks).
    """
    lines = code.splitlines()
    if not lines or not code.strip():
        return []

    try:
        tree = ast.parse(code)
    except SyntaxError:
        # Fall back to line-based chunking if syntax error occurs
        return chunk_line_based(code, file_path)

    if not tree.body:
        # File has only comments or empty lines
        return [
            CodeChunk(
                file_path=file_path,
                start_line=1,
                end_line=len(lines),
                chunk_type="module",
                code_text=code.strip(),
            )
        ]

    chunks: List[CodeChunk] = []
    current_module_stmts: List[ast.AST] = []

    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            mod_chunk = _flush_module_statements(current_module_stmts, lines, file_path)
            if mod_chunk:
                chunks.append(mod_chunk)
            current_module_stmts = []

            f_start = get_node_start_line(node)
            f_end = get_node_end_line(node)
            f_code = "\n".join(lines[f_start - 1 : f_end])
            chunks.append(
                CodeChunk(
                    file_path=file_path,
                    start_line=f_start,
                    end_line=f_end,
                    chunk_type="function",
                    code_text=f_code,
                    name=node.name,
                )
            )

        elif isinstance(node, ast.ClassDef):
            mod_chunk = _flush_module_statements(current_module_stmts, lines, file_path)
            if mod_chunk:
                chunks.append(mod_chunk)
            current_module_stmts = []

            chunks.extend(
                _extract_class_chunks(
                    node,
                    lines,
                    file_path,
                    include_methods=include_methods,
                )
            )

        else:
            current_module_stmts.append(node)

    # Flush any remaining module-level statements at the bottom of the file
    mod_chunk = _flush_module_statements(current_module_stmts, lines, file_path)
    if mod_chunk:
        chunks.append(mod_chunk)

    return chunks


def chunk_line_based(
    code: str,
    file_path: str,
    chunk_size: int = 50,
    overlap: int = 10,
) -> List[CodeChunk]:
    """
    Fallback chunking for unsupported file types or unparseable files
    using line-based chunking with overlap.
    """
    lines = code.splitlines()
    if not lines:
        return []

    step = max(1, chunk_size - overlap)
    chunks: List[CodeChunk] = []
    total_lines = len(lines)

    for i in range(0, total_lines, step):
        start_line = i + 1
        end_line = min(i + chunk_size, total_lines)
        chunk_text = "\n".join(lines[start_line - 1 : end_line])

        if chunk_text.strip():
            chunks.append(
                CodeChunk(
                    file_path=file_path,
                    start_line=start_line,
                    end_line=end_line,
                    chunk_type="module",
                    code_text=chunk_text,
                )
            )

        if end_line >= total_lines:
            break

    return chunks


def chunk_file(
    file_path: str | Path,
    repo_root: Optional[str | Path] = None,
    include_methods: bool = True,
) -> List[CodeChunk]:
    """
    Read and chunk a single file. Automatically uses AST chunking for Python files
    and falls back to line-based chunking for other types.
    """
    path = Path(file_path).resolve()
    if not path.is_file():
        raise FileNotFoundError(f"File not found: {path}")

    # Determine display file path (relative to repo_root if provided)
    if repo_root is not None:
        try:
            rel_path = path.relative_to(Path(repo_root).resolve()).as_posix()
        except ValueError:
            rel_path = path.as_posix()
    else:
        rel_path = path.as_posix()

    content = path.read_text(encoding="utf-8", errors="replace")

    if path.suffix.lower() == ".py":
        return chunk_python_code(content, rel_path, include_methods=include_methods)
    else:
        return chunk_line_based(content, rel_path)

"""Syntax-aware code chunking logic supporting Python (AST) and JS/TS/React (tree-sitter)."""
import ast
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional

from src.config import EXTENSION_TO_LANGUAGE

# Tree-sitter language instances cached by language identifier
_LANGUAGES: Dict[str, Any] = {}

ROUTE_METHODS = {
    "get", "post", "put", "delete", "patch", "use", "all",
    "options", "head", "listen",
}


@dataclass
class CodeChunk:
    """Represents a code chunk with location metadata."""
    file_path: str
    start_line: int
    end_line: int
    chunk_type: str  # "function", "class", "module"
    code_text: str
    name: Optional[str] = None
    language: str = "python"

    def to_dict(self) -> Dict[str, Any]:
        """Convert chunk metadata to dictionary for storage or inspection."""
        data = {
            "file_path": self.file_path,
            "start_line": self.start_line,
            "end_line": self.end_line,
            "chunk_type": self.chunk_type,
            "code_text": self.code_text,
            "language": self.language,
        }
        if self.name is not None:
            data["name"] = self.name
        return data


def detect_language(file_path: str | Path) -> str:
    """Detect programming language from file suffix."""
    suffix = Path(file_path).suffix.lower()
    return EXTENSION_TO_LANGUAGE.get(suffix, "unknown")


def get_tree_sitter_language(language: str) -> Optional[Any]:
    """Retrieve or initialize a cached Tree-sitter Language for the given language."""
    if language in _LANGUAGES:
        return _LANGUAGES[language]

    lang = None
    try:
        from tree_sitter import Language
        if language in ("javascript", "jsx"):
            import tree_sitter_javascript
            lang = Language(tree_sitter_javascript.language())
        elif language == "typescript":
            import tree_sitter_typescript
            lang = Language(tree_sitter_typescript.language_typescript())
        elif language == "tsx":
            import tree_sitter_typescript
            lang = Language(tree_sitter_typescript.language_tsx())
    except Exception:
        lang = None

    _LANGUAGES[language] = lang
    return lang


def get_tree_sitter_parser(language: str) -> Optional[Any]:
    """Create a fresh Tree-sitter Parser initialized with the cached Language."""
    lang = get_tree_sitter_language(language)
    if lang is None:
        return None
    try:
        from tree_sitter import Parser
        return Parser(lang)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Python AST Chunking
# ---------------------------------------------------------------------------

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
    language: str = "python",
) -> List[CodeChunk]:
    """Extract chunks for a Python class and its member methods/nested classes."""
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
            language=language,
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
                        language=language,
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
                        language=language,
                    )
                )

    return chunks


def _flush_module_statements(
    statements: List[ast.AST],
    lines: List[str],
    file_path: str,
    language: str = "python",
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
        language=language,
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
        return chunk_line_based(code, file_path, language="python")

    if not tree.body:
        # File has only comments or empty lines
        return [
            CodeChunk(
                file_path=file_path,
                start_line=1,
                end_line=len(lines),
                chunk_type="module",
                code_text=code.strip(),
                language="python",
            )
        ]

    chunks: List[CodeChunk] = []
    current_module_stmts: List[ast.AST] = []

    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            mod_chunk = _flush_module_statements(current_module_stmts, lines, file_path, language="python")
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
                    language="python",
                )
            )

        elif isinstance(node, ast.ClassDef):
            mod_chunk = _flush_module_statements(current_module_stmts, lines, file_path, language="python")
            if mod_chunk:
                chunks.append(mod_chunk)
            current_module_stmts = []

            chunks.extend(
                _extract_class_chunks(
                    node,
                    lines,
                    file_path,
                    include_methods=include_methods,
                    language="python",
                )
            )

        else:
            current_module_stmts.append(node)

    # Flush any remaining module-level statements at the bottom of the file
    mod_chunk = _flush_module_statements(current_module_stmts, lines, file_path, language="python")
    if mod_chunk:
        chunks.append(mod_chunk)

    return chunks


# ---------------------------------------------------------------------------
# JavaScript / TypeScript / React (tree-sitter) Chunking
# ---------------------------------------------------------------------------

def _get_ts_node_line_range(node: Any, total_lines: int) -> tuple[int, int]:
    """Calculate 1-based (start_line, end_line) from a tree-sitter node."""
    s = node.start_point.row + 1
    if node.end_point.column == 0 and node.end_point.row > node.start_point.row:
        e = node.end_point.row
    else:
        e = node.end_point.row + 1
    e = min(max(1, e), total_lines)
    s = min(max(1, s), e)
    return s, e


def _extract_var_function_name(decl_node: Any, source_bytes: bytes) -> Optional[str]:
    """Check if a variable_declarator defines a function or React component."""
    name_node = decl_node.child_by_field_name("name")
    val_node = decl_node.child_by_field_name("value")
    if not name_node or not val_node:
        return None

    val_type = val_node.type
    name = source_bytes[name_node.start_byte : name_node.end_byte].decode("utf-8", errors="replace")

    # Arrow function or function expression
    if val_type in ("arrow_function", "function_expression"):
        return name

    # React HOC: memo(...), forwardRef(...)
    if val_type == "call_expression":
        fn_node = val_node.child_by_field_name("function")
        if fn_node:
            fn_text = source_bytes[fn_node.start_byte : fn_node.end_byte].decode("utf-8", errors="replace")
            if fn_text in ("memo", "React.memo", "forwardRef", "React.forwardRef"):
                return name

    return None


def _extract_route_or_call_name(expr_stmt: Any, source_bytes: bytes) -> Optional[str]:
    """Extract Express route handler or Mongoose hook name from an expression_statement."""
    call = None
    for ch in expr_stmt.children:
        if ch.type == "call_expression":
            call = ch
            break
    if not call:
        return None

    fn_node = call.child_by_field_name("function")
    if not fn_node:
        return None

    fn_text = source_bytes[fn_node.start_byte : fn_node.end_byte].decode("utf-8", errors="replace")
    parts = fn_text.split(".")
    method = parts[-1]

    if method in ROUTE_METHODS or method in ("pre", "post"):
        args_node = call.child_by_field_name("arguments")
        path_str = ""
        if args_node:
            for arg in args_node.children:
                if arg.type == "string":
                    path_str = source_bytes[arg.start_byte : arg.end_byte].decode("utf-8", errors="replace").strip("'\"`")
                    break
        if path_str:
            return f"{fn_text}('{path_str}')"
        return fn_text

    return None


def _extract_assignment_function_name(expr_stmt: Any, source_bytes: bytes) -> Optional[str]:
    """Extract assigned function name from an expression_statement (e.g. methods/exports)."""
    assign = None
    for ch in expr_stmt.children:
        if ch.type == "assignment_expression":
            assign = ch
            break
    if not assign:
        return None

    left = assign.child_by_field_name("left")
    right = assign.child_by_field_name("right")
    if not left or not right:
        return None

    if right.type in ("arrow_function", "function_expression"):
        return source_bytes[left.start_byte : left.end_byte].decode("utf-8", errors="replace")

    return None


def chunk_treesitter_code(
    code: str,
    file_path: str,
    language: str,
    include_methods: bool = True,
) -> List[CodeChunk]:
    """
    Parse JavaScript / TypeScript / React JSX / TSX code using tree-sitter
    and produce syntax-aware chunks:
    - Function declarations & async functions
    - Arrow function expressions assigned to variables
    - Class declarations and member methods (including React class components)
    - React function components
    - Express route handlers & Mongoose hooks
    - Module preamble, configuration, and export statements
    """
    lines = code.splitlines()
    if not lines or not code.strip():
        return []

    parser = get_tree_sitter_parser(language)
    if parser is None:
        return chunk_line_based(code, file_path, language=language)

    source_bytes = code.encode("utf-8")
    tree = parser.parse(source_bytes)

    chunks: List[CodeChunk] = []
    current_module_ranges: List[tuple[int, int, bool]] = []

    def flush_module() -> None:
        if not current_module_ranges:
            return
        has_code = any(is_code for _, _, is_code in current_module_ranges)
        if not has_code:
            current_module_ranges.clear()
            return
        s = current_module_ranges[0][0]
        e = current_module_ranges[-1][1]
        current_module_ranges.clear()
        text = "\n".join(lines[s - 1 : e])
        if text.strip():
            chunks.append(
                CodeChunk(
                    file_path=file_path,
                    start_line=s,
                    end_line=e,
                    chunk_type="module",
                    code_text=text,
                    language=language,
                )
            )

    def add_module_node(n: Any) -> None:
        ns, ne = _get_ts_node_line_range(n, len(lines))
        current_module_ranges.append((ns, ne, n.type != "comment"))

    for child in tree.root_node.children:
        target_node = child

        if child.type == "export_statement":
            decl_child = child.child_by_field_name("declaration") or child.child_by_field_name("value")
            if not decl_child:
                for sub in child.children:
                    if sub.type in (
                        "function_declaration",
                        "generator_function_declaration",
                        "class_declaration",
                        "lexical_declaration",
                        "variable_declaration",
                        "arrow_function",
                    ):
                        decl_child = sub
                        break
            if decl_child:
                target_node = decl_child
            else:
                add_module_node(child)
                continue

        # 1. Function declaration
        if target_node.type in ("function_declaration", "generator_function_declaration"):
            flush_module()
            s, e = _get_ts_node_line_range(child, len(lines))
            name_node = target_node.child_by_field_name("name")
            fn_name = (
                source_bytes[name_node.start_byte : name_node.end_byte].decode("utf-8", errors="replace")
                if name_node
                else "default"
            )
            chunks.append(
                CodeChunk(
                    file_path=file_path,
                    start_line=s,
                    end_line=e,
                    chunk_type="function",
                    code_text="\n".join(lines[s - 1 : e]),
                    name=fn_name,
                    language=language,
                )
            )

        # 2. Variable declaration with arrow function or function expression
        elif target_node.type in ("lexical_declaration", "variable_declaration"):
            fn_decl_name = None
            for sub in target_node.children:
                if sub.type == "variable_declarator":
                    fn_name = _extract_var_function_name(sub, source_bytes)
                    if fn_name:
                        fn_decl_name = fn_name
                        break

            if fn_decl_name:
                flush_module()
                s, e = _get_ts_node_line_range(child, len(lines))
                chunks.append(
                    CodeChunk(
                        file_path=file_path,
                        start_line=s,
                        end_line=e,
                        chunk_type="function",
                        code_text="\n".join(lines[s - 1 : e]),
                        name=fn_decl_name,
                        language=language,
                    )
                )
            else:
                add_module_node(child)

        # 3. Class declaration & class components
        elif target_node.type == "class_declaration":
            flush_module()
            s, e = _get_ts_node_line_range(child, len(lines))
            name_node = target_node.child_by_field_name("name")
            cls_name = (
                source_bytes[name_node.start_byte : name_node.end_byte].decode("utf-8", errors="replace")
                if name_node
                else "AnonymousClass"
            )
            chunks.append(
                CodeChunk(
                    file_path=file_path,
                    start_line=s,
                    end_line=e,
                    chunk_type="class",
                    code_text="\n".join(lines[s - 1 : e]),
                    name=cls_name,
                    language=language,
                )
            )

            if include_methods:
                body = target_node.child_by_field_name("body")
                if body:
                    for b_child in body.children:
                        if b_child.type == "method_definition":
                            m_s, m_e = _get_ts_node_line_range(b_child, len(lines))
                            m_name_node = b_child.child_by_field_name("name")
                            m_name = (
                                source_bytes[m_name_node.start_byte : m_name_node.end_byte].decode("utf-8", errors="replace")
                                if m_name_node
                                else "anonymous"
                            )
                            chunks.append(
                                CodeChunk(
                                    file_path=file_path,
                                    start_line=m_s,
                                    end_line=m_e,
                                    chunk_type="function",
                                    code_text="\n".join(lines[m_s - 1 : m_e]),
                                    name=f"{cls_name}.{m_name}",
                                    language=language,
                                )
                            )

        # 4. Expression statement (Express route, schema hooks, assignment methods)
        elif target_node.type == "expression_statement":
            route_name = _extract_route_or_call_name(target_node, source_bytes)
            assign_fn_name = _extract_assignment_function_name(target_node, source_bytes)

            if route_name:
                flush_module()
                s, e = _get_ts_node_line_range(child, len(lines))
                chunks.append(
                    CodeChunk(
                        file_path=file_path,
                        start_line=s,
                        end_line=e,
                        chunk_type="function",
                        code_text="\n".join(lines[s - 1 : e]),
                        name=route_name,
                        language=language,
                    )
                )
            elif assign_fn_name:
                flush_module()
                s, e = _get_ts_node_line_range(child, len(lines))
                chunks.append(
                    CodeChunk(
                        file_path=file_path,
                        start_line=s,
                        end_line=e,
                        chunk_type="function",
                        code_text="\n".join(lines[s - 1 : e]),
                        name=assign_fn_name,
                        language=language,
                    )
                )
            else:
                add_module_node(child)

        else:
            add_module_node(child)

    flush_module()
    return chunks


# ---------------------------------------------------------------------------
# Fallback Line-based Chunking
# ---------------------------------------------------------------------------

def chunk_line_based(
    code: str,
    file_path: str,
    chunk_size: int = 50,
    overlap: int = 10,
    language: str = "unknown",
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
                    language=language,
                )
            )

        if end_line >= total_lines:
            break

    return chunks


# ---------------------------------------------------------------------------
# Unified Chunking Entry Point
# ---------------------------------------------------------------------------

def chunk_file(
    file_path: str | Path,
    repo_root: Optional[str | Path] = None,
    include_methods: bool = True,
) -> List[CodeChunk]:
    """
    Read and chunk a single file. Automatically uses AST chunking for Python files,
    tree-sitter chunking for JS/TS/JSX/TSX files, and line-based chunking with overlap
    for unsupported or unparseable files.
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
    language = detect_language(path)

    if language == "python":
        return chunk_python_code(content, rel_path, include_methods=include_methods)
    elif language in ("javascript", "jsx", "typescript", "tsx"):
        try:
            return chunk_treesitter_code(
                content,
                rel_path,
                language=language,
                include_methods=include_methods,
            )
        except Exception:
            return chunk_line_based(content, rel_path, language=language)
    else:
        return chunk_line_based(content, rel_path, language=language)

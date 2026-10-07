"""File ingestion logic for walking repositories and filtering code files."""
import os
from pathlib import Path
from typing import Iterable, Set

from src.config import (
    IGNORED_DIRS,
    IGNORED_EXTENSIONS,
    IGNORED_FILENAMES,
    SUPPORTED_EXTENSIONS,
)


def is_binary_file(file_path: Path, block_size: int = 1024) -> bool:
    """Check if a file appears to be binary by checking for null bytes or utf-8 decoding."""
    try:
        with open(file_path, "rb") as f:
            chunk = f.read(block_size)
            if b"\x00" in chunk:
                return True
            # Try decoding as text
            chunk.decode("utf-8")
            return False
    except (UnicodeDecodeError, OSError):
        return True


def is_ignored_directory(dir_name: str, ignored_dirs: Set[str] = IGNORED_DIRS) -> bool:
    """Check if a directory name matches any ignored directory."""
    return dir_name in ignored_dirs or dir_name.startswith(".") and dir_name not in {".", ".."}


def is_ignored_file(
    file_path: Path,
    ignored_extensions: Set[str] = IGNORED_EXTENSIONS,
    ignored_filenames: Set[str] = IGNORED_FILENAMES,
) -> bool:
    """Check if a file should be ignored based on filename or extension."""
    if file_path.name in ignored_filenames:
        return True
    if file_path.suffix.lower() in ignored_extensions:
        return True
    return False


def collect_files(
    root_dir: str | Path,
    supported_extensions: Set[str] | None = None,
    ignored_dirs: Set[str] | None = None,
) -> list[Path]:
    """
    Recursively walk root_dir and collect code files matching supported_extensions,
    skipping ignored directories, ignored files, and binary files.
    """
    root_path = Path(root_dir).resolve()
    if not root_path.exists():
        raise FileNotFoundError(f"Directory not found: {root_path}")
    if not root_path.is_dir():
        raise NotADirectoryError(f"Path is not a directory: {root_path}")

    if supported_extensions is None:
        supported_extensions = SUPPORTED_EXTENSIONS
    if ignored_dirs is None:
        ignored_dirs = IGNORED_DIRS

    collected: list[Path] = []

    for root, dirs, files in os.walk(root_path, topdown=True):
        # Prune ignored directories in-place so os.walk does not recurse into them
        dirs[:] = [
            d
            for d in dirs
            if not is_ignored_directory(d, ignored_dirs)
        ]

        for file_name in files:
            file_path = Path(root) / file_name
            suffix = file_path.suffix.lower()

            if suffix not in supported_extensions:
                continue

            if is_ignored_file(file_path):
                continue

            if is_binary_file(file_path):
                continue

            collected.append(file_path)

    collected.sort()
    return collected

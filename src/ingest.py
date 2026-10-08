"""File ingestion logic for walking repositories, cloning Git repos, and filtering code files."""
import os
import shutil
import stat
import subprocess
import zipfile
from pathlib import Path
from typing import Any, Iterable, List, Optional, Set

from src.config import (
    IGNORED_DIRS,
    IGNORED_EXTENSIONS,
    IGNORED_FILENAMES,
    SUPPORTED_EXTENSIONS,
)


def _force_rmtree(path: Path) -> None:
    """Robust rmtree handling read-only git pack attributes across OSes."""
    if not path.exists():
        return

    def on_rm_error(func, p, exc_info):
        try:
            os.chmod(p, stat.S_IWRITE)
            func(p)
        except Exception:
            pass

    try:
        shutil.rmtree(path, onerror=on_rm_error)
    except Exception:
        pass


def is_git_url(source: str) -> bool:
    """Check if the source string looks like a Git / GitHub URL."""
    s = source.strip().lower()
    return (
        s.startswith("http://")
        or s.startswith("https://")
        or s.startswith("git@")
        or "github.com/" in s
        or "gitlab.com/" in s
        or "bitbucket.org/" in s
        or s.endswith(".git")
    )


def clone_git_repo(
    git_url: str,
    dest_parent: str | Path = "./cloned_repos",
) -> Path:
    """
    Clone a public Git repository using shallow clone (--depth 1).
    Returns the Path to the cloned directory.
    """
    clean_url = git_url.strip()
    # Normalize github URLs
    target_url = clean_url
    if not target_url.endswith(".git") and ("github.com" in target_url or "gitlab.com" in target_url):
        target_url = target_url + ".git"

    # Extract repository name
    repo_name = clean_url.rstrip("/").split("/")[-1].replace(".git", "")
    if not repo_name:
        repo_name = "cloned_repo"

    dest_dir = Path(dest_parent).resolve() / repo_name
    dest_dir.parent.mkdir(parents=True, exist_ok=True)

    _force_rmtree(dest_dir)

    result = subprocess.run(
        ["git", "clone", "--depth", "1", target_url, str(dest_dir)],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        # Fallback to cloning the raw URL without .git suffix
        result_retry = subprocess.run(
            ["git", "clone", "--depth", "1", clean_url, str(dest_dir)],
            capture_output=True,
            text=True,
        )
        if result_retry.returncode != 0:
            err = result_retry.stderr or result.stderr or "Unknown error"
            raise RuntimeError(f"Failed to clone repository: {err.strip()}")

    return dest_dir


def extract_zip_repo(
    zip_source: Any,
    extract_parent: str | Path = "./uploaded_repos",
    repo_name: str = "uploaded_repo",
) -> Path:
    """
    Extract a ZIP archive of a codebase into extract_parent / repo_name.
    Returns the Path to the extracted repository root.
    """
    dest_dir = Path(extract_parent).resolve() / repo_name
    _force_rmtree(dest_dir)
    dest_dir.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(zip_source, "r") as zip_ref:
        zip_ref.extractall(dest_dir)

    # If the ZIP contained a single top-level folder, point directly to it
    entries = [p for p in dest_dir.iterdir() if not p.name.startswith("__MACOSX")]
    if len(entries) == 1 and entries[0].is_dir():
        return entries[0]

    return dest_dir


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
    if file_path.name.endswith(".min.js") or file_path.name.endswith(".min.css"):
        return True
    if file_path.suffix.lower() in ignored_extensions:
        return True
    return False


def collect_files(
    root_dir: str | Path,
    supported_extensions: Set[str] | None = None,
    ignored_dirs: Set[str] | None = None,
) -> List[Path]:
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

    collected: List[Path] = []

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

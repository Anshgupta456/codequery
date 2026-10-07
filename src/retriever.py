"""Similarity search and retrieval logic (Phase 3)."""
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional

import chromadb
from openai import OpenAI

from src.config import (
    CHROMA_PERSIST_DIR,
    COLLECTION_NAME,
    DEFAULT_TOP_K,
)
from src.cost_tracker import TokenUsage
from src.embedder import (
    generate_embeddings,
    get_chroma_client,
    get_or_create_collection,
)


@dataclass
class RetrievedChunk:
    """Represents a chunk retrieved from vector search with similarity score and metadata."""
    chunk_id: str
    code_text: str
    file_path: str
    start_line: int
    end_line: int
    chunk_type: str
    name: str
    score: float       # Cosine similarity score: 1.0 - distance (higher is more relevant)
    distance: float    # Raw Chroma distance
    language: str = "unknown"

    @property
    def citation(self) -> str:
        """Formatted file:line citation (e.g. auth.py:8-11)."""
        return f"{self.file_path}:{self.start_line}-{self.end_line}"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "chunk_id": self.chunk_id,
            "citation": self.citation,
            "file_path": self.file_path,
            "start_line": self.start_line,
            "end_line": self.end_line,
            "chunk_type": self.chunk_type,
            "name": self.name,
            "score": self.score,
            "distance": self.distance,
            "code_text": self.code_text,
            "language": self.language,
        }


def get_collection(
    persist_dir: Optional[str | Path] = None,
    collection_name: str = COLLECTION_NAME,
) -> chromadb.Collection:
    """Connect to the persistent Chroma store and return the collection."""
    client = get_chroma_client(persist_dir or CHROMA_PERSIST_DIR)
    return get_or_create_collection(client, collection_name=collection_name, reset=False)


def retrieve_chunks(
    query: str,
    collection: Optional[chromadb.Collection] = None,
    top_k: int = DEFAULT_TOP_K,
    client: Optional[OpenAI] = None,
    use_mock: bool = False,
    min_score: Optional[float] = None,
    return_usage: bool = False,
) -> Any:
    """
    Embed the query, perform similarity search against ChromaDB,
    and return matched chunks with metadata and similarity scores.
    If return_usage=True, returns (List[RetrievedChunk], TokenUsage).
    """
    clean_query = query.strip()
    if not clean_query:
        return ([], TokenUsage()) if return_usage else []

    if collection is None:
        collection = get_collection()

    # Embed query using text-embedding-3-small (or mock if use_mock=True)
    if return_usage:
        query_embeddings, emb_usage = generate_embeddings(
            texts=[clean_query],
            client=client,
            use_mock=use_mock,
            return_usage=True,
        )
    else:
        query_embeddings = generate_embeddings(
            texts=[clean_query],
            client=client,
            use_mock=use_mock,
            return_usage=False,
        )
        emb_usage = TokenUsage()

    if not query_embeddings:
        return ([], emb_usage) if return_usage else []

    # Query Chroma
    results = collection.query(
        query_embeddings=query_embeddings,
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    retrieved: List[RetrievedChunk] = []

    ids_list = results.get("ids", [[]])[0]
    docs_list = results.get("documents", [[]])[0]
    metas_list = results.get("metadatas", [[]])[0]
    dists_list = results.get("distances", [[]])[0]

    for chunk_id, doc, meta, dist in zip(ids_list, docs_list, metas_list, dists_list):
        # In cosine space, distance = 1 - cosine_similarity
        # Hence similarity_score = 1.0 - distance
        similarity_score = round(1.0 - float(dist), 4)

        if min_score is not None and similarity_score < min_score:
            continue

        retrieved.append(
            RetrievedChunk(
                chunk_id=chunk_id,
                code_text=doc,
                file_path=meta.get("file_path", ""),
                start_line=int(meta.get("start_line", 1)),
                end_line=int(meta.get("end_line", 1)),
                chunk_type=meta.get("chunk_type", "unknown"),
                name=meta.get("name", ""),
                score=similarity_score,
                distance=round(float(dist), 4),
                language=meta.get("language", "unknown"),
            )
        )

    if return_usage:
        return retrieved, emb_usage
    return retrieved

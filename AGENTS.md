# AGENTS.md — CodeQuery: RAG-based Codebase Q&A Assistant

This file gives the agent full context and instructions for building **CodeQuery**, a Retrieval-Augmented Generation (RAG) tool that lets a developer ask natural-language questions about any codebase and get answers with precise file/line citations.

Read this entire file before writing any code. Follow the phase order — do not jump ahead to UI or deployment before the retrieval pipeline is correct and tested.

---

## 1. Project Goal

Build a tool where a user points at a codebase (a local folder or a cloned GitHub repo) and asks questions like:

- "Where is user authentication handled?"
- "What does the `process_payment` function do?"
- "Which files import the `database` module?"

The tool must:
1. Retrieve the most relevant code chunks using semantic search (not keyword grep).
2. Answer in plain English, **always citing the exact file path and line numbers** used.
3. Say "I couldn't find this in the codebase" when nothing relevant is retrieved — **never hallucinate an answer**.

This is a portfolio project. Prioritize correctness, clean architecture, and a working end-to-end demo over polish or feature breadth.

---

## 2. Tech Stack (use exactly this unless a blocker forces a change — ask me first)

- **Language:** Python 3.11+
- **LLM API:** OpenAI API (`gpt-4o-mini` for answering, `text-embedding-3-small` for embeddings) — read keys from `.env`, never hardcode
- **Orchestration:** LangChain (for the retrieval chain only — keep usage minimal and explicit, avoid unnecessary abstraction layers)
- **Vector store:** ChromaDB (local, persistent directory — no hosted vector DB needed for this project)
- **Chunking:** `tree-sitter` (or a language-specific AST parser) for syntax-aware chunking by function/class — fallback to line-based chunking with overlap only for unsupported file types
- **UI:** Streamlit
- **Testing:** `pytest`
- **Env management:** `venv` + `requirements.txt`

Do not introduce additional frameworks (no FastAPI backend, no Docker, no cloud deployment) unless I explicitly ask — this stays a single, runnable local app.

---

## 3. Architecture / Pipeline

```
User points to repo/folder
        │
        ▼
 [Ingestion] → walk file tree, filter by extension, skip node_modules/.git/venv/etc.
        │
        ▼
 [Chunking] → split each file into function/class-level chunks (syntax-aware)
        │         each chunk keeps: file_path, start_line, end_line, chunk_type, code_text
        ▼
 [Embedding] → embed each chunk's code_text, store in Chroma with metadata
        │
        ▼
 [Query time]
   User question → embed question → similarity search (top-k, default k=5)
        │
        ▼
 [Answer generation] → pass retrieved chunks + question to LLM with a strict system prompt:
        "Only answer using the provided code context. Always cite file path and line numbers.
         If the answer isn't in the context, say so explicitly — do not guess."
        │
        ▼
 Answer shown in Streamlit with clickable/visible file:line citations
```

---

## 4. Folder Structure

Create exactly this structure:

```
codequery/
├── .env.example
├── requirements.txt
├── README.md
├── app.py                  # Streamlit entry point
├── src/
│   ├── __init__.py
│   ├── ingest.py            # file walking + filtering
│   ├── chunker.py            # syntax-aware chunking logic
│   ├── embedder.py           # embedding generation + Chroma storage
│   ├── retriever.py          # similarity search logic
│   ├── qa_chain.py           # retrieval + LLM answer generation
│   └── config.py             # constants (chunk size, k, model names, ignored dirs)
├── tests/
│   ├── test_chunker.py
│   ├── test_retriever.py
│   └── test_qa_chain.py
└── sample_repos/              # small test repos for manual + automated testing
```

---

## 5. Build Order (follow these phases strictly, in order)

### Phase 1 — Ingestion & Chunking (build + test before moving on)
- Walk a given folder, collect code files (start with `.py` only, design it to be extensible to other languages later).
- Skip: `node_modules`, `.git`, `venv`, `__pycache__`, `dist`, `build`, lockfiles, binary files.
- Chunk by function/class boundaries using `tree-sitter` (or Python's `ast` module as a simpler starting point for `.py` files — acceptable for v1).
- Each chunk must carry metadata: `file_path`, `start_line`, `end_line`, `chunk_type` (function/class/module), `code_text`.
- Write unit tests confirming chunk boundaries are correct on a sample file before moving to Phase 2.

### Phase 2 — Embedding & Storage
- Embed each chunk's `code_text` using `text-embedding-3-small`.
- Store in a local persistent ChromaDB collection, with all metadata attached to each vector.
- Write a small script to re-index a folder end-to-end and confirm chunk count + metadata look correct.

### Phase 3 — Retrieval
- Given a question, embed it and run similarity search (top-k=5 default, make it configurable).
- Return the matched chunks with their similarity scores and metadata.
- Test retrieval manually against `sample_repos/` with at least 5 varied questions before moving to Phase 4.

### Phase 4 — Answer Generation (the most important phase — no hallucination tolerance)
- Build the system prompt so the LLM:
  - Only uses the retrieved chunks as context — nothing from its own training knowledge about "common" code patterns.
  - Always cites `file_path:start_line-end_line` for every claim.
  - Explicitly says "I couldn't find this in the codebase" if retrieved chunks are irrelevant (use a similarity score threshold, not just top-k, to decide this).
- Write tests with at least 3 "not found" cases to confirm the model doesn't hallucinate when nothing relevant exists.

### Phase 5 — Streamlit UI
- Simple layout: input field for a folder path (or git URL to clone), an "Index" button, a chat-style Q&A box below.
- Show the answer with citations rendered clearly (e.g., as a small expandable "Sources" section listing file:line).
- Keep the UI minimal — function over design polish.

### Phase 6 — Testing & Edge Cases
- Test against at least 2 differently-sized sample repos (one small ~20 files, one larger ~150+ files).
- Test: question about non-existent functionality, vague/ambiguous questions, questions spanning multiple files.
- Log retrieval + answer latency — note it in README.

### Phase 7 — README & Documentation
- Write a clear README: problem statement, architecture diagram (ASCII is fine), setup steps, example questions/answers with screenshots, and known limitations.
- Be honest about limitations (e.g., "function-level chunking only, doesn't yet understand cross-file call graphs").

---

## 6. Guardrails for the agent (read carefully)

- **Do not skip ahead to the Streamlit UI before the retrieval + answer pipeline is correct and tested.** A pretty UI over a broken backend is the main anti-pattern to avoid here.
- **Do not let the LLM answer from general programming knowledge.** If the system prompt isn't strict enough and the model starts giving generic answers instead of codebase-grounded ones, stop and fix the prompt before continuing.
- **Keep chunking language-agnostic in design even though we start with Python only** — don't hardcode Python-specific logic deep into the retrieval/answer layers.
- **Ask me before adding new dependencies, frameworks, or changing the tech stack** listed in Section 2.
- **Do not fabricate test results or claim a phase is "done" if tests are failing or incomplete.** Flag it instead.
- **Commit after each completed phase** with a clear commit message referencing the phase (e.g., `Phase 1: ingestion + syntax-aware chunking`).

---

## 7. Definition of Done (for the whole project)

- Can point at any small-to-medium Python repo and get accurate, cited answers to at least 10 varied test questions.
- Correctly refuses to answer (instead of hallucinating) when the answer isn't in the codebase.
- Runs end-to-end locally via `streamlit run app.py` with just an OpenAI API key in `.env`.
- README is clear enough that someone else could set it up in under 5 minutes.
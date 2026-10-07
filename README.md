# CodeQuery: RAG-based Codebase Q&A Assistant

CodeQuery is a Retrieval-Augmented Generation (RAG) tool that lets developers ask natural-language questions about any codebase and receive plain-English explanations backed by **precise file and line citations** (`file_path:start_line-end_line`).

It is designed with strict anti-hallucination guardrails: if a requested feature or function does not exist in the codebase, CodeQuery **refuses to guess** and explicitly reports: `"I couldn't find this in the codebase."`

---

## 1. Problem Statement

When onboarding onto a large or unfamiliar repository, developers often ask questions like:
- *"Where is user authentication handled?"*
- *"What does the `process_payment` function do?"*
- *"How does user logout interact with database sessions?"*

Traditional keyword search (`grep`, IDE Find) fails when the developer does not know the exact variable or function name. Conversely, asking general-purpose LLMs without codebase grounding leads to **hallucinations** — the model invents plausible-sounding functions or libraries that don't exist in the project.

**CodeQuery solves this by:**
1. Ingesting and splitting code into syntax-aware chunks using Python's `ast` parser.
2. Embedding code chunks into a persistent vector database (ChromaDB) with line-level metadata.
3. Performing semantic similarity search against user queries.
4. Enforcing a similarity score threshold to eliminate weak or irrelevant matches before calling the LLM.
5. Grounding answer generation in `gpt-4o-mini` with a strict system prompt that mandates `file_path:start_line-end_line` citations for every claim.

---

## 2. Architecture & Pipeline

```text
User provides folder path
        │
        ▼
 [1. File Ingestion] ────► Walk file tree, skip ignored dirs (.git, node_modules, venv),
        │                  filter supported extensions (.py), skip binary & lockfiles.
        ▼
 [2. Syntax Chunking] ───► Python AST parses functions, classes, and module-level code.
        │                  Each chunk keeps: file_path, start_line, end_line, chunk_type, code_text.
        ▼
 [3. Vector Storage]  ───► Embed code using text-embedding-3-small -> store in local ChromaDB
        │                  collection with cosine similarity index and all chunk metadata.
        ▼
 [4. Query & Search]  ───► User asks natural language question -> embed question -> similarity search (top-k=5).
        │
        ▼
 [5. Score Threshold] ───► Top score >= 0.30?
        ├──────────── NO ──► Return: "I couldn't find this in the codebase." (LLM bypassed, 0 hallucination)
        │
       YES
        ▼
 [6. LLM Grounding]   ───► Pass retrieved chunks + question to gpt-4o-mini with strict system prompt:
        │                  - Answer ONLY using provided code context.
        │                  - Cite file:line for EVERY claim.
        │                  - Refuse if context is insufficient.
        ▼
 [7. Streamlit UI]    ───► Display answer with clickable / expandable "Sources & Citations" section.
```

---

## 3. Setup & Quickstart (Under 5 Minutes)

### Prerequisites
- Python 3.11+
- An OpenAI API Key

### Step 1: Clone & Create Virtual Environment
```powershell
git clone <repo-url> codequery
cd codequery

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# (On Linux / macOS)
# source venv/bin/activate
```

### Step 2: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
Copy the example `.env` file and set your OpenAI API key:
```powershell
cp .env.example .env
```
Edit `.env`:
```env
OPENAI_API_KEY="sk-proj-your-actual-api-key-here"
```

### Step 4: Launch the Streamlit App
```powershell
streamlit run app.py
```
Open **`http://localhost:8501`** in your browser:
1. Enter your codebase path (e.g., `sample_repos/small_repo`).
2. Click **Index Codebase**.
3. Type questions into the chat box at the bottom.

---

## 4. CLI Tools & Automated Testing

### Interactive Terminal Q&A
Test retrieval and answers directly in your terminal:
```powershell
# Interactive REPL:
python scripts/query_cli.py

# One-shot query:
python scripts/query_cli.py "Where is user authentication handled?"
```

### Re-Index a Repository
```powershell
python scripts/index_repo.py --repo sample_repos/small_repo --collection codequery_collection
```

### Run Full Test Suite
```powershell
pytest -v
```
*(All 25 automated unit and integration tests verify ingestion, chunk boundaries, metadata, ChromaDB persistence, retriever scores, and anti-hallucination refusals).*

### Run Latency & Edge Case Benchmark
```powershell
python scripts/benchmark_latency.py
```

---

## 5. Latency & Performance Benchmarks

Measured on an end-to-end benchmark with real embeddings and OpenAI API:

| Codebase | Chunks | Query Category | Top Score | Retrieval Latency | LLM Latency | Total Latency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **small_repo** (4 files) | 20 | Non-existent functionality | `0.1107` | 1,220 ms | 0 ms *(bypassed)* | **1,221 ms** |
| **small_repo** (4 files) | 20 | Vague / general question | `0.3517` | 699 ms | 2,690 ms | **3,389 ms** |
| **small_repo** (4 files) | 20 | Multi-file cross interaction | `0.5099` | 696 ms | 6,131 ms | **6,827 ms** |
| **large_repo** (167 files) | 923 | Non-existent functionality | `0.2977` | 1,085 ms | 0 ms *(bypassed)* | **1,097 ms** |
| **large_repo** (167 files) | 923 | Vague / subsystem query | `0.4799` | 634 ms | 4,977 ms | **5,612 ms** |
| **large_repo** (167 files) | 923 | Multi-file orchestration | `0.6054` | 657 ms | 2,839 ms | **3,496 ms** |

---

## 6. Example Q&A Pairs (Actual Test Output)

### Example 1: Functionality Lookup
> **Question:** *"Where is user authentication handled?"*  
> **Answer:** User authentication is handled in the `login` method of the `AuthService` class. This method authenticates a user by finding them in the database and verifying the provided password against the stored password hash.  
> **Citations:** `auth.py:25-30`, `auth.py:19-34`  
> **Source Snippet:**
```python
# auth.py:25-30
def login(self, username: str, password: str) -> Optional[dict]:
    """Authenticate user against database."""
    user = self.db.find_user(username)
    if user and verify_password(password, user["password_hash"]):
        return {"user_id": user["id"], "username": username}
    return None
```

---

### Example 2: Specific Function Purpose
> **Question:** *"What does the process_payment function do?"*  
> **Answer:** The `process_payment` function processes a credit card payment for an order and returns transaction receipt details. It validates that the amount is greater than zero and generates a transaction receipt.  
> **Citations:** `payments.py:5-19`  
> **Source Snippet:**
```python
# payments.py:5-19
def process_payment(amount: float, currency: str = "USD") -> Dict[str, Any]:
    if amount <= 0:
        raise ValueError("Payment amount must be greater than zero.")
    transaction_id = f"txn_{int(amount * 100)}"
    return {
        "status": "success",
        "amount": amount,
        "currency": currency,
        "transaction_id": transaction_id,
    }
```

---

### Example 3: Cross-File Interaction
> **Question:** *"How does user logout in AuthService interact with DatabaseClient session invalidation?"*  
> **Answer:** In `AuthService`, the `logout` method in `auth.py:32-34` invalidates a session by calling `self.db.invalidate_session(user_id)`. The `DatabaseClient.invalidate_session` method in `database.py:17-22` looks up the user's active session in `self.sessions` and deletes it.  
> **Citations:** `auth.py:32-34`, `database.py:17-22`

---

### Example 4: Non-Existent Functionality (Refusal & Zero Hallucination)
> **Question:** *"Where is the cryptocurrency payment processing gateway with Ethereum or Bitcoin implemented?"*  
> **Answer:** `I couldn't find this in the codebase.`  
> **Citations:** `(None — score 0.2977 below 0.30 threshold; LLM bypassed)`

---

## 7. Known Limitations

While CodeQuery reliably answers codebase queries with precise line citations, it has several intentional design limitations:

1. **Python-First AST Chunking**:
   - Syntax-aware chunking is built using Python's native `ast` library. Non-Python files (`.js`, `.go`, `.rs`, `.md`) fall back to sliding line-based chunking with overlap. Future versions can integrate Tree-Sitter for polyglot AST parsing.
2. **Function and Class Boundary Granularity**:
   - Chunks are extracted at the function, class, or module block level. Very small sub-expressions or deeply nested local helper blocks within 500-line functions are indexed as part of their parent function rather than distinct micro-chunks.
3. **No Static Call Graph / Dependency Resolution**:
   - Retrieval is purely semantic. CodeQuery does not construct an explicit abstract call graph (e.g., caller $\rightarrow$ callee trees). While semantic search often retrieves both caller and callee when names overlap, questions asking *"Trace all 12 transitive callers of function X"* require explicit static analysis call graphs.
4. **Token Context Limits on Huge Files**:
   - If a single class spans thousands of lines without method breakdown, embedding it as a single chunk may approach token limits. (CodeQuery mitigates this by chunking individual methods inside classes).

---

## 8. License
MIT License. Created for portfolio and open-source codebase navigation.

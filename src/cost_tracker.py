"""Token usage and cost tracking for OpenAI API calls."""
from dataclasses import dataclass
from typing import Any, Dict, Optional

from src.config import MODEL_PRICING


@dataclass
class TokenUsage:
    """Represents token usage counts and cost in USD."""
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    cost_usd: float = 0.0

    def __add__(self, other: "TokenUsage") -> "TokenUsage":
        """Combine two TokenUsage records."""
        if not isinstance(other, TokenUsage):
            return self
        return TokenUsage(
            prompt_tokens=self.prompt_tokens + other.prompt_tokens,
            completion_tokens=self.completion_tokens + other.completion_tokens,
            total_tokens=self.total_tokens + other.total_tokens,
            cost_usd=round(self.cost_usd + other.cost_usd, 6),
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "prompt_tokens": self.prompt_tokens,
            "completion_tokens": self.completion_tokens,
            "total_tokens": self.total_tokens,
            "cost_usd": self.cost_usd,
        }


def parse_usage(usage_obj: Any) -> TokenUsage:
    """
    Extract prompt_tokens, completion_tokens, and total_tokens from an OpenAI API usage object
    (works for both chat completions and embeddings).
    """
    if usage_obj is None:
        return TokenUsage(0, 0, 0, 0.0)

    if isinstance(usage_obj, TokenUsage):
        return usage_obj

    if isinstance(usage_obj, dict):
        p_tokens = int(usage_obj.get("prompt_tokens", 0))
        c_tokens = int(usage_obj.get("completion_tokens", 0))
        t_tokens = int(usage_obj.get("total_tokens", p_tokens + c_tokens))
        return TokenUsage(
            prompt_tokens=p_tokens,
            completion_tokens=c_tokens,
            total_tokens=t_tokens,
        )

    # Standard OpenAI API object (e.g. CompletionUsage, Usage)
    p_tokens = int(getattr(usage_obj, "prompt_tokens", 0) or 0)
    c_tokens = int(getattr(usage_obj, "completion_tokens", 0) or 0)
    t_tokens = int(getattr(usage_obj, "total_tokens", p_tokens + c_tokens) or (p_tokens + c_tokens))

    return TokenUsage(
        prompt_tokens=p_tokens,
        completion_tokens=c_tokens,
        total_tokens=t_tokens,
    )


def calculate_cost(usage: TokenUsage | Any, model_name: str) -> float:
    """
    Calculate the cost in USD for a given usage and model name,
    computed separately for input (prompt) and output (completion) tokens.
    """
    parsed = parse_usage(usage)
    pricing = MODEL_PRICING.get(model_name)

    if not pricing:
        return 0.0

    input_rate = pricing.get("input_per_million", 0.0)
    output_rate = pricing.get("output_per_million", 0.0)

    input_cost = (parsed.prompt_tokens / 1_000_000.0) * input_rate
    output_cost = (parsed.completion_tokens / 1_000_000.0) * output_rate

    return round(input_cost + output_cost, 6)


def track_usage(usage_obj: Any, model_name: str) -> TokenUsage:
    """Convenience helper to parse an OpenAI usage object and calculate its USD cost."""
    parsed = parse_usage(usage_obj)
    cost = calculate_cost(parsed, model_name)
    parsed.cost_usd = cost
    return parsed


@dataclass
class QueryCostBreakdown:
    """
    Detailed cost breakdown separating query expansion, embedding,
    and answer generation costs.
    """
    embedding_usage: TokenUsage
    query_expansion_usage: TokenUsage
    answer_generation_usage: TokenUsage
    total_usage: TokenUsage

    def to_dict(self) -> Dict[str, Any]:
        """Convert breakdown to dictionary."""
        return {
            "embedding": self.embedding_usage.to_dict(),
            "query_expansion": self.query_expansion_usage.to_dict(),
            "answer_generation": self.answer_generation_usage.to_dict(),
            "total": self.total_usage.to_dict(),
        }


def create_cost_breakdown(
    embedding_usage: Optional[TokenUsage] = None,
    query_expansion_usage: Optional[TokenUsage] = None,
    answer_generation_usage: Optional[TokenUsage] = None,
) -> QueryCostBreakdown:
    """
    Construct a QueryCostBreakdown cleanly categorizing query expansion cost
    separately from answer generation and embedding costs.
    """
    emb = embedding_usage or TokenUsage()
    qe = query_expansion_usage or TokenUsage()
    ans = answer_generation_usage or TokenUsage()
    total = emb + qe + ans
    return QueryCostBreakdown(
        embedding_usage=emb,
        query_expansion_usage=qe,
        answer_generation_usage=ans,
        total_usage=total,
    )

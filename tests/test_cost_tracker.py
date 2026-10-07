"""Unit tests for token usage and cost tracking."""
from types import SimpleNamespace
import pytest

from src.cost_tracker import TokenUsage, calculate_cost, parse_usage, track_usage


def test_parse_usage_from_chat_completion():
    """Verify parse_usage parses chat completion usage object."""
    mock_usage = SimpleNamespace(prompt_tokens=150, completion_tokens=50, total_tokens=200)
    parsed = parse_usage(mock_usage)

    assert parsed.prompt_tokens == 150
    assert parsed.completion_tokens == 50
    assert parsed.total_tokens == 200


def test_parse_usage_from_embedding():
    """Verify parse_usage parses embedding usage object (no completion tokens)."""
    mock_usage = SimpleNamespace(prompt_tokens=12, total_tokens=12)
    parsed = parse_usage(mock_usage)

    assert parsed.prompt_tokens == 12
    assert parsed.completion_tokens == 0
    assert parsed.total_tokens == 12


def test_calculate_cost_gpt_4o_mini():
    """Verify cost calculation for gpt-4o-mini ($0.15/1M input, $0.60/1M output)."""
    # 1,000,000 prompt tokens = $0.15, 1,000,000 completion tokens = $0.60
    usage = TokenUsage(prompt_tokens=1_000_000, completion_tokens=1_000_000, total_tokens=2_000_000)
    cost = calculate_cost(usage, "gpt-4o-mini")
    assert cost == pytest.approx(0.75, rel=1e-4)

    # 1,000 prompt tokens, 200 completion tokens:
    # input = 1000 * 0.15 / 1e6 = 0.00015
    # output = 200 * 0.60 / 1e6 = 0.00012
    # total = 0.00027
    usage_small = TokenUsage(prompt_tokens=1000, completion_tokens=200, total_tokens=1200)
    cost_small = calculate_cost(usage_small, "gpt-4o-mini")
    assert cost_small == pytest.approx(0.00027, rel=1e-4)


def test_calculate_cost_text_embedding_3_small():
    """Verify cost calculation for text-embedding-3-small ($0.02/1M tokens)."""
    # 1,000,000 prompt tokens = $0.02
    usage = TokenUsage(prompt_tokens=1_000_000, completion_tokens=0, total_tokens=1_000_000)
    cost = calculate_cost(usage, "text-embedding-3-small")
    assert cost == pytest.approx(0.02, rel=1e-4)


def test_token_usage_addition():
    """Verify adding two TokenUsage instances sums tokens and costs."""
    u1 = TokenUsage(prompt_tokens=10, completion_tokens=0, total_tokens=10, cost_usd=0.0001)
    u2 = TokenUsage(prompt_tokens=100, completion_tokens=50, total_tokens=150, cost_usd=0.0005)
    combined = u1 + u2

    assert combined.prompt_tokens == 110
    assert combined.completion_tokens == 50
    assert combined.total_tokens == 160
    assert combined.cost_usd == pytest.approx(0.0006, rel=1e-4)

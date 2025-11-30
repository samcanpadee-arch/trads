# Smart Vision cost rough-cut (assuming OpenAI gpt-4o-mini vision)

Assumptions (Jul 2025 pricing):
- Model: gpt-4o-mini (vision) at ~$0.00015 / 1K input tokens and ~$0.00060 / 1K output tokens.
- Average request: 0.5 MB image (~200 tokens billed by OpenAI) + 200 input text tokens + 450 output tokens.
- No image storage; only transient base64 sent to OpenAI.

Per-request estimate
- Input: ~400 tokens → ~$0.00006
- Output: ~450 tokens → ~$0.00027
- **Total per Smart Vision request: ~$0.00033 (~$0.0004 with safety buffer).**

Example monthly scenarios for one user (unlimited UI access)
- Light use: 5 photos/day * 22 workdays ≈ 110 calls → **~$0.05**
- Typical: 15 photos/day * 22 workdays ≈ 330 calls → **~$0.13**
- Heavy: 40 photos/day * 22 workdays ≈ 880 calls → **~$0.35**

Comparison to other tools (same model family, text-only)
- Smart Chat / Smart Assistant (text only) with ~1K input + 600 output tokens per turn cost ≈ $0.00057 each.
- Smart Tools generators (single-shot) often run 1.5K–2K output tokens, so ≈ $0.001–$0.0013 per generation.

Takeaway
- Vision requests stay cheaper than long-form Smart Tools outputs and a bit cheaper than average chat turns because images count as relatively few tokens. You can keep monthly cost for a power user well under **$1** at current pricing.

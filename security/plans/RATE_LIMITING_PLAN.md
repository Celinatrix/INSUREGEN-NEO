# RATE_LIMITING Fix Plan

## Changes

- `src/lib/server/rateLimit.ts` — `clientIp()` mới, dọn bộ đếm

## Verification goals

- [x] IP giả ở đầu `X-Forwarded-For` bị bỏ qua ✅ (test)
- [x] Vượt giới hạn trả 429 ✅

## Manual verification (for the human)

- Nếu bật đọc giấy ra viện bằng AI, đặt giới hạn chi tiêu trong Anthropic Console.

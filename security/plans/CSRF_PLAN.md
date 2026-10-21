# CSRF Fix Plan

## Changes

- `src/lib/security.ts` (mới) — `crossSite()`, `rejectJsonWrite()`
- `src/app/api/leads/route.ts`, `wallets/route.ts`, `wallets/[id]/claims/route.ts`, `wallets/[id]/bookings/route.ts` — gọi `rejectJsonWrite` đầu tiên
- `src/app/api/claims/extract/route.ts` — kiểm tra `crossSite`

## Verification goals

- [x] POST có `Origin: https://evil.example` trả 403 ✅
- [x] POST `text/plain` trả 415 ✅
- [x] Trang gửi form và tạo ví bình thường ✅ (test trình duyệt)

## Manual verification (for the human)

- Không có.

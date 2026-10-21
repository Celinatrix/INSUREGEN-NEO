# SECURITY_HEADERS Fix Plan

## Changes

- `src/lib/security.ts` (mới) — CSP và header dùng chung
- `src/proxy.ts` — tạo nonce, gắn CSP cho trang
- `src/app/[lang]/layout.tsx` — nonce cho script giao diện
- `next.config.ts` — `headers()`, `poweredByHeader: false`

## Verification goals

- [x] Quét lại 0 FAIL / 0 WARN ✅
- [x] Không lỗi CSP trên 6 trang trong Chromium ✅
- [x] Máy tính phí, nút bấm, chế độ tối vẫn chạy ✅
- [x] `script-src` không có `unsafe-inline`/`unsafe-eval` ở production ✅ (test)

## Manual verification (for the human)

- Sau khi Vercel deploy, mở trang → DevTools → Console: không có lỗi "Content Security Policy".
- Chạy lại skill vibe-check với https://insuregen-neo.vercel.app từ máy có mạng mở để xác nhận HSTS và header trên tên miền thật.

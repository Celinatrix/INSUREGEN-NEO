# SECRETS_EXPOSURE Fix Plan

## Changes

- Không cần thay đổi.

## Verification goals

- [x] `git ls-files .env` rỗng
- [x] Không có mẫu khóa trong mã và lịch sử git
- [x] `/.env`, `/.git/config` trả 404

## Manual verification (for the human)

- Trong Vercel → Settings → Environment Variables, kiểm tra không biến nào chứa khóa bí mật có tiền tố `NEXT_PUBLIC_`.

# SECRETS_EXPOSURE Security Report

## Status: PASS

## Findings

- `.gitignore` bỏ qua `.env*` (trừ `.env.example`); `git ls-files` không có tệp `.env` nào, chỉ có `.env.example` với giá trị trống.
- Quét mã nguồn và toàn bộ lịch sử git tìm `sk-ant-`, `sb_secret_`, JWT `eyJhbGciOi`, `AKIA`, `sk_live_`: không thấy.
- Khóa bí mật chỉ đọc ở máy chủ: `SUPABASE_SERVICE_ROLE_KEY` (`src/lib/server/store.ts`), `ANTHROPIC_API_KEY` (`src/app/api/claims/extract/route.ts`). Biến `NEXT_PUBLIC_` duy nhất là `NEXT_PUBLIC_SITE_URL` (không bí mật).
- Quét trực tiếp: 20 đường dẫn nhạy cảm (`/.env`, `/.git/config`, dump SQL, khóa SSH…) đều không tải được; 12 thư mục phổ biến không bật liệt kê tệp.
- `gitleaks` chưa cài trong môi trường; đã thay bằng tìm mẫu trong `git log --all -p`.

## What's at risk

Không có rủi ro đang mở. Lưu ý quy trình: khóa Supabase từng bị dán vào khung chat đã được thu hồi và tạo khóa mới.

## What's already secure

Khóa chỉ nằm ở biến môi trường Vercel; trình duyệt không nhận khóa nào.

## Recommendations

Giữ nguyên. Cài `gitleaks` (`brew install gitleaks` hoặc tải bản phát hành) và chạy `gitleaks detect --source . --verbose` trước mỗi đợt nộp.

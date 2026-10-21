# DATABASE_ACCESS Fix Plan

## Changes

- `supabase/migrations/002_lock_down.sql` (mới) — `revoke all` trên 5 bảng và đổi default privileges

## Verification goals

- [x] Mọi bảng bật RLS
- [x] Không có policy mở
- [x] Truy vấn `information_schema.role_table_grants` cho anon/authenticated trả rỗng sau khi chạy 002
- [x] Gọi REST bằng khóa anon vào bảng bất kỳ trả lỗi quyền hoặc rỗng

## Manual verification (for the human)

- Chạy `002_lock_down.sql` trong Supabase → SQL Editor.
- Chạy câu kiểm tra ở cuối tệp, kết quả phải rỗng.
- Supabase → Advisors → Security: không còn cảnh báo về bảng public.

# DATABASE_ACCESS Security Report

## Status: LOW

## Findings

- `supabase/migrations/001_init.sql`: 5 bảng (`leads`, `wallets`, `claims`, `grants`, `bookings`) đều `enable row level security` và **không có policy nào**, nên khóa anon/authenticated bị từ chối mọi thao tác.
- Máy chủ dùng `service_role` (bỏ qua RLS) nên vẫn đọc/ghi bình thường.
- Supabase mặc định vẫn cấp quyền bảng cho `anon`/`authenticated`; chỉ RLS đang chặn. Nếu sau này ai đó lỡ thêm một policy `using (true)` thì dữ liệu (gồm số điện thoại, email trong `leads`) sẽ lộ.

## What's at risk

Hiện chưa khai thác được. Rủi ro nằm ở cấu hình sau này: một policy mở sẽ làm lộ danh sách khách hàng tiềm năng.

## What's already secure

RLS bật trên mọi bảng; không có policy `using (true)`; khóa service role chỉ ở máy chủ.

## Recommendations

Thêm lớp thứ hai: thu hồi quyền bảng của `anon`, `authenticated` (migration `002_lock_down.sql`).

-- Lớp bảo vệ thứ hai: ngoài RLS (đã bật, không có policy nào → anon bị chặn),
-- thu hồi luôn quyền bảng của vai trò anon và authenticated.
-- Máy chủ Next.js dùng service_role nên không bị ảnh hưởng.
-- Chạy trong Supabase → SQL Editor, sau 001_init.sql.

revoke all on table public.leads, public.wallets, public.claims, public.grants, public.bookings
  from anon, authenticated;

-- Bảng tạo sau này trong schema public cũng không tự mở quyền cho anon/authenticated.
alter default privileges in schema public revoke all on tables from anon, authenticated;

-- Kiểm tra: chạy câu dưới, kết quả phải rỗng.
-- select grantee, table_name, privilege_type from information_schema.role_table_grants
--  where table_schema = 'public' and grantee in ('anon', 'authenticated');

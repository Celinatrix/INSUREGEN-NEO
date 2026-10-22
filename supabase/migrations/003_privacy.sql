-- Thu tối thiểu dữ liệu: email trong form tư vấn chuyển thành không bắt buộc.
-- Chạy trong Supabase → SQL Editor, sau 002_lock_down.sql.
alter table public.leads alter column email drop not null;

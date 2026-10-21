# Security Audit Summary

Date: 2026-10-22 · Công cụ: vibe-check (Benav Labs, MIT) · Phạm vi: INSUREGEN-NEO (Family Reconnect)

## Live scan

Không gọi được https://insuregen-neo.vercel.app từ môi trường kiểm tra (mạng bị chặn), nên quét bản build production chạy cục bộ (`next start`). HSTS và header do Vercel tự thêm cần xác nhận lại trên tên miền thật.

| | FAIL | WARN | PASS |
|---|---|---|---|
| Trước khi sửa | 3 | 3 | 8 |
| Sau khi sửa | 0 | 0 | 19 |

Kiểm tra thêm bằng Chromium: 6 trang không có lỗi CSP; máy tính phí, nút bấm, chế độ tối, ví demo hoạt động. Thử tấn công: POST từ trang lạ → 403; form `text/plain` → 415; 9 lượt đặt đồng thời trên ví 41 giờ → 8 nhận, 1 từ chối, không trừ lố.

## Results

| # | Category | Status | Report | Plan |
|---|----------|--------|--------|------|
| 1 | SECRETS_EXPOSURE | PASS | [report](reports/SECRETS_EXPOSURE_REPORT.md) | [plan](plans/SECRETS_EXPOSURE_PLAN.md) |
| 2 | DATABASE_ACCESS | LOW | [report](reports/DATABASE_ACCESS_REPORT.md) | [plan](plans/DATABASE_ACCESS_PLAN.md) |
| 3 | AUTH_MIDDLEWARE | LOW | [report](reports/AUTH_MIDDLEWARE_REPORT.md) | [plan](plans/AUTH_MIDDLEWARE_PLAN.md) |
| 4 | ACCESS_CONTROL | LOW | [report](reports/ACCESS_CONTROL_REPORT.md) | [plan](plans/ACCESS_CONTROL_PLAN.md) |
| 5 | FRONTEND_SECRETS | PASS | [report](reports/FRONTEND_SECRETS_REPORT.md) | [plan](plans/FRONTEND_SECRETS_PLAN.md) |
| 6 | SSRF | PASS | [report](reports/SSRF_REPORT.md) | [plan](plans/SSRF_PLAN.md) |
| 7 | CSRF | MEDIUM → PASS (đã sửa) | [report](reports/CSRF_REPORT.md) | [plan](plans/CSRF_PLAN.md) |
| 8 | SECURITY_HEADERS | HIGH → PASS (đã sửa) | [report](reports/SECURITY_HEADERS_REPORT.md) | [plan](plans/SECURITY_HEADERS_PLAN.md) |
| 9 | CORS | PASS | [report](reports/CORS_REPORT.md) | [plan](plans/CORS_PLAN.md) |
| 10 | RATE_LIMITING | MEDIUM → LOW (đã sửa một phần) | [report](reports/RATE_LIMITING_REPORT.md) | [plan](plans/RATE_LIMITING_PLAN.md) |
| 11 | SQL_INJECTION | PASS | [report](reports/SQL_INJECTION_REPORT.md) | [plan](plans/SQL_INJECTION_PLAN.md) |
| 12 | XSS | PASS | [report](reports/XSS_REPORT.md) | [plan](plans/XSS_PLAN.md) |
| 13 | PAYMENT_WEBHOOKS | N/A | [report](reports/PAYMENT_WEBHOOKS_REPORT.md) | [plan](plans/PAYMENT_WEBHOOKS_PLAN.md) |
| 14 | FILE_UPLOADS | MEDIUM → PASS (đã sửa) | [report](reports/FILE_UPLOADS_REPORT.md) | [plan](plans/FILE_UPLOADS_PLAN.md) |
| 15 | ERROR_HANDLING | PASS | [report](reports/ERROR_HANDLING_REPORT.md) | [plan](plans/ERROR_HANDLING_PLAN.md) |
| 16 | PASSWORD_HASHING | N/A | [report](reports/PASSWORD_HASHING_REPORT.md) | [plan](plans/PASSWORD_HASHING_PLAN.md) |
| 17 | DEPENDENCIES | CRITICAL → PASS (đã sửa) | [report](reports/DEPENDENCIES_REPORT.md) | [plan](plans/DEPENDENCIES_PLAN.md) |

## Critical issues

- **Next.js 16.3.4 có lỗ hổng chạy mã từ xa trong `next/og`**, đúng tính năng trang dùng để tạo ảnh chia sẻ. Đã nâng lên 16.3.8. Bản vá chỉ có hiệu lực trên Vercel sau khi deploy xong commit này.

## Other fixes

- Đặt dịch vụ trong ví: trước đây hai lượt đặt cùng lúc có thể cùng trừ một số giờ (đọc rồi ghi đè). Nay chỉ ghi khi `used` vẫn bằng giá trị lúc đọc; xung đột trả 409 và hoàn lại phần đã trừ.

## Remaining manual verification

- **SECRETS_EXPOSURE**: Trong Vercel → Settings → Environment Variables, kiểm tra không biến nào chứa khóa bí mật có tiền tố `NEXT_PUBLIC_`.
- **DATABASE_ACCESS**: Chạy `002_lock_down.sql` trong Supabase → SQL Editor.
- **DATABASE_ACCESS**: Chạy câu kiểm tra ở cuối tệp, kết quả phải rỗng.
- **DATABASE_ACCESS**: Supabase → Advisors → Security: không còn cảnh báo về bảng public.
- **AUTH_MIDDLEWARE**: Không nhập thông tin thật vào ví demo (đã có ghi chú trên trang).
- **SECURITY_HEADERS**: Sau khi Vercel deploy, mở trang → DevTools → Console: không có lỗi "Content Security Policy".
- **SECURITY_HEADERS**: Chạy lại skill vibe-check với https://insuregen-neo.vercel.app từ máy có mạng mở để xác nhận HSTS và header trên tên miền thật.
- **CORS**: Kiểm tra lại trên tên miền Vercel thật.
- **RATE_LIMITING**: Nếu bật đọc giấy ra viện bằng AI, đặt giới hạn chi tiêu trong Anthropic Console.
- **DEPENDENCIES**: Còn 5 cảnh báo HIGH chỉ trong công cụ eslint (gói `braces`), không chạy trên trang. Theo dõi bản cập nhật eslint-config-next.

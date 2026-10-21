# RATE_LIMITING Security Report

## Status: MEDIUM → LOW (đã sửa một phần)

## Findings

- Có giới hạn tần suất trên mọi route ghi (`src/lib/server/rateLimit.ts`).
- Lỗi: lấy IP từ phần tử **đầu** của `X-Forwarded-For` — phần do người gửi tự điền, nên đổi header là vượt giới hạn.
- Khi bảng đếm vượt 5000 mục thì xóa sạch, vô tình mở lại giới hạn cho mọi người.
- Bộ đếm nằm trong bộ nhớ từng máy chủ; trên Vercel mỗi instance đếm riêng nên giới hạn thực tế lỏng hơn con số cấu hình.

## What's at risk

Bot có thể gửi hàng loạt lead giả hoặc gọi API đọc ảnh (tốn phí Claude) bằng cách đổi header.

## What's already secure

Route đọc ảnh vốn chỉ chạy khi có khóa AI và có giới hạn 20 lần/giờ.

## Recommendations

Dùng `x-real-ip` (Vercel đặt, người dùng không sửa được), rồi tới phần tử cuối của `X-Forwarded-For`; dọn mục hết hạn thay vì xóa sạch. Làm thật: chuyển bộ đếm sang Upstash Redis hoặc Vercel WAF rate limiting.

# CSRF Security Report

## Status: MEDIUM → PASS (đã sửa)

## Findings

- Không có cookie phiên (chỉ cookie `fr-lang` lưu ngôn ngữ), nên không có tấn công CSRF chiếm quyền.
- Nhưng các API ghi đọc thân bằng `request.json()` mà không kiểm tra Content-Type: một trang web lạ có thể dùng `<form method=post enctype=text/plain>` để gửi dữ liệu rác vào `/api/leads` (form tư vấn) từ trình duyệt của khách.
- Không route GET nào thay đổi dữ liệu.

## What's at risk

Trang khác có thể đổ lead giả vào danh sách tư vấn qua trình duyệt người truy cập, vượt giới hạn tần suất theo IP.

## What's already secure

Không có route GET ghi dữ liệu; có bẫy bot (`website`) trong form.

## Recommendations

Từ chối request có `Origin` khác host; bắt buộc `Content-Type: application/json` (form HTML không gửi được kiểu này nếu không qua preflight CORS).

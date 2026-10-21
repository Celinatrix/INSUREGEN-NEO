# FILE_UPLOADS Security Report

## Status: MEDIUM → PASS (đã sửa)

## Findings

`/api/claims/extract` nhận ảnh giấy ra viện:
- Trước: tin Content-Type do trình duyệt gửi (giả mạo được); đọc toàn bộ form vào bộ nhớ rồi mới kiểm tra kích thước.
- Ảnh không được lưu (chỉ gửi sang Claude rồi bỏ), nên không có rủi ro tệp độc hại bị phát lại cho người khác.

## What's at risk

Gửi tệp không phải ảnh (hoặc tệp rất lớn) làm tốn bộ nhớ và phí gọi AI.

## What's already secure

Giới hạn 5 MB, chỉ nhận JPEG/PNG/WebP/GIF, không lưu tệp.

## Recommendations

Kiểm tra magic bytes; từ chối sớm theo `Content-Length`.

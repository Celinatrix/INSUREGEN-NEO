# SSRF Security Report

## Status: PASS

## Findings

Ứng dụng không tải URL do người dùng nhập. Lệnh `fetch` phía máy chủ duy nhất gọi địa chỉ cố định `https://api.anthropic.com/v1/messages`.

## What's at risk

Không có.

## What's already secure

Không có tính năng xem trước link, proxy ảnh hay webhook.

## Recommendations

Nếu sau này thêm tính năng nhận URL: chặn IP nội bộ và kiểm tra DNS trước khi tải.

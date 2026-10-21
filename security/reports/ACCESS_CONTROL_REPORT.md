# ACCESS_CONTROL Security Report

## Status: LOW

## Findings

- Các route `/api/wallets/[id]/*` kiểm tra `isUuid(id)` rồi đọc ví theo ID. Không có kiểm tra chủ sở hữu vì không có đăng nhập.
- ID là UUID v4 (122 bit ngẫu nhiên) nên không dò được, nhưng là "link bí mật": ai có link là có quyền.

## What's at risk

Lộ link ví demo → người khác xem/đặt dịch vụ trên ví đó. Dữ liệu giả lập nên tác động thấp.

## What's already secure

UUID ngẫu nhiên; ID sai định dạng trả 404 trước khi chạm cơ sở dữ liệu.

## Recommendations

Khi có tài khoản thật: kiểm tra `wallet.owner_id === user.id` riêng biệt với bước xác thực, trả 403 khi sai.

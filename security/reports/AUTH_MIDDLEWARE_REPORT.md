# AUTH_MIDDLEWARE Security Report

## Status: LOW

## Findings

Trang không có tài khoản người dùng; mọi route đều công khai theo thiết kế. Danh sách:

| Route | Phương thức | Dữ liệu | Bảo vệ |
|---|---|---|---|
| `/api/pricing` | GET | Tính phí, không dữ liệu cá nhân | Không cần |
| `/api/leads` | POST | Ghi tên, SĐT, email | Chỉ ghi, không có route đọc; giới hạn 5 lần/10 phút/IP |
| `/api/wallets` | POST | Tạo ví demo | 30 lần/giờ/IP |
| `/api/wallets/[id]` | GET | Ví demo | ID là UUID ngẫu nhiên (khó đoán) |
| `/api/wallets/[id]/claims` | POST | Hồ sơ demo | UUID + 60 lần/giờ |
| `/api/wallets/[id]/bookings` | POST | Đặt dịch vụ demo | UUID + 120 lần/giờ |
| `/api/claims/extract` | POST | Ảnh giấy ra viện, không lưu | 20 lần/giờ; cần khóa AI |

Không có route quản trị; không có route nào trả về danh sách leads.

## What's at risk

Ví demo không có chủ sở hữu đăng nhập; ai có link ví thì xem được ví đó. Chấp nhận được với dữ liệu giả lập.

## What's already secure

Không có route đọc dữ liệu cá nhân. Leads chỉ xem được trong Supabase.

## Recommendations

Giữ nguyên cho bản thi. Nếu làm thật: thêm Supabase Auth, gắn `wallets.owner_id = auth.uid()`.

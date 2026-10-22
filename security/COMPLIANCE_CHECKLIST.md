# Checklist trước khi public (20 điểm pháp lý và trải nghiệm)

Rà lần đầu: 22/10/2026. **Rà lại toàn bộ danh sách này sau mỗi lần cập nhật lớn** (thêm form, thêm dịch vụ bên thứ ba, thêm công cụ phân tích, đổi cách lưu dữ liệu), cùng lúc với chạy lại vibe-check (`security/AUDIT_SUMMARY.md`).

Căn cứ: Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (hiệu lực 01/01/2026, thay Nghị định 13/2023/NĐ-CP); Luật Kinh doanh bảo hiểm 08/2022/QH15, Điều 35.

| # | Mục | Trạng thái | Ở đâu / ghi chú |
|---|---|---|---|
| 1 | Trang Chính sách bảo mật | ✅ | `/[lang]/chinh-sach-bao-mat`, nội dung ở `src/i18n/legal.ts` |
| 2 | Trang Điều khoản sử dụng | ✅ | `/[lang]/dieu-khoan`: dự án học thuật, không chào bán; thông tin đội và mentor |
| 3 | Chính sách cookie riêng | ✅ | `/[lang]/cookie`: liệt kê `fr-lang`, `fr-theme`, `fr-wallet` |
| 4 | Chính sách hoàn tiền rõ ràng | ✅ | `/[lang]/hoan-phi`: 21 ngày cân nhắc (Điều 35 Luật KDBH), hủy sau 21 ngày, Giờ chăm sóc không đổi tiền; demo không thu tiền |
| 5 | Chỉ thu dữ liệu thật sự cần | ✅ | Form chỉ bắt buộc họ tên và SĐT (email chuyển sang không bắt buộc, migration `003_privacy.sql`); thu nhập ở máy tính phí chỉ tính trên trình duyệt, không gửi lên máy chủ; không thu tên/ảnh của con |
| 6 | Checkbox đồng ý ở mọi form | ✅ | Form tư vấn (bắt buộc, lưu thời điểm và phiên bản `2026-10-22-pdpl-v2`); tải giấy ra viện có ô đồng ý riêng cho dữ liệu sức khỏe, máy chủ từ chối nếu thiếu (`consent=health-data-v1`). Máy tính phí, CIS không lưu gì. Ví demo chỉ lưu dữ liệu giả lập |
| 7 | Khai báo mục đích trước khi thu | ✅ | Dòng "Mục đích" ở đầu form tư vấn; ghi chú gửi ảnh tới Anthropic ngay cạnh nút tải; bảng mục đích trong chính sách bảo mật |
| 8 | Quyền yêu cầu xóa dữ liệu | ✅ | Email bqtkietag123@gmail.com cho dữ liệu form; nút "Xóa ví và bắt đầu lại" xóa hẳn ví trên máy chủ (`DELETE /api/wallets/:id`) |
| 9 | Khai báo bên thứ ba | ✅ | Bảng Vercel, Supabase, Anthropic trong chính sách bảo mật; không có công cụ theo dõi; phông chữ tự host |
| 10 | Ảnh có bản quyền | ✅ | 4 ảnh dịch vụ do nhóm tạo bằng AI; có ghi chú dưới mục Dịch vụ và trong Điều khoản. Phông chữ theo SIL OFL |
| 11 | Không review / testimonial bịa | ✅ | Trang không có đánh giá khách hàng. Câu chuyện nhà anh Minh được gắn nhãn "Kịch bản minh họa" |
| 12 | Không claim "số 1", "tốt nhất" | ✅ | Không có. Tên Gen Re được ghi rõ là đề xuất, chưa có thỏa thuận |
| 13 | Thông tin doanh nghiệp thật | ✅ | Footer và Điều khoản ghi rõ: đội sinh viên INSUREGEN NEO, mentor, thành viên, email; không phải doanh nghiệp bảo hiểm, sản phẩm chưa được cấp phép |
| 14 | Alt text cho mọi ảnh | ✅ | 4 ảnh dịch vụ có mô tả song ngữ; logo SVG là trang trí (`aria-hidden`) đi kèm chữ "Family Reconnect" |
| 15 | Tương phản màu chữ và nền | ✅ | axe-core: 0 lỗi tương phản ở 11 trang, chế độ sáng và tối (đã sửa chip CIS bị mờ) |
| 16 | Form dùng được bằng bàn phím | ✅ | Đã thử chỉ dùng bàn phím: Tab đi đúng thứ tự, Space tích đồng ý, Enter gửi được; bảng cuộn được bằng phím |
| 17 | Nút bấm ghi rõ hành động | ✅ | "Gửi thông tin", "Gửi hồ sơ", "Đặt lịch", "Xóa ví và bắt đầu lại"; nút icon có `aria-label` |
| 18 | Banner cookie chặn tracking trước | ✅ (không cần) | Không có cookie phân tích/quảng cáo nên không có gì để chặn. Nếu thêm sau này: phải có banner và chỉ bật sau khi đồng ý |
| 19 | Luật nơi người dùng sống (GDPR/CCPA) | ✅ | Áp dụng luật Việt Nam; mục 8 chính sách bảo mật: người dùng EU/California gửi yêu cầu qua cùng email |
| 20 | Rà lại sau mỗi lần update lớn | ✅ | Tài liệu này + `security/AUDIT_SUMMARY.md`; chạy `npm test` (gồm test quyền xóa, thu tối thiểu, đồng ý) |

## Việc cần làm thủ công

- Chạy `supabase/migrations/003_privacy.sql` trong Supabase → SQL Editor (sau 001, 002).
- Nhóm cần theo dõi hộp thư bqtkietag123@gmail.com để trả lời yêu cầu xem/xóa dữ liệu.
- Sau cuộc thi: xóa dữ liệu form tư vấn và ví demo như đã cam kết trong chính sách bảo mật (tối đa 12 tháng).
- Nội dung pháp lý do nhóm soạn cho dự án học thuật; nếu sản phẩm được phát hành thật, cần luật sư rà lại.

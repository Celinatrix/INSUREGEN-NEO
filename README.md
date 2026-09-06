# INSUREGEN NEO — Family Care Wallet

Website cho sản phẩm **Family Care Wallet**: bảo hiểm chi trả bằng dịch vụ chăm sóc thật (thay vì tiền mặt) khi cha hoặc mẹ tạm thời không thể chăm con vì lý do sức khỏe. Xây dựng bằng Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.

## Trạng thái hiện tại

Cơ chế sản phẩm (đánh giá chức năng chăm sóc, Care Units, mạng lưới đối tác) được dựng dựa trên tài liệu thiết kế sản phẩm thật của dự án. Số liệu thống kê thị trường, câu chuyện thương hiệu, mốc phát triển và testimonial vẫn là **placeholder hợp lý**, chờ xác nhận/nội dung chính thức.

Dữ liệu sản phẩm nằm ở:
- `src/lib/data/care-wallet.ts` — mô tả sản phẩm, vấn đề giải quyết, 6 hoạt động chăm sóc, cách hoạt động, ví dụ minh họa, mạng lưới đối tác, FAQ, và mục "sắp ra mắt"
- `src/lib/data/content.ts` — số liệu thống kê, trust points, testimonial, bài viết kiến thức
- `src/app/layout.tsx` — metadata SEO mặc định
- `src/components/layout/Footer.tsx` — thông tin pháp lý, liên hệ

**Quan trọng**: mục "Đang nghiên cứu — sắp ra mắt" (bảo vệ người chăm sóc & ông bà cao tuổi, mô hình ADL) tương ứng với phần "Under Consideration" trong tài liệu gốc — **chưa được chốt vào phạm vi sản phẩm**. Trang web chỉ nhắc đến như hướng nghiên cứu, không cho đăng ký. Không đưa tính năng này thành sản phẩm bán chính thức cho đến khi có xác nhận rõ ràng từ đội sản phẩm.

## Design system

Được tạo bằng skill `ui-ux-pro-max` (pattern "Trust & Authority", style "Accessible & Ethical" pha thêm glassmorphism cho khối hero/CTA). Xem chi tiết tại [`design-system/insuregen-neo/MASTER.md`](./design-system/insuregen-neo/MASTER.md).

Token màu & shadow được khai báo trong `src/app/globals.css` (`@theme inline`), dùng trực tiếp qua class Tailwind: `bg-primary`, `text-accent`, `bg-navy`, `text-neo-cyan`, `shadow-card`, `shadow-elevated`...

## Cấu trúc trang

| Route | Nội dung |
|---|---|
| `/` | Trang chủ: hero, vì sao khác biệt, 6 hoạt động chăm sóc + đối tác, quy trình 5 bước, testimonial, CTA |
| `/san-pham` | Trang chi tiết Family Care Wallet: vấn đề, cách hoạt động, ví dụ minh họa, mạng lưới đối tác, đối tượng phù hợp, FAQ |
| `/ve-chung-toi` | Giới thiệu, cam kết, hành trình phát triển, mục "sắp ra mắt" |
| `/kien-thuc` | Bài viết kiến thức về khoảng trống chăm sóc gia đình & Care Units |
| `/lien-he` | Thông tin liên hệ + form nhận tư vấn (chọn độ tuổi con) |
| `/api/quote` (POST) | API nhận yêu cầu tư vấn (hiện chỉ validate + log; **cần nối CRM/email thật**) |

## Bắt đầu phát triển

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Việc cần làm trước khi go-live

1. **Xác nhận số liệu thị trường**: các số liệu trích dẫn (tỷ lệ hộ gia đình, tỷ lệ nhập viện...) lấy từ tài liệu nghiên cứu — cần dẫn nguồn chính thức hoặc xác nhận lại trước khi công bố.
2. **Thay testimonial placeholder**: các trích dẫn khách hàng hiện là minh họa hư cấu — **phải thay bằng phản hồi thật có sự đồng ý của khách hàng** trước khi ra mắt, tránh rủi ro quảng cáo sai sự thật.
3. **Chốt phạm vi mục "sắp ra mắt"**: xác nhận với đội sản phẩm trước khi mở rộng nội dung về bảo vệ người chăm sóc/ông bà cao tuổi.
4. **Nối API `/api/quote` với hệ thống thật**: email (SendGrid/SES), CRM, hoặc lưu database — hiện tại chỉ log ra console.
5. **Ảnh & OG image**: thêm hình ảnh thật, tạo `opengraph-image` cho SEO chia sẻ mạng xã hội.
6. **Tên miền & GitHub**: tạo repo GitHub và deploy (Vercel được khuyến nghị cho Next.js) — cần xác nhận thủ công vì đụng đến tài khoản của bạn.
7. **Rà soát pháp lý**: điều khoản, chính sách bảo mật, số giấy phép kinh doanh hiện là placeholder — cần bộ phận pháp chế cung cấp nội dung chính thức, đặc biệt vì đây là sản phẩm bảo hiểm với cơ chế chi trả mới (Care Units) cần tuân thủ quy định bảo hiểm hiện hành.

## Deploy lên Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Hoặc kết nối repo GitHub với Vercel để tự động deploy mỗi lần push.

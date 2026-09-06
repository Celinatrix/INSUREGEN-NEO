# INSUREGEN NEO

Website bảo hiểm số cho dự án INSUREGEN NEO — xây dựng bằng Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.

## Trạng thái hiện tại

Toàn bộ nội dung sản phẩm, số liệu và câu chuyện thương hiệu trong repo này là **placeholder** (dữ liệu mẫu hợp lý về bảo hiểm), chờ nội dung thật từ dự án. Cấu trúc trang, component và design system đã sẵn sàng — chỉ cần thay dữ liệu.

Nội dung placeholder nằm ở:
- `src/lib/data/products.ts` — 6 sản phẩm bảo hiểm mẫu
- `src/lib/data/content.ts` — số liệu, quy trình, testimonial, bài viết kiến thức
- `src/app/layout.tsx` — metadata SEO mặc định
- `src/components/layout/Footer.tsx` — thông tin pháp lý, liên hệ

## Design system

Được tạo bằng skill `ui-ux-pro-max` (pattern "Trust & Authority", style "Accessible & Ethical" pha thêm glassmorphism cho khối hero/CTA). Xem chi tiết tại [`design-system/insuregen-neo/MASTER.md`](./design-system/insuregen-neo/MASTER.md).

Token màu & shadow được khai báo trong `src/app/globals.css` (`@theme inline`), dùng trực tiếp qua class Tailwind: `bg-primary`, `text-accent`, `bg-navy`, `text-neo-cyan`, `shadow-card`, `shadow-elevated`...

## Cấu trúc trang

| Route | Nội dung |
|---|---|
| `/` | Trang chủ: hero, trust signals, sản phẩm nổi bật, quy trình, testimonial, CTA |
| `/san-pham` | Danh sách toàn bộ sản phẩm bảo hiểm |
| `/san-pham/[slug]` | Chi tiết từng sản phẩm (quyền lợi, FAQ, form báo giá) |
| `/ve-chung-toi` | Giới thiệu, cam kết, mốc phát triển |
| `/kien-thuc` | Danh sách bài viết kiến thức bảo hiểm |
| `/lien-he` | Thông tin liên hệ + form nhận báo giá |
| `/api/quote` (POST) | API nhận yêu cầu báo giá (hiện chỉ validate + log; **cần nối CRM/email thật**) |

## Bắt đầu phát triển

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Việc cần làm trước khi go-live

1. **Thay nội dung thật**: sản phẩm, số liệu, giấy phép kinh doanh, thông tin liên hệ.
2. **Nối API `/api/quote` với hệ thống thật**: email (SendGrid/SES), CRM, hoặc lưu database — hiện tại chỉ log ra console.
3. **Ảnh & OG image**: thêm ảnh sản phẩm/đội ngũ thật, tạo `opengraph-image` cho SEO chia sẻ mạng xã hội.
4. **Tên miền & GitHub**: tạo repo GitHub và deploy (Vercel được khuyến nghị cho Next.js) — cả hai bước này cần xác nhận thủ công vì đụng đến tài khoản của bạn.
5. **Rà soát pháp lý**: nội dung điều khoản, chính sách bảo mật, số giấy phép hiện là placeholder — cần bộ phận pháp chế cung cấp nội dung chính thức.

## Deploy lên Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Hoặc kết nối repo GitHub với Vercel để tự động deploy mỗi lần push.

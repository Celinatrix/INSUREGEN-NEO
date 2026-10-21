# INSUREGEN NEO — Family Reconnect

Ứng dụng web cho **Family Reconnect** (InsuNovate 2026): bảo hiểm nhân thọ chung 10 năm cho cả bố và mẹ (2 tỷ đồng khi tử vong hoặc thương tật toàn bộ vĩnh viễn), kèm quyền lợi bổ trợ **Family Continuity Rider**: trợ cấp 500.000đ/ngày nằm viện và 120 Giờ chăm sóc mỗi bố/mẹ mỗi năm, dùng qua **Family Care Wallet**.

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Supabase · Vercel. Giao diện chuyển từ trang `family-reconnect.html` của repo CODE-GEN.

## Trang

| Đường dẫn | Nội dung |
|---|---|
| `/vi`, `/en` | Trang giới thiệu: vấn đề, bảo vệ liên tục, Lộ trình A/B, dịch vụ, bồi thường 6 bước, minh bạch, hỏi đáp, form tư vấn |
| `/[lang]/tinh-phi` | Tính phí theo tuổi bố, mẹ, con nhỏ nhất (gọi `/api/pricing`) |
| `/[lang]/cis` | Máy tính Điểm Tác động Chăm sóc (CIS) cho Lộ trình B |
| `/[lang]/vi-cham-soc` | Ví dùng thử: gửi hồ sơ bồi thường, AI đọc giấy ra viện, đặt dịch vụ bằng Care Hours |

`/` tự chuyển sang `/vi` hoặc `/en` theo ngôn ngữ trình duyệt.

## API

| Method | Đường dẫn | Việc làm |
|---|---|---|
| POST | `/api/leads` | Lưu đăng ký tư vấn, ghi nhận đồng ý theo Nghị định 13/2023 |
| GET | `/api/pricing?father=34&mother=30&child=3` | Phí nhân thọ + bổ trợ, % thu nhập, thu nhập cần theo ngưỡng 12% |
| POST | `/api/wallets` | Tạo ví dùng thử (kèm 1 giờ tặng hằng năm) |
| GET | `/api/wallets/:id` | Số dư, hạn mức còn lại, lịch sử |
| POST | `/api/wallets/:id/claims` | Đánh giá hồ sơ Lộ trình A hoặc B, cấp giờ và trợ cấp |
| POST | `/api/wallets/:id/bookings` | Đặt dịch vụ, trừ giờ theo quy tắc |
| POST | `/api/claims/extract` | Đọc ảnh giấy ra viện bằng Claude (cần `ANTHROPIC_API_KEY`) |

## Số liệu và quy tắc ở đâu

- `src/lib/product.ts` — **nguồn số liệu duy nhất**: quyền lợi, mức Lộ trình A/B, trọng số CIS, dịch vụ, biểu phí. Sửa ở đây, mọi trang và API tự cập nhật.
- `src/lib/rules.ts` — quy tắc tính giờ, trợ cấp, CIS, trừ giờ khi đặt dịch vụ (dọn nhà ≤ 30% mỗi lần cấp, đưa đón 2 giờ/giờ, FIFO).
- `src/lib/claims.ts` — đánh giá hồ sơ: hạn mức 120 giờ/năm, 30 ngày trợ cấp/năm, loại trừ thai sản, gắn cờ trùng thời gian/ngày tương lai/nằm viện dài bất thường.
- `src/lib/pricing.ts` — định phí. Phí bổ trợ tra bảng mục 4.2.3. **Phí nhân thọ hiện chỉ có 4 cặp tuổi trong báo cáo** (25/25, 34/30, 40/30, 40/40); sẽ tính mọi cặp tuổi khi có file Excel định phí.
- `src/i18n/vi.ts`, `src/i18n/en.ts` — toàn bộ chữ trên trang, song ngữ.

## Chạy trên máy

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # kiểm tra quy tắc theo số liệu báo cáo
```

Không cần cấu hình gì: khi chưa có Supabase, máy chủ lưu tạm trong bộ nhớ.

## Deploy lên Vercel + Supabase

1. **Supabase**: tạo project tại supabase.com → **SQL Editor** → dán `supabase/migrations/001_init.sql` → **Run**. Vào **Project Settings → API**, chép **Project URL** và khóa **service_role**.
2. **Vercel**: vercel.com → **Add New → Project** → chọn repo `INSUREGEN-NEO` → **Deploy**.
3. Trong Vercel → **Settings → Environment Variables**, thêm các biến trong `.env.example`:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (bắt buộc để lưu dữ liệu thật)
   - `NEXT_PUBLIC_SITE_URL` = địa chỉ Vercel của bạn
   - `ANTHROPIC_API_KEY` (không bắt buộc, để bật AI đọc giấy ra viện)
4. **Deployments → Redeploy**. Từ đó mỗi lần push lên `main` sẽ tự deploy.

Khóa `service_role` chỉ nằm ở máy chủ, không bao giờ gửi xuống trình duyệt. Các bảng bật RLS và không mở quyền cho khóa anon.

## Việc cần xác nhận trước khi trình bày

Xem danh sách ở cuối tin nhắn bàn giao hoặc hỏi nhóm sản phẩm: cách đếm ngày nằm viện, trợ cấp cho lần nằm viện dưới 3 ngày, giờ tặng có áp giới hạn dọn nhà không, thông tin liên hệ thật.

Family Reconnect là sản phẩm ý tưởng cho cuộc thi học thuật, chưa được cấp phép kinh doanh. Mọi số liệu là minh họa.

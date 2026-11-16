# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hai nhóm người xem, cùng một trang:

- **Bố mẹ trẻ ở đô thị Việt Nam.** Cả hai cùng đi làm, con nhỏ dưới 12 tuổi, ông bà thường ở xa. Họ đọc trang để hiểu một câu hỏi: nếu bố hoặc mẹ phải nằm viện thì ai đón con, nấu cơm, giữ nhà, và sản phẩm lo được gì cho việc đó. (Suy luận, chưa xác nhận: nhiều người sẽ đọc trên điện thoại.)
- **Ban giám khảo InsuNovate 2026.** Họ chấm sản phẩm. Ngoài câu chuyện, họ cần thấy độ chặt của định phí, quy tắc quyền lợi và tuân thủ pháp lý.

Trang viết cho bố mẹ như với một sản phẩm thật. Bằng chứng chuyên môn (cơ sở định phí, bảng minh họa, trang pháp lý) có sẵn ở các trang riêng cho giám khảo.

## Product Purpose

Family Reconnect là sản phẩm bảo hiểm ý tưởng của đội INSUREGEN NEO cho cuộc thi học thuật InsuNovate 2026. Nó bảo vệ cả bố và mẹ trong một hợp đồng, và lo phần bảo hiểm truyền thống bỏ qua: giữ cho gia đình vận hành khi bố hoặc mẹ nằm viện hoặc hồi phục tại nhà.

Trang web giải thích sản phẩm, cho tính phí theo tuổi, cho tự tính điểm CIS, cho dùng thử Ví Chăm sóc, và nhận đăng ký tư vấn.

Thành công là khi người đọc hiểu được "tiền viện phí có người lo, còn việc nhà thì chưa", tin vào các con số, và giám khảo thấy sản phẩm khả thi về định phí và pháp lý.

## Positioning

Không phải chỉ trả tiền: sản phẩm cấp **Giờ chăm sóc** vào **Ví Chăm sóc Gia đình** để đặt người thật đến giúp (trông trẻ, nấu ăn, đưa đón, dọn nhà) từ nhà cung cấp đã ký hợp đồng. Một hồ sơ bồi thường cho cả trợ cấp tiền mặt lẫn giờ chăm sóc.

Hai lộ trình nhận giờ: Lộ trình A theo số ngày nằm viện, Lộ trình B theo Điểm Tác động Chăm sóc (CIS) khi hồi phục tại nhà mà không nhập viện.

## Operating Context

- Kịch bản xuyên suốt: nhà anh Minh ở Quận 7, TP.HCM; chị Lan nhập viện; bé Na 4 tuổi. Kịch bản này dùng cho phần "Vấn đề", thẻ ví ở hero và các ví dụ.
- Song ngữ: tiếng Việt là mặc định, tiếng Anh đầy đủ. Hai bản phải nói cùng một điều.
- Trang con: Tính phí, Tính điểm CIS, Dùng thử ví, Cơ sở định phí, bốn trang pháp lý.

## Capabilities and Constraints

- **Nguồn số liệu duy nhất:** `src/lib/product.ts`. Mọi con số trên trang phải lấy từ đây hoặc từ các hàm trong `src/lib/rules.ts` và `src/lib/pricing.ts`, không gõ cứng.
- Hợp đồng chính: nhân thọ chung bố và mẹ, 2 tỷ đồng, 10 năm. Bổ trợ: Family Continuity Rider, tái tục hằng năm, 500.000đ/ngày nằm viện (tối đa 30 ngày mỗi bố/mẹ mỗi năm), tối đa 120 Giờ chăm sóc mỗi bố/mẹ mỗi năm, mỗi lần cấp có hiệu lực 90 ngày.
- Điều kiện tham gia: bố và mẹ 25–40 tuổi, con nhỏ nhất dưới 12 tuổi, thu nhập ròng hộ từ 200 triệu đồng/năm.
- Thuật ngữ cố định: Giờ chăm sóc (Care Hours), Ví Chăm sóc Gia đình (Family Care Wallet), Family Continuity Rider, Lộ trình A, Lộ trình B, Điểm CIS, Protect · Recover · Care · Continue.
- Kỹ thuật: Next.js 16 App Router, TypeScript, Tailwind v4, Supabase, Vercel. CSP theo nonce trong `src/proxy.ts`; mọi script và style mới phải chạy được dưới CSP đó.
- Ví dùng thử không có tài khoản; ai có link ví thì xem được. Không mời người dùng nhập thông tin thật.

## Brand Commitments

- Tên sản phẩm **Family Reconnect**, đội **INSUREGEN NEO**. Logo ở `public/logo.svg`.
- Giọng văn tiếng Việt gần gũi, nói chuyện với bố mẹ trẻ: câu ngắn, cụ thể, dùng ví dụ đời thường, không thuật ngữ bảo hiểm khi chưa giải thích.
- Ràng buộc nhận diện người dùng đã chốt: bảng màu **navy và vàng**, **Fraunces** cho tiêu đề, **Be Vietnam Pro** cho chữ thường. Giao diện đang chạy (`src/app/globals.css`) là chuẩn hiện hành.
- `design-system/insuregen-neo/MASTER.md` (6/9/2026, xanh dương + xanh lá) là bản lỗi thời của site cũ, **không** phải nguồn chuẩn. Sẽ được thay khi tạo DESIGN.md.

## Evidence on Hand

- Số liệu thị trường trong README và `MARKET` của `product.ts`: khảo sát 600 người trưởng thành đô thị, VHLSS 2024, tính toán của nhóm (55% sống hai thế hệ, 63% khả năng nhập viện trong 10 năm, 6,7 ngày nằm viện trung bình, 2,9–3,5 triệu đồng trông trẻ mỗi lần nằm viện).
- Định phí đối chiếu với file Excel của nhóm, có bảng ở trang Cơ sở định phí; 34 bài test khóa các con số.
- Ảnh dịch vụ ở `public/images/` là ảnh minh họa đội tạo bằng AI, có ghi chú trên trang; không phải ảnh nhà cung cấp thật.
- **Không có:** khách hàng thật, lời chứng thực, đánh giá, logo đối tác thật, số người dùng, giải thưởng. Không được bịa những thứ này.

## Product Principles

1. **Trung thực trước hết.** Đây là sản phẩm ý tưởng, chưa được cấp phép. Nhãn "sản phẩm ý tưởng, số liệu minh họa" luôn hiện rõ; không nói như thể đã bán được.
2. **Con số đi từ một nguồn.** Mọi quyền lợi, phí và giờ đều tính từ `product.ts`, để trang, API và báo cáo không bao giờ lệch nhau.
3. **Nói bằng chuyện nhà, rồi mới đến điều khoản.** Mở bằng việc đón con, bữa cơm, ngày nghỉ làm; điều khoản và định phí đến sau, cho ai cần.
4. **Nói trước điều không chi trả.** Loại trừ, thời gian chờ và hạn mức được đặt rõ ràng, không giấu trong chữ nhỏ.
5. **Hai ngôn ngữ, một sự thật.** Bản tiếng Việt và tiếng Anh luôn khớp nhau về số liệu và cam kết.

## Accessibility & Inclusion

- Nút và vùng chạm tối thiểu 44px; có giao diện sáng, tối, và tôn trọng `prefers-reduced-motion` (đã có trong mã).
- Mọi trang phải đọc và thao tác được ở 375px.
- Tuân thủ Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 cho form và ví dùng thử: chỉ bắt buộc tên và số điện thoại, ghi nhận đồng ý, cho xóa dữ liệu.

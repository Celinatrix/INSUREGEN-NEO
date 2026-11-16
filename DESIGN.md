---
name: Family Reconnect
description: Khi bố mẹ cần nghỉ ngơi, gia đình vẫn vận hành.
colors:
  evening-navy: "#1B2E52"
  on-navy: "#FFFFFF"
  on-navy-muted: "#C9D2E3"
  porch-gold: "#C9982E"
  on-gold: "#14223D"
  lamp-gold: "#E3BB63"
  gold-wash: "#F6ECD3"
  gold-ink: "#7A5A12"
  care-green: "#1D7550"
  care-green-wash: "#DCEFE4"
  page: "#F7F8FA"
  surface: "#FFFFFF"
  surface-sunk: "#EFF1F5"
  hairline: "#E2E5EC"
  ink: "#14223D"
  ink-secondary: "#44506A"
  ink-muted: "#5B6580"
typography:
  display:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "clamp(38px, 6vw, 68px)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.02em"
  page-display:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "clamp(34px, 5vw, 56px)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "clamp(30px, 4.4vw, 48px)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  subhead:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "clamp(26px, 3.4vw, 36px)"
    fontWeight: 500
    lineHeight: 1.18
  statement:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "clamp(22px, 2.6vw, 30px)"
    fontWeight: 500
    lineHeight: 1.3
  legal-heading:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "clamp(22px, 2.4vw, 26px)"
    fontWeight: 500
    lineHeight: 1.18
  title-lg:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.18
  title:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.18
  figure-hero:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "clamp(52px, 7vw, 72px)"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "tnum"
  figure-xl:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "52px"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "tnum"
  figure:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "30px"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "tnum"
  figure-sm:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "tnum"
  lead:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(18px, 1.6vw, 20px)"
    fontWeight: 400
    lineHeight: 1.6
  item:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
  phone-title:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.3
  phone-body:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  phone-micro:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
  phone-figure:
    fontFamily: "Fraunces Variable, Fraunces, Lora, Georgia, serif"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  control: "12px"
  card: "14px"
  panel: "22px"
  device: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(64px, 9vw, 120px)"
  container: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.porch-gold}"
    textColor: "{colors.on-gold}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "48px"
  tag:
    backgroundColor: "{colors.gold-wash}"
    textColor: "{colors.gold-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  tag-ok:
    backgroundColor: "{colors.care-green-wash}"
    textColor: "{colors.care-green}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  input:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "48px"
  care-wallet:
    backgroundColor: "{colors.evening-navy}"
    textColor: "{colors.on-navy}"
    rounded: "{rounded.device}"
    padding: "24px"
---

# Design System: Family Reconnect

## Overview

**Creative North Star: "Ngọn đèn hiên nhà" (The Porch Light)**

Navy là buổi tối của một gia đình đang có chuyện: mẹ nằm viện, bố chạy qua lại, con chưa ai đón. Vàng là ngọn đèn hiên vẫn sáng trong buổi tối đó, dấu hiệu rằng việc nhà vẫn có người lo. Cả hệ thiết kế dựng trên cặp này: nền yên, sáng có chủ đích, và ánh vàng chỉ bật ở nơi gia đình được đỡ một tay.

Giao diện ấm, bình tĩnh và đáng tin hơn là náo nhiệt. Mật độ vừa phải, nhiều khoảng thở, tiêu đề serif Fraunces nói như người thật, chữ thường Be Vietnam Pro đọc dễ ở tiếng Việt có dấu. Bề mặt phẳng, phân lớp bằng nền và đường viền mảnh; chỉ những vật thể "cầm được" như thẻ Ví Chăm sóc và điện thoại minh họa mới nổi lên khỏi trang.

Trang có giao diện sáng mặc định và giao diện tối đầy đủ (theo hệ thống hoặc nút chuyển). Ở giao diện tối, buổi tối trở thành nền trang và ngọn đèn sáng hơn một bậc.

**Key Characteristics:**
- Navy cho những khoảnh khắc nặng ký (Ví, kết quả tính phí, phần đăng ký cuối trang), vàng cho hành động chính và con số quan trọng
- Serif ấm cho tiêu đề và con số lớn, sans rõ ràng cho mọi thứ còn lại
- Phẳng, viền mảnh, bóng chỉ dành cho vật thể nổi
- Bo tròn mềm, nút dạng viên thuốc, vùng chạm tối thiểu 44px
- Chuyển động ngắn và lặng, không lặp, không nảy

## Colors

Một ramp trung tính ngả xanh navy, một vàng ấm làm điểm nhấn, một xanh lá chỉ để báo điều tốt.

Tên biến trong mã là di sản của bản cũ: `--coral*` thực chất là các sắc vàng. Giữ tên biến, dùng tên mô tả dưới đây khi nói về màu.

### Primary
- **Evening Navy** (`evening-navy`): nền của các khối nặng ký: thẻ Ví Chăm sóc, cột kết quả tính phí, phần đăng ký cuối trang, trạng thái được chọn của nút ngôn ngữ, bước đang chạy. Chữ trên nó dùng `on-navy` và `on-navy-muted`.
- **Porch Gold** (`porch-gold`): nút hành động chính, viền focus, dấu chấm phân cách, thanh tiến độ giờ. Chữ trên nó luôn là `on-gold` (navy đậm), không bao giờ là trắng.
- **Lamp Gold** (`lamp-gold`): vàng sáng hơn dùng **trên nền navy**: ô đã nạp của thước giờ, số tiền trong Ví, nút chính đặt trên navy, nhãn "minh họa".
- **Gold Wash / Gold Ink** (`gold-wash`, `gold-ink`): nền và chữ của nhãn nhỏ, dòng được đánh dấu trong bảng, khung lưu ý. `gold-ink` cũng là màu chữ nhấn trong tiêu đề hero và các con số lớn trên nền sáng.

### Secondary
- **Care Green** (`care-green`, `care-green-wash`): chỉ mang nghĩa "được chi trả / đã duyệt / đã xong": dấu tích, trạng thái đã duyệt, bước đã qua, công tắc bật, số giờ cộng vào. Không dùng để trang trí.

### Neutral
- **Page** (`page`): nền trang.
- **Surface** (`surface`): thẻ, hộp, form.
- **Surface Sunk** (`surface-sunk`): nền các phần xen kẽ (`.sec-alt`) và ô phụ.
- **Hairline** (`hairline`): mọi đường viền và đường chia.
- **Ink / Ink Secondary / Ink Muted** (`ink`, `ink-secondary`, `ink-muted`): ba vai trò chữ: chính, phụ (đoạn mô tả), mờ (chú thích, nhãn nhỏ). Không thêm vai trò thứ tư.

### Named Rules
**The One Lamp Rule.** Mỗi màn hình chỉ có một hành động vàng nổi bật. Nếu hai nút cùng vàng cạnh nhau, một nút phải chuyển sang ghost.

**The Gold-on-Navy Rule.** Trên nền navy dùng `lamp-gold`; trên nền sáng dùng `porch-gold` cho nền nút và `gold-ink` cho chữ. Vàng không bao giờ làm màu chữ trên nền trắng ở cỡ nhỏ.

**The Green Means Paid Rule.** Xanh lá chỉ xuất hiện khi có điều tốt đã xảy ra. Không dùng xanh lá cho nút, liên kết hay trang trí.

## Typography

**Display Font:** Fraunces Variable (fallback Fraunces, Lora, Georgia)
**Body Font:** Be Vietnam Pro (fallback Segoe UI, system-ui)

**Character:** Fraunces mềm và có hơi ấm của chữ in sách, cho tiêu đề nói như một lời trấn an. Be Vietnam Pro được vẽ cho tiếng Việt, dấu rõ và đều ở cỡ nhỏ, nên mọi chữ chạy, nhãn và form đều dùng nó.

### Hierarchy
Một thang cố định; không thêm cỡ nằm giữa hai bậc.

- **Display** (500, `clamp(38px, 6vw, 68px)`, 1.18): tiêu đề hero, một lần mỗi trang. Phần nhấn của câu đổi sang `gold-ink`, không in nghiêng. Trang con dùng **Page display** `clamp(34px, 5vw, 56px)`.
- **Headline** (500, `clamp(30px, 4.4vw, 48px)`, 1.18): tiêu đề mỗi phần và phần đăng ký cuối trang.
- **Subhead** (500, `clamp(26px, 3.4vw, 36px)`): tiêu đề nhóm bên trong trang con (bảng minh họa, độ nhạy, cơ sở định phí). **Statement** `clamp(22px, 2.6vw, 30px)` cho câu kết của phần Vấn đề.
- **Title** (500, 22px) và **Title large** (500, 26px): tiêu đề thẻ; 26px cho hộp lớn và thông báo thành công.
- **Figures** (Fraunces 500, line-height 1, `tabular-nums`): 26 · 30 · 52px và `clamp(52px, 7vw, 72px)` cho con số chính của thẻ Ví và kết quả CIS.
- **Lead** (400, `clamp(18px, 1.6vw, 20px)`, 1.6, tối đa 62ch): đoạn mở dưới tiêu đề, màu `ink-secondary`.
- **Item** (600, 18px): tiêu đề hàng trong danh sách: câu hỏi FAQ, bước bồi thường, nút trong stepper.
- **Body** (400, 16px, 1.6): mọi chữ chạy, kể cả bên trong thẻ và bảng.
- **Label** (500, 14px): nhãn mục, nhãn nhỏ, tiêu đề bảng, chú thích, liên kết điều hướng và chân trang. Viết hoa chữ đầu, không giãn chữ.
- **Micro** (500, 12px): trạng thái và ghi chú "Minh họa" trên vật thể.
- **Phone** (11 · 13 · 15 · 40px): thang thu nhỏ chỉ dùng bên trong điện thoại minh họa.

Chữ chạy dùng `text-wrap: pretty`, tiêu đề dùng `text-wrap: balance`.

### Named Rules
**The Sentence Case Rule.** Không `text-transform: uppercase` và không `letter-spacing` dương trên nhãn. Chữ hiện đúng như người viết.

**The 600 Ceiling Rule.** Trọng lượng chữ là 400, 500 và 600. Không dùng 700 trở lên; thứ bậc đến từ cỡ chữ, font và màu.

**The Fixed Ramp Rule.** Cỡ chữ chỉ lấy từ thang trên. Cần nhấn mạnh hơn thì đổi vai trò, không thêm 1px.

**The Numbers Are Figures Rule.** Số tiền, số giờ, số ngày luôn `tabular-nums` và theo một định dạng: `500.000đ` và `2 tỷ đồng` ở tiếng Việt, `VND 500,000` ở tiếng Anh.

## Layout

Khung nội dung tối đa 1200px, lề hai bên `clamp(16px, 4vw, 40px)`. Mỗi phần có khoảng đệm dọc `clamp(64px, 9vw, 120px)`, xen kẽ nền `page` và `surface-sunk` để người đọc thấy ranh giới phần mà không cần đường kẻ.

Khoảng cách theo lưới 4px: 4, 8, 12, 16, 20, 24, 32. Bước 2px chỉ dùng để căn trong control nhỏ. Thẻ đệm 20px, hộp lớn 24px hoặc `clamp(20px, 3vw, 32px)`.

Bố cục dạng tách đôi không đối xứng: hero 1.15fr chữ / 0.85fr thẻ Ví; công cụ tính 1.1fr / 0.9fr; câu hỏi thường gặp 0.8fr / 1.2fr. Dưới 900px mọi lưới gộp thành một cột theo thứ tự đọc, hình minh họa đi sau nút hành động.

Mốc chuyển: 1400px (menu thu vào nút), 900px (một cột), 560px (ẩn nút "Tính phí" ở header), 400px (ẩn chuyển ngôn ngữ trên header). Mọi trang phải dùng được ở 375px mà không cuộn ngang.

## Elevation & Depth

Phẳng mặc định. Chiều sâu đến từ bậc nền (`page` → `surface` → `surface-sunk`) và đường viền mảnh `hairline` 1px. Header dính trên cùng dùng nền trang 88% với blur nhẹ.

### Shadow Vocabulary
- **Lift** (`0 1px 2px rgb(20 34 61 / .06), 0 10px 30px rgb(20 34 61 / .08)`): thẻ đang được chọn (lớp bảo vệ đang hiệu lực, bước bồi thường hiện tại). Đây là phản hồi trạng thái, không phải trang trí.
- **Object** (`0 24px 60px rgb(20 34 61 / .28)`): vật thể cầm được nổi trên trang: thẻ Ví Chăm sóc, điện thoại minh họa.

### Named Rules
**The Flat-By-Default Rule.** Bề mặt phẳng khi nghỉ. Bóng chỉ xuất hiện khi một thứ được chọn, hoặc khi nó là vật thể thật.

**The Night Has No Shadows Rule.** Ở giao diện tối, bỏ bóng; vật thể nổi dùng viền trắng 8% thay cho bóng.

## Shapes

Bo tròn mềm, lồng nhau đúng toán: control 12px, thẻ 14px, hộp 22px, vật thể 24px. Bo trong bằng bo ngoài trừ khoảng đệm, không nhỏ hơn 4px. Nút và nhãn là viên thuốc (999px); vòng số bước và nút nhỏ là hình tròn. Đường viền 1px cho bề mặt, 1.5px cho control và nút ghost.

## Components

### Buttons
Mềm và chắc chắn: to, dễ bấm, phản hồi lặng.
- **Shape:** viên thuốc (999px), cao tối thiểu 48px (44px ở cỡ nhỏ), chữ 16px trọng lượng 600.
- **Primary:** nền `porch-gold`, chữ `on-gold`. Trên nền navy dùng `lamp-gold`.
- **Ghost:** nền trong suốt, viền 1.5px màu chữ.
- **Hover / Focus / Press:** hover làm nền nút chính đậm hơn (trộn 12% `ink`), ghost lên nền `surface`. Focus là viền vàng 3px cách 3px. Nhấn thu nhỏ còn 0.98. Không bóng màu, không nhấc nút lên.

### Tags and Status
- **Tag:** viên thuốc nhỏ, chữ 14px trọng lượng 500, nền `gold-wash`, chữ `gold-ink`. Bản xanh `care-green-wash` / `care-green` cho "đang bảo vệ".
- **Status:** đã duyệt (xanh), đang xem xét (vàng), từ chối (trung tính). Không màu nào khác.

### Cards / Containers
- **Corner Style:** 14px cho thẻ, 22px cho hộp và panel.
- **Background:** `surface` trên nền `page`; `page` cho lớp bên trong thẻ.
- **Shadow Strategy:** không bóng khi nghỉ (xem Elevation & Depth).
- **Border:** 1px `hairline`; thẻ được chọn đổi viền sang `care-green`.
- **Internal Padding:** 20px thẻ, 24px hộp.

### Inputs / Fields
- **Style:** cao 48px, đệm 10px 14px, viền 1.5px `hairline`, nền `page`, bo 12px, chữ 16px (để Safari không phóng to).
- **Focus:** viền vàng 3px cách 1px.
- **Error:** viền `porch-gold`, thông báo lỗi 14px màu `gold-ink` ngay dưới ô. Chỉ bắt buộc tên và số điện thoại.
- **Stepper, công tắc, nút chia đoạn:** cùng họ control 12–14px; công tắc bật màu `care-green`; nút chia đoạn được chọn nền navy.

### Navigation
- Header dính, cao 68px, logo + tên sản phẩm 18px trọng lượng 600, liên kết 14px màu `ink-secondary`, hover lên `ink` trên nền `surface`.
- Trang hiện tại: chữ `ink` trên nền `surface`. Chuyển ngôn ngữ dạng hai nút, nút đang chọn nền navy.
- Dưới 1400px các liên kết thu vào nút menu. Từ 1401px liên kết "Tính phí" ẩn đi vì nút vàng "Tính phí" đã có sẵn; nó vẫn nằm trong menu thu gọn.

### Care Wallet (signature)
Vật thể đặc trưng của sản phẩm: một tấm thẻ navy bo 24px, đệm 24px, bóng Object. Con số giờ còn lại bằng Fraunces lớn, thước giờ là dãy ô (một ô một giờ) với ô đã nạp màu `lamp-gold`, các dòng sự kiện trên nền trắng 8%, các dịch vụ là viên thuốc viền trắng 22%, và một dòng "Minh họa" ở cuối. Mọi số trên thẻ tính từ quy tắc sản phẩm, không gõ cứng.

### Claims Phone
Điện thoại minh họa 280px, khung `#0E1626`, màn hình nền giấy ấm `#FAF6F0` với thẻ trắng và viền `#E3D8C8`: cảnh dùng ví trong đời thật, ấm hơn nền trang một bậc.

## Do's and Don'ts

### Do:
- **Do** dùng navy cho những khối mang nhiều thông tin nhất (Ví, kết quả phí, form cuối trang) và để phần còn lại sáng, lặng.
- **Do** đặt mọi con số bằng Fraunces với `tabular-nums` khi nó là nhân vật chính của khối.
- **Do** giữ khoảng cách trên lưới 4px và bo tròn lồng nhau đúng toán (12 / 14 / 22 / 24).
- **Do** đặt rõ chữ "Minh họa" trên mọi vật thể có số liệu giả định.
- **Do** dùng chuyển động 0.15–0.2s `ease` cho hover và trạng thái, và chỉ một lần hiện dần khi cuộn (0.6s).

### Don't:
- **Don't** viết hoa toàn bộ nhãn hay giãn chữ (`text-transform: uppercase`, `letter-spacing` dương).
- **Don't** dùng chữ nghiêng để nhấn, hay trọng lượng 700 trở lên.
- **Don't** dùng gradient chuyển giữa hai sắc (xanh lá → vàng → navy), bóng màu vàng, hay quầng sáng.
- **Don't** dùng `transition: all` hay phóng to phần tử khi được chọn.
- **Don't** dùng bảng màu xanh dương + xanh lá của `design-system/insuregen-neo/MASTER.md`; file đó đã lỗi thời.
- **Don't** thêm logo đối tác, lời chứng thực hay số khách hàng không có thật.

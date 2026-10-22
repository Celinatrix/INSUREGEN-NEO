// Nội dung 4 trang pháp lý (song ngữ). Sửa ở đây, trang tự cập nhật.
// Căn cứ: Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (cùng hiệu lực 01/01/2026,
// Nghị định 356 thay Nghị định 13/2023/NĐ-CP); Luật Kinh doanh bảo hiểm số 08/2022/QH15 (Điều 35, thời gian cân nhắc).
import type { Locale } from "./index";

export const CONTACT_EMAIL = "bqtkietag123@gmail.com";
export const LEGAL_UPDATED = "2026-10-22";

export const LEGAL_SLUGS = ["chinh-sach-bao-mat", "dieu-khoan", "cookie", "hoan-phi"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export type Block = string | { list: string[] } | { table: string[][] };
export type LegalPage = { title: string; description: string; intro: string; sections: { h: string; body: Block[] }[] };

const vi: Record<LegalSlug, LegalPage> = {
  "chinh-sach-bao-mat": {
    title: "Chính sách bảo mật",
    description: "Family Reconnect thu thập dữ liệu gì, để làm gì, lưu ở đâu, bao lâu, và cách bạn yêu cầu xem hoặc xóa.",
    intro:
      "Trang này giải thích dữ liệu cá nhân mà trang Family Reconnect thu thập, mục đích, nơi lưu, thời gian lưu và quyền của bạn, theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP.",
    sections: [
      {
        h: "1. Ai chịu trách nhiệm",
        body: [
          "Bên kiểm soát và xử lý dữ liệu là đội sinh viên INSUREGEN NEO, tác giả dự án Family Reconnect tại cuộc thi InsuNovate 2026. Đây là dự án học thuật, không phải doanh nghiệp bảo hiểm.",
          `Liên hệ về dữ liệu cá nhân: ${CONTACT_EMAIL}.`,
        ],
      },
      {
        h: "2. Dữ liệu chúng tôi thu thập và mục đích",
        body: [
          "Chúng tôi chỉ thu thập những gì cần cho từng chức năng, và nói rõ mục đích ngay tại nơi bạn nhập:",
          {
            table: [
              ["Chức năng", "Dữ liệu", "Mục đích", "Bắt buộc?"],
              ["Form đăng ký tư vấn", "Họ tên, số điện thoại", "Gọi lại tư vấn", "Có"],
              ["", "Email; tuổi bố, mẹ, con nhỏ nhất; thành phố", "Gửi tài liệu, ước tính phí trước khi gọi", "Không"],
              ["", "Thời điểm và phiên bản lời đồng ý", "Chứng minh bạn đã đồng ý", "Tự động"],
              ["Ví dùng thử", "Tuổi con nhỏ nhất, hồ sơ giả lập (ngày nằm viện, mức độ), lịch đặt", "Chạy bản demo", "Có, để dùng demo"],
              ["Đọc giấy ra viện bằng AI", "Ảnh giấy ra viện", "Đọc ngày nhập viện, ra viện, giờ ICU", "Không, chỉ khi bạn tự tải"],
              ["Máy tính phí", "Tuổi, nhóm nghề, hút thuốc", "Tính phí", "Không lưu"],
              ["Vận hành", "Địa chỉ IP, thời điểm, đường dẫn truy cập", "Chống lạm dụng, sửa lỗi", "Tự động"],
            ],
          },
          "Thu nhập bạn nhập ở máy tính phí chỉ được tính ngay trên trình duyệt, không gửi lên máy chủ. Trang không thu tên hay ảnh của con bạn.",
        ],
      },
      {
        h: "3. Dữ liệu sức khỏe",
        body: [
          "Ảnh giấy ra viện là dữ liệu sức khỏe, thuộc nhóm dữ liệu cá nhân nhạy cảm. Ảnh chỉ được gửi khi bạn đánh dấu ô đồng ý riêng ngay cạnh nút tải ảnh.",
          "Ảnh được gửi tới Anthropic, PBC (Hoa Kỳ) qua API để đọc ngày tháng, rồi bị bỏ. Máy chủ Family Reconnect không lưu ảnh. Anthropic xử lý dữ liệu theo chính sách dữ liệu API của họ.",
          "Vì đây là bản demo, hãy dùng giấy tờ mẫu hoặc che tên và chẩn đoán trước khi tải. Không tải giấy tờ của người khác.",
        ],
      },
      {
        h: "4. Nơi lưu và bên thứ ba",
        body: [
          "Chúng tôi không bán dữ liệu, không dùng công cụ phân tích, quảng cáo hay theo dõi của bên thứ ba. Phông chữ được tải từ chính trang.",
          {
            table: [
              ["Bên cung cấp", "Vai trò", "Dữ liệu nhận"],
              ["Vercel Inc. (Hoa Kỳ)", "Lưu trữ và chạy trang web", "Nhật ký truy cập kỹ thuật"],
              ["Supabase Inc.", "Cơ sở dữ liệu", "Form tư vấn, dữ liệu ví dùng thử"],
              ["Anthropic, PBC (Hoa Kỳ)", "AI đọc giấy ra viện", "Ảnh bạn chủ động tải lên"],
            ],
          },
          "Các bên này có thể xử lý dữ liệu ngoài Việt Nam. Bằng việc dùng chức năng tương ứng, bạn được thông báo về việc chuyển dữ liệu này.",
        ],
      },
      {
        h: "5. Thời gian lưu",
        body: [
          {
            list: [
              "Form tư vấn: đến khi kết thúc cuộc thi InsuNovate 2026, tối đa 12 tháng kể từ ngày gửi, hoặc sớm hơn khi bạn yêu cầu xóa.",
              "Ví dùng thử: đến khi bạn bấm \"Xóa ví\" trên trang, hoặc khi nhóm dọn dữ liệu demo sau cuộc thi.",
              "Ảnh giấy ra viện: không lưu trên máy chủ của chúng tôi.",
              "Nhật ký truy cập: theo thời hạn mặc định của Vercel.",
            ],
          },
        ],
      },
      {
        h: "6. Quyền của bạn",
        body: [
          "Theo Luật Bảo vệ dữ liệu cá nhân, bạn có quyền: được biết về việc xử lý dữ liệu; đồng ý hoặc rút lại đồng ý; xem và nhận bản sao; yêu cầu chỉnh sửa; yêu cầu xóa; yêu cầu hạn chế xử lý; phản đối xử lý; khiếu nại, tố cáo.",
          `Gửi yêu cầu tới ${CONTACT_EMAIL}, ghi rõ số điện thoại hoặc email đã dùng ở form để chúng tôi tìm đúng dữ liệu. Chúng tôi xử lý sớm nhất có thể, trong thời hạn pháp luật quy định. Với ví dùng thử, bạn tự xóa ngay bằng nút \"Xóa ví\".`,
          "Rút lại đồng ý không ảnh hưởng đến việc xử lý đã diễn ra trước đó.",
        ],
      },
      {
        h: "7. Bảo vệ dữ liệu",
        body: [
          "Kết nối luôn mã hóa HTTPS. Khóa truy cập cơ sở dữ liệu chỉ nằm ở máy chủ. Mọi bảng bật kiểm soát truy cập theo dòng (RLS) và chặn truy cập công khai. Trang có chính sách bảo mật nội dung (CSP) chống chèn mã độc và được kiểm tra bảo mật trước khi công khai.",
        ],
      },
      {
        h: "8. Người dùng ngoài Việt Nam",
        body: [
          "Trang hướng tới gia đình tại Việt Nam và áp dụng pháp luật Việt Nam. Nếu bạn ở Liên minh châu Âu (GDPR) hoặc California (CCPA), bạn vẫn có thể gửi yêu cầu xem, sửa hoặc xóa dữ liệu qua email trên; chúng tôi xử lý như với mọi người dùng khác.",
        ],
      },
      { h: "9. Thay đổi chính sách", body: ["Khi chính sách thay đổi, ngày cập nhật ở đầu trang sẽ đổi theo. Nếu thay đổi mục đích sử dụng dữ liệu, chúng tôi sẽ xin lại sự đồng ý."] },
    ],
  },
  "dieu-khoan": {
    title: "Điều khoản sử dụng",
    description: "Điều kiện dùng trang Family Reconnect: dự án học thuật, số liệu minh họa, không phải lời chào bán bảo hiểm.",
    intro: "Khi dùng trang Family Reconnect, bạn đồng ý với các điều khoản dưới đây. Vui lòng đọc kỹ, nhất là mục 1.",
    sections: [
      {
        h: "1. Đây là dự án học thuật",
        body: [
          "Family Reconnect là ý tưởng sản phẩm bảo hiểm do đội sinh viên INSUREGEN NEO xây dựng cho cuộc thi InsuNovate 2026. Sản phẩm chưa được Bộ Tài chính phê duyệt, chưa có doanh nghiệp bảo hiểm nào phát hành, và không được chào bán.",
          "Phí, quyền lợi, đối tác (ví dụ doanh nghiệp tái bảo hiểm, nhà cung cấp dịch vụ) và quy trình trên trang là đề xuất và minh họa. Trang không phải tư vấn tài chính, pháp lý hay y tế.",
        ],
      },
      {
        h: "2. Ví dùng thử",
        body: [
          "Ví dùng thử là bản mô phỏng. Giờ chăm sóc, trợ cấp và lịch đặt trong ví không có giá trị thật, không đổi được thành tiền và không tạo ra nghĩa vụ chi trả nào. Trang không thu tiền của bạn.",
          "Ai có đường dẫn ví thì xem được ví đó. Đừng nhập thông tin thật của bạn hay người khác.",
        ],
      },
      {
        h: "3. Sử dụng hợp lệ",
        body: [
          {
            list: [
              "Không gửi thông tin của người khác khi chưa được họ đồng ý.",
              "Không gửi tự động hàng loạt, dò quét lỗ hổng hay làm quá tải trang.",
              "Không tải lên nội dung vi phạm pháp luật hoặc mã độc.",
            ],
          },
          "Chúng tôi có thể chặn truy cập vi phạm các điều trên.",
        ],
      },
      {
        h: "4. Sở hữu trí tuệ",
        body: [
          "Nội dung, mô hình định phí và mã nguồn thuộc đội INSUREGEN NEO. Ảnh minh họa dịch vụ do nhóm tạo bằng AI. Phông chữ Be Vietnam Pro và Fraunces dùng theo giấy phép SIL Open Font License. Trang không dùng đánh giá hay lời chứng thực của khách hàng.",
        ],
      },
      {
        h: "5. Giới hạn trách nhiệm",
        body: [
          "Trang được cung cấp nguyên trạng cho mục đích học thuật. Đừng dựa vào số liệu trên trang để quyết định mua bảo hiểm thật; hãy hỏi doanh nghiệp bảo hiểm được cấp phép.",
        ],
      },
      {
        h: "6. Luật áp dụng và liên hệ",
        body: [
          "Điều khoản này theo pháp luật Việt Nam.",
          `Đội INSUREGEN NEO · Mentor: Ms. Sze Huey Tan · Thành viên: Nguyễn Thị Thanh Bình, Nguyễn Đức Tuệ, Huỳnh Thanh Kiệt, Nguyễn Việt Khoa · Email: ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  cookie: {
    title: "Chính sách cookie",
    description: "Family Reconnect chỉ dùng một cookie ghi nhớ ngôn ngữ và bộ nhớ trình duyệt cho chế độ sáng/tối và ví dùng thử.",
    intro: "Trang chỉ dùng những gì cần để trang hoạt động. Không có cookie phân tích, quảng cáo hay của bên thứ ba.",
    sections: [
      {
        h: "1. Danh sách",
        body: [
          {
            table: [
              ["Tên", "Loại", "Mục đích", "Thời hạn"],
              ["fr-lang", "Cookie của trang", "Ghi nhớ ngôn ngữ bạn chọn (vi/en)", "1 năm"],
              ["fr-theme", "Bộ nhớ trình duyệt (localStorage)", "Ghi nhớ chế độ sáng/tối", "Đến khi bạn xóa"],
              ["fr-wallet", "Bộ nhớ trình duyệt (localStorage)", "Mở lại ví dùng thử của bạn", "Đến khi bạn xóa ví hoặc xóa dữ liệu trình duyệt"],
            ],
          },
        ],
      },
      {
        h: "2. Vì sao không có banner cookie",
        body: [
          "Các mục trên đều là chức năng thiết yếu bạn tự kích hoạt (chọn ngôn ngữ, đổi giao diện, dùng ví), không theo dõi bạn và không chia sẻ cho ai. Vì không có gì để chặn, trang không hiện banner xin phép.",
          "Nếu sau này trang thêm công cụ phân tích hoặc quảng cáo, chúng tôi sẽ hiện banner và chỉ bật chúng sau khi bạn đồng ý.",
        ],
      },
      {
        h: "3. Cách xóa",
        body: ["Bạn có thể xóa cookie và dữ liệu trang trong phần cài đặt quyền riêng tư của trình duyệt. Trang vẫn dùng được, chỉ quay về ngôn ngữ và giao diện mặc định."],
      },
    ],
  },
  "hoan-phi": {
    title: "Hủy hợp đồng và hoàn phí",
    description: "Thời gian cân nhắc 21 ngày, việc hủy hợp đồng và hoàn phí của Family Reconnect (đề xuất).",
    intro:
      "Trang dùng thử không thu tiền nên không có khoản nào cần hoàn. Phần dưới đây là chính sách hủy và hoàn phí đề xuất khi sản phẩm được một doanh nghiệp bảo hiểm phát hành, để bạn biết trước quyền của mình.",
    sections: [
      {
        h: "1. 21 ngày cân nhắc",
        body: [
          "Theo Điều 35 Luật Kinh doanh bảo hiểm số 08/2022/QH15, với hợp đồng bảo hiểm nhân thọ thời hạn trên 1 năm, bạn có 21 ngày kể từ khi nhận hợp đồng để cân nhắc. Trong thời gian này bạn có quyền từ chối tiếp tục hợp đồng và được hoàn lại phí đã đóng, sau khi trừ chi phí hợp lý theo quy định (ví dụ chi phí khám sức khỏe, nếu có).",
          "Hợp đồng chính Family Reconnect có thời hạn 10 năm nên được áp dụng quy định này, cùng với quyền lợi bổ trợ đi kèm.",
        ],
      },
      {
        h: "2. Hủy sau 21 ngày",
        body: [
          {
            list: [
              "Hợp đồng chính là bảo hiểm tử kỳ, không có giá trị hoàn lại. Nếu hủy, phí đã đóng không được hoàn; bạn được bảo vệ đến hết kỳ phí đã đóng.",
              "Quyền lợi bổ trợ đóng phí theo năm và dừng cùng hợp đồng chính.",
              "Giờ chăm sóc trong ví không đổi được thành tiền. Trợ cấp nằm viện đã đủ điều kiện nhưng chưa chi trả vẫn được trả.",
            ],
          },
        ],
      },
      {
        h: "3. Ngừng đóng phí",
        body: ["Nếu bạn ngừng đóng phí, hợp đồng có thời gian gia hạn đóng phí theo quy tắc điều khoản cuối cùng. Hết thời gian này mà chưa đóng thì hợp đồng chấm dứt."],
      },
      {
        h: "4. Cách yêu cầu",
        body: [
          "Khi sản phẩm được phát hành, yêu cầu hủy gửi tới doanh nghiệp bảo hiểm phát hành, kèm số hợp đồng. Với câu hỏi về dự án này, liên hệ " + CONTACT_EMAIL + ".",
          "Chi tiết cuối cùng sẽ theo quy tắc, điều khoản sản phẩm được Bộ Tài chính phê duyệt.",
        ],
      },
    ],
  },
};

const en: Record<LegalSlug, LegalPage> = {
  "chinh-sach-bao-mat": {
    title: "Privacy policy",
    description: "What data Family Reconnect collects, why, where it's stored, for how long, and how to ask us to see or delete it.",
    intro:
      "This page explains the personal data the Family Reconnect site collects, why, where it's kept, for how long and your rights, under Vietnam's Personal Data Protection Law No. 91/2025/QH15 and Decree 356/2025/ND-CP.",
    sections: [
      {
        h: "1. Who is responsible",
        body: [
          "The data controller and processor is INSUREGEN NEO, the student team behind Family Reconnect at the InsuNovate 2026 competition. This is an academic project, not an insurance company.",
          `Personal data contact: ${CONTACT_EMAIL}.`,
        ],
      },
      {
        h: "2. What we collect and why",
        body: [
          "We only collect what each feature needs, and state the purpose where you enter it:",
          {
            table: [
              ["Feature", "Data", "Purpose", "Required?"],
              ["Advice form", "Name, phone number", "To call you back", "Yes"],
              ["", "Email; parents' and youngest child's ages; city", "To send material and estimate a premium before calling", "No"],
              ["", "Time and version of your consent", "To show you consented", "Automatic"],
              ["Demo wallet", "Youngest child's age, simulated claims (stay dates, severity), bookings", "To run the demo", "Yes, to use the demo"],
              ["AI discharge reading", "Photo of a discharge paper", "To read admission, discharge and ICU hours", "No, only if you upload"],
              ["Premium calculator", "Ages, occupation class, smoking", "To compute the premium", "Not stored"],
              ["Operations", "IP address, time, page requested", "Abuse prevention, debugging", "Automatic"],
            ],
          },
          "Income entered in the calculator is used only in your browser and never sent to our server. We never collect your child's name or photo.",
        ],
      },
      {
        h: "3. Health data",
        body: [
          "A discharge paper is health data, a category of sensitive personal data. It's only sent if you tick the separate consent box next to the upload button.",
          "The photo is sent to Anthropic, PBC (USA) through its API to read the dates, then discarded. Family Reconnect's server doesn't store it. Anthropic handles it under its API data policy.",
          "Because this is a demo, use a sample document or cover names and diagnoses before uploading. Don't upload someone else's papers.",
        ],
      },
      {
        h: "4. Storage and third parties",
        body: [
          "We don't sell data and use no third-party analytics, advertising or tracking. Fonts are served from this site.",
          {
            table: [
              ["Provider", "Role", "Data received"],
              ["Vercel Inc. (USA)", "Hosts and runs the site", "Technical access logs"],
              ["Supabase Inc.", "Database", "Advice form, demo wallet data"],
              ["Anthropic, PBC (USA)", "AI discharge reading", "Photos you choose to upload"],
            ],
          },
          "These providers may process data outside Vietnam. Using the relevant feature, you are informed of this transfer.",
        ],
      },
      {
        h: "5. How long we keep it",
        body: [
          {
            list: [
              "Advice form: until the end of InsuNovate 2026, at most 12 months from submission, or sooner if you ask us to delete it.",
              "Demo wallet: until you press \"Delete wallet\", or when the team clears demo data after the competition.",
              "Discharge photos: not stored on our server.",
              "Access logs: Vercel's default retention.",
            ],
          },
        ],
      },
      {
        h: "6. Your rights",
        body: [
          "Under the Personal Data Protection Law you may: be informed about processing; give or withdraw consent; access and get a copy; ask for correction; ask for deletion; ask to restrict processing; object to processing; and complain.",
          `Email ${CONTACT_EMAIL} with the phone or email you used in the form so we can find your data. We act as soon as possible, within the legal time limit. You can delete a demo wallet yourself with the \"Delete wallet\" button.`,
          "Withdrawing consent doesn't affect processing that already took place.",
        ],
      },
      {
        h: "7. Security",
        body: [
          "Connections are always HTTPS. Database keys stay on the server. Every table has row-level security and blocks public access. The site sends a Content Security Policy against injected code and was security-tested before going public.",
        ],
      },
      {
        h: "8. Visitors outside Vietnam",
        body: [
          "The site is aimed at families in Vietnam and follows Vietnamese law. If you're in the EU (GDPR) or California (CCPA), you can still ask to access, correct or delete your data at the email above; we handle it the same way as for anyone else.",
        ],
      },
      { h: "9. Changes", body: ["When this policy changes, the date at the top changes too. If we change how data is used, we'll ask for consent again."] },
    ],
  },
  "dieu-khoan": {
    title: "Terms of use",
    description: "Conditions for using the Family Reconnect site: an academic project with illustrative figures, not an offer of insurance.",
    intro: "By using the Family Reconnect site you agree to these terms. Please read them, especially section 1.",
    sections: [
      {
        h: "1. This is an academic project",
        body: [
          "Family Reconnect is an insurance product concept by the INSUREGEN NEO student team for InsuNovate 2026. It hasn't been approved by the Ministry of Finance, isn't issued by any insurer, and isn't offered for sale.",
          "Premiums, benefits, partners (such as reinsurers or service providers) and processes on the site are proposals and illustrations. Nothing here is financial, legal or medical advice.",
        ],
      },
      {
        h: "2. Demo wallet",
        body: [
          "The demo wallet is a simulation. Care Hours, cash benefits and bookings in it have no real value, can't be exchanged for money and create no obligation to pay. The site never takes payment.",
          "Anyone with a wallet's link can see it. Don't enter real details about yourself or others.",
        ],
      },
      {
        h: "3. Acceptable use",
        body: [
          {
            list: [
              "Don't submit someone else's details without their consent.",
              "Don't send automated bulk requests, scan for vulnerabilities or overload the site.",
              "Don't upload unlawful content or malware.",
            ],
          },
          "We may block access that breaks these rules.",
        ],
      },
      {
        h: "4. Intellectual property",
        body: [
          "Content, pricing models and source code belong to INSUREGEN NEO. Service illustrations were generated by the team with AI. Be Vietnam Pro and Fraunces fonts are used under the SIL Open Font License. The site uses no customer reviews or testimonials.",
        ],
      },
      {
        h: "5. Limitation of liability",
        body: ["The site is provided as-is for academic purposes. Don't rely on its figures to buy real insurance; ask a licensed insurer."],
      },
      {
        h: "6. Governing law and contact",
        body: [
          "These terms are governed by Vietnamese law.",
          `INSUREGEN NEO · Mentor: Ms. Sze Huey Tan · Members: Nguyễn Thị Thanh Bình, Nguyễn Đức Tuệ, Huỳnh Thanh Kiệt, Nguyễn Việt Khoa · Email: ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  cookie: {
    title: "Cookie policy",
    description: "Family Reconnect uses one cookie for your language and browser storage for the theme and the demo wallet.",
    intro: "The site only uses what it needs to work. There are no analytics, advertising or third-party cookies.",
    sections: [
      {
        h: "1. What we use",
        body: [
          {
            table: [
              ["Name", "Type", "Purpose", "Lifetime"],
              ["fr-lang", "First-party cookie", "Remembers your language (vi/en)", "1 year"],
              ["fr-theme", "Browser storage (localStorage)", "Remembers light/dark mode", "Until you clear it"],
              ["fr-wallet", "Browser storage (localStorage)", "Reopens your demo wallet", "Until you delete the wallet or clear site data"],
            ],
          },
        ],
      },
      {
        h: "2. Why there's no cookie banner",
        body: [
          "Everything above is essential functionality you trigger yourself (choosing a language, switching theme, using the wallet). None of it tracks you or is shared. With nothing to block, the site shows no consent banner.",
          "If we ever add analytics or advertising, we'll show a banner and only turn them on after you agree.",
        ],
      },
      { h: "3. How to clear them", body: ["Clear cookies and site data in your browser's privacy settings. The site keeps working and returns to the default language and theme."] },
    ],
  },
  "hoan-phi": {
    title: "Cancellation and refunds",
    description: "The 21-day free-look period, cancellation and refunds for Family Reconnect (proposed).",
    intro:
      "The demo site takes no money, so there's nothing to refund. Below is the proposed cancellation and refund policy for when the product is issued by an insurer, so you know your rights in advance.",
    sections: [
      {
        h: "1. 21-day free-look period",
        body: [
          "Under Article 35 of the Law on Insurance Business No. 08/2022/QH15, life insurance contracts longer than one year come with 21 days from receipt to reconsider. During this time you can decline the contract and get back the premium paid, less reasonable costs allowed by law (for example a medical exam, if any).",
          "Family Reconnect's main contract runs 10 years, so this applies, together with its rider.",
        ],
      },
      {
        h: "2. Cancelling after 21 days",
        body: [
          {
            list: [
              "The main contract is term insurance with no surrender value. If you cancel, premiums paid aren't refunded; you stay covered to the end of the period paid for.",
              "The rider is paid yearly and ends with the main contract.",
              "Care Hours can't be exchanged for money. Hospital cash already qualified for but not yet paid is still paid.",
            ],
          },
        ],
      },
      { h: "3. Missed premiums", body: ["If you stop paying, the contract has a grace period set by the final policy terms. If premiums are still unpaid after it, the contract ends."] },
      {
        h: "4. How to ask",
        body: [
          "Once issued, cancellation requests go to the issuing insurer with your policy number. For questions about this project, contact " + CONTACT_EMAIL + ".",
          "Final details will follow the policy terms approved by the Ministry of Finance.",
        ],
      },
    ],
  },
};

export const LEGAL: Record<Locale, Record<LegalSlug, LegalPage>> = { vi, en };

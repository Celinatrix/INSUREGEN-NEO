// Nội dung sản phẩm Family Reconnect — bám theo báo cáo "Family Reconnect" (InsuNovate 2026).
// Mọi con số phí và quyền lợi là số liệu minh họa của đề xuất, chưa phải biểu phí chính thức.

export const product = {
  name: "Family Reconnect",
  riderName: "Family Continuity Rider",
  walletName: "Family Care Wallet",
  tagline:
    "Bảo vệ tài chính khi gia đình đối mặt mất mát lớn, và hỗ trợ việc nhà, chăm con thật sự khi cha hoặc mẹ phải nằm viện hay hồi phục tại nhà.",
  description:
    "Family Reconnect kết hợp hợp đồng bảo hiểm nhân thọ chung 10 năm cho cả cha và mẹ với quyền lợi bổ trợ Family Continuity Rider tái tục hằng năm. Hợp đồng chính chi trả 2 tỷ đồng một lần khi cha hoặc mẹ tử vong hoặc thương tật toàn bộ vĩnh viễn. Quyền lợi bổ trợ chi trả trợ cấp nằm viện và cấp Care Hours để đặt dịch vụ trông con, nấu ăn, dọn nhà và đưa đón con qua các nhà cung cấp đã ký hợp đồng.",
};

// Bảng 2.1 — từ một sự kiện sức khỏe đến nhu cầu của gia đình
export const familyNeeds = [
  {
    event: "Cha hoặc mẹ tử vong hoặc thương tật toàn bộ vĩnh viễn",
    loss: "Mất nguồn thu nhập dài hạn và một người chăm con trong nhiều năm",
    need: "An toàn tài chính dài hạn",
    answer: "Hợp đồng chính: 2 tỷ đồng, chi trả một lần",
  },
  {
    event: "Nhập viện (trung bình 6,7 ngày)",
    loss: "Mất thu nhập những ngày nằm viện, phát sinh chi tiêu, thiếu một người ở nhà",
    need: "Tiền mặt ngay và hỗ trợ ngắn hạn",
    answer: "Trợ cấp 500.000đ/ngày + Care Hours theo Lộ trình A",
  },
  {
    event: "Hồi phục tại nhà",
    loss: "Không thể bế con, lái xe, nấu ăn hay trông con như bình thường",
    need: "Người hỗ trợ việc nhà tạm thời",
    answer: "Care Hours theo Lộ trình B, đánh giá bằng điểm CIS",
  },
];

export const marketFacts = [
  {
    value: "55%",
    label: "người trưởng thành đô thị được khảo sát sống trong gia đình hai thế hệ",
  },
  {
    value: "63%",
    label: "xác suất ít nhất một trong hai cha mẹ nhập viện trong 10 năm",
  },
  {
    value: "6,7 ngày",
    label: "thời gian nằm viện trung bình của một lần nhập viện",
  },
  {
    value: "2,9–3,5 triệu",
    label: "chi phí thuê trông trẻ 4 giờ/ngày cho một lần nằm viện",
  },
];

// Bảng 3.3 — các mức quyền lợi chính
export const keyBenefits = [
  {
    value: "2 tỷ đồng",
    title: "Quyền lợi nhân thọ chung",
    detail:
      "Chi trả một lần khi cha hoặc mẹ tử vong hoặc thương tật toàn bộ vĩnh viễn (từ 81%) đầu tiên. Tương đương khoảng 7 năm thu nhập hộ gia đình đô thị.",
  },
  {
    value: "500.000đ/ngày",
    title: "Trợ cấp nằm viện",
    detail:
      "Tối đa 30 ngày mỗi cha/mẹ mỗi năm, không phụ thuộc hóa đơn viện phí. Chi trả nhanh dựa trên giấy ra viện.",
  },
  {
    value: "120 Care Hours",
    title: "Giờ chăm sóc mỗi cha/mẹ mỗi năm",
    detail:
      "Dùng chung cho Lộ trình A (nằm viện) và Lộ trình B (hồi phục tại nhà), đủ cho hai đợt nằm viện dài hoặc nhu cầu chăm sóc kết hợp.",
  },
  {
    value: "1 giờ tặng",
    title: "Quà dịch vụ hằng năm",
    detail:
      "Mỗi gia đình được tặng một giờ trông con, nấu ăn hoặc dọn nhà mỗi năm, không cần có sự kiện sức khỏe, để trải nghiệm dịch vụ và ứng dụng đặt lịch.",
  },
];

// Bảng 3.1 — cấu trúc hợp đồng
export const contractStructure = [
  {
    feature: "Quyền lợi chính",
    detail:
      "Bảo hiểm nhân thọ chung cho cả cha và mẹ, chi trả 2 tỷ đồng một lần khi xảy ra sự kiện tử vong hoặc thương tật toàn bộ vĩnh viễn đầu tiên.",
  },
  {
    feature: "Thời hạn và phí",
    detail: "10 năm. Phí nhân thọ cố định hằng năm, đóng đầu kỳ.",
  },
  {
    feature: "Điều kiện tham gia",
    detail:
      "Cha và mẹ cùng 25–40 tuổi, con nhỏ nhất dưới 12 tuổi. Cả hai cùng thẩm định y tế và tài chính.",
  },
  {
    feature: "Family Continuity Rider",
    detail:
      "Kỳ hạn một năm, tái tục hằng năm khi con nhỏ nhất từ 12 tuổi trở xuống tại ngày kỷ niệm hợp đồng.",
  },
  {
    feature: "Phí bổ trợ",
    detail:
      "Một mức phí cho cả gia đình, dựa trên nhóm tuổi của cha/mẹ lớn tuổi hơn (25–39 hoặc 40–49) và nhóm tuổi của con nhỏ nhất.",
  },
  {
    feature: "Phạm vi dịch vụ",
    detail: "Khu vực đô thị có nhà cung cấp dịch vụ đã ký hợp đồng.",
  },
];

// Bảng 3.2 — Care Hours theo Lộ trình A và B
export const pathwayA = {
  code: "A",
  title: "Lộ trình A — Nằm viện",
  trigger:
    "Kích hoạt khi có một lần nhập viện đủ điều kiện. Cần hồ sơ bệnh viện và bảng câu hỏi theo mẫu.",
  tiers: [
    { range: "3–6 ngày nằm viện", hours: 20 },
    { range: "7–13 ngày nằm viện", hours: 40 },
    { range: "Từ 14 ngày, hoặc từ 48 giờ ICU", hours: 60 },
  ],
  note: "Nếu nhu cầu thực tế cao hơn mức tiêu chuẩn, gia đình có thể nâng lên mức cao hơn và chỉ trả thêm phần giờ chênh lệch.",
};

export const pathwayB = {
  code: "B",
  title: "Lộ trình B — Hồi phục tại nhà",
  trigger:
    "Kích hoạt khi ốm hoặc chấn thương không cần nhập viện nhưng ít nhất một hoạt động chăm sóc cần người hỗ trợ trong 2 ngày liên tiếp. Cần bảng câu hỏi và giấy xác nhận y tế.",
  tiers: [
    { range: "CIS 0,20 – dưới 0,40", hours: 20 },
    { range: "CIS 0,40 – dưới 0,60", hours: 40 },
    { range: "CIS 0,60 – dưới 0,80", hours: 60 },
    { range: "CIS 0,80 – 1,00", hours: 80 },
  ],
  note: "Chỉ những hoạt động được bác sĩ xác nhận ở mức F2 hoặc F3 mới mở quyền đặt dịch vụ tương ứng.",
};

// Điểm Tác động Chăm sóc (CIS) — 6 hoạt động, trọng số theo tuổi con nhỏ nhất (Phụ lục B.2)
export const activities = [
  {
    code: "C1",
    name: "Trông giữ & giám sát con",
    description: "Luôn có người theo sát, giữ con an toàn trong sinh hoạt hằng ngày.",
    weights: [25, 25, 20, 20],
  },
  {
    code: "C2",
    name: "Bữa ăn",
    description: "Nấu nướng và cho con ăn đúng bữa.",
    weights: [20, 20, 20, 20],
  },
  {
    code: "C3",
    name: "Chăm sóc cá nhân",
    description: "Tắm rửa, vệ sinh, thay đồ cho con.",
    weights: [20, 15, 15, 10],
  },
  {
    code: "C4",
    name: "Bế ẵm, nâng đỡ",
    description: "Bế và di chuyển con, quan trọng nhất với trẻ sơ sinh và trẻ mới biết đi.",
    weights: [20, 10, 5, 5],
  },
  {
    code: "C5",
    name: "Đưa đón con",
    description: "Đưa đón con đi học và các hoạt động cần thiết.",
    weights: [5, 15, 25, 25],
  },
  {
    code: "C6",
    name: "Việc nhà",
    description: "Dọn dẹp, giặt giũ và các việc nhà thiết yếu.",
    weights: [10, 15, 15, 20],
  },
];

export const childAgeBands = ["0–2 tuổi", "3–5 tuổi", "6–8 tuổi", "9–12 tuổi"];

export const severityScale = [
  { level: "F0", label: "Tự làm được", score: "0" },
  { level: "F1", label: "Hơi khó khăn", score: "0,25" },
  { level: "F2", label: "Cần hỗ trợ nhiều", score: "0,60" },
  { level: "F3", label: "Không thể tự làm", score: "1,00" },
];

// Dịch vụ dùng Care Hours
export const services = [
  {
    name: "Trông con",
    rule: "1 Care Hour = 1 giờ",
    detail: "Người trông trẻ đã được kiểm tra lý lịch và đào tạo, có phụ phí cho trẻ sơ sinh.",
  },
  {
    name: "Nấu ăn",
    rule: "1 Care Hour = 1 giờ",
    detail: "Chuẩn bị bữa ăn tại nhà cho con và gia đình (chưa gồm tiền nguyên liệu).",
  },
  {
    name: "Dọn dẹp nhà cửa",
    rule: "1 Care Hour = 1 giờ",
    detail: "Tối đa 30% số giờ của mỗi lần cấp quyền lợi.",
  },
  {
    name: "Đưa đón con có người đi kèm",
    rule: "2 Care Hours = 1 giờ",
    detail: "Đưa đón con đến trường với người hộ tống.",
  },
];

// Quy trình bồi thường có hỗ trợ AI (mục 3.2)
export const howItWorks = [
  {
    step: "01",
    title: "Báo sự kiện qua ứng dụng",
    detail:
      "Gia đình gửi yêu cầu kèm hồ sơ bệnh viện. Với Lộ trình B, gửi thêm giấy xác nhận y tế và bảng câu hỏi chức năng.",
  },
  {
    step: "02",
    title: "AI xác minh hồ sơ",
    detail:
      "AI trích xuất thông tin từ hồ sơ bệnh viện và kiểm tra điều kiện hợp đồng. Trường hợp phức tạp được chuyên viên xem xét.",
  },
  {
    step: "03",
    title: "Phân bổ quyền lợi",
    detail:
      "Lộ trình A: trợ cấp 500.000đ/ngày và Care Hours theo số ngày nằm viện. Lộ trình B: Care Hours theo điểm CIS.",
  },
  {
    step: "04",
    title: "Nạp vào Family Care Wallet",
    detail:
      "Care Hours được duyệt nạp thẳng vào ví của gia đình, trong giới hạn 120 giờ mỗi cha/mẹ mỗi năm.",
  },
  {
    step: "05",
    title: "Đặt dịch vụ",
    detail:
      "Dùng Care Hours để đặt trông con, nấu ăn, dọn nhà hoặc đưa đón con từ các nhà cung cấp đã ký hợp đồng.",
  },
];

// Bảng 3.4 — ví dụ: cha 34, mẹ 30, con 3 tuổi
export const workedExample = {
  title: "Ví dụ: cha 34 tuổi, mẹ 30 tuổi, con 3 tuổi",
  rows: [
    {
      step: "Tham gia",
      what: "Cả hai cha mẹ được thẩm định, phí nhân thọ cố định trong 10 năm",
      amount: "20.769.350đ + 1.838.410đ = 22.607.760đ/năm",
    },
    {
      step: "Năm thứ nhất",
      what: "Nhận quà tặng hằng năm: một giờ trông con",
      amount: "Trị giá khoảng 130.000đ",
    },
    {
      step: "Cha nằm viện 8 ngày",
      what: "Trợ cấp nằm viện và Care Hours Lộ trình A, mức 7–13 ngày",
      amount: "4.000.000đ và 40 Care Hours",
    },
    {
      step: "Những tuần hồi phục",
      what: "30 giờ trông con và 5 chuyến đưa đón con đi học",
      amount: "Dùng 40 Care Hours",
    },
    {
      step: "Mỗi ngày kỷ niệm",
      what: "Quyền lợi bổ trợ tái tục khi con nhỏ nhất từ 12 tuổi trở xuống",
      amount: "Tối đa 10 năm bổ trợ",
    },
  ],
};

// Bảng 2.4 — tổng phí nhân thọ + bổ trợ
export const combinedPremiums = [
  { ages: "25 / 25", yearly: "15,84 triệu", monthly: "1,32 triệu", share: "5,6%" },
  { ages: "40 / 30", yearly: "32,02 triệu", monthly: "2,67 triệu", share: "11,4%" },
  { ages: "40 / 40", yearly: "41,08 triệu", monthly: "3,42 triệu", share: "14,6%" },
  { ages: "Trung bình danh mục", yearly: "27,47 triệu", monthly: "2,29 triệu", share: "9,8%" },
];

// Mục 4.2.3 — phí bổ trợ hằng năm cho cả gia đình
export const riderRates = [
  { child: "0–2 tuổi", young: "2.129.061", older: "2.186.982" },
  { child: "3–5 tuổi", young: "1.838.410", older: "1.890.522" },
  { child: "6–8 tuổi", young: "1.807.952", older: "1.859.105" },
  { child: "9–12 tuổi", young: "1.783.188", older: "1.833.607" },
];

export const pricingNote =
  "Phí minh họa theo đề xuất sản phẩm, lãi suất kỹ thuật 4,5%. Phí nhân thọ cố định 10 năm; phí bổ trợ có thể thay đổi khi tái tục hằng năm. Phí thực tế phụ thuộc kết quả thẩm định.";

// Bảng 2.3 — so sánh với sản phẩm hiện có
export const comparison = {
  columns: ["Chi trả khi tử vong/TTTBVV", "Trợ cấp nằm viện", "Sắp xếp người hỗ trợ việc nhà"],
  rows: [
    {
      offer: "Bảo hiểm tử kỳ tái tục hằng năm",
      cells: ["Chỉ tử vong, từng người", "Không", "Không"],
    },
    {
      offer: "Bảo hiểm trợ cấp nằm viện",
      cells: ["Không", "Có", "Không"],
    },
    {
      offer: "Bảo hiểm sức khỏe",
      cells: ["Không", "Chi phí y tế, một phần tiền mặt", "Chỉ chăm sóc y tế tại nhà"],
    },
    {
      offer: "Ứng dụng thuê người trông trẻ",
      cells: ["Không", "Không", "Gia đình tự tìm, tự trả"],
    },
    {
      offer: "Family Reconnect",
      cells: ["2 tỷ đồng, cho cả cha và mẹ", "500.000đ/ngày", "Care Hours qua nhà cung cấp đã ký hợp đồng"],
      highlight: true,
    },
  ],
};

export const differentiators = [
  {
    title: "Một yêu cầu bồi thường, hai quyền lợi",
    detail:
      "Cùng một hồ sơ nằm viện vừa chi trả tiền mặt vừa mở Care Hours. Gia đình không phải nộp hồ sơ hai lần.",
  },
  {
    title: "Người hỗ trợ đã được chọn sẵn",
    detail:
      "Công ty bảo hiểm kiểm định và ký hợp đồng với nhà cung cấp từ trước, điều mà một gia đình khó làm được giữa lúc khủng hoảng.",
  },
  {
    title: "Cả cha và mẹ, một bộ quy tắc",
    detail:
      "Một hợp đồng bảo vệ cả hai người, mỗi người có hạn mức Care Hours và trợ cấp nằm viện riêng.",
  },
];

export const providerStandards = [
  "Nhà cung cấp được kiểm định và ký hợp đồng trước khi mở khu vực",
  "Kiểm tra lý lịch và đào tạo người chăm sóc vào nhà có trẻ nhỏ",
  "Có năng lực dự phòng khi nhà cung cấp chính không đáp ứng",
  "Phạm vi, số giờ đặt tối thiểu và thời gian phản hồi được công bố trước khi mua",
  "Tạm dừng khu vực nếu xảy ra sự cố nghiêm trọng",
];

export const eligibility = {
  title: "Đối tượng phù hợp",
  points: [
    "Gia đình đô thị có cả cha và mẹ 25–40 tuổi khi tham gia",
    "Con nhỏ nhất dưới 12 tuổi, ưu tiên gia đình có con 0–8 tuổi",
    "Thu nhập ròng hộ gia đình từ 200 triệu đồng/năm; tổng phí không quá 12% thu nhập",
    "Sống trong khu vực có nhà cung cấp dịch vụ đã ký hợp đồng (TP.HCM trước, sau đó Hà Nội và Đà Nẵng)",
    "Cả hai cha mẹ hoàn tất thẩm định y tế và tài chính",
  ],
};

export const terms = [
  {
    title: "Thời gian chờ",
    detail:
      "Áp dụng thời gian chờ 2 năm kể từ ngày hợp đồng có hiệu lực cho quyền lợi tử vong và thương tật toàn bộ vĩnh viễn, theo quy tắc hợp đồng cuối cùng.",
  },
  {
    title: "Chấm dứt hợp đồng",
    detail:
      "Khi xảy ra sự kiện được bảo hiểm đầu tiên, khi hết hạn hoặc ngừng đóng phí. Care Hours đã tích lũy hợp lệ và trợ cấp chưa chi trả vẫn được giữ.",
  },
  {
    title: "Tái tục quyền lợi bổ trợ",
    detail: "Dừng tái tục khi con nhỏ nhất từ 13 tuổi trở lên tại ngày kỷ niệm hợp đồng.",
  },
  {
    title: "Loại trừ",
    detail:
      "Tự tử trong thời gian đầu, hành vi cố ý, phạm tội, lạm dụng chất kích thích, chiến tranh, thể thao nguy hiểm, bệnh không kê khai. Thai sản không thuộc phạm vi quyền lợi bổ trợ. Danh mục đang chờ rà soát pháp lý.",
  },
];

export const faqs = [
  {
    question: "Family Reconnect và Family Care Wallet khác nhau thế nào?",
    answer:
      "Family Reconnect là sản phẩm bảo hiểm, gồm hợp đồng nhân thọ chung và quyền lợi bổ trợ Family Continuity Rider. Family Care Wallet là ví trong ứng dụng, nơi nhận Care Hours sau khi yêu cầu bồi thường được duyệt và dùng để đặt dịch vụ.",
  },
  {
    question: "Nếu cả cha và mẹ cùng gặp sự kiện thì sao?",
    answer:
      "Quyền lợi 2 tỷ đồng chỉ chi trả một lần cho sự kiện tử vong hoặc thương tật toàn bộ vĩnh viễn đầu tiên, sau đó hợp đồng chính chấm dứt. Với quyền lợi bổ trợ, mỗi cha/mẹ có hạn mức Care Hours và trợ cấp nằm viện riêng.",
  },
  {
    question: "Care Hours dùng như thế nào?",
    answer:
      "Một Care Hour đổi được một giờ trông con, nấu ăn hoặc dọn nhà. Đưa đón con có người đi kèm tính 2 Care Hours mỗi giờ. Dọn nhà tối đa 30% số giờ của mỗi lần cấp. Mỗi cha/mẹ có tối đa 120 Care Hours mỗi năm.",
  },
  {
    question: "Không nằm viện mà nghỉ dưỡng tại nhà có được hỗ trợ không?",
    answer:
      "Có, theo Lộ trình B, nếu ít nhất một hoạt động chăm sóc con cần người hỗ trợ trong 2 ngày liên tiếp và có giấy xác nhận y tế. Số Care Hours phụ thuộc điểm CIS.",
  },
  {
    question: "Điểm CIS được tính ra sao?",
    answer:
      "CIS là tổng có trọng số của 6 hoạt động chăm sóc, mỗi hoạt động được chấm từ F0 (tự làm được) đến F3 (không thể tự làm). Trọng số thay đổi theo tuổi con nhỏ nhất: trẻ sơ sinh nặng về bế ẵm, trẻ lớn hơn nặng về đưa đón.",
  },
  {
    question: "Trợ cấp nằm viện có phụ thuộc viện phí không?",
    answer:
      "Không. Trợ cấp 500.000đ/ngày là khoản cố định, không phải hoàn trả viện phí, tối đa 30 ngày mỗi cha/mẹ mỗi năm, chi trả nhanh dựa trên giấy ra viện.",
  },
  {
    question: "Phí có thay đổi trong thời hạn hợp đồng không?",
    answer:
      "Phí nhân thọ cố định trong 10 năm. Phí bổ trợ phụ thuộc tuổi cha/mẹ lớn tuổi hơn và tuổi con nhỏ nhất, có thể thay đổi khi tái tục hằng năm.",
  },
];

// Bảng 6.1 — lộ trình ra mắt
export const rollout = [
  {
    period: "Quý 4/2026",
    title: "Chuẩn bị ra mắt",
    detail: "Đào tạo 140 tư vấn viên, ký hợp đồng với nhà cung cấp dịch vụ tại TP.HCM, sản xuất nội dung truyền thông.",
  },
  {
    period: "Nửa đầu 2027",
    title: "Thí điểm tại TP.HCM",
    detail:
      "Video ngắn cho cha mẹ trẻ, sự kiện tại cửa hàng mẹ và bé, trường mầm non; giờ tặng miễn phí làm trải nghiệm đầu tiên. Mục tiêu khoảng 83 gia đình mới mỗi tháng.",
  },
  {
    period: "Cuối 2027 – 2028",
    title: "Tăng trưởng",
    detail: "Chương trình giới thiệu khách hàng, ra mắt tại Hà Nội năm 2028, thí điểm kênh ngân hàng.",
  },
  {
    period: "2029 – 2031",
    title: "Mở rộng",
    detail: "Ra mắt tại Đà Nẵng, 700 tư vấn viên, kênh số trở thành nguồn khách hàng chính. Mục tiêu 15.000 gia đình sau 5 năm.",
  },
];

// Tình huống minh họa (thay cho lời chứng thực — sản phẩm chưa ra mắt)
export const scenarios = [
  {
    label: "Nằm viện",
    title: "Cha phải nằm viện 8 ngày",
    detail:
      "Gia đình nhận 4 triệu đồng trợ cấp và 40 Care Hours để thuê người trông con và đưa đón con đi học trong những tuần cha hồi phục.",
  },
  {
    label: "Hồi phục tại nhà",
    title: "Mẹ bị chấn thương chân, không bế được con 2 tuổi",
    detail:
      "Bác sĩ xác nhận mẹ không thể bế ẵm và trông con. Điểm CIS được tính theo trọng số của trẻ 0–2 tuổi, và Care Hours được dùng để thuê người trông con.",
  },
  {
    label: "Mất mát lớn",
    title: "Một trong hai cha mẹ không may qua đời",
    detail:
      "Gia đình nhận 2 tỷ đồng một lần, tương đương khoảng 7 năm thu nhập hộ đô thị, để giữ ổn định tương lai cho con.",
  },
];

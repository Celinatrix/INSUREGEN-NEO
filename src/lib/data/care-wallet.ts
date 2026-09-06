export const product = {
  name: "Family Care Wallet",
  vnName: "Ví Chăm Sóc Gia Đình",
  tagline:
    "Khi cha hoặc mẹ không thể chăm sóc con vì lý do sức khỏe, Family Care Wallet chi trả bằng dịch vụ chăm sóc thật — không phải một khoản tiền mặt chung chung.",
  description:
    "Family Care Wallet được thiết kế cho các gia đình có con nhỏ (0–8 tuổi), nơi cha hoặc mẹ là người trực tiếp chăm sóc con hằng ngày. Khi người đó gặp sự cố y tế khiến họ tạm thời không thể thực hiện việc chăm sóc, sản phẩm sẽ đánh giá đúng phần việc bị thiếu hụt và quy đổi thành Care Units, nạp vào ví điện tử của gia đình để đặt dịch vụ chăm sóc thật từ mạng lưới đối tác đã kiểm định.",
};

export const problemStatement = {
  title: "Vấn đề mà Family Care Wallet giải quyết",
  points: [
    {
      title: "Gia đình hạt nhân ngày càng phổ biến",
      detail:
        "Hơn 50% hộ gia đình tại các đô thị lớn là gia đình 2 thế hệ (cha mẹ và con), không có ông bà ở cùng để hỗ trợ khi có sự cố xảy ra.",
    },
    {
      title: "Trẻ nhỏ và người cao tuổi dễ cần chăm sóc đột xuất nhất",
      detail:
        "Tỷ lệ nhập viện ở trẻ dưới 5 tuổi và người trên 50 tuổi cao gấp 3–5 lần nhóm 15–39 tuổi — đúng vào lúc gia đình cần người thay thế chăm sóc nhất.",
    },
    {
      title: "Bảo hiểm truyền thống trả tiền, không trả sự hỗ trợ",
      detail:
        "Một khoản trợ cấp nằm viện không giải quyết được việc ai sẽ đưa đón con đi học, nấu ăn, hay túc trực bên trẻ trong những ngày cha/mẹ không thể tự chăm sóc.",
    },
  ],
};

export const activities = [
  {
    code: "C1",
    name: "Trông giữ & giám sát con",
    description: "Đảm bảo con luôn có người theo sát, an toàn trong sinh hoạt hằng ngày.",
  },
  {
    code: "C2",
    name: "Chuẩn bị bữa ăn",
    description: "Nấu nướng và cho con ăn đúng bữa, đúng nhu cầu dinh dưỡng theo độ tuổi.",
  },
  {
    code: "C3",
    name: "Chăm sóc cá nhân cơ bản",
    description: "Tắm rửa, vệ sinh cá nhân, thay đồ cho con.",
  },
  {
    code: "C4",
    name: "Hỗ trợ thể chất / bế ẵm",
    description: "Bế, di chuyển con — đặc biệt quan trọng với trẻ nhỏ chưa tự đi lại.",
  },
  {
    code: "C5",
    name: "Đưa đón con",
    description: "Đưa đón đi học, đi khám hoặc các hoạt động cần thiết khác.",
  },
  {
    code: "H1",
    name: "Hỗ trợ việc nhà thiết yếu",
    description: "Dọn dẹp, giặt giũ — hạng mục hỗ trợ thêm, không phải chăm sóc trực tiếp.",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Sự cố y tế xảy ra",
    detail:
      "Cha hoặc mẹ gặp vấn đề sức khỏe (chấn thương, phẫu thuật, ốm nặng) được xác nhận bởi bác sĩ.",
  },
  {
    step: "02",
    title: "Đánh giá khả năng chăm sóc",
    detail:
      "Hệ thống đánh giá khách quan mức độ ảnh hưởng đến 6 hoạt động chăm sóc con hằng ngày, dựa trên bằng chứng y khoa — không chỉ dựa vào tên bệnh.",
  },
  {
    step: "03",
    title: "Tính khoảng trống chăm sóc của cả gia đình",
    detail:
      "Nếu người còn lại có thể hỗ trợ một phần, khoảng trống cần bù đắp từ bên ngoài sẽ được điều chỉnh giảm tương ứng — đảm bảo quyền lợi sát với nhu cầu thực tế.",
  },
  {
    step: "04",
    title: "Nhận Care Units vào Family Care Wallet",
    detail:
      "Care Units được nạp vào ví điện tử của gia đình, sẵn sàng để đặt dịch vụ ngay khi cần.",
  },
  {
    step: "05",
    title: "Đặt dịch vụ từ mạng lưới đối tác",
    detail:
      "Dùng Care Units để đặt người trông trẻ, chăm sóc sau sinh, hỗ trợ việc nhà từ các đối tác đã được kiểm định chất lượng.",
  },
];

export const exampleScenario = {
  title: "Ví dụ minh họa",
  summary:
    "Chị A bị chấn thương chân, phải hạn chế vận động trong 14 ngày. Con chị mới 2 tuổi — độ tuổi cần chăm sóc sát sao nhất. Chồng chị vẫn đi làm nhưng có thể hỗ trợ một phần buổi tối.",
  outcome:
    "Hệ thống ghi nhận chị A gặp khó khăn đáng kể ở hầu hết các hoạt động chăm sóc con (đặc biệt là bế ẵm — gần như không thể thực hiện do chấn thương chân), đồng thời ghi nhận chồng chị có thể hỗ trợ một phần. Sau khi cân đối, gia đình nhận được lượng Care Units tương ứng với khoảng 2 tuần hỗ trợ chăm sóc bên ngoài, đủ để đặt dịch vụ trông trẻ bán thời gian và hỗ trợ việc nhà trong thời gian chị A hồi phục.",
  note: "Số liệu trên mang tính minh họa để giải thích nguyên lý hoạt động, không phải cam kết quyền lợi cho mọi trường hợp. Quyền lợi thực tế phụ thuộc vào đánh giá y khoa và điều khoản hợp đồng.",
};

export const partners = [
  {
    name: "Thanh Tâm Care",
    category: "Chăm sóc y tế & người cao tuổi",
    description:
      "Chăm sóc bệnh nhân tại bệnh viện và tại nhà 24/7, theo dõi hậu phẫu, chăm sóc người cao tuổi và hỗ trợ vật lý trị liệu.",
  },
  {
    name: "Vi Easy Care",
    category: "Chăm sóc trẻ em & hậu sản",
    description:
      "Trông trẻ theo giờ, chăm sóc trẻ ốm, và dịch vụ chăm sóc hậu sản/trẻ sơ sinh chuyên biệt.",
  },
  {
    name: "Việc Nhà VN",
    category: "Hỗ trợ việc nhà",
    description:
      "Dọn dẹp theo giờ, nấu ăn tại nhà, đi chợ hộ và tổng vệ sinh chuyên sâu.",
  },
];

export const eligibility = {
  title: "Đối tượng phù hợp",
  points: [
    "Gia đình có ít nhất một con trong độ tuổi 0–8",
    "Cha hoặc mẹ là người trực tiếp đảm nhận phần lớn việc chăm sóc con hằng ngày",
    "Sinh sống tại khu vực có mạng lưới đối tác dịch vụ hoạt động",
  ],
};

export const faqs = [
  {
    question: "Care Units là gì và quy đổi như thế nào?",
    answer:
      "Care Units là đơn vị quyền lợi được nạp vào Family Care Wallet, tính dựa trên mức độ ảnh hưởng đến khả năng chăm sóc con và thời gian ảnh hưởng. Mỗi Care Unit dùng để đặt dịch vụ tương ứng từ mạng lưới đối tác, thay vì nhận một khoản tiền mặt cố định.",
  },
  {
    question: "Vì sao đánh giá dựa trên chức năng chăm sóc thay vì chỉ dựa vào tên bệnh?",
    answer:
      "Hai người có cùng chẩn đoán có thể bị ảnh hưởng đến khả năng chăm sóc con rất khác nhau. Đánh giá theo chức năng thực tế (đi lại, bế ẵm, chăm sóc cá nhân...) giúp quyền lợi sát với nhu cầu thật của từng gia đình hơn là áp một mức cố định theo bệnh danh.",
  },
  {
    question: "Nếu người còn lại trong gia đình vẫn có thể hỗ trợ thì sao?",
    answer:
      "Hệ thống sẽ ghi nhận mức độ người còn lại có thể thay thế (hoàn toàn, một phần, hoặc không thể) để tính đúng phần khoảng trống cần hỗ trợ từ bên ngoài, tránh chi trả vượt quá nhu cầu thực tế.",
  },
  {
    question: "Family Care Wallet có áp dụng ngoài mạng lưới đối tác không?",
    answer:
      "Quyền lợi được thiết kế để sử dụng qua mạng lưới đối tác đã kiểm định nhằm đảm bảo chất lượng dịch vụ. Phạm vi đối tác sẽ tiếp tục được mở rộng theo khu vực.",
  },
];

export const comingSoon = {
  badge: "Đang nghiên cứu — sắp ra mắt",
  title: "Bảo vệ người chăm sóc & ông bà cao tuổi",
  description:
    "Chúng tôi đang nghiên cứu mở rộng mô hình Family Care Wallet sang bảo vệ người cao tuổi cần hỗ trợ sinh hoạt dài hạn (dựa trên đánh giá các hoạt động sinh hoạt hằng ngày - ADL), cùng gói bảo vệ dành riêng cho người thân đứng ra chăm sóc không chuyên: bảo hiểm tai nạn, hỗ trợ thu nhập, và ngày nghỉ thay thế hằng năm.",
  disclaimer:
    "Tính năng này đang trong giai đoạn nghiên cứu, chưa được xác nhận đưa vào phạm vi sản phẩm chính thức và chưa có thời điểm ra mắt cụ thể.",
};

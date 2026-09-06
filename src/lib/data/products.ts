export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  priceFrom: string;
  coverage: string[];
  highlights: { title: string; detail: string }[];
  faqs: { question: string; answer: string }[];
};

export const products: Product[] = [
  {
    slug: "suc-khoe-neo-care",
    name: "NEO Care",
    category: "Bảo hiểm sức khỏe",
    tagline: "Bảo vệ toàn diện trước rủi ro ốm đau, bệnh tật và tai nạn",
    description:
      "NEO Care chi trả viện phí nội trú, ngoại trú và bệnh hiểm nghèo với mạng lưới bảo lãnh viện phí trực tiếp tại hơn 200 bệnh viện, không cần tạm ứng chi phí.",
    priceFrom: "299.000đ/tháng",
    coverage: [
      "Nội trú & phẫu thuật lên đến 2 tỷ đồng/năm",
      "Ngoại trú, khám sức khỏe định kỳ",
      "36 bệnh hiểm nghèo, chi trả một lần",
      "Thai sản và chăm sóc sơ sinh (gói mở rộng)",
    ],
    highlights: [
      {
        title: "Bảo lãnh viện phí trực tiếp",
        detail: "Không tạm ứng, không chờ hoàn tiền tại hơn 200 cơ sở y tế liên kết.",
      },
      {
        title: "Duyệt hồ sơ trong 24 giờ",
        detail: "Quy trình thẩm định số hóa rút ngắn thời gian xử lý yêu cầu bồi thường.",
      },
      {
        title: "Đồng hành trọn đời",
        detail: "Tái tục không giới hạn tuổi, quyền lợi không giảm theo thời gian tham gia.",
      },
    ],
    faqs: [
      {
        question: "Thời gian chờ trước khi được chi trả là bao lâu?",
        answer:
          "30 ngày với ốm đau thông thường, 90 ngày với bệnh có sẵn đã kê khai và 365 ngày với thai sản.",
      },
      {
        question: "Có được chọn bệnh viện điều trị không?",
        answer:
          "Có, khách hàng chọn bất kỳ cơ sở y tế nào trong mạng lưới bảo lãnh hoặc yêu cầu bồi hoàn với cơ sở ngoài mạng lưới.",
      },
    ],
  },
  {
    slug: "nhan-tho-neo-shield",
    name: "NEO Shield",
    category: "Bảo hiểm nhân thọ",
    tagline: "Đảm bảo tài chính cho gia đình trước những biến cố không lường trước",
    description:
      "NEO Shield là sản phẩm bảo hiểm nhân thọ hỗn hợp kết hợp bảo vệ và tích lũy, đảm bảo nguồn tài chính cho người thân khi có rủi ro xảy ra với trụ cột gia đình.",
    priceFrom: "450.000đ/tháng",
    coverage: [
      "Chi trả tử vong & thương tật toàn bộ vĩnh viễn",
      "Quyền lợi tích lũy với lãi suất cam kết tối thiểu",
      "Miễn đóng phí khi mất khả năng lao động",
      "Quyền lợi đáo hạn nhận trọn gói hoặc chia kỳ",
    ],
    highlights: [
      {
        title: "Số tiền bảo hiểm linh hoạt",
        detail: "Tùy chỉnh từ 500 triệu đến 10 tỷ đồng theo nhu cầu tài chính của gia đình.",
      },
      {
        title: "Tích lũy minh bạch",
        detail: "Bảng minh họa quyền lợi rõ ràng, cập nhật giá trị tài khoản hằng năm.",
      },
      {
        title: "Điều khoản bổ trợ mở rộng",
        detail: "Kết hợp thêm quyền lợi bệnh hiểm nghèo, tai nạn, trợ cấp nằm viện.",
      },
    ],
    faqs: [
      {
        question: "Độ tuổi tham gia là bao nhiêu?",
        answer: "Từ 18 đến 60 tuổi, thời hạn hợp đồng linh hoạt từ 10 đến 25 năm.",
      },
      {
        question: "Có thể rút một phần giá trị tài khoản trước hạn không?",
        answer:
          "Có, sau năm hợp đồng thứ 3, khách hàng có thể tạm ứng hoặc rút một phần giá trị tài khoản.",
      },
    ],
  },
  {
    slug: "xe-co-gioi-neo-drive",
    name: "NEO Drive",
    category: "Bảo hiểm xe cơ giới",
    tagline: "An tâm trên mọi hành trình với xử lý bồi thường tức thời qua ứng dụng",
    description:
      "NEO Drive bảo vệ toàn diện cho xe ô tô và xe máy trước tai nạn, thiên tai, mất cắp, đi kèm quy trình giám định và bồi thường số hóa hoàn toàn.",
    priceFrom: "1.200.000đ/năm",
    coverage: [
      "Vật chất xe: đâm va, lật đổ, cháy nổ, thiên tai",
      "Trách nhiệm dân sự bắt buộc & tự nguyện",
      "Mất cắp toàn bộ xe",
      "Hỗ trợ cứu hộ 24/7 toàn quốc",
    ],
    highlights: [
      {
        title: "Giám định từ xa qua app",
        detail: "Chụp ảnh hiện trường, nhận phương án bồi thường trong vòng 2 giờ.",
      },
      {
        title: "Sửa chữa chính hãng",
        detail: "Mạng lưới gara liên kết đạt chuẩn hãng trên toàn quốc.",
      },
      {
        title: "Cứu hộ 24/7",
        detail: "Hỗ trợ cứu hộ giao thông không giới hạn số lần trong năm hợp đồng.",
      },
    ],
    faqs: [
      {
        question: "Xe bao nhiêu năm tuổi thì được tham gia?",
        answer: "Xe cơ giới dưới 15 năm sử dụng tính từ năm sản xuất.",
      },
      {
        question: "Thời gian nhận tiền bồi thường sau khi hoàn tất hồ sơ?",
        answer: "Tối đa 5 ngày làm việc kể từ khi hồ sơ bồi thường được duyệt.",
      },
    ],
  },
  {
    slug: "nha-o-neo-home",
    name: "NEO Home",
    category: "Bảo hiểm nhà ở",
    tagline: "Bảo vệ tổ ấm trước hỏa hoạn, thiên tai và rủi ro bất ngờ",
    description:
      "NEO Home bảo vệ căn nhà, tài sản bên trong và trách nhiệm với bên thứ ba, phù hợp cho cả nhà tự ở và nhà cho thuê.",
    priceFrom: "890.000đ/năm",
    coverage: [
      "Hỏa hoạn, cháy nổ, sét đánh",
      "Thiệt hại do bão lũ, ngập nước",
      "Trộm cắp có dấu vết đột nhập",
      "Trách nhiệm dân sự với bên thứ ba",
    ],
    highlights: [
      {
        title: "Định giá tài sản trực tuyến",
        detail: "Ước tính giá trị bảo hiểm nhanh chóng chỉ với vài thông tin cơ bản.",
      },
      {
        title: "Bồi thường không cần hóa đơn gốc",
        detail: "Chấp nhận định giá thị trường với tài sản không còn hóa đơn.",
      },
      {
        title: "Áp dụng cho nhà cho thuê",
        detail: "Gói mở rộng quyền lợi mất thu nhập cho thuê trong thời gian sửa chữa.",
      },
    ],
    faqs: [
      {
        question: "Đồ đạc trong nhà có được bảo hiểm không?",
        answer: "Có, gói mở rộng tài sản bên trong bảo vệ nội thất, thiết bị điện tử và đồ giá trị.",
      },
      {
        question: "Nhà đang cho thuê có tham gia được không?",
        answer: "Được, chọn gói NEO Home dành cho chủ nhà cho thuê để có thêm quyền lợi phù hợp.",
      },
    ],
  },
  {
    slug: "du-lich-neo-travel",
    name: "NEO Travel",
    category: "Bảo hiểm du lịch",
    tagline: "Đồng hành an toàn cho mọi chuyến đi trong và ngoài nước",
    description:
      "NEO Travel chi trả chi phí y tế khẩn cấp, hủy chuyến, mất hành lý và hỗ trợ cứu trợ khẩn cấp 24/7 tại hơn 190 quốc gia.",
    priceFrom: "45.000đ/chuyến",
    coverage: [
      "Chi phí y tế khẩn cấp ở nước ngoài",
      "Hủy/hoãn chuyến do sự kiện bất khả kháng",
      "Mất mát, hư hỏng hành lý",
      "Hỗ trợ khẩn cấp 24/7 đa ngôn ngữ",
    ],
    highlights: [
      {
        title: "Mua trong 2 phút",
        detail: "Đăng ký trực tuyến, nhận hợp đồng điện tử ngay lập tức.",
      },
      {
        title: "Mạng lưới bảo lãnh quốc tế",
        detail: "Liên kết trực tiếp với bệnh viện quốc tế, không cần tạm ứng viện phí.",
      },
      {
        title: "Gói theo chuyến hoặc theo năm",
        detail: "Linh hoạt cho người đi công tác thường xuyên hoặc du lịch theo mùa.",
      },
    ],
    faqs: [
      {
        question: "Có bảo hiểm cho các môn thể thao mạo hiểm không?",
        answer: "Có gói mở rộng cho các hoạt động như trượt tuyết, lặn biển, leo núi.",
      },
      {
        question: "Trẻ em đi cùng có cần mua riêng không?",
        answer: "Trẻ em dưới 2 tuổi đi cùng người giám hộ được miễn phí tham gia.",
      },
    ],
  },
  {
    slug: "doanh-nghiep-neo-shield-biz",
    name: "NEO Shield Biz",
    category: "Bảo hiểm doanh nghiệp",
    tagline: "Giải pháp bảo vệ nhân sự và tài sản dành riêng cho doanh nghiệp",
    description:
      "NEO Shield Biz cung cấp gói bảo hiểm sức khỏe nhóm, tai nạn con người và tài sản doanh nghiệp với chính sách quyền lợi tùy chỉnh theo quy mô nhân sự.",
    priceFrom: "Báo giá theo quy mô",
    coverage: [
      "Bảo hiểm sức khỏe nhóm cho nhân viên",
      "Tai nạn con người 24/7",
      "Tài sản, nhà xưởng, thiết bị",
      "Trách nhiệm công cộng & sản phẩm",
    ],
    highlights: [
      {
        title: "Tư vấn chuyên trách theo doanh nghiệp",
        detail: "Đội ngũ chuyên viên đồng hành thiết kế quyền lợi theo ngân sách nhân sự.",
      },
      {
        title: "Quản trị hợp đồng trực tuyến",
        detail: "Cổng thông tin quản lý danh sách nhân sự, theo dõi bồi thường theo thời gian thực.",
      },
      {
        title: "Ưu đãi theo quy mô",
        detail: "Chính sách phí giảm dần theo số lượng nhân sự tham gia.",
      },
    ],
    faqs: [
      {
        question: "Số lượng nhân sự tối thiểu để tham gia gói nhóm?",
        answer: "Từ 10 nhân sự trở lên để áp dụng biểu phí theo nhóm.",
      },
      {
        question: "Có thể thêm/bớt nhân sự giữa kỳ hợp đồng không?",
        answer: "Có, điều chỉnh danh sách theo quý thông qua cổng quản trị trực tuyến.",
      },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { differentiators, marketFacts, rollout } from "@/lib/data/family-reconnect";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "INSUREGEN NEO và Family Reconnect: bảo vệ tài chính và hỗ trợ việc nhà cho gia đình đô thị có con nhỏ.",
};

const targetMarket = [
  { value: "790.000", label: "hộ gia đình ưu tiên tại TP.HCM, Hà Nội và Đà Nẵng" },
  { value: "15.000", label: "gia đình mục tiêu sau 5 năm, khoảng 1,9% thị trường ưu tiên" },
  { value: "3 thành phố", label: "TP.HCM ra mắt trước, sau đó Hà Nội (2028) và Đà Nẵng (2029)" },
];

export default function AboutPage() {
  return (
    <div className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Về chúng tôi</p>
          <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Khi cha hoặc mẹ ốm, cả nhịp sống của gia đình bị xáo trộn
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Ngay cả một lần nằm viện không nguy hiểm đến tính mạng cũng có thể làm gián đoạn việc
            trông con, bữa ăn và lịch đưa đón đi học. INSUREGEN NEO xây dựng Family Reconnect với cách
            nhìn rộng hơn về bảo vệ gia đình: an toàn tài chính khi gia đình gặp mất mát lớn, và hỗ
            trợ thực tế khi một sự kiện sức khỏe làm gián đoạn cuộc sống hằng ngày.
          </p>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-8 border-y border-border py-10 md:grid-cols-4">
          {marketFacts.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-semibold text-primary">{stat.value}</dd>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          Nguồn: khảo sát 600 người trưởng thành đô thị, VHLSS 2024 và tính toán của nhóm.
        </p>

        <div className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Điều chúng tôi làm khác</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {differentiators.map((point) => (
              <div key={point.title} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <h3 className="text-lg font-semibold text-card-foreground">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{point.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Thị trường mục tiêu</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Gia đình đô thị có cả cha và mẹ 25–40 tuổi, con nhỏ nhất dưới 12 tuổi (ưu tiên 0–8 tuổi),
            thu nhập ròng từ 200 triệu đồng/năm và ít người dự phòng khi cần.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {targetMarket.map((m) => (
              <div key={m.label} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <p className="text-3xl font-semibold text-primary">{m.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Lộ trình ra mắt</h2>
          <ol className="mt-8 space-y-8 border-l border-border pl-8">
            {rollout.map((m) => (
              <li key={m.title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-primary"
                />
                <p className="text-sm font-semibold text-primary">{m.period}</p>
                <p className="mt-1 text-base font-semibold text-foreground">{m.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.detail}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 rounded-3xl border border-border bg-muted/40 p-8 md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Quản trị rủi ro</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Đề xuất tái bảo hiểm theo tỷ lệ 60% cùng Gen Re cho quyền lợi tử vong và thương tật toàn bộ
            vĩnh viễn. Kinh nghiệm thực tế được so sánh với giả định định phí mỗi quý; nếu vượt ngưỡng,
            công ty sẽ tăng tỷ lệ tái bảo hiểm, điều chỉnh phí bổ trợ khi tái tục hoặc siết điều kiện
            tham gia, và luôn tôn trọng quyền lợi Care Hours đã tích lũy của gia đình.
          </p>
          <p className="mt-4 text-xs italic leading-relaxed text-muted-foreground">
            Sản phẩm đang ở giai đoạn đề xuất. Biểu phí, điều khoản và năng lực nhà cung cấp cần được
            thẩm định trước khi ra mắt chính thức.
          </p>
        </div>
      </Container>
    </div>
  );
}

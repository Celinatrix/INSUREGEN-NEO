import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { stats, trustPoints } from "@/lib/data/content";
import { comingSoon } from "@/lib/data/care-wallet";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Tìm hiểu sứ mệnh và cách tiếp cận của INSUREGEN NEO trong việc xây dựng Family Care Wallet.",
};

const milestones = [
  {
    year: "2024",
    title: "Nghiên cứu thị trường",
    detail:
      "Khảo sát cấu trúc hộ gia đình đô thị và mức độ sử dụng dịch vụ y tế theo độ tuổi tại Việt Nam.",
  },
  {
    year: "2025",
    title: "Thiết kế khung đánh giá chức năng",
    detail:
      "Xây dựng mô hình đánh giá khả năng chăm sóc con (FIS) dựa trên bằng chứng y khoa khách quan, tham khảo các mô hình bảo hiểm chăm sóc quốc tế.",
  },
  {
    year: "2025",
    title: "Hình thành mạng lưới đối tác",
    detail:
      "Hợp tác cùng Thanh Tâm Care, Vi Easy Care và Việc Nhà VN để đảm bảo Care Units có thể quy đổi thành dịch vụ thật.",
  },
  {
    year: "2026",
    title: "Ra mắt Family Care Wallet",
    detail: "Giới thiệu sản phẩm đầu tiên đến các gia đình tại đô thị lớn.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Về chúng tôi
          </p>
          <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Bắt đầu từ một câu hỏi đơn giản: ai chăm con khi cha mẹ không thể?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            INSUREGEN NEO xây dựng Family Care Wallet dựa trên quan sát rằng
            phần lớn gia đình đô thị hiện nay không có ông bà hỗ trợ tại chỗ.
            Chúng tôi tin bảo hiểm chăm sóc gia đình nên trả bằng dịch vụ thật,
            đúng nhu cầu thật — không phải một khoản tiền mặt chung chung.
          </p>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-8 border-y border-border py-10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-semibold text-primary">{stat.value}</dd>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </dl>

        <div className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Cam kết của chúng tôi
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point.title} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {point.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Hành trình phát triển
          </h2>
          <ol className="mt-8 space-y-8 border-l border-border pl-8">
            {milestones.map((milestone) => (
              <li key={milestone.title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-primary"
                />
                <p className="text-sm font-semibold text-primary">{milestone.year}</p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {milestone.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {milestone.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 rounded-3xl border border-dashed border-border bg-muted/40 p-8 md:p-10">
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {comingSoon.badge}
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            {comingSoon.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {comingSoon.description}
          </p>
          <p className="mt-4 text-xs italic leading-relaxed text-muted-foreground">
            {comingSoon.disclaimer}
          </p>
        </div>
      </Container>
    </div>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { stats, trustPoints } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Tìm hiểu sứ mệnh, năng lực tài chính và cam kết minh bạch của INSUREGEN NEO trong lĩnh vực bảo hiểm số.",
};

const milestones = [
  { year: "2019", title: "Thành lập", detail: "Ra mắt với sản phẩm bảo hiểm sức khỏe đầu tiên." },
  { year: "2021", title: "Mở rộng mạng lưới", detail: "Liên kết bảo lãnh viện phí trực tiếp với hơn 100 bệnh viện." },
  { year: "2023", title: "Số hóa toàn diện", detail: "Triển khai quy trình bồi thường và ký hợp đồng điện tử." },
  { year: "2026", title: "INSUREGEN NEO", detail: "Tái định vị thương hiệu, phục vụ hơn 2,4 triệu khách hàng." },
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
            Xây dựng sự an tâm bằng công nghệ và sự minh bạch
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            INSUREGEN NEO được thành lập với sứ mệnh giúp mọi người dễ dàng
            tiếp cận các giải pháp bảo hiểm phù hợp, với quy trình rõ ràng và
            tốc độ xử lý bồi thường vượt trội.
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
              <li key={milestone.year} className="relative">
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
      </Container>
    </div>
  );
}

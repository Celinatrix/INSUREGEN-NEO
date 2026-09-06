import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  product,
  problemStatement,
  activities,
  howItWorks,
  exampleScenario,
  partners,
  eligibility,
  faqs,
} from "@/lib/data/care-wallet";

export const metadata: Metadata = {
  title: "Family Care Wallet",
  description:
    "Family Care Wallet chi trả bằng dịch vụ chăm sóc thật khi cha hoặc mẹ tạm thời không thể chăm con vì lý do sức khỏe.",
};

export default function ProductPage() {
  return (
    <div className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Sản phẩm
          </p>
          <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-foreground">
            {product.name}{" "}
            <span className="text-muted-foreground">— {product.vnName}</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {product.tagline}
          </p>
          <p className="mt-4 leading-relaxed text-foreground">
            {product.description}
          </p>
          <Button href="/lien-he" variant="secondary" className="mt-8">
            Nhận tư vấn về Family Care Wallet
          </Button>
        </div>

        {/* Problem statement */}
        <div className="mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {problemStatement.title}
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {problemStatement.points.map((point) => (
              <div key={point.title} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <h3 className="text-base font-semibold text-card-foreground">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {point.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div id="cach-hoat-dong" className="mt-24 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Cách hoạt động
          </h2>
          <ol className="mt-8 space-y-6">
            {howItWorks.map((item) => (
              <li
                key={item.step}
                className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Activities covered */}
        <div className="mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            6 hoạt động chăm sóc được đánh giá
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Mức độ ảnh hưởng đến từng hoạt động dưới đây, cùng độ tuổi của
            con, quyết định lượng Care Units gia đình nhận được.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <div key={activity.code} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {activity.code}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-card-foreground">
                  {activity.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Example scenario */}
        <div className="mt-24 rounded-3xl border border-border bg-muted/40 p-8 md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {exampleScenario.title}
          </h2>
          <p className="mt-4 leading-relaxed text-foreground">
            {exampleScenario.summary}
          </p>
          <p className="mt-4 leading-relaxed text-foreground">
            {exampleScenario.outcome}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {exampleScenario.note}
          </p>
        </div>

        {/* Partner network */}
        <div id="doi-tac" className="mt-24 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Mạng lưới đối tác dịch vụ
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Care Units được sử dụng để đặt dịch vụ trực tiếp từ các đối tác
            đã kiểm định sau đây.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {partners.map((partner) => (
              <div key={partner.name} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {partner.category}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                  {partner.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <div className="mt-24 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {eligibility.title}
            </h2>
          </div>
          <ul className="space-y-3">
            {eligibility.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-foreground">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-0.5 shrink-0 text-accent"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div id="faq" className="mt-24 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Câu hỏi thường gặp
          </h2>
          <dl className="mt-8 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-t border-border pt-6">
                <dt className="font-semibold text-foreground">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-20 rounded-3xl border border-border bg-card p-10 text-center shadow-card">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Sẵn sàng tìm hiểu Family Care Wallet phù hợp với gia đình bạn?
          </h2>
          <div className="mt-6 flex justify-center">
            <Button href="/lien-he" variant="secondary">
              Nhận tư vấn miễn phí
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

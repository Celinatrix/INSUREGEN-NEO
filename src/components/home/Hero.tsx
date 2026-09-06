import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { stats } from "@/lib/data/content";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 15% 15%, rgba(14,165,233,0.35), transparent 60%), radial-gradient(50% 45% at 85% 25%, rgba(34,211,238,0.22), transparent 60%)",
        }}
      />
      <Container className="relative py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-navy-border bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-neo-cyan">
              Bảo hiểm số thế hệ mới
            </span>
            <h1 className="text-balance mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
              Bảo vệ những gì quan trọng nhất, ngay từ hôm nay
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-muted">
              INSUREGEN NEO kết hợp năng lực tài chính vững chắc với công nghệ
              bồi thường số hóa, mang đến sự an tâm tức thì cho cá nhân, gia
              đình và doanh nghiệp.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/lien-he" variant="on-dark">
                Nhận báo giá miễn phí
              </Button>
              <Button href="/san-pham" variant="ghost" className="border-navy-border text-white hover:bg-white/10">
                Khám phá sản phẩm
              </Button>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 shadow-elevated md:p-8">
            <p className="text-sm font-medium uppercase tracking-wide text-neo-cyan">
              Chỉ số đáng tin cậy
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-semibold text-white md:text-3xl">
                    {stat.value}
                  </dd>
                  <p className="mt-1 text-sm text-navy-muted">{stat.label}</p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}

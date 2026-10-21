import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { heroStats } from "@/lib/data/content";

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
              Family Reconnect
            </span>
            <h1 className="text-balance mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
              Bảo vệ cả cha và mẹ, giữ nhịp sinh hoạt cho cả gia đình
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-muted">
              Một hợp đồng cho cả hai vợ chồng: 2 tỷ đồng khi gia đình gặp mất
              mát lớn, cùng trợ cấp nằm viện và Care Hours để có người trông
              con, nấu ăn, dọn nhà khi cha hoặc mẹ cần thời gian hồi phục.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/lien-he" variant="on-dark">
                Nhận tư vấn miễn phí
              </Button>
              <Button href="/san-pham" variant="ghost" className="border-navy-border text-white hover:bg-white/10">
                Tìm hiểu cách hoạt động
              </Button>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 shadow-elevated md:p-8">
            <p className="text-sm font-medium uppercase tracking-wide text-neo-cyan">
              Quyền lợi chính
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-6">
              {heroStats.map((stat) => (
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

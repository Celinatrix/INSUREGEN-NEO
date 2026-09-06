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
              Family Care Wallet
            </span>
            <h1 className="text-balance mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
              Khi bạn không thể chăm con, ai đó vẫn cần làm điều đó
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-muted">
              Family Care Wallet đánh giá đúng phần chăm sóc con bị thiếu hụt
              khi cha hoặc mẹ gặp sự cố sức khỏe, và chi trả bằng dịch vụ
              chăm sóc thật thay vì một khoản tiền mặt chung chung.
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
              Family Care Wallet trong con số
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

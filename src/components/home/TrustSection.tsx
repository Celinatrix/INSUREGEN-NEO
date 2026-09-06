import { Container } from "@/components/ui/Container";
import { trustPoints } from "@/lib/data/content";

export function TrustSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Vì sao chọn INSUREGEN NEO
          </p>
          <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Khác với bảo hiểm truyền thống, ngay từ cách thiết kế
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-border bg-card p-8 shadow-card"
            >
              <h3 className="text-lg font-semibold text-card-foreground">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {point.detail}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

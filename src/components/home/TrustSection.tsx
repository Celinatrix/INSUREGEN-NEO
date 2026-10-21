import { Container } from "@/components/ui/Container";
import { differentiators, familyNeeds } from "@/lib/data/family-reconnect";

export function TrustSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Một sự kiện, ba nhu cầu
          </p>
          <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Khi cha hoặc mẹ gặp vấn đề sức khỏe, cả gia đình bị ảnh hưởng
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Bảo hiểm hiện nay lo từng phần riêng lẻ. Family Reconnect gộp cả ba
            nhu cầu vào một hợp đồng.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {familyNeeds.map((item) => (
            <div
              key={item.event}
              className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-card"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sự kiện
              </p>
              <h3 className="mt-1 text-lg font-semibold text-card-foreground">
                {item.event}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.loss}
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{item.need}</p>
                <p className="mt-1 text-sm text-primary">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Vì sao khác biệt
          </p>
          <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Tiền mặt thôi chưa đưa được người chăm con đến nhà
          </h2>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {differentiators.map((point) => (
            <div key={point.title} className="rounded-2xl border border-border bg-card p-8 shadow-card">
              <h3 className="text-lg font-semibold text-card-foreground">{point.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{point.detail}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

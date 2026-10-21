import { Container } from "@/components/ui/Container";
import { scenarios } from "@/lib/data/family-reconnect";

export function Scenarios() {
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Tình huống minh họa
          </p>
          <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Family Reconnect hỗ trợ gia đình ra sao
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {scenarios.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {item.label}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Tình huống giả định để minh họa quyền lợi. Quyền lợi thực tế theo quy tắc và điều khoản hợp đồng.
        </p>
      </Container>
    </section>
  );
}

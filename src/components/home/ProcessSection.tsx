import { Container } from "@/components/ui/Container";
import { howItWorks } from "@/lib/data/care-wallet";

export function ProcessSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Cách hoạt động
          </p>
          <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Từ sự cố y tế đến dịch vụ chăm sóc thật
          </h2>
        </div>

        <ol className="mt-14 grid gap-8 md:grid-cols-5">
          {howItWorks.map((item, index) => (
            <li key={item.step} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {item.step}
                </span>
                {index < howItWorks.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden h-px flex-1 bg-border md:block"
                  />
                )}
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

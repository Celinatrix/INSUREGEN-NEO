import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { keyBenefits, product, services } from "@/lib/data/family-reconnect";

export function ProductIntro() {
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {product.name} + {product.riderName}
            </p>
            <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Bảo vệ cho mất mát lớn, hỗ trợ cho những ngày gián đoạn
            </h2>
          </div>
          <Button href="/san-pham" variant="ghost">
            Xem chi tiết sản phẩm
          </Button>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {keyBenefits.map((benefit) => (
            <div key={benefit.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="text-2xl font-semibold text-primary">{benefit.value}</p>
              <h3 className="mt-2 text-sm font-semibold text-card-foreground">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Dùng Care Hours trong {product.walletName}
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {service.rule}
                </span>
                <h3 className="mt-3 text-base font-semibold text-card-foreground">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

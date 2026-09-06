import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { activities, partners, product } from "@/lib/data/care-wallet";

export function ProductIntro() {
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {product.name}
            </p>
            <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              6 hoạt động chăm sóc, đánh giá đúng nhu cầu thật của con bạn
            </h2>
          </div>
          <Button href="/san-pham" variant="ghost">
            Xem chi tiết sản phẩm
          </Button>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-16 border-t border-border pt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Đặt dịch vụ qua mạng lưới đối tác
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {partners.map((partner) => (
              <div key={partner.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-base font-semibold text-card-foreground">
                  {partner.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {partner.category}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

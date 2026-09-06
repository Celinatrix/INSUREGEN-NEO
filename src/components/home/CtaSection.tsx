import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CtaSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center text-navy-foreground md:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, rgba(14,165,233,0.35), transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-balance mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Sẵn sàng để gia đình bạn luôn có người thay thế khi cần?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-navy-muted">
              Nhận tư vấn miễn phí về Family Care Wallet trong vòng chưa đầy 5 phút.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/lien-he" variant="on-dark">
                Nhận tư vấn miễn phí
              </Button>
              <Button
                href="/ve-chung-toi"
                variant="ghost"
                className="border-navy-border text-white hover:bg-white/10"
              >
                Tìm hiểu về chúng tôi
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

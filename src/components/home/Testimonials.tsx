import { Container } from "@/components/ui/Container";
import { testimonials, partners } from "@/lib/data/content";

export function Testimonials() {
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Khách hàng nói gì
          </p>
          <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Được tin dùng bởi hàng triệu khách hàng
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-card-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Đồng hành cùng các đối tác uy tín
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map((partner) => (
              <span
                key={partner}
                className="text-sm font-semibold text-muted-foreground/70"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

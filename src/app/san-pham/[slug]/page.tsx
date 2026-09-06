import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { products, getProductBySlug } from "@/lib/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/san-pham/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Không tìm thấy sản phẩm" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage(
  props: PageProps<"/san-pham/[slug]">
) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-20 md:py-28">
      <Container>
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/san-pham" className="hover:text-primary">
            Sản phẩm
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {product.category}
            </span>
            <h1 className="text-balance mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {product.tagline}
            </p>
            <p className="mt-6 leading-relaxed text-foreground">
              {product.description}
            </p>

            <h2 className="mt-12 text-xl font-semibold text-foreground">
              Quyền lợi chính
            </h2>
            <ul className="mt-5 space-y-3">
              {product.coverage.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 shrink-0 text-accent"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-xl font-semibold text-foreground">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-5 space-y-6">
              {product.faqs.map((faq) => (
                <div key={faq.question} className="border-t border-border pt-5">
                  <dt className="font-semibold text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-8 shadow-card md:sticky md:top-28">
            <p className="text-sm text-muted-foreground">Phí tham gia chỉ từ</p>
            <p className="mt-1 text-3xl font-semibold text-primary">
              {product.priceFrom}
            </p>
            <div className="mt-6 space-y-4">
              {product.highlights.map((highlight) => (
                <div key={highlight.title} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                  <p className="text-sm font-semibold text-foreground">
                    {highlight.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {highlight.detail}
                  </p>
                </div>
              ))}
            </div>
            <Button href="/lien-he" variant="secondary" className="mt-8 w-full">
              Nhận báo giá cho {product.name}
            </Button>
          </aside>
        </div>
      </Container>
    </div>
  );
}

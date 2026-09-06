import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/lib/data/products";

export function ProductsPreview() {
  const featured = products.slice(0, 3);

  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Sản phẩm bảo hiểm
            </p>
            <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Giải pháp phù hợp cho từng giai đoạn cuộc sống
            </h2>
          </div>
          <Button href="/san-pham" variant="ghost">
            Xem tất cả sản phẩm
          </Button>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}

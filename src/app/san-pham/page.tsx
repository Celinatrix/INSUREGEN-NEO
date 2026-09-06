import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Sản phẩm bảo hiểm",
  description:
    "Khám phá đầy đủ các sản phẩm bảo hiểm sức khỏe, nhân thọ, xe cơ giới, nhà ở, du lịch và doanh nghiệp của INSUREGEN NEO.",
};

export default function ProductsPage() {
  return (
    <div className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Sản phẩm bảo hiểm
          </p>
          <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Giải pháp bảo hiểm cho mọi giai đoạn cuộc sống
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Từ chăm sóc sức khỏe hằng ngày đến bảo vệ tài sản và tương lai tài
            chính, INSUREGEN NEO có sản phẩm phù hợp với từng nhu cầu của bạn.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}

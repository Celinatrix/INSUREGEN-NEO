import Link from "next/link";
import { Product } from "@/lib/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        {product.category}
      </span>
      <h3 className="mt-4 text-xl font-semibold text-card-foreground">
        {product.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {product.tagline}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <span className="text-sm font-semibold text-primary">
          Từ {product.priceFrom}
        </span>
        <span
          aria-hidden="true"
          className="text-primary transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
}

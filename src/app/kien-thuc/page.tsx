import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { insights } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Kiến thức bảo hiểm",
  description:
    "Cẩm nang kiến thức giúp bạn hiểu rõ hơn về các sản phẩm bảo hiểm và cách lựa chọn quyền lợi phù hợp.",
};

export default function InsightsPage() {
  return (
    <div className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Kiến thức bảo hiểm
          </p>
          <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Hiểu rõ trước khi quyết định
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Những bài viết giúp bạn hiểu rõ quyền lợi nhân thọ chung, Care Hours,
            điểm CIS và cách tính phí trước khi tham gia Family Reconnect.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {insights.map((post) => (
            <article
              key={post.slug}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {post.category}
              </span>
              <h2 className="mt-4 text-lg font-semibold leading-snug text-card-foreground">
                {post.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <p className="mt-6 text-xs font-medium text-muted-foreground">
                {post.readTime}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}

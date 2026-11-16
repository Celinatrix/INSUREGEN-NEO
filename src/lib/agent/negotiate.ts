// Đàm phán nội dung theo header Accept (RFC 9110 §12.5.1): trả Markdown khi client ưu tiên
// text/markdown hơn text/html. Thiếu Accept, "*/*" hay trình duyệt thường đều nhận HTML như cũ.

type Range = { type: string; q: number; specificity: number };

function parse(accept: string): Range[] {
  return accept
    .split(",")
    .map((part) => {
      const [media, ...params] = part.trim().toLowerCase().split(";").map((s) => s.trim());
      if (!media) return null;
      let q = 1;
      for (const p of params) {
        const [k, v] = p.split("=").map((s) => s.trim());
        if (k === "q") {
          const n = Number(v);
          q = Number.isFinite(n) ? Math.min(Math.max(n, 0), 1) : 0;
        }
      }
      const specificity = media === "*/*" ? 0 : media.endsWith("/*") ? 1 : 2;
      return { type: media, q, specificity };
    })
    .filter((r): r is Range => r !== null);
}

/** q-value mà header Accept gán cho một kiểu cụ thể (dải khớp cụ thể nhất thắng). */
export function qualityOf(accept: string, type: string): number {
  const [major] = type.split("/");
  let best: Range | null = null;
  for (const r of parse(accept)) {
    const matches = r.type === type || r.type === `${major}/*` || r.type === "*/*";
    if (matches && (!best || r.specificity > best.specificity)) best = r;
  }
  return best ? best.q : 0;
}

/** true khi client xin Markdown rõ ràng và không ưu tiên HTML hơn. */
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  const ranges = parse(accept);
  const explicit = ranges.some((r) => r.type === "text/markdown" && r.q > 0);
  if (!explicit) return false;
  return qualityOf(accept, "text/markdown") >= qualityOf(accept, "text/html");
}

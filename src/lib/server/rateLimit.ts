// Giới hạn tần suất đơn giản theo IP, lưu trong bộ nhớ (đủ cho demo; mỗi máy chủ đếm riêng).
const hits = new Map<string, number[]>();

export function rateLimited(request: Request, key: string, max: number, windowMs: number): boolean {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  const id = `${key}:${ip}`;
  const t = Date.now();
  const list = (hits.get(id) ?? []).filter((x) => t - x < windowMs);
  list.push(t);
  hits.set(id, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

// Giới hạn tần suất đơn giản theo IP, lưu trong bộ nhớ (đủ cho demo; mỗi máy chủ đếm riêng).
const hits = new Map<string, number[]>();

/**
 * IP của người gửi. Trên Vercel, x-real-ip do Vercel đặt và người dùng không sửa được;
 * phần tử đầu của x-forwarded-for thì ai cũng tự điền được, nên chỉ dùng khi không có x-real-ip.
 */
export function clientIp(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const fwd = (request.headers.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return fwd[fwd.length - 1] ?? "local";
}

export function rateLimited(request: Request, key: string, max: number, windowMs: number): boolean {
  const id = `${key}:${clientIp(request)}`;
  const t = Date.now();
  const list = (hits.get(id) ?? []).filter((x) => t - x < windowMs);
  list.push(t);
  hits.set(id, list);
  if (hits.size > 5000) {
    // Dọn các mục đã hết hạn thay vì xóa sạch (xóa sạch sẽ mở lại giới hạn cho mọi người).
    for (const [k, v] of hits) if (v.every((x) => t - x >= windowMs)) hits.delete(k);
    if (hits.size > 5000) hits.delete(hits.keys().next().value!);
  }
  return list.length > max;
}

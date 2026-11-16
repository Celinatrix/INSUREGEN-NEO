// Chỉ dùng khi phát triển: dữ liệu ví xấu nhất cho /vi-cham-soc?data=worst|empty|one|huge.
// Giới hạn lấy từ product.ts: 120 Giờ chăm sóc mỗi bố/mẹ mỗi năm + 1 giờ tặng, 30 ngày trợ cấp mỗi bố/mẹ.
import { SERVICES, type Service } from "@/lib/product";

// Phụ lục C.2: giờ tặng không gồm đưa đón.
const GIFT: Service[] = ["childcare", "meals", "housekeeping"];

export const WALLET_FIXTURES = ["demo", "worst", "empty", "one", "huge"] as const;
export type WalletFixture = (typeof WALLET_FIXTURES)[number];

type Parent = "father" | "mother";
const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000).toISOString();
const day = (daysAgo: number) => iso(daysAgo).slice(0, 10);

function grant(i: number, parent: Parent | null, hours: number, remaining: number, services: readonly Service[], ago: number, expired = false) {
  return {
    id: `g${i}`,
    kind: parent ? ("claim" as const) : ("gift" as const),
    parent,
    expires_on: day(ago - 90),
    expired,
    hours,
    remaining,
    services: [...services],
    created_at: iso(ago),
  };
}
function booking(i: number, service: Service, hours: number, ago: number) {
  const credits = service === "transport" ? hours * 2 : hours;
  return { id: `b${i}`, service, service_hours: hours, credits, service_date: day(ago), created_at: iso(ago) };
}

export function walletFixture(kind: Exclude<WalletFixture, "demo">, id: string) {
  const base = { id, youngestChildAge: 0, claims: [], storage: "memory" as const };
  if (kind === "empty") {
    return { ...base, balance: 0, cashPaid: 0, limitLeft: { father: 120, mother: 120 }, grants: [], bookings: [] };
  }
  if (kind === "one") {
    return {
      ...base,
      balance: 1,
      cashPaid: 500_000,
      limitLeft: { father: 119, mother: 120 },
      grants: [grant(1, null, 1, 1, ["childcare"], 0)],
      bookings: [booking(1, "transport", 1, 0)],
    };
  }
  if (kind === "huge") {
    // Trần thật: 241 giờ trong năm, nên tối đa 241 lần đặt 1 giờ.
    const bookings = Array.from({ length: 241 }, (_, i) => booking(i, SERVICES[i % 4], 1, 364 - Math.floor(i * 1.5)));
    return {
      ...base,
      balance: 0,
      cashPaid: 30_000_000,
      limitLeft: { father: 0, mother: 0 },
      grants: [grant(1, "father", 60, 0, SERVICES, 360), grant(2, "father", 60, 0, SERVICES, 200), grant(3, "mother", 60, 0, SERVICES, 300), grant(4, "mother", 60, 0, SERVICES, 120), grant(5, null, 1, 0, GIFT, 364)],
      bookings,
    };
  }
  // worst: mọi trường ở mức dài/lớn nhất có thật, trộn trên các dòng đầu.
  return {
    ...base,
    balance: 241,
    cashPaid: 30_000_000,
    limitLeft: { father: 0, mother: 1 },
    grants: [
      grant(1, "father", 60, 60, SERVICES, 1),
      grant(2, "mother", 80, 80, ["transport", "housekeeping"], 3),
      grant(3, null, 1, 1, GIFT, 5),
      grant(4, "mother", 40, 0, ["housekeeping"], 120, true),
    ],
    bookings: [booking(1, "transport", 24, 2), booking(2, "housekeeping", 1, 4), booking(3, "childcare", 24, 6)],
  };
}

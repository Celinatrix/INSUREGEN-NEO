// Quy tắc quyền lợi Family Continuity Rider — hàm thuần, dùng chung cho giao diện và API.
import {
  ACTIVITIES,
  CIS_WEIGHTS,
  CREDITS_PER_SERVICE_HOUR,
  PATHWAY_A_ICU_HOURS_FOR_TOP_TIER,
  PATHWAY_A_TIERS,
  PATHWAY_B_TIERS,
  RIDER,
  SERVICES,
  SERVICE_UNLOCKED_BY,
  SEVERITY,
  type Activity,
  type ChildBand,
  type Service,
  type Severity,
} from "./product.ts";

/** Lộ trình A: số Care Hours theo số ngày nằm viện và giờ ICU. */
export function pathwayAHours(inpatientDays: number, icuHours = 0): number {
  if (icuHours >= PATHWAY_A_ICU_HOURS_FOR_TOP_TIER) return PATHWAY_A_TIERS[0].hours;
  for (const tier of PATHWAY_A_TIERS) if (inpatientDays >= tier.minDays) return tier.hours;
  return 0;
}

/** Trợ cấp nằm viện, trừ đi số ngày đã được trả trong năm hợp đồng. */
export function hospitalCash(inpatientDays: number, daysAlreadyPaidThisYear = 0) {
  const remaining = Math.max(0, RIDER.hospitalCashMaxDaysPerParentYear - daysAlreadyPaidThisYear);
  const paidDays = Math.min(Math.max(0, Math.floor(inpatientDays)), remaining);
  return { paidDays, amount: paidDays * RIDER.hospitalCashPerDay };
}

export type Ratings = Record<Activity, Severity>;

/** Điểm CIS = tổng có trọng số của 6 hoạt động (Phụ lục B.2). */
export function cisScore(band: ChildBand, ratings: Ratings): number {
  const w = CIS_WEIGHTS[band];
  const s = ACTIVITIES.reduce((sum, a) => sum + w[a] * SEVERITY[ratings[a]], 0);
  return Math.round(s * 10000) / 10000;
}

/** Lộ trình B: số Care Hours theo điểm CIS. Cần ít nhất một hoạt động F2/F3. */
export function pathwayBHours(score: number, ratings: Ratings): number {
  const hasRestriction = ACTIVITIES.some((a) => ratings[a] === "F2" || ratings[a] === "F3");
  if (!hasRestriction) return 0;
  for (const tier of PATHWAY_B_TIERS) if (score >= tier.minScore - 1e-9) return tier.hours;
  return 0;
}

/** Dịch vụ được mở. Lộ trình A mở tất cả; Lộ trình B mở theo hoạt động F2/F3. */
export function unlockedServices(pathway: "A" | "B", ratings?: Ratings): Service[] {
  if (pathway === "A" || !ratings) return [...SERVICES];
  return SERVICES.filter((s) =>
    SERVICE_UNLOCKED_BY[s].some((a) => ratings[a] === "F2" || ratings[a] === "F3"),
  );
}

/** Giới hạn theo hạn mức 120 giờ mỗi bố/mẹ mỗi năm. */
export function capToAnnualLimit(hours: number, alreadyGrantedThisYear: number): number {
  return Math.max(0, Math.min(hours, RIDER.careHoursPerParentYear - alreadyGrantedThisYear));
}

export type Grant = {
  id: string;
  hours: number; // Care Hours được cấp
  services: Service[]; // dịch vụ được dùng
  used: number; // Care Hours đã dùng
  housekeepingUsed: number; // Care Hours đã dùng cho dọn nhà
  createdAt: string;
  capHousekeeping?: boolean; // mặc định true; giờ tặng hằng năm không áp giới hạn 30%
};

export type Allocation = { grantId: string; credits: number }[];

/**
 * Trừ Care Hours cho một lần đặt dịch vụ, ưu tiên lần cấp cũ nhất (FIFO).
 * Tôn trọng dịch vụ được mở của từng lần cấp và giới hạn dọn nhà 30% mỗi lần cấp.
 */
export function allocateBooking(
  grants: Grant[],
  service: Service,
  serviceHours: number,
): { ok: true; credits: number; allocation: Allocation } | { ok: false; credits: number; reason: string } {
  const credits = serviceHours * CREDITS_PER_SERVICE_HOUR[service];
  if (!Number.isFinite(serviceHours) || serviceHours <= 0) {
    return { ok: false, credits, reason: "invalid_hours" };
  }
  const ordered = [...grants]
    .filter((g) => g.services.includes(service))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  let need = credits;
  const allocation: Allocation = [];
  for (const g of ordered) {
    let room = g.hours - g.used;
    if (service === "housekeeping" && g.capHousekeeping !== false) {
      const cap = Math.floor(g.hours * RIDER.housekeepingMaxShareOfGrant);
      room = Math.min(room, cap - g.housekeepingUsed);
    }
    if (room <= 0) continue;
    const take = Math.min(room, need);
    allocation.push({ grantId: g.id, credits: take });
    need -= take;
    if (need === 0) break;
  }
  if (need > 0) {
    return {
      ok: false,
      credits,
      reason: ordered.length === 0 ? "service_not_unlocked" : "insufficient_hours",
    };
  }
  return { ok: true, credits, allocation };
}

/** Tổng số dư khả dụng của ví. */
export function walletBalance(grants: Grant[]) {
  return grants.reduce((s, g) => s + (g.hours - g.used), 0);
}

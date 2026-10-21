// Nghiệp vụ ví Care Hours: tạo ví, nhận hồ sơ bồi thường, đặt dịch vụ.
import { ELIGIBILITY, RIDER, SERVICES, type Service } from "../product.ts";
import { addDays, allocateBooking, walletBalance } from "../rules.ts";
import { evaluateClaim, type ClaimInput, type Parent, type PriorClaim } from "../claims.ts";
import { getStore, toGrant, type WalletSnapshot } from "./store.ts";

const GIFT_SERVICES: Service[] = ["childcare", "meals", "housekeeping"];

const today = () => new Date().toISOString().slice(0, 10);

/** Ví dùng thử coi như hợp đồng đã hiệu lực được một năm, để thời gian chờ không chặn bản demo. */
export const demoPolicyStart = (walletCreatedAt: string) => addDays(walletCreatedAt, -365);

export function summarize(s: WalletSnapshot) {
  const grants = s.grants.map(toGrant);
  const now = today();
  const limitLeft = (p: Parent) =>
    RIDER.careHoursPerParentYear -
    s.claims.filter((c) => c.parent === p && c.status !== "rejected").reduce((x, c) => x + c.hours_awarded, 0);
  return {
    id: s.wallet.id,
    createdAt: s.wallet.created_at,
    youngestChildAge: s.wallet.youngest_child_age,
    policyStart: demoPolicyStart(s.wallet.created_at),
    balance: walletBalance(grants, now),
    cashPaid: s.claims.reduce((x, c) => x + c.cash_amount, 0),
    limitLeft: { father: limitLeft("father"), mother: limitLeft("mother") },
    claims: s.claims,
    grants: s.grants.map((g) => ({ ...g, remaining: g.hours - g.used, expired: now > g.expires_on })),
    bookings: s.bookings,
    storage: getStore().kind,
  };
}

export async function createWallet(youngestChildAge: number) {
  const store = getStore();
  const w = await store.createWallet(youngestChildAge);
  await store.insertGrant({
    wallet_id: w.id,
    claim_id: null,
    parent: null,
    kind: "gift",
    hours: RIDER.giftHoursPerFamilyYear,
    services: GIFT_SERVICES,
    used: 0,
    housekeeping_used: 0,
    expires_on: addDays(w.created_at, RIDER.giftValidityDays - 1),
  });
  return (await store.getWallet(w.id))!;
}

export function parseClaim(body: unknown, youngestChildAge: number): ClaimInput | null {
  const b = body as Record<string, unknown>;
  const parent = b.parent === "mother" ? "mother" : b.parent === "father" ? "father" : null;
  const reason = ["illness", "injury", "pregnancy"].includes(String(b.reason)) ? (b.reason as ClaimInput["reason"]) : null;
  if (!parent || !reason) return null;
  if (b.pathway === "A") {
    const icu = Number(b.icuHours ?? 0);
    if (typeof b.admissionDate !== "string" || typeof b.dischargeDate !== "string") return null;
    return {
      parent,
      reason,
      pathway: "A",
      admissionDate: b.admissionDate,
      dischargeDate: b.dischargeDate,
      icuHours: Number.isFinite(icu) && icu >= 0 ? Math.min(icu, 24 * 365) : 0,
    };
  }
  if (b.pathway === "B") {
    const r = b.ratings as Record<string, string> | undefined;
    const keys = ["C1", "C2", "C3", "C4", "C5", "C6"] as const;
    if (!r || !keys.every((k) => ["F0", "F1", "F2", "F3"].includes(r[k]))) return null;
    const days = Number(b.restrictedDays);
    return {
      parent,
      reason,
      pathway: "B",
      youngestChildAge,
      ratings: Object.fromEntries(keys.map((k) => [k, r[k]])) as never,
      restrictedDays: Number.isFinite(days) ? Math.max(0, Math.min(365, Math.floor(days))) : 0,
    };
  }
  return null;
}

export async function submitClaim(walletId: string, input: ClaimInput) {
  const store = getStore();
  const snap = await store.getWallet(walletId);
  if (!snap) return null;
  const prior: PriorClaim[] = snap.claims.map((c) => ({
    parent: c.parent,
    pathway: c.pathway,
    status: c.status,
    admissionDate: c.admission_date,
    dischargeDate: c.discharge_date,
    hoursAwarded: c.hours_awarded,
    cashDays: c.cash_days,
  }));
  const r = evaluateClaim(input, prior, today(), demoPolicyStart(snap.wallet.created_at));
  const claim = await store.insertClaim({
    wallet_id: walletId,
    parent: input.parent,
    pathway: input.pathway,
    reason: input.reason,
    admission_date: input.pathway === "A" ? input.admissionDate : null,
    discharge_date: input.pathway === "A" ? input.dischargeDate : null,
    icu_hours: input.pathway === "A" ? input.icuHours ?? 0 : null,
    ratings: input.pathway === "B" ? input.ratings : null,
    restricted_days: input.pathway === "B" ? input.restrictedDays : null,
    inpatient_days: r.inpatientDays,
    cis_score: r.cisScore,
    hours_awarded: r.hoursAwarded,
    cash_days: r.cashDays,
    cash_amount: r.cashAmount,
    status: r.status,
    reasons: r.reasons,
    flags: r.flags,
  });
  if (r.hoursAwarded > 0) {
    await store.insertGrant({
      wallet_id: walletId,
      claim_id: claim.id,
      parent: input.parent,
      kind: "claim",
      hours: r.hoursAwarded,
      services: r.services,
      used: 0,
      housekeeping_used: 0,
      expires_on: addDays(claim.created_at, RIDER.grantValidityDays - 1),
    });
  }
  return { result: r, claim, wallet: summarize((await store.getWallet(walletId))!) };
}

export async function book(walletId: string, service: string, serviceHours: number, serviceDate: string) {
  if (!(SERVICES as readonly string[]).includes(service)) return { error: "invalid_service" as const };
  const maxUnits = service === "transport" ? 10 : 24;
  if (!Number.isInteger(serviceHours) || serviceHours < 1 || serviceHours > maxUnits) return { error: "invalid_hours" as const };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(serviceDate)) return { error: "invalid_date" as const };
  const store = getStore();
  const snap = await store.getWallet(walletId);
  if (!snap) return null;
  const grants = snap.grants.map(toGrant);
  const a = allocateBooking(grants, service as Service, serviceHours, serviceDate);
  if (!a.ok) return { error: a.reason };
  // Trừ giờ từng phần; nếu một lượt đặt khác vừa trừ trước thì hoàn lại phần đã trừ và báo xung đột.
  const done: { id: string; used: number; hk: number; newUsed: number }[] = [];
  for (const part of a.allocation) {
    const gr = snap.grants.find((x) => x.id === part.grantId)!;
    const newUsed = gr.used + part.credits;
    const newHk = gr.housekeeping_used + (service === "housekeeping" ? part.credits : 0);
    if (!(await store.updateGrantUsage(gr.id, gr.used, newUsed, newHk))) {
      for (const d of done) await store.updateGrantUsage(d.id, d.newUsed, d.used, d.hk);
      return { error: "conflict" as const };
    }
    done.push({ id: gr.id, used: gr.used, hk: gr.housekeeping_used, newUsed });
  }
  const booking = await store.insertBooking({
    wallet_id: walletId,
    service: service as Service,
    service_hours: serviceHours,
    credits: a.credits,
    service_date: serviceDate,
    allocation: a.allocation,
  });
  return { booking, wallet: summarize((await store.getWallet(walletId))!) };
}

export const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
export const validChildAge = (n: number) => Number.isInteger(n) && n >= 0 && n <= ELIGIBILITY.youngestChildMaxAtEntry;

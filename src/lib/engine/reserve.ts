// Engine dự phòng — Phụ lục A.3–A.4 và mục 6.8 của báo cáo.
// Định giá tương lai tại thời điểm t, ngay trước khi thu phí đến hạn ở t; ở t = n mọi tổng tương lai rỗng.
// V_held = max(0, V_FPT,3%, V_G,corr). Ba thành phần luôn được trả riêng; không bao giờ thay V_G,corr bằng V_G raw.
import type { LifeBasis, LifeRun } from "./life.ts";

export const RESERVE_FORMULA_VERSION = "reserve-A3A4-2026.11.1";

export type ReserveRow = {
  t: number;
  inForce: number; // p_t
  rawGross: number; // V_G raw ở lãi suất định phí
  correctedGross: number; // V_G,corr = raw + (m + π)·G·ä_t
  net: number; // V_N ở lãi suất định giá
  fpt: number; // V_FPT ở lãi suất định giá
  held: number; // max(0, V_FPT, V_G,corr)
};

export type DevelopmentRow = {
  t: number;
  opening: number;
  premiumLessExpense: number;
  interest: number;
  expectedClaim: number;
  closing: number;
  residual: number;
};

export type ReserveRun = {
  valuationRate: number;
  netPremiumValuation: number; // P_N(3%)
  fptPremium: number; // β
  rows: ReserveRow[];
  development: DevelopmentRow[];
};

/** A_t và ä_t ở lãi suất i, theo đơn vị một hợp đồng còn hiệu lực tại t. */
function factors(run: LifeRun, t: number, i: number) {
  const v = 1 / (1 + i);
  const n = run.rows.length;
  let A = 0;
  let ad = 0;
  const pt = t < n ? run.rows[t].pStart : run.pEnd;
  for (let s = t; s < n; s++) {
    const r = run.rows[s];
    A += v ** (s + 1 - t) * (r.pStart / pt) * r.qJoint;
    ad += v ** (s - t) * (r.pStart / pt);
  }
  return { A, ad };
}

export function reserves(run: LifeRun, b: LifeBasis, valuationRate: number): ReserveRun {
  const n = run.rows.length;
  const S = b.sumAssured;
  const G = run.grossPremium;
  const v = 1 / (1 + b.pricingRate);
  const base = factors(run, 0, valuationRate);
  const netPremiumValuation = (S * base.A) / base.ad;
  const one = factors(run, 1, valuationRate);
  const fptPremium = (S * one.A) / one.ad;

  const rows: ReserveRow[] = [];
  for (let t = 0; t <= n; t++) {
    if (t === n) {
      rows.push({ t, inForce: run.pEnd, rawGross: 0, correctedGross: 0, net: 0, fpt: 0, held: 0 });
      continue;
    }
    const pt = run.rows[t].pStart;
    let benefits = 0;
    let annuity = 0;
    let commission = 0;
    for (let s = t; s < n; s++) {
      const r = run.rows[s];
      benefits += (r.pStart / pt) * r.qJoint * v ** (s - t + 1);
      annuity += (r.pStart / pt) * v ** (s - t);
      commission += (r.pStart / pt) * v ** (s - t) * r.commissionRate;
    }
    const epvB = S * benefits;
    const epvP = G * annuity;
    const rawGross =
      epvB * (1 + b.claimHandling) + b.reinsurance * epvP + b.adminPerYear * annuity + G * commission + (t === 0 ? b.acquisition : 0) - epvP;
    const correctedGross = rawGross + (b.riskMargin + b.profit) * G * annuity;
    const atVal = factors(run, t, valuationRate);
    const net = S * atVal.A - netPremiumValuation * atVal.ad;
    const fpt = t <= 1 ? 0 : S * atVal.A - fptPremium * atVal.ad;
    rows.push({ t, inForce: pt, rawGross, correctedGross, net, fpt, held: Math.max(0, fpt, correctedGross) });
  }

  // Kiểm tra truy hồi trên cơ sở gộp raw:
  // (V_t + G − r·G − c_(t+1)·G − a − k·[t=0])(1 + i) = q_t·S·(1 + h) + (1 − q_t)·V_(t+1)
  const development: DevelopmentRow[] = [];
  for (let t = 0; t < n; t++) {
    const r = run.rows[t];
    const opening = rows[t].rawGross;
    const premiumLessExpense = G * (1 - b.reinsurance - r.commissionRate) - b.adminPerYear - (t === 0 ? b.acquisition : 0);
    const interest = (opening + premiumLessExpense) * b.pricingRate;
    const expectedClaim = r.qJoint * S * (1 + b.claimHandling);
    const closing = (1 - r.qJoint) * rows[t + 1].rawGross;
    development.push({ t, opening, premiumLessExpense, interest, expectedClaim, closing, residual: opening + premiumLessExpense + interest - expectedClaim - closing });
  }
  return { valuationRate, netPremiumValuation, fptPremium, rows, development };
}

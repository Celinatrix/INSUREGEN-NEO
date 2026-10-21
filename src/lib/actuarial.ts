// Định phí bảo hiểm nhân thọ chung (Joint Life, first-to-event: tử vong hoặc TTTBVV).
// Tái lập đúng file "Joint_Life_TPD_20pct_Higher_Corrected_net - binh final.xlsx":
//   sheet Bang_CSO_1980 (bảng tỷ lệ), Mo_Hinh_Tinh_Phi (phí thuần), Gross_Premium_10Y (phí gộp).

/** [tuổi, TPD nam gốc (SOA 1987 GLTD), qD nam (CSO 1980), TPD nữ gốc (SOA 1985 CIDA), qD nữ (CSO 1980)] */
const RATES: [number, number, number, number, number][] = [
  [20, 0.000471, 0.0019, 0.00027, 0.00106],
  [21, 0.000489, 0.0019, 0.00028, 0.00108],
  [22, 0.000506, 0.00188, 0.00028, 0.0011],
  [23, 0.000523, 0.00184, 0.00028, 0.00112],
  [24, 0.000541, 0.0018, 0.00029, 0.00115],
  [25, 0.000558, 0.00175, 0.00029, 0.00117],
  [26, 0.000576, 0.00172, 0.00029, 0.0012],
  [27, 0.000593, 0.00171, 0.0003, 0.00124],
  [28, 0.000623, 0.0017, 0.00031, 0.00128],
  [29, 0.000654, 0.00172, 0.00034, 0.00132],
  [30, 0.000684, 0.00175, 0.00037, 0.00137],
  [31, 0.000715, 0.0018, 0.00041, 0.00142],
  [32, 0.000745, 0.00187, 0.00046, 0.00147],
  [33, 0.000802, 0.00195, 0.00052, 0.00154],
  [34, 0.000858, 0.00205, 0.00059, 0.00161],
  [35, 0.000915, 0.00217, 0.00066, 0.0017],
  [36, 0.000971, 0.00232, 0.00074, 0.00182],
  [37, 0.001028, 0.00249, 0.00082, 0.00196],
  [38, 0.001141, 0.00268, 0.00092, 0.00213],
  [39, 0.001254, 0.0029, 0.00101, 0.00232],
  [40, 0.001368, 0.00315, 0.00112, 0.00253],
  [41, 0.001481, 0.00342, 0.00123, 0.00275],
  [42, 0.001594, 0.00371, 0.00134, 0.00298],
  [43, 0.001859, 0.00403, 0.00146, 0.0032],
  [44, 0.002123, 0.00437, 0.00158, 0.00344],
  [45, 0.002388, 0.00473, 0.00171, 0.00368],
  [46, 0.002652, 0.00512, 0.00184, 0.00392],
  [47, 0.002917, 0.00553, 0.00197, 0.00419],
  [48, 0.003447, 0.00597, 0.00211, 0.00448],
  [49, 0.003977, 0.00646, 0.00226, 0.00479],
];
const BY_AGE = new Map(RATES.map((r) => [r[0], r]));
export const TABLE_AGE_MIN = RATES[0][0];
export const TABLE_AGE_MAX = RATES[RATES.length - 1][0];

export type LifeAssumptions = {
  sumAssured: number;
  termYears: number;
  interest: number; // lãi suất kỹ thuật
  tpdLoad: number; // hệ số an toàn TPD (×1,2)
  mortalityMult: number; // hệ số độ nhạy trên qD
  tpdMult: number; // hệ số độ nhạy trên qTPD (sau tpdLoad)
  riskLoad: number; // % phí gộp
  reinsurance: number; // % phí gộp
  claimExpense: number; // % quyền lợi kỳ vọng
  adminPerYear: number; // VND/hợp đồng/năm, đầu năm
  acquisition: number; // VND/hợp đồng, t = 0
  commission: [number, number, number]; // năm 1 / năm 2 / năm 3–10
  profit: number; // % phí gộp
};

export const BASE_LIFE: LifeAssumptions = {
  sumAssured: 2_000_000_000,
  termYears: 10,
  interest: 0.045,
  tpdLoad: 1.2,
  mortalityMult: 1,
  tpdMult: 1,
  riskLoad: 0.05,
  reinsurance: 0.03,
  claimExpense: 0.02,
  adminPerYear: 100_000,
  acquisition: 300_000,
  commission: [0.4, 0.2, 0.15],
  profit: 0.1,
};

export type LifeResult = {
  net: number; // phí thuần năm
  gross: number; // phí gộp năm
  apvBenefits: number; // APV quyền lợi (VND)
  annuityDue: number; // APV chuỗi phí đầu kỳ
};

/** Có đủ dữ liệu bảng cho cặp tuổi và thời hạn này không. */
export function inTable(fatherAge: number, motherAge: number, term = BASE_LIFE.termYears) {
  return [fatherAge, motherAge].every((a) => a >= TABLE_AGE_MIN && a + term - 1 <= TABLE_AGE_MAX);
}

export function jointLife(fatherAge: number, motherAge: number, over: Partial<LifeAssumptions> = {}): LifeResult {
  const a = { ...BASE_LIFE, ...over };
  if (!inTable(fatherAge, motherAge, a.termYears)) throw new RangeError("age_outside_table");
  const v = 1 / (1 + a.interest);
  let tp = 1; // xác suất cả hai chưa gặp biến cố đầu năm t
  let apvUnit = 0;
  let annuity = 0;
  let apvCommission = 0;
  for (let t = 0; t < a.termYears; t++) {
    const fx = BY_AGE.get(fatherAge + t)!;
    const my = BY_AGE.get(motherAge + t)!;
    const tpdX = fx[1] * a.tpdLoad * a.tpdMult;
    const dX = fx[2] * a.mortalityMult;
    const tpdY = my[3] * a.tpdLoad * a.tpdMult;
    const dY = my[4] * a.mortalityMult;
    const qx = tpdX + dX - tpdX * dX;
    const qy = tpdY + dY - tpdY * dY;
    const q = qx + qy - qx * qy;
    apvUnit += v ** (t + 1) * tp * q; // quyền lợi cuối năm
    const d = v ** t * tp; // phí đầu năm
    annuity += d;
    apvCommission += d * (t === 0 ? a.commission[0] : t === 1 ? a.commission[1] : a.commission[2]);
    tp *= 1 - q;
  }
  const apvBenefits = apvUnit * a.sumAssured;
  const net = apvBenefits / annuity;
  const gross =
    (apvBenefits * (1 + a.claimExpense) + a.adminPerYear * annuity + a.acquisition) /
    (annuity * (1 - a.riskLoad - a.reinsurance - a.profit) - apvCommission);
  return { net, gross, apvBenefits, annuityDue: annuity };
}

// Kịch bản kết hợp — sheet Tong_hop của file Sensitivity_Analysis_Joint_Life_va_Rider.
export const LIFE_SCENARIOS: { key: "optimistic" | "base" | "prudent" | "adverse" | "severe"; over: Partial<LifeAssumptions> }[] = [
  { key: "optimistic", over: { interest: 0.09, mortalityMult: 0.9, tpdMult: 0.9, commission: [0.3, 0.2, 0.15] } },
  { key: "base", over: {} },
  { key: "prudent", over: { interest: 0.06, mortalityMult: 1.1, tpdMult: 1.25 } },
  { key: "adverse", over: { interest: 0.05, mortalityMult: 1.2, tpdMult: 1.5, adminPerYear: 150_000, claimExpense: 0.03 } },
  { key: "severe", over: { interest: 0.04, mortalityMult: 1.5, tpdMult: 2, adminPerYear: 200_000, claimExpense: 0.05, reinsurance: 0.05 } },
];

/** Bảng tỷ lệ dùng để định phí (sau hệ số TPD), cho trang Cơ sở định phí. */
export function rateTable(tpdLoad = BASE_LIFE.tpdLoad) {
  return RATES.map(([age, tpdM, dM, tpdF, dF]) => ({
    age,
    tpdMaleBase: tpdM,
    tpdMale: tpdM * tpdLoad,
    deathMale: dM,
    tpdFemaleBase: tpdF,
    tpdFemale: tpdF * tpdLoad,
    deathFemale: dF,
  }));
}

export type ReserveRow = {
  t: number; // đầu năm hợp đồng t (0 = ngày phát hành)
  fatherAge: number;
  motherAge: number;
  inForce: number; // xác suất cả hai chưa gặp biến cố
  firstEventProb: number; // q của năm t
  epvBenefits: number;
  epvPremiums: number;
  reserve: number; // dự phòng phí gộp (có thể âm)
  reserveFloored: number; // max(0, dự phòng) — chỉ minh họa
};

/**
 * Dự phòng phí gộp tương lai đầu mỗi năm — tái lập sheet Gross_Reserve_Calculation:
 * V_t = EPV(quyền lợi) + EPV(tái BH, chi phí bồi thường, quản lý, hoa hồng, khai thác tại t=0) − EPV(phí gộp).
 * Biên rủi ro và lợi nhuận không tính vào dòng tiền dự phòng.
 */
export function grossReserves(fatherAge: number, motherAge: number, over: Partial<LifeAssumptions> = {}): ReserveRow[] {
  const a = { ...BASE_LIFE, ...over };
  const P = jointLife(fatherAge, motherAge, a).gross;
  const v = 1 / (1 + a.interest);
  const n = a.termYears;
  const tp: number[] = [1];
  const q: number[] = [];
  for (let t = 0; t < n; t++) {
    const fx = BY_AGE.get(fatherAge + t)!;
    const my = BY_AGE.get(motherAge + t)!;
    const tpdX = fx[1] * a.tpdLoad * a.tpdMult;
    const dX = fx[2] * a.mortalityMult;
    const tpdY = my[3] * a.tpdLoad * a.tpdMult;
    const dY = my[4] * a.mortalityMult;
    const qx = tpdX + dX - tpdX * dX;
    const qy = tpdY + dY - tpdY * dY;
    q.push(qx + qy - qx * qy);
    tp.push(tp[t] * (1 - q[t]));
  }
  const comm = (s: number) => (s === 0 ? a.commission[0] : s === 1 ? a.commission[1] : a.commission[2]);
  const rows: ReserveRow[] = [];
  for (let t = 0; t <= n; t++) {
    let fb = 0, fp = 0, adm = 0, com = 0;
    for (let s = t; s < n; s++) {
      fb += tp[s] * q[s] * v ** (s - t + 1);
      fp += tp[s] * v ** (s - t);
      adm += tp[s] * v ** (s - t);
      com += tp[s] * v ** (s - t) * comm(s);
    }
    const k = tp[t];
    const epvB = t === n ? 0 : (a.sumAssured * fb) / k;
    const epvP = t === n ? 0 : (P * fp) / k;
    const reserve =
      t === n
        ? 0
        : epvB + a.reinsurance * epvP + a.claimExpense * epvB + (a.adminPerYear * adm) / k + (P * com) / k + (t === 0 ? a.acquisition : 0) - epvP;
    rows.push({
      t,
      fatherAge: fatherAge + t,
      motherAge: motherAge + t,
      inForce: k,
      firstEventProb: t < n ? q[t] : 0,
      epvBenefits: epvB,
      epvPremiums: epvP,
      reserve,
      reserveFloored: Math.max(0, reserve),
    });
  }
  return rows;
}

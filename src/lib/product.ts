// Nguồn số liệu duy nhất cho Family Reconnect.
// Mọi con số trên trang và trong API đều lấy từ đây.
// Nguồn: báo cáo "Family Reconnect" (InsuNovate 2026) — số mục ghi bên cạnh.

export const PRODUCT = {
  name: "Family Reconnect",
  riderName: "Family Continuity Rider",
  walletName: "Family Care Wallet",
} as const;

export const LIFE = {
  sumAssured: 2_000_000_000, // VND, chi trả một lần khi tử vong/TTTBVV đầu tiên (3.1)
  termYears: 10, // (3.1)
  tpdThresholdPct: 81, // TTTBVV từ 81% (3.2)
  waitingPeriodYears: 2, // thời gian chờ quyền lợi tử vong/TTTBVV (3.2)
  technicalRate: 0.045, // lãi suất kỹ thuật định phí (4.1.2)
} as const;

export const ELIGIBILITY = {
  parentAgeMin: 25,
  parentAgeMax: 40, // cả bố và mẹ 25–40 khi tham gia (3.1)
  youngestChildMaxAtEntry: 11, // con nhỏ nhất dưới 12 tuổi (3.1)
  riderRenewsWhileChildAtMost: 12, // dừng tái tục khi con nhỏ nhất từ 13 tuổi (3.3)
  minNetIncome: 200_000_000, // VND/năm (2.2)
  premiumIncomeCap: 0.12, // tổng phí ≤ 12% thu nhập ròng (5.1)
  benchmarkIncome: 281_500_000, // thu nhập hộ đô thị trung bình (2.4)
} as const;

export const RIDER = {
  hospitalCashPerDay: 500_000, // VND/ngày nằm viện (3.2)
  hospitalCashMaxDaysPerParentYear: 30,
  careHoursPerParentYear: 120, // dùng chung Lộ trình A và B (3.2)
  giftHoursPerFamilyYear: 1, // quà tặng hằng năm (3.2)
  housekeepingMaxShareOfGrant: 0.3, // dọn nhà tối đa 30% mỗi lần cấp (Phụ lục B.3)
  pathwayBMinConsecutiveDays: 2, // F2/F3 ít nhất 2 ngày liên tiếp (3.2)
} as const;

// Bảng 3.2 — Lộ trình A: theo số ngày nằm viện, hoặc từ 48 giờ ICU
export const PATHWAY_A_TIERS = [
  { minDays: 14, hours: 60 },
  { minDays: 7, hours: 40 },
  { minDays: 3, hours: 20 },
] as const;
export const PATHWAY_A_ICU_HOURS_FOR_TOP_TIER = 48;

// Bảng 3.2 — Lộ trình B: theo điểm CIS
export const PATHWAY_B_TIERS = [
  { minScore: 0.8, hours: 80 },
  { minScore: 0.6, hours: 60 },
  { minScore: 0.4, hours: 40 },
  { minScore: 0.2, hours: 20 },
] as const;

// Phụ lục B.2 — thang mức độ
export const SEVERITY = { F0: 0, F1: 0.25, F2: 0.6, F3: 1 } as const;
export type Severity = keyof typeof SEVERITY;

export const CHILD_BANDS = ["0-2", "3-5", "6-8", "9-12"] as const;
export type ChildBand = (typeof CHILD_BANDS)[number];

export function childBandFor(age: number): ChildBand {
  if (age <= 2) return "0-2";
  if (age <= 5) return "3-5";
  if (age <= 8) return "6-8";
  return "9-12";
}

export const ACTIVITIES = ["C1", "C2", "C3", "C4", "C5", "C6"] as const;
export type Activity = (typeof ACTIVITIES)[number];

// Phụ lục B.2 — trọng số CIS theo tuổi con nhỏ nhất (tổng = 1)
export const CIS_WEIGHTS: Record<ChildBand, Record<Activity, number>> = {
  "0-2": { C1: 0.25, C2: 0.2, C3: 0.2, C4: 0.2, C5: 0.05, C6: 0.1 },
  "3-5": { C1: 0.25, C2: 0.2, C3: 0.15, C4: 0.1, C5: 0.15, C6: 0.15 },
  "6-8": { C1: 0.2, C2: 0.2, C3: 0.15, C4: 0.05, C5: 0.25, C6: 0.15 },
  "9-12": { C1: 0.2, C2: 0.2, C3: 0.1, C4: 0.05, C5: 0.25, C6: 0.2 },
};

export const SERVICES = ["childcare", "meals", "transport", "housekeeping"] as const;
export type Service = (typeof SERVICES)[number];

// Care Hours tiêu hao cho mỗi giờ dịch vụ (3.2)
export const CREDITS_PER_SERVICE_HOUR: Record<Service, number> = {
  childcare: 1,
  meals: 1,
  transport: 2, // đưa đón có người đi kèm
  housekeeping: 1,
};

// Phụ lục B.3 — Lộ trình B mở dịch vụ theo hoạt động ở mức F2/F3
export const SERVICE_UNLOCKED_BY: Record<Service, Activity[]> = {
  childcare: ["C1", "C3", "C4"],
  meals: ["C2"],
  transport: ["C5"],
  housekeeping: ["C6"],
};

// Mục 4.2.3 — phí bổ trợ cho cả gia đình mỗi năm (VND)
export const RIDER_RATES: Record<"25-39" | "40-49", Record<ChildBand, number>> = {
  "25-39": { "0-2": 2_129_061, "3-5": 1_838_410, "6-8": 1_807_952, "9-12": 1_783_188 },
  "40-49": { "0-2": 2_186_982, "3-5": 1_890_522, "6-8": 1_859_105, "9-12": 1_833_607 },
};

// Mục 4.1.5 và Bảng 3.4 — phí nhân thọ gộp minh họa (VND/năm), khóa "bố-mẹ"
export const LIFE_PREMIUM_POINTS: Record<string, number> = {
  "25-25": 13_707_960.82,
  "34-30": 20_769_350,
  "40-30": 29_830_550.83,
  "40-40": 38_893_158.89,
};

export const MARKET = {
  twoGenerationShare: 0.55,
  admissionProb3y: 0.26,
  admissionProb10y: 0.63,
  avgStayDays: 6.7,
  childcareCostPerStay: [2_900_000, 3_500_000],
  priorityHouseholds: 790_000,
  targetFamilies5y: 15_000,
} as const;

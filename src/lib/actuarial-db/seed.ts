// Dữ liệu tham chiếu ban đầu. Mỗi giá trị lấy từ FINAL.pdf (mục ghi bên cạnh) hoặc từ bảng tỷ lệ
// đã chép từ workbook Joint Life của nhóm (src/lib/actuarial.ts). Không có dữ liệu thống kê tự tạo.
// Dataset vận hành (B, khám bệnh, nhà cung cấp) để trống cho tới khi có hợp đồng thật.
import { rateTable } from "../actuarial.ts";
import { CIS_WEIGHTS, CHILD_BANDS, ACTIVITIES, RIDER_RATES, SERVICE_UNLOCKED_BY } from "../product.ts";
import type { DatasetId, Row } from "./types.ts";

export const BASE_BASIS_ID = "FR-2026-10";
const EFFECTIVE = "2026-10-19"; // ngày báo cáo final
const PROPOSED = { effective_date: EFFECTIVE, status: "proposed", approved_by: null } as const;
const VND = "VND";

function unlocks(activity: string) {
  return Object.entries(SERVICE_UNLOCKED_BY).find(([, acts]) => (acts as string[]).includes(activity))?.[0] ?? "none";
}

export function seedRows(): Partial<Record<DatasetId, Row[]>> {
  const rates = rateTable(1);
  const workbook = "Team workbook Joint_Life_TPD_20pct_Higher_Corrected_net, sheet Bang_CSO_1980";
  return {
    DB01: rates.flatMap((r) => [
      { sex: "M", age: r.age, q_death: r.deathMale },
      { sex: "F", age: r.age, q_death: r.deathFemale },
    ]),
    DB02: rates.map((r) => ({ age: r.age, q_tpd_base: r.tpdMaleBase, interpolated: null })),
    DB03: rates.map((r) => ({ age: r.age, q_tpd_base: r.tpdFemaleBase, interpolated: null })),
    DB07: [{
      assumption_id: "MT-BASE", basis_id: BASE_BASIS_ID, mortality_table: "DB01", mortality_multiplier: 1,
      tpd_male_table: "DB02", tpd_female_table: "DB03", tpd_uplift: 1.2, tpd_multiplier: 1,
      ...PROPOSED, source_ref: `Report 4.1, Table 4.1; tables: ${workbook}`,
    }],
    DB08: [{
      assumption_id: "DEP-BASE", basis_id: BASE_BASIS_ID, model: "independent", common_shock_share: 0,
      within_life_independent: true, ...PROPOSED, source_ref: "Report 4.1 (independence within and between parents)",
    }],
    DB09: [
      { curve_id: "PRICING", basis_id: BASE_BASIS_ID, purpose: "pricing", term_year: 0, rate: 0.045, ...PROPOSED, source_ref: "Report Table 4.1" },
      { curve_id: "VALUATION", basis_id: BASE_BASIS_ID, purpose: "valuation", term_year: 0, rate: 0.03, ...PROPOSED, source_ref: "Report Table 4.1 (FPT reserving 3.0%)" },
      { curve_id: "INVESTMENT", basis_id: BASE_BASIS_ID, purpose: "investment", term_year: 0, rate: 0.05, ...PROPOSED, source_ref: "Report section 6 / Appendix E (investment return 5%)" },
      { curve_id: "SHAREHOLDER", basis_id: BASE_BASIS_ID, purpose: "shareholder_discount", term_year: 0, rate: 0.12, ...PROPOSED, source_ref: "Report 6.4 (NPV at 12%)" },
      { curve_id: "RDR-STANDALONE", basis_id: BASE_BASIS_ID, purpose: "risk_discount", term_year: 0, rate: 0.045, ...PROPOSED, source_ref: "Report Table 5.1 (risk discount rate 4.5%)" },
    ],
    DB10: [{
      basis_id: BASE_BASIS_ID, name: "Family Reconnect final report basis", sum_assured: 2_000_000_000, currency: VND, term_years: 10,
      reserve_method: "held = max(0, FPT 12m at valuation rate, corrected gross)",
      claim_handling: 0.02, reinsurance_allowance: 0.03, risk_margin: 0.05, profit_margin: 0.1,
      admin_per_year: 100_000, acquisition: 300_000, commission_y1: 0.4, commission_y2: 0.2, commission_y3_plus: 0.15,
      ...PROPOSED, source_ref: "Report 3.1, 4.2.4, Table 4.1, 6.8",
    }],
    DB20: (["agency", "partner", "digital"] as const).flatMap((channel) =>
      (channel === "digital" ? [0.6, 0.13, 0.078] : [0.4, 0.1, 0.06]).map((lapse_rate, i) => ({
        assumption_id: "LAPSE-BASE", basis_id: BASE_BASIS_ID, channel, policy_year: i + 1, lapse_rate, ...PROPOSED,
        source_ref: "Report Table 6.2 and 6.2 text (agency/partner 40% year-1 lapse, digital 60%)",
      })),
    ),
    DB38: [{
      assumption_id: "VAL-BASE", basis_id: BASE_BASIS_ID, valuation_rate: 0.03, method: "fpt_12m", floor_zero: true,
      rate_cap_rule: "below 80% of the 24-month government bond yield; to be confirmed", ...PROPOSED, source_ref: "Report Table 4.1, 4.2.6, 6.8",
    }],
    DB42: [
      { age_band: "25-39", survey_year: 0, prevalence: null, admission_rate: 0.05, wave_weight: null },
      { age_band: "40-59", survey_year: 0, prevalence: null, admission_rate: 0.052, wave_weight: null },
    ],
    DB43: [
      { parameter: "mean_stay_days", value: 6.7 },
      { parameter: "icu_escalation", value: 0.02 },
      { parameter: "pathway_a_probability", value: 0.726309 },
      { parameter: "share_tier_20", value: 0.465003 },
      { parameter: "share_tier_40", value: 0.346562 },
      { parameter: "share_tier_60", value: 0.188435 },
    ],
    DB44: [
      { parameter: "qualifying_episodes_per_parent_year", value: 0.0202 },
      { parameter: "filter_no_admission_before_approval", value: 0.75 },
      { parameter: "filter_restricts_caregiving", value: 0.7 },
    ],
    DB45: [9.8, 5.7, 3.9, 3.5, 3.0, 12.6].map((rate_per_1000, i) => ({ component: `component_${i + 1}`, rate_per_1000 })),
    DB47: [
      { pathway: "A", tier: "3-6 days", care_hours: 20, cash_per_day: 500_000, currency: VND },
      { pathway: "A", tier: "7-13 days", care_hours: 40, cash_per_day: 500_000, currency: VND },
      { pathway: "A", tier: "14+ days or 48+ ICU hours", care_hours: 60, cash_per_day: 500_000, currency: VND },
      { pathway: "B", tier: "CIS 0.20-0.40", care_hours: 20, cash_per_day: null, currency: VND },
      { pathway: "B", tier: "CIS 0.40-0.60", care_hours: 40, cash_per_day: null, currency: VND },
      { pathway: "B", tier: "CIS 0.60-0.80", care_hours: 60, cash_per_day: null, currency: VND },
      { pathway: "B", tier: "CIS 0.80-1.00", care_hours: 80, cash_per_day: null, currency: VND },
    ],
    DB48: CHILD_BANDS.flatMap((child_band) =>
      ACTIVITIES.map((activity) => ({ child_band, activity, weight: CIS_WEIGHTS[child_band][activity], unlocks_service: unlocks(activity) })),
    ),
    DB50: [{ rule_id: "CASH-BASE", cash_per_day: 500_000, currency: VND, max_days_per_parent_year: 30, includes_one_day_stays: true }],
    DB51: [
      { service: "childcare", unit: "hour", credits_per_unit: 1, max_share_of_grant: null },
      { service: "meals", unit: "hour", credits_per_unit: 1, max_share_of_grant: null },
      { service: "transport", unit: "trip", credits_per_unit: 2, max_share_of_grant: null },
      { service: "housekeeping", unit: "hour", credits_per_unit: 1, max_share_of_grant: 0.3 },
    ],
    DB52: [
      { limit_id: "care_hours_per_parent_year", value: 120, unit: "credits" },
      { limit_id: "cash_days_per_parent_year", value: 30, unit: "days" },
      { limit_id: "gift_hours_per_family_year", value: 1, unit: "credits" },
      { limit_id: "grant_validity", value: 90, unit: "days" },
      { limit_id: "housekeeping_share_of_grant", value: 0.3, unit: "share" },
    ],
    DB53: (["25-39", "40-49"] as const).flatMap((parent_band) =>
      CHILD_BANDS.map((child_band) => {
        const cell = parent_band === "25-39" && child_band === "0-2";
        return {
          parent_band, child_band, tariff: RIDER_RATES[parent_band][child_band], currency: VND,
          care_cost: cell ? 520_742 : null, cash_cost: cell ? 331_081 : null, handling: cell ? 12_498 : null,
          fixed_admin: cell ? 40_000 : null, gift: cell ? 169_000 : null, capital_return: cell ? 12_500 : null,
        };
      }),
    ),
    DB54: [
      { service: "childcare", child_band: "0-2", cost_per_credit: 169_000, currency: VND, cost_per_unit: null, source_ref: "Report B.3, C.2" },
      { service: "childcare", child_band: "all", cost_per_credit: 130_000, currency: VND, cost_per_unit: null, source_ref: "Report Table 4.1, B.3" },
    ],
    DB55: [{ service: "meals", child_band: "all", cost_per_credit: 90_000, currency: VND, cost_per_unit: null, source_ref: "Report Table 4.1, B.3" }],
    DB56: [{ service: "housekeeping", child_band: "all", cost_per_credit: 96_000, currency: VND, cost_per_unit: null, source_ref: "Report Table 4.1, B.3" }],
    DB57: [{ service: "transport", child_band: "all", cost_per_credit: 75_000, currency: VND, cost_per_unit: 150_000, source_ref: "Report Table 4.1, B.3 (two credits per escorted trip)" }],
    DB60: [
      { metric: "timely_care_fulfilment", target: 0.95, threshold: 0.9, action: "require remedies and backup; restrict affected-zone sales" },
      { metric: "rider_insured_benefit_ratio", target: 0.4, threshold: 0.5, action: "investigate frequency, duration, CIS and costs; assess renewal pricing" },
      { metric: "reserve_runoff_vs_estimate", target: 1, threshold: 1.1, action: "review reporting, settlement and reserve adequacy" },
      { metric: "operating_costs_vs_budget", target: 1, threshold: 1.1, action: "review acquisition, fixed overhead and administration" },
    ],
    DB61: [{ reinsurer_id: "GENRE", name: "Gen Re", rating: "AM Best A++", status: "preferred" }],
    DB62: [
      { treaty_id: "QS60", reinsurer_id: "GENRE", structure: "quota_share", ceded_share: 0.6, retention: null, currency: VND, net_premium_allowance: 0.03, capital_reserve_factor: 0.04, capital_sar_factor: 0.003, selected: true },
      { treaty_id: "QS80", reinsurer_id: "GENRE", structure: "quota_share", ceded_share: 0.8, retention: null, currency: VND, net_premium_allowance: 0.03, capital_reserve_factor: 0.04, capital_sar_factor: 0.003, selected: false },
      { treaty_id: "SURPLUS500", reinsurer_id: "GENRE", structure: "surplus", ceded_share: null, retention: 500_000_000, currency: VND, net_premium_allowance: 0.03, capital_reserve_factor: 0.04, capital_sar_factor: 0.003, selected: false },
    ],
    DB68: [
      ...[27.47, 70.49, 127.33, 197.04, 278.71].map((v, i) => ({ scenario_id: "REPORT-BASE", projection_year: i + 1, item: "gross_written_premium", amount: v * 1e9, currency: VND, scope: "report_reference" })),
      ...[-19.45, 0.69, 8.88, 17.98, 27.14].map((v, i) => ({ scenario_id: "REPORT-BASE", projection_year: i + 1, item: "profit_after_tax", amount: v * 1e9, currency: VND, scope: "report_reference" })),
    ],
    DB69: [
      { scenario_id: "REPORT-STANDALONE-40-40", metric: "vnb", value: 36_594_008, unit: "VND", scope: "report_reference" },
      { scenario_id: "REPORT-STANDALONE-40-40", metric: "profit_margin", value: 0.133, unit: "share", scope: "report_reference" },
    ],
    DB70: [
      { scenario_id: "REPORT-BASE", metric: "npv", value: 83.9e9, unit: "VND", scope: "report_reference" },
      { scenario_id: "REPORT-BASE", metric: "irr", value: 0.49, unit: "share", scope: "report_reference" },
      { scenario_id: "REPORT-BASE", metric: "payback_year", value: 5, unit: "year", scope: "report_reference" },
      { scenario_id: "REPORT-BASE", metric: "peak_funding", value: 23.0e9, unit: "VND", scope: "report_reference" },
      { scenario_id: "REPORT-NO-REINSURANCE", metric: "npv", value: 77.1e9, unit: "VND", scope: "report_reference" },
      { scenario_id: "REPORT-NO-REINSURANCE", metric: "peak_funding", value: 29.3e9, unit: "VND", scope: "report_reference" },
    ],
  };
}

/** Mốc đối chiếu với báo cáo cho DB72 (chạy bởi run.ts). */
export const BENCHMARKS = [
  { check_id: "T4.2-25-25-net", father: 25, mother: 25, metric: "net_premium", expected: 8_377_915.87, tolerance: 0.01, benchmark_source: "Report Table 4.2" },
  { check_id: "T4.2-25-25-gross", father: 25, mother: 25, metric: "gross_premium", expected: 13_707_960.82, tolerance: 0.01, benchmark_source: "Report Table 4.2" },
  { check_id: "T4.2-40-30-net", father: 40, mother: 30, metric: "net_premium", expected: 18_370_975.69, tolerance: 0.01, benchmark_source: "Report Table 4.2" },
  { check_id: "T4.2-40-30-gross", father: 40, mother: 30, metric: "gross_premium", expected: 29_830_550.83, tolerance: 0.01, benchmark_source: "Report Table 4.2" },
  { check_id: "T4.2-40-40-net", father: 40, mother: 40, metric: "net_premium", expected: 23_977_773.33, tolerance: 0.01, benchmark_source: "Report Table 4.2" },
  { check_id: "T4.2-40-40-gross", father: 40, mother: 40, metric: "gross_premium", expected: 38_893_158.89, tolerance: 0.01, benchmark_source: "Report Table 4.2" },
  { check_id: "T3.4-34-30-gross", father: 34, mother: 30, metric: "gross_premium", expected: 20_769_350, tolerance: 1, benchmark_source: "Report Table 3.4 (rounded to VND)" },
] as const;

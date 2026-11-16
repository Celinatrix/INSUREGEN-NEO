// 73 dataset actuarial logic của Family Reconnect, nhóm A–J.
// Đây là nguồn duy nhất cho: migration Postgres (scripts/gen-actuarial-migration.mjs),
// kiểm tra dữ liệu (validate.ts), seed (seed.ts) và Database Center trên web.
// Nguồn ưu tiên: FINAL.pdf (báo cáo 19/10/2026). Mục báo cáo ghi ở trường source.
import type { DatasetDef, DatasetId, Field, FieldType, ForeignKey, GroupId } from "./types.ts";

const CREATED = "2026-11-16";
const UPDATED = "2026-11-16";

const f = (name: string, type: FieldType, description: string, extra: Partial<Field> = {}): Field => ({ name, type, description, ...extra });
const req = (name: string, type: FieldType, description: string, extra: Partial<Field> = {}) => f(name, type, description, { required: true, ...extra });
const fk = (fields: string[], dataset: DatasetId, refFields: string[] = fields): ForeignKey => ({ fields, references: { dataset, fields: refFields } });

const RUN = req("run_id", "text", "Calculation run that produced the row (DB73)");
const T = req("t", "integer", "Policy year index, 0 = issue", { min: 0, max: 10 });
const ROLE = req("role", "text", "Insured parent", { allowed: ["father", "mother"] });
const BASIS = req("basis_id", "text", "Valuation / pricing basis (DB10)");
const CURRENCY = req("currency", "currency", "ISO 4217 currency of every money column in the row", { allowed: ["VND"] });
const ASSUMPTION_META: Field[] = [
  req("effective_date", "date", "Date the assumption takes effect"),
  req("status", "text", "Approval status", { allowed: ["draft", "proposed", "approved", "retired"] }),
  f("approved_by", "text", "Role or person that approved the assumption"),
  req("source_ref", "text", "Citation of the source document"),
];

type Def = Omit<DatasetDef, "createdAt" | "updatedAt" | "version"> & { version?: string };
const d = (x: Def): DatasetDef => ({ version: "1.0.0", createdAt: CREATED, updatedAt: UPDATED, ...x });
const live = (...m: DatasetDef["usedBy"][number]["module"][]) => m.map((module) => ({ module, status: "live" as const }));
const planned = (...m: DatasetDef["usedBy"][number]["module"][]) => m.map((module) => ({ module, status: "planned" as const }));

export const GROUPS: Record<GroupId, string> = {
  A: "Actuarial reference",
  B: "Customer and policy",
  C: "Life pricing",
  D: "Reserving",
  E: "Rider and claim frequency",
  F: "Service cost",
  G: "Reinsurance",
  H: "Financial and profitability",
  I: "Risk and validation",
  J: "Governance and control",
};

const computedRun = (extra: Field[]) => [RUN, ...extra];

export const DATASETS: DatasetDef[] = [
  // ---------------- A. Actuarial reference ----------------
  d({
    id: "DB01", table: "a01_mortality_cso1980", name: "Mortality Table – CSO 1980", group: "A",
    description: "Annual death probability q_x by sex and age from the CSO 1980 table.",
    fields: [req("sex", "text", "Sex", { allowed: ["M", "F"] }), req("age", "integer", "Age last birthday", { min: 0, max: 110 }), req("q_death", "probability", "Annual probability of death")],
    primaryKey: ["sex", "age"], foreignKeys: [],
    validation: ["q_death in [0,1]", "one row per sex and age", "q_death non-decreasing from age 30 for each sex"],
    source: "CSO 1980, Appendix V of Circular 67/2023/TT-BTC (report 4.1, Table 4.1); ages 20–49 transcribed from the team workbook Joint_Life_TPD_20pct_Higher_Corrected_net (sheet Bang_CSO_1980)",
    quality: "transcribed", usedBy: [...live("life_pricing", "reserving", "sensitivity")],
  }),
  d({
    id: "DB02", table: "a02_tpd_male_gltd", name: "Male TPD Table – SOA 1987 GLTD (1492)", group: "A",
    description: "Reference TPD incidence for males before the 1.20 uplift.",
    fields: [req("age", "integer", "Age", { min: 0, max: 110 }), req("q_tpd_base", "probability", "Reference annual TPD incidence"), f("interpolated", "boolean", "true when the value was interpolated (DB04)")],
    primaryKey: ["age"], foreignKeys: [],
    validation: ["q_tpd_base in [0,1]", "one row per age"],
    source: "SOA 1987 Group LTD Table 1492, male, linear interpolation for missing ages (report 4.1); ages 20–49 transcribed from the team workbook",
    quality: "transcribed", usedBy: [...live("life_pricing", "reserving", "sensitivity")],
  }),
  d({
    id: "DB03", table: "a03_tpd_female_cida", name: "Female TPD Table – SOA 1985 CIDA (1280)", group: "A",
    description: "Reference TPD incidence for females before the 1.20 uplift.",
    fields: [req("age", "integer", "Age", { min: 0, max: 110 }), req("q_tpd_base", "probability", "Reference annual TPD incidence"), f("interpolated", "boolean", "true when interpolated (DB05)")],
    primaryKey: ["age"], foreignKeys: [],
    validation: ["q_tpd_base in [0,1]", "one row per age"],
    source: "SOA 1985 CIDA Table 1280, female (report 4.1); ages 20–49 transcribed from the team workbook",
    quality: "transcribed", usedBy: [...live("life_pricing", "reserving", "sensitivity")],
  }),
  d({
    id: "DB04", table: "a04_male_age_interpolation", name: "Male Age Interpolation Data", group: "A",
    description: "Published GLTD anchor ages and the linear interpolation weights used to fill missing male ages.",
    fields: [req("age", "integer", "Target age"), req("lower_age", "integer", "Lower published age"), req("upper_age", "integer", "Upper published age"), req("weight_upper", "probability", "Linear weight on the upper age"), f("q_tpd_interpolated", "probability", "Interpolated incidence"), req("method", "text", "Interpolation method", { allowed: ["linear"] })],
    primaryKey: ["age"], foreignKeys: [fk(["age"], "DB02")],
    validation: ["lower_age <= age <= upper_age", "weight_upper = (age - lower_age)/(upper_age - lower_age)"],
    source: "Report 4.1 (linear interpolation for missing GLTD ages). The original sparse GLTD 1492 table is not in the provided files.",
    quality: "missing", usedBy: [...live("life_pricing")],
  }),
  d({
    id: "DB05", table: "a05_female_age_interpolation", name: "Female Age Interpolation Data", group: "A",
    description: "Interpolation weights for any missing CIDA female ages.",
    fields: [req("age", "integer", "Target age"), req("lower_age", "integer", "Lower published age"), req("upper_age", "integer", "Upper published age"), req("weight_upper", "probability", "Linear weight on the upper age"), f("q_tpd_interpolated", "probability", "Interpolated incidence"), req("method", "text", "Interpolation method", { allowed: ["linear"] })],
    primaryKey: ["age"], foreignKeys: [fk(["age"], "DB03")],
    validation: ["lower_age <= age <= upper_age"],
    source: "Report 4.1 names no interpolation for CIDA; the raw CIDA 1280 table is not in the provided files.",
    quality: "missing", usedBy: [...live("life_pricing")],
  }),
  d({
    id: "DB06", table: "a06_attained_age_exposure", name: "Attained Age and Exposure Database", group: "A",
    description: "Attained ages of both parents and the in-force exposure at the start of each policy year of a pricing run.",
    fields: computedRun([T, req("father_age", "integer", "Father's attained age"), req("mother_age", "integer", "Mother's attained age"), req("exposure", "probability", "Probability both parents are event-free at the start of year t (t_p)")]),
    primaryKey: ["run_id", "t"], foreignKeys: [fk(["run_id"], "DB73")],
    validation: ["exposure in [0,1] and non-increasing in t", "attained age = issue age + t"],
    source: "Computed by the life engine (report 4.2.3)", quality: "computed", usedBy: [...live("life_pricing", "reserving")],
  }),
  d({
    id: "DB07", table: "a07_mortality_tpd_assumptions", name: "Mortality and TPD Assumption Database", group: "A",
    description: "Which tables apply and the multipliers applied to them.",
    fields: [req("assumption_id", "text", "Assumption set"), BASIS, req("mortality_table", "text", "Mortality table dataset"), req("mortality_multiplier", "numeric", "Multiplier on q_death (sensitivity)", { min: 0, max: 5 }), req("tpd_male_table", "text", "Male TPD dataset"), req("tpd_female_table", "text", "Female TPD dataset"), req("tpd_uplift", "numeric", "Prudence uplift on reference TPD incidence", { min: 0, max: 5 }), req("tpd_multiplier", "numeric", "Sensitivity multiplier on uplifted TPD", { min: 0, max: 5 }), ...ASSUMPTION_META],
    primaryKey: ["assumption_id"], foreignKeys: [fk(["basis_id"], "DB10")],
    validation: ["uplift applies to TPD only, never to mortality", "base case: mortality multiplier 1, TPD uplift 1.20, TPD multiplier 1"],
    source: "Report 4.1 and Table 4.1", quality: "report", usedBy: [...live("life_pricing", "reserving", "sensitivity")],
  }),
  d({
    id: "DB08", table: "a08_joint_life_dependence", name: "Joint-Life Independence Assumptions", group: "A",
    description: "Dependence between death and TPD within a life and between the two parents.",
    fields: [req("assumption_id", "text", "Assumption set"), BASIS, req("model", "text", "Dependence model", { allowed: ["independent", "common_shock"] }), req("common_shock_share", "probability", "Share of the smaller parental probability that is a shared event (0 = independence)"), req("within_life_independent", "boolean", "Death and TPD independent within each parent"), ...ASSUMPTION_META],
    primaryKey: ["assumption_id"], foreignKeys: [fk(["basis_id"], "DB10")],
    validation: ["base case: model = independent, common_shock_share = 0"],
    source: "Report 4.1 (independence between death and TPD and between parents). The common-shock option is a sensitivity extension, not in the report.",
    quality: "report", usedBy: [...live("life_pricing")],
  }),
  d({
    id: "DB09", table: "a09_interest_curves", name: "Interest Rate and Discount Curve Database", group: "A",
    description: "Flat rates by purpose; term-structured curves can be added per term year.",
    fields: [req("curve_id", "text", "Curve"), BASIS, req("purpose", "text", "Use of the rate", { allowed: ["pricing", "valuation", "investment", "shareholder_discount", "risk_discount"] }), req("term_year", "integer", "Year the rate applies to (0 = flat)", { min: 0, max: 50 }), req("rate", "rate", "Annual effective rate"), ...ASSUMPTION_META],
    primaryKey: ["curve_id", "term_year"], foreignKeys: [fk(["basis_id"], "DB10")],
    validation: ["rate in [-1, 10]", "one flat row (term_year 0) per purpose and basis"],
    source: "Report Table 4.1 (pricing 4.5%, FPT reserving 3.0%), 6.4/E.1 (investment 5%, shareholder discount 12%), Table 5.1 (risk discount 4.5%)",
    quality: "report", usedBy: [...live("life_pricing", "reserving"), ...planned("financial")],
  }),
  d({
    id: "DB10", table: "a10_valuation_basis", name: "Actuarial Valuation Basis Database", group: "A",
    description: "Named, versioned basis that ties a product definition to its assumption sets.",
    fields: [
      req("basis_id", "text", "Basis"), req("name", "text", "Basis name"), req("sum_assured", "money", "Joint-life sum assured"), CURRENCY,
      req("term_years", "integer", "Policy term", { min: 1, max: 40 }), req("reserve_method", "text", "Held reserve rule"),
      req("claim_handling", "rate", "h: claim handling as share of expected claims"), req("reinsurance_allowance", "rate", "r: reinsurance as share of gross premium"),
      req("risk_margin", "rate", "m: risk margin as share of gross premium"), req("profit_margin", "rate", "π: profit as share of gross premium"),
      req("admin_per_year", "money", "a: administration per policy year"), req("acquisition", "money", "k: acquisition at issue"),
      req("commission_y1", "rate", "Commission year 1"), req("commission_y2", "rate", "Commission year 2"), req("commission_y3_plus", "rate", "Commission years 3+"),
      ...ASSUMPTION_META,
    ],
    primaryKey: ["basis_id"], foreignKeys: [],
    validation: ["sum_assured > 0", "exactly one approved basis per product version"],
    source: "Report 3.1, 4.2.6, 6.8", quality: "report", usedBy: [...live("life_pricing", "reserving", "reinsurance", "governance")],
  }),

  // ---------------- B. Customer and policy (operational) ----------------
  d({
    id: "DB11", table: "b11_customers", name: "Customer Master", group: "B",
    description: "Policyholder accounts. Holds no names or contact details; those stay in the lead store under its privacy rules.",
    fields: [req("customer_id", "text", "Customer"), req("channel", "text", "Acquisition channel", { allowed: ["agency", "partner", "digital"] }), req("city", "text", "City", { allowed: ["hcmc", "hanoi", "danang", "other"] }), f("consent_version", "text", "Consent text version")],
    primaryKey: ["customer_id"], foreignKeys: [], validation: ["no personal identifiers stored here"],
    source: "Operational; filled by policy administration", quality: "operational", usedBy: [...planned("policy_admin")],
  }),
  d({
    id: "DB12", table: "b12_parents", name: "Parent Information", group: "B",
    description: "Underwriting attributes of each insured parent.",
    fields: [req("parent_id", "text", "Parent"), req("household_id", "text", "Household (DB14)"), ROLE, req("age_at_entry", "integer", "Age at entry", { min: 25, max: 40 }), req("smoker", "boolean", "Smoker"), req("occupation_class", "integer", "Occupation class", { min: 1, max: 4 })],
    primaryKey: ["parent_id"], foreignKeys: [fk(["household_id"], "DB14")],
    validation: ["age 25–40 at entry (report 3.1)", "occupation class 1–4 (Appendix H.2)"],
    source: "Report 3.1, H.2", quality: "operational", usedBy: [...planned("policy_admin")],
  }),
  d({
    id: "DB13", table: "b13_children", name: "Child Information", group: "B",
    description: "Children in the household; the youngest sets the rider tariff band.",
    fields: [req("child_id", "text", "Child"), req("household_id", "text", "Household (DB14)"), req("age_at_entry", "integer", "Age at entry", { min: 0, max: 17 }), req("youngest", "boolean", "Youngest dependent child")],
    primaryKey: ["child_id"], foreignKeys: [fk(["household_id"], "DB14")],
    validation: ["youngest child under 12 at entry (report 3.1)"], source: "Report 3.1, C.5", quality: "operational", usedBy: [...planned("policy_admin")],
  }),
  d({
    id: "DB14", table: "b14_households", name: "Household Information", group: "B",
    description: "Household used for financial underwriting.",
    fields: [req("household_id", "text", "Household"), req("customer_id", "text", "Customer (DB11)"), req("net_income", "money", "Net household income a year"), CURRENCY, req("service_zone", "boolean", "Inside a contracted service zone")],
    primaryKey: ["household_id"], foreignKeys: [fk(["customer_id"], "DB11")],
    validation: ["net_income >= 200,000,000 VND (report 2.2)", "total premium <= 12% of net income (H.2)"], source: "Report 2.2, H.2", quality: "operational", usedBy: [...planned("policy_admin")],
  }),
  d({
    id: "DB15", table: "b15_policy_insureds", name: "Policyholder and Insured Relationship", group: "B",
    description: "Links each policy to its two insured parents.",
    fields: [req("policy_id", "text", "Policy (DB16)"), req("parent_id", "text", "Parent (DB12)"), ROLE],
    primaryKey: ["policy_id", "parent_id"], foreignKeys: [fk(["policy_id"], "DB16"), fk(["parent_id"], "DB12")],
    validation: ["exactly two insureds per policy, one father and one mother"], source: "Report 3.1", quality: "operational", usedBy: [...planned("policy_admin")],
  }),
  d({
    id: "DB16", table: "b16_policies", name: "Policy Master", group: "B",
    description: "Issued joint-life policies.",
    fields: [req("policy_id", "text", "Policy"), req("household_id", "text", "Household (DB14)"), BASIS, req("issue_date", "date", "Issue date"), req("sum_assured", "money", "Sum assured"), CURRENCY, req("channel", "text", "Channel", { allowed: ["agency", "partner", "digital"] })],
    primaryKey: ["policy_id"], foreignKeys: [fk(["household_id"], "DB14"), fk(["basis_id"], "DB10")],
    validation: ["sum_assured = basis sum assured"], source: "Report 3.1", quality: "operational", usedBy: [...planned("policy_admin")],
  }),
  d({
    id: "DB17", table: "b17_policy_coverages", name: "Policy Coverage Details", group: "B",
    description: "Base life and rider coverages on a policy.",
    fields: [req("coverage_id", "text", "Coverage"), req("policy_id", "text", "Policy (DB16)"), req("kind", "text", "Coverage", { allowed: ["joint_life", "family_continuity_rider"] }), req("start_date", "date", "Start"), f("end_date", "date", "End"), req("annual_premium", "money", "Annual premium"), CURRENCY],
    primaryKey: ["coverage_id"], foreignKeys: [fk(["policy_id"], "DB16")], validation: ["rider ends when the youngest child is 13 at an anniversary (C.5)"],
    source: "Report 3.1, C.5", quality: "operational", usedBy: [...planned("policy_admin")],
  }),
  d({
    id: "DB18", table: "b18_premium_history", name: "Policy Premium History", group: "B",
    description: "Premiums due and collected per policy year.",
    fields: [req("policy_id", "text", "Policy (DB16)"), req("policy_year", "integer", "Policy year", { min: 1, max: 10 }), req("due_date", "date", "Due date"), req("amount", "money", "Amount due"), CURRENCY, req("paid", "boolean", "Collected")],
    primaryKey: ["policy_id", "policy_year"], foreignKeys: [fk(["policy_id"], "DB16")], validation: ["premium payable annually in advance (Table 3.1)"],
    source: "Report Table 3.1", quality: "operational", usedBy: [...planned("policy_admin", "financial")],
  }),
  d({
    id: "DB19", table: "b19_policy_status", name: "Policy Status and Termination", group: "B",
    description: "Status changes, including termination after the first covered event.",
    fields: [req("policy_id", "text", "Policy (DB16)"), req("event_date", "date", "Date"), req("status", "text", "Status", { allowed: ["in_force", "lapsed", "claim_paid", "expired"] }), f("reason", "text", "Reason")],
    primaryKey: ["policy_id", "event_date"], foreignKeys: [fk(["policy_id"], "DB16")], validation: ["claim_paid is terminal (report 3.2)"],
    source: "Report 3.2, 3.3", quality: "operational", usedBy: [...planned("policy_admin")],
  }),
  d({
    id: "DB20", table: "b20_lapse_persistency", name: "Lapse and Persistency Database", group: "B",
    description: "Lapse assumptions by channel and policy year.",
    fields: [req("assumption_id", "text", "Assumption set"), BASIS, req("channel", "text", "Channel", { allowed: ["agency", "partner", "digital"] }), req("policy_year", "integer", "Policy year (3 = year 3 and later)", { min: 1, max: 3 }), req("lapse_rate", "probability", "Annual lapse rate"), ...ASSUMPTION_META],
    primaryKey: ["assumption_id", "channel", "policy_year"], foreignKeys: [fk(["basis_id"], "DB10")], validation: ["lapse_rate in [0,1]"],
    source: "Report Table 6.2 (agency and partners 40%/10%/6%, digital 60%/13%/7.8%)", quality: "report", usedBy: [...planned("financial", "sensitivity")],
  }),

  // ---------------- C. Life pricing (computed per run) ----------------
  d({ id: "DB21", table: "c21_joint_first_event", name: "Joint-Life First-to-Event Probability", group: "C", description: "q_t = 1 − (1 − q_f,t)(1 − q_m,t) under the selected dependence model.", fields: computedRun([T, req("q_joint", "probability", "Probability of the first covered event in year t")]), primaryKey: ["run_id", "t"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["q_joint >= max(q_f, q_m)", "q_joint in [0,1]"], source: "Report 4.2.3, Appendix A.1", quality: "computed", usedBy: live("life_pricing", "reserving") }),
  d({ id: "DB22", table: "c22_death_probability", name: "Individual Death Probability", group: "C", description: "Mortality applied to each parent after the sensitivity multiplier.", fields: computedRun([T, ROLE, req("age", "integer", "Attained age"), req("q_death", "probability", "Applied annual death probability")]), primaryKey: ["run_id", "t", "role"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["q_death in [0,1]"], source: "DB01 × DB07", quality: "computed", usedBy: live("life_pricing") }),
  d({ id: "DB23", table: "c23_tpd_probability", name: "Individual TPD Probability", group: "C", description: "Reference TPD incidence and the uplifted incidence used in pricing.", fields: computedRun([T, ROLE, req("age", "integer", "Attained age"), req("q_tpd_base", "probability", "Reference incidence"), req("q_tpd", "probability", "Uplifted incidence (× 1.20 × sensitivity)")]), primaryKey: ["run_id", "t", "role"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["q_tpd = q_tpd_base × uplift × multiplier"], source: "DB02/DB03 × DB07", quality: "computed", usedBy: live("life_pricing") }),
  d({ id: "DB24", table: "c24_combined_probability", name: "Combined Death and TPD Probability", group: "C", description: "q_D = 1 − (1 − q_death)(1 − q_TPD) for each parent.", fields: computedRun([T, ROLE, req("q_event", "probability", "Covered-event probability")]), primaryKey: ["run_id", "t", "role"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["q_event in [0,1]"], source: "Report 4.2.3", quality: "computed", usedBy: live("life_pricing") }),
  d({ id: "DB25", table: "c25_joint_survival", name: "Joint-Life Survival Probability", group: "C", description: "p_0 = 1, p_(t+1) = p_t (1 − q_t).", fields: computedRun([req("t", "integer", "Policy year index 0–10", { min: 0, max: 10 }), req("p_survive", "probability", "Both parents event-free at the start of year t")]), primaryKey: ["run_id", "t"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["p_0 = 1", "non-increasing"], source: "Appendix A.1", quality: "computed", usedBy: live("life_pricing", "reserving") }),
  d({ id: "DB26", table: "c26_expected_benefit_cf", name: "Expected Benefit Cash Flow", group: "C", description: "Expected death/TPD claim at the end of year t and its present value.", fields: computedRun([T, req("expected_claim", "money", "SA × p_t × q_t"), CURRENCY, req("discount_factor", "numeric", "v^(t+1)"), req("present_value", "money", "Discounted expected claim")]), primaryKey: ["run_id", "t"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["sum of present_value = SA × A"], source: "Appendix A.1", quality: "computed", usedBy: live("life_pricing") }),
  d({ id: "DB27", table: "c27_net_single_premium", name: "Net Single Premium", group: "C", description: "A = Σ v^(t+1) p_t q_t and NSP = SA × A.", fields: computedRun([req("A", "numeric", "Unit EPV of benefits"), req("nsp", "money", "Net single premium"), CURRENCY]), primaryKey: ["run_id"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["0 < A < 1"], source: "Appendix A.1", quality: "computed", usedBy: live("life_pricing") }),
  d({ id: "DB28", table: "c28_net_annual_premium", name: "Net Annual Premium", group: "C", description: "ä = Σ v^t p_t and PN = SA × A / ä.", fields: computedRun([req("annuity_due", "numeric", "ä"), req("net_premium", "money", "PN"), CURRENCY]), primaryKey: ["run_id"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["PN × ä = SA × A"], source: "Report 4.2.3, A.1", quality: "computed", usedBy: live("life_pricing") }),
  d({ id: "DB29", table: "c29_gross_premium_loading", name: "Gross Premium Loading", group: "C", description: "Loadings and the gross premium G = [(1+h)SA·A + a·ä + k] / [(1 − r − m − π)ä − C].", fields: computedRun([req("h_claims", "rate", "Claim handling"), req("r_reinsurance", "rate", "Reinsurance allowance"), req("m_risk", "rate", "Risk margin"), req("pi_profit", "rate", "Profit"), req("a_admin", "money", "Admin per year"), req("k_acquisition", "money", "Acquisition at issue"), req("gross_premium", "money", "G"), CURRENCY]), primaryKey: ["run_id"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["denominator > 0"], source: "Report 4.2.4, A.2", quality: "computed", usedBy: live("life_pricing") }),
  d({ id: "DB30", table: "c30_commission_expense", name: "Commission and Acquisition Expenses", group: "C", description: "Commission rate by year and C = Σ c_(t+1) v^t p_t.", fields: computedRun([T, req("commission_rate", "rate", "Commission on premium paid at t"), req("pv_factor", "numeric", "c × v^t × p_t")]), primaryKey: ["run_id", "t"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["40% / 20% / 15% in the base case"], source: "Report 4.2.4, Table 4.1", quality: "computed", usedBy: live("life_pricing") }),
  d({ id: "DB31", table: "c31_life_tariff", name: "Life Premium Tariff", group: "C", description: "Net and gross annual life premium for every father/mother entry-age pair 25–40.", fields: [BASIS, req("father_age", "integer", "Father's entry age", { min: 25, max: 40 }), req("mother_age", "integer", "Mother's entry age", { min: 25, max: 40 }), req("net_premium", "money", "PN"), req("gross_premium", "money", "G"), CURRENCY], primaryKey: ["basis_id", "father_age", "mother_age"], foreignKeys: [fk(["basis_id"], "DB10")], validation: ["matches Table 4.2 at 25/25, 40/30, 40/40"], source: "Computed from DB01–DB10; report Table 4.2", quality: "computed", usedBy: live("life_pricing") }),
  d({ id: "DB32", table: "c32_life_pricing_output", name: "Life Pricing Model Output", group: "C", description: "Summary of each life pricing run.", fields: computedRun([req("father_age", "integer", "Father's age"), req("mother_age", "integer", "Mother's age"), req("sum_assured", "money", "SA"), req("net_premium", "money", "PN"), req("gross_premium", "money", "G"), CURRENCY, req("formula_version", "text", "Engine formula version")]), primaryKey: ["run_id"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["reproducible from DB73 inputs"], source: "Life engine", quality: "computed", usedBy: live("life_pricing", "governance") }),

  // ---------------- D. Reserving ----------------
  ...(
    [
      ["DB33", "d33_net_premium_reserve", "Net Premium Reserve", "Prospective net premium reserve at the valuation rate: SA·A_t − PN(3%)·ä_t."],
      ["DB34", "d34_gross_premium_reserve", "Gross Premium Reserve", "Raw gross premium reserve at 4.5%: benefits, reinsurance allowance, claim handling, admin and commission less gross premiums."],
      ["DB35", "d35_fpt_reserve", "FPT Reserve", "12-month full preliminary term reserve at 3%; V_0 = V_1 = 0."],
      ["DB36", "d36_corrected_gross_reserve", "Corrected Gross Reserve", "Raw gross reserve plus the risk and profit loadings as future outgoes."],
      ["DB37", "d37_held_reserve", "Held Reserve", "V_held = max(0, V_FPT,3%, V_G,corr)."],
    ] as const
  ).map(([id, table, name, description]) =>
    d({
      id: id as DatasetId, table, name, group: "D", description,
      fields: computedRun([req("t", "integer", "Policy time, just before the premium due at t", { min: 0, max: 10 }), req("reserve", "money", "Reserve per policy in force"), CURRENCY]),
      primaryKey: ["run_id", "t"], foreignKeys: [fk(["run_id"], "DB73")],
      validation: ["reserve at t = 10 is 0", id === "DB37" ? "held >= 0 and held = max(0, FPT, corrected gross)" : "finite"],
      source: "Report 4.2.6, Appendix A.3–A.4, 6.8", quality: "computed" as const, usedBy: [...live("reserving"), ...planned("financial")],
    }),
  ),
  d({ id: "DB38", table: "d38_reserve_valuation_assumptions", name: "Reserve Valuation Assumptions", group: "D", description: "Valuation rate, method and floor.", fields: [req("assumption_id", "text", "Assumption set"), BASIS, req("valuation_rate", "rate", "FPT valuation rate"), req("method", "text", "Method", { allowed: ["fpt_12m", "net_premium", "gross_premium"] }), req("floor_zero", "boolean", "Negative reserves floored at 0"), req("rate_cap_rule", "text", "Regulatory cap on the valuation rate"), ...ASSUMPTION_META], primaryKey: ["assumption_id"], foreignKeys: [fk(["basis_id"], "DB10")], validation: ["valuation rate below the 80% × 24-month government bond yield cap (to be confirmed)"], source: "Report Table 4.1, 4.2.6", quality: "report", usedBy: live("reserving") }),
  d({ id: "DB39", table: "d39_reserve_development", name: "Reserve Development", group: "D", description: "Recursion check (V_t + P − E)(1+i) = q·SA + p·V_(t+1) on the gross basis.", fields: computedRun([T, req("opening", "money", "Reserve at t"), req("premium_less_expense", "money", "Premium less expenses at t"), req("interest", "money", "Interest for the year"), req("expected_claim", "money", "q_t × SA"), req("closing", "money", "p_t × V_(t+1)"), req("residual", "money", "Recursion residual (should be ~0)"), CURRENCY]), primaryKey: ["run_id", "t"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["|residual| < 1 VND"], source: "Reconciliation of DB34", quality: "computed", usedBy: live("reserving", "governance") }),
  d({ id: "DB40", table: "d40_reserve_cf_projection", name: "Reserve Cash Flow Projection", group: "D", description: "Portfolio reserves by projection year (business case).", fields: [req("scenario_id", "text", "Scenario"), req("projection_year", "integer", "Year 1–5", { min: 1, max: 50 }), req("life_reserve", "money", "Life reserve held"), req("rider_reserve", "money", "Rider UPR and claim reserves"), CURRENCY], primaryKey: ["scenario_id", "projection_year"], foreignKeys: [], validation: ["matches E.2.1 at year 5 (life reserve 37.93bn)"], source: "Report 6.8, E.2", quality: "missing", usedBy: planned("financial") }),
  d({ id: "DB41", table: "d41_technical_liabilities", name: "Technical Liabilities", group: "D", description: "Technical liabilities at the end of each projection year.", fields: [req("scenario_id", "text", "Scenario"), req("projection_year", "integer", "Year"), req("item", "text", "Liability item"), req("amount", "money", "Amount"), CURRENCY], primaryKey: ["scenario_id", "projection_year", "item"], foreignKeys: [], validation: ["ties to DB40"], source: "Report E.2.1 (business case workbook not provided)", quality: "missing", usedBy: planned("financial") }),

  // ---------------- E. Rider and claim frequency ----------------
  d({ id: "DB42", table: "e42_hospital_admission_frequency", name: "Hospital Admission Frequency", group: "E", description: "Admissions per parent-year from VHLSS prevalence via λ = −ln(1 − p), blended over waves.", fields: [req("age_band", "text", "Age band", { allowed: ["25-39", "40-59"] }), req("survey_year", "integer", "VHLSS wave (0 = blended)"), f("prevalence", "probability", "Share with an inpatient stay"), req("admission_rate", "numeric", "λ admissions per parent-year", { min: 0, max: 1 }), f("wave_weight", "probability", "Blending weight")], primaryKey: ["age_band", "survey_year"], foreignKeys: [], validation: ["λ = −ln(1 − p)", "weights halve every four years before 2024"], source: "Report 4.3.1, Table 4.1 (blended 5.0 and 5.2 per 100); wave prevalences are in the rider workbook (R39–R42), not provided", quality: "report", usedBy: planned("rider_pricing") }),
  d({ id: "DB43", table: "e43_length_of_stay", name: "Hospital Length of Stay", group: "E", description: "Geometric stay model, ICU escalation and Pathway A tier shares.", fields: [req("parameter", "text", "Parameter"), req("value", "numeric", "Value")], primaryKey: ["parameter"], foreignKeys: [], validation: ["mean stay 6.7 days", "tier shares sum to 100%"], source: "Report 4.3.2, Appendix C.1", quality: "report", usedBy: planned("rider_pricing") }),
  d({ id: "DB44", table: "e44_home_recovery_frequency", name: "Home Recovery Frequency", group: "E", description: "Qualifying Home Recovery episodes per parent-year after the two filters.", fields: [req("parameter", "text", "Parameter"), req("value", "numeric", "Value")], primaryKey: ["parameter"], foreignKeys: [], validation: ["20.2 per 1,000 = anchor × 75% × 70%"], source: "Report Table 4.1, 4.3.1, B.2", quality: "report", usedBy: planned("rider_pricing") }),
  d({ id: "DB45", table: "e45_disability_incidence_proxy", name: "Disability Incidence Proxy", group: "E", description: "US short-term disability claim starts used as the Home Recovery anchor.", fields: [req("component", "text", "Cause component (labels are not legible in the provided PDF)"), req("rate_per_1000", "numeric", "Claim starts per 1,000 employees a year")], primaryKey: ["component"], foreignKeys: [], validation: ["non-pregnancy components sum to 38.5 per 1,000 = 3.85%"], source: "Report B.2 [R16]", quality: "report", usedBy: planned("rider_pricing") }),
  d({ id: "DB46", table: "e46_claim_episodes", name: "Claim Episode Database", group: "E", description: "Rider claim episodes; first positive approval locks pathway A or B.", fields: [req("episode_id", "text", "Episode"), req("policy_id", "text", "Policy (DB16)"), ROLE, req("pathway", "text", "Pathway", { allowed: ["A", "B"] }), req("onset_date", "date", "Onset"), f("inpatient_days", "integer", "Documented inpatient days"), f("icu_hours", "integer", "ICU hours"), req("status", "text", "Status", { allowed: ["approved", "review", "rejected"] })], primaryKey: ["episode_id"], foreignKeys: [fk(["policy_id"], "DB16")], validation: ["one pathway per episode (C.2)", "no overlapping episodes for one parent"], source: "Report C.2, F.1", quality: "operational", usedBy: planned("claims") }),
  d({ id: "DB47", table: "e47_claim_severity", name: "Claim Severity Database", group: "E", description: "Award per tier: Care Hours and cash.", fields: [req("pathway", "text", "Pathway", { allowed: ["A", "B"] }), req("tier", "text", "Tier"), req("care_hours", "integer", "Care Hour credits"), f("cash_per_day", "money", "Hospital cash per day"), CURRENCY], primaryKey: ["pathway", "tier"], foreignKeys: [], validation: ["A: 20/40/60", "B: 20/40/60/80"], source: "Report Table 3.2", quality: "report", usedBy: [...live("claims"), ...planned("rider_pricing")] }),
  d({ id: "DB48", table: "e48_cis_weights", name: "Caregiving Impact Score", group: "E", description: "CIS activity weights by youngest-child band, severity scores and award bands.", fields: [req("child_band", "text", "Youngest child band", { allowed: ["0-2", "3-5", "6-8", "9-12"] }), req("activity", "text", "Activity", { allowed: ["C1", "C2", "C3", "C4", "C5", "C6"] }), req("weight", "probability", "Weight"), req("unlocks_service", "text", "Service opened at F2/F3")], primaryKey: ["child_band", "activity"], foreignKeys: [], validation: ["weights sum to 1 per band"], source: "Report Appendix B.3", quality: "report", usedBy: live("cis", "claims") }),
  d({ id: "DB49", table: "e49_functional_assessments", name: "Functional Assessment Results", group: "E", description: "Each assessed activity with evidence and decision.", fields: [req("assessment_id", "text", "Assessment"), req("episode_id", "text", "Episode (DB46)"), req("activity", "text", "Activity"), req("severity", "text", "Severity", { allowed: ["F0", "F1", "F2", "F3"] }), req("consecutive_days", "integer", "Days at this level"), f("evidence_ref", "text", "Medical certificate reference"), f("decision_reason", "text", "Approval or rejection reason")], primaryKey: ["assessment_id", "activity"], foreignKeys: [fk(["episode_id"], "DB46")], validation: ["F2/F3 for at least two consecutive days to qualify (3.2)"], source: "Report 3.2, B.3", quality: "operational", usedBy: planned("cis", "claims") }),
  d({ id: "DB50", table: "e50_hospital_cash_benefit", name: "Hospital Cash Benefits", group: "E", description: "Hospital cash rule.", fields: [req("rule_id", "text", "Rule"), req("cash_per_day", "money", "Cash per eligible inpatient day"), CURRENCY, req("max_days_per_parent_year", "integer", "Annual cap in days"), req("includes_one_day_stays", "boolean", "Eligible one-day stays paid")], primaryKey: ["rule_id"], foreignKeys: [], validation: ["500,000 VND/day, 30 days"], source: "Report 3.2, C.1", quality: "report", usedBy: live("claims") }),
  d({ id: "DB51", table: "e51_care_hours_allocation", name: "Care Hours Allocation", group: "E", description: "Credits used per service unit.", fields: [req("service", "text", "Service", { allowed: ["childcare", "meals", "transport", "housekeeping"] }), req("unit", "text", "Unit", { allowed: ["hour", "trip"] }), req("credits_per_unit", "integer", "Care Hours per unit"), f("max_share_of_grant", "probability", "Cap as share of each grant")], primaryKey: ["service"], foreignKeys: [], validation: ["transport = 2 credits per escorted trip", "housekeeping <= 30% of each grant"], source: "Report 3.2, B.3", quality: "report", usedBy: live("claims", "service") }),
  d({ id: "DB52", table: "e52_annual_benefit_limits", name: "Annual Benefit Limits", group: "E", description: "Per-parent and per-family annual limits.", fields: [req("limit_id", "text", "Limit"), req("value", "numeric", "Value"), req("unit", "text", "Unit")], primaryKey: ["limit_id"], foreignKeys: [], validation: ["120 Care Hours per parent-year shared by A and B", "grant validity 90 days"], source: "Report 3.2, Table 3.3, C.2", quality: "report", usedBy: live("claims") }),
  d({ id: "DB53", table: "e53_rider_claim_cost", name: "Rider Claim Cost Database", group: "E", description: "Rider tariff by older-parent band and youngest-child band, with the cost build-up where the report gives it.", fields: [req("parent_band", "text", "Older parent", { allowed: ["25-39", "40-49"] }), req("child_band", "text", "Youngest child", { allowed: ["0-2", "3-5", "6-8", "9-12"] }), req("tariff", "money", "Annual family rider premium"), CURRENCY, f("care_cost", "money", "Expected care cost"), f("cash_cost", "money", "Expected hospital cash"), f("handling", "money", "Claims handling"), f("fixed_admin", "money", "Fixed admin"), f("gift", "money", "Annual gift"), f("capital_return", "money", "Capital return")], primaryKey: ["parent_band", "child_band"], foreignKeys: [], validation: ["tariff = (care + cash + handling + admin + gift + capital) / 0.51 (C.3)"], source: "Report Table 4.3, C.3 (cost build-up only for 25–39 / 0–2)", quality: "report", usedBy: [...live("rider_pricing")] }),

  // ---------------- F. Service cost ----------------
  ...(
    [
      ["DB54", "f54_childcare_pricing", "Childcare Service Pricing", "childcare"],
      ["DB55", "f55_meal_pricing", "Meal Service Pricing", "meals"],
      ["DB56", "f56_housekeeping_pricing", "Housekeeping Service Pricing", "housekeeping"],
      ["DB57", "f57_transport_pricing", "Escorted Transport Pricing", "transport"],
    ] as const
  ).map(([id, table, name, service]) =>
    d({
      id: id as DatasetId, table, name, group: "F",
      description: `Planning budget per Care Hour credit for ${service}, pending provider contracts.`,
      fields: [req("service", "text", "Service"), req("child_band", "text", "Child band the rate applies to ('all' if any)"), req("cost_per_credit", "money", "Budget per credit"), CURRENCY, f("cost_per_unit", "money", "Budget per service unit (trip)"), req("source_ref", "text", "Source")],
      primaryKey: ["service", "child_band"], foreignKeys: [],
      validation: ["budgets, not supplier quotations (report 4.3.2)"],
      source: "Report Table 4.1, B.3, C.2 [R11, R18–R20, R34]", quality: "report" as const, usedBy: [...live("service"), ...planned("rider_pricing")],
    }),
  ),
  d({ id: "DB58", table: "f58_providers", name: "Provider Master", group: "F", description: "Contracted service providers.", fields: [req("provider_id", "text", "Provider"), req("name", "text", "Provider name"), req("zone", "text", "Service zone"), req("services", "json", "Services offered"), req("contract_status", "text", "Status", { allowed: ["target", "negotiating", "signed", "suspended"] })], primaryKey: ["provider_id"], foreignKeys: [], validation: ["services only in contracted zones (3.3)"], source: "No signed provider contracts yet (report 6.1)", quality: "missing", usedBy: planned("service") }),
  d({ id: "DB59", table: "f59_provider_capacity", name: "Provider Capacity and Availability", group: "F", description: "Capacity by provider, service and period.", fields: [req("provider_id", "text", "Provider (DB58)"), req("service", "text", "Service"), req("period", "date", "Week starting"), req("capacity_hours", "integer", "Bookable hours")], primaryKey: ["provider_id", "service", "period"], foreignKeys: [fk(["provider_id"], "DB58")], validation: ["capacity >= 0"], source: "Operational", quality: "missing", usedBy: planned("service") }),
  d({ id: "DB60", table: "f60_service_fulfilment", name: "Service Fulfilment and Utilisation", group: "F", description: "Fulfilment KPI targets and observed utilisation.", fields: [req("metric", "text", "Metric"), req("target", "numeric", "Target"), req("threshold", "numeric", "Action threshold"), req("action", "text", "Action when breached")], primaryKey: ["metric"], foreignKeys: [], validation: ["timely fulfilment target 95%, action below 90% (F.2)"], source: "Report F.2", quality: "report", usedBy: planned("service") }),

  // ---------------- G. Reinsurance ----------------
  d({ id: "DB61", table: "g61_reinsurers", name: "Reinsurer Master", group: "G", description: "Reinsurers considered.", fields: [req("reinsurer_id", "text", "Reinsurer"), req("name", "text", "Name"), req("rating", "text", "Financial strength rating"), req("status", "text", "Status", { allowed: ["preferred", "alternative", "signed"] })], primaryKey: ["reinsurer_id"], foreignKeys: [], validation: ["treaty not signed (6.6)"], source: "Report 5.3, 6.6, Table 6.10", quality: "report", usedBy: live("reinsurance") }),
  d({ id: "DB62", table: "g62_treaty_config", name: "Quota Share Treaty Configuration", group: "G", description: "Editable treaty parameters.", fields: [req("treaty_id", "text", "Treaty"), req("reinsurer_id", "text", "Reinsurer (DB61)"), req("structure", "text", "Structure", { allowed: ["quota_share", "surplus", "yrt"] }), f("ceded_share", "probability", "Quota share ceded"), f("retention", "money", "Surplus retention per policy"), CURRENCY, req("net_premium_allowance", "rate", "Net reinsurance cost as share of life premium"), req("capital_reserve_factor", "rate", "Capital as share of reserves"), req("capital_sar_factor", "rate", "Capital as share of retained sum at risk"), req("selected", "boolean", "Selected structure")], primaryKey: ["treaty_id"], foreignKeys: [fk(["reinsurer_id"], "DB61")], validation: ["ceded_share in [0,1]", "exactly one selected treaty"], source: "Report 6.6, 6.7, 6.8", quality: "report", usedBy: live("reinsurance") }),
  d({ id: "DB63", table: "g63_ceded_premium", name: "Ceded Premium Database", group: "G", description: "Premium ceded and net reinsurance cost per policy.", fields: computedRun([req("treaty_id", "text", "Treaty (DB62)"), req("gross_premium", "money", "Life gross premium"), req("ceded_premium", "money", "Gross ceded premium (share × G)"), req("net_cost", "money", "Net reinsurance cost (allowance × G)"), CURRENCY]), primaryKey: ["run_id", "treaty_id"], foreignKeys: [fk(["run_id"], "DB73"), fk(["treaty_id"], "DB62")], validation: ["net cost = 3% of G in the selected model (6.6)"], source: "Report 6.6", quality: "computed", usedBy: live("reinsurance") }),
  d({ id: "DB64", table: "g64_reinsurance_recovery", name: "Reinsurance Recovery Database", group: "G", description: "Split of an eligible claim between insurer and reinsurer.", fields: computedRun([req("treaty_id", "text", "Treaty (DB62)"), req("gross_claim", "money", "Eligible claim"), req("recovery", "money", "Reinsurer share"), req("retained", "money", "Insurer net retained claim"), CURRENCY]), primaryKey: ["run_id", "treaty_id"], foreignKeys: [fk(["run_id"], "DB73"), fk(["treaty_id"], "DB62")], validation: ["recovery + retained = gross claim", "QS60 on 2bn: 1.2bn / 0.8bn"], source: "Report 6.6, Table 6.9", quality: "computed", usedBy: live("reinsurance") }),
  d({ id: "DB65", table: "g65_capital_credit", name: "Reinsurance Capital Credit", group: "G", description: "Capital = 4% of reserves + 0.3% of retained sum at risk, gross vs net of reinsurance.", fields: computedRun([req("treaty_id", "text", "Treaty (DB62)"), T, req("reserve", "money", "Held reserve"), req("sum_at_risk_gross", "money", "SA − reserve"), req("sum_at_risk_retained", "money", "Retained sum at risk"), req("capital_gross", "money", "Capital without reinsurance"), req("capital_net", "money", "Capital with reinsurance"), CURRENCY]), primaryKey: ["run_id", "treaty_id", "t"], foreignKeys: [fk(["run_id"], "DB73"), fk(["treaty_id"], "DB62")], validation: ["capital_net <= capital_gross"], source: "Report 6.8", quality: "computed", usedBy: live("reinsurance") }),

  // ---------------- H. Financial (business case) ----------------
  ...(
    [
      ["DB66", "h66_expense_cf", "Expense and Acquisition Cash Flow"],
      ["DB67", "h67_investment_tax_cf", "Investment and Tax Cash Flow"],
      ["DB68", "h68_shareholder_cf", "Shareholder Cash Flow"],
    ] as const
  ).map(([id, table, name]) =>
    d({
      id: id as DatasetId, table, name, group: "H",
      description: `${name} by projection year for a portfolio scenario.`,
      fields: [req("scenario_id", "text", "Scenario"), req("projection_year", "integer", "Year", { min: 1, max: 50 }), req("item", "text", "Line item"), req("amount", "money", "Amount"), CURRENCY, req("scope", "text", "Calculation scope", { allowed: ["portfolio", "report_reference"] })],
      primaryKey: ["scenario_id", "projection_year", "item"], foreignKeys: [],
      validation: ["portfolio cash flows kept separate from per-policy pricing metrics (E.3.3)"],
      source: "Report section 6, Appendix E; the business case workbook is not provided", quality: "report" as const, usedBy: planned("financial"),
    }),
  ),
  d({ id: "DB69", table: "h69_vnb_nbs", name: "VNB and NBS Results", group: "H", description: "Value of new business and new business strain.", fields: [req("scenario_id", "text", "Scenario"), req("metric", "text", "Metric"), req("value", "numeric", "Value"), f("unit", "text", "Unit"), req("scope", "text", "Scope", { allowed: ["portfolio", "standalone_policy", "report_reference"] })], primaryKey: ["scenario_id", "metric"], foreignKeys: [], validation: ["standalone 40/40 VNB proxy 36.6m (Table 5.1)"], source: "Report Table 5.1, E.3", quality: "report", usedBy: planned("financial", "sensitivity") }),
  d({ id: "DB70", table: "h70_npv_irr", name: "NPV and IRR Results", group: "H", description: "Lifetime NPV, IRR, payback and peak funding.", fields: [req("scenario_id", "text", "Scenario"), req("metric", "text", "Metric"), req("value", "numeric", "Value"), f("unit", "text", "Unit"), req("scope", "text", "Scope", { allowed: ["portfolio", "report_reference"] })], primaryKey: ["scenario_id", "metric"], foreignKeys: [], validation: ["base: NPV 83.9bn at 12%, IRR 49%, payback year 5, peak funding 23.0bn (6.4)"], source: "Report 6.4, 6.6, deck slide 19", quality: "report", usedBy: planned("financial") }),

  // ---------------- I. Risk and validation ----------------
  d({ id: "DB71", table: "i71_sensitivity_results", name: "Sensitivity Analysis Results", group: "I", description: "Each stress run against the base, with its calculation scope.", fields: computedRun([req("scenario", "text", "Stress"), req("metric", "text", "Metric"), req("base_value", "numeric", "Base"), req("stressed_value", "numeric", "Stressed"), req("scope", "text", "Scope", { allowed: ["life_pricing", "standalone_policy", "portfolio"] })]), primaryKey: ["run_id", "scenario", "metric"], foreignKeys: [fk(["run_id"], "DB73")], validation: ["every stress uses the engines, never typed results"], source: "Report 5.2, E.3; sensitivity workbook sheet Tong_hop", quality: "computed", usedBy: [...live("sensitivity"), ...planned("financial")] }),
  d({ id: "DB72", table: "i72_validation", name: "Actuarial Model Validation and Reconciliation", group: "I", description: "Engine outputs compared with report benchmarks.", fields: [req("check_id", "text", "Check"), req("metric", "text", "Metric"), req("expected", "numeric", "Benchmark"), f("actual", "numeric", "Engine result"), req("tolerance", "numeric", "Absolute tolerance"), req("status", "text", "Result", { allowed: ["pass", "fail", "not_run"] }), req("benchmark_source", "text", "Where the benchmark comes from")], primaryKey: ["check_id"], foreignKeys: [], validation: ["status pass only when |actual − expected| <= tolerance"], source: "Report Tables 4.2, 4.3, 6.9", quality: "computed", usedBy: live("governance", "life_pricing", "reinsurance") }),

  // ---------------- J. Governance ----------------
  d({ id: "DB73", table: "j73_audit_trail", name: "Actuarial Audit Trail and Model Version Control", group: "J", description: "Every calculation run with the versions needed to reproduce it.", fields: [req("run_id", "text", "Run"), req("kind", "text", "Run type", { allowed: ["life_pricing", "reserving", "reinsurance", "workbench", "tariff", "validation", "sensitivity", "import"] }), req("initiated_by", "text", "User or role"), req("started_at", "timestamp", "Timestamp"), req("formula_version", "text", "Engine version"), req("dataset_versions", "json", "Version of every dataset read"), req("inputs", "json", "Inputs"), req("outputs", "json", "Headline outputs"), req("status", "text", "Status", { allowed: ["ok", "error"] })], primaryKey: ["run_id"], foreignKeys: [], validation: ["re-running with the stored inputs and versions reproduces outputs"], source: "Governance requirement", quality: "computed", usedBy: live("governance") }),
];

export const DATASET_BY_ID = new Map(DATASETS.map((x) => [x.id, x]));

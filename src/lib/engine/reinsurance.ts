// Engine tái bảo hiểm — mục 6.6–6.8 của báo cáo. Mọi tham số đến từ DB62 và sửa được.
export const REINSURANCE_FORMULA_VERSION = "reinsurance-6.6-2026.11.1";

export type Treaty = {
  treatyId: string;
  structure: "quota_share" | "surplus" | "yrt";
  cededShare: number | null; // quota share
  retention: number | null; // surplus, VND mỗi hợp đồng
  netPremiumAllowance: number; // chi phí tái BH ròng theo % phí nhân thọ (3% trong mô hình chọn)
  capitalReserveFactor: number; // 4% dự phòng
  capitalSarFactor: number; // 0,3% số tiền chịu rủi ro giữ lại
};

/** Tỷ lệ số tiền bảo hiểm do công ty giữ lại. */
export function retainedShare(treaty: Treaty, sumAssured: number): number {
  if (treaty.structure === "quota_share") {
    const s = treaty.cededShare ?? 0;
    if (!(s >= 0 && s <= 1)) throw new RangeError("ceded_share_out_of_range");
    return 1 - s;
  }
  if (treaty.structure === "surplus") return Math.min(treaty.retention ?? sumAssured, sumAssured) / sumAssured;
  // YRT: công ty trả phí rủi ro theo năm; tỷ lệ nhượng phải được khai báo qua cededShare.
  return 1 - (treaty.cededShare ?? 0);
}

export function splitClaim(treaty: Treaty, claim: number, sumAssured: number) {
  const retained = claim * retainedShare(treaty, sumAssured);
  return { gross: claim, retained, recovery: claim - retained };
}

export function cededPremium(treaty: Treaty, grossPremium: number, sumAssured: number) {
  const share = 1 - retainedShare(treaty, sumAssured);
  return { ceded: grossPremium * share, netCost: grossPremium * treaty.netPremiumAllowance };
}

/** Vốn = hệ số × dự phòng + hệ số × số tiền chịu rủi ro giữ lại (mục 6.8). */
export function capital(treaty: Treaty | null, sumAssured: number, heldReserve: number) {
  const sar = Math.max(0, sumAssured - heldReserve);
  const keep = treaty ? retainedShare(treaty, sumAssured) : 1;
  const reserveFactor = treaty?.capitalReserveFactor ?? 0.04;
  const sarFactor = treaty?.capitalSarFactor ?? 0.003;
  return { sumAtRisk: sar, retainedSumAtRisk: sar * keep, capital: reserveFactor * heldReserve + sarFactor * sar * keep };
}

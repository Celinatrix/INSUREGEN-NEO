// Kiểm tra khả năng chi trả (Mục 2.4, Phụ lục H.2): tách riêng để chạy trên trình duyệt — thu nhập không gửi lên máy chủ.
import { ELIGIBILITY } from "./product.ts";

export type Affordability = {
  income: number;
  shareLow: number;
  shareHigh: number;
  belowMinIncome: boolean;
  overCap: boolean; // tổng phí (mức cao) > 12% thu nhập ròng
};

export function affordability(totalLow: number, totalHigh: number, income: number): Affordability {
  return {
    income,
    shareLow: totalLow / income,
    shareHigh: totalHigh / income,
    belowMinIncome: income < ELIGIBILITY.minNetIncome,
    overCap: totalHigh > income * ELIGIBILITY.premiumIncomeCap,
  };
}

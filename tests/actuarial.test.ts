import { test } from "node:test";
import assert from "node:assert/strict";
import { grossReserves, jointLife, LIFE_SCENARIOS } from "../src/lib/actuarial.ts";
import { LIFE_PREMIUM_POINTS } from "../src/lib/product.ts";

const close = (a: number, b: number, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test("Workbook default case 35/30 (Mo_Hinh_Tinh_Phi, Gross_Premium_10Y)", () => {
  const r = jointLife(35, 30);
  close(r.net, 13_445_495.539291551);
  close(r.gross, 21_879_515.395486467);
  close(r.annuityDue, 8.062111161485356, 1e-9);
});

test("Report illustrated pairs", () => {
  for (const [k, v] of Object.entries(LIFE_PREMIUM_POINTS)) {
    const [f, m] = k.split("-").map(Number);
    close(jointLife(f, m).gross, v, 0.5); // 34/30 is rounded in the report
  }
});

test("Sensitivity workbook (Life_Sens, Tong_hop) for 40/40", () => {
  close(jointLife(40, 40, { mortalityMult: 1.2, tpdMult: 1.2 }).gross, 46_527_724.9826);
  close(jointLife(40, 40, { tpdMult: 1.25 }).gross, 42_400_259.0404);
  close(jointLife(40, 40, { interest: 0.06 }).gross, 38_100_905.7658);
  close(jointLife(40, 40, { profit: 0.15 }).gross, 42_232_312.8324);
  close(jointLife(30, 30).gross, 17_595_385.4765);
  const expected = [32_243_427.2575, 38_893_158.8902, 43_897_387.7747, 50_933_590.7996, 69_569_627.6498];
  LIFE_SCENARIOS.forEach((s, i) => close(jointLife(40, 40, s.over).gross, expected[i]));
});

test("Gross reserves match Gross_Reserve_Calculation (35/30)", () => {
  const r = grossReserves(35, 30);
  const expected = [-26459263, -25513929, -20260117, -14307570, -9010850, -4484848, -869858, 1665937, 2986311, 2483212, 0];
  expected.forEach((v, t) => close(r[t].reserve, v, 1));
  close(r[0].epvBenefits, 108399079.66, 0.01);
  close(r[9].epvPremiums, 21879515.4, 0.01);
});

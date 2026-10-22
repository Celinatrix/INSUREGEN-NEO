// Đối chiếu engine với báo cáo final (FINAL_report.pdf, 19/10/2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { jointLife, valuationReserves } from "../src/lib/actuarial.ts";
import { quote } from "../src/lib/pricing.ts";
import { affordability } from "../src/lib/affordability.ts";

const m2 = (x: number) => Math.round(x / 1e4) / 100; // triệu đồng, 2 chữ số

test("Appendix A.4: reserves for 40/40 (raw gross 4.5%, net 3%, FPT 3%, held)", () => {
  const r = valuationReserves(40, 40);
  const A4 = [
    [-46.13, 0, 0, 0], [-43.45, 8.1, 0, 0], [-33.69, 15.01, 7.69, 7.69], [-22.97, 20.64, 14.11, 14.11],
    [-13.71, 24.51, 18.81, 18.81], [-6.07, 26.48, 21.64, 21.64], [-0.18, 26.41, 22.45, 22.45],
    [3.81, 24.14, 21.12, 21.12], [5.68, 19.49, 17.43, 17.43], [4.53, 11.56, 10.5, 10.5], [0, 0, 0, 0],
  ];
  r.rows.forEach((x, t) => assert.deepEqual([m2(x.rawGross), m2(x.net), m2(x.fpt), m2(x.held)].map((v) => v + 0), A4[t], `t=${t}`));
  assert.equal(Math.round(r.netPremium), 24_572_840);
  assert.equal(Math.round(r.fptPremium), 25_628_357);
});

test("Appendix A.4 / Table 4.2: 40/40 present values and tariffs", () => {
  const j = jointLife(40, 40);
  assert.ok(Math.abs(j.apvBenefits / 2e9 - 0.09478838572) < 1e-10);
  assert.ok(Math.abs(j.annuityDue - 7.906354306901) < 1e-10);
  assert.equal(Math.round(j.net), 23_977_773);
  assert.equal(Math.round(j.gross), 38_893_159);
});

test("Table 2.4 / Appendix G.2: combined premium and income fit (child 0–2)", () => {
  const cases: [number, number, number, number][] = [
    [25, 25, 15.837, 0.0563],
    [40, 30, 32.018, 0.1137],
    [40, 40, 41.08, 0.1459],
  ];
  for (const [f, m, total, share] of cases) {
    const q = quote({ fatherAge: f, motherAge: m, youngestChildAge: 1 });
    assert.equal(Math.round(q.total! / 1e3) / 1e3, total, `${f}/${m}`);
    assert.equal(Math.round(affordability(q.total!, q.total!, 281_520_000).shareLow * 1e4) / 1e4, share);
  }
});

test("Table 6.5: year-1 life premiums for the business-case model points", () => {
  const pts: [number, number, number][] = [
    [29, 25, 15_071_627], [34, 30, 20_769_350], [38, 34, 28_910_833], [40, 36, 34_485_062], [40, 40, 38_893_159],
  ];
  for (const [f, m, life] of pts) assert.equal(Math.round(jointLife(f, m).gross), life, `${f}/${m}`);
  // Bình quân có trọng số 20/30/25/15/10% với phí bổ trợ bình quân 1.925.141 / 1.978.869 = 27.473.487 (Mục 6.3)
  const w = [0.2, 0.3, 0.25, 0.15, 0.1];
  const rider = [1_925_141, 1_925_141, 1_925_141, 1_978_869, 1_978_869];
  const avg = pts.reduce((s, [f, m], i) => s + w[i] * (jointLife(f, m).gross + rider[i]), 0);
  assert.equal(Math.round(avg), 27_473_487);
});

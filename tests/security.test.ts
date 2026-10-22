import { test } from "node:test";
import assert from "node:assert/strict";
import { crossSite, pageCsp, rejectJsonWrite } from "../src/lib/security.ts";
import { clientIp } from "../src/lib/server/rateLimit.ts";
import { sniffImage } from "../src/lib/upload.ts";

const req = (h: Record<string, string>) => new Request("https://insuregen-neo.vercel.app/api/leads", { method: "POST", headers: h });

test("CSP: nonce, strict-dynamic, no unsafe-inline/eval for scripts in production", () => {
  const csp = pageCsp("abc", false);
  const script = csp.split("; ").find((d) => d.startsWith("script-src"))!;
  assert.match(script, /'nonce-abc'/);
  assert.match(script, /'strict-dynamic'/);
  assert.doesNotMatch(script, /unsafe/);
  for (const d of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'"]) {
    assert.ok(csp.includes(d), d);
  }
});

test("Cross-site writes are rejected, same-origin and server calls pass", () => {
  assert.equal(crossSite(req({ host: "insuregen-neo.vercel.app", origin: "https://evil.example" })), true);
  assert.equal(crossSite(req({ host: "insuregen-neo.vercel.app", origin: "https://insuregen-neo.vercel.app" })), false);
  assert.equal(crossSite(req({ host: "insuregen-neo.vercel.app" })), false);
  assert.equal(rejectJsonWrite(req({ host: "x", origin: "https://x", "content-type": "text/plain" }))?.status, 415);
  assert.equal(rejectJsonWrite(req({ host: "x", origin: "https://x", "content-type": "application/json" })), null);
});

test("Rate-limit IP ignores a spoofed first X-Forwarded-For entry", () => {
  assert.equal(clientIp(req({ "x-real-ip": "1.2.3.4", "x-forwarded-for": "9.9.9.9, 1.2.3.4" })), "1.2.3.4");
  assert.equal(clientIp(req({ "x-forwarded-for": "9.9.9.9, 5.6.7.8" })), "5.6.7.8");
});

test("Uploads are typed by magic bytes", () => {
  assert.equal(sniffImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), "image/jpeg");
  assert.equal(sniffImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), "image/png");
  assert.equal(sniffImage(new TextEncoder().encode("<svg onload=alert(1)>")), null);
});

test("Concurrent bookings cannot spend the same hours twice", async () => {
  const { createWallet, book } = await import("../src/lib/server/wallet.ts");
  const w = await createWallet(3);
  const date = new Date().toISOString().slice(0, 10);
  // Ví mới có 1 giờ quà tặng: hai lượt đặt 1 giờ gửi cùng lúc chỉ được một lượt.
  const results = await Promise.all([book(w.wallet.id, "childcare", 1, date), book(w.wallet.id, "childcare", 1, date)]);
  const ok = results.filter((r) => r && !("error" in r));
  assert.equal(ok.length, 1);
});

test("Lead form: only name and phone are required (data minimisation)", async () => {
  const { validateLead } = await import("../src/lib/lead.ts");
  const base = { name: "Lan", phone: "0912345678", email: "", fatherAge: null, motherAge: null, youngestChildAge: null, city: "hcmc", consent: true, locale: "vi" };
  assert.deepEqual(validateLead(base), []);
  assert.equal(validateLead({ ...base, email: "not-an-email" })[0]?.field, "email");
  assert.equal(validateLead({ ...base, consent: false })[0]?.field, "consent");
});

test("Demo wallets can be deleted with all their data (right to erasure)", async () => {
  const { createWallet } = await import("../src/lib/server/wallet.ts");
  const { getStore } = await import("../src/lib/server/store.ts");
  const w = await createWallet(4);
  assert.equal(await getStore().deleteWallet(w.wallet.id), true);
  assert.equal(await getStore().getWallet(w.wallet.id), null);
  assert.equal(await getStore().deleteWallet(w.wallet.id), false);
});

test("Affordability runs without the server", async () => {
  const { affordability } = await import("../src/lib/affordability.ts");
  const a = affordability(22_607_760, 22_607_760, 281_500_000);
  assert.equal(a.overCap, false);
  assert.ok(Math.abs(a.shareLow - 0.0803) < 0.001);
});

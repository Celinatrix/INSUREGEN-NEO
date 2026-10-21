// Lớp lưu trữ. Dùng Supabase khi có SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY;
// nếu chưa cấu hình thì lưu tạm trong bộ nhớ máy chủ (chỉ để chạy thử).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Service } from "../product.ts";
import type { Grant } from "../rules.ts";
import type { ClaimResult, Parent } from "../claims.ts";

export type LeadRow = {
  name: string;
  phone: string;
  email: string;
  father_age: number | null;
  mother_age: number | null;
  youngest_child_age: number | null;
  city: string;
  locale: string;
  consent_version: string;
  consent_at: string;
};

export type WalletRow = { id: string; created_at: string; youngest_child_age: number };

export type ClaimRow = {
  id: string;
  wallet_id: string;
  parent: Parent;
  pathway: "A" | "B";
  reason: string;
  admission_date: string | null;
  discharge_date: string | null;
  icu_hours: number | null;
  ratings: Record<string, string> | null;
  restricted_days: number | null;
  inpatient_days: number | null;
  cis_score: number | null;
  hours_awarded: number;
  cash_days: number;
  cash_amount: number;
  status: ClaimResult["status"];
  reasons: string[];
  flags: string[];
  created_at: string;
};

export type GrantRow = {
  id: string;
  wallet_id: string;
  claim_id: string | null;
  parent: Parent | null;
  kind: "claim" | "gift";
  hours: number;
  services: Service[];
  used: number;
  housekeeping_used: number;
  expires_on: string;
  created_at: string;
};

export type BookingRow = {
  id: string;
  wallet_id: string;
  service: Service;
  service_hours: number;
  credits: number;
  service_date: string;
  allocation: { grantId: string; credits: number }[];
  created_at: string;
};

export type WalletSnapshot = {
  wallet: WalletRow;
  claims: ClaimRow[];
  grants: GrantRow[];
  bookings: BookingRow[];
};

export interface Store {
  kind: "supabase" | "memory";
  insertLead(row: LeadRow): Promise<void>;
  createWallet(youngestChildAge: number): Promise<WalletRow>;
  getWallet(id: string): Promise<WalletSnapshot | null>;
  insertClaim(row: Omit<ClaimRow, "id" | "created_at">): Promise<ClaimRow>;
  insertGrant(row: Omit<GrantRow, "id" | "created_at">): Promise<GrantRow>;
  /** Cập nhật có điều kiện: chỉ ghi khi `used` hiện tại vẫn bằng `expectedUsed`. Trả về false nếu bị lượt khác ghi trước. */
  updateGrantUsage(id: string, expectedUsed: number, used: number, housekeepingUsed: number): Promise<boolean>;
  insertBooking(row: Omit<BookingRow, "id" | "created_at">): Promise<BookingRow>;
}

export const toGrant = (g: GrantRow): Grant => ({
  id: g.id,
  hours: g.hours,
  services: g.services,
  used: g.used,
  housekeepingUsed: g.housekeeping_used,
  createdAt: g.created_at,
  expiresOn: g.expires_on,
  capHousekeeping: g.kind !== "gift",
});

// ---------- Bộ nhớ ----------
type Mem = { leads: LeadRow[]; wallets: WalletRow[]; claims: ClaimRow[]; grants: GrantRow[]; bookings: BookingRow[] };
const g = globalThis as unknown as { __frMem?: Mem };
const mem: Mem = (g.__frMem ??= { leads: [], wallets: [], claims: [], grants: [], bookings: [] });
const now = () => new Date().toISOString();
// Bảo đảm thứ tự created_at tăng dần kể cả khi tạo nhiều bản ghi trong cùng một mili giây
let lastTs = 0;
const stamp = () => {
  const t = Math.max(Date.now(), lastTs + 1);
  lastTs = t;
  return new Date(t).toISOString();
};

const memoryStore: Store = {
  kind: "memory",
  async insertLead(row) {
    mem.leads.push(row);
    if (mem.leads.length > 500) mem.leads.shift();
  },
  async createWallet(age) {
    const w = { id: crypto.randomUUID(), created_at: stamp(), youngest_child_age: age };
    mem.wallets.push(w);
    if (mem.wallets.length > 2000) {
      const old = mem.wallets.shift()!;
      mem.claims = mem.claims.filter((c) => c.wallet_id !== old.id);
      mem.grants = mem.grants.filter((c) => c.wallet_id !== old.id);
      mem.bookings = mem.bookings.filter((c) => c.wallet_id !== old.id);
    }
    return w;
  },
  async getWallet(id) {
    const wallet = mem.wallets.find((w) => w.id === id);
    if (!wallet) return null;
    return {
      wallet,
      claims: mem.claims.filter((c) => c.wallet_id === id),
      grants: mem.grants.filter((c) => c.wallet_id === id),
      bookings: mem.bookings.filter((c) => c.wallet_id === id),
    };
  },
  async insertClaim(row) {
    const c = { ...row, id: crypto.randomUUID(), created_at: stamp() };
    mem.claims.push(c);
    return c;
  },
  async insertGrant(row) {
    const c = { ...row, id: crypto.randomUUID(), created_at: stamp() };
    mem.grants.push(c);
    return c;
  },
  async updateGrantUsage(id, expected, used, hk) {
    const x = mem.grants.find((gr) => gr.id === id);
    if (!x || x.used !== expected) return false;
    x.used = used;
    x.housekeeping_used = hk;
    return true;
  },
  async insertBooking(row) {
    const c = { ...row, id: crypto.randomUUID(), created_at: now() };
    mem.bookings.push(c);
    return c;
  },
};

// ---------- Supabase ----------
function supabaseStore(client: SupabaseClient): Store {
  const must = <T>(r: { data: T | null; error: { message: string } | null }): T => {
    if (r.error) throw new Error(r.error.message);
    return r.data as T;
  };
  return {
    kind: "supabase",
    async insertLead(row) {
      must(await client.from("leads").insert(row));
    },
    async createWallet(age) {
      return must(await client.from("wallets").insert({ youngest_child_age: age }).select().single());
    },
    async getWallet(id) {
      const w = await client.from("wallets").select().eq("id", id).maybeSingle();
      if (w.error || !w.data) return null;
      const [claims, grants, bookings] = await Promise.all([
        client.from("claims").select().eq("wallet_id", id).order("created_at"),
        client.from("grants").select().eq("wallet_id", id).order("created_at"),
        client.from("bookings").select().eq("wallet_id", id).order("created_at"),
      ]);
      return { wallet: w.data, claims: must(claims), grants: must(grants), bookings: must(bookings) };
    },
    async insertClaim(row) {
      return must(await client.from("claims").insert(row).select().single());
    },
    async insertGrant(row) {
      return must(await client.from("grants").insert(row).select().single());
    },
    async updateGrantUsage(id, expected, used, hk) {
      const rows = must(
        await client.from("grants").update({ used, housekeeping_used: hk }).eq("id", id).eq("used", expected).select("id"),
      );
      return Array.isArray(rows) && rows.length === 1;
    },
    async insertBooking(row) {
      return must(await client.from("bookings").insert(row).select().single());
    },
  };
}

let cached: Store | null = null;
export function getStore(): Store {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached = url && key ? supabaseStore(createClient(url, key, { auth: { persistSession: false } })) : memoryStore;
  return cached;
}

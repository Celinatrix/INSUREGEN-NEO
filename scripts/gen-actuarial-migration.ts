// Sinh supabase/migrations/004_actuarial_datasets.sql từ sổ đăng ký 73 dataset.
// Chạy: node --experimental-strip-types scripts/gen-actuarial-migration.ts
import { writeFileSync } from "node:fs";
import { migrationSql } from "../src/lib/actuarial-db/sql.ts";

const out = "supabase/migrations/004_actuarial_datasets.sql";
writeFileSync(out, migrationSql());
console.log(`wrote ${out}`);

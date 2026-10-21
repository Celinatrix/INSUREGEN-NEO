import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { commonVars, fmt, getDict, hasLocale, LOCALES } from "@/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Family Reconnect";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const fontDir = join(process.cwd(), "node_modules/@fontsource/be-vietnam-pro/files");
const font = (subset: string, w: number) => readFile(join(fontDir, `be-vietnam-pro-${subset}-${w}-normal.woff`));

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = hasLocale(lang) ? lang : "vi";
  const d = getDict(l);
  const facts = d.hero.facts.map((f) => fmt(f, commonVars(l))).join(" · ");
  const [l4, v4, l7, v7] = await Promise.all([font("latin", 400), font("vietnamese", 400), font("latin", 700), font("vietnamese", 700)]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#1B2E52",
          color: "#FFFFFF",
          fontFamily: "BVP, BVPV",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#E3BB63", display: "flex" }} />
          Family Reconnect
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.12, display: "flex", flexDirection: "column" }}>
            <span>{d.hero.titleA}</span>
            <span style={{ color: "#E3BB63" }}>{d.hero.titleB}</span>
          </div>
          <div style={{ fontSize: 30, color: "#C9D2E3" }}>
            {facts}
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#C9D2E3" }}>INSUREGEN NEO · InsuNovate 2026</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "BVP", data: l4, weight: 400 },
        { name: "BVPV", data: v4, weight: 400 },
        { name: "BVP", data: l7, weight: 700 },
        { name: "BVPV", data: v7, weight: 700 },
      ],
    },
  );
}

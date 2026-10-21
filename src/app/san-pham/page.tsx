import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  product,
  contractStructure,
  keyBenefits,
  pathwayA,
  pathwayB,
  activities,
  childAgeBands,
  severityScale,
  services,
  providerStandards,
  howItWorks,
  workedExample,
  combinedPremiums,
  riderRates,
  pricingNote,
  comparison,
  eligibility,
  terms,
  faqs,
} from "@/lib/data/family-reconnect";

export const metadata: Metadata = {
  title: "Family Reconnect",
  description:
    "Family Reconnect: bảo hiểm nhân thọ chung 2 tỷ đồng cho cả cha và mẹ, kèm quyền lợi bổ trợ Family Continuity Rider với trợ cấp nằm viện và Care Hours.",
};

function SectionTitle({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}

const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const td = "px-4 py-3 text-sm text-foreground align-top";

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-accent">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductPage() {
  return (
    <div className="py-20 md:py-28">
      <Container>
        {/* Intro */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Sản phẩm</p>
          <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-base font-medium text-muted-foreground">
            Bảo hiểm nhân thọ chung cho cha mẹ + {product.riderName}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-foreground">{product.tagline}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/lien-he" variant="secondary">Nhận tư vấn về Family Reconnect</Button>
            <Button href="#phi" variant="ghost">Xem phí minh họa</Button>
          </div>
        </div>

        {/* Key benefits */}
        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {keyBenefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="text-2xl font-semibold text-primary">{b.value}</p>
              <h3 className="mt-2 text-sm font-semibold text-card-foreground">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.detail}</p>
            </div>
          ))}
        </div>

        {/* Contract structure */}
        <div className="mt-24">
          <SectionTitle eyebrow="Cấu trúc hợp đồng" title="Một hợp đồng, hai lớp bảo vệ" />
          <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {contractStructure.map((row) => (
              <div key={row.feature} className="bg-card p-6">
                <dt className="text-sm font-semibold text-foreground">{row.feature}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{row.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Pathways */}
        <div id="care-hours" className="mt-24 scroll-mt-24">
          <SectionTitle
            eyebrow={product.riderName}
            title="Hai lộ trình nhận Care Hours"
            intro="Mỗi cha/mẹ có 120 Care Hours mỗi năm, dùng chung cho cả hai lộ trình. Care Hours được nạp vào Family Care Wallet để đặt dịch vụ."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[pathwayA, pathwayB].map((p) => (
              <div key={p.code} className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    {p.code}
                  </span>
                  <h3 className="text-lg font-semibold text-card-foreground">{p.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.trigger}</p>
                <table className="mt-6 w-full border-t border-border">
                  <thead>
                    <tr>
                      <th className={th + " pl-0"}>Điều kiện</th>
                      <th className={th + " pr-0 text-right"}>Care Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.tiers.map((t) => (
                      <tr key={t.range} className="border-t border-border">
                        <td className={td + " pl-0"}>{t.range}</td>
                        <td className={td + " pr-0 text-right font-semibold text-primary"}>{t.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{p.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-2xl bg-muted/60 p-5 text-sm leading-relaxed text-foreground">
            <span className="font-semibold">Trợ cấp nằm viện đi kèm Lộ trình A:</span> 500.000đ mỗi ngày
            nằm viện, tối đa 30 ngày mỗi cha/mẹ mỗi năm, không phụ thuộc hóa đơn viện phí. Mức 30 ngày
            bao phủ hơn 99% số lần nằm viện được mô hình hóa.
          </p>
        </div>

        {/* CIS */}
        <div id="cis" className="mt-24 scroll-mt-24">
          <SectionTitle
            eyebrow="Lộ trình B"
            title="Điểm Tác động Chăm sóc (CIS)"
            intro="CIS đo mức ảnh hưởng của bệnh hoặc chấn thương tới 6 hoạt động chăm sóc con. Mỗi hoạt động được chấm từ F0 đến F3, nhân với trọng số theo tuổi con nhỏ nhất, rồi cộng lại thành điểm từ 0 đến 1."
          />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full min-w-[640px]">
              <thead className="bg-muted/60">
                <tr>
                  <th className={th}>Hoạt động</th>
                  {childAgeBands.map((b) => (
                    <th key={b} className={th + " text-right"}>Con {b}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.code} className="border-t border-border">
                    <td className={td}>
                      <span className="mr-2 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {a.code}
                      </span>
                      <span className="font-semibold">{a.name}</span>
                      <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                    </td>
                    {a.weights.map((w, i) => (
                      <td key={i} className={td + " text-right tabular-nums"}>{w}%</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {severityScale.map((s) => (
              <div key={s.level} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-primary">{s.level} · {s.score}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Mức F1 được tính vào điểm CIS nhưng không tự mở dịch vụ. Chỉ hoạt động ở mức F2 hoặc F3,
            được bác sĩ xác nhận ít nhất 2 ngày liên tiếp, mới mở dịch vụ tương ứng. Điểm CIS dưới 0,20
            không được cấp Care Hours.
          </p>
        </div>

        {/* Services & providers */}
        <div id="doi-tac" className="mt-24 scroll-mt-24">
          <SectionTitle
            eyebrow="Family Care Wallet"
            title="Dịch vụ và nhà cung cấp"
            intro="Care Hours chỉ dùng tại các nhà cung cấp mà công ty bảo hiểm đã kiểm định và ký hợp đồng trước."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {s.rule}
                </span>
                <h3 className="mt-3 text-base font-semibold text-card-foreground">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-7">
            <h3 className="text-base font-semibold text-foreground">Tiêu chuẩn nhà cung cấp</h3>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {providerStandards.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckIcon />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How it works */}
        <div id="cach-hoat-dong" className="mt-24 scroll-mt-24">
          <SectionTitle eyebrow="Bồi thường có hỗ trợ AI" title="Cách hoạt động" />
          <ol className="mt-8 space-y-4">
            {howItWorks.map((item) => (
              <li key={item.step} className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-card-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Hệ thống tự động gắn cờ các điểm bất thường để xác minh thêm; dữ liệu y tế được bảo vệ phù hợp.
          </p>
        </div>

        {/* Worked example */}
        <div className="mt-24 rounded-3xl border border-border bg-muted/40 p-6 md:p-10">
          <SectionTitle eyebrow="Ví dụ minh họa" title={workedExample.title} />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className={th + " pl-0"}>Bước</th>
                  <th className={th}>Điều gì xảy ra</th>
                  <th className={th + " pr-0 text-right"}>Số tiền / quyền lợi</th>
                </tr>
              </thead>
              <tbody>
                {workedExample.rows.map((r) => (
                  <tr key={r.step} className="border-t border-border">
                    <td className={td + " pl-0 font-semibold"}>{r.step}</td>
                    <td className={td + " text-muted-foreground"}>{r.what}</td>
                    <td className={td + " pr-0 text-right font-medium"}>{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing */}
        <div id="phi" className="mt-24 scroll-mt-24">
          <SectionTitle
            eyebrow="Phí minh họa"
            title="Phí bảo hiểm cho cả gia đình"
            intro="Tổng phí nhân thọ và bổ trợ mỗi năm theo tuổi cha / mẹ, so với thu nhập hộ đô thị trung bình 281,5 triệu đồng/năm."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
              <table className="w-full min-w-[420px]">
                <thead className="bg-muted/60">
                  <tr>
                    <th className={th}>Cha / mẹ</th>
                    <th className={th + " text-right"}>Mỗi năm</th>
                    <th className={th + " text-right"}>Mỗi tháng</th>
                    <th className={th + " text-right"}>% thu nhập</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedPremiums.map((r) => (
                    <tr key={r.ages} className="border-t border-border">
                      <td className={td + " font-semibold"}>{r.ages}</td>
                      <td className={td + " text-right tabular-nums"}>{r.yearly}</td>
                      <td className={td + " text-right tabular-nums"}>{r.monthly}</td>
                      <td className={td + " text-right tabular-nums"}>{r.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
              <table className="w-full min-w-[420px]">
                <caption className="px-4 pt-4 text-left text-sm font-semibold text-foreground">
                  Phí {product.riderName} (đồng/gia đình/năm)
                </caption>
                <thead>
                  <tr>
                    <th className={th}>Con nhỏ nhất</th>
                    <th className={th + " text-right"}>Cha/mẹ lớn tuổi hơn 25–39</th>
                    <th className={th + " text-right"}>40–49</th>
                  </tr>
                </thead>
                <tbody>
                  {riderRates.map((r) => (
                    <tr key={r.child} className="border-t border-border">
                      <td className={td + " font-semibold"}>{r.child}</td>
                      <td className={td + " text-right tabular-nums"}>{r.young}</td>
                      <td className={td + " text-right tabular-nums"}>{r.older}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{pricingNote}</p>
        </div>

        {/* Comparison */}
        <div className="mt-24">
          <SectionTitle
            eyebrow="So sánh"
            title="Sản phẩm hiện có đáp ứng từng phần, chưa có sản phẩm nào gộp cả ba"
          />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full min-w-[720px]">
              <thead className="bg-muted/60">
                <tr>
                  <th className={th}>Sản phẩm</th>
                  {comparison.columns.map((c) => (
                    <th key={c} className={th}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((r) => (
                  <tr key={r.offer} className={"border-t border-border " + (r.highlight ? "bg-primary/5" : "")}>
                    <td className={td + " font-semibold " + (r.highlight ? "text-primary" : "")}>{r.offer}</td>
                    {r.cells.map((c, i) => (
                      <td key={i} className={td + (r.highlight ? " font-medium" : " text-muted-foreground")}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Eligibility + terms */}
        <div className="mt-24 grid gap-12 md:grid-cols-2">
          <div>
            <SectionTitle title={eligibility.title} />
            <ul className="mt-6 space-y-3">
              {eligibility.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckIcon />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionTitle title="Điều khoản chính" />
            <dl className="mt-6 space-y-5">
              {terms.map((t) => (
                <div key={t.title}>
                  <dt className="text-sm font-semibold text-foreground">{t.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mt-24 scroll-mt-24">
          <SectionTitle title="Câu hỏi thường gặp" />
          <dl className="mt-8 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-t border-border pt-6">
                <dt className="font-semibold text-foreground">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-20 rounded-3xl border border-border bg-card p-10 text-center shadow-card">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Muốn biết phí cho đúng tuổi của gia đình bạn?
          </h2>
          <div className="mt-6 flex justify-center">
            <Button href="/lien-he" variant="secondary">Nhận tư vấn miễn phí</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

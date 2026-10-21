import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const metadata: Metadata = {
  title: "Liên hệ & Nhận báo giá",
  description:
    "Gửi yêu cầu tư vấn để nhận phí minh họa Family Reconnect theo tuổi của cha mẹ và con.",
};

const contactChannels = [
  {
    label: "Hotline tư vấn",
    value: "1900 6868",
    detail: "7:00 - 22:00, tất cả các ngày trong tuần",
  },
  {
    label: "Email hỗ trợ",
    value: "hotro@insuregenneo.vn",
    detail: "Phản hồi trong vòng 24 giờ làm việc",
  },
  {
    label: "Văn phòng trụ sở",
    value: "Tầng 18, Tòa nhà NEO Tower",
    detail: "Quận 1, TP. Hồ Chí Minh",
  },
];

export default function ContactPage() {
  return (
    <div className="py-20 md:py-28">
      <Container>
        <div className="grid gap-16 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Liên hệ
            </p>
            <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-foreground">
              Nhận tư vấn và báo giá miễn phí
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Để lại thông tin, tư vấn viên sẽ giải thích quyền lợi 2 tỷ đồng,
              cách dùng Care Hours và phí minh họa theo tuổi của gia đình bạn.
              Family Reconnect đang thí điểm tại TP.HCM.
            </p>

            <dl className="mt-10 space-y-6">
              {contactChannels.map((channel) => (
                <div key={channel.label} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {channel.label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground">
                    {channel.value}
                  </dd>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {channel.detail}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          <QuoteForm />
        </div>
      </Container>
    </div>
  );
}

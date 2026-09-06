import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { products } from "@/lib/data/products";

const productLinks = products.slice(0, 5);

export function Footer() {
  return (
    <footer className="border-t border-navy-border bg-navy text-navy-foreground">
      <Container className="grid gap-10 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <span className="text-lg font-semibold tracking-tight text-white">
            INSUREGEN <span className="text-neo-cyan">NEO</span>
          </span>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-muted">
            Nền tảng bảo hiểm số thế hệ mới, đồng hành bảo vệ tài chính cho cá
            nhân, gia đình và doanh nghiệp Việt Nam.
          </p>
          <p className="mt-6 text-xs text-navy-muted">
            Giấy phép hoạt động kinh doanh bảo hiểm số 000/GP-BTC do Bộ Tài
            chính cấp. Vốn điều lệ: 1.800 tỷ đồng.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Sản phẩm</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-muted">
            {productLinks.map((product) => (
              <li key={product.slug}>
                <Link href={`/san-pham/${product.slug}`} className="hover:text-white">
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Công ty</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-muted">
            <li>
              <Link href="/ve-chung-toi" className="hover:text-white">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link href="/kien-thuc" className="hover:text-white">
                Kiến thức bảo hiểm
              </Link>
            </li>
            <li>
              <Link href="/lien-he" className="hover:text-white">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Liên hệ</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-muted">
            <li>Hotline: 1900 6868 (7:00 - 22:00)</li>
            <li>Email: hotro@insuregenneo.vn</li>
            <li>Tầng 18, Tòa nhà NEO Tower, Quận 1, TP.HCM</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-navy-border py-6">
        <Container className="flex flex-col gap-2 text-xs text-navy-muted md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} INSUREGEN NEO. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <Link href="/lien-he" className="hover:text-white">
              Điều khoản sử dụng
            </Link>
            <Link href="/lien-he" className="hover:text-white">
              Chính sách bảo mật
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

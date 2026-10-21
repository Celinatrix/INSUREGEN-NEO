# SECURITY_HEADERS Security Report

## Status: HIGH → PASS (đã sửa)

## Findings

Quét trước khi sửa: thiếu `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`; thiếu `Referrer-Policy`; tệp tĩnh thiếu `nosniff`; lộ `X-Powered-By: Next.js`. Không có `vercel.json` hay `headers()` nào trong `next.config.ts`.

Đã thêm:
- CSP theo nonce do `src/proxy.ts` tạo mỗi lượt tải: `script-src 'self' 'nonce-…' 'strict-dynamic'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `connect-src 'self'`, `frame-src 'none'`. `style-src` giữ `'unsafe-inline'` vì React render thuộc tính `style=""` (rủi ro thấp, được chấp nhận).
- Script giao diện sáng/tối trong `layout.tsx` gắn nonce.
- Mọi phản hồi (kể cả tệp tĩnh): HSTS `max-age=63072000; includeSubDomains`, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` tắt camera/micro/vị trí/thanh toán.
- API JSON: `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'`.
- `poweredByHeader: false`.

Đánh đổi: trang chuyển từ dựng sẵn (static) sang dựng theo từng request để có nonce mới mỗi lần. Với lượng truy cập của bản thi, chênh lệch tốc độ không đáng kể.
`preload` của HSTS không thêm: tên miền là `*.vercel.app` của Vercel, không phải của nhóm.

## What's at risk

Trước khi sửa: một lỗi XSS bất kỳ sẽ chạy script tùy ý; trang khác nhúng được trang vào iframe để lừa bấm (clickjacking).

## What's already secure

Không có script bên thứ ba; phông chữ tự host nên CSP chỉ cần `'self'`.

## Recommendations

Đã xử lý. Khi thêm Google Analytics hoặc dịch vụ ngoài, nhớ thêm tên miền vào CSP và truyền `nonce`.

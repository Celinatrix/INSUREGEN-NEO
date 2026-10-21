# DEPENDENCIES Security Report

## Status: CRITICAL → PASS (đã sửa)

## Findings

`npm audit --omit=dev` trước khi sửa:
- **next 16.3.4 — CRITICAL**: chạy mã từ xa trong `next/og` `ImageResponse` (GHSA-vcvr-r3jv-pc5j). Trang **có dùng** `ImageResponse` ở `src/app/[lang]/opengraph-image.tsx`. Kèm SSRF ở Image Optimization, cache poisoning, lộ thông tin ở route ảnh metadata.
- sharp < 0.35.5 — HIGH (librsvg).
- source-map-js ≤ 1.2.1 — HIGH (DoS).
Phiên bản dùng dấu `^` (trừ next/react).

## What's at risk

Trước khi sửa: kẻ tấn công có thể chạy mã trên máy chủ Vercel qua đường dẫn ảnh chia sẻ, đọc được biến môi trường (khóa Supabase service role).

## What's already secure

Có `package-lock.json`; các gói đều chính chủ, phổ biến trên npm.

## Recommendations

Nâng next và eslint-config-next lên 16.3.8 (bản vá cùng nhánh, ít rủi ro nhất); `npm audit fix` cho sharp, source-map-js; ghim phiên bản chính xác.

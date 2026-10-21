# DEPENDENCIES Fix Plan

## Changes

- `package.json`, `package-lock.json` — next 16.3.8, sharp 0.35.5, source-map-js 1.2.2, bỏ `^`

## Verification goals

- [x] `npm audit --omit=dev`: 0 lỗ hổng ✅
- [x] Build, 27/27 test, tsc, eslint đều qua ✅

## Manual verification (for the human)

- Còn 5 cảnh báo HIGH chỉ trong công cụ eslint (gói `braces`), không chạy trên trang. Theo dõi bản cập nhật eslint-config-next.

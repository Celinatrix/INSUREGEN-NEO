# FILE_UPLOADS Fix Plan

## Changes

- `src/lib/upload.ts` (mới) — `sniffImage()`
- `src/app/api/claims/extract/route.ts` — dùng loại ảnh theo byte đầu tệp, chặn sớm tệp lớn

## Verification goals

- [x] SVG đội lốt PNG bị từ chối ✅ (test)
- [x] Tệp > 5 MB trả 413

## Manual verification (for the human)

- Không có.

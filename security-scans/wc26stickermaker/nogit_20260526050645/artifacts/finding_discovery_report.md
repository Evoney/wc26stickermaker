# Finding Discovery Report

## Scope

Repository-wide review of the checked-out workspace, focused on authentication, client-side configuration exposure, dynamic SVG rendering, and export/share paths.

## Candidate Review Summary

1. Reviewed `vite.config.ts` and environment loading for accidental client-side secret exposure.
2. Reviewed `src/features/auth/*` for broken session gating or unsafe auth assumptions.
3. Reviewed `src/features/sticker/template.ts` and `StickerPreview.tsx` for SVG injection/XSS risk.
4. Reviewed `src/features/sticker/utils/export.ts` for unsafe file handling or unintended network/file access.

## Candidate Findings

No surviving plausible candidates after code hardening during the scan.

## Notes

- A pre-scan hardening issue existed: broad `envPrefix` exposure for `FIREBASE_*` values. It was remediated during the review by restricting the client bundle back to `VITE_FIREBASE_*`.
- Dynamic SVG content escapes user text and image URLs before insertion, so no XSS candidate survived discovery.

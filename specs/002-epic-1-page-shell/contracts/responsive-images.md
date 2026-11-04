# US4 Responsive Image Contract

The approved Story 1.4 spec controls this contract. No behavior model applies.

## Generator

`node scripts/build-images.mjs` / `npm run images:build` explicitly regenerates
local files. Importing the module performs no writes. Export
`buildImages(manifest, { root, outputRoot? })` for isolated fixture tests.
The default root is the repository; outputRoot defaults to public under root.
Validate the entire manifest and planned destinations before writing. Fail with
item/source/constraint diagnostics, including asset, format, width and byte limit
for oversized photos. Never silently omit a fallback. No remote sources or writes
outside the output root; reject unsafe paths and symlink escapes.

Each width target is capped to the source width, deduplicated and numerically
sorted. Files are `<base>-<width>.avif|webp|jpg`. Preserve source aspect ratio;
encode deterministic explicit quality/settings with pinned Sharp. Photo targets
are 320/640/960/1280. Hero budget is 250,000 bytes and every project candidate
including the capped largest 2x candidate is <=120,000 bytes. Other backgrounds
use the Hero ceiling. No original is modified.

White-logo PNG physical heights are capped source-wise and deduplicated across
roles: header32 32/64, header40 40/80, footer 24/48, Hero 200/241, band 40/80.
Files are `media/logo/kva-logo-white-<height>.png`. Preserve alpha. The dark original
is retained untouched. Provenance records role mappings and the unavailable full
2x Hero resolution, source and derivative hashes and encoder versions/settings.

## Content and Renderer

Typed metadata is `{ base, widths, width, height, alt }`, governed by
src/app/core/schemas/image.schema.json. Base is local, relative and extensionless.
ContentFacade alone imports production images.content.ts; components consume the
facade or receive metadata from their caller. Editorial alt is synchronized in
content/images.md. Empty decorative alt is valid; no project claims are invented.

`app-responsive-image` receives required `image` metadata, `sizes` (default 100vw),
and `priority` (default false) as signal inputs. It renders a picture with AVIF,
then WebP sources and a JPEG img fallback. Each has matching width-descriptor
srcset and sizes; img src is the largest JPEG, width/height are intrinsic,
alt is bound from content, decoding is async. Default loading is lazy and no high
fetch priority; priority mode is eager/high. No automatic preload or Hero layout.
The host/picture are block; image max-width 100%, width 100%, height auto. No fixed
crop, spacing or color is invented; any later decorative styling uses tokens.

## Verification

AC1: fixture and real inventory/byte equality across two runs, source hashes,
decoded formats/dimensions/alpha, all logo roles, no-upscale and byte ceilings.
AC2: missing/unsafe sources, malformed widths, duplicate destinations and explicit
oversize failures. AC3: schema negative cases, real files, facade ownership and
component default/priority rendering. AC4: no Sharp/schema/scripts in runtime;
build does not run generation or modify images; dev and Pages base-relative URLs,
AVIF/WebP/JPEG, desktop/mobile/320px, no-JS pictures, intrinsic layout stability,
metadata, CSP, hydration, SSG/state and unchanged shell. Temporary fixtures must
be removed. Archive accepted schema/data/layout under the paths in data-model.md.

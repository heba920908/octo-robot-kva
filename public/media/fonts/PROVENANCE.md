# Font Provenance

Google Fonts revision: `9862abc066c9b83bf84c3e8ed1fc2d8d48f9bbf0`.
Sources: https://github.com/google/fonts/tree/9862abc066c9b83bf84c3e8ed1fc2d8d48f9bbf0/ofl/quicksand
and https://github.com/google/fonts/tree/9862abc066c9b83bf84c3e8ed1fc2d8d48f9bbf0/ofl/outfit.
Original variable files: `Quicksand[wght].ttf`, `Outfit[wght].ttf`.
OFL notices are retained alongside these subsets. No runtime upstream request occurs.

The modified Quicksand subset is internally renamed to `KVA Titles` (`KVATitles`
in PostScript names) to respect the reserved font name. Original copyright and
license records are retained. `Quicksand` in CSS is only the project's font-face
alias, not the derivative's embedded family name. After subsetting, use fontTools
TTFont to replace Quicksand in name records other than attribution, license and
upstream metadata (IDs 0, 7-14), then save as WOFF2. Font metrics are unchanged.

Generated with fontTools 4.68.0 and Brotli: `fonttools varLib.instancer <source>
wght=300:600 --output <restricted.ttf>`, then `fonttools subset <restricted.ttf>
--flavor=woff2 --unicodes=<latin ranges> --output-file=<published.woff2>`.

Latin ranges: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191,
U+2193, U+2212, U+2215, U+FEFF, U+FFFD. Spanish n-tilde is included; Cyrillic
is excluded. Both published fvar tables have only wght, min 300/max 600.

| File                       | Bytes | SHA256                                                           |
| -------------------------- | ----: | ---------------------------------------------------------------- |
| quicksand-latin-wght.woff2 | 25756 | 4b42f2c6a559c64454426a9782596996bbebe7bc43e220c1b07436e537641f29 |
| outfit-latin-wght.woff2    | 28320 | c728e43eee5258594fcab153d4d28b1c7e3e84805185ae78ab45af6fb33ff990 |

## Measured Fallback Metrics

Named local face: Arial, confirmed available through FontFace local() in Chromium.
Canvas `measureText('x').actualBoundingBoxAscent` at `1000px Arial` is 531.25px,
so its normalized x-height is 0.53125. DejaVu Sans was initially measured on Linux
but rejected because it was not installed on the actual browser host.
Both target fonts have UPM 1000. Quicksand OS/2.sxHeight=503,
hhea=(1000,-250,0); Outfit sxHeight=470, hhea=(1000,-260,0).

Let r = (target x-height / target UPM) / (fallback x-height / fallback UPM).
CSS size-adjust = 100*r percent. Ascent/descent/line-gap overrides are
100*(target hhea metric / target UPM)/r percent (absolute descent).

| Face               | size-adjust | ascent-override | descent-override | line-gap-override |
| ------------------ | ----------: | --------------: | ---------------: | ----------------: |
| Quicksand Fallback |   94.68235% |      105.61630% |        26.40408% |                0% |
| Outfit Fallback    |   88.47059% |      113.03191% |        29.38830% |                0% |

The named local fallback tries Arial, then the metric-compatible Liberation Sans
commonly shipped on Linux. It is a static 400 face, allowing normal browser weight
synthesis rather than falsely advertising a variable axis. Adjustments above were
measured against Arial. If neither local face is installed, readable generic
sans-serif remains available, but its metrics are platform-dependent. Browser
checks with all local faces unavailable pass readability, reflow and CLS <=0.1;
future content still needs its own layout checks on supported platforms.
Font binaries and measurements are checked at generation; CSS and browser checks
cover swap, readability and layout stability. Explicit role line heights are retained.

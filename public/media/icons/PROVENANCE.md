# Icon Provenance

Source: Lucide revision `be09619c1c1124ad09c19fc3e87ee3b939409bbd`.
https://github.com/lucide-icons/lucide/tree/be09619c1c1124ad09c19fc3e87ee3b939409bbd/icons

The upstream ISC license and included Feather/MIT notices are retained in LICENSE.
These are Lucide-derived SVGs, not an icon font or remote runtime dependency.

| Registered name | Upstream SVG       |
| --------------- | ------------------ |
| menu            | menu.svg           |
| close           | x.svg              |
| arrow-left      | arrow-left.svg     |
| arrow-right     | arrow-right.svg    |
| copy            | copy.svg           |
| check           | check.svg          |
| phone           | phone.svg          |
| mail            | mail.svg           |
| chat            | message-circle.svg |
| chevron-down    | chevron-down.svg   |
| error           | circle-alert.svg   |

Normalization: parse as image/svg+xml, retain geometry, set root stroke-width=1.5
and stroke-linecap=square, serialize. Retain viewBox 0 0 24 24, 24px dimensions,
fill=none and stroke=currentColor. No titles or labels are added: glyphs are
decorative, and consuming controls own accessible names. Registry tests parse
every actual published SVG and verify geometry, caching and path resolution.

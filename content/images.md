# Image Content

Editorial image metadata is implemented in src/app/core/content/images.content.ts
and exposed only by ContentFacade. Each entry has a local extensionless base,
sorted candidate widths, original intrinsic width/height and content-owned alt.
The original dimensions remain the aspect-ratio source, not a promise of larger
available resolution. Candidate widths are 320/640/960/1280 capped to each source.

The following descriptions are visual descriptions, not claims about clients,
location, date, work performed or project outcomes. Backgrounds are decorative;
an informative future use must explicitly review its alt in this document and
the typed content together. Do not copy filenames into accessible names.

| ID                                              | Alt                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `cable-tray-technician`                         | (decorative)                                                                    |
| `cover-blueprint-tools`                         | (decorative)                                                                    |
| `electrical-panel-technician`                   | (decorative)                                                                    |
| `helmet-technician`                             | (decorative)                                                                    |
| `wiring-technician`                             | (decorative)                                                                    |
| `acometidas-media-baja-tension-01`              | Conductores rojos y negros conectados en un tablero eléctrico abierto.          |
| `acometidas-media-baja-tension-02`              | Gabinete eléctrico abierto con interruptores y mandos de operación.             |
| `canalizacion-cableado-alimentadores-01`        | Charolas portacables instaladas a lo largo de un muro interior.                 |
| `canalizacion-cableado-alimentadores-02`        | Charolas metálicas sobre equipos y gabinetes eléctricos.                        |
| `canalizacion-cableado-alimentadores-03`        | Técnico con casco bajo una red de charolas metálicas suspendidas.               |
| `canalizacion-cableado-alimentadores-04`        | Cables negros sujetos y conectados a barras dentro de un tablero.               |
| `canalizacion-cableado-alimentadores-05`        | Conductores negros agrupados a la entrada de un gabinete eléctrico.             |
| `canalizacion-cableado-industrial-comercial-01` | Tres conductores con terminales conectados a equipos eléctricos.                |
| `canalizacion-cableado-industrial-comercial-02` | Tuberías y cables de colores ordenados en una instalación suspendida.           |
| `canalizacion-cableado-industrial-comercial-03` | Fila de gabinetes eléctricos grises en un cuarto de equipos.                    |
| `canalizacion-cableado-industrial-comercial-04` | Gabinetes eléctricos y canalizaciones instalados sobre un muro blanco.          |
| `larousse-01`                                   | Sala de juntas con mesas, sillas y plafón de paneles de colores.                |
| `larousse-02`                                   | Área interior con sillones blancos y una pantalla en el muro.                   |
| `maniobras-equipos-electricos-01`               | Secuencia de maniobras con grúa y un equipo eléctrico de gran tamaño.           |
| `mantenimiento-equipos-01`                      | Transformador y fotografías de revisión de conexiones y componentes eléctricos. |
| `red-ambiental-01`                              | Área de convivencia con barra, bancos y luminarias colgantes.                   |
| `red-ambiental-02`                              | Oficina abierta con estaciones de trabajo y tuberías visibles en el techo.      |
| `sistema-tierras-pararrayos-01`                 | Carrete de conductor y conexiones dentro de un registro circular en el suelo.   |
| `site-paralelo-redundante-farmaceutica-01`      | Tres gabinetes grises con canalizaciones verticales sobre un muro.              |
| `site-paralelo-redundante-farmaceutica-02`      | Cuarto con equipos eléctricos, gabinetes y luminarias de techo.                 |

## Source and Permission Provenance

All originals were supplied as the kVA brochure assets under assets/media/brochure.
That supplied provenance does not establish additional rights or publication
permissions; the content owner must confirm these before publication. No external
photo service or new stock-photo source is used. Retain the dark logo untouched.
public/media/PROVENANCE.md records source and derivative SHA-256, encoder versions,
explicit settings and white-logo role mappings. The 740x556 Hero source and
459x241 white logo cannot supply a full-resolution large 2x Hero.

Regenerate only with `npm run images:build`. Review originals, alt, manifest,
typed dimensions, decoded derivatives, provenance and permissions together.
Application builds and CI consume reviewed files; they never regenerate them.

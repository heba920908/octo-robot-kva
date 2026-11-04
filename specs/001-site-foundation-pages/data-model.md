# Data Model: Site Foundation

## Site content

Editorial source: `content/site.md`. Executable content: `src/app/core/content/site.content.ts`.
Schema: `src/app/core/schemas/site.schema.json`.

| Field          | Rules                                          |
| -------------- | ---------------------------------------------- |
| `id`           | Constant `site`                                |
| `language`     | Constant `es-MX`                               |
| `brandName`    | Constant `kVA Instalaciones`                   |
| `pageTitle`    | Non-empty, at most 70 characters               |
| `heading`      | Non-empty, at most 60 characters               |
| `description`  | Non-empty, at most 160 characters              |
| `canonicalUrl` | HTTPS URI                                      |
| `iconPath`     | Relative path under `media/`, ending in `.png` |

The object is readonly. Unknown fields are rejected.

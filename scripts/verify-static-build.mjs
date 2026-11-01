import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { create } from 'fontkit';
import { sourceFiles, readText, validationLeaks } from './content-checks.mjs';

const outputDir = 'dist/agency-portfolio';
const indexPath = join(outputDir, 'browser', 'index.html');
const failures = [];

failures.push(
  ...validationLeaks({
    sources: Object.fromEntries(
      sourceFiles('src')
        .filter((file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'))
        .map((file) => [file, readText(file)]),
    ),
    artifacts: existsSync(outputDir)
      ? Object.fromEntries(
          sourceFiles(outputDir)
            .filter((file) => /\.(?:js|json|map|html)$/.test(file))
            .map((file) => [file, readText(file)]),
        )
      : {},
  }),
);

function check(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

check(existsSync(indexPath), `Missing prerendered page: ${indexPath}`);
check(!existsSync(join(outputDir, 'server')), 'Static output must not include a server bundle');

if (existsSync('package.json')) {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  check(!pkg.dependencies?.sharp, 'Sharp must remain development-only');
  check(pkg.devDependencies?.sharp === '0.35.5', 'Sharp encoder must stay pinned at 0.35.5');
  for (const [name, command] of Object.entries(pkg.scripts ?? {})) {
    if (name !== 'images:build') {
      check(!/images:build|build-images/.test(command), `${name} must not generate images`);
    }
  }
}

for (const name of ['quicksand', 'outfit']) {
  const fontPath = join(outputDir, 'browser', 'media', 'fonts', `${name}-latin-wght.woff2`);
  try {
    const font = create(readFileSync(fontPath));
    check(
      font.glyphForCodePoint(0x00f1).path.commands.length > 0,
      `${name}: missing Spanish glyph`,
    );
    check(
      font.variationAxes.wght?.min === 300 && font.variationAxes.wght?.max === 600,
      `${name}: expected variable weights 300-600`,
    );
  } catch (error) {
    check(false, `Missing or invalid font ${fontPath}: ${error.message}`);
  }
}

if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf8');
  const cspMatch = html.match(
    /<meta[^>]+http-equiv="Content-Security-Policy"[^>]+content="([^"]+)"/i,
  );
  const csp = cspMatch?.[1] ?? '';
  const requiredDirectives = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
  ];
  const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(
    ([, attributes, body]) =>
      !/\bsrc=/i.test(attributes) &&
      !/type="application\/(?:ld\+)?json"/i.test(attributes) &&
      body.trim().length > 0,
  );
  const externalResources = [
    ...html.matchAll(/<(?:script|link|img|source)\b[^>]*(?:src|href|srcset)="(https?:[^"]+)"/gi),
  ].map(([, url]) => url);

  check(/<html[^>]+lang="es-MX"/i.test(html), 'Document language must be es-MX');
  check(/<base href="\/octo-robot-kva\/">/i.test(html), 'Base href must be /octo-robot-kva/');
  check(/<title>kVA Instalaciones \|[^<]+<\/title>/i.test(html), 'Prerendered title is missing');
  check((html.match(/<h1\b/gi) ?? []).length === 1, 'Page must contain exactly one h1');
  check(html.includes('kVA Instalaciones'), 'Brand name must be prerendered');
  check(/<footer\b/i.test(html), 'Footer must be prerendered');
  const contactSection =
    html.match(/<section[^>]+id="contacto"[^>]*>[\s\S]*?<\/section>/i)?.[0] ?? '';
  check(contactSection.length > 0, 'Contact section #contacto must be prerendered');
  check(
    /<h2[^>]*id="contacto-title"[^>]*>Contacto<\/h2>/i.test(contactSection),
    'Contact section h2 title must be prerendered in #contacto',
  );
  check(
    /<img[^>]+class="[^"]*contact-logo[^"]*"/i.test(contactSection),
    'Contact logo must be prerendered in #contacto',
  );
  check(
    /<h3[^>]*>Ing\. Alfredo Hernández<\/h3>/i.test(contactSection),
    'Contact name h3 must be prerendered in #contacto',
  );
  check(
    /<button[^>]+class="[^"]*copy-button[^"]*"[^>]+hidden/i.test(contactSection) ||
      /<button[^>]+hidden[^>]+class="[^"]*copy-button[^"]*"/i.test(contactSection),
    'Copy button in #contacto must be hidden in prerendered static HTML',
  );
  check(
    /<a[^>]+class="[^"]*contact-cta[^"]*"[^>]+href="mailto:proyectos1@kvainstalaciones\.mx\?subject=%5Bkvainstalaciones\.mx%5D%20Contacto"/i.test(
      contactSection,
    ) ||
      /<a[^>]+href="mailto:proyectos1@kvainstalaciones\.mx\?subject=%5Bkvainstalaciones\.mx%5D%20Contacto"[^>]+class="[^"]*contact-cta[^"]*"/i.test(
        contactSection,
      ),
    'Contact CTA link must be prerendered in #contacto',
  );
  check(/<section[^>]+id="aviso"/i.test(html), 'Privacy notice section #aviso must be prerendered');
  check(/<a[^>]+href="#aviso"/i.test(html), 'Footer must link to #aviso');
  check(
    /<a[^>]+href="mailto:proyectos1@kvainstalaciones\.mx\?subject=%5Bkvainstalaciones\.mx%5D%20Contacto"/i.test(
      html,
    ),
    'Tagged direct mailto link must be prerendered',
  );
  check(/<a[^>]+href="tel:\+525640003344"/i.test(html), 'Phone link must be prerendered');
  check(!/proyectos2@|4029/i.test(html), 'Second contact channel must not be published');
  check(/<link[^>]+rel="icon"[^>]+href="media\/kva-icon\.png"/i.test(html), 'kVA icon is missing');
  check(existsSync(join(outputDir, 'browser', 'media', 'kva-icon.png')), 'Icon file is missing');
  check(
    /<app-root\b[^>]*\bng-server-context="ssg"/i.test(html),
    'App root must be prerendered for hydration',
  );
  check(
    /<script id="ng-state" type="application\/json">/i.test(html),
    'Hydration state block is missing',
  );
  requiredDirectives.forEach((directive) =>
    check(csp.includes(directive), `CSP is missing: ${directive}`),
  );
  check(inlineScripts.length === 0, 'Executable inline scripts are not allowed');
  check(
    externalResources.length === 0,
    `External resources found: ${externalResources.join(', ')}`,
  );
}

if (failures.length > 0) {
  console.error(`Static build verification failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Static build verification passed.');

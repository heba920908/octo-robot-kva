import {
  checkTemplate,
  checkSource,
  scanContentProject,
  validationLeaks,
  runStaticVerificationFixture,
} from '../../../../scripts/content-checks.mjs';

describe('template content guard (AC4)', () => {
  it.each([
    ' \n <span> {{ content.label }} </span>',
    '<img [alt]="content.alt" [title]="content.title"><input [placeholder]="content.hint" [attr.aria-label]="content.label">',
    '@if (ready) { @for (item of items; track item.id) { <p>{{ item.text }}</p> } } @else { {{ content.empty }} }',
    '@switch (mode) { @case (1) { {{ content.one }} } @default { {{ content.other }} } }',
    '<ng-template><button aria-label="{{ content.label }}">{{ content.label }}</button></ng-template>',
    "<button [attr.aria-label]=\"content.format('menu')\">{{ content.format('menu') }}</button>",
    '<img [alt]="\'\'">',
  ])('allows whitespace and bindings: %s', (template) => {
    expect(checkTemplate(template, 'fixture.html')).toEqual([]);
  });

  it.each([
    ['<p>Texto fijo</p>', 'Texto fijo'],
    ['<p>Hola {{ content.name }}</p>', 'Hola'],
    ['@if (ready) { <p>Fijo</p> }', 'Fijo'],
    ['@for (item of items; track item.id) { {{ item.label }} } @empty { Vacío }', 'Vacío'],
    ['@switch (mode) { @case (1) { Fijo } }', 'Fijo'],
    ['<ng-template><span>Oculto</span></ng-template>', 'Oculto'],
    ['<button aria-label="Abrir"></button>', 'aria-label'],
    ['<img alt="Foto">', 'alt'],
    ['<span title="Detalle"></span>', 'title'],
    ['<input placeholder="Correo">', 'placeholder'],
    ['<input title="Foto {{ content.index }}">', 'Foto'],
    ['{count, plural, =0 {Ninguno} other {Varios}}', 'Ninguno'],
    ['{kind, select, company {Empresa} other {Persona}}', 'Empresa'],
    ["<p>{{ 'Texto fijo' }}</p>", 'Texto fijo'],
    ['<button [attr.aria-label]="\'Abrir\'"></button>', 'Abrir'],
    ["<p>{{ ready ? content.label : 'Fijo' }}</p>", 'Fijo'],
    ["<p>{{ content.label + ' fijo' }}</p>", 'fijo'],
  ])('rejects literals with file and offending text: %s', (template, text) => {
    const errors = checkTemplate(template, 'fixture.html');
    expect(errors.join('\n')).toContain('fixture.html');
    expect(errors.join('\n')).toContain(text);
  });

  it('fails closed on template parse errors', () => {
    expect(checkTemplate('@if (ready) { <div>', 'broken.html').join('\n')).toMatch(
      /broken.html.*parse/i,
    );
  });

  it('allows ICU branches whose text comes only from bindings', () => {
    expect(
      checkTemplate(
        '{count, plural, =0 {{{ content.empty }}} other {{{ content.many }}}}',
        'icu.html',
      ),
    ).toEqual([]);
  });

  it('checks inline and external Component templates structurally, not comments', () => {
    const prefix = 'import { Component as View } from "@angular/core";';
    expect(
      checkSource(`${prefix}@View({template: '<p>Fijo</p>'}) class Demo {}`, 'inline.ts').join(
        '\n',
      ),
    ).toContain('Fijo');
    expect(
      checkSource(
        `${prefix}@View({templateUrl: './demo.html'}) class Demo {}`,
        'external.ts',
        () => '<p>Externo</p>',
      ).join('\n'),
    ).toContain('Externo');
    expect(
      checkSource(
        `${prefix}@View({template: '<p>{{ content.label }}</p>'}) class Demo {}`,
        'inline.ts',
      ),
    ).toEqual([]);
    expect(checkSource('// @Component({template: "literal"})', 'comment.ts')).toEqual([]);
    expect(
      checkSource(`${prefix}@View({template: computed}) class Demo {}`, 'dynamic.ts').join('\n'),
    ).toMatch(/dynamic.ts.*static/i);
    expect(
      checkSource(
        `${prefix}@View({templateUrl: './missing.html'}) class Demo {}`,
        'missing.ts',
        () => {
          throw new Error('missing');
        },
      ).join('\n'),
    ).toContain('missing');
    expect(
      checkSource(
        'import * as ng from "@angular/core"; @ng.Component({template: "Fijo"}) class Demo {}',
        'namespace.ts',
      ).join('\n'),
    ).toContain('Fijo');
  });

  it('rejects production raw-content bypasses, including re-exports and dynamic imports', () => {
    for (const source of [
      'import { siteContent } from "./core/content/site.content";',
      'export { siteContent } from "./core/content/site.content";',
      'const content = import("./core/content/ui-strings.content");',
      'const content = require("./core/content/site.content");',
    ]) {
      expect(checkSource(source, 'src/app/bypass.ts').join('\n')).toMatch(/bypass.ts.*facade/i);
    }
    expect(
      checkSource(
        'import { siteContent } from "./site.content";',
        'src/app/core/content/content-facade.ts',
      ),
    ).toEqual([]);
    expect(
      checkSource(
        'import { siteContent } from "./site.content";',
        'src/app/core/content/fixture.spec.ts',
      ),
    ).toEqual([]);
    expect(
      checkSource(
        'import type { UiStringKey } from "./core/content/ui-strings.content";',
        'src/app/types.ts',
      ),
    ).toEqual([]);
  });

  it('fails closed on shorthand/computed template metadata and malformed TypeScript', () => {
    const prefix = 'import { Component } from "@angular/core";';
    for (const metadata of ['{template}', '{templateUrl}', '{[key]: value}', '{...metadata}']) {
      expect(
        checkSource(`${prefix}@Component(${metadata}) class Demo {}`, 'dynamic.ts').join('\n'),
      ).toMatch(/dynamic.ts.*static/i);
    }
    expect(
      checkSource(`${prefix}@Component({['template']: 'Fijo'}) class Demo {}`, 'computed.ts').join(
        '\n',
      ),
    ).toContain('Fijo');
    expect(checkSource('export class {', 'broken.ts').join('\n')).toMatch(/broken.ts.*parse/i);
  });

  it('checks every real production source and component template', () => {
    expect(scanContentProject()).toEqual([]);
  });
});

describe('production validation exclusion (AC5)', () => {
  it.each([
    'ajv',
    'ajv/dist/2020',
    'ajv-formats',
    './schemas/ui-strings.schema.json',
    'sharp',
    '@img/sharp-linux-x64',
    '../../../../scripts/build-images.mjs',
    '../../../../scripts/images.manifest.json',
  ])('rejects runtime graph leakage: %s', (dependency) => {
    expect(
      validationLeaks({ sources: { 'src/main.ts': `import value from '${dependency}';` } }).join(
        '\n',
      ),
    ).toContain(dependency);
  });

  it.each([
    'ajv-formats',
    'node_modules/ajv/dist/2020',
    'https://json-schema.org/draft/2020-12/schema',
    'ui-strings.schema.json',
    'validateFormats',
    'node_modules/sharp/lib/index.js',
    'node_modules/@img/sharp-linux-x64',
    'build-images.mjs',
    'images.manifest.json',
    'libvips',
  ])('rejects emitted validation code: %s', (marker) => {
    expect(validationLeaks({ artifacts: { 'browser/main.js': marker } }).join('\n')).toContain(
      'browser/main.js',
    );
  });

  it('permits ordinary production code and ignores unreachable tests', () => {
    expect(
      validationLeaks({
        sources: {
          'src/main.ts': 'import "./app/app";',
          'src/app/app.ts': 'export class App {}',
          'src/app/test.spec.ts': 'import "ajv";',
        },
        artifacts: { 'browser/main.js': 'console.log("kVA");' },
      }),
    ).toEqual([]);
  });

  it('follows indirect runtime imports to validation code', () => {
    expect(
      validationLeaks({
        sources: { 'src/main.ts': 'import "./helper";', 'src/helper.ts': 'import "ajv";' },
      }).join('\n'),
    ).toContain('src/helper.ts');
  });

  it('permits erased named type imports without weakening value imports', () => {
    expect(
      validationLeaks({
        sources: { 'src/main.ts': 'import { type ValidateFunction } from "ajv";' },
      }),
    ).toEqual([]);
    expect(
      validationLeaks({
        sources: { 'src/main.ts': 'import Ajv, { type ValidateFunction } from "ajv";' },
      }),
    ).not.toEqual([]);
  });

  it('runs the actual static verifier against clean and contaminated output', () => {
    const clean = runStaticVerificationFixture();
    expect(clean.status, clean.output).toBe(0);
    const contaminated = runStaticVerificationFixture('validateFormats');
    expect(contaminated.status, contaminated.output).toBe(1);
    expect(contaminated.output).toContain('emitted validation code or content schema');
  });

  it('rejects a real static-verifier output contaminated by the image encoder', () => {
    const contaminated = runStaticVerificationFixture('node_modules/sharp/lib/index.js');
    expect(contaminated.status, contaminated.output).toBe(1);
    expect(contaminated.output).toContain('emitted validation code or content schema');
  });

  it.each([
    [
      'the Hero image preload',
      (html: string) => html.replace(/<link rel="preload"[^>]*>/, ''),
      'Hero image preload link is missing',
    ],
    [
      'the Hero primary CTA',
      (html: string) => html.replace('<a href="#contacto">', '<a href="#x">'),
      'Hero primary CTA must link to #contacto',
    ],
    [
      'the Hero section',
      (html: string) => html.replace('<section id="inicio">', '<section id="hero">'),
      'Hero section #inicio must be prerendered',
    ],
    [
      'the skip link',
      (html: string) =>
        html.replace('<a class="skip-link" href="#main">', '<a class="skip-link" href="#x">'),
      'skip link to #main must be the first focusable',
    ],
    [
      'the skip link as the first focusable element',
      (html: string) => html.replace('<app-skip-link>', '<a href="#other">x</a><app-skip-link>'),
      'skip link to #main must be the first focusable',
    ],
    [
      'the header',
      (html: string) => html.replace(/<app-header>[\s\S]*?<\/app-header>/, ''),
      'Sticky header must be prerendered',
    ],
    [
      'the header logo link to #inicio',
      (html: string) => html.replace('href="#inicio" aria-label', 'href="#x" aria-label'),
      'Header logo link must target #inicio',
    ],
    [
      'the header logo accessible name',
      (html: string) => html.replace('aria-label="kVA Instalaciones"', 'aria-label="Otro"'),
      'Header logo link must target #inicio',
    ],
    [
      'the header CTA to #contacto',
      (html: string) =>
        html.replace('class="header-cta" href="#contacto"', 'class="header-cta" href="#x"'),
      'Header CTA must link to #contacto',
    ],
    [
      'a header link to a missing section',
      (html: string) => html.replace('</header>', '<a href="#servicios">s</a></header>'),
      'Header must not link to #servicios',
    ],
    [
      'the main focus target',
      (html: string) => html.replace('<main id="main" tabindex="-1">', '<main id="main">'),
      'main#main must be prerendered with tabindex="-1"',
    ],
    [
      'a dangling #servicios CTA',
      (html: string) => html.replace('<a href="#contacto">', '<a href="#servicios">'),
      'No CTA may point at #servicios',
    ],
  ])('rejects static output without %s', (_name, mutate, message) => {
    const result = runStaticVerificationFixture('', mutate);
    expect(result.status, result.output).toBe(1);
    expect(result.output).toContain(message);
  });
});

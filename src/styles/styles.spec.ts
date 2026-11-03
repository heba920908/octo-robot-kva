async function readStyles() {
  const moduleName = 'node:fs/promises';
  const fs: {
    readFile(path: string, encoding: string): Promise<string>;
    readdir(path: string, options: { recursive: true }): Promise<string[]>;
  } = await import(/* @vite-ignore */ moduleName);
  const paths = (await fs.readdir('src', { recursive: true }))
    .filter((path) => path.endsWith('.scss'))
    .map((path) => `src/${path}`);
  return new Map(
    await Promise.all(paths.map(async (path) => [path, await fs.readFile(path, 'utf8')] as const)),
  );
}

const violations = (style: string) => {
  const content = style.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
  const found: string[] =
    content.match(
      /\.(?:mat|mdc)-[\w-]+|\[\s*class\s*[*^$~|]?=[^\]]*\b(?:mat|mdc)-[^\]]*\]|#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lch|lab|color)\(|\b\d+(?:\.\d+)?(?:px|rem|em)\b|:\s*(?:white|black|red|blue|green|transparent)\b/gi,
    ) ?? [];
  const colorProbe = document.createElement('span').style;
  for (const match of content.matchAll(
    /(?:^|[;{(,\n])\s*[\w-]+\s*:\s*([a-z]+)\s*(?:!important\s*)?(?=[;,)\n}])/gim,
  )) {
    colorProbe.color = '';
    colorProbe.color = match[1];
    if (colorProbe.color && match[1].toLowerCase() !== 'currentcolor') found.push(match[0]);
  }
  return found;
};

describe('global token and Material styles', () => {
  it('rejects private selectors, literal colors and spacing, including injected violations', async () => {
    for (const [path, content] of await readStyles()) {
      if (path === 'src/styles/_tokens.scss') continue;
      const guarded =
        path === 'src/styles.scss'
          ? content
              .replace(/@media \(width < (?:768|330)px\)/g, '')
              .replace(/@media \(width >= (?:768|1024)px\)/g, '')
              .replace('clamp(26px, 8.5vw, 32px)', '')
          : content;
      expect(violations(guarded), path).toEqual([]);
    }
    for (const invalid of [
      '.mat-button {}',
      '.mdc-dialog {}',
      'color: #fff;',
      'color: rgb(1,2,3);',
      'color: white;',
      'color: papayawhip;',
      'color: papayawhip !important;',
      'color: oklab(50% 0.1 0.1);',
      '[class="mat-mdc-button"] { display: block; }',
      'padding: 4px;',
    ]) {
      expect(violations(invalid).length, invalid).toBeGreaterThan(0);
    }
  });

  it('loads generated tokens before the supported theme and uses token-based page typography', async () => {
    const styles = await readStyles();
    const global = styles.get('src/styles.scss') ?? '';
    expect(global).toMatch(/@use ['"]styles\/tokens['"];[\s\S]*@use ['"]styles\/theme['"];/);
    const body = global.match(/(?:^|\n)body\s*\{([^}]+)\}/)?.[1] ?? '';
    for (const token of [
      'color-ink',
      'color-paper',
      'typography-body-font-family',
      'typography-body-font-size',
      'typography-body-line-height',
    ]) {
      expect(body).toContain(`var(--kva-${token})`);
    }
    const heading = global.match(/(?:^|\n)h1\s*\{([^}]+)\}/)?.[1] ?? '';
    for (const property of ['font-family', 'font-size', 'font-weight', 'line-height']) {
      expect(heading).toContain(`${property}: var(--kva-typography-display-${property})`);
    }
    const theme = styles.get('src/styles/_theme.scss') ?? '';
    expect(theme).toContain("@use '@angular/material' as mat;");
    expect(theme).toContain('@include mat.theme(');
    expect(theme).toContain('@include mat.theme-overrides(');
    expect(theme).not.toMatch(/\b(?:neutral10|neutral-variant20):/);
    for (const token of [
      'rounded-none',
      'color-accent',
      'color-on-accent',
      'color-paper',
      'color-ink',
      'color-danger',
      'color-focus',
      'color-focus-on-light',
    ]) {
      expect(theme).toContain(`var(--kva-${token})`);
    }
    expect(theme).not.toMatch(/prebuilt-themes|https?:|@font-face/);
  });

  it('uses readable copper labels and an inherited nearest-surface focus color', async () => {
    const theme = (await readStyles()).get('src/styles/_theme.scss') ?? '';
    expect(theme).toContain('@include mat.button-overrides(');
    expect(theme).toContain('text-label-text-color: var(--kva-color-accent-strong)');
    expect(theme).toContain('outlined-label-text-color: var(--kva-color-accent-strong)');
    expect(theme).toContain('var(--kva-surface-focus-color, var(--kva-color-focus-on-light))');
    expect(theme).toMatch(
      /\[data-kva-surface='dark'\]\s*\{\s*--kva-surface-focus-color: var\(--kva-color-focus\)/,
    );
    expect(theme).toMatch(
      /\[data-kva-surface='light'\]\s*\{\s*--kva-surface-focus-color: var\(--kva-color-focus-on-light\)/,
    );
  });
});

async function readAsset(path: string) {
  const moduleName = 'node:fs/promises';
  const fs: { readFile(path: string, encoding: string): Promise<string> } = await import(
    /* @vite-ignore */ moduleName
  );
  return fs.readFile(path, 'utf8');
}

describe('US2 self-hosted fonts and typography', () => {
  it('ships local swap variable faces and measured fallback overrides', async () => {
    const fonts = await readAsset('src/styles/_fonts.scss');
    const faces = fonts.match(/@font-face\s*\{[^}]+\}/g) ?? [];
    expect(faces).toHaveLength(4);
    for (const [family, file] of [
      ['Quicksand', 'quicksand-latin-wght.woff2'],
      ['Outfit', 'outfit-latin-wght.woff2'],
    ]) {
      const face = faces.find((value) => value.includes(`font-family: '${family}';`)) ?? '';
      expect(face).toContain(`url('media/fonts/${file}')`);
      expect(face).toContain('font-weight: 300 600');
      expect(face).toContain('font-display: swap');
      const fallback = faces.find((value) => value.includes(`'${family} Fallback'`)) ?? '';
      for (const property of [
        'size-adjust',
        'ascent-override',
        'descent-override',
        'line-gap-override',
      ]) {
        expect(fallback).toMatch(new RegExp(`${property}: [\\d.]+%`));
      }
      expect(fallback).toContain("local('Arial')");
      expect(fallback).toContain("local('Liberation Sans')");
      expect(fallback).toContain('font-weight: 400');
      const binary = await readAsset(`public/media/fonts/${file}`);
      expect(binary.slice(0, 4)).toBe('wOF2');
    }
    expect(fonts).not.toMatch(/https?:|font-display:\s*block/);
    const theme = await readAsset('src/styles/_theme.scss');
    expect(theme).toContain("'Quicksand Fallback'");
    expect(theme).toContain("'Outfit Fallback'");
    expect(await readAsset('public/media/fonts/PROVENANCE.md')).toContain('size-adjust');
  });

  it('decodes both published fonts, verifies metadata and rejects truncated WOFF2 data', async () => {
    const fsModule = 'node:fs/promises';
    const fs: { readFile(path: string): Promise<Uint8Array> } = await import(
      /* @vite-ignore */ fsModule
    );
    const parserModule = 'fontkit';
    const fontkit: {
      create(data: Uint8Array): {
        familyName: string;
        variationAxes: Record<string, { min: number; max: number }>;
        characterSet: number[];
        glyphForCodePoint(code: number): { path: { commands: unknown[] } };
      };
    } = await import(/* @vite-ignore */ parserModule);
    const cryptoModule = 'node:crypto';
    const crypto: {
      createHash(algorithm: string): {
        update(data: Uint8Array): { digest(encoding: string): string };
      };
    } = await import(/* @vite-ignore */ cryptoModule);
    const provenance = await readAsset('public/media/fonts/PROVENANCE.md');
    for (const [file, family] of [
      ['quicksand-latin-wght.woff2', 'KVA Titles'],
      ['outfit-latin-wght.woff2', 'Outfit'],
    ]) {
      const binary = await fs.readFile(`public/media/fonts/${file}`);
      const font = fontkit.create(binary);
      expect(font.familyName).toContain(family);
      expect(Object.keys(font.variationAxes)).toEqual(['wght']);
      expect(font.variationAxes['wght'].min).toBe(300);
      expect(font.variationAxes['wght'].max).toBe(600);
      for (const code of [0x00e1, 0x00e9, 0x00ed, 0x00f1, 0x00f3, 0x00fa, 0x00fc]) {
        expect(font.characterSet).toContain(code);
        expect(font.glyphForCodePoint(code).path.commands.length).toBeGreaterThan(0);
      }
      expect(font.characterSet).not.toContain(0x0416);
      expect(provenance).toContain(crypto.createHash('sha256').update(binary).digest('hex'));
      expect(() => fontkit.create(binary.subarray(0, 4))).toThrow();
    }
  });

  it('preloads only Quicksand as a font, plus the Hero image, and resolves CSS and preload to the same asset at both bases', async () => {
    const html = await readAsset('src/index.html');
    const all = [...html.matchAll(/<link\b[^>]*rel="preload"[^>]*>/g)].map((match) => match[0]);
    const links = all.filter((link) => link.includes('as="font"'));
    expect(all.filter((link) => link.includes('as="image"'))).toHaveLength(1);
    expect(all).toHaveLength(2);
    expect(links).toHaveLength(1);
    expect(links[0]).toContain('href="media/fonts/quicksand-latin-wght.woff2"');
    expect(links[0]).toContain('as="font"');
    expect(links[0]).toContain('type="font/woff2"');
    expect(links[0]).toContain('crossorigin');
    for (const base of ['/', '/octo-robot-kva/']) {
      const page = new URL(base, 'https://example.test');
      expect(new URL('media/fonts/quicksand-latin-wght.woff2', page).pathname).toBe(
        `${base}media/fonts/quicksand-latin-wght.woff2`,
      );
    }
  });

  it('defines every token role, casing exception, wrap behavior and mobile weight boundary', async () => {
    const global = await readAsset('src/styles.scss');
    expect(global).toContain("@use 'styles/fonts';");
    expect(global).toContain("'Outfit Fallback'");
    expect(global).toContain("'Quicksand Fallback'");
    for (const role of [
      'display',
      'h1',
      'h2',
      'h3',
      'stat',
      'lead',
      'body',
      'small',
      'label',
      'field-label',
      'overline',
    ]) {
      expect(global).toContain(role);
    }
    expect(global).toMatch(/text-transform:\s*uppercase/);
    expect(global).toMatch(/\.kva-project-title\s*\{[^}]*text-transform:\s*none/);
    expect(global).toContain('overflow-wrap: anywhere');
    expect(global).toContain('hyphens: auto');
    expect(global).toContain('clamp(26px, 8.5vw, 32px)');
    expect(global).toContain('@media (width < 768px)');
    expect(global).toContain('@media (width < 330px)');
    expect(global).toContain('font-weight: 400');
  });

  it('defines shared page-shell rhythm variables and corner-rule motifs at 768px and 1024px (1.6-AC-01)', async () => {
    const global = await readAsset('src/styles.scss');
    expect(global).toContain('--kva-shell-margin: var(--kva-spacing-margin-mobile)');
    expect(global).toContain('--kva-shell-margin: var(--kva-spacing-margin-tablet)');
    expect(global).toContain('--kva-shell-margin: var(--kva-spacing-margin-desktop)');
    expect(global).toContain('--kva-shell-section-y: var(--kva-spacing-section-y)');
    expect(global).toContain('--kva-shell-section-y: var(--kva-spacing-section-y-lg)');
    expect(global).toContain('--kva-shell-columns: 4');
    expect(global).toContain('--kva-shell-columns: 12');
    expect(global).toContain('@media (width >= 768px)');
    expect(global).toContain('@media (width >= 1024px)');
    expect(global).toContain('.kva-section-heading');
    expect(global).toContain('.kva-corner-rule');
    expect(global).toContain('.kva-corner-rule--mirrored');
  });
});

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
      if (path !== 'src/styles/_tokens.scss') expect(violations(content), path).toEqual([]);
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

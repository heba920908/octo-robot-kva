export async function verifyTypography(page) {
  const results = [];
  const failures = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };

  await page.reload();
  for (const family of ['Quicksand', 'Outfit']) {
    const status = await page.evaluate(async (name) => {
      const faces = await document.fonts.load(`400 32px "${name}"`, 'México, comunicación, ñ');
      return faces.length > 0 && faces.every((face) => face.status === 'loaded');
    }, family);
    check(status, `${family} did not decode and load`);
  }

  for (const width of [320, 329, 330, 360, 767, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const result = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      const style = getComputedStyle(heading);
      const root = getComputedStyle(document.documentElement);
      const tokenSize = parseFloat(root.getPropertyValue('--kva-typography-display-font-size'));
      const tokenWeight = root.getPropertyValue('--kva-typography-display-font-weight').trim();
      const expectedSize =
        innerWidth < 768 ? Math.min(32, Math.max(26, innerWidth * 0.085)) : tokenSize;
      const roles = [
        'display',
        'h1',
        'h2',
        'h3',
        'stat',
        'overline',
        'lead',
        'body',
        'small',
        'label',
        'field-label',
      ];
      const fixture = document.createElement('div');
      fixture.setAttribute('aria-hidden', 'true');
      document.body.append(fixture);
      const samples = roles.map((role) => {
        const element = document.createElement('p');
        element.className = `kva-type-${role}`;
        element.textContent = 'Instalaciones eléctricas en México';
        fixture.append(element);
        const computed = getComputedStyle(element);
        return {
          role,
          family: computed.fontFamily,
          size: parseFloat(computed.fontSize),
          weight: Number(computed.fontWeight),
          casing: computed.textTransform,
        };
      });
      const project = document.createElement('h2');
      project.className = 'kva-project-title';
      fixture.append(project);
      const projectCase = getComputedStyle(project).textTransform;
      fixture.remove();
      return {
        width: innerWidth,
        size: parseFloat(style.fontSize),
        weight: Number(style.fontWeight),
        expectedSize,
        expectedWeight: expectedSize < 28 ? 400 : Number(tokenWeight),
        overflow: document.documentElement.scrollWidth > innerWidth,
        samples,
        projectCase,
      };
    });
    check(Math.abs(result.size - result.expectedSize) < 0.02, `${width}: heading size`);
    check(result.weight === result.expectedWeight, `${width}: actual h1 weight`);
    check(!result.overflow, `${width}: horizontal overflow`);
    check(result.projectCase === 'none', `${width}: project title casing`);
    for (const sample of result.samples) {
      const title = ['display', 'h1', 'h2', 'h3', 'stat', 'overline'].includes(sample.role);
      check(
        sample.family.includes(title ? 'Quicksand' : 'Outfit'),
        `${width}: ${sample.role} family`,
      );
      check(sample.size >= 28 || sample.weight >= 400, `${width}: ${sample.role} weight floor`);
      check(
        sample.casing === (title || sample.role === 'label' ? 'uppercase' : 'none'),
        `${width}: ${sample.role} casing`,
      );
    }
    results.push(result);
  }

  const resources = await page.evaluate(() => {
    const fonts = performance
      .getEntriesByType('resource')
      .filter((entry) => entry.name.includes('.woff2'));
    const preload = document.querySelector('link[rel="preload"][as="font"]');
    return {
      fonts: fonts.map((entry) => entry.name),
      preload: preload?.href,
      origin: location.origin,
      base: document.baseURI,
      expected: ['quicksand', 'outfit'].map(
        (family) => new URL(`media/fonts/${family}-latin-wght.woff2`, document.baseURI).href,
      ),
      sameOrigin: fonts.every((entry) => new URL(entry.name).origin === location.origin),
    };
  });
  check(resources.fonts.length === 2, 'Expected one request per font');
  check(resources.fonts.includes(resources.preload), 'Quicksand preload was not reused');
  for (const expected of resources.expected) {
    check(resources.fonts.includes(expected), `${expected}: deployment-relative URL`);
  }
  check(resources.sameOrigin, 'Cross-origin font request');
  if (failures.length) throw new Error(failures.join('\n'));
  return { widths: results.map(({ width, size, weight }) => ({ width, size, weight })), resources };
}

export async function verifyFontFallbacks(page) {
  const url = page.url();
  const css = await page.evaluate(() =>
    [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText))
      .join('\n'),
  );
  const results = [];
  for (const mode of ['delayed', 'blocked', 'no-local']) {
    for (const width of [320, 1440]) {
      const context = await page
        .context()
        .browser()
        .newContext({ viewport: { width, height: 900 } });
      const test = await context.newPage();
      let release;
      const gate = new Promise((resolve) => {
        release = resolve;
      });
      try {
        if (mode === 'no-local') {
          const generic = css.replace(/local\([^)]*\)/g, 'local("KVA Missing Local Face")');
          await test.route('**/*.css', (route) =>
            route.fulfill({ status: 200, contentType: 'text/css', body: generic }),
          );
        }
        await test.route('**/*.woff2', async (route) => {
          if (mode === 'blocked') return route.abort('blockedbyclient');
          await gate;
          await route.continue();
        });
        await test.addInitScript(() => {
          globalThis.__kvaCls = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) globalThis.__kvaCls += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
        });
        await test.goto(url, { waitUntil: 'domcontentloaded' });
        await test.evaluate(
          () =>
            new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        );
        const before = await test.evaluate(() => ({
          visible: getComputedStyle(document.querySelector('h1')).visibility === 'visible',
          overflow: document.documentElement.scrollWidth > innerWidth,
          fallbacks: [...document.fonts]
            .filter((face) => face.family.includes('Fallback'))
            .map((face) => ({ family: face.family, status: face.status })),
        }));
        release();
        await test.evaluate(() => document.fonts.ready);
        await test.evaluate(
          () =>
            new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        );
        const after = await test.evaluate(() => ({
          cls: globalThis.__kvaCls,
          overflow: document.documentElement.scrollWidth > innerWidth,
        }));
        if (!before.visible || before.overflow || after.overflow || after.cls > 0.1) {
          throw new Error(`${mode} at ${width}px: ${JSON.stringify({ before, after })}`);
        }
        results.push({ mode, width, before, after });
      } finally {
        release();
        await context.close();
      }
    }
  }
  return results;
}

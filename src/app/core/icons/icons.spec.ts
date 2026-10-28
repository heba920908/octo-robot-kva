import { DOCUMENT } from '@angular/common';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationInitStatus, ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { appConfig } from '../../app.config';

const names = [
  'menu',
  'close',
  'arrow-left',
  'arrow-right',
  'copy',
  'check',
  'phone',
  'mail',
  'chat',
  'chevron-down',
  'error',
];

async function readSvg(name: string) {
  const moduleName = 'node:fs/promises';
  const fs: { readFile(path: string, encoding: string): Promise<string> } = await import(
    /* @vite-ignore */ moduleName
  );
  return fs.readFile(`public/media/icons/${name}.svg`, 'utf8');
}

@Component({
  imports: [MatIcon],
  template: '<mat-icon svgIcon="menu" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class IconFixture {}

describe.each(['/', '/octo-robot-kva/'])('US2 icon registry at %s', (basePath) => {
  let registry: MatIconRegistry;
  let http: HttpTestingController;
  let base: HTMLBaseElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [...appConfig.providers, provideHttpClientTesting()],
    });
    const document = TestBed.inject(DOCUMENT);
    base = document.createElement('base');
    base.href = basePath;
    document.head.prepend(base);
    const initialization = TestBed.inject(ApplicationInitStatus);
    await initialization.donePromise;
    registry = TestBed.inject(MatIconRegistry);
    http = TestBed.inject(HttpTestingController);
    http.expectNone(() => true);
  });

  afterEach(() => {
    http.verify();
    base.remove();
  });

  it.each(names)(
    'retrieves actual %s SVG with contracted geometry and caches clones',
    async (name) => {
      const first = firstValueFrom(registry.getNamedSvgIcon(name));
      const request = http.expectOne(`media/icons/${name}.svg`);
      expect(new URL(request.request.url, TestBed.inject(DOCUMENT).baseURI).pathname).toBe(
        `${basePath}media/icons/${name}.svg`,
      );
      const source = await readSvg(name);
      const asset = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
      expect(asset.getAttribute('width')).toBe('24');
      expect(asset.getAttribute('height')).toBe('24');
      request.flush(source);
      const svg = await first;
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg.getAttribute('fill')).toBe('none');
      expect(svg.getAttribute('stroke')).toBe('currentColor');
      expect(svg.getAttribute('stroke-width')).toBe('1.5');
      expect(svg.getAttribute('stroke-linecap')).toBe('square');
      expect(svg.querySelector('path, line, polyline, circle, rect')).not.toBeNull();
      expect(svg.querySelector('script, foreignObject, title')).toBeNull();
      const cached = await firstValueFrom(registry.getNamedSvgIcon(name));
      expect(cached).not.toBe(svg);
      http.expectNone(() => true);
    },
  );

  it('fails unknown names without a remote fallback request', async () => {
    await expect(firstValueFrom(registry.getNamedSvgIcon('unknown'))).rejects.toThrow();
    http.expectNone(() => true);
  });

  it('renders a decorative glyph without owning a control accessible name', async () => {
    const fixture = TestBed.createComponent(IconFixture);
    fixture.detectChanges();
    http.expectOne('media/icons/menu.svg').flush(await readSvg('menu'));
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('aria-label')).toBe(false);
    expect(icon.querySelector('svg')).not.toBeNull();
  });
});

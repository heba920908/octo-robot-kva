import { TestBed } from '@angular/core/testing';
import { ResponsiveImage } from './responsive-image';
import { ContentFacade } from '../../core/content/content-facade';

describe('ResponsiveImage (Story 1.4 AC3)', () => {
  async function render(priority = false) {
    const fixture = TestBed.createComponent(ResponsiveImage);
    fixture.componentRef.setInput('image', TestBed.inject(ContentFacade).images['larousse-01']);
    fixture.componentRef.setInput('sizes', '(min-width: 1024px) 50vw, 100vw');
    fixture.componentRef.setInput('priority', priority);
    await fixture.whenStable();
    return fixture;
  }

  it('renders AVIF then WebP and a JPEG fallback with matching srcsets/sizes', async () => {
    const fixture = await render();
    const host: HTMLElement = fixture.nativeElement;
    const sources = [...host.querySelectorAll('picture > source')];
    expect(sources.map((source) => source.getAttribute('type'))).toEqual([
      'image/avif',
      'image/webp',
    ]);
    for (const [index, extension] of ['avif', 'webp'].entries()) {
      expect(sources[index].getAttribute('srcset')).toBe(
        `media/projects/larousse-01-320.${extension} 320w, media/projects/larousse-01-638.${extension} 638w`,
      );
      expect(sources[index].getAttribute('sizes')).toBe('(min-width: 1024px) 50vw, 100vw');
    }
    const image = host.querySelector('picture > img')!;
    expect(image.getAttribute('src')).toBe('media/projects/larousse-01-638.jpg');
    expect(image.getAttribute('srcset')).toBe(
      'media/projects/larousse-01-320.jpg 320w, media/projects/larousse-01-638.jpg 638w',
    );
    expect(image.getAttribute('sizes')).toBe('(min-width: 1024px) 50vw, 100vw');
    expect(image.getAttribute('width')).toBe('638');
    expect(image.getAttribute('height')).toBe('837');
    expect(image.getAttribute('alt')).toBe(TestBed.inject(ContentFacade).images['larousse-01'].alt);
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.getAttribute('decoding')).toBe('async');
    expect(image.getAttribute('fetchpriority')).not.toBe('high');
    expect(host.querySelector('link')).toBeNull();
  });

  it('uses eager/high only in priority mode and updates with signal inputs', async () => {
    const fixture = await render(true);
    const image: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(image.getAttribute('loading')).toBe('eager');
    expect(image.getAttribute('fetchpriority')).toBe('high');
    fixture.componentRef.setInput('priority', false);
    fixture.componentRef.setInput(
      'image',
      TestBed.inject(ContentFacade).images['cover-blueprint-tools'],
    );
    await fixture.whenStable();
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.getAttribute('fetchpriority')).not.toBe('high');
    expect(image.getAttribute('alt')).toBe('');
    expect(image.getAttribute('width')).toBe('740');
    expect(image.getAttribute('height')).toBe('556');
    expect(image.getAttribute('src')).toBe('media/backgrounds/cover-blueprint-tools-740.jpg');
    const sources = [...fixture.nativeElement.querySelectorAll('source')] as HTMLSourceElement[];
    for (const [index, extension] of ['avif', 'webp'].entries()) {
      expect(sources[index].getAttribute('srcset')).toBe(
        [320, 640, 740]
          .map((width) => `media/backgrounds/cover-blueprint-tools-${width}.${extension} ${width}w`)
          .join(', '),
      );
    }
    expect(image.getAttribute('srcset')).toBe(
      [320, 640, 740]
        .map((width) => `media/backgrounds/cover-blueprint-tools-${width}.jpg ${width}w`)
        .join(', '),
    );
  });

  it('defaults sizes to 100vw', async () => {
    const fixture = TestBed.createComponent(ResponsiveImage);
    fixture.componentRef.setInput(
      'image',
      TestBed.inject(ContentFacade).images['cover-blueprint-tools'],
    );
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('img').getAttribute('sizes')).toBe('100vw');
  });
});

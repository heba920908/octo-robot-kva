import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { directContactLinks } from '../../behaviors/direct-contact-links.behavior';
import { ContentFacade } from '../../core/content/content-facade';
import { siteContent } from '../../core/content/site.content';
import { Footer } from './footer';

async function render(site: typeof siteContent | Record<string, unknown> = siteContent) {
  TestBed.overrideProvider(ContentFacade, {
    useFactory: () => Object.assign(new ContentFacade(), { site }),
  });
  const fixture = TestBed.createComponent(Footer);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('Footer (1.5-AC-03)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Footer] }).compileComponents();
  });

  it('renders the footer landmark with logo, identity, links, year and privacy link', async () => {
    const element = await render();
    const logo = element.querySelector('img') as HTMLImageElement;
    const text = element.textContent ?? '';

    expect(element.querySelector('footer')).not.toBeNull();
    expect(logo.getAttribute('src')).toBe('media/logo/kva-logo-white-24.png');
    expect(logo.getAttribute('srcset')).toBe(
      'media/logo/kva-logo-white-24.png 1x, media/logo/kva-logo-white-48.png 2x',
    );
    expect(logo.getAttribute('width')).toBe('46');
    expect(logo.getAttribute('height')).toBe('24');
    expect(logo.getAttribute('alt')).toBe('kVA Instalaciones');
    expect(text).toContain('kVA Instalaciones');
    expect(text).toContain('© 2026 kVA Instalaciones');
  });

  it('links the tagged email, the named phone and the in-page notice', async () => {
    const element = await render();
    const email = element.querySelector('a[href^="mailto:"]') as HTMLAnchorElement;
    const phone = element.querySelector('a[href^="tel:"]') as HTMLAnchorElement;
    const privacy = element.querySelector('a[href="#aviso"]') as HTMLAnchorElement;

    expect(email.getAttribute('href')).toBe(
      'mailto:proyectos1@kvainstalaciones.mx?subject=%5Bkvainstalaciones.mx%5D%20Contacto',
    );
    expect(email.textContent?.trim()).toBe('proyectos1@kvainstalaciones.mx');
    expect(phone.getAttribute('href')).toBe('tel:+525640003344');
    expect(phone.textContent?.trim()).toBe('(56) 4000 3344');
    expect(phone.getAttribute('aria-label')).toBe('Llamar al (56) 4000 3344');
    expect(privacy.textContent?.trim()).toBe('Aviso de privacidad');
    expect(element.querySelectorAll('a')).toHaveLength(3);
  });

  it('shows the stand-in or the supplied legal identity', async () => {
    const supplied = await render({
      ...siteContent,
      legalIdentity: 'kVA Instalaciones S.A. de C.V.',
    });

    expect(supplied.textContent).toContain('kVA Instalaciones S.A. de C.V.');
  });

  it('omits a missing phone without leaving a gap or a broken link', async () => {
    const element = await render({
      ...siteContent,
      contact: { email: siteContent.contact.email },
    });

    expect(element.querySelector('a[href^="tel:"]')).toBeNull();
    expect(element.querySelectorAll('li')).toHaveLength(1);
    expect(element.querySelectorAll('a')).toHaveLength(2);
  });

  it('never publishes a second channel or the contact name', async () => {
    const text = (await render()).innerHTML;

    expect(text).not.toMatch(/proyectos2@|4029/);
    expect(text).not.toContain('Alfredo');
  });

  it('keeps links native: activation is not prevented and the model emits no effects', async () => {
    const element = await render();
    const outcomes: boolean[] = [];
    const observe = (event: Event) => {
      outcomes.push(event.defaultPrevented);
      event.preventDefault();
    };
    document.addEventListener('click', observe);
    const before = element.innerHTML;
    for (const selector of ['a[href^="mailto:"]', 'a[href^="tel:"]']) {
      (element.querySelector(selector) as HTMLAnchorElement).click();
    }
    document.removeEventListener('click', observe);

    expect(outcomes).toEqual([false, false]);
    expect(element.innerHTML).toBe(before);
    for (const type of ['activate-email', 'activate-phone'] as const) {
      expect(directContactLinks.transition({ kind: 'idle' }, { type })?.effects).toEqual([]);
    }
  });

  it('sizes links and uses only tokens (>= 24px, no literal colors)', () => {
    const styles = readFileSync('src/app/features/footer/footer.scss', 'utf8');

    expect(styles).toMatch(/min-height:\s*var\(--kva-spacing-6\)/);
    expect(styles).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
});

import { DOCUMENT } from '@angular/common';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { appConfig } from '../../app.config';
import { copyAddress } from '../../behaviors/copy-address.behavior';
import { directContactLinks } from '../../behaviors/direct-contact-links.behavior';
import { ContentFacade } from '../../core/content/content-facade';
import { siteContent } from '../../core/content/site.content';
import {
  ANNOUNCEMENT_DELAY_MS,
  COPY_STATUS_HOLD_MS,
  EffectRunner,
} from '../../core/effects/effects';
import { Contact } from './contact';

function flushIcons(http: HttpTestingController) {
  for (const request of http.match((req) => req.url.startsWith('media/icons/'))) {
    const file = request.request.url.replace(/^.*media\/icons\//, 'public/media/icons/');
    request.flush(readFileSync(file, 'utf8'));
  }
}

async function renderContact(site: typeof siteContent | Record<string, unknown> = siteContent) {
  TestBed.overrideProvider(ContentFacade, {
    useFactory: () => Object.assign(new ContentFacade(), { site }),
  });
  const initialization = TestBed.inject(ApplicationInitStatus);
  await initialization.donePromise;
  const http = TestBed.inject(HttpTestingController);
  const fixture = TestBed.createComponent(Contact);
  fixture.detectChanges();
  flushIcons(http);
  await fixture.whenStable();
  fixture.detectChanges();
  flushIcons(http);
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    http,
  };
}

describe('Contact section (#contacto) (1.6-AC-02..06)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [...appConfig.providers, provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('prerenders #contacto over cable-tray-technician with logo, mirrored corner rule, h3 name, tagged links, and CTA (1.6-AC-02)', async () => {
    const { element } = await renderContact();
    const section = element.querySelector('section#contacto') as HTMLElement;
    const heading = section.querySelector('h2#contacto-title') as HTMLElement;
    const rule = section.querySelector('.kva-corner-rule--mirrored') as HTMLElement;
    const logo = section.querySelector('img.contact-logo') as HTMLImageElement;
    const name = section.querySelector('h3') as HTMLElement;
    const bgPictureImg = section.querySelector(
      'app-responsive-image picture img',
    ) as HTMLImageElement;
    const links = Array.from(section.querySelectorAll('a'));
    const emailLink = section.querySelector(
      '.channel-email a[href^="mailto:"]',
    ) as HTMLAnchorElement;
    const phoneLink = section.querySelector('a[href^="tel:"]') as HTMLAnchorElement;
    const ctaLink = section.querySelector('a.contact-cta') as HTMLAnchorElement;

    expect(section).not.toBeNull();
    expect(section.getAttribute('aria-labelledby')).toBe('contacto-title');
    expect(section.getAttribute('data-kva-surface')).toBe('dark');
    expect(bgPictureImg.getAttribute('src')).toBe(
      'media/backgrounds/cable-tray-technician-1115.jpg',
    );
    expect(bgPictureImg.getAttribute('alt')).toBe('');

    expect(logo.getAttribute('src')).toBe('media/logo/kva-logo-white-40.png');
    expect(logo.getAttribute('srcset')).toBe(
      'media/logo/kva-logo-white-40.png 1x, media/logo/kva-logo-white-80.png 2x',
    );
    expect(logo.getAttribute('width')).toBe('76');
    expect(logo.getAttribute('height')).toBe('40');
    expect(logo.getAttribute('alt')).toBe('');

    expect(heading.textContent?.trim()).toBe('Contacto');
    expect(heading.getAttribute('tabindex')).toBe('-1');
    expect(heading.classList.contains('kva-type-h1')).toBe(true);
    expect(rule).not.toBeNull();
    expect(rule.getAttribute('aria-hidden')).toBe('true');

    expect(name.textContent?.trim()).toBe('Ing. Alfredo Hernández');
    expect(name.classList.contains('kva-type-h3')).toBe(true);

    expect(emailLink.getAttribute('href')).toBe(
      'mailto:proyectos1@kvainstalaciones.mx?subject=%5Bkvainstalaciones.mx%5D%20Contacto',
    );
    expect(emailLink.textContent?.trim()).toBe('proyectos1@kvainstalaciones.mx');

    expect(phoneLink.getAttribute('href')).toBe('tel:+525640003344');
    expect(phoneLink.textContent?.trim()).toBe('(56) 4000 3344');
    expect(phoneLink.getAttribute('aria-label')).toBe('Llamar al (56) 4000 3344');

    expect(ctaLink.getAttribute('href')).toBe(
      'mailto:proyectos1@kvainstalaciones.mx?subject=%5Bkvainstalaciones.mx%5D%20Contacto',
    );
    expect(ctaLink.textContent?.trim()).toBe('Cotiza tu proyecto');
    expect(ctaLink.hasAttribute('aria-haspopup')).toBe(false);
    expect(links).toHaveLength(3);
  });

  it('omits missing contact name or phone without leaving empty wrappers or gaps (1.6-AC-02)', async () => {
    const { element } = await renderContact({
      ...siteContent,
      contact: { email: siteContent.contact.email },
    });

    expect(element.querySelector('h3')).toBeNull();
    expect(element.querySelector('a[href^="tel:"]')).toBeNull();
    expect(element.querySelector('.channel-email a[href^="mailto:"]')).not.toBeNull();
    expect(element.querySelector('a.contact-cta')).not.toBeNull();
  });

  it('keeps the copy button hidden before afterNextRender / when scripts are disabled and reveals it after render (1.6-AC-06)', async () => {
    const { fixture, element } = await renderContact();
    const button = element.querySelector('button.copy-button') as HTMLButtonElement;
    const status = element.querySelector('[role="status"]') as HTMLElement;

    expect(button).not.toBeNull();
    expect(button.hidden).toBe(false);
    expect(button.getAttribute('aria-label')).toBe('Copiar correo proyectos1@kvainstalaciones.mx');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('aria-atomic')).toBe('true');
    expect(status.textContent?.trim()).toBe('');

    // Simulate unenhanced / no-JS prerender state
    (fixture.componentInstance as unknown as { enhanced: { set(v: boolean): void } }).enhanced.set(
      false,
    );
    fixture.detectChanges();
    expect(button.hidden).toBe(true);
    expect(element.querySelector('.channel-email a[href^="mailto:"]')?.textContent?.trim()).toBe(
      'proyectos1@kvainstalaciones.mx',
    );
  });

  it('copies the email via EffectRunner, clears role="status", sets "Copiado" ~100 ms later with check icon, holds 2500 ms, then resets (1.6-AC-03, AC-04)', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const { fixture, element, http } = await renderContact();
    const runner = TestBed.inject(EffectRunner);
    const copySpy = vi.spyOn(runner, 'copy');
    const announceSpy = vi.spyOn(runner, 'announce');

    const button = element.querySelector('button.copy-button') as HTMLButtonElement;
    const status = element.querySelector('[role="status"]') as HTMLElement;

    button.click();
    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();

    expect(copySpy).toHaveBeenCalledTimes(1);
    expect(copySpy).toHaveBeenCalledWith({
      kind: 'copy',
      text: 'proyectos1@kvainstalaciones.mx',
    });
    expect(announceSpy).toHaveBeenCalledTimes(1);
    expect(announceSpy).toHaveBeenCalledWith(
      { kind: 'announce', message: 'Copiado' },
      expect.any(Function),
      expect.objectContaining({ holdMs: COPY_STATUS_HOLD_MS }),
    );
    expect(status.textContent?.trim()).toBe('');

    vi.advanceTimersByTime(ANNOUNCEMENT_DELAY_MS);
    fixture.detectChanges();
    flushIcons(http);
    fixture.detectChanges();

    expect(status.textContent?.trim()).toBe('Copiado');
    expect(status.querySelector('mat-icon[svgicon="check"], mat-icon')).not.toBeNull();

    vi.advanceTimersByTime(COPY_STATUS_HOLD_MS);
    fixture.detectChanges();

    expect(status.textContent?.trim()).toBe('');
    expect(status.querySelector('mat-icon')).toBeNull();
  });

  it('selects the email address text and announces the fallback message when clipboard write fails (1.6-AC-05)', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockRejectedValue(new Error('Clipboard blocked'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const { fixture, element } = await renderContact();
    const doc = TestBed.inject(DOCUMENT);
    const runner = TestBed.inject(EffectRunner);
    const selectSpy = vi.spyOn(runner, 'selectElementText');

    const button = element.querySelector('button.copy-button') as HTMLButtonElement;
    const emailLink = element.querySelector('.channel-email a[href^="mailto:"]') as HTMLElement;
    const status = element.querySelector('[role="status"]') as HTMLElement;

    button.click();
    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();

    expect(selectSpy).toHaveBeenCalledTimes(1);
    expect(selectSpy).toHaveBeenCalledWith(emailLink);
    expect(doc.getSelection()?.toString()).toBe('proyectos1@kvainstalaciones.mx');
    expect(status.textContent?.trim()).toBe('');

    vi.advanceTimersByTime(ANNOUNCEMENT_DELAY_MS);
    fixture.detectChanges();

    expect(status.textContent?.trim()).toBe('No se pudo copiar. Selecciona el correo y cópialo.');
    expect(status.querySelector('mat-icon')).toBeNull();

    vi.advanceTimersByTime(COPY_STATUS_HOLD_MS);
    fixture.detectChanges();

    expect(status.textContent?.trim()).toBe('No se pudo copiar. Selecciona el correo y cópialo.');
    expect(status.querySelector('mat-icon')).toBeNull();
    doc.getSelection()?.removeAllRanges();
  });

  it('keeps native email and phone links un-prevented and aligned with directContactLinks.transition (1.6-AC-02)', async () => {
    const { element } = await renderContact();
    const outcomes: boolean[] = [];
    const observe = (event: Event) => {
      outcomes.push(event.defaultPrevented);
      event.preventDefault();
    };
    document.addEventListener('click', observe);
    try {
      for (const selector of ['.channel-email a[href^="mailto:"]', 'a[href^="tel:"]']) {
        (element.querySelector(selector) as HTMLAnchorElement).click();
      }
    } finally {
      document.removeEventListener('click', observe);
    }

    expect(outcomes).toEqual([false, false]);
    for (const type of ['activate-email', 'activate-phone'] as const) {
      expect(directContactLinks.transition({ kind: 'idle' }, { type })).toEqual({
        state: { kind: 'idle' },
        effects: [],
      });
    }
  });

  it('applies each non-null transition result once and submits zero effects when transition returns null (1.6-AC-03)', async () => {
    const { fixture } = await renderContact();
    const runner = TestBed.inject(EffectRunner);
    const copySpy = vi.spyOn(runner, 'copy').mockResolvedValue(true);
    const announceSpy = vi.spyOn(runner, 'announce');
    const transitionSpy = vi.spyOn(copyAddress, 'transition').mockReturnValueOnce(null);

    const component = fixture.componentInstance as unknown as {
      onCopyAddress(): Promise<void>;
    };
    await component.onCopyAddress();

    expect(transitionSpy).toHaveBeenCalledTimes(1);
    expect(copySpy).not.toHaveBeenCalled();
    expect(announceSpy).not.toHaveBeenCalled();
  });
});

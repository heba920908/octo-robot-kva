import { TestBed } from '@angular/core/testing';
import { privacyNotice } from '../../core/content/privacy-notice.content';
import { Privacy } from './privacy';

describe('Privacy notice section (1.5-AC-04)', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Privacy] }).compileComponents();
    const fixture = TestBed.createComponent(Privacy);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('renders an in-flow section with the id the footer link targets', () => {
    const section = element.querySelector('section') as HTMLElement;
    const heading = section.querySelector('h2') as HTMLElement;

    expect(section.id).toBe('aviso');
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.textContent?.trim()).toBe(privacyNotice.title);
    expect(heading.getAttribute('tabindex')).toBe('-1');
  });

  it('shows every section as an h3 with its paragraphs and no h1', () => {
    const headings = Array.from(element.querySelectorAll('h3')).map((h) => h.textContent?.trim());

    expect(headings).toEqual(privacyNotice.sections.map((section) => section.heading));
    expect(element.querySelectorAll('p')).toHaveLength(
      privacyNotice.sections.reduce((count, section) => count + section.paragraphs.length, 0),
    );
    expect(element.querySelector('h1')).toBeNull();
  });

  it('shows the stand-in responsible party', () => {
    expect(element.textContent).toContain('kVA Instalaciones');
    expect(element.textContent).toContain('proyectos1@kvainstalaciones.mx');
  });
});

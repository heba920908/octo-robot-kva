import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { ContentFacade } from '../../core/content/content-facade';
import {
  CONDENSED_ATTRIBUTE,
  SectionNavigation,
  sectionDomId,
} from '../../core/navigation/section-navigation';

const THRESHOLD_TOKEN = '--kva-spacing-header-threshold';
const THRESHOLD_FALLBACK = 24;

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly content = inject(ContentFacade);
  private readonly navigation = inject(SectionNavigation);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: IntersectionObserver | null = null;

  protected readonly logo = this.content.site.headerLogo;
  protected readonly logoSrcset = `${this.logo.src} 1x, ${this.logo.src2x} 2x`;
  protected readonly logoLabel = this.content.format('logoLink');
  protected readonly logoAlt = '';
  protected readonly wordmark = this.content.format('headerWordmark');
  protected readonly ctaLabel = this.content.format('headerContact');
  protected readonly ctaShortLabel = this.content.format('headerContactShort');
  protected readonly homeId = sectionDomId('hero');
  protected readonly showCta = this.content.visibleSections.includes('contacto');
  protected readonly links = (
    [
      { id: 'servicios', label: this.content.format('navServices') },
      { id: 'proyectos', label: this.content.format('navProjects') },
      { id: 'nosotros', label: this.content.format('navAbout') },
      { id: 'confianza', label: this.content.format('navTrust') },
      { id: 'contacto', label: this.content.format('navContact') },
    ] as const
  ).filter((link) => this.content.visibleSections.includes(link.id));
  protected readonly current = this.navigation.current;
  protected readonly enhanced = signal(false);
  protected readonly condensed = signal(false);

  constructor() {
    afterNextRender(() => this.enhance());
    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      this.document.documentElement.removeAttribute(CONDENSED_ATTRIBUTE);
    });
  }

  // Post-hydration behavior: condense past the token threshold and scroll-spy the sections.
  private enhance(): void {
    const view = this.document.defaultView;
    if (!view) return;
    const root = this.document.documentElement;
    const threshold =
      parseFloat(view.getComputedStyle(root).getPropertyValue(THRESHOLD_TOKEN)) ||
      THRESHOLD_FALLBACK;

    const observe = () => this.observeSections(view);
    const onScroll = () => {
      const next = view.scrollY > threshold;
      if (next === this.condensed()) return;
      this.condensed.set(next);
      if (next) root.setAttribute(CONDENSED_ATTRIBUTE, 'condensed');
      else root.removeAttribute(CONDENSED_ATTRIBUTE);
      observe();
    };

    this.destroyRef.onDestroy(this.navigation.listen(this.host.nativeElement));
    this.enhanced.set(true);
    onScroll();
    observe();
    view.addEventListener('scroll', onScroll, { passive: true });
    view.addEventListener('resize', observe);
    this.destroyRef.onDestroy(() => {
      view.removeEventListener('scroll', onScroll);
      view.removeEventListener('resize', observe);
    });
  }

  // A 1 px band at the scroll-padding line: the section crossing it is the current one.
  private observeSections(view: Window): void {
    if (typeof IntersectionObserver !== 'function') return;
    this.observer?.disconnect();
    const line = Math.round(
      parseFloat(view.getComputedStyle(this.document.documentElement).scrollPaddingTop) || 0,
    );
    const bottom = Math.max(0, view.innerHeight - line - 1);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.navigation.spy(entry.target.id === this.homeId ? null : entry.target.id);
          }
        }
      },
      { rootMargin: `-${line}px 0px -${bottom}px 0px` },
    );
    for (const section of this.document.querySelectorAll('main section[id]')) {
      observer.observe(section);
    }
    this.observer = observer;
  }
}

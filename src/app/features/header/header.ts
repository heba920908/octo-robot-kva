import { FocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ContentFacade } from '../../core/content/content-facade';
import { MobileMenu } from '../../core/navigation/mobile-menu';
import {
  CONDENSED_ATTRIBUTE,
  SectionNavigation,
  sectionDomId,
} from '../../core/navigation/section-navigation';

const THRESHOLD_TOKEN = '--kva-spacing-header-threshold';
const THRESHOLD_FALLBACK = 24;
const MENU_BUTTON_DISPLAY_TOKEN = '--kva-header-menu-button-display';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly content = inject(ContentFacade);
  private readonly navigation = inject(SectionNavigation);
  private readonly menu = inject(MobileMenu);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');
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
  protected readonly menuLabel = this.content.format('menu');
  protected readonly navLabel = this.content.format('menuNavLabel');
  protected readonly menuOpen = this.menu.open;
  protected readonly menuIcon = computed(() => (this.menu.open() ? 'close' : 'menu'));
  protected readonly current = this.navigation.current;
  protected readonly enhanced = signal(false);
  protected readonly condensed = signal(false);

  constructor() {
    afterNextRender(() => this.enhance());
    // While the menu is open the whole header (bar and sheet) is the focus trap region.
    effect((onCleanup) => {
      if (!this.menu.open()) return;
      const trap = this.focusTrapFactory.create(this.bar().nativeElement);
      onCleanup(() => trap.destroy());
    });
    this.destroyRef.onDestroy(() => {
      this.menu.dispatch({ type: 'close' });
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
    // A viewport that no longer shows the menu button has no menu to keep open.
    const closeWhenWide = () => {
      if (
        view.getComputedStyle(root).getPropertyValue(MENU_BUTTON_DISPLAY_TOKEN).trim() === 'none'
      ) {
        this.menu.dispatch({ type: 'close' });
      }
    };
    const onScroll = () => {
      const next = view.scrollY > threshold;
      if (next === this.condensed()) return;
      this.condensed.set(next);
      if (next) root.setAttribute(CONDENSED_ATTRIBUTE, 'condensed');
      else root.removeAttribute(CONDENSED_ATTRIBUTE);
      observe();
    };

    // The menu listener goes first so a link choice closes the menu before navigation scrolls.
    this.destroyRef.onDestroy(this.menu.listen(this.host.nativeElement));
    this.destroyRef.onDestroy(this.navigation.listen(this.host.nativeElement));
    this.enhanced.set(true);
    onScroll();
    observe();
    view.addEventListener('scroll', onScroll, { passive: true });
    view.addEventListener('resize', observe);
    view.addEventListener('resize', closeWhenWide);
    this.destroyRef.onDestroy(() => {
      view.removeEventListener('scroll', onScroll);
      view.removeEventListener('resize', observe);
      view.removeEventListener('resize', closeWhenWide);
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

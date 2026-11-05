import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  serviceCardDisclosure,
  type ServiceCardDisclosureEvent,
  type ServiceCardDisclosureState,
} from '../../behaviors/service-card-disclosure.behavior';
import { ContentFacade } from '../../core/content/content-facade';
import { EffectRunner, type Effect } from '../../core/effects/effects';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';

export const COLLAPSED_SUB_SERVICE_COUNT = 4;
const COMPACT_VIEWPORT_QUERY = '(max-width: 767.98px)';
const TOGGLE_SELECTOR = 'button.service-toggle';

@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResponsiveImage, MatIcon],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  private readonly content = inject(ContentFacade);
  private readonly effects = inject(EffectRunner);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly grid = viewChild<ElementRef<HTMLElement>>('grid');

  protected readonly title = this.content.format('servicesTitle');
  protected readonly quoteLabel = this.content.format('serviceQuote');
  protected readonly collapseLabel = this.content.format('servicesCollapse');
  protected readonly services = this.content.services;
  protected readonly imageSizes = '(min-width: 1440px) 25vw, (min-width: 768px) 50vw, 100vw';

  protected readonly enhanced = signal(false);
  private readonly compact = signal(false);
  private readonly disclosure = signal<Readonly<Record<string, ServiceCardDisclosureState>>>({});

  protected readonly cards = computed(() => {
    const collapsing = this.enhanced() && this.compact();
    return this.services.map((service) => {
      const count = service.subServices.length;
      const toggleable = collapsing && count > COLLAPSED_SUB_SERVICE_COUNT;
      const expanded = this.disclosure()[service.id]?.expanded === true;
      const collapsed = toggleable && !expanded;
      return {
        service,
        toggleable,
        expanded,
        items: collapsed
          ? service.subServices.slice(0, COLLAPSED_SUB_SERVICE_COUNT)
          : service.subServices,
        toggleLabel: expanded
          ? this.collapseLabel
          : this.content.format('servicesExpand', { n: count }),
      };
    });
  });

  constructor() {
    let cleanup: (() => void) | null = null;
    afterNextRender(() => {
      this.enhanced.set(true);
      const view = this.document.defaultView;
      if (typeof view?.matchMedia === 'function') {
        const query = view.matchMedia(COMPACT_VIEWPORT_QUERY);
        const update = () => this.compact.set(query.matches);
        update();
        query.addEventListener('change', update);
        const previous = cleanup;
        cleanup = () => {
          previous?.();
          query.removeEventListener('change', update);
        };
      }
      const grid = this.grid()?.nativeElement;
      if (grid) {
        const handler = (event: Event) => this.onGridClick(event);
        grid.addEventListener('click', handler);
        const previous = cleanup;
        cleanup = () => {
          previous?.();
          grid.removeEventListener('click', handler);
        };
      }
    });
    this.destroyRef.onDestroy(() => cleanup?.());
  }

  private onGridClick(event: Event): void {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const toggle = target.closest<HTMLElement>(TOGGLE_SELECTOR);
    const serviceId = toggle?.closest<HTMLElement>('[data-service-id]')?.dataset['serviceId'];
    if (!toggle || !serviceId) return;
    this.dispatch(serviceId, { type: 'toggle', toggleId: toggle.id });
  }

  private dispatch(serviceId: string, event: ServiceCardDisclosureEvent): void {
    const current = this.disclosure()[serviceId] ?? { expanded: false };
    const result = serviceCardDisclosure.transition(current, event);
    if (!result) return;
    this.disclosure.update((states) => ({ ...states, [serviceId]: result.state }));
    for (const effect of result.effects) {
      this.executeEffect(effect);
    }
  }

  private executeEffect(effect: Effect): void {
    if (effect.kind === 'focus') this.effects.focus(effect);
  }
}

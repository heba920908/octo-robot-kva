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
  copyAddress,
  type CopyAddressEvent,
  type CopyAddressState,
} from '../../behaviors/copy-address.behavior';
import { buildDirectMailtoLink, buildTelLink } from '../../core/contact/contact-links';
import { ContentFacade } from '../../core/content/content-facade';
import { COPY_STATUS_HOLD_MS, EffectRunner, type Effect } from '../../core/effects/effects';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResponsiveImage, MatIcon],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly content = inject(ContentFacade);
  private readonly effects = inject(EffectRunner);
  private readonly destroyRef = inject(DestroyRef);
  private readonly emailElement = viewChild<ElementRef<HTMLElement>>('emailText');
  private readonly copyButtonElement = viewChild<ElementRef<HTMLButtonElement>>('copyButton');

  protected readonly site = this.content.site;
  protected readonly backgroundImage = this.content.images['cable-tray-technician'];
  protected readonly logo = this.site.contactLogo;
  protected readonly logoSrcset = `${this.logo.src} 1x, ${this.logo.src2x} 2x`;
  protected readonly logoAlt = '';
  protected readonly title = this.content.format('contactTitle');
  protected readonly contactName = this.site.contact.name ?? null;
  protected readonly email = this.site.contact.email;
  protected readonly emailHref = buildDirectMailtoLink(this.email);
  protected readonly phone = this.site.contact.phone
    ? {
        display: this.site.contact.phone.display,
        href: buildTelLink(this.site.contact.phone.e164),
        name: this.content.format('phoneName', { phone: this.site.contact.phone.display }),
      }
    : null;
  protected readonly ctaLabel = this.content.format('headerContact');
  protected readonly copyLabel = this.content.format('copyName', { address: this.email });
  protected readonly copySuccessMessage = this.content.format('copySuccess');
  protected readonly copyFailureMessage = this.content.format('copyFailure');

  protected readonly enhanced = signal(false);
  protected readonly copyState = signal<CopyAddressState>({ kind: 'idle' });
  protected readonly liveStatus = signal('');
  protected readonly showCopiedIcon = computed(
    () => this.copyState().kind === 'copied' && this.liveStatus().length > 0,
  );

  constructor() {
    let removeClickListener: (() => void) | null = null;
    afterNextRender(() => {
      this.enhanced.set(true);
      const button = this.copyButtonElement()?.nativeElement;
      if (button) {
        const handler = () => {
          void this.onCopyAddress();
        };
        button.addEventListener('click', handler);
        removeClickListener = () => button.removeEventListener('click', handler);
      }
    });
    this.destroyRef.onDestroy(() => {
      removeClickListener?.();
      this.effects.clearAnnounceTimers();
    });
  }

  protected async onCopyAddress(): Promise<void> {
    await this.dispatch({ type: 'request-copy', address: this.email });
  }

  private async dispatch(event: CopyAddressEvent): Promise<void> {
    const result = copyAddress.transition(this.copyState(), event);
    if (!result) return;
    this.copyState.set(result.state);
    for (const effect of result.effects) {
      await this.executeEffect(effect);
    }
  }

  private async executeEffect(effect: Effect): Promise<void> {
    switch (effect.kind) {
      case 'copy': {
        this.effects.clearAnnounceTimers();
        this.liveStatus.set('');
        const ok = await this.effects.copy(effect);
        if (ok) {
          await this.dispatch({
            type: 'copy-succeeded',
            message: this.copySuccessMessage,
          });
        } else {
          this.effects.selectElementText(this.emailElement()?.nativeElement ?? null);
          await this.dispatch({
            type: 'copy-failed',
            message: this.copyFailureMessage,
          });
        }
        break;
      }
      case 'announce': {
        const isCopied = this.copyState().kind === 'copied';
        this.effects.announce(
          effect,
          (text) => this.liveStatus.set(text),
          isCopied
            ? {
                holdMs: COPY_STATUS_HOLD_MS,
                onHoldComplete: () => {
                  this.liveStatus.set('');
                  void this.dispatch({ type: 'status-timeout' });
                },
              }
            : undefined,
        );
        break;
      }
      default:
        break;
    }
  }
}

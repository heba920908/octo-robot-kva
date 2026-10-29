import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentFacade } from '../../core/content/content-facade';
import { buildDirectMailtoLink, buildTelLink } from '../../core/contact/contact-links';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly content = inject(ContentFacade);
  protected readonly site = this.content.site;
  protected readonly logo = this.site.footerLogo;
  protected readonly logoSrcset = `${this.logo.src} 1x, ${this.logo.src2x} 2x`;
  protected readonly logoAlt = this.content.format('logoLink');
  protected readonly identity = this.site.legalIdentity ?? this.site.brandName;
  protected readonly emailHref = buildDirectMailtoLink(this.site.contact.email);
  protected readonly phone = this.site.contact.phone
    ? {
        display: this.site.contact.phone.display,
        href: buildTelLink(this.site.contact.phone.e164),
        name: this.content.format('phoneName', { phone: this.site.contact.phone.display }),
      }
    : null;
  protected readonly copyright = this.content.format('footerCopyright', {
    year: this.site.footerYear,
  });
  protected readonly privacyLabel = this.content.format('footerPrivacy');
}

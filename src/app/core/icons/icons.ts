import { inject, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const iconNames = [
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
] as const;

export function provideKvaIcons() {
  return provideAppInitializer(() => {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    for (const name of iconNames) {
      registry.addSvgIcon(
        name,
        sanitizer.bypassSecurityTrustResourceUrl(`media/icons/${name}.svg`),
      );
    }
  });
}

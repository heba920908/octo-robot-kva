export interface SiteContact {
  readonly name?: string;
  readonly email: string;
  readonly phone?: { readonly e164: string; readonly display: string };
  readonly whatsapp?: string;
}

export interface SiteContent {
  readonly id: 'site';
  readonly language: 'es-MX';
  readonly brandName: 'kVA Instalaciones';
  readonly pageTitle: string;
  readonly heading: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly iconPath: string;
  readonly contact: SiteContact;
  readonly facts: { readonly yearsInBusiness: string; readonly coverage: string };
  readonly legalIdentity?: string;
  readonly retentionPeriod?: string;
  readonly footerYear: number;
  readonly footerLogo: {
    readonly src: string;
    readonly src2x: string;
    readonly width: number;
    readonly height: number;
  };
}

// Editorial source: content/site.md
export const siteContent: SiteContent = {
  id: 'site',
  language: 'es-MX',
  brandName: 'kVA Instalaciones',
  pageTitle: 'kVA Instalaciones | Instalaciones eléctricas para empresas',
  heading: 'Instalaciones eléctricas para empresas, conforme a norma',
  description:
    'Ingeniería e instalaciones eléctricas para empresas en México, conforme a norma y con cobertura nacional.',
  canonicalUrl: 'https://heba920908.github.io/octo-robot-kva/',
  iconPath: 'media/kva-icon.png',
  contact: {
    name: 'Ing. Alfredo Hernández',
    email: 'proyectos1@kvainstalaciones.mx',
    phone: { e164: '+525640003344', display: '(56) 4000 3344' },
  },
  facts: { yearsInBusiness: '3+ años', coverage: 'Cobertura en todo México' },
  footerYear: 2026,
  footerLogo: {
    src: 'media/logo/kva-logo-white-24.png',
    src2x: 'media/logo/kva-logo-white-48.png',
    width: 46,
    height: 24,
  },
};

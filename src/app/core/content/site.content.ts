export interface SiteContent {
  readonly id: 'site';
  readonly language: 'es-MX';
  readonly brandName: 'kVA Instalaciones';
  readonly pageTitle: string;
  readonly heading: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly iconPath: string;
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
};

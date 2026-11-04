export interface HeroContent {
  readonly id: 'hero';
  readonly overline: string;
  readonly headline: string;
  readonly lead: string;
  readonly primaryCta: string;
  readonly secondaryCta: string;
  readonly proofPoint: string;
  readonly logo: {
    readonly src: string;
    readonly src2x: string;
    readonly width: number;
    readonly height: number;
  };
}

// Editorial source: content/hero.md
export const hero: HeroContent = {
  id: 'hero',
  overline: 'Explorando soluciones',
  headline: 'Instalaciones eléctricas para empresas, conforme a norma',
  lead: 'Ingeniería e instalación sin paros, multas de CFE ni inspecciones fallidas.',
  primaryCta: 'Cotiza tu proyecto',
  secondaryCta: 'Ver servicios',
  proofPoint: '3+ años · Cobertura en todo México',
  logo: {
    src: 'media/logo/kva-logo-white-200.png',
    src2x: 'media/logo/kva-logo-white-241.png',
    width: 381,
    height: 200,
  },
};

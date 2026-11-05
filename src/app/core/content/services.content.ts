export interface ServiceContent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly subServices: readonly string[];
  readonly image?: { readonly id: string; readonly alt: string };
  readonly cta?: string;
}

// Editorial source: content/services/<id>.md (one doc per Service, in `order`)
export const services: readonly ServiceContent[] = [
  {
    id: 'desarrollo-e-ingenieria-de-proyecto',
    name: 'Desarrollo e Ingeniería de Proyecto',
    description:
      'Diseñamos y documentamos tu proyecto eléctrico antes de la obra: planos, cálculos, costos y trámites técnicos para que se construya conforme a norma.',
    order: 1,
    subServices: [
      'Análisis de calidad de energía',
      'Cálculo de iluminación y eficiencia energética',
      'Dimensionamiento de sistemas y equipos',
      'Diseño ejecutivo (CAD/BIM)',
      'Levantamiento de instalaciones existentes',
      'Ingeniería de valor',
      'Elaboración de precios unitarios y programas de obra',
      'Gestoría técnica',
      'Dictamen por Unidad Verificadora de Instalaciones Eléctricas (UVIE)',
    ],
  },
  {
    id: 'instalaciones',
    name: 'Instalaciones',
    description:
      'Ejecutamos la obra eléctrica de principio a fin: canalización, cableado, equipos y sistemas especiales, en obra nueva y remodelaciones.',
    order: 2,
    subServices: [
      'Canalización y cableado en media y baja tensión',
      'Voz/Datos, Detección de Humo, Control de Acceso, CCTV',
      'Obra nueva y remodelaciones',
      'Recuperación o adecuación de espacios (comerciales, oficinas, industriales)',
      'Instalaciones eléctricas en sistemas críticos: Sites, mesas de dinero, call-centers',
      'Suministro, instalación, maniobras y puesta en marcha de equipos: CCMs, UPS, PDU, TVSS, plantas de emergencia',
    ],
  },
  {
    id: 'puesta-en-marcha-y-validaciones',
    name: 'Puesta en marcha y Validaciones',
    description:
      'Comprobamos que tus sistemas eléctricos funcionen como se diseñaron y los mantenemos operando, para evitar paros e inspecciones fallidas.',
    order: 3,
    subServices: [
      'Verificación de funcionamiento de sistemas eléctricos',
      'Pruebas de carga, continuidad, puesta a tierra',
      'Validación de calidad de energía',
      'Mantenimiento preventivo y correctivo a: Plantas de emergencia, UPS, reguladores; Transformadores (media y baja tensión); Sistemas de iluminación',
      'Renta de equipos (transformadores, plantas, etc.)',
    ],
  },
  {
    id: 'servicios-de-datos',
    name: 'Servicios de Datos',
    description:
      'Convertimos la información de tu operación en datos ordenados y visibles para que decidas con claridad.',
    order: 4,
    subServices: ['Decisiones con datos', 'Operación visible', 'Datos en orden'],
  },
];

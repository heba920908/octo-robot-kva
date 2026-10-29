export interface PrivacyNoticeSection {
  readonly id: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export interface PrivacyNoticeContent {
  readonly id: 'privacy-notice';
  readonly title: string;
  readonly sections: readonly PrivacyNoticeSection[];
}

// Editorial source: content/privacy-notice.md
export const privacyNotice: PrivacyNoticeContent = {
  id: 'privacy-notice',
  title: 'Aviso de privacidad',
  sections: [
    {
      id: 'responsable',
      heading: 'Responsable del tratamiento',
      paragraphs: [
        'kVA Instalaciones es responsable del tratamiento de tus datos personales. Puedes escribirnos a proyectos1@kvainstalaciones.mx.',
      ],
    },
    {
      id: 'datos',
      heading: 'Datos que tratamos',
      paragraphs: [
        'Este sitio no recopila ni almacena datos personales. Los datos llegan a kVA solo cuando nos escribes un correo o nos llamas: tu correo electrónico, el servicio que te interesa y la información que decidas compartir.',
        'El sitio no usa cookies, almacenamiento local ni herramientas de seguimiento.',
      ],
    },
    {
      id: 'finalidad',
      heading: 'Para qué los usamos',
      paragraphs: [
        'Usamos tus datos únicamente para responder tu solicitud y darte seguimiento comercial sobre el servicio que consultaste.',
      ],
    },
    {
      id: 'derechos',
      heading: 'Tus derechos',
      paragraphs: [
        'Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (ARCO), o retirar tu consentimiento, escribiendo a proyectos1@kvainstalaciones.mx.',
        'Si consideras que se vulneraron tus derechos, puedes acudir a la Secretaría Anticorrupción y Buen Gobierno (SABG).',
      ],
    },
    {
      id: 'cambios',
      heading: 'Cambios a este aviso',
      paragraphs: [
        'Este aviso es una versión general. Lo actualizaremos en esta página cuando kVA incorpore su razón social, domicilio y plazo de conservación de datos.',
      ],
    },
  ],
};

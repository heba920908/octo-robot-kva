import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { readText } from '../../../../scripts/content-checks.mjs';
import schema from '../schemas/ui-strings.schema.json';
import { uiStrings } from './ui-strings.content';

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

describe('UI strings content (AC1)', () => {
  it('validates every default with the draft-2020-12 schema', () => {
    expect(validate(uiStrings), JSON.stringify(validate.errors)).toBe(true);
  });

  it.each([
    ['missing item', (data: Record<string, unknown>) => delete data['menu']],
    [
      'missing field',
      (data: Record<string, unknown>) => delete (data['menu'] as Record<string, unknown>)['text'],
    ],
    [
      'blank field',
      (data: Record<string, unknown>) =>
        ((data['menu'] as Record<string, unknown>)['text'] = ' \n '),
    ],
    [
      'wrong type',
      (data: Record<string, unknown>) => ((data['menu'] as Record<string, unknown>)['text'] = 7),
    ],
    [
      'extra field',
      (data: Record<string, unknown>) =>
        ((data['menu'] as Record<string, unknown>)['extra'] = true),
    ],
    [
      'placeholder contract',
      (data: Record<string, unknown>) =>
        ((data['menu'] as Record<string, unknown>)['parameters'] = ['n']),
    ],
  ])('rejects %s and names the item/field', (_name, mutate) => {
    const data: Record<string, unknown> = structuredClone(uiStrings);
    mutate(data);
    expect(validate(data)).toBe(false);
    expect(JSON.stringify(validate.errors)).toContain('menu');
    if (_name !== 'missing item') {
      expect(JSON.stringify(validate.errors)).toMatch(/text|extra|parameters/);
    }
  });

  it('rejects unexpected items', () => {
    expect(validate({ ...uiStrings, invented: { text: 'extra', parameters: [] } })).toBe(false);
    expect(JSON.stringify(validate.errors)).toContain('invented');
  });

  it.each(['Menú {unknown}', 'Menú {broken', 'Menú {}'])(
    'rejects malformed or undeclared text placeholders: %s',
    (text) => {
      expect(validate({ ...uiStrings, menu: { ...uiStrings.menu, text } })).toBe(false);
      expect(JSON.stringify(validate.errors)).toContain('/menu/text');
    },
  );

  it('rejects a missing declared text placeholder with its item/field path', () => {
    expect(
      validate({
        ...uiStrings,
        servicesExpand: { ...uiStrings.servicesExpand, text: 'Ver servicios' },
      }),
    ).toBe(false);
    expect(JSON.stringify(validate.errors)).toContain('/servicesExpand/text');
  });

  for (const [key, item] of Object.entries(uiStrings)) {
    for (const parameter of item.parameters) {
      it(`rejects ${key} when only {${parameter}} is removed`, () => {
        expect(
          validate({
            ...uiStrings,
            [key]: { ...item, text: item.text.replaceAll(`{${parameter}}`, '') },
          }),
        ).toBe(false);
        expect(JSON.stringify(validate.errors)).toContain(`/${key}/text`);
      });
    }
  }

  it.each(
    Object.entries({
      headerWordmark: 'Instalaciones',
      headerContact: 'Cotiza tu proyecto',
      headerContactShort: 'Cotiza',
      navServices: 'Servicios',
      navProjects: 'Proyectos',
      navAbout: 'Nosotros',
      navTrust: 'Confianza',
      navContact: 'Contacto',
      projectsTitle: 'Proyectos',
      aboutTitle: 'Nosotros',
      trustTitle: 'Confianza',
      contactTitle: 'Contacto',
      serviceQuote: 'Cotiza este servicio',
      serviceVisit: 'Solicita una visita técnica',
      servicesExpand: 'Ver los {n} servicios',
      servicesCollapse: 'Ver menos',
      filterCount: '{n} proyectos: {servicio}',
      filterTotal: '{n} proyectos en total',
      filterEmpty: 'No hay proyectos de este servicio por ahora.',
      filterReset: 'Ver todos',
      projectScope: 'Alcance',
      projectOutcome: 'Resultado',
      projectClient: 'Cliente',
      projectLocation: 'Ubicación',
      projectYear: 'Año',
      projectStandards: 'Normas aplicadas',
      carouselName: 'Fotos de {title}',
      carouselPrevious: 'Foto anterior',
      carouselNext: 'Foto siguiente',
      carouselPosition: '{i} de {n}',
      carouselGoTo: 'Ver foto {i}',
      carouselRole: 'carrusel',
      carouselSlideRole: 'foto',
      emailLabel: 'Tu correo electrónico',
      emailHint: 'Ahí te responderemos.',
      serviceLabel: 'Servicio de interés',
      serviceEmpty: 'Elige un servicio',
      consentLabel: 'He leído y acepto el Aviso de privacidad.',
      consentLink: 'Leer el Aviso de privacidad',
      errorSummarySingle: 'Revisa 1 campo: {lista}.',
      errorSummaryPlural: 'Revisa {n} campos: {lista}.',
      postSubmitDone: 'Listo',
      postSubmitEdit: 'Editar datos',
      postSubmitCopy: 'Copiar correo',
      footerPrivacy: 'Aviso de privacidad',
      footerCopyright: '© {year} kVA Instalaciones',
      mailBody: 'Hola, kVA:\nMe interesa: {servicio}\nMi correo: {email}',
    }),
  )('retains the independent multi-variant default %s', (key, text) => {
    expect(uiStrings[key as keyof typeof uiStrings].text).toBe(text);
  });

  it('keeps editorial and executable strings identical', () => {
    const editorial = readText('content/ui-strings.md');
    const rows = editorial.split('\n').filter((line) => line.startsWith('| `'));
    const entries = rows.map((row) => {
      const [, key, text, parameters] = row.split('|').map((cell) => cell.trim());
      return [
        key.replaceAll('`', ''),
        {
          text: text.replaceAll('<br>', '\n'),
          parameters: parameters === '-' ? [] : parameters.split(', '),
        },
      ];
    });
    expect(Object.fromEntries(entries)).toEqual(uiStrings);
  });

  it('retains the complete non-Hero EXPERIENCE defaults and exact placeholders', () => {
    const experience = readText(
      '_bmad-output/planning-artifacts/ux-designs/ux-agency-portfolio-2026-10-21/EXPERIENCE.md',
    );
    const table = experience.split('**Default UI strings**')[1].split('## Component Patterns')[0];
    for (const [key, item] of Object.entries(uiStrings)) {
      for (const line of item.text.split('\n')) {
        expect(table, key).toContain(line);
      }
      expect(
        [...new Set([...item.text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]))].sort(),
        key,
      ).toEqual([...item.parameters].sort());
    }
    const nonHeroRows = table
      .split('\n')
      .filter((row) => row.startsWith('|') && !/^\|(?:---| Where| Hero)/.test(row));
    for (const row of nonHeroRows) {
      const copy = row.split('|')[2].trim();
      expect(
        Object.values(uiStrings).some((item) => copy.includes(item.text.split('\n')[0])),
        row,
      ).toBe(true);
    }
    expect(Object.keys(uiStrings).some((key) => key.startsWith('hero'))).toBe(false);
  });
});

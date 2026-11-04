import Ajv2020 from 'ajv/dist/2020';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import serviceSchema from '../schemas/service.schema.json';
import { images } from './images.content';
import { services } from './services.content';

const validate = new Ajv2020({ allErrors: true, strict: true }).compile(serviceSchema);
const docs = readdirSync('content/services')
  .filter((file) => file.endsWith('.md'))
  .sort();

function clone(index = 0): Record<string, unknown> {
  return JSON.parse(JSON.stringify(services[index])) as Record<string, unknown>;
}

function duplicateIds(items: readonly { id: string; name: string }[]): string[] {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];
  for (const item of items) {
    const first = seen.get(item.id);
    if (first !== undefined) duplicates.push(`${item.id}: ${first} / ${item.name}`);
    else seen.set(item.id, item.name);
  }
  return duplicates;
}

describe('services content (2.1-AC-01)', () => {
  it('validates every Service against the schema, naming the item and field on failure', () => {
    for (const service of services) {
      expect(validate(service), `${service.id}: ${JSON.stringify(validate.errors)}`).toBe(true);
    }
  });

  it('has the four launch Services in brochure order with unique ids equal to their doc slugs', () => {
    expect(services.map((service) => service.id)).toEqual([
      'desarrollo-e-ingenieria-de-proyecto',
      'instalaciones',
      'puesta-en-marcha-y-validaciones',
      'servicios-de-datos',
    ]);
    expect(services.map((service) => service.subServices.length)).toEqual([9, 6, 5, 3]);
    expect(services.map((service) => service.order)).toEqual([1, 2, 3, 4]);
    expect(docs.map((file) => file.replace(/\.md$/, ''))).toEqual(
      services.map((service) => service.id),
    );
    expect(duplicateIds(services)).toEqual([]);
  });

  it('reports duplicate ids naming both items', () => {
    expect(
      duplicateIds([
        { id: 'a', name: 'Uno' },
        { id: 'a', name: 'Dos' },
      ]),
    ).toEqual(['a: Uno / Dos']);
  });

  it('puts the hooks first and keeps the maintenance item as one Sub-service', () => {
    expect(services[0].subServices[0]).toBe('Análisis de calidad de energía');
    expect(services[1].subServices.slice(0, 2)).toEqual([
      'Canalización y cableado en media y baja tensión',
      'Voz/Datos, Detección de Humo, Control de Acceso, CCTV',
    ]);
    expect(services[2].subServices).toContain(
      'Mantenimiento preventivo y correctivo a: Plantas de emergencia, UPS, reguladores; Transformadores (media y baja tensión); Sistemas de iluminación',
    );
    expect(services[2].subServices.filter((item) => /Transformadores/.test(item))).toHaveLength(1);
  });

  it('sets no image or CTA on the launch Services', () => {
    for (const service of services) {
      expect(service.image, service.id).toBeUndefined();
      expect(service.cta, service.id).toBeUndefined();
    }
  });

  it('parses each editorial doc frontmatter, equals the typed entry and validates', () => {
    for (const service of services) {
      const editorial = readFileSync(`content/services/${service.id}.md`, 'utf8');
      const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(editorial)?.[1] ?? '';
      const doc: unknown = parse(frontmatter);

      expect(doc, service.id).toEqual(service);
      expect(validate(doc), `${service.id}: ${JSON.stringify(validate.errors)}`).toBe(true);
      expect(editorial, service.id).toContain('[ASSUMPTION]');
    }
  });

  it('only references image ids that exist', () => {
    for (const service of services) {
      if (service.image) expect(Object.keys(images), service.id).toContain(service.image.id);
    }
  });

  it('accepts optional image and CTA when valid and keeps image ids resolvable', () => {
    const content = clone();
    content['image'] = { id: 'wiring-technician', alt: 'Técnico tendiendo cableado.' };
    content['cta'] = 'Solicita una visita técnica';

    expect(validate(content), JSON.stringify(validate.errors)).toBe(true);
    expect(Object.keys(images)).toContain('wiring-technician');
  });

  it.each<[string, (content: Record<string, unknown>) => void, RegExp]>([
    ['missing name', (content) => delete content['name'], /name/],
    ['blank name', (content) => (content['name'] = ' '), /name/],
    ['missing description', (content) => delete content['description'], /description/],
    ['blank description', (content) => (content['description'] = ' '), /description/],
    ['missing order', (content) => delete content['order'], /order/],
    ['order below 1', (content) => (content['order'] = 0), /order/],
    ['fractional order', (content) => (content['order'] = 1.5), /order/],
    ['missing id', (content) => delete content['id'], /id/],
    ['bad id', (content) => (content['id'] = 'Not A Slug'), /id/],
    ['missing subServices', (content) => delete content['subServices'], /subServices/],
    ['empty subServices', (content) => (content['subServices'] = []), /subServices/],
    ['blank Sub-service', (content) => (content['subServices'] = ['  ']), /subServices/],
    ['blank CTA', (content) => (content['cta'] = ' '), /cta/],
    ['image without alt', (content) => (content['image'] = { id: 'x' }), /image/],
    ['image with blank alt', (content) => (content['image'] = { id: 'x', alt: ' ' }), /alt/],
    ['unexpected field', (content) => (content['extra'] = 'x'), /extra|additional/i],
  ])('rejects %s naming the field', (_name, change, field) => {
    const content = clone();
    change(content);

    expect(validate(content)).toBe(false);
    expect(JSON.stringify(validate.errors)).toMatch(field);
  });
});

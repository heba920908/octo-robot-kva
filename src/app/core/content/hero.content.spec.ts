import Ajv2020 from 'ajv/dist/2020';
import { readFileSync } from 'node:fs';
import heroSchema from '../schemas/hero.schema.json';
import { hero } from './hero.content';
import { siteContent } from './site.content';

function createValidator() {
  return new Ajv2020({ allErrors: true, strict: true }).compile(heroSchema);
}

function clone(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(hero)) as Record<string, unknown>;
}

function unrecordedProofSegments(proofPoint: string): string[] {
  const facts: string[] = Object.values(siteContent.facts);
  return proofPoint
    .split('·')
    .map((segment) => segment.trim())
    .filter((segment) => !facts.includes(segment));
}

describe('hero content (1.7 AC1)', () => {
  it('matches the hero schema', () => {
    const validate = createValidator();

    expect(validate(hero), JSON.stringify(validate.errors)).toBe(true);
  });

  it('carries the required copy within the character budgets', () => {
    expect(hero.overline).toBe('Explorando soluciones');
    expect(hero.primaryCta).toBe('Cotiza tu proyecto');
    expect(hero.secondaryCta).toBe('Ver servicios');
    expect(hero.proofPoint).toBe('3+ años · Cobertura en todo México');
    expect(hero.headline.length).toBeLessThanOrEqual(60);
    expect(hero.lead.length).toBeLessThanOrEqual(120);
  });

  it('only repeats proof-point segments recorded as site facts', () => {
    expect(unrecordedProofSegments(hero.proofPoint)).toEqual([]);
    expect(unrecordedProofSegments('3+ años · Cobertura internacional')).toEqual([
      'Cobertura internacional',
    ]);
    expect(unrecordedProofSegments('10 años')).toEqual(['10 años']);
  });

  it('points the logo at the generated 200 px white-logo derivatives with intrinsic size', () => {
    expect(hero.logo).toEqual({
      src: 'media/logo/kva-logo-white-200.png',
      src2x: 'media/logo/kva-logo-white-241.png',
      width: 381,
      height: 200,
    });
    for (const file of [hero.logo.src, hero.logo.src2x]) {
      const png = readFileSync(`public/${file}`);
      const expected = file === hero.logo.src ? hero.logo.height : 241;
      expect(png.readUInt32BE(20)).toBe(expected);
    }
    expect(readFileSync(`public/${hero.logo.src}`).readUInt32BE(16)).toBe(hero.logo.width);
  });

  it('mirrors the typed content in the editorial doc', () => {
    const editorial = readFileSync('content/hero.md', 'utf8');

    for (const text of [
      hero.overline,
      hero.headline,
      hero.lead,
      hero.primaryCta,
      hero.secondaryCta,
      hero.proofPoint,
      hero.logo.src,
      hero.logo.src2x,
    ]) {
      expect(editorial).toContain(text);
    }
  });

  it.each<[string, (content: Record<string, unknown>) => void]>([
    ['missing proof point', (content) => delete content['proofPoint']],
    ['blank proof point', (content) => (content['proofPoint'] = ' ')],
    ['missing headline', (content) => delete content['headline']],
    ['headline over 60 characters', (content) => (content['headline'] = 'x'.repeat(61))],
    ['lead over 120 characters', (content) => (content['lead'] = 'x'.repeat(121))],
    ['blank overline', (content) => (content['overline'] = ' ')],
    ['missing secondary CTA', (content) => delete content['secondaryCta']],
    ['missing logo', (content) => delete content['logo']],
    ['wrong id', (content) => (content['id'] = 'site')],
    ['unexpected field', (content) => (content['extra'] = 'x')],
  ])('rejects %s', (_name, change) => {
    const validate = createValidator();
    const content = clone();
    change(content);

    expect(validate(content)).toBe(false);
  });
});

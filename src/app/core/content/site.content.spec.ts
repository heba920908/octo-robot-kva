import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import siteSchema from '../schemas/site.schema.json';
import { siteContent } from './site.content';

function clone(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(siteContent)) as Record<string, unknown>;
}

function withContact(change: (contact: Record<string, unknown>) => void): Record<string, unknown> {
  const site = clone();
  change(site['contact'] as Record<string, unknown>);
  return site;
}

function createValidator() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv.compile(siteSchema);
}

describe('siteContent', () => {
  it('matches the site content schema', () => {
    const validate = createValidator();

    expect(validate(siteContent), JSON.stringify(validate.errors)).toBe(true);
  });

  it('rejects fields outside the content contract', () => {
    const validate = createValidator();

    expect(validate({ ...siteContent, unexpected: 'value' })).toBe(false);
  });
});

describe('site contact, facts and footer content (1.5-AC-01)', () => {
  it('publishes only the first channel, with the brochure display form', () => {
    expect(siteContent.contact.email).toBe('proyectos1@kvainstalaciones.mx');
    expect(siteContent.contact.phone).toEqual({ e164: '+525640003344', display: '(56) 4000 3344' });
    expect(siteContent.contact.name).toBe('Ing. Alfredo Hernández');
    expect(siteContent.footerYear).toBe(2026);
  });

  it('keeps the phone display digits aligned with its E.164 number', () => {
    const phone = siteContent.contact.phone;
    expect(phone).toBeDefined();
    expect(phone?.display.replace(/\D/g, '')).toBe(phone?.e164.slice(3));
  });

  it('records the facts a Hero proof point may repeat', () => {
    expect(siteContent.facts).toEqual({
      yearsInBusiness: '3+ años',
      coverage: 'Cobertura en todo México',
    });
  });

  it('allows optional name, phone, WhatsApp, legal identity and retention period to be absent', () => {
    const validate = createValidator();
    const site = withContact((contact) => {
      delete contact['name'];
      delete contact['phone'];
      delete contact['whatsapp'];
    });
    delete site['legalIdentity'];
    delete site['retentionPeriod'];

    expect(validate(site), JSON.stringify(validate.errors)).toBe(true);
  });

  it('accepts optional legal identity, retention period and WhatsApp when supplied', () => {
    const validate = createValidator();
    const site = withContact((contact) => {
      contact['whatsapp'] = '+525640003344';
    });
    site['legalIdentity'] = 'kVA Instalaciones S.A. de C.V.';
    site['retentionPeriod'] = 'Doce meses';

    expect(validate(site), JSON.stringify(validate.errors)).toBe(true);
  });

  it.each<[string, (contact: Record<string, unknown>) => void]>([
    ['missing email', (contact) => delete contact['email']],
    ['blank email', (contact) => (contact['email'] = '')],
    ['malformed email', (contact) => (contact['email'] = 'proyectos1')],
    [
      'phone without plus',
      (contact) => (contact['phone'] = { e164: '525640003344', display: '(56) 4000 3344' }),
    ],
    [
      'non-Mexican phone',
      (contact) => (contact['phone'] = { e164: '+15551234567', display: '(55) 5123 4567' }),
    ],
    [
      'short phone',
      (contact) => (contact['phone'] = { e164: '+52564000334', display: '(56) 4000 334' }),
    ],
    [
      'phone with spaces',
      (contact) => (contact['phone'] = { e164: '+52 56 4000 3344', display: '(56) 4000 3344' }),
    ],
    ['phone without display', (contact) => (contact['phone'] = { e164: '+525640003344' })],
    [
      'nine-digit display',
      (contact) => (contact['phone'] = { e164: '+525640003344', display: '(56) 400 3344' }),
    ],
    [
      'second channel field',
      (contact) => (contact['secondaryEmail'] = 'proyectos2@kvainstalaciones.mx'),
    ],
    ['invalid WhatsApp number', (contact) => (contact['whatsapp'] = '5640003344')],
  ])('rejects %s', (_name, change) => {
    const validate = createValidator();

    expect(validate(withContact(change))).toBe(false);
  });

  it.each(['facts', 'footerYear', 'footerLogo', 'contactLogo', 'contact'])(
    'requires %s',
    (field) => {
      const validate = createValidator();
      const site = clone();
      delete site[field];

      expect(validate(site)).toBe(false);
    },
  );

  it.each([2025.5, 1999, '2026'])('rejects footer year %j', (year) => {
    const validate = createValidator();

    expect(validate({ ...clone(), footerYear: year })).toBe(false);
  });

  it('points the footer logo at existing white derivatives with intrinsic size', () => {
    const logo = siteContent.footerLogo;
    expect(logo).toEqual({
      src: 'media/logo/kva-logo-white-24.png',
      src2x: 'media/logo/kva-logo-white-48.png',
      width: 46,
      height: 24,
    });
    expect(existsSync(`public/${logo.src}`)).toBe(true);
    expect(existsSync(`public/${logo.src2x}`)).toBe(true);
    const header = readFileSync(`public/${logo.src}`).subarray(16, 24);
    expect([header.readUInt32BE(0), header.readUInt32BE(4)]).toEqual([logo.width, logo.height]);
    const header2x = readFileSync(`public/${logo.src2x}`).subarray(16, 24);
    expect([header2x.readUInt32BE(0), header2x.readUInt32BE(4)]).toEqual([91, 48]);
  });

  it('points the contact logo at existing 40px/80px white derivatives with intrinsic size (1.6-AC-02)', () => {
    const logo = siteContent.contactLogo;
    expect(logo).toEqual({
      src: 'media/logo/kva-logo-white-40.png',
      src2x: 'media/logo/kva-logo-white-80.png',
      width: 76,
      height: 40,
    });
    expect(existsSync(`public/${logo.src}`)).toBe(true);
    expect(existsSync(`public/${logo.src2x}`)).toBe(true);
    const header = readFileSync(`public/${logo.src}`).subarray(16, 24);
    expect([header.readUInt32BE(0), header.readUInt32BE(4)]).toEqual([logo.width, logo.height]);
    const header2x = readFileSync(`public/${logo.src2x}`).subarray(16, 24);
    expect([header2x.readUInt32BE(0), header2x.readUInt32BE(4)]).toEqual([152, 80]);
  });

  it('publishes no second channel in content, source or the entry page', () => {
    const walk = (directory: string): string[] =>
      readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory() ? walk(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`],
      );
    const files = [...walk('content'), ...walk('src')].filter(
      (file) => /\.(?:md|html|ts|scss)$/.test(file) && !file.endsWith('.spec.ts'),
    );
    const offenders = files.filter((file) =>
      /proyectos2@|4029[\s-]?4029/i.test(readFileSync(file, 'utf8')),
    );

    expect(files.length).toBeGreaterThan(20);
    expect(offenders).toEqual([]);
  });
});

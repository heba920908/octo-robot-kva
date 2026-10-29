import {
  buildDirectMailtoLink,
  buildMailtoLink,
  buildTelLink,
  DIRECT_CONTACT_TOPIC,
  LEAD_SUBJECT_TAG,
} from './contact-links';
import { uiStrings } from '../content/ui-strings.content';

describe('contact link builder (1.5-AC-02)', () => {
  it('builds the tagged direct mailto link', () => {
    expect(buildMailtoLink({ email: 'proyectos1@kvainstalaciones.mx', topic: 'Contacto' })).toBe(
      'mailto:proyectos1@kvainstalaciones.mx?subject=%5Bkvainstalaciones.mx%5D%20Contacto',
    );
  });

  it('builds the tel link from E.164', () => {
    expect(buildTelLink('+525640003344')).toBe('tel:+525640003344');
  });

  it('owns the Lead tag and agrees with the editorial direct subject string', () => {
    expect(LEAD_SUBJECT_TAG).toBe('[kvainstalaciones.mx]');
    expect(`${LEAD_SUBJECT_TAG} ${DIRECT_CONTACT_TOPIC}`).toBe(uiStrings.mailSubjectDirect.text);
  });

  it('builds the direct contact link with the fixed topic', () => {
    expect(buildDirectMailtoLink('proyectos1@kvainstalaciones.mx')).toBe(
      buildMailtoLink({ email: 'proyectos1@kvainstalaciones.mx', topic: 'Contacto' }),
    );
  });

  it('URL-encodes every value', () => {
    const link = buildMailtoLink({ email: 'a+b@example.mx', topic: 'Cotización & más?' });
    expect(link).toBe(
      'mailto:a%2Bb@example.mx?subject=%5Bkvainstalaciones.mx%5D%20Cotizaci%C3%B3n%20%26%20m%C3%A1s%3F',
    );
    expect(link.split('?')).toHaveLength(2);
  });

  it.each([
    [{ email: '', topic: 'Contacto' }],
    [{ email: '   ', topic: 'Contacto' }],
    [{ email: 'sin-arroba', topic: 'Contacto' }],
    [{ email: 'a@b.mx', topic: ' ' }],
  ])('rejects invalid mailto input %j', (input) => {
    expect(() => buildMailtoLink(input)).toThrow(/invalid/i);
  });

  it.each(['', '5640003344', '+15551234567', '+52 56 4000 3344', '+5256400033', '+520640003344'])(
    'rejects non Mexican E.164 phone %j',
    (phone) => {
      expect(() => buildTelLink(phone)).toThrow(/invalid/i);
    },
  );
});

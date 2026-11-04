import Ajv2020 from 'ajv/dist/2020';
import privacySchema from '../schemas/privacy-notice.schema.json';
import { privacyNotice } from './privacy-notice.content';
import { siteContent } from './site.content';

function createValidator() {
  return new Ajv2020({ allErrors: true, strict: true }).compile(privacySchema);
}

function clone(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(privacyNotice)) as Record<string, unknown>;
}

describe('privacyNotice content (1.5-AC-04)', () => {
  it('matches the privacy-notice schema', () => {
    const validate = createValidator();

    expect(validate(privacyNotice), JSON.stringify(validate.errors)).toBe(true);
  });

  it('names the stand-in responsible party and the published contact email', () => {
    const text = privacyNotice.sections.flatMap((section) => section.paragraphs).join('\n');
    const responsible = siteContent.legalIdentity ?? siteContent.brandName;

    expect(text).toContain(responsible);
    expect(text).toContain(siteContent.contact.email);
  });

  it('keeps unique section ids and the interim-notice facts', () => {
    const ids = privacyNotice.sections.map((section) => section.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(privacyNotice.title).toBe('Aviso de privacidad');
  });

  it.each<[string, (notice: Record<string, unknown>) => void]>([
    ['missing title', (notice) => delete notice['title']],
    ['blank title', (notice) => (notice['title'] = ' ')],
    ['missing sections', (notice) => delete notice['sections']],
    ['empty sections', (notice) => (notice['sections'] = [])],
    ['wrong id', (notice) => (notice['id'] = 'privacy')],
    ['unexpected field', (notice) => (notice['extra'] = 'x')],
    [
      'blank paragraph',
      (notice) => (notice['sections'] = [{ id: 'a', heading: 'A', paragraphs: [' '] }]),
    ],
    [
      'section without paragraphs',
      (notice) => (notice['sections'] = [{ id: 'a', heading: 'A', paragraphs: [] }]),
    ],
    [
      'section without heading',
      (notice) => (notice['sections'] = [{ id: 'a', paragraphs: ['Texto'] }]),
    ],
    [
      'invalid section id',
      (notice) => (notice['sections'] = [{ id: 'Bad Id', heading: 'A', paragraphs: ['Texto'] }]),
    ],
  ])('rejects %s', (_name, change) => {
    const validate = createValidator();
    const notice = clone();
    change(notice);

    expect(validate(notice)).toBe(false);
  });
});

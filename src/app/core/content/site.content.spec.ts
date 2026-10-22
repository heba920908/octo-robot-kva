import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import siteSchema from '../schemas/site.schema.json';
import { siteContent } from './site.content';

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

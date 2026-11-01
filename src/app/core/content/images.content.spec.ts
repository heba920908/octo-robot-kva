import Ajv2020 from 'ajv/dist/2020';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { TestBed } from '@angular/core/testing';
import schema from '../schemas/image.schema.json';
import { images } from './images.content';
import { ContentFacade } from './content-facade';
import manifest from '../../../../scripts/images.manifest.json';

const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);

describe('image content (Story 1.4 AC1-3)', () => {
  it('validates every image and exposes immutable metadata only through the facade', () => {
    expect(Object.keys(images)).toHaveLength(25);
    for (const [id, image] of Object.entries(images)) {
      expect(validate(image), `${id}: ${JSON.stringify(validate.errors)}`).toBe(true);
    }
    const facade = TestBed.inject(ContentFacade);
    expect(facade.images).toEqual(images);
    expect(Object.isFrozen(facade.images)).toBe(true);
    expect(Object.isFrozen(facade.images['cover-blueprint-tools'].widths)).toBe(true);
    expect(facade.visibleSections).toEqual(['contacto']);
  });

  it.each([
    { field: 'base', value: '/media/a' },
    { field: 'base', value: 'https://remote/a' },
    { field: 'base', value: 'media/projects/../escape' },
    { field: 'base', value: 'media/projects/photo.jpg' },
    { field: 'base', value: 'media/projects/photo?x' },
    { field: 'width', value: 0 },
    { field: 'height', value: 1.5 },
    { field: 'widths', value: [] },
    { field: 'widths', value: [320, 320] },
    { field: 'widths', value: [0] },
    { field: 'alt', value: 7 },
    { field: 'extra', value: true },
  ])('rejects malformed $field=$value with field diagnostics', ({ field, value }) => {
    expect(validate({ ...images['cover-blueprint-tools'], [field]: value })).toBe(false);
    expect(JSON.stringify(validate.errors)).toContain(field);
  });

  it('requires all metadata fields and permits decorative empty alt only for backgrounds', () => {
    for (const field of ['base', 'widths', 'width', 'height', 'alt']) {
      const sample: Record<string, unknown> = { ...images['cover-blueprint-tools'] };
      delete sample[field];
      expect(validate(sample)).toBe(false);
      expect(JSON.stringify(validate.errors)).toContain(field);
    }
    expect(validate(images['cover-blueprint-tools'])).toBe(true);
    expect(validate({ ...images['larousse-01'], alt: '' })).toBe(false);
    expect(validate({ ...images['larousse-01'], alt: '   ' })).toBe(false);
  });

  it('matches every real original, candidate, budget and editorial alt without fabrication', async () => {
    const editorial = await readFile('content/images.md', 'utf8');
    const rows = editorial.split('\n').filter((row) => row.startsWith('| `'));
    const descriptions = Object.fromEntries(
      rows.map((row) => {
        const [, id, alt] = row.split('|').map((cell) => cell.trim());
        return [id.replaceAll('`', ''), alt === '(decorative)' ? '' : alt];
      }),
    );
    expect(descriptions).toEqual(
      Object.fromEntries(Object.entries(images).map(([id, image]) => [id, image.alt])),
    );
    expect(Object.keys(images).sort()).toEqual(manifest.photos.map((item) => item.id).sort());
    const expectedFiles: string[] = [];
    for (const item of manifest.photos) {
      const image = images[item.id as keyof typeof images];
      const original = await sharp(item.source).metadata();
      expect(image.width, item.id).toBe(original.width);
      expect(image.height, item.id).toBe(original.height);
      expect(image.base, item.id).toBe(item.base);
      expect(image.widths, item.id).toEqual(
        [...new Set(item.widths.map((width) => Math.min(width, image.width)))].sort(
          (first, second) => first - second,
        ),
      );
      for (const width of image.widths)
        for (const [extension, format] of [
          ['avif', 'heif'],
          ['webp', 'webp'],
          ['jpg', 'jpeg'],
        ]) {
          const path = `${image.base}-${width}.${extension}`;
          expectedFiles.push(path);
          const buffer = await readFile(`public/${path}`);
          const metadata = await sharp(buffer).metadata();
          expect(metadata.format, path).toBe(format);
          expect(metadata.width, path).toBe(width);
          expect(metadata.height, path).toBe(Math.round((width * image.height) / image.width));
          const decoded = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
          expect(decoded.info.width, path).toBe(width);
          expect(decoded.info.height, path).toBe(metadata.height);
          expect(decoded.data.length, path).toBe(
            decoded.info.width * decoded.info.height * decoded.info.channels,
          );
          expect(buffer.length, path).toBeLessThanOrEqual(item.budgetBytes);
        }
    }
    const actual = (await readdir('public/media', { recursive: true }))
      .filter((path) => /^(backgrounds|projects)\/.*\.(avif|webp|jpg)$/.test(path))
      .map((path) => `media/${path}`);
    expect(actual.sort()).toEqual(expectedFiles.sort());
  });

  it('has real transparent logo candidates for every role and valid provenance checksums', async () => {
    const provenance = await readFile('public/media/PROVENANCE.md', 'utf8');
    const recordedPaths = provenance
      .split('\n')
      .filter((line) => /^\| (media\/|assets\/)/.test(line))
      .map((line) => line.split('|')[1].trim());
    expect(recordedPaths.filter((path) => path.startsWith('assets/')).sort()).toEqual(
      [...manifest.photos, ...manifest.logos].map((item) => item.source).sort(),
    );
    const actualPaths = (await readdir('public/media', { recursive: true }))
      .filter((path) => /^(backgrounds|projects|logo)\/.*\.(avif|webp|jpg|png)$/.test(path))
      .map((path) => `media/${path}`);
    expect(recordedPaths.filter((path) => path.startsWith('media/')).sort()).toEqual(
      actualPaths.sort(),
    );
    for (const height of [24, 32, 40, 48, 64, 80, 200, 241]) {
      const path = `media/logo/kva-logo-white-${height}.png`;
      const metadata = await sharp(`public/${path}`).metadata();
      expect(metadata.height).toBe(height);
      expect(metadata.width).toBe(Math.round((height * 459) / 241));
      expect(metadata.hasAlpha).toBe(true);
      expect((await sharp(`public/${path}`).stats()).channels[3].min).toBeLessThan(255);
    }
    for (const line of provenance
      .split('\n')
      .filter((line) => /^\| (media\/|assets\/)/.test(line))) {
      const [, path, measurement, checksum] = line.split('|').map((cell) => cell.trim());
      const bytes = await readFile(path.startsWith('assets/') ? path : `public/${path}`);
      expect(createHash('sha256').update(bytes).digest('hex'), path).toBe(checksum);
      const metadata = await sharp(bytes).metadata();
      expect(measurement, path).toBe(
        path.startsWith('assets/') ? `${metadata.width}x${metadata.height}` : String(bytes.length),
      );
    }
    expect(provenance).toContain('2x: 241px (full 400px unavailable)');
  });
});

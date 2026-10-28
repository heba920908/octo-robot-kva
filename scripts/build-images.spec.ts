import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { parse } from 'yaml';
import { buildImages, type ImageManifest } from './build-images.mjs';

describe('image generator (Story 1.4 AC1-2)', () => {
  let root: string;
  let manifest: ImageManifest;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'kva-images-'));
    await mkdir(join(root, 'assets/media/brochure'), { recursive: true });
    await sharp({ create: { width: 70, height: 50, channels: 3, background: '#357953' } })
      .jpeg()
      .toFile(join(root, 'assets/media/brochure/photo.jpg'));
    await sharp({ create: { width: 459, height: 241, channels: 4, background: '#ffffff80' } })
      .png()
      .toFile(join(root, 'assets/media/brochure/white.png'));
    manifest = {
      version: 1,
      photos: [
        {
          id: 'photo',
          source: 'assets/media/brochure/photo.jpg',
          base: 'media/projects/photo',
          widths: [1280, 32, 64, 32],
          budgetBytes: 120000,
        },
      ],
      logos: [
        {
          id: 'white',
          source: 'assets/media/brochure/white.png',
          base: 'media/logo/white',
          heights: [32, 40, 24, 200, 40],
          densities: [1, 2],
        },
      ],
    };
  });

  afterEach(async () => rm(root, { recursive: true, force: true }));

  async function inventory() {
    const files = (await readdir(join(root, 'public'), { recursive: true }))
      .filter((file) => /\.(avif|webp|jpg|png)$/.test(file))
      .sort();
    return Promise.all(
      files.map(async (file) => [
        file,
        createHash('sha256')
          .update(await readFile(join(root, 'public', file)))
          .digest('hex'),
      ]),
    );
  }

  it('caps, sorts and deduplicates widths; decodes all formats with intrinsic ratio', async () => {
    const originals = await readFile(join(root, manifest.photos[0].source));
    const result = await buildImages(manifest, { root });
    expect(result.photos[0]).toMatchObject({ widths: [32, 64, 70], width: 70, height: 50 });
    for (const width of [32, 64, 70]) {
      for (const [extension, format] of [
        ['avif', 'heif'],
        ['webp', 'webp'],
        ['jpg', 'jpeg'],
      ]) {
        const metadata = await sharp(
          join(root, `public/media/projects/photo-${width}.${extension}`),
        ).metadata();
        expect(metadata.format).toBe(format);
        expect(metadata.width).toBe(width);
        expect(metadata.height).toBe(Math.round((width * 50) / 70));
      }
    }
    expect(await readFile(join(root, manifest.photos[0].source))).toEqual(originals);
  });

  it('has identical inventory and bytes on a second run', async () => {
    await buildImages(manifest, { root });
    const first = await inventory();
    await buildImages(manifest, { root });
    expect(await inventory()).toEqual(first);
    expect(first).toHaveLength(17);
  });

  it('deduplicates role heights, caps Hero 2x and preserves transparent white alpha', async () => {
    await buildImages(manifest, { root });
    const heights = [24, 32, 40, 48, 64, 80, 200, 241];
    expect((await readdir(join(root, 'public/media/logo'))).length).toBe(heights.length);
    for (const height of heights) {
      const file = join(root, `public/media/logo/white-${height}.png`);
      const metadata = await sharp(file).metadata();
      expect(metadata.height).toBe(height);
      expect(metadata.width).toBe(Math.round((height * 459) / 241));
      expect(metadata.hasAlpha).toBe(true);
      const stats = await sharp(file).stats();
      expect(stats.channels[3].min).toBeLessThan(255);
      expect(stats.channels[0].min).toBe(255);
    }
  });

  it.each([[], [0], [-1], [1.5], [NaN]].map((widths) => ({ widths })))(
    'rejects invalid widths $widths with item diagnostics',
    async ({ widths }) => {
      manifest.photos[0].widths = widths;
      await expect(buildImages(manifest, { root })).rejects.toThrow(/photo.*widths/i);
    },
  );

  it.each([
    '../escape',
    '/absolute',
    'media/../escape',
    'https://remote/img',
    'media/projects/bad?query',
    'media/projects/a.jpg',
  ])('rejects unsafe output %s', async (base) => {
    manifest.photos[0].base = base;
    await expect(buildImages(manifest, { root })).rejects.toThrow(/photo.*base/i);
  });

  it('rejects missing and escaping sources', async () => {
    manifest.photos[0].source = 'assets/media/brochure/missing.jpg';
    await expect(buildImages(manifest, { root })).rejects.toThrow(/photo.*source/i);
    manifest.photos[0].source = '../photo.jpg';
    await expect(buildImages(manifest, { root })).rejects.toThrow(/photo.*source/i);
  });

  it('rejects symlink output escapes before writing', async () => {
    const outside = await mkdtemp(join(tmpdir(), 'kva-outside-'));
    try {
      await mkdir(join(root, 'public/media'), { recursive: true });
      await symlink(outside, join(root, 'public/media/projects'));
      await expect(buildImages(manifest, { root })).rejects.toThrow(/photo.*(symlink|escape)/i);
      expect(await readdir(outside)).toEqual([]);
    } finally {
      await rm(outside, { recursive: true, force: true });
    }
  });

  it('rejects duplicate IDs, destinations and unexpected fields before emitting files', async () => {
    manifest.photos.push({ ...manifest.photos[0], id: 'duplicate' });
    await expect(buildImages(manifest, { root })).rejects.toThrow(/duplicate.*destination/i);
    manifest.photos[1].base = 'media/projects/other';
    manifest.photos[1].id = 'photo';
    await expect(buildImages(manifest, { root })).rejects.toThrow(/photo.*duplicate.*id/i);
    await expect(buildImages({ ...manifest, extra: true }, { root })).rejects.toThrow(/extra/i);
  });

  it('rejects manifest budgets above category ceilings', async () => {
    manifest.photos[0].budgetBytes = 120001;
    await expect(buildImages(manifest, { root })).rejects.toThrow(/photo.*budget.*120000/i);
    manifest.photos[0].base = 'media/backgrounds/photo';
    manifest.photos[0].budgetBytes = 250001;
    await expect(buildImages(manifest, { root })).rejects.toThrow(/photo.*budget.*250000/i);
  });

  it('identifies a zero-dimension resize plan before writing', async () => {
    await sharp({ create: { width: 1000, height: 1, channels: 3, background: '#357953' } })
      .jpeg()
      .toFile(join(root, manifest.photos[0].source));
    manifest.photos[0].widths = [1];
    await expect(buildImages(manifest, { root })).rejects.toThrow(/photo.*width 1.*dimension/i);
    await expect(readdir(join(root, 'public'))).rejects.toThrow(/ENOENT/);
  });

  it('rejects a CLI provenance symlink before changing its external target', async () => {
    await mkdir(join(root, 'scripts'));
    await mkdir(join(root, 'public/media'), { recursive: true });
    await writeFile(
      join(root, 'scripts/build-images.mjs'),
      await readFile('scripts/build-images.mjs'),
    );
    await writeFile(join(root, 'scripts/images.manifest.json'), JSON.stringify(manifest));
    await symlink(resolve('node_modules'), join(root, 'node_modules'));
    const sentinel = join(root, 'external.md');
    await writeFile(sentinel, 'unchanged');
    await symlink(sentinel, join(root, 'public/media/PROVENANCE.md'));
    const result = spawnSync(process.execPath, [join(root, 'scripts/build-images.mjs')], {
      encoding: 'utf8',
      timeout: 10000,
    });
    expect(result.status, result.stderr).toBe(1);
    expect(result.stderr).toMatch(/provenance.*symlink/i);
    expect(await readFile(sentinel, 'utf8')).toBe('unchanged');
    expect(await readdir(join(root, 'public/media'))).toEqual(['PROVENANCE.md']);
  });

  it.each(['webp', 'jpeg'])(
    'checks the %s per-format budget after earlier formats pass',
    async (format) => {
      manifest.logos = [];
      manifest.photos[0].widths = [format === 'webp' ? 128 : 32];
      if (format === 'webp') {
        const pixels = Buffer.alloc(128 * 128 * 3);
        let seed = 123456;
        for (let index = 0; index < pixels.length; index++) {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
          pixels[index] = seed >>> 24;
        }
        await sharp(pixels, { raw: { width: 128, height: 128, channels: 3 } })
          .jpeg({ quality: 95 })
          .toFile(join(root, manifest.photos[0].source));
      }
      const baseline = await buildImages(manifest, { root, outputRoot: join(root, 'baseline') });
      const targetIndex = format === 'webp' ? 1 : 2;
      const budget = baseline.files[targetIndex].bytes - 1;
      expect(baseline.files.slice(0, targetIndex).every((file) => file.bytes <= budget)).toBe(true);
      manifest.photos[0].budgetBytes = budget;
      await expect(buildImages(manifest, { root })).rejects.toThrow(
        new RegExp(`photo.*${format}.*width ${manifest.photos[0].widths[0]}.*${budget} bytes`),
      );
      await expect(readdir(join(root, 'public'))).rejects.toThrow(/ENOENT/);
    },
  );

  it('derives provenance from inspected sources and manifest roles', async () => {
    const result = await buildImages(manifest, { root });
    expect(result.provenance).not.toContain('Hero cover source is 740x556');
    expect(result.provenance).not.toContain('Targets: 320/640/960/1280px');
    expect(result.provenance).toContain('2x: 241px (full 400px unavailable)');
    expect(result.provenance).toContain('assets/media/brochure/photo.jpg | 70x50');
  });

  it.each([
    ['Hero', 250000],
    ['card', 120000],
  ])(
    'fails oversized %s including largest fallback with format, width and byte limit',
    async (_role, budgetBytes) => {
      const pixels = Buffer.alloc(1200 * 1200 * 3);
      let seed = 123456;
      for (let index = 0; index < pixels.length; index++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        pixels[index] = seed >>> 24;
      }
      await sharp(pixels, { raw: { width: 1200, height: 1200, channels: 3 } })
        .jpeg({ quality: 95 })
        .toFile(join(root, manifest.photos[0].source));
      manifest.photos[0].widths = [32, 1200];
      manifest.photos[0].budgetBytes = budgetBytes;
      manifest.photos[0].base =
        budgetBytes === 250000 ? 'media/backgrounds/photo' : 'media/projects/photo';
      await expect(buildImages(manifest, { root })).rejects.toThrow(
        new RegExp(`photo.*avif.*1200.*exceeds ${budgetBytes} bytes`),
      );
      await expect(readdir(join(root, 'public'))).rejects.toThrow(/ENOENT/);
    },
    30000,
  );

  it('keeps generation explicit, the encoder pinned/dev-only and build/CI commands independent', async () => {
    const pkg = JSON.parse(await readFile('package.json', 'utf8'));
    expect(pkg.devDependencies.sharp).toBe('0.35.5');
    expect(pkg.dependencies.sharp).toBeUndefined();
    expect(pkg.scripts['images:build']).toBe('node scripts/build-images.mjs');
    for (const [name, command] of Object.entries(pkg.scripts)) {
      if (name !== 'images:build') expect(command, name).not.toMatch(/images:build|build-images/);
    }
    for (const file of await readdir('.github/workflows')) {
      const workflow = parse(await readFile(`.github/workflows/${file}`, 'utf8'));
      expect(JSON.stringify(workflow), file).not.toMatch(/images:build|build-images/);
    }
  });
});

import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const encoders = {
  avif: { quality: 45, effort: 6, chromaSubsampling: '4:2:0', bitdepth: 8 },
  webp: { quality: 52, effort: 6, alphaQuality: 100 },
  jpeg: { quality: 52, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' },
  png: { compressionLevel: 9, adaptiveFiltering: false, palette: false },
};
const formats = [
  ['avif', 'avif'],
  ['webp', 'webp'],
  ['jpg', 'jpeg'],
];
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const integers = (values) =>
  Array.isArray(values) &&
  values.length > 0 &&
  values.every((value) => Number.isSafeInteger(value) && value > 0);
const uniqueSorted = (values) => [...new Set(values)].sort((first, second) => first - second);

function fail(id, message) {
  throw new Error(`${id}: ${message}`);
}

function fields(value, allowed, id) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(id, 'expected object');
  for (const key of Object.keys(value))
    if (!allowed.includes(key)) fail(id, `unexpected field ${key}`);
  for (const key of allowed) if (!Object.hasOwn(value, key)) fail(id, `missing ${key}`);
}

function safePath(value, prefix, id, field) {
  if (
    typeof value !== 'string' ||
    !value.startsWith(prefix) ||
    !/^[a-zA-Z0-9_/-]+(?:\.[a-zA-Z0-9]+)?$/.test(value) ||
    value.split('/').some((part) => !part || part === '.' || part === '..')
  ) {
    fail(id, `unsafe ${field}: ${String(value)}`);
  }
}

async function noSymlinks(path, id) {
  let current = path;
  while (true) {
    try {
      if ((await lstat(current)).isSymbolicLink()) fail(id, `symlink escape: ${path}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

export async function buildImages(manifest, { root, outputRoot = resolve(root, 'public') }) {
  root = await realpath(root);
  outputRoot = resolve(outputRoot);
  if (
    relative(root, outputRoot).startsWith(`..${sep}`) ||
    relative(root, outputRoot) === '..' ||
    isAbsolute(relative(root, outputRoot)) ||
    outputRoot === root
  )
    fail('manifest', 'outputRoot must stay beneath root');
  fields(manifest, ['version', 'photos', 'logos'], 'manifest');
  if (manifest.version !== 1 || !Array.isArray(manifest.photos) || !Array.isArray(manifest.logos))
    fail('manifest', 'expected version 1 and photos/logos arrays');
  const ids = new Set();
  const destinations = new Set();
  const plans = [];
  const photos = [];
  const sources = [];
  const roles = [];
  for (const [kind, entries] of [
    ['photo', manifest.photos],
    ['logo', manifest.logos],
  ]) {
    for (const [index, item] of entries.entries()) {
      const id = item?.id ?? `${kind}[${index}]`;
      fields(
        item,
        kind === 'photo'
          ? ['id', 'source', 'base', 'widths', 'budgetBytes']
          : ['id', 'source', 'base', 'heights', 'densities'],
        id,
      );
      if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id)) fail(id, 'invalid id');
      if (ids.has(id)) fail(id, 'duplicate id');
      ids.add(id);
      safePath(item.source, 'assets/media/brochure/', id, 'source');
      safePath(item.base, kind === 'logo' ? 'media/logo/' : 'media/', id, 'base');
      if (
        item.base.includes('.') ||
        (kind === 'photo' && !/^media\/(backgrounds|projects)\//.test(item.base))
      )
        fail(id, 'invalid base');
      if (
        kind === 'photo' &&
        (!integers(item.widths) || !Number.isSafeInteger(item.budgetBytes) || item.budgetBytes < 1)
      )
        fail(id, 'invalid widths or budgetBytes');
      if (kind === 'photo') {
        const ceiling = item.base.startsWith('media/projects/') ? 120000 : 250000;
        if (item.budgetBytes > ceiling) fail(id, `budgetBytes exceeds ${ceiling} bytes`);
      }
      if (
        kind === 'logo' &&
        (!integers(item.heights) ||
          !integers(item.densities) ||
          item.densities.some((density) => ![1, 2].includes(density)))
      )
        fail(id, 'invalid heights or densities');
      const source = resolve(root, item.source);
      await noSymlinks(source, id);
      let bytes;
      let metadata;
      try {
        bytes = await readFile(source);
        metadata = await sharp(bytes).metadata();
      } catch (error) {
        fail(id, `invalid source ${item.source}: ${error.message}`);
      }
      if (
        !metadata.width ||
        !metadata.height ||
        (metadata.pages ?? 1) !== 1 ||
        (metadata.orientation ?? 1) !== 1
      )
        fail(id, 'source must be a single, unrotated image');
      if (kind === 'logo' && (metadata.format !== 'png' || !metadata.hasAlpha))
        fail(id, 'logo source must be transparent PNG');
      sources.push({
        source: item.source,
        sha256: hash(bytes),
        width: metadata.width,
        height: metadata.height,
      });
      const sizes = uniqueSorted(
        kind === 'photo'
          ? item.widths.map((width) => Math.min(width, metadata.width))
          : item.heights.flatMap((height) =>
              item.densities.map((density) => Math.min(height * density, metadata.height)),
            ),
      );
      if (kind === 'photo')
        photos.push({
          id,
          base: item.base,
          widths: sizes,
          width: metadata.width,
          height: metadata.height,
        });
      else
        roles.push(
          `${id}: ${item.heights.map((height) => `${height}px => ${item.densities.map((density) => `${density}x: ${Math.min(height * density, metadata.height)}px${height * density > metadata.height ? ` (full ${height * density}px unavailable)` : ''}`).join(', ')}`).join('; ')}`,
        );
      for (const size of sizes) {
        for (const [extension, format] of kind === 'photo' ? formats : [['png', 'png']]) {
          const path = `${item.base}-${size}.${extension}`;
          if (destinations.has(path)) fail(id, `duplicate destination ${path}`);
          destinations.add(path);
          await noSymlinks(resolve(outputRoot, path), id);
          plans.push({
            id,
            bytes,
            size,
            format,
            path,
            kind,
            budget: item.budgetBytes,
            width: kind === 'photo' ? size : Math.round((size * metadata.width) / metadata.height),
            height: kind === 'photo' ? Math.round((size * metadata.height) / metadata.width) : size,
          });
        }
      }
    }
  }
  const encoded = [];
  for (const plan of plans) {
    if (plan.width < 1 || plan.height < 1)
      fail(plan.id, `width ${plan.size} produces a zero output dimension`);
    const buffer = await sharp(plan.bytes)
      .resize({ width: plan.width, height: plan.height, fit: 'fill', withoutEnlargement: true })
      .toFormat(plan.format, encoders[plan.format])
      .toBuffer();
    if (plan.kind === 'photo' && buffer.length > plan.budget)
      fail(
        plan.id,
        `${plan.format} width ${plan.size}: ${buffer.length} exceeds ${plan.budget} bytes`,
      );
    encoded.push({ path: plan.path, buffer, sha256: hash(buffer), bytes: buffer.length });
  }
  for (const file of encoded) {
    await mkdir(dirname(resolve(outputRoot, file.path)), { recursive: true });
    await writeFile(resolve(outputRoot, file.path), file.buffer);
  }
  const provenance = [
    '# Image Derivative Provenance',
    '',
    'Source: kVA brochure assets supplied with this repository. No additional permission or rights are asserted. Originals remain unchanged under assets/media/brochure; retain and confirm publication permissions with the content owner.',
    '',
    `Encoder: Sharp ${sharp.versions.sharp}; libvips ${sharp.versions.vips}; aom ${sharp.versions.aom}; webp ${sharp.versions.webp}; mozjpeg ${sharp.versions.mozjpeg}.`,
    '',
    'Explicit settings (metadata stripped; no autorotation or upscale):',
    '',
    '```json',
    JSON.stringify(encoders, null, 2),
    '```',
    '',
    'Targets are manifest-defined, capped and deduplicated per source. Source resolution is a hard ceiling, not a claim of full 2x availability. Actual dimensions and candidates are recorded below.',
    '',
    'Logo role mappings show source-capped physical heights and identify unavailable full-density targets. PNG alpha is preserved; shared physical sizes deduplicate within each entry.',
    '',
    ...roles.map((role) => `- ${role}`),
    '',
    '## Originals',
    '',
    '| Source | Dimensions | SHA-256 |',
    '| --- | --- | --- |',
    ...sources.map(
      (source) => `| ${source.source} | ${source.width}x${source.height} | ${source.sha256} |`,
    ),
    '',
    '## Derivatives',
    '',
    '| Path | Bytes | SHA-256 |',
    '| --- | --- | --- |',
    ...encoded.map((file) => `| ${file.path} | ${file.bytes} | ${file.sha256} |`),
    '',
  ].join('\n');
  return {
    photos,
    files: encoded.map(({ path, bytes, sha256 }) => ({ path, bytes, sha256 })),
    provenance,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = fileURLToPath(new URL('../', import.meta.url));
    const manifest = JSON.parse(
      await readFile(resolve(root, 'scripts/images.manifest.json'), 'utf8'),
    );
    const provenancePath = resolve(root, 'public/media/PROVENANCE.md');
    await noSymlinks(provenancePath, 'provenance');
    const result = await buildImages(manifest, { root });
    await noSymlinks(provenancePath, 'provenance');
    await writeFile(provenancePath, result.provenance);
    console.log(
      `Generated ${result.files.length} derivatives for ${result.photos.length} photos and ${manifest.logos.length} logo entries.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

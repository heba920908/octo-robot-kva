import { Injectable } from '@angular/core';
import { hero } from './hero.content';
import { siteContent } from './site.content';
import { images, type ResponsiveImageMetadata } from './images.content';
import { privacyNotice } from './privacy-notice.content';
import { services, type ServiceContent } from './services.content';
import { uiStrings, type UiStringKey, type UiStringParameters } from './ui-strings.content';

export interface ResolvedService extends Omit<ServiceContent, 'image'> {
  readonly image?: ResponsiveImageMetadata;
}

interface UiString {
  readonly text: string;
  readonly parameters: readonly string[];
}

const sectionOrder = [
  'hero',
  'servicios',
  'proyectos',
  'nosotros',
  'confianza',
  'contacto',
] as const;
export type SectionId = (typeof sectionOrder)[number];
export interface SectionCandidate {
  readonly id: SectionId;
  readonly content?: unknown;
}

function hasContent(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasContent);
  if (value && typeof value === 'object') {
    return Object.entries(value).some(
      ([key, child]) => !['id', 'label', 'navigationLabel'].includes(key) && hasContent(child),
    );
  }
  return false;
}

export function populatedSections(candidates: readonly SectionCandidate[]): readonly SectionId[] {
  return Object.freeze(
    sectionOrder.filter((id) =>
      candidates.some((candidate) => candidate.id === id && hasContent(candidate.content)),
    ),
  );
}

export function resolveServices(
  docs: readonly ServiceContent[],
  imageMetadata: Readonly<Record<string, ResponsiveImageMetadata>> = images,
): readonly ResolvedService[] {
  const ids = new Set<string>();
  for (const { id } of docs) {
    if (ids.has(id)) throw new Error(`Duplicate Service id: ${id}`);
    ids.add(id);
  }
  return [...docs]
    .sort((a, b) => a.order - b.order)
    .map(({ image, ...service }) => {
      if (!image) return service;
      if (!Object.hasOwn(imageMetadata, image.id)) {
        throw new Error(`Service ${service.id}: unknown image id ${image.id}`);
      }
      return { ...service, image: { ...imageMetadata[image.id], alt: image.alt } };
    });
}

function freezeContent<Content extends object>(content: Content): Readonly<Content> {
  for (const value of Object.values(content)) {
    if (value && typeof value === 'object') freezeContent(value);
  }
  return Object.freeze(content);
}

export function formatUiString(item: UiString, values: unknown = {}): string {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    throw new Error('Invalid parameters: expected a named map');
  }
  const parameters = values as Record<string, unknown>;
  for (const name of Object.keys(parameters)) {
    if (!item.parameters.includes(name)) throw new Error(`Unknown parameter: ${name}`);
  }
  for (const name of item.parameters) {
    if (!Object.hasOwn(parameters, name)) throw new Error(`Missing parameter: ${name}`);
    if (typeof parameters[name] !== 'string' && typeof parameters[name] !== 'number') {
      throw new Error(`Invalid parameter: ${name}`);
    }
  }
  return item.text.replace(/\{([^{}]+)\}/g, (_token, name: string) => {
    if (!item.parameters.includes(name)) throw new Error(`Unknown placeholder: ${name}`);
    return String(parameters[name]);
  });
}

@Injectable({ providedIn: 'root' })
export class ContentFacade {
  readonly site = freezeContent(siteContent);
  readonly ui = freezeContent(uiStrings);
  readonly images = freezeContent(images);
  readonly privacy = freezeContent(privacyNotice);
  readonly hero = freezeContent(hero);
  readonly services = freezeContent(resolveServices(services));
  readonly visibleSections = populatedSections([
    { id: 'hero', content: this.hero.headline },
    { id: 'servicios', content: this.services },
    { id: 'contacto', content: this.site.contact.email },
  ]);

  format<Key extends UiStringKey>(
    key: Key,
    ...args: keyof UiStringParameters<Key> extends never
      ? [values?: Record<string, never>]
      : [values: UiStringParameters<Key>]
  ): string {
    if (!Object.hasOwn(this.ui, key)) throw new Error(`Unknown UI string: ${key}`);
    return formatUiString(this.ui[key], args[0]);
  }
}

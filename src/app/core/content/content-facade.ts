import { Injectable } from '@angular/core';
import { siteContent } from './site.content';
import { uiStrings, type UiStringKey, type UiStringParameters } from './ui-strings.content';

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
  readonly visibleSections = populatedSections([]);

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

export function readText(path: string): string;
export function sourceFiles(root?: string): string[];
export function checkTemplate(source: string, file: string): string[];
export function checkSource(
  source: string,
  file: string,
  loadTemplate?: (file: string) => string,
): string[];
export function scanContentProject(root?: string): string[];
export function runStaticVerificationFixture(
  contamination?: string,
  mutateHtml?: (html: string) => string,
): {
  status: number | null;
  output: string;
};
export function validationLeaks(input?: {
  sources?: Record<string, string>;
  artifacts?: Record<string, string>;
  entries?: readonly string[];
}): string[];

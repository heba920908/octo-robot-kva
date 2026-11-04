export interface PhotoEntry {
  id: string;
  source: string;
  base: string;
  widths: number[];
  budgetBytes: number;
}
export interface LogoEntry {
  id: string;
  source: string;
  base: string;
  heights: number[];
  densities: number[];
}
export interface ImageManifest {
  version: 1;
  photos: PhotoEntry[];
  logos: LogoEntry[];
}
export interface GeneratedPhoto {
  id: string;
  base: string;
  widths: number[];
  width: number;
  height: number;
}
export function buildImages(
  manifest: unknown,
  options: { root: string; outputRoot?: string },
): Promise<{
  photos: GeneratedPhoto[];
  files: { path: string; sha256: string; bytes: number }[];
  provenance: string;
}>;

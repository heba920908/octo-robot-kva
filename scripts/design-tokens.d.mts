export interface TokenFiles {
  readonly scss: string;
  readonly json: string;
}

export interface TokenDrift {
  readonly file: string;
  readonly token: string;
  readonly expected: string;
  readonly actual: string;
}

export function buildTokenFiles(designMarkdown: string): Promise<TokenFiles>;
export function findTokenDrift(): Promise<readonly TokenDrift[]>;

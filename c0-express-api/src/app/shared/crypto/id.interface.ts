export interface Id {
  generate: () => Promise<string>;
}
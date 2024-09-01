
export interface Emoji {
  file: File;
  name: string;
  category: string;
  tags: string;
  license: string | null;
  localOnly: boolean;
  isSensitive: boolean;
}

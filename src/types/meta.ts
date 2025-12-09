/**
 * Misskeyの絵文字インポートzipファイル用のメタデータ型定義
 */

export interface MetaEmoji {
  fileName: string;
  downloaded: boolean;
  emoji: {
    name: string;
    category: string;
    aliases: string[];
    license: string;
    localOnly: boolean;
    isSensitive: boolean;
  };
}

export interface MetaData {
  metaVersion: number;
  host: string;
  exportedAt: string;
  emojis: MetaEmoji[];
}
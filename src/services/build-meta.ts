import type { Emoji } from "../models/emoji";
import type { MetaData } from "../types/meta";

/**
 * Misskeyの絵文字インポートzipファイル用のメタデータJSONファイルを生成します。
 * @param emojis 絵文字データ
 * @returns メタデータJSON
 */
/**
 * ファイル名から拡張子を取得します。
 */
const getExtension = (filename: string): string => {
  const index = filename.lastIndexOf(".");
  return index === -1 ? "" : filename.slice(index);
};

/**
 * 絵文字名と元のファイル名からZIP用のファイル名を生成します。
 * Misskeyのバリデーション(^[a-zA-Z0-9_]+?([a-zA-Z0-9\.]+)?$)に適合するよう、
 * 絵文字名をベースにしたファイル名を使用します。
 */
export const buildEmojiFileName = (
  emojiName: string,
  originalFileName: string,
): string => {
  return emojiName + getExtension(originalFileName);
};

export const buildMeta = (emojis: Emoji[]): MetaData => {
  return {
    metaVersion: 2,
    host: "emojipacker.lutic.at",
    exportedAt: new Date().toISOString(),
    emojis: emojis.map((e) => ({
      fileName: buildEmojiFileName(e.name, e.file.name),
      downloaded: true,
      emoji: {
        name: e.name,
        category: e.category,
        // タグはスペース区切りで配列に変換。全ての空白文字をASCIIのスペースに変換
        aliases: e.tags
          .replace(/\s+/g, " ")
          .split(" ")
          .filter((tag) => tag !== ""),
        license: e.license,
        localOnly: e.localOnly,
        isSensitive: e.isSensitive,
      },
    })),
  };
};

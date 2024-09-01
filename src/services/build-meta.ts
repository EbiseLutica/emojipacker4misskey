import { Emoji } from "../models/emoji";

/**
 * Misskeyの絵文字インポートzipファイル用のメタデータJSONファイルを生成します。
 * @param emojis 絵文字データ
 * @returns メタデータJSON
 */
export const buildMeta = (emojis: Emoji[]) => {
    return {
        metaVersion: 2,
        host: 'emojipacker.lutic.at',
        exportedAt: new Date().toISOString(),
        emojis: emojis.map(e => ({
            fileName: e.file.name,
            downloaded: true,
            emoji: {
                name: e.name,
                category: e.category,
                // タグはスペース区切りで配列に変換。全ての空白文字をASCIIのスペースに変換
                aliases: e.tags.replace(/\s+/g, ' ').split(' ').filter((tag) => tag !== ''),
                license: e.license,
                localOnly: e.localOnly,
                isSensitive: e.isSensitive,
            },
        })),
    };
};

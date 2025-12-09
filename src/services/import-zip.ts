import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';
import type { Emoji } from '../models/emoji';
import type { MetaData } from '../types/meta';

/**
 * zipファイルからEmoji配列を復元します。
 * @param zipFile インポートするzipファイル
 * @returns Emoji配列
 */
export const importZip = async (zipFile: File): Promise<Emoji[]> => {
  const zipReader = new ZipReader(new BlobReader(zipFile));
  const entries = await zipReader.getEntries();

  // meta.jsonを探す
  const metaEntry = entries.find((entry) => entry.filename === 'meta.json');
  if (!metaEntry || !metaEntry.getData) {
    throw new Error('meta.jsonが見つかりません');
  }

  // meta.jsonを読み込む
  const metaBlob = await metaEntry.getData(new BlobWriter());
  const metaText = await metaBlob.text();
  const meta: MetaData = JSON.parse(metaText);

  // 各絵文字ファイルを読み込んでEmoji配列を作成
  const emojis: Emoji[] = [];
  for (const metaEmoji of meta.emojis) {
    const fileEntry = entries.find((entry) => entry.filename === metaEmoji.fileName);
    if (!fileEntry || !fileEntry.getData) {
      console.warn(`ファイル ${metaEmoji.fileName} が見つかりません`);
      continue;
    }

    const fileBlob = await fileEntry.getData(new BlobWriter());
    const file = new File([fileBlob], metaEmoji.fileName, { type: fileBlob.type });

    emojis.push({
      file,
      name: metaEmoji.emoji.name,
      category: metaEmoji.emoji.category,
      tags: metaEmoji.emoji.aliases.join(' '),
      license: metaEmoji.emoji.license,
      localOnly: metaEmoji.emoji.localOnly,
      isSensitive: metaEmoji.emoji.isSensitive,
    });
  }

  await zipReader.close();
  return emojis;
};
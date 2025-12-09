import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';
import type { Emoji } from '../models/emoji';
import type { MetaData } from '../types/meta';

export interface ImportProgress {
  current: number;
  total: number;
  stage: 'reading_meta' | 'loading_emojis';
  message: string;
}

/**
 * zipファイルからEmoji配列を復元します。
 * @param zipFile インポートするzipファイル
 * @param onProgress 進捗を通知するコールバック関数
 * @returns Emoji配列
 */
export const importZip = async (
  zipFile: File,
  onProgress?: (progress: ImportProgress) => void
): Promise<Emoji[]> => {
  const zipReader = new ZipReader(new BlobReader(zipFile));
  const entries = await zipReader.getEntries();

  onProgress?.({
    current: 0,
    total: 1,
    stage: 'reading_meta',
    message: 'meta.jsonを読み込んでいます...',
  });

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
  const totalEmojis = meta.emojis.length;

  for (let i = 0; i < meta.emojis.length; i++) {
    const metaEmoji = meta.emojis[i];
    
    onProgress?.({
      current: i,
      total: totalEmojis,
      stage: 'loading_emojis',
      message: `絵文字を読み込んでいます... (${i + 1}/${totalEmojis})`,
    });

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

  // 最終的な100%の進捗を報告
  onProgress?.({
    current: totalEmojis,
    total: totalEmojis,
    stage: 'loading_emojis',
    message: `絵文字の読み込みが完了しました (${totalEmojis}/${totalEmojis})`,
  });

  await zipReader.close();
  return emojis;
};
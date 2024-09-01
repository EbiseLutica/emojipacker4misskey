import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js';

import type { Emoji } from '../models/emoji';
import { buildMeta } from './build-meta';

/**
 * 絵文字データからzipファイルを作成します。
 * @param emojis 絵文字データ
 * @returns zipファイルのBlob
 */
export const makeZip = (emojis: Emoji[]): Promise<Blob> => {
  // zipファイルには、メタデータであるmeta.jsonおよび、絵文字画像ファイルが含まれる
  const meta = JSON.stringify(buildMeta(emojis));
  const zipWriter = new ZipWriter(new BlobWriter('application/zip'));
  zipWriter.add('meta.json', new TextReader(meta));
  for (const emoji of emojis) {
    zipWriter.add(emoji.file.name, new BlobReader(emoji.file));
  }
  return zipWriter.close();
};

import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import type { FormValues } from './models/form-values';
import { SectionList } from './components/SectionList';
import { makeZip } from './services/make-zip';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';

import './App.scss';
import { Help } from './components/Help';

function App() {
  const methods = useForm<FormValues>();
  const [isDownloadedModalShown, setDownloadedModalShown] = useState(false);

  const onValid: SubmitHandler<FormValues> = async ({ emojis }) => {
    const zippedBlob = await makeZip(emojis);
    const url = URL.createObjectURL(zippedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emojis.zip';
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedModalShown(true);
  };

  const count = methods.watch('emojis')?.length;

  return (
    <div>
      <main className="ep-root p-5 bg-white rounded-5 my-5 shadow">
        <header>
          <h1>Emoji Packer for Misskey (β)</h1>
          <ul>
            <li>
              複数の絵文字画像を、Misskeyで使える絵文字インポート用のzipファイルに変換するサービスです。
            </li>
            <li>Misskey 2024.8.0 で動作確認しています。</li>
            <li>
              お使いの端末だけで動作するため、アップロードした画像や入力値は、特定のサーバー等には一切送信されません。
            </li>
            <li>
              なにか不具合がありましたら、
              <a href="https://mk.shrimpia.network/@Lutica">
                @Lutica@mk.shrimpia.network
              </a>
              まで。
            </li>
          </ul>
        </header>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onValid)}>
            <SectionList />
            <button
              type="submit"
              className="btn btn-primary d-block mt-5 mx-auto px-5 fs-5"
              disabled={!count}
            >
              絵文字パックを生成
            </button>
            <Help />
          </form>
        </FormProvider>
      </main>
      <footer className="text-center my-5 text-muted">
        (C) 2024 Ebise Lutica
      </footer>
      <Modal show={isDownloadedModalShown} onHide={() => setDownloadedModalShown(false)}>
        <Modal.Header closeButton>
          <Modal.Title>絵文字パックをダウンロードしました。</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>ダウンロードされたzipファイルをMisskeyのカスタム絵文字管理画面でインポートしてください。</p>
          <p>Emoji Packerがお役に立ちましたら、SNSでのシェアをお願いします！</p>
          <div className="hstack gap-3 mb-3">
            <a
              href="https://github.com/EbiseLutica/emojipacker4misskey"
              className="btn btn-outline-primary"
              target="_blank"
              rel="noreferrer noopener">
              GitHubでStar
            </a>
            <a href="https://misskey-hub.net/share/?text=Emoji+Packer+for+Misskey%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%81%9F+%23emojipacker&url=https:%2F%2Femojipacker.lutic.at&visibility=public&localOnly=0&manualInstance=mk.shrimpia.network"
              className="btn btn-outline-primary"
              target="_blank"
              rel="noreferrer noopener">
              Misskeyでシェア
            </a>
          </div>
          <Help />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;

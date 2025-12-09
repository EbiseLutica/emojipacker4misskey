import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import type { FormValues } from './models/form-values';
import { SectionList } from './components/SectionList';
import { makeZip } from './services/make-zip';
import { importZip, type ImportProgress } from './services/import-zip';
import { Modal } from 'react-bootstrap';
import { useState, useRef } from 'react';
import type { Emoji } from './models/emoji';

import './App.scss';
import { Help } from './components/Help';
import { ImportModal } from './components/ImportModal';

function App() {
  const methods = useForm<FormValues>();
  const [isDownloadedModalShown, setDownloadedModalShown] = useState(false);
  const [isImportErrorModalShown, setImportErrorModalShown] = useState(false);
  const [importErrorMessage, setImportErrorMessage] = useState('');
  const [isImportModalShown, setImportModalShown] = useState(false);
  const [isImportLoadingShown, setImportLoadingShown] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [importedEmojis, setImportedEmojis] = useState<Emoji[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportLoadingShown(true);
    setImportProgress(null);
    try {
      const emojis = await importZip(file, setImportProgress);
      setImportedEmojis(emojis);
      setImportModalShown(true);
      // ファイル入力をリセット（同じファイルを再度選択できるようにする）
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('インポートエラー:', error);
      setImportErrorMessage(error instanceof Error ? error.message : 'zipファイルの読み込みに失敗しました');
      setImportErrorModalShown(true);
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setImportLoadingShown(false);
      setImportProgress(null);
    }
  };

  const handleReplaceEmojis = () => {
    methods.setValue('emojis', importedEmojis);
    setImportModalShown(false);
    setImportedEmojis([]);
  };

  const handleAppendEmojis = () => {
    const currentEmojis = methods.getValues('emojis') || [];
    methods.setValue('emojis', [...currentEmojis, ...importedEmojis]);
    setImportModalShown(false);
    setImportedEmojis([]);
  };

  const handleCloseImportModal = () => {
    setImportModalShown(false);
    setImportedEmojis([]);
  };

  const count = methods.watch('emojis')?.length;

  return (
    <div>
      <main className="ep-root p-5 my-5">
        <header>
          <h1 className="fs-2">Emoji Packer for Misskey (β)</h1>
          <ul>
            <li>
              複数の絵文字画像を、Misskeyで使える絵文字インポート用のzipファイルに変換するサービスです。
            </li>
            <li>Misskey 2024.8.0-2025.11.0 で動作確認しています。</li>
            <li>
              お使いの端末で完結しており、アップロードした画像や入力値は外部サーバー等に一切送信されません。
            </li>
            <li>
              なにか不具合がありましたら、お手数ですが
              <a href="https://mk.shrimpia.network/@Lutica">
                @Lutica@mk.shrimpia.network
              </a>
              までご連絡ください。
            </li>
          </ul>
        </header>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onValid)}>
            <SectionList />
            <div className="d-flex gap-3 justify-content-center mt-5">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn-secondary px-5 fs-5"
                onClick={handleImportClick}
              >
                zipファイルをインポート
              </button>
              <button
                type="submit"
                className="btn btn-primary px-5 fs-5"
                disabled={!count}
              >
                絵文字パックを生成
              </button>
            </div>
            <Help />
          </form>
        </FormProvider>
      </main>
      <footer className="text-center my-5 text-muted">
        (C) 2024-2025 Ebise Lutica | <a href="https://github.com/EbiseLutica/emojipacker4misskey.git" target="_blank" rel="noreferrer noopener">GitHub</a>
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
      <Modal show={isImportErrorModalShown} onHide={() => setImportErrorModalShown(false)}>
        <Modal.Header closeButton>
          <Modal.Title>インポートエラー</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{importErrorMessage}</p>
          <p>正しい形式のzipファイルを選択してください。</p>
        </Modal.Body>
      </Modal>
      <Modal show={isImportLoadingShown} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">読み込み中...</span>
          </div>
          {importProgress ? (
            <>
              <p className="mb-2">{importProgress.message}</p>
              <div className="progress" role="progressbar" style={{ height: '25px' }}>
                <div
                  className="progress-bar progress-bar-striped"
                  style={{ width: `${Math.round((importProgress.current / importProgress.total) * 100)}%` }}
                  aria-valuenow={importProgress.current}
                  aria-valuemin={0}
                  aria-valuemax={importProgress.total}
                >
                  {importProgress.current} / {importProgress.total}
                </div>
              </div>
            </>
          ) : (
            <p className="mb-0">zipファイルを読み込み中...</p>
          )}
        </Modal.Body>
      </Modal>
      <ImportModal
        show={isImportModalShown}
        emojis={importedEmojis}
        onHide={handleCloseImportModal}
        onReplace={handleReplaceEmojis}
        onAppend={handleAppendEmojis}
      />
    </div>
  );
}

export default App;

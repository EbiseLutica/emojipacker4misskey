import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import type { FormValues } from "./models/form-values";
import { SectionList } from "./components/SectionList";
import { makeZip } from "./services/make-zip";
import { importZip, type ImportProgress } from "./services/import-zip";
import { useState, useEffect } from "react";
import type { Emoji } from "./models/emoji";

import "./styles/lutica/tokens.css";
import "./styles/lutica/bundle.css";
import "./App.scss";
import { Dialog } from "./components/Dialog";
import { Help } from "./components/Help";
import { ImportModal } from "./components/ImportModal";
import { Changelog } from "./components/Changelog";
import { changeLog } from "./changelog";

function App() {
  const methods = useForm<FormValues>();
  const [isDownloadedModalShown, setDownloadedModalShown] = useState(false);
  const [isImportErrorModalShown, setImportErrorModalShown] = useState(false);
  const [importErrorMessage, setImportErrorMessage] = useState("");
  const [isImportModalShown, setImportModalShown] = useState(false);
  const [isImportLoadingShown, setImportLoadingShown] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(
    null,
  );
  const [importedEmojis, setImportedEmojis] = useState<Emoji[]>([]);

  const onValid: SubmitHandler<FormValues> = async ({ emojis }) => {
    const zippedBlob = await makeZip(emojis);
    const url = URL.createObjectURL(zippedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emojis.zip";
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedModalShown(true);
  };

  const handleZipFile = async (file: File) => {
    setImportLoadingShown(true);
    setImportProgress(null);
    try {
      const emojis = await importZip(file, setImportProgress);
      setImportedEmojis(emojis);
      setImportModalShown(true);
    } catch (error) {
      console.error("インポートエラー:", error);
      setImportErrorMessage(
        error instanceof Error
          ? error.message
          : "zipファイルの読み込みに失敗しました",
      );
      setImportErrorModalShown(true);
    } finally {
      setImportLoadingShown(false);
      setImportProgress(null);
    }
  };

  const handleReplaceEmojis = () => {
    methods.setValue("emojis", importedEmojis);
    setImportModalShown(false);
    setImportedEmojis([]);
  };

  const handleAppendEmojis = () => {
    const currentEmojis = methods.getValues("emojis") || [];
    methods.setValue("emojis", [...currentEmojis, ...importedEmojis]);
    setImportModalShown(false);
    setImportedEmojis([]);
  };

  const handleCloseImportModal = () => {
    setImportModalShown(false);
    setImportedEmojis([]);
  };

  const count = methods.watch("emojis")?.length;

  // 絵文字がパックに存在するときにリロード・終了のハンドリングを行う
  useEffect(() => {
    if (!count) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [count]);

  return (
    <div>
      <main className="lu-container lu-container--wide lu-my-12">
        <header>
          <h1>
            Emoji Packer for Misskey <small>{changeLog[0].version}</small>
          </h1>
          <ul>
            <li>
              複数の絵文字画像を、Misskeyで使える絵文字インポート用のzipファイルに変換するサービスです。
            </li>
            <li>Misskey 2024.8.0-2025.12.0 で動作確認しています。</li>
            <li>
              お使いの端末で完結しており、アップロードした画像や入力値は外部サーバー等に一切送信されません。
            </li>
            <li>
              なにか不具合がありましたら、お手数ですが
              <a href="https://mk.lutic.at/@Lutica">@Lutica@mk.lutic.at</a>
              までご連絡ください。
            </li>
          </ul>
        </header>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onValid)}>
            <SectionList onZipFile={handleZipFile} />
            <div className="lu-stack lu-stack--horizontal lu-stack--justify-center lu-mt-12">
              <button
                type="submit"
                className="lu-button lu-button--primary lu-px-12"
                disabled={!count}
              >
                絵文字パックを生成
              </button>
            </div>
          </form>
        </FormProvider>
      </main>
      <div className="lu-container lu-container--wide lu-my-12">
        <Help />
        <Changelog />
      </div>
      <footer className="lu-text-center lu-my-12 lu-text-dimmed">
        (C) 2024-2026 Ebise Lutica |{" "}
        <a
          href="https://github.com/EbiseLutica/emojipacker4misskey.git"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </a>
      </footer>
      <Dialog
        show={isDownloadedModalShown}
        onHide={() => setDownloadedModalShown(false)}
        title="絵文字パックをダウンロードしました。"
        actions={
          <button
            type="button"
            className="lu-button"
            onClick={() => setDownloadedModalShown(false)}
          >
            閉じる
          </button>
        }
      >
        <p>
          ダウンロードされたzipファイルをMisskeyのカスタム絵文字管理画面でインポートしてください。
        </p>
        <p>Emoji Packerがお役に立ちましたら、SNSでのシェアをお願いします！</p>
        <div className="lu-stack lu-stack--horizontal lu-stack--wrap lu-stack--gap-3 lu-mb-4">
          <a
            href="https://github.com/EbiseLutica/emojipacker4misskey"
            className="lu-button"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHubでStar
          </a>
          <a
            href="https://misskey-hub.net/share/?text=Emoji+Packer+for+Misskey%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%81%9F+%23emojipacker&url=https:%2F%2Femojipacker.lutic.at&visibility=public&localOnly=0&manualInstance=mk.shrimpia.network"
            className="lu-button"
            target="_blank"
            rel="noreferrer noopener"
          >
            Misskeyでシェア
          </a>
        </div>
        <Help />
      </Dialog>
      <Dialog
        show={isImportErrorModalShown}
        onHide={() => setImportErrorModalShown(false)}
        title="インポートエラー"
        actions={
          <button
            type="button"
            className="lu-button"
            onClick={() => setImportErrorModalShown(false)}
          >
            閉じる
          </button>
        }
      >
        <p>{importErrorMessage}</p>
        <p>正しい形式のzipファイルを選択してください。</p>
      </Dialog>
      <Dialog
        show={isImportLoadingShown}
        ariaLabel="読み込み中"
        bodyClassName="lu-text-center"
      >
        <span className="lu-spinner" role="status" aria-label="読み込み中" />
        {importProgress ? (
          <>
            <p className="lu-mt-3 lu-mb-2">{importProgress.message}</p>
            <progress
              className="lu-progress"
              value={importProgress.current}
              max={importProgress.total}
            >
              {importProgress.current} / {importProgress.total}
            </progress>
            <div className="lu-text-small lu-text-dimmed lu-mt-1">
              {importProgress.current} / {importProgress.total}
            </div>
          </>
        ) : (
          <p className="lu-mt-3">zipファイルを読み込み中...</p>
        )}
      </Dialog>
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

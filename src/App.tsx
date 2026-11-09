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
import { AboutDialog } from "./components/AboutDialog";
import { Dialog } from "./components/Dialog";
import { Help } from "./components/Help";
import { ImportModal } from "./components/ImportModal";
import { changeLog } from "./changelog";

function App() {
  const methods = useForm<FormValues>();
  const [isAboutModalShown, setAboutModalShown] = useState(false);
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
      <header className="lu-navbar lu-navbar--fixed">
        <div className="lu-navbar__inner">
          <h1 className="lu-navbar__brand">
            Emoji Packer<small>{changeLog[0].version}</small>
          </h1>
          <nav className="lu-navbar__items">
            <button
              className="lu-button lu-button--sm"
              type="button"
              aria-haspopup="dialog"
              onClick={() => setAboutModalShown(true)}
            >
              About
            </button>
            <button className="lu-button lu-button--sm" type="button" aria-haspopup="menu" aria-expanded="true">dark/light/system</button>
          </nav>
        </div>
      </header>
      <main className="lu-container lu-container--wide lu-my-12">
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
      <AboutDialog
        show={isAboutModalShown}
        onHide={() => setAboutModalShown(false)}
      />
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
        
        <details>
          <summary>Misskeyへの絵文字パックのインポート方法</summary>
          <Help />
        </details>
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

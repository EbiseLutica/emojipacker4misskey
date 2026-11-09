import { useEffect, useRef } from "react";
import { Changelog } from "./Changelog";
import { Dialog } from "./Dialog";
import { HowToImport } from "./HowToImport";

type AboutDialogProps = {
  show: boolean;
  onHide: () => void;
  /** 開いたときに変更履歴の見出しまでスクロールする */
  scrollToChangelog?: boolean;
};

const TITLE_ID = "about-dialog-title";

/** サービスの説明、インポート方法、変更履歴、著作権表示をまとめたダイアログ。 */
export const AboutDialog: React.FC<AboutDialogProps> = ({
  show,
  onHide,
  scrollToChangelog,
}) => {
  const changelogRef = useRef<HTMLHeadingElement>(null);

  // 子の Dialog の effect が先に走るので、ここでは showModal の後になる
  useEffect(() => {
    if (!show || !scrollToChangelog) return;
    changelogRef.current?.focus({ preventScroll: true });
    changelogRef.current?.scrollIntoView({ block: "start" });
  }, [show, scrollToChangelog]);

  return (
    <Dialog
      show={show}
      onHide={onHide}
      labelledBy={TITLE_ID}
      wide
      actions={
        <button type="button" className="lu-button" onClick={onHide}>
          閉じる
        </button>
      }
    >
      <div className="lu-prose">
        <h3 id={TITLE_ID}>これなに？</h3>
        <ul>
          <li>
            Misskeyの管理画面でつかえる絵文字一括インポート用zip形式を作成できます。
          </li>
          <li>Misskey 2024.8.0-2026.10.1 で動作確認しています。</li>
          <li>
            お使いの端末単体で動作するアプリです。アップロードした画像や入力値は、外部サーバー等に一切送信されません。
          </li>
          <li>
            Misskeyは、日本におけるMisskey Projectの登録商標（第6716601号）です。本ツールは非公式であり、Misskey Projectと一切の協力関係に基づくものではありません。
            なにか不具合がありましたら、お手数ですが
            <a href="https://mk.lutic.at/@Lutica">@Lutica@mk.lutic.at</a>
            までご連絡ください。
          </li>
        </ul>
        <h3>Misskey管理画面へのインポート方法</h3>
        <HowToImport />
        <h3 ref={changelogRef} className="ep-about-changelog" tabIndex={-1}>
          変更履歴
        </h3>
        <Changelog />
      </div>

      <footer className="lu-text-dimmed lu-mt-4">
        (C) 2024-2026{" "}
        <a href="https://lutic.at" target="_blank" rel="noreferrer noopener">
          Ebise Lutica
        </a>
        <br />
        <a
          href="https://github.com/EbiseLutica/emojipacker4misskey.git"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub でソースコードを見る
        </a>
      </footer>
    </Dialog>
  );
};

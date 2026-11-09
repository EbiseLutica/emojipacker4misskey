import type { Emoji } from "../models/emoji";
import { Dialog } from "./Dialog";

interface ImportModalProps {
  show: boolean;
  emojis: Emoji[];
  onHide: () => void;
  onReplace: () => void;
  onAppend: () => void;
}

export const ImportModal = ({
  show,
  emojis,
  onHide,
  onReplace,
  onAppend,
}: ImportModalProps) => {
  return (
    <Dialog
      show={show}
      onHide={onHide}
      title="絵文字パックをインポート"
      wide
      actions={
        <>
          <button type="button" className="lu-button" onClick={onHide}>
            やめる
          </button>
          <button
            type="button"
            className="lu-button lu-button--danger"
            onClick={onReplace}
          >
            現在のリストを破棄してから開く
          </button>
          <button
            type="button"
            className="lu-button lu-button--primary"
            onClick={onAppend}
          >
            このリストを末尾にくっつける
          </button>
        </>
      }
    >
      <p>
        このパックには、<strong>{emojis.length}種の絵文字</strong>
        が含まれています
      </p>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <ul className="lu-stack lu-p-0 lu-my-0">
          {emojis.map((emoji, index) => (
            <li
              key={index}
              className="ep-import-item lu-stack lu-stack--horizontal lu-stack--align-center lu-stack--gap-4 lu-py-2"
            >
              <img
                src={URL.createObjectURL(emoji.file)}
                alt={emoji.name}
                style={{
                  width: "32px",
                  height: "32px",
                  objectFit: "contain",
                }}
              />
              <div>
                <div className="lu-text-bold">:{emoji.name}:</div>
                {emoji.category && (
                  <small className="lu-text-dimmed">{emoji.category}</small>
                )}
                {emoji.tags && (
                  <div>
                    {emoji.tags.split(" ").map((t) => (
                      <span key={t} className="lu-chip lu-chip--dimmed lu-me-1">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
};

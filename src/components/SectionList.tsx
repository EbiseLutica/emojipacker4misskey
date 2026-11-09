import React, { useState, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import type { FormValues } from "../models/form-values";
import { Dialog } from "./Dialog";
import { Section } from "./Section";

type BulkTextKey = "category" | "tags" | "license";
type BulkBoolKey = "localOnly" | "isSensitive";

/** 確認ダイアログで実行を待っている一括編集 */
type PendingBulk =
  | { type: "text"; key: BulkTextKey; value: string }
  | { type: "bool"; key: BulkBoolKey; value: boolean };

const bulkLabels: Record<BulkTextKey | BulkBoolKey, string> = {
  category: "カテゴリ",
  tags: "タグ",
  license: "ライセンス",
  localOnly: "ローカルのみ",
  isSensitive: "NSFW",
};

interface SectionListProps {
  onZipFile?: (file: File) => void;
}

export const SectionList: React.FC<SectionListProps> = ({ onZipFile }) => {
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkTags, setBulkTags] = useState("");
  const [bulkLicense, setBulkLicense] = useState("");
  const [pendingBulk, setPendingBulk] = useState<PendingBulk | null>(null);

  const { control, getValues, setValue } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    name: "emojis",
    control,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        if (file.name.endsWith(".zip")) {
          onZipFile?.(file);
        } else {
          const name = file.name.replace(/\.[^/.]+$/, "");
          append({
            file,
            name: name,
            category: "",
            tags: "",
            license: "",
            localOnly: false,
            isSensitive: false,
          });
        }
      }
    },
    [append, onZipFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
  });

  const bulkUpdate = (key: BulkTextKey, value: string) => {
    setPendingBulk({ type: "text", key, value });
  };

  const bulkUpdateBool = (key: BulkBoolKey, value: boolean) => {
    setPendingBulk({ type: "bool", key, value });
  };

  // fields は手入力を反映しないので、getValues の現在値を見て該当の項目だけを書き換える
  const applyBulkText = (
    { key, value }: Extract<PendingBulk, { type: "text" }>,
    onlyBlank: boolean,
  ) => {
    (getValues("emojis") ?? []).forEach((emoji, index) => {
      if (onlyBlank && emoji[key]?.trim()) return;
      setValue(`emojis.${index}.${key}`, value);
    });
    setPendingBulk(null);
  };

  const applyBulkBool = ({
    key,
    value,
  }: Extract<PendingBulk, { type: "bool" }>) => {
    (getValues("emojis") ?? []).forEach((_, index) => {
      setValue(`emojis.${index}.${key}`, value);
    });
    setPendingBulk(null);
  };

  return (
    <div className="lu-stack lu-stack--gap-4">
      {/* アップロードボタン */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
      >
        <input {...getInputProps()} />
        <p className="lu-my-0">
          {isDragActive
            ? "ここにドロップしてください"
            : "ここにファイルをドロップするか、クリックしてファイルを選択"}
        </p>
        <small className="lu-text-dimmed">画像またはZipファイルに対応</small>
      </div>

      {/* 一括編集ボタン */}
      <section className="lu-card">
        <details>
          <summary>
            <h2 className="ep-summary-title">一括編集</h2>
          </summary>
          <div className="lu-stack lu-stack--gap-4 lu-mt-4">
            <div className="lu-stack lu-stack--horizontal lu-stack--align-end lu-stack--gap-4">
              <label className="lu-textfield ep-bulk-field">
                <span className="lu-textfield__title">カテゴリ</span>
                <input
                  type="text"
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="lu-button"
                onClick={() => bulkUpdate("category", bulkCategory)}
              >
                変更
              </button>
            </div>
            <div className="lu-stack lu-stack--horizontal lu-stack--align-end lu-stack--gap-4">
              <label className="lu-textfield ep-bulk-field">
                <span className="lu-textfield__title">タグ</span>
                <input
                  type="text"
                  value={bulkTags}
                  onChange={(e) => setBulkTags(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="lu-button"
                onClick={() => bulkUpdate("tags", bulkTags)}
              >
                変更
              </button>
            </div>
            <div className="lu-stack lu-stack--horizontal lu-stack--align-end lu-stack--gap-4">
              <label className="lu-textfield ep-bulk-field">
                <span className="lu-textfield__title">ライセンス</span>
                <input
                  type="text"
                  value={bulkLicense}
                  onChange={(e) => setBulkLicense(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="lu-button"
                onClick={() => bulkUpdate("license", bulkLicense)}
              >
                変更
              </button>
            </div>
            <div>
              <div className="lu-text-small lu-text-bold lu-mb-1">
                ローカルのみ
              </div>
              <div className="lu-stack lu-stack--horizontal lu-stack--gap-4">
                <button
                  type="button"
                  className="lu-button"
                  onClick={() => bulkUpdateBool("localOnly", true)}
                >
                  オン
                </button>
                <button
                  type="button"
                  className="lu-button"
                  onClick={() => bulkUpdateBool("localOnly", false)}
                >
                  オフ
                </button>
              </div>
            </div>
            <div>
              <div className="lu-text-small lu-text-bold lu-mb-1">NSFW</div>
              <div className="lu-stack lu-stack--horizontal lu-stack--gap-4">
                <button
                  type="button"
                  className="lu-button"
                  onClick={() => bulkUpdateBool("isSensitive", true)}
                >
                  オン
                </button>
                <button
                  type="button"
                  className="lu-button"
                  onClick={() => bulkUpdateBool("isSensitive", false)}
                >
                  オフ
                </button>
              </div>
            </div>
          </div>
        </details>
      </section>

      <div className="ep-table-scroll">
        <table className="ep-table">
          <thead>
            <tr>
              <th>絵文字</th>
              <th>名前</th>
              <th>カテゴリ</th>
              <th>タグ</th>
              <th>ライセンス</th>
              <th>ローカルのみ</th>
              <th>NSFW</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <Section
                key={field.id}
                field={field}
                index={index}
                remove={remove}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        show={pendingBulk !== null}
        onHide={() => setPendingBulk(null)}
        title="一括編集の確認"
        actions={
          pendingBulk && (
            <>
              <button
                type="button"
                className="lu-button"
                onClick={() => setPendingBulk(null)}
              >
                キャンセル
              </button>
              {pendingBulk.type === "text" ? (
                <>
                  <button
                    type="button"
                    className="lu-button lu-button--danger"
                    onClick={() => applyBulkText(pendingBulk, false)}
                  >
                    すべて置換
                  </button>
                  <button
                    type="button"
                    className="lu-button lu-button--primary"
                    onClick={() => applyBulkText(pendingBulk, true)}
                  >
                    空欄のみ埋める
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="lu-button lu-button--danger"
                  onClick={() => applyBulkBool(pendingBulk)}
                >
                  すべて{pendingBulk.value ? "オン" : "オフ"}にする
                </button>
              )}
            </>
          )
        }
      >
        {pendingBulk && (
          <>
            <p>
              {pendingBulk.type === "text"
                ? `${bulkLabels[pendingBulk.key]}を「${pendingBulk.value}」に一括で変更します。`
                : `${bulkLabels[pendingBulk.key]}を一括で${pendingBulk.value ? "オン" : "オフ"}にします。`}
            </p>
            <p>この操作は取り消せません。</p>
          </>
        )}
      </Dialog>
    </div>
  );
};

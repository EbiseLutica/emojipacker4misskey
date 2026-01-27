import React, { useState, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import type { FormValues } from "../models/form-values";
import { Section } from "./Section";

interface SectionListProps {
  onZipFile?: (file: File) => void;
}

export const SectionList: React.FC<SectionListProps> = ({ onZipFile }) => {
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkTags, setBulkTags] = useState("");
  const [bulkLicense, setBulkLicense] = useState("");

  const { control } = useFormContext<FormValues>();
  const { fields, append, remove, update } = useFieldArray({
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

  const bulkUpdate = (key: "category" | "tags" | "license", value: string) => {
    if (
      !confirm(
        `${key}を全て「${value}」に変更します。\nこの操作は取り消せませんがよろしいですか？`,
      )
    )
      return;
    fields.forEach((field, index) => {
      update(index, { ...field, [key]: value });
    });
  };

  const bulkUpdateBool = (key: "localOnly" | "isSensitive", value: boolean) => {
    if (
      !confirm(
        `${key}を全て${value ? "オン" : "オフ"}にします。\nこの操作は取り消せませんがよろしいですか？`,
      )
    )
      return;
    fields.forEach((field, index) => {
      update(index, { ...field, [key]: value });
    });
  };

  return (
    <div className="vstack gap-3">
      {/* アップロードボタン */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
      >
        <input {...getInputProps()} />
        <p className="mb-0">
          {isDragActive
            ? "ここにドロップしてください"
            : "ここにファイルをドロップするか、クリックしてファイルを選択"}
        </p>
        <small className="text-muted">画像またはZipファイルに対応</small>
      </div>

      {/* 一括編集ボタン */}
      <section className="rounded bg-body-secondary p-3">
        <details>
          <summary>
            <h2 className="d-inline fs-5 mb-4 text-muted user-select-none">
              一括編集
            </h2>
          </summary>
          <div className="vstack gap-3 mt-3">
            <div>
              <label htmlFor="inputCategory" className="fs-6">
                カテゴリ
              </label>
              <div className="hstack gap-3">
                <input
                  id="inputCategory"
                  type="text"
                  className="form-control w-25"
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => bulkUpdate("category", bulkCategory)}
                >
                  変更
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="inputTags" className="fs-6">
                タグ
              </label>
              <div className="hstack gap-3">
                <input
                  id="inputTags"
                  type="text"
                  className="form-control w-25"
                  value={bulkTags}
                  onChange={(e) => setBulkTags(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => bulkUpdate("tags", bulkTags)}
                >
                  変更
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="inputLicense" className="fs-6">
                ライセンス
              </label>
              <div className="hstack gap-3">
                <input
                  id="inputLicense"
                  type="text"
                  className="form-control w-25"
                  value={bulkLicense}
                  onChange={(e) => setBulkLicense(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => bulkUpdate("license", bulkLicense)}
                >
                  変更
                </button>
              </div>
            </div>
            <div>
              <label className="fs-6">ローカルのみ</label>
              <div className="hstack gap-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => bulkUpdateBool("localOnly", true)}
                >
                  オン
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => bulkUpdateBool("localOnly", false)}
                >
                  オフ
                </button>
              </div>
            </div>
            <div>
              <label className="fs-6">NSFW</label>
              <div className="hstack gap-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => bulkUpdateBool("isSensitive", true)}
                >
                  オン
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => bulkUpdateBool("isSensitive", false)}
                >
                  オフ
                </button>
              </div>
            </div>
          </div>
        </details>
      </section>

      <div className="table-responsive">
        <table className="table table-striped">
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
    </div>
  );
};

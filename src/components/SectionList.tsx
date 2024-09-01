import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "../models/form-values";
import { Section } from "./Section";

export const SectionList: React.FC = () => {
    const [bulkCategory, setBulkCategory] = useState('');
    const [bulkTags, setBulkTags] = useState('');
    const [bulkLicense, setBulkLicense] = useState('');
    

    const { control } = useFormContext<FormValues>();
    const { fields, append, remove } = useFieldArray({
        name: "emojis",
        control,
    });

    const bulkUpdate = (key: 'category' | 'tags' | 'license', value: string) => {
        if (!confirm(`${key}を全て「${value}」に変更します。\nこの操作は取り消せませんがよろしいですか？`)) return;
        fields.forEach((field) => {
            field[key] = value;
        });
    }

    const bulkUpdateBool = (key: 'localOnly' | 'isSensitive', value: boolean) => {
        if (!confirm(`${key}を全て${value ? 'オン' : 'オフ'}にします。\nこの操作は取り消せませんがよろしいですか？`)) return;
        fields.forEach((field) => {
            field[key] = value;
        });
    }

    const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            // file.nameから拡張子を取り除いたものをnameに設定
            const name = file.name.replace(/\.[^/.]+$/, '');

            append({ file, name: name, category: "", tags: "", license: null, localOnly: false, isSensitive: false });
        }
    };

    return (
        <div className="vstack gap-3">
            <section className="rounded border border-2 p-3">
                <h2 className="fs-5 mb-4 text-muted">一括編集</h2>
                <div className="vstack gap-3">
                    <div>
                        <h3 className="fs-6">カテゴリ</h3>
                        <div className="hstack gap-3">
                            <input type="text" className="form-control w-25" value={bulkCategory} onChange={(e) => setBulkCategory(e.target.value)} />
                            <button className="btn btn-primary" onClick={() => bulkUpdate('category', bulkCategory)}>変更</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="fs-6">タグ</h3>
                        <div className="hstack gap-3">
                            <input type="text" className="form-control w-25" value={bulkTags} onChange={(e) => setBulkTags(e.target.value)} />
                            <button className="btn btn-primary" onClick={() => bulkUpdate('tags', bulkTags)}>変更</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="fs-6">ライセンス</h3>
                        <div className="hstack gap-3">
                            <input type="text" className="form-control w-25" value={bulkLicense} onChange={(e) => setBulkLicense(e.target.value)} />
                            <button className="btn btn-primary" onClick={() => bulkUpdate('license', bulkLicense)}>変更</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="fs-6">ローカルのみ</h3>
                        <div className="hstack gap-3">
                            <button className="btn btn-success" onClick={() => bulkUpdateBool('localOnly', true)}>オン</button>
                            <button className="btn btn-danger" onClick={() => bulkUpdateBool('localOnly', true)}>オフ</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="fs-6">NSFW</h3>
                        <div className="hstack gap-3">
                            <button className="btn btn-success" onClick={() => bulkUpdateBool('isSensitive', true)}>オン</button>
                            <button className="btn btn-danger" onClick={() => bulkUpdateBool('isSensitive', true)}>オフ</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded border border-2 p-3">
                <h2 className="fs-5 mb-4">絵文字リスト</h2>
                <input type="file" accept="image/*" multiple className="form-control" onChange={handleFilePick} />

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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <Section key={index} field={field} index={index} remove={remove} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
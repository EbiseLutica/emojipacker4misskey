import React from "react";
import { FieldArrayWithId, UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { FormValues } from "../models/form-values";

export type SectionProps = {
    field: FieldArrayWithId<FormValues, 'emojis', 'id'>;
    index: number;
    remove: UseFieldArrayRemove;
};

export const Section: React.FC<SectionProps> = (p) => {
    const {
        register,
        // formState: { errors },
    } = useFormContext<FormValues>();

    return (
        <tr>
            <td>
                <img className="emoji" src={URL.createObjectURL(p.field.file)} alt={p.field.name} />
            </td>
            <td>
                <input
                    {...register(`emojis.${p.index}.name`)}
                    className="form-control"
                    defaultValue={p.field.name}
                    placeholder="名前"
                />
            </td>
            <td>
                <input
                    {...register(`emojis.${p.index}.category`)}
                    className="form-control"
                    defaultValue={p.field.category}
                    placeholder="カテゴリ"
                />
            </td>
            <td>
                <input
                    {...register(`emojis.${p.index}.tags`)}
                    className="form-control"
                    defaultValue={p.field.tags}
                    placeholder="タグ"
                />
            </td>
            <td>
                <input
                    {...register(`emojis.${p.index}.license`)}
                    className="form-control"
                    defaultValue={p.field.license}
                    placeholder="ライセンス"
                />
            </td>
            <td>
                <input
                    {...register(`emojis.${p.index}.localOnly`)}
                    type="checkbox"
                    className="form-check-input"
                    defaultChecked={p.field.localOnly}
                />
            </td>
            <td>
                <input
                    {...register(`emojis.${p.index}.isSensitive`)}
                    type="checkbox"
                    className="form-check-input"
                    defaultChecked={p.field.isSensitive}
                />
            </td>
            <td>
                <button type="button" className="btn btn-danger" onClick={() => p.remove(p.index)}>
                    削除
                </button>
            </td>
        </tr>
    );
};
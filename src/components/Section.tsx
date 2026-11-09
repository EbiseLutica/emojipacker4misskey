import React from "react";
import {
  type FieldArrayWithId,
  type UseFieldArrayRemove,
  useFormContext,
} from "react-hook-form";
import type { FormValues } from "../models/form-values";

export type SectionProps = {
  field: FieldArrayWithId<FormValues, "emojis", "id">;
  index: number;
  remove: UseFieldArrayRemove;
};

export const Section: React.FC<SectionProps> = (p) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <tr>
      <td>
        <img
          className="emoji"
          src={URL.createObjectURL(p.field.file)}
          alt={p.field.name}
        />
      </td>
      <td>
        <label className="lu-textfield">
          <input
            {...register(`emojis.${p.index}.name`, {
              required: "名前は必須です",
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "名前は英数字とアンダースコアのみ使用できます",
              },
            })}
            aria-invalid={!!errors.emojis?.[p.index]?.name}
            aria-label="名前"
            size={10}
            defaultValue={p.field.name}
            placeholder="名前"
          />
          {errors.emojis?.[p.index]?.name && (
            <span className="lu-textfield__caption">
              {errors.emojis?.[p.index]?.name?.message}
            </span>
          )}
        </label>
      </td>
      <td>
        <label className="lu-textfield">
          <input
            {...register(`emojis.${p.index}.category`)}
            aria-label="カテゴリ"
            size={10}
            defaultValue={p.field.category}
            placeholder="カテゴリ"
          />
        </label>
      </td>
      <td>
        <label className="lu-textfield">
          <input
            {...register(`emojis.${p.index}.tags`)}
            aria-label="タグ"
            size={10}
            defaultValue={p.field.tags}
            placeholder="タグ"
          />
        </label>
      </td>
      <td>
        <label className="lu-textfield">
          <input
            {...register(`emojis.${p.index}.license`)}
            aria-label="ライセンス"
            size={10}
            defaultValue={p.field.license}
            placeholder="ライセンス"
          />
        </label>
      </td>
      <td>
        <input
          {...register(`emojis.${p.index}.localOnly`)}
          type="checkbox"
          className="lu-checkbox"
          aria-label="ローカルのみ"
          defaultChecked={p.field.localOnly}
        />
      </td>
      <td>
        <input
          {...register(`emojis.${p.index}.isSensitive`)}
          type="checkbox"
          className="lu-checkbox"
          aria-label="NSFW"
          defaultChecked={p.field.isSensitive}
        />
      </td>
      <td>
        <button
          type="button"
          className="lu-button lu-button--danger lu-button--sm"
          onClick={() => p.remove(p.index)}
        >
          削除
        </button>
      </td>
    </tr>
  );
};

import type { KeyboardEvent } from "react";

const CONTROL_SELECTOR = "input, button";

const isTextInput = (el: Element): el is HTMLInputElement =>
  el instanceof HTMLInputElement && el.type === "text";

/** 全選択、または移動方向の端にキャレットがあり、文字の編集に矢印キーが要らない状態か。 */
const canLeaveHorizontally = (input: HTMLInputElement, key: string) => {
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;
  const length = input.value.length;
  if (start === 0 && end === length) return true;
  if (start !== end) return false;
  return key === "ArrowLeft" ? start === 0 : end === length;
};

/** 指定方向で最初に見つかる、操作できる要素を持つセルの要素を返す。 */
const findHorizontalControl = (cell: Element, key: string) => {
  let next =
    key === "ArrowLeft" ? cell.previousElementSibling : cell.nextElementSibling;
  while (next) {
    const control = next.querySelector<HTMLElement>(CONTROL_SELECTOR);
    if (control) return control;
    next =
      key === "ArrowLeft"
        ? next.previousElementSibling
        : next.nextElementSibling;
  }
  return null;
};

const findVerticalControl = (
  cell: HTMLTableCellElement,
  row: Element,
  key: string,
) => {
  const nextRow =
    key === "ArrowUp" ? row.previousElementSibling : row.nextElementSibling;
  return (
    nextRow?.children[cell.cellIndex]?.querySelector<HTMLElement>(
      CONTROL_SELECTOR,
    ) ?? null
  );
};

/**
 * tbody の keydown に渡し、矢印キーでセル間のフォーカス移動をする。
 * 上下は行、左右は列を移動する。文字入力欄の左右は、キャレットが端にあるか全選択のときだけ列を移動する。
 */
export const handleTableArrowKeys = (e: KeyboardEvent<HTMLElement>) => {
  if (!e.key.startsWith("Arrow")) return;
  if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
  // 日本語入力の変換候補の操作を奪わない
  if (e.nativeEvent.isComposing) return;

  const target = e.target as HTMLElement;
  if (!target.matches(CONTROL_SELECTOR)) return;
  const cell = target.closest("td");
  const row = cell?.parentElement;
  if (!cell || !row) return;

  const isHorizontal = e.key === "ArrowLeft" || e.key === "ArrowRight";
  if (isHorizontal && isTextInput(target)) {
    if (!canLeaveHorizontally(target, e.key)) return;
  }

  const next = isHorizontal
    ? findHorizontalControl(cell, e.key)
    : findVerticalControl(cell, row, e.key);

  // 表の端でも、既定の動作で全選択が解除されないように止める
  e.preventDefault();
  if (!next) return;

  next.focus();
  // Tab での移動と同じく全選択にして、続けて矢印キーで移動できるようにする
  if (isTextInput(next)) next.select();
};

import {
  IconDeviceDesktop,
  IconMoon,
  IconSun,
  type Icon,
} from "@tabler/icons-react";
import { useState } from "react";

type ThemeMode = "system" | "light" | "dark";

/** index.html の初期化スクリプトと同じキー */
const STORAGE_KEY = "emojipacker:theme";

const modes: Record<
  ThemeMode,
  { label: string; icon: Icon; next: ThemeMode }
> = {
  system: { label: "システム", icon: IconDeviceDesktop, next: "light" },
  light: { label: "ライト", icon: IconSun, next: "dark" },
  dark: { label: "ダーク", icon: IconMoon, next: "system" },
};

const readMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
};

/** html の data-theme を更新して保存する。system は属性なしで OS の設定に従う。 */
const applyMode = (mode: ThemeMode) => {
  const root = document.documentElement;
  if (mode === "system") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = mode;
  }

  try {
    if (mode === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  } catch {
    // 保存できない環境では、このページを開いている間だけ反映する
  }
};

/** 押すたびにシステム→ライト→ダークの順で切り替わる、navbar のテーマボタン。 */
export const ThemeToggle: React.FC = () => {
  const [mode, setMode] = useState(readMode);
  const { label, icon: ModeIcon, next } = modes[mode];
  const name = `テーマ: ${label}`;

  return (
    <button
      className="lu-button lu-button--sm lu-button--ghost lu-button--icon"
      type="button"
      aria-label={name}
      title={name}
      onClick={() => {
        applyMode(next);
        setMode(next);
      }}
    >
      <ModeIcon size={18} aria-hidden="true" />
    </button>
  );
};

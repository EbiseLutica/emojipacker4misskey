export type ChangeLog = {
  version: string;
  date: string;
  body: string | string[];
};

export const changeLog = [
  {
    version: "2.0.0",
    date: "2026/11/09",
    body: [
      "全般的に画面デザインとレイアウトを刷新",
      "ダークテーマへの切り替えに対応。初期状態では、OSのテーマ設定と同期します",
      "リスト編集時に←↓↑→キーで移動可能に",
    ],
  },
  {
    version: "1.2.1",
    date: "2026/01/27",
    body: "絵文字編集中に閉じる際、ブラウザの確認ダイアログを表示するように",
  },
  {
    version: "1.2.0",
    date: "2026/01/27",
    body: [
      "アップロードのUIを改良し、zipインポートと統合",
      "絵文字名のバリデーション",
      "zip作成時に絵文字のファイル名を絵文字名と同一にする",
    ],
  },
  {
    version: "1.1.0",
    date: "2025/12/10",
    body: "zipインポート機能を追加",
  },
  {
    version: "1.0.0",
    date: "2024/9/2",
    body: "初回リリース",
  },
];

export const CURRENT_VERSION = changeLog[0].version;

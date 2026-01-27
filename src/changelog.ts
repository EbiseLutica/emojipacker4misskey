export type ChangeLog = {
  version: string;
  date: string;
  body: string | string[];
};

export const changeLog = [
  {
    version: '1.2.0',
    date: '2026/01/27',
    body: ['アップロードのUIを改良し、zipインポートと統合'],
  },
  {
    version: '1.1.0',
    date: '2025/12/10',
    body: 'zipインポート機能を追加',
  },
  {
    version: '1.0.0',
    date: '2024/9/2',
    body: '初回リリース',
  },
];

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Misskey向け絵文字パックZIPファイルを作成・インポートするクライアントサイドWebアプリケーション。すべての処理はブラウザ内で完結し、外部サーバーへのデータ送信は行わない。

## 開発コマンド

```bash
pnpm dev        # 開発サーバー起動 (Vite HMR)
pnpm build      # TypeScriptビルド + プロダクションビルド
pnpm lint       # Biomeでリント・自動修正
pnpm format     # Biomeでフォーマット
pnpm preview    # プロダクションビルドのプレビュー
```

## アーキテクチャ

**技術スタック:** React 18 + TypeScript + Vite + React Bootstrap

### ディレクトリ構成

- `src/components/` - ReactコンポーネントUI (react-hook-form, react-bootstrap使用)
- `src/services/` - ZIP処理とメタデータ生成のビジネスロジック
- `src/models/` - コアデータ構造のTypeScriptインターフェース (Emoji, FormValues)
- `src/types/` - MisskeyのZIPメタデータフォーマット型定義

### コアデータフロー

**エクスポート:** 画像アップロード → SectionListでメタデータ編集 → makeZip()でZIP生成 → ダウンロード

**インポート:** ZIPファイル選択 → importZip()で解析 → ImportModalでプレビュー → 既存に追加/置換

### 主要サービス

- `make-zip.ts` - @zip.js/zip.jsを使用してZIPファイル生成
- `import-zip.ts` - ZIPファイル読み込みと絵文字メタデータ抽出
- `build-meta.ts` - Misskey互換のmeta.json生成

## コード品質

linterとformatterとしてbiomeを使用。2スペースインデント、セミコロン必須、JSはシングルクォート、JSXはダブルクォート。TypeScript strict mode有効。

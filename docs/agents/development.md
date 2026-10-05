# テーマ開発ガイド

本テーマは Vue 3 SFC（`script setup`）、TypeScript、ESM で実装されています。実行環境、開発コマンド、npm 公開対象は `package.json` が正であり、通常は `packageManager` の指定に従い `pnpm install --frozen-lockfile` を実行します。

利用方法の正となる文書は [README.md](../../README.md) および [README.ja.md](../../README.ja.md) です。公開 API を変更した場合は、必ず両方の文書を更新してください。

## 設計原則と責務

各ディレクトリおよび主要ファイルの責務は以下のとおりです。

- `styles/`: スタイル定義および集約トークン
- `layouts/`: スライドレイアウト
- `components/`: UI コンポーネント
- `slide-bottom.vue`: ページ側の設定
- `global-bottom.vue`: スライド遷移外で表示を維持する持続フッター
- `custom-nav-controls.vue`: 任意の埋め込み復帰リンク
- `utils/`: 設定、アウトライン、図の寸法、文献処理
- `setup/mermaid.ts`: 共通 Mermaid 設定

`example.md` は機能デモ用のため、既存の文言や順序を保ち、必要箇所のみ変更します（ユーザーの指定があればその範囲に従います）。既存の設計を変更する場合はユーザーの最新指示が優先されますが、指示がない場合は以下の要点を維持します。

- density とフッター中央文はデッキ共通とし、ページ番号のちらつきを防ぐためフッターはスライド遷移の外に配置する。
- agenda は単一階層とし、section と番号を同期させる。
- 白背景を基本とし、波は cover のみ、M PLUS 2 本文、Fira Code コード、テーマ色真円に白い等幅数字の番号バッジとする。

`DiagramFrame` は通常フローと参考文献を考慮し、既存 SVG の `viewBox` に合わせて表示寸法を縮小します。SVG 内部の描画切れを自動修復する機能ではないため、最下部の矢印、番号、文字を目視確認してください。シーケンス図の `diagramMarginY: 24` は既知の下切れ予防策です。必要なら open Shadow DOM 内の SVG 描画完了を待機します。

下部参考文献の予約領域とフッターを侵さず、入力エスケープ、URL、書誌バリデーションを維持します。また、ローカルの型 shim だけで Slidev の実行挙動を推測せず、必要ならインストール済み `@slidev/client` を確認してください。

## 依存管理と公開仕様

`pnpm-workspace.yaml` の `overrides` には互換性維持の理由があるため、更新時は理由の確認と実動作確認を行ってください。

既存の主要ディレクトリ（`components/`、`layouts/`、`setup/`、`styles/`、`utils/`）配下はパッケージに同梱されます。新しい公開ルートファイルやディレクトリを追加した場合は `package.json` の `files` を確認し、`pnpm pack --dry-run` で検証してください。なお、`public/examples` のデモ素材は npm 非同梱です。

## 開発サーバーと検証手順

開発時は既存の該当サーバーを再利用し、`pnpm dev --port 3030` で起動します。watcher 制限がある環境では `pnpm dev:polling` を使用してください。

変更内容に応じた検証手順は以下のとおりです。

- 文書変更: リンク、コマンド、差分のみ確認する。
- ロジック変更: `pnpm run test` と関連する型チェックを実行する。
- Vue コンポーネント変更: `pnpm run typecheck`、`pnpm run lint`、`pnpm run format:check` を実行する（`pnpm lint` は pnpm 内蔵コマンドと衝突するため、必ず `pnpm run lint` と指定する）。
- 表示変更: `pnpm run build` を実行しブラウザで確認する。density とフッターへの影響、必要に応じ `/overview` や `/export` を確認する。通常の SVG 境界のみで内部描画を確認済みとせず、PDF が必要な場合は印刷プレビューと実 PDF が異なるため `pnpm export` の成果物を確認する。
- 依存関係更新や広範囲の変更: `pnpm check`（test、typecheck、lint、format:check、build、pack --dry-run）を実行する。check に audit は含まれないため、必要なら別コマンドの `pnpm run audit:prod` を実行する。

# プラグインインターフェース — Umeboshi

> [English version](INTERFACE.md) | 日本語版

各バックエンドタイプは規約（コントラクト）を定義します。プラグインは `plugins/<type>/<name>/`
以下のディレクトリで、最低限 `SKILL.md` を含みます。プラグインは下記のインターフェースに従う
Claude Code スキルであり、オーケストレーターが `plugins/registry.json` を通じて検出します。

---

## 1. 文字起こしバックエンド (`plugins/transcribe/<name>/SKILL.md`)

**目的**: 音声または動画ファイルをプレーンテキストの文字起こしに変換する。

| 規約 | 詳細 |
|----------|--------|
| **入力** | 音声ファイル（mp3, wav, m4a, ogg, flac, ...）の絶対パス |
| **出力** | `<working_dir>/Script/<basename>.txt` に UTF-8 `.txt` ファイル |
| **環境変数** | バックエンド固有（例: `FIREWORKS_API_KEY`, `OPENROUTER_API_KEY`） |
| **エラー** | 不足している依存関係（ffmpeg, APIキー）をインストール手順付きで報告 |

**SKILL.md に必須の内容**:
- 前提条件（ffmpeg, APIキー）のインストール方法を説明する
- `--language <code>` および `--output <path>` の規約を受け入れる
- レート制限とファイルサイズの上限を文書化する

---

## 2. 生成バックエンド (`plugins/generate/<name>/SKILL.md`)

**目的**: 構造化テキスト（文字起こし、教科書の抜粋）を Anki 用 HTML カードに変換する。

| 規約 | 詳細 |
|----------|--------|
| **入力** | `<working_dir>/Script/<name>.txt`（文字起こし済みテキスト） |
| **出力** | `<working_dir>/detailedDescription/<name>.html`（`{{cX::}}` を含むカード本文） |
| **オプション出力** | `<working_dir>/highYieldSummary/<name>.html`（要約カード） |
| **環境変数** | バックエンド固有（例: `DEEPSEEK_API_KEY`） |
| **コスト** | SKILL.md に講義あたりのコスト見積もりを記載 |

**SKILL.md に必須の内容**:
- 作業ディレクトリとファイル名をパラメータとして受け取る
- `<h1>`〜`<h4>` 見出しと `{{cX::}}` クローズマーカーを含む有効な HTML を生成する
- 使用するモデル（Claude, DeepSeek など）とその制限を文書化する

---

## 3. インポートバックエンド (`plugins/import/<name>/SKILL.md`)

**目的**: カード JSON を受け取り、Anki に投入する（または .apkg としてエクスポートする）。

| 規約 | 詳細 |
|----------|--------|
| **入力** | `<working_dir>/notes/<name>.json` — カードオブジェクトの配列 |
| **カードスキーマ** | `{ text, highYieldSummary?, visualAids?, umeboshiNoteId, level, oneByOne }` |
| **出力** | Anki にカードをインポート; 作成/スキップ/失敗の件数を報告 |
| **前提条件** | Anki が起動していること（AnkiConnect ベースのバックエンドの場合） |

**SKILL.md に必須の内容**:
- インポート前に JSON を検証する（必須フィールド: `text`, `umeboshiNoteId`）
- `created` / `skipped` / `failed` の件数を報告する
- 重複ノートを適切に処理する
- 対象のノートタイプを文書化する（デフォルト: `umeboshiKaname`）

---

## 4. ノートタイプ (`plugins/notetype/<name>/`)

**目的**: Anki カード描画テンプレート — カードデータが Anki 内でどのように表示されるかを定義する。

| 規約 | 詳細 |
|----------|--------|
| **ファイル** | `Front.html`, `Back.html`, `Styling.css`, `notetype.json` |
| **notetype.json** | フィールド定義（最低限: `text`, `extra`, `umeboshiNoteId`） |
| **Front.html** | クローズ対応・One-by-One JS 付きで `{{text}}` を描画 |
| **Back.html** | `{{text}}` の解答表示 + 追加フィールド、オプションの LLM チャットを描画 |

**ノートタイププラグイン**は Anki 内でレンダリングされるカードの表面です。
Anki の「ツール → ノートタイプ管理 → 追加」から一度だけインポートされ、
Claude Code によって実行時に呼び出されることはありません。

---

## 5. 同期バックエンド (`plugins/sync/<name>/SKILL.md`)

**目的**: LLM Q&A の設定と API キーをデバイス間で同期するためのオプションのクラウド同期。

| 規約 | 詳細 |
|----------|--------|
| **入力** | なし（Cloudflare Worker などとしてデプロイされる） |
| **出力** | Anki カードからアクセス可能な LLM チャット API エンドポイント |
| **デフォルト** | `"none"` — 同期は無効、すべてのデータはローカルに保持される |

**同期プラグイン**は、ノートタイプ内蔵の LLM チャット機能のバックエンドを提供します。
完全にオプションであり、カード生成とレビューはこれなしでも動作します。

---

## 新しいプラグインの追加

1. 上記のインターフェースを実装した `plugins/<type>/<name>/SKILL.md` を作成する
2. `plugins/registry.json` の `backends.<type>.active` を `"<name>"` に更新する
3. オーケストレーターがレジストリからアクティブなプラグインを自動検出する

ステップバイステップのガイドは [PLUGIN_DEVELOPMENT.md](../docs/PLUGIN_DEVELOPMENT.md) を参照してください。

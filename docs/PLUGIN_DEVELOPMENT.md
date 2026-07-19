# PLUGIN_DEVELOPMENT.md — プラグインの作り方

Umeboshi のプラグインを作るのは簡単です。決められた規約に従って `SKILL.md` を1つ書けば、
新しい文字起こし・生成・インポート・ノートタイプのバックエンドを追加できます。

## 概要

1. `plugins/<type>/<name>/` にディレクトリを作る
2. `SKILL.md` を書く（インターフェース規約に従う）
3. `plugins/registry.json` の `active` を書き換える
4. 動作確認する

## 共通ルール

- プラグイン名は **kebab-case**（例: `my-local-whisper`）
- `SKILL.md` には YAML frontmatter で `name`, `description`, `interface` を記述
- 入力ファイルパスは **絶対パス** で受け取る
- エラー時は `Exit Code 1` + 説明文を標準エラー出力に出す

---

## チュートリアル: 文字起こしプラグインを作る

ここではダミーの文字起こしプラグインを例に、手順を説明します。

### Step 1: ディレクトリを作成

```bash
mkdir -p plugins/transcribe/my-whisper
```

### Step 2: SKILL.md を書く

```markdown
---
name: transcribe-my-whisper
description: My custom Whisper backend using local whisper.cpp
interface: plugins/transcribe
---

# My Whisper — Transcribe Backend

ローカルの whisper.cpp を使って音声を文字起こしします。

## Prerequisites

- whisper.cpp がインストールされ、`whisper` コマンドが使えること
- モデルファイルが `~/whisper-models/ggml-large-v3.bin` にあること

## CoT

### 1. 入力ファイルの確認

ユーザーが指定した音声ファイルの存在を確認します。

### 2. 文字起こし実行

```bash
whisper <input_file> --model ~/whisper-models/ggml-large-v3.bin \
  --output-txt --output-dir <working_dir>/Script/
```

### 3. 結果確認

出力ファイル `<working_dir>/Script/<basename>.txt` が生成されたことを確認します。

## Output

- `<working_dir>/Script/<basename>.txt` — UTF-8 テキスト

## Cost

無料（ローカル実行のため）。処理時間はファイル長に比例（例: 90分の講義 → 約5分）。
```

### Step 3: レジストリを更新

`plugins/registry.json` を編集:

```json
{
  "backends": {
    "transcribe": { "active": "my-whisper" }
  }
}
```

### Step 4: 動作確認

```bash
# Claude Code 内で実行
/anki-card-generator-without-hs
```

新しいプラグインが自動的に使われます。

---

## 各バックエンドの詳細インターフェース

### Transcribe（文字起こし）

**必須の動作**:
- 音声ファイル（mp3, wav, m4a, ogg, flac）を受け取る
- `<working_dir>/Script/<basename>.txt` に UTF-8 テキストを出力
- FFmpeg が必要な場合はインストール手順を案内

**SKILL.md が受け取るパラメータ**（Claude Code 経由）:
- `<input_file>`: 音声ファイルの絶対パス
- `<working_dir>`: 出力先のワーキングディレクトリ
- `--language <code>`（オプション）: 言語指定

**サンプル実装**: `plugins/examples/transcribe-dummy/SKILL.md`

### Generate（カード生成）

**必須の動作**:
- `<working_dir>/Script/<name>.txt` を読み込む
- 以下の HTML ファイルを出力:
  - `<working_dir>/detailedDescription/<name>.html` — {{cX::}} 付きカード本文
  - `<working_dir>/highYieldSummary/<name>.html` — 要約カード（オプション）
- 章立て: `<h1>`, `<h2>`, `<h3>`, `<h4>` を使用
- cloze マーカー: `{{c1::穴埋めテキスト}}`

**パラメータ**:
- `<working_dir>`: ワーキングディレクトリ
- `<original_filename>`: 拡張子なしの元ファイル名

**品質基準**（MUST）:
- /html-formatter 準拠の HTML 構造
- 各セクションに適切な {{cX::}} が配置されていること
- 日本語で出力（英語指定がない限り）

### Import（Ankiインポート）

**必須の動作**:
- `<working_dir>/notes/<name>.json` を読み込む
- JSON スキーマの検証:
  - 必須フィールド: `text`, `umeboshiNoteId`
  - デフォルト値補完: `oneByOne` → `"y"`, `level` → `"easy"`
- Anki にカードをインポート
- 結果を報告: `created`, `skipped`, `failed`

**JSON スキーマ**:
```json
[
  {
    "text": "<h2>...</h2><p>{{c1::...}}</p>",
    "highYieldSummary": "<h1>...</h1><p>...</p>",
    "visualAids": "<h1>...</h1><table>...</table>",
    "umeboshiNoteId": "0192a8f0-...（UUID v7）",
    "level": "easy",
    "oneByOne": "y"
  }
]
```

**前提条件**:
- Anki が起動していること（AnkiConnect 使用時）
- ノートタイプ `umeboshiKaname` が Anki に登録済みであること

### Notetype（ノートタイプ）

**必須ファイル**:
- `Front.html` — 表面テンプレート（cloze 対応必須）
- `Back.html` — 裏面テンプレート
- `Styling.css` — スタイルシート
- `notetype.json` — フィールド定義

**notetype.json の必須フィールド**:
```json
{
  "name": "MyNotetype",
  "fields": ["text", "extra", "umeboshiNoteId", "oneByOne"]
}
```

**インポート方法**: Anki → ツール → ノートタイプ管理 → 追加 → 各ファイルを貼り付け

---

## プラグインを公開する

作ったプラグインを公式リポジトリに取り込んでほしい場合:

1. `plugins/<type>/<name>/` にプラグインを配置
2. `plugins/registry.json` にエントリを追加（`active` はデフォルトのまま）
3. PR を作成
4. `NOTICE` にクレジットを追加（希望する場合）

### PR のチェックリスト

- [ ] `SKILL.md` がインターフェース規約に従っている
- [ ] 前提条件（API キー、ツール）が明記されている
- [ ] コスト見積もりが記載されている（外部 API 使用時）
- [ ] サンプルの入出力例がある
- [ ] `plugins/INTERFACE.md` の該当セクションを読んでいる

---

## デバッグ方法

プラグイン開発中のトラブルシューティング:

1. **プラグインが見つからない**: `plugins/registry.json` の `active` 名と
   `plugins/<type>/<name>/` のディレクトリ名が一致しているか確認
2. **SKILL.md が読み込まれない**: YAML frontmatter の `---` が正しいか確認
3. **出力ファイルが生成されない**: ワーキングディレクトリの書き込み権限を確認
4. **AnkiConnect に接続できない**: Anki が起動していて、AnkiConnect が有効か確認
   ```bash
   curl http://localhost:8765
   ```

---

## 参考実装

| プラグイン | 場所 | 説明 |
|-----------|------|------|
| Dummy Transcribe | `plugins/examples/transcribe-dummy/` | 最小の文字起こしプラグイン |
| Fireworks Whisper | `plugins/transcribe/fireworks-whisper/` | 実際の文字起こし実装 |
| Claude Code | `plugins/generate/claude-code/` | 実際のカード生成実装 |
| AnkiConnect | `plugins/import/ankiconnect/` | 実際のインポート実装 |
| Umeboshi-Kaname | `plugins/notetype/umeboshi-kaname/` | 実際のノートタイプ |

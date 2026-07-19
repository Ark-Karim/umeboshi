> [English version](README.md) | 日本語版

# Umeboshi — 医学生のための AI 搭載 Anki カード生成ツール

講義スライドや教科書を、バイリンガル注釈・図解・穴埋め問題付きの
高品質な Anki フラッシュカードに変換します。たった 2 つのコマンドで。

```bash
git clone https://github.com/Ark-Karim/umeboshi.git && cd umeboshi && ./install.sh
claude
#    Claude Code 内で: /anki-card-generator-without-hs
```

**API キーは不要です。** Claude Code は既存の Claude Pro（月額 $20）または
Max（月額 $100〜200）サブスクリプションで動作します。文字起こしにはローカル
マシンの GPU を使用します（ローカル Whisper、デフォルトは英語）。

---

## このツールが行うこと

各講義は6ステップのパイプラインを通して構造化された Anki カードになります：

1. **文字起こし** — 講義音声 → テキスト（ローカル Whisper、英語。バックエンド差し替え可能）
2. **構造化** — 重要概念 → 試験頻出箇所を強調した整理済みセクション
3. **穴埋め問題** — 文脈を考慮したスマートなグループ化による穴埋めカード
4. **注釈** — 英語医学用語へのふりがな（ルビ）付与、薬剤名への色付きニーモニック
5. **視覚化** — 自動生成される図表・テーブル・フローチャート・比較表
6. **インポート** — AnkiConnect（ポート 8765）経由でカードを直接 Anki に送信

**出力**: 各カードには約3,000文字のバイリンガル詳細解説、試験頻出ポイントの
ハイライト、視覚教材、one-by-one の穴埋め進行が含まれます。

---

## 実際の使い方

薬理学の学生が講義スクリプトを Anki デッキに変換するまでの流れです：

### ステップ 1: カード生成

```bash
cd C:\Users\chiba\StudySpace\pharmacology2Final
claude
# 実行: /anki-card-generator-without-hs
```

スキルが以下の情報を尋ねます：
- **作業ディレクトリ** — スクリプトファイルがある場所（例: `C:\Users\chiba\StudySpace\pharmacology2Final`）
- **スクリプトファイル** — 講義テキスト（例: `script/20.txt`）

サブエージェントが文字起こし → 構造化 → 穴埋め → 注釈 → 視覚化 → インポートを実行。
講義1本あたり3〜10分程度で完了します（長さとモデルに依存）。

**品質を上げるコツ — サブエージェントへの指示**: スキルが追加指示を求めてきたら、
以下のように伝えると精度が上がります：
- 試験に出る箇所・予告された箇所・医学的に重要な箇所に重点を置く
- 試験出題可能性が高い箇所を太字にする
- `detailedDescription` は約3,000文字を目標（2,000〜4,500文字の範囲）

### ステップ 2: 手動での穴埋め調整

生成後、Anki ブラウザ（`b` キー）でカードを手動レビューします。
自分の学習スタイルに合わせて穴埋め（`{{c1::...}}`）を追加・調整します。

### ステップ 3: バイリンガル注釈 + 色付きインポート

```bash
# Claude Code 内で:
/anki-card-importer-without-hs
```

以下の情報を指定します：
- 作業ディレクトリ（例: `C:\Users\chiba\StudySpace\pharmacology2Final`）
- 拡張子なしの元ファイル名（例: `17`）
- デッキ名（例: `active::pharmacology2::17`）

**配色ニーモニックのコツ — D3サブエージェントへの指示**:
> 各薬剤の分類・薬剤名についてテーマ色を決め、`<span style="color: #xxxxxx;">` で
> 薬剤名や分類名、stem名に色を付ける。色は [JIS慣用色名](https://www.colordic.org/w)
> から選び、薬の名前や stem からの連想でニーモニックになるようにする。
> （例: EP1 antagonist → エピペンに似ている → 黄色 `#e6b422`）。
> なぜその色を選んだのか、初出時に明記すること。

薬剤名が色で視覚的に区別され、色彩連想による記憶定着を助けます。

---

## カスタマイズ Tips

| 目的 | 方法 | 効果 |
|------|------|------|
| **試験対策** | 生成サブエージェントに high-yield トピックを指示 | 出題頻度の高い内容が強調される |
| **詳細さの調整** | `detailedDescription` の文字数目標を設定（推奨: 2,500〜3,500） | 情報量と復習速度のバランス |
| **配色ニーモニック** | 薬剤名・stem名に `<span style="color: ...;">` を使用 | 色彩による視覚的記憶フック |
| **重要箇所の太字化** | サブエージェントに試験重要箇所の太字化を指示 | 復習時の高速スキャン |
| **難易度設定** | インポートサブエージェントに `level is easy/hard` を指定 | カードの複雑さを制御 |
| **非英語の文字起こし** | Fireworks/OpenRouter バックエンドに切り替え（[代替経路](#代替経路)参照） | 日本語・中国語などに対応 |

---

## 前提条件

- **[Node.js](https://nodejs.org/) 18 以上** および **[Git](https://git-scm.com/)**
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** CLI（`npm install -g @anthropic-ai/claude-code`）
- **[Anki](https://apps.ankiweb.net/) 24.06 以上**（[AnkiConnect](https://ankiweb.net/shared/info/2055492159) を有効化）
- **Anki がバックグラウンドで起動していること**（カードはポート 8765 の AnkiConnect 経由で送信）

---

## 詳細セットアップ

### 1. クローンとインストール

```bash
git clone https://github.com/Ark-Karim/umeboshi.git
cd umeboshi
./install.sh
```

### 2. Umeboshi-Kaname ノートタイプのインポート

1. Anki を開く
2. **ツール → ノートタイプ管理 → 追加**
3. 新しいノートタイプ名 **「Umeboshi-Kaname」** を作成
4. **カード...** ビューに切り替え、以下をコピー＆ペースト：
   - `notetype/Umeboshi-Kaname/Front.html` → **表面テンプレート** タブ
   - `notetype/Umeboshi-Kaname/Back.html` → **裏面テンプレート** タブ
   - `notetype/Umeboshi-Kaname/Styling.css` → **スタイル** タブ
5. **フィールド...** ビューに切り替え、以下のフィールドを追加（順序厳守）：

   | # | フィールド名 |
   |---|-------------|
   | 1 | `text` |
   | 2 | `extra` |
   | 3 | `imagesExtra` |
   | 4 | `detailedDescription` |
   | 5 | `highYieldSummary` |
   | 6 | `visualAids` |
   | 7 | `visualAidsExtra` |
   | 8 | `additionalResources` |
   | 9 | `oneByOne` |
   | 10 | `umeboshiNoteId` |

   > フィールド定義の完全な内容は `notetype/Umeboshi-Kaname/notetype.json` にあります。

### 3. 生成を始める

```bash
cd /path/to/your/lecture/materials
claude
# Claude Code 内で:
/anki-card-generator-without-hs
```

---

## 代替経路

### DeepSeek（Claude サブスクリプション不要）

<details>
<summary>Claude Code を DeepSeek の Anthropic 互換 API で設定</summary>

[DeepSeek の API](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code/)
を使用すると、Anthropic サブスクリプションなしで Claude Code を利用できます。

```bash
# Linux/macOS
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN="<your DeepSeek API Key>"
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash

# Windows PowerShell
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<your DeepSeek API Key>"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
```

API キーは [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) から取得。
コスト: 90分講義あたり約 $0.30（日本語）。
</details>

### OpenRouter（代替プロバイダ）

<details>
<summary>Claude Code を OpenRouter で設定</summary>

[OpenRouter](https://openrouter.ai/docs/cookbook/coding-agents/claude-code-integration)
はマルチプロバイダのフェイルオーバーと予算管理を提供します。

```bash
export ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1
export ANTHROPIC_AUTH_TOKEN="<your OpenRouter API Key>"
# オプション: /fast モード
export ANTHROPIC_DEFAULT_HAIKU_MODEL=anthropic/claude-haiku-4-5
export CLAUDE_CODE_SUBAGENT_MODEL=anthropic/claude-haiku-4-5
```

キーは [openrouter.ai/keys](https://openrouter.ai/keys) から取得。
</details>

### 外部文字起こし（日本語・非英語）

<details>
<summary>クラウド文字起こしバックエンドに切り替え</summary>

```bash
export FIREWORKS_API_KEY="fw_..."    # https://console.fireworks.ai → API Keys
# または
export OPENROUTER_API_KEY="sk-or-..."  # https://openrouter.ai/keys
```

`plugins/registry.json` を編集してアクティブな文字起こしバックエンドを切り替え：
```json
{ "backends": { "transcribe": { "active": "<your-plugin-name>" } } }
```
カスタムバックエンドの作成は [docs/PLUGIN_DEVELOPMENT.md](docs/PLUGIN_DEVELOPMENT.md) を参照。
コスト: 音声1分あたり約 $0.004（プロバイダにより変動）。
</details>

### バックエンドの切り替え

Umeboshi はプラグインシステムを採用しています。`plugins/registry.json` を編集して
バックエンドを切り替えます：

```json
{
  "backends": {
    "transcribe": { "active": "local-whisper" },
    "generate":   { "active": "claude-code" },
    "import":     { "active": "ankiconnect" }
  }
}
```

[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) および [docs/PLUGIN_DEVELOPMENT.md](docs/PLUGIN_DEVELOPMENT.md) を参照。

---

## オプション: クラウド同期

Cloudflare Workers 経由でカードの Q&A をデバイス間同期：

1. `npm install -g wrangler`
2. `cd claudeflare && npx wrangler kv:namespace create UMEBOSHI_KV`
3. KV ネームスペース ID で `wrangler.toml` を更新
4. `npx wrangler deploy`
5. Anki で: `s` キーを押す → ClaudeFlare URL → Worker URL を貼り付け

詳細は `plugins/sync/claudeflare/SKILL.md` を参照。デフォルトでは無効。

---

## オプション: ノートタイプをソースからビルド

```bash
cd notetype/Umeboshi-Kaname
npm install ejs
./build
```

`src/front.ejs` + `src/components/*.ejs` をコンパイル → `Front.html` を生成。

---

## コスト

| 経路 | コスト | 備考 |
|------|--------|------|
| **デフォルト**（Claude サブスクリプション + ローカル Whisper） | サブスクリプション以外 $0 | Claude Pro $20/月 または Max $100〜200/月 |
| DeepSeek（代替生成） | 90分講義あたり約 $0.30 | `DEEPSEEK_API_KEY` が必要 |
| 外部文字起こし（代替） | 音声1分あたり約 $0.004 | Fireworks/OpenRouter、非英語向け |

---

## トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| カードが表示されない | Anki が起動しており、AnkiConnect（ポート 8765）が有効であることを確認 |
| ClaudeFlare が未設定 | Anki 設定（`s` キー）で Worker URL を設定 |
| 文字起こしが失敗する（外部） | API キーが正しく設定され、有効であることを確認 |
| カード生成が失敗する（DeepSeek） | 環境変数 `DEEPSEEK_API_KEY` を確認 |
| スキルが見つからない | `./install.sh` を再実行 |
| ローカル Whisper がない | `pip install openai-whisper` または `brew install whisper-cpp` |

---

## プロジェクト構造

```
plugins/         プラグインシステム — 差し替え可能なバックエンド
skills/          Claude Code スキル定義（パイプライン）
notetype/        Anki カードテンプレート（Umeboshi-Kaname）+ ソース EJS
claudeflare/     クラウド同期用 Cloudflare Worker（オプション）
docs/            アーキテクチャ、プラグイン開発
examples/        サンプルコンテンツと出典情報
```

---

## ライセンス

GNU AGPL-3.0 — [LICENSE](LICENSE) を参照。
AnKing Note Types から派生したコードを含みます — [NOTICE](NOTICE) を参照。

## コミュニティ

AI 生成カードには誤りが含まれる可能性があります。医学的内容は必ず信頼できる情報源で確認してください。

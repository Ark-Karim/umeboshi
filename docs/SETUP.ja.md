> [English version](SETUP.md) | 日本語版

# Umeboshi セットアップガイド

## クイックスタート（デフォルト — API キー不要）

デフォルト経路: Claude サブスクリプションで生成 + ローカル Whisper（英語）で文字起こし。

### 1. 前提ソフトウェアのインストール

| ツール | インストール | 確認 |
|------|---------|-------|
| **Node.js 18 以上** | [nodejs.org](https://nodejs.org/) | `node --version` |
| **Git** | [git-scm.com](https://git-scm.com/) | `git --version` |
| **Claude Code CLI** | `npm install -g @anthropic-ai/claude-code` | `claude --version` |
| **Anki 24.06 以上** | [apps.ankiweb.net](https://apps.ankiweb.net/) | Anki を起動 |
| **AnkiConnect** | Anki 24.06 以上に同梱 | ツール → アドオン |

### 2. クローンとインストール

```bash
git clone https://github.com/Ark-Karim/umeboshi.git
cd umeboshi
./install.sh
```

### 3. ノートタイプのインポート

1. Anki を開く
2. ツール → ノートタイプ管理 → 追加
3. 「Umeboshi-Kaname」を作成
4. `notetype/Umeboshi-Kaname/Front.html`、`Back.html`、`Styling.css` を各テンプレートタブにコピー＆ペースト
5. `notetype/Umeboshi-Kaname/notetype.json` から以下のフィールドを追加:
   `text`、`extra`、`imagesExtra`、`detailedDescription`、`highYieldSummary`、
   `visualAids`、`visualAidsExtra`、`additionalResources`、`oneByOne`、`umeboshiNoteId`

### 4. 生成を始める

```bash
cd /path/to/your/lecture/materials
claude
# Claude Code 内で:
/anki-card-generator-without-hs
```

---

## 代替経路

### DeepSeek（Claude サブスクリプション不要）

Claude Code を [DeepSeek の Anthropic 互換 API](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code/) で使用するよう設定します。

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

API キーは [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) から取得してください。
コスト: 90 分講義あたり約 $0.30（日本語）。

### OpenRouter（代替プロバイダ）

```bash
export ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1
export ANTHROPIC_AUTH_TOKEN="<your OpenRouter API Key>"
# オプション: /fast モード
export ANTHROPIC_DEFAULT_HAIKU_MODEL=anthropic/claude-haiku-4-5
export CLAUDE_CODE_SUBAGENT_MODEL=anthropic/claude-haiku-4-5
```

キーは [openrouter.ai/keys](https://openrouter.ai/keys) から取得してください。

### 外部文字起こし（日本語・非英語）

```bash
export FIREWORKS_API_KEY="fw_..."    # https://console.fireworks.ai → API Keys
```
その後 `plugins/registry.json` で切り替え:
```json
{ "backends": { "transcribe": { "active": "<your-plugin-name>" } } }
```
カスタム文字起こしバックエンドの作成については [PLUGIN_DEVELOPMENT.md](PLUGIN_DEVELOPMENT.md) を参照。
コスト: 音声 1 分あたり約 $0.004（プロバイダにより変動）。

### バックエンドの切り替え

`plugins/registry.json` を編集してアクティブなプラグインを変更します。[ARCHITECTURE.md](ARCHITECTURE.md) を参照。

---

## クラウド同期（オプション）

1. `npm install -g wrangler`
2. `cd claudeflare && npx wrangler kv:namespace create UMEBOSHI_KV`
3. KV ネームスペース ID で `wrangler.toml` を更新
4. `npx wrangler deploy`
5. Anki で: `s` キーを押す → ClaudeFlare URL → Worker URL を貼り付け

---

## ノートタイプをソースからビルド（オプション）

```bash
cd notetype/Umeboshi-Kaname
npm install ejs
./build
```
`src/front.ejs` + `src/components/*.ejs` をコンパイル → `Front.html` を生成します。

---

## トラブルシューティング

| 問題 | 解決策 |
|---------|----------|
| カードが表示されない | Anki が起動しており、AnkiConnect が有効であることを確認 |
| ClaudeFlare が未設定 | Anki 設定（`s` キー）で Worker URL を設定 |
| 文字起こしが失敗する（外部） | API キーが正しく設定され、有効であることを確認 |
| カード生成が失敗する（DeepSeek） | `DEEPSEEK_API_KEY` を確認 |
| スキルが見つからない | `./install.sh` を再実行 |
| ローカル Whisper が存在しない | `pip install openai-whisper` または `brew install whisper-cpp` |

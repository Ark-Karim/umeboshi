# Umeboshi Setup Guide
> [日本語版](SETUP.ja.md) | English version


> English (primary) — 日本語サマリは各セクションに併記

## Quickstart (Default — No API Keys) / クイックスタート

Default path: Claude subscription for generation + local Whisper (English) for transcription.
デフォルト経路: Claude サブスクリプションで生成 + ローカル Whisper（英語）で文字起こし。

### 1. Install Prerequisites / 前提ソフトウェアのインストール

| Tool | Install | Check |
|------|---------|-------|
| **Node.js 18+** | [nodejs.org](https://nodejs.org/) | `node --version` |
| **Git** | [git-scm.com](https://git-scm.com/) | `git --version` |
| **Claude Code CLI** | `npm install -g @anthropic-ai/claude-code` | `claude --version` |
| **Anki 24.06+** | [apps.ankiweb.net](https://apps.ankiweb.net/) | Launch Anki |
| **AnkiConnect** | Bundled with Anki 24.06+ | Tools → Add-ons |

### 2. Clone and Install / クローンとインストール

```bash
git clone https://github.com/Ark-Karim/umeboshi.git
cd umeboshi
./install.sh
```

### 3. Import the Notetype / ノートタイプのインポート

1. Open Anki
2. Tools → Manage Note Types → Add
3. Create "Umeboshi-Kaname"
4. Copy-paste `notetype/Umeboshi-Kaname/Front.html`, `Back.html`, `Styling.css` into template tabs
5. Add fields from `notetype/Umeboshi-Kaname/notetype.json`:
   `text`, `extra`, `imagesExtra`, `detailedDescription`, `highYieldSummary`,
   `visualAids`, `visualAidsExtra`, `additionalResources`, `oneByOne`, `umeboshiNoteId`

### 4. Start Generating / 生成を始める

```bash
cd /path/to/your/lecture/materials
claude
# Inside Claude Code:
/anki-card-generator-without-hs
```

---

## Alternative Paths / 代替経路

### DeepSeek (no Claude subscription) / DeepSeek（Claude サブスクリプション不要）

Configure Claude Code to use [DeepSeek's Anthropic-compatible API](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code/):

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

Get your API key from [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys).
Cost: ~$0.30 per 90-minute lecture (Japanese).

### OpenRouter (alternative provider) / OpenRouter（代替プロバイダ）

```bash
export ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1
export ANTHROPIC_AUTH_TOKEN="<your OpenRouter API Key>"
# Optional: /fast mode
export ANTHROPIC_DEFAULT_HAIKU_MODEL=anthropic/claude-haiku-4-5
export CLAUDE_CODE_SUBAGENT_MODEL=anthropic/claude-haiku-4-5
```

Get your key from [openrouter.ai/keys](https://openrouter.ai/keys).

### External Transcription / 外部文字起こし（日本語・非英語）

```bash
export FIREWORKS_API_KEY="fw_..."    # https://console.fireworks.ai → API Keys
```
Then switch in `plugins/registry.json`:
```json
{ "backends": { "transcribe": { "active": "<your-plugin-name>" } } }
```
See [PLUGIN_DEVELOPMENT.md](PLUGIN_DEVELOPMENT.md) to create a custom transcribe backend.
Cost: ~$0.004/min audio (varies by provider).

### Switching Backends / バックエンドの切り替え

Edit `plugins/registry.json` to change active plugins. See [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Optional: Cloud Sync / クラウド同期（オプション）

1. `npm install -g wrangler`
2. `cd claudeflare && npx wrangler kv:namespace create UMEBOSHI_KV`
3. Update `wrangler.toml` with KV namespace ID
4. `npx wrangler deploy`
5. In Anki: press `s` → ClaudeFlare URL → paste worker URL

---

## Optional: Build Notetype from Source / ノートタイプをソースからビルド（オプション）

```bash
cd notetype/Umeboshi-Kaname
npm install ejs
./build
```
Compiles `src/front.ejs` + `src/components/*.ejs` → `Front.html`.

---

## Troubleshooting / トラブルシューティング

| Problem | Solution |
|---------|----------|
| Cards not appearing | Anki must be running with AnkiConnect enabled |
| ClaudeFlare not configured | Set worker URL in Anki Settings (press `s`) |
| Transcription fails (external) | Verify API key is set and valid |
| Card generation fails (DeepSeek) | Verify `DEEPSEEK_API_KEY` |
| Skills not found | Re-run `./install.sh` |
| Local Whisper missing | `pip install openai-whisper` or `brew install whisper-cpp` |

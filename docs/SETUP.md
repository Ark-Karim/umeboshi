# Umeboshi Setup Guide

## Quickstart (Default — No API Keys)

Default path: Claude subscription for generation + local Whisper (English) for transcription.

### 1. Install Prerequisites

| Tool | Install | Check |
|------|---------|-------|
| **Node.js 18+** | [nodejs.org](https://nodejs.org/) | `node --version` |
| **Git** | [git-scm.com](https://git-scm.com/) | `git --version` |
| **Claude Code CLI** | `npm install -g @anthropic-ai/claude-code` | `claude --version` |
| **Anki 24.06+** | [apps.ankiweb.net](https://apps.ankiweb.net/) | Launch Anki |
| **AnkiConnect** | Bundled with Anki 24.06+ | Tools → Add-ons |

### 2. Clone and Install

```bash
git clone https://github.com/umeboshi/umeboshi.git
cd umeboshi
./install.sh
```

### 3. Import the Notetype

1. Open Anki
2. Tools → Manage Note Types → Add
3. Create "Umeboshi-Kaname"
4. Copy-paste `notetype/Umeboshi-Kaname/Front.html`, `Back.html`, `Styling.css` into template tabs
5. Add fields from `notetype/Umeboshi-Kaname/notetype.json`:
   `text`, `extra`, `imagesExtra`, `detailedDescription`, `highYieldSummary`,
   `visualAids`, `visualAidsExtra`, `additionalResources`, `oneByOne`, `umeboshiNoteId`

### 4. Start Generating

```bash
cd /path/to/your/lecture/materials
claude
# Inside Claude Code:
/anki-card-generator-without-hs
```

---

## Alternative Paths

### DeepSeek (no Claude subscription)

```bash
export DEEPSEEK_API_KEY="sk-..."    # https://platform.deepseek.com → API Keys
```
Cost: ~$0.30 per 90-minute Japanese lecture.

### External Transcription (Japanese / non-English)

```bash
export FIREWORKS_API_KEY="fw_..."    # https://console.fireworks.ai → API Keys
```
Then switch in `plugins/registry.json`:
```json
{ "backends": { "transcribe": { "active": "fireworks-whisper" } } }
```
Cost: ~$0.004/min audio.

### Switching Backends

Edit `plugins/registry.json` to change active plugins. See [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Optional: ClaudeFlare Cloud Sync

1. `npm install -g wrangler`
2. `cd claudeflare && npx wrangler kv:namespace create UMEBOSHI_KV`
3. Update `wrangler.toml` with KV namespace ID
4. `npx wrangler deploy`
5. In Anki: press `s` → ClaudeFlare URL → paste worker URL

---

## Optional: Build Notetype from Source

```bash
cd notetype/Umeboshi-Kaname
npm install ejs
./build
```
Compiles `src/front.ejs` + `src/components/*.ejs` → `Front.html`.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Cards not appearing | Anki must be running with AnkiConnect enabled |
| ClaudeFlare not configured | Set worker URL in Anki Settings (press `s`) |
| Transcription fails (external) | Verify API key is set and valid |
| Card generation fails (DeepSeek) | Verify `DEEPSEEK_API_KEY` |
| Skills not found | Re-run `./install.sh` |
| Local Whisper missing | `pip install openai-whisper` or `brew install whisper-cpp` |

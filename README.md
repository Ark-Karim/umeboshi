# Umeboshi — AI-Powered Anki Card Generator for Medical Students

Turn lecture slides and textbooks into high-quality Anki flashcards with bilingual
annotations, visual aids, and cloze deletions — in 2 commands.

```bash
# 1. Clone and install
git clone https://github.com/Ark-Karim/umeboshi.git && cd umeboshi
./install.sh

# 2. Launch Claude Code
claude
#    Inside Claude Code, type: /anki-card-generator-without-hs
```

**No API key required.** Claude Code runs on your existing Claude Pro ($20/mo)
or Max ($100–200/mo) subscription. Transcription uses your machine's GPU
(local Whisper, English default). See [docs.claude.com](https://docs.anthropic.com/en/docs/claude-code)
for subscription details and current limits.

## Prerequisites

- **[Node.js](https://nodejs.org/) 18+** and **[Git](https://git-scm.com/)**
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** CLI (`npm install -g @anthropic-ai/claude-code`)
- **[Anki](https://apps.ankiweb.net/) 24.06+** with [AnkiConnect](https://ankiweb.net/shared/info/2055492159) enabled
- **Anki running** in the background (cards are pushed via AnkiConnect on port 8765)

## One-Time Setup

1. **Import the notetype** — Open Anki → Tools → Manage Note Types → Add.
   Copy `notetype/Umeboshi-Kaname/Front.html`, `Back.html`, and `Styling.css`.
   See [docs/SETUP.md](docs/SETUP.md) for screenshots.

2. **(Optional) Enable cloud sync** — See `plugins/sync/claudeflare/SKILL.md` for Cloudflare-based LLM Q&A sync. Disabled by default.

## What This Does

1. **Transcribe** — Lecture audio → text (local Whisper, English; pluggable)
2. **Structure** — Key concepts → organized sections
3. **Cloze** — Fill-in-the-blank cards with smart grouping
4. **Annotate** — English medical terms as furigana (ruby)
5. **Visualize** — Auto-generated diagrams, tables, flowcharts
6. **Import** — Cards pushed directly to Anki via AnkiConnect

## Cost

| Path | Cost | Notes |
|------|------|-------|
| **Default** (Claude subscription + local Whisper) | $0 beyond subscription | Claude Pro $20/mo or Max $100–200/mo |
| DeepSeek (alt generation) | ~$0.30 / 90-min lecture | Requires `DEEPSEEK_API_KEY` |
| External transcription (alt) | ~$0.004/min audio | Fireworks/OpenRouter, for non-English |

### Using DeepSeek (no Claude subscription)

[DeepSeek's Anthropic-compatible API](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code/)
lets you use Claude Code without an Anthropic subscription.

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

### Using OpenRouter (alternative provider)

[OpenRouter](https://openrouter.ai/docs/cookbook/coding-agents/claude-code-integration)
provides multi-provider failover and budget controls.

```bash
export ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1
export ANTHROPIC_AUTH_TOKEN="<your OpenRouter API Key>"
# Optional: /fast mode
export ANTHROPIC_DEFAULT_HAIKU_MODEL=anthropic/claude-haiku-4-5
export CLAUDE_CODE_SUBAGENT_MODEL=anthropic/claude-haiku-4-5
```

Get your key from [openrouter.ai/keys](https://openrouter.ai/keys).

### Using external transcription (Japanese / non-English)

```bash
export FIREWORKS_API_KEY="fw_..."  # or OPENROUTER_API_KEY
# Edit plugins/registry.json → backends.transcribe.active to your backend
```

## Switching Backends

Umeboshi uses a plugin system. Change `plugins/registry.json` to swap backends:

```json
{
  "backends": {
    "transcribe": { "active": "local-whisper" },
    "generate":   { "active": "claude-code" },
    "import":     { "active": "ankiconnect" }
  }
}
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/PLUGIN_DEVELOPMENT.md](docs/PLUGIN_DEVELOPMENT.md).

## Project Structure

```
plugins/         Plugin system — swappable backends
skills/          Claude Code skill definitions (the pipeline)
notetype/        Anki card template (Umeboshi-Kaname) + source EJS
claudeflare/     Cloudflare Worker for cloud sync (optional)
docs/            Architecture, plugin development, setup guide
examples/        Sample content and source attribution
```

## License

GNU AGPL-3.0 — see [LICENSE](LICENSE).
Includes code derived from AnKing Note Types — see [NOTICE](NOTICE).

## Community

AI-generated cards may contain errors — verify medical content against trusted sources.

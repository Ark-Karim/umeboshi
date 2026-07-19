# Umeboshi — AI-Powered Anki Card Generator for Medical Students
> [日本語版](README.ja.md) | English version


Turn lecture slides and textbooks into high-quality Anki flashcards with bilingual
annotations, visual aids, and cloze deletions — in 2 commands.

```bash
git clone https://github.com/Ark-Karim/umeboshi.git && cd umeboshi && ./install.sh
claude
#    Inside Claude Code: /anki-card-generator-without-hs
```

**No API key required.** Claude Code runs on your existing Claude Pro ($20/mo)
or Max ($100–200/mo) subscription. Transcription uses your machine's GPU
(local Whisper, English default).

---

## What This Does

Each lecture becomes a deck of structured Anki cards through a 6-step pipeline:

1. **Transcribe** — Lecture audio → text (local Whisper, English; pluggable backends)
2. **Structure** — Key concepts → organized sections with exam-relevant highlights
3. **Cloze** — Smart fill-in-the-blank cards with contextual grouping
4. **Annotate** — English medical terms annotated with furigana (ruby), drug names color-coded with mnemonics
5. **Visualize** — Auto-generated diagrams, tables, flowcharts, and comparison charts
6. **Import** — Cards pushed directly to Anki via AnkiConnect (port 8765)

**Output**: Each card includes a ~3,000-character bilingual detailed description,
exam-focused high-yield summary, visual aids, and one-by-one cloze progression.

---

## Real-World Usage

Here's how a pharmacology student turns a lecture script into a reviewed Anki deck:

### Step 1: Generate Cards

```bash
cd C:\Users\chiba\StudySpace\pharmacology2Final
claude
# Run: /anki-card-generator-without-hs
```

The skill will prompt for:
- **Working directory** — where your script file lives (e.g., `C:\Users\chiba\StudySpace\pharmacology2Final`)
- **Script file** — your lecture text (e.g., `script/20.txt`)

Sub-agents then transcribe → structure → cloze → annotate → visualize → import.
Generation takes ~3–10 minutes per lecture depending on length and model.

**Pro tip — direct sub-agents for better quality**: When the skill asks for additional
instructions, you can tell sub-agents to:
- Emphasize exam-relevant content and bold high-yield points
- Target `detailedDescription` at ~3,000 characters (2,000–4,500 range)
- Prioritize topics the professor flagged for the exam

### Step 2: Manual Cloze Refinement

After generation, manually review the cards in Anki's browser (`b` key).
Add or adjust cloze deletions (`{{c1::...}}`) to match your study style.

### Step 3: Import with Bilingual + Color Annotations

```bash
# In Claude Code:
/anki-card-importer-without-hs
```

Provide:
- Working directory (e.g., `C:\Users\chiba\StudySpace\pharmacology2Final`)
- Original filename without extension (e.g., `17`)
- Deck name (e.g., `active::pharmacology2::17`)

**Pro tip — color-coded drug mnemonics**: Tell the D3 sub-agent:
> Assign a theme color to each drug class. Use `<span style="color: #xxxxxx;">` on drug
> names and stems. Pick colors from [JIS common color names](https://www.colordic.org/w)
> that act as mnemonics (e.g., EP1 antagonist → "Epipen" → yellow `#e6b422`).
> Document why you chose each color on first occurrence.

This makes drug names visually distinct and reinforces memorization through color association.

---

## Customization Tips

| What | How | Why |
|------|-----|-----|
| **Exam focus** | Tell the generate sub-agent which topics are high-yield | Cards surface what's tested |
| **Detail depth** | Set `detailedDescription` character target (recommended: 2,500–3,500) | Balances context vs. review speed |
| **Color mnemonics** | Use `<span style="color: ...;">` for drug/stem names | Visual memory hook for pharmacology |
| **Bold key points** | Request bolding of exam-critical content in sub-agent instructions | Quick scan during review |
| **Difficulty level** | Pass `level is easy/hard` to the import sub-agent | Controls card complexity |
| **Non-English transcription** | Switch to Fireworks/OpenRouter backend (see [Alternative Paths](#alternative-paths)) | Japanese, Chinese, etc. |

---

## Prerequisites

- **[Node.js](https://nodejs.org/) 18+** and **[Git](https://git-scm.com/)**
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** CLI (`npm install -g @anthropic-ai/claude-code`)
- **[Anki](https://apps.ankiweb.net/) 24.06+** with [AnkiConnect](https://ankiweb.net/shared/info/2055492159) enabled
- **Anki running** in the background (cards are pushed via AnkiConnect on port 8765)

---

## Detailed Setup

### 1. Clone and Install

```bash
git clone https://github.com/Ark-Karim/umeboshi.git
cd umeboshi
./install.sh
```

### 2. Import the Umeboshi-Kaname Note Type

1. Open Anki
2. **Tools → Manage Note Types → Add**
3. Create a new note type named **"Umeboshi-Kaname"**
4. Switch to the **Cards...** view and copy-paste:
   - `notetype/Umeboshi-Kaname/Front.html` → **Front template** tab
   - `notetype/Umeboshi-Kaname/Back.html` → **Back template** tab
   - `notetype/Umeboshi-Kaname/Styling.css` → **Styling** tab
5. Switch to the **Fields...** view and add these fields (order matters):

   | # | Field name |
   |---|------------|
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

   > The full field definition is in `notetype/Umeboshi-Kaname/notetype.json`.

### 3. Start Generating

```bash
cd /path/to/your/lecture/materials
claude
# Inside Claude Code:
/anki-card-generator-without-hs
```

---

## Alternative Paths

### DeepSeek (no Claude subscription)

<details>
<summary>Configure Claude Code for DeepSeek's Anthropic-compatible API</summary>

[DeepSeek's API](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code/)
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
Cost: ~$0.30 per 90-minute lecture (Japanese).
</details>

### OpenRouter (alternative provider)

<details>
<summary>Configure Claude Code for OpenRouter</summary>

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
</details>

### External Transcription (Japanese / non-English)

<details>
<summary>Switch to cloud transcription backends</summary>

```bash
export FIREWORKS_API_KEY="fw_..."    # https://console.fireworks.ai → API Keys
# or
export OPENROUTER_API_KEY="sk-or-..."  # https://openrouter.ai/keys
```

Then edit `plugins/registry.json` to switch the active transcription backend:
```json
{ "backends": { "transcribe": { "active": "<your-plugin-name>" } } }
```
See [docs/PLUGIN_DEVELOPMENT.md](docs/PLUGIN_DEVELOPMENT.md) to create a custom backend.
Cost: ~$0.004/min audio (varies by provider).
</details>

### Switching Backends

Umeboshi uses a plugin system. Edit `plugins/registry.json` to swap backends:

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

---

## Optional: Cloud Sync

Synchronize card Q&A across devices via Cloudflare Workers:

1. `npm install -g wrangler`
2. `cd claudeflare && npx wrangler kv:namespace create UMEBOSHI_KV`
3. Update `wrangler.toml` with the KV namespace ID
4. `npx wrangler deploy`
5. In Anki: press `s` → ClaudeFlare URL → paste your worker URL

See `plugins/sync/claudeflare/SKILL.md` for details. Disabled by default.

---

## Optional: Build Note Type from Source

```bash
cd notetype/Umeboshi-Kaname
npm install ejs
./build
```

Compiles `src/front.ejs` + `src/components/*.ejs` → `Front.html`.

---

## Cost

| Path | Cost | Notes |
|------|------|-------|
| **Default** (Claude subscription + local Whisper) | $0 beyond subscription | Claude Pro $20/mo or Max $100–200/mo |
| DeepSeek (alt generation) | ~$0.30 / 90-min lecture | Requires `DEEPSEEK_API_KEY` |
| External transcription (alt) | ~$0.004/min audio | Fireworks/OpenRouter, for non-English |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Cards not appearing | Anki must be running with AnkiConnect enabled (port 8765) |
| ClaudeFlare not configured | Set worker URL in Anki Settings (press `s`) |
| Transcription fails (external) | Verify API key is set and valid |
| Card generation fails (DeepSeek) | Verify `DEEPSEEK_API_KEY` env var |
| Skills not found | Re-run `./install.sh` |
| Local Whisper missing | `pip install openai-whisper` or `brew install whisper-cpp` |

---

## Project Structure

```
plugins/         Plugin system — swappable backends
skills/          Claude Code skill definitions (the pipeline)
notetype/        Anki card template (Umeboshi-Kaname) + source EJS
claudeflare/     Cloudflare Worker for cloud sync (optional)
docs/            Architecture, plugin development
examples/        Sample content and source attribution
```

---

## License

GNU AGPL-3.0 — see [LICENSE](LICENSE).
Includes code derived from AnKing Note Types — see [NOTICE](NOTICE).

## Community

AI-generated cards may contain errors — verify medical content against trusted sources.

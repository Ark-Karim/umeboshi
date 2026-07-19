# Plugin Interfaces — Umeboshi

Each backend type defines a contract. A plugin is a directory under `plugins/<type>/<name>/`
containing at minimum a `SKILL.md`. Plugins are Claude Code skills that follow the interface
below — the orchestrator discovers them via `plugins/registry.json`.

---

## 1. Transcribe Backend (`plugins/transcribe/<name>/SKILL.md`)

**Purpose**: Convert an audio or video file into a plain text transcript.

| Contract | Detail |
|----------|--------|
| **Input** | Absolute path to an audio file (mp3, wav, m4a, ogg, flac, ...) |
| **Output** | UTF-8 `.txt` file at `<working_dir>/Script/<basename>.txt` |
| **Env vars** | Backend-specific (e.g. `FIREWORKS_API_KEY`, `OPENROUTER_API_KEY`) |
| **Errors** | Report missing dependencies (ffmpeg, API key) with install instructions |

**SKILL.md must**:
- Describe how to install prerequisites (ffmpeg, API keys)
- Accept `--language <code>` and `--output <path>` conventions
- Document rate limits and file size caps

---

## 2. Generate Backend (`plugins/generate/<name>/SKILL.md`)

**Purpose**: Turn structured text (transcript, textbook excerpt) into Anki-ready HTML cards.

| Contract | Detail |
|----------|--------|
| **Input** | `<working_dir>/Script/<name>.txt` (transcribed text) |
| **Output** | `<working_dir>/detailedDescription/<name>.html` (card bodies with rough `{{cX::}}`) |
| **Optional output** | `<working_dir>/highYieldSummary/<name>.html` (summary cards) |
| **Env vars** | Backend-specific (e.g. `DEEPSEEK_API_KEY`) |
| **Cost** | Document per-lecture cost estimate in SKILL.md |

**SKILL.md must**:
- Accept a working directory and filename as parameters
- Produce valid HTML with `<h1>`–`<h4>` headings and `{{cX::}}` cloze markers
- Document the underlying model (Claude, DeepSeek, etc.) and its limits

---

## 3. Import Backend (`plugins/import/<name>/SKILL.md`)

**Purpose**: Take card JSON and push it into Anki (or export as .apkg).

| Contract | Detail |
|----------|--------|
| **Input** | `<working_dir>/notes/<name>.json` — array of card objects |
| **Card schema** | `{ text, highYieldSummary?, visualAids?, umeboshiNoteId, level, oneByOne }` |
| **Output** | Cards imported to Anki; reports created/skipped/failed counts |
| **Prerequisite** | Anki must be running (for AnkiConnect-based backends) |

**SKILL.md must**:
- Validate the JSON before importing (required fields: `text`, `umeboshiNoteId`)
- Report `created` / `skipped` / `failed` counts
- Handle duplicate notes gracefully
- Document the target notetype (default: `umeboshiKaname`)

---

## 4. Notetype (`plugins/notetype/<name>/`)

**Purpose**: Anki card rendering template — defines how card data appears in Anki.

| Contract | Detail |
|----------|--------|
| **Files** | `Front.html`, `Back.html`, `Styling.css`, `notetype.json` |
| **notetype.json** | Field definitions (at minimum: `text`, `extra`, `umeboshiNoteId`) |
| **Front.html** | Renders `{{text}}` with cloze support, one-by-one JS |
| **Back.html** | Renders `{{text}}` revealed + extra fields, optional LLM chat |

**Notetype plugins** are the card face rendered inside Anki. They are imported once into
Anki via Tools → Manage Note Types → Add, not invoked at runtime by Claude Code.

---

## Adding a New Plugin

1. Create `plugins/<type>/<name>/SKILL.md` implementing the interface above
2. Update `plugins/registry.json` → `backends.<type>.active` to `"<name>"`
3. The orchestrator auto-discovers the active plugin from the registry

See [PLUGIN_DEVELOPMENT.md](../docs/PLUGIN_DEVELOPMENT.md) for a step-by-step guide.

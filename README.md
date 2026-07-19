# Umeboshi — AI-Powered Anki Card Generator for Medical Students

Turn lecture slides and textbooks into high-quality Anki flashcards with bilingual
annotations, visual aids, and cloze deletions — in 3 commands.

```bash
# 1. Clone and install
git clone https://github.com/umeboshi/umeboshi.git && cd umeboshi
./install.sh

# 2. Set your API keys
export FIREWORKS_API_KEY="fw_..."     # Fireworks Console → API Keys
export DEEPSEEK_API_KEY="sk-..."      # DeepSeek Platform → API Keys

# 3. Import the notetype, then launch
#    (Anki → Manage Note Types → Add → paste from notetype/Umeboshi-Kaname/)
claude
#    Inside Claude Code, type: /anki-card-generator-without-hs
```

## Prerequisites

- **[Node.js](https://nodejs.org/) 18+** and **[Git](https://git-scm.com/)**
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** CLI (`npm install -g @anthropic-ai/claude-code`)
- **[Anki](https://apps.ankiweb.net/) 24.06+** with AnkiConnect enabled
- **Anki running** in the background (cards are pushed via AnkiConnect on port 8765)
- Fireworks API key ([console.fireworks.ai](https://console.fireworks.ai))
- DeepSeek API key ([platform.deepseek.com](https://platform.deepseek.com))

## One-Time Setup

1. **Import the notetype** — Open Anki → Tools → Manage Note Types → Add.
   Copy `notetype/Umeboshi-Kaname/Front.html`, `Back.html`, and `Styling.css`.
   See [docs/SETUP.md](docs/SETUP.md) for screenshots.

2. **(Optional) Deploy ClaudeFlare** — Cloud sync for LLM Q&A across devices.
   `cd claudeflare && npm install && wrangler deploy`

## What This Does

1. **Transcribe** — Lecture audio → text (Fireworks Whisper API)
2. **Structure** — Key concepts → organized sections
3. **Cloze** — Fill-in-the-blank cards with smart grouping
4. **Annotate** — English medical terms as furigana (ruby)
5. **Visualize** — Auto-generated diagrams, tables, flowcharts
6. **Import** — Cards pushed directly to Anki via AnkiConnect

## Project Structure

```
skills/          Claude Code skill definitions (the pipeline)
notetype/        Anki card template (Umeboshi-Kaname)
claudeflare/     Cloudflare Worker for cloud sync (optional)
docs/            Detailed setup guide & troubleshooting
examples/        Sample content and source attribution
```

## License

Apache License 2.0 — see [LICENSE](LICENSE).
Includes code derived from AnKing Overhaul — see [NOTICE](NOTICE).

## Community

AI-generated cards may contain errors — verify medical content against trusted sources.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

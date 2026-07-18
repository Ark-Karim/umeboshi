# Umeboshi — AI-Powered Anki Card Generator for Medical Students

Turn lecture slides and textbooks into high-quality Anki flashcards with bilingual
annotations, visual aids, and cloze deletions — in 3 commands.

```bash
# 1. Install Claude Code and copy skills
npm install -g @anthropic-ai/claude-code
cp -r skills/* ~/.claude/skills/

# 2. Set your API keys
export FIREWORKS_API_KEY="fw_..."     # for audio transcription
export DEEPSEEK_API_KEY="sk-..."      # for card generation

# 3. Generate cards from your lecture
claude /anki-card-generator-without-hs
```

## What This Does

Umeboshi (梅干し) is a Claude Code skill pipeline that transforms medical
learning materials into structured Anki flashcards:

1. **Transcribe** — Convert lecture audio to text (Fireworks Whisper API)
2. **Structure** — Extract key concepts into organized sections
3. **Cloze** — Generate fill-in-the-blank questions with smart grouping
4. **Annotate** — Add English medical terminology as furigana (ruby)
5. **Visualize** — Auto-generate diagrams, tables, and flowcharts
6. **Import** — Push cards directly to Anki via AnkiConnect

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- [Anki](https://apps.ankiweb.net/) 24.06+
- [AnkiConnect](https://ankiweb.net/shared/info/2055492159) add-on (included in Anki 24.06+)
- Fireworks API key ([console.fireworks.ai](https://console.fireworks.ai))
- DeepSeek API key ([platform.deepseek.com](https://platform.deepseek.com))
- (Optional) Cloudflare Workers account for cloud sync

## Setup

See [docs/SETUP.md](docs/SETUP.md) for detailed instructions including:
- Installing the Umeboshi-Kaname notetype in Anki
- Configuring the ClaudeFlare cloud sync backend (optional)
- Troubleshooting common issues

## Quick Start

```
1. Open Claude Code in your lecture directory
2. Run: /anki-card-generator-without-hs
3. Follow the prompts to select your input file (audio/pdf/txt)
4. Cards appear in Anki automatically
```

## Project Structure

```
skills/          Claude Code skill definitions (the pipeline)
notetype/        Anki card template (Umeboshi-Kaname)
claudeflare/     Cloudflare Worker for cloud sync (optional)
docs/            Detailed documentation
examples/        Sample content and source attribution
plans/           Project planning documents
```

## License

Apache License 2.0 — see [LICENSE](LICENSE).
This project includes code derived from AnKing Overhaul — see [NOTICE](NOTICE).

## Community

This is a community-driven project. AI-generated cards may contain errors —
always verify medical content against trusted sources.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

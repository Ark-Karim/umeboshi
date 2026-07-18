# Umeboshi Setup Guide

## 1. Install Prerequisites

### Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

### Anki + AnkiConnect
1. Install [Anki](https://apps.ankiweb.net/) 24.06 or later
2. AnkiConnect is bundled with Anki 24.06+. Verify at Tools → Add-ons → AnkiConnect.
   If missing, install from [AnkiWeb](https://ankiweb.net/shared/info/2055492159).

## 2. Install Umeboshi Skills

```bash
# Clone the repository
git clone https://github.com/umeboshi/umeboshi.git
cd umeboshi

# Copy skills to Claude Code's skill directory
cp -r skills/* ~/.claude/skills/
```

Or run the installer:
```bash
./install.sh
```

## 3. Import the Notetype

1. Open Anki
2. Tools → Manage Note Types → Add → "Umeboshi-Kaname"
3. Copy-paste the contents of `notetype/Umeboshi-Kaname/Front.html`,
   `Back.html`, and `Styling.css` into the respective template tabs.
4. Add the fields listed in `notetype/Umeboshi-Kaname/notetype.json`.

## 4. Set API Keys

```bash
# Required for audio transcription
export FIREWORKS_API_KEY="fw_..."

# Required for card generation
export DEEPSEEK_API_KEY="sk-..."
```

Get your keys:
- Fireworks: https://console.fireworks.ai → API Keys
- DeepSeek: https://platform.deepseek.com → API Keys

## 5. Verify Installation

```bash
cd /path/to/your/lecture/materials
claude
# Inside Claude Code, run:
/anki-card-generator-without-hs
```

## Optional: ClaudeFlare Cloud Sync

The cloud sync backend lets you sync Anki settings and LLM Q&A across devices.

1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/): `npm install -g wrangler`
2. Create a KV namespace: `wrangler kv:namespace create UMEBOSHI_KV`
3. Deploy: `cd claudeflare && wrangler deploy`
4. Set the URL in Anki: Settings → ClaudeFlare URL → your worker URL
5. Generate an invite code and register from Anki

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Cards not appearing in Anki | Ensure Anki is running and AnkiConnect is enabled |
| "ClaudeFlare not configured" | Set your ClaudeFlare URL and token in Anki Settings (s key) |
| Transcription fails | Verify `FIREWORKS_API_KEY` is set and valid |
| Card generation fails | Verify `DEEPSEEK_API_KEY` is set and accessible |
| Path errors in skills | Ensure skills are in `~/.claude/skills/` |

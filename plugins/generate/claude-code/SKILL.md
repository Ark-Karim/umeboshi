---
name: generate-claude-code
description: Generate Anki cards using Claude Code + DeepSeek. Default generate backend.
interface: plugins/generate
---

# Claude Code + DeepSeek — Generate Backend

Implements the `plugins/generate` interface. See `plugins/INTERFACE.md`.

## Delegation

This plugin delegates to the skill at `skills/anki-card-generator-without-hs/SKILL.md`.

To invoke: `/anki-card-generator-without-hs`

## Prerequisites

- Claude Code CLI (with Claude Pro/Max subscription)
- `DEEPSEEK_API_KEY` environment variable
- Node.js 18+

## Cost

- Claude subscription: included in monthly fee (Pro: $20/mo, Max: $100/$200/mo)
- DeepSeek: ~$0.30 per 90-minute Japanese lecture (实测值)

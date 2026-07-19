---
name: notetype-umeboshi-kaname
description: Umeboshi-Kaname notetype — bilingual medical Anki card template with cloze, LLM chat, and cloud sync.
interface: plugins/notetype
---

# Umeboshi-Kaname — Notetype

Implements the `plugins/notetype` interface. See `plugins/INTERFACE.md`.

## Files

- `Front.html` — Cloze one-by-one JS, Anki Persistence, ClaudeFlare sync, shuffle, timer, settings
- `Back.html` — LLM chat (SSE streaming), Q&A, brain rest countdown, ruby reveal, hint buttons
- `Styling.css` — Card styling (based on AnKing Overhaul, Apache 2.0)
- `notetype.json` — 10 fields: text, extra, imagesExtra, detailedDescription, highYieldSummary, visualAids, visualAidsExtra, additionalResources, oneByOne, umeboshiNoteId

## Installation

Import into Anki via Tools → Manage Note Types → Add. Copy each file manually.

## Attribution

Based on AnKing Overhaul (Apache 2.0). See `NOTICE` for full credits.

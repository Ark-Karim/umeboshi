---
name: import-ankiconnect
description: Import cards to Anki via AnkiConnect (localhost:8765). Default import backend.
interface: plugins/import
---

# AnkiConnect — Import Backend

Implements the `plugins/import` interface. See `plugins/INTERFACE.md`.

## Delegation

This plugin delegates to the skill at `skills/anki-card-python-addnotes/SKILL.md`.

## Prerequisites

- Anki 24.06+ running with AnkiConnect add-on enabled
- Python (stdlib only — `json`, `urllib.request`, `uuid`)

## Supported Operations

- **Import**: Push card JSON to Anki via AnkiConnect
- **Validate**: Check required fields, AnkiConnect connectivity
- **Report**: created/skipped/failed counts per import batch

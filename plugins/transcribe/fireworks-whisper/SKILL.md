---
name: transcribe-fireworks-whisper
description: Transcribe audio files using Fireworks Whisper API. Default transcribe backend.
interface: plugins/transcribe
---

# Fireworks Whisper — Transcribe Backend

Implements the `plugins/transcribe` interface. See `plugins/INTERFACE.md`.

## Delegation

This plugin delegates to the skill at `skills/transcribe-fireworks-whisper/SKILL.md`.

To invoke: `/transcribe-fireworks-whisper`

## Prerequisites

- `FIREWORKS_API_KEY` environment variable
- ffmpeg (for non-WAV/FLAC/MP3 files)
- Python `requests` package

## Cost

Fireworks Whisper v3 Turbo: ~$0.004/min of audio. A 90-minute lecture costs ~$0.36.

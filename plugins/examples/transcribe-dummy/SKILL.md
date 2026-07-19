---
name: transcribe-dummy
description: Sample transcribe plugin — copies input text file as-is (no actual transcription). Demonstrates the transcribe backend interface.
---

# Dummy Transcribe Backend (Sample Plugin)

This is a **sample plugin** demonstrating the transcribe backend interface.
It does NOT perform real transcription — it copies the input text file to the output
location. Use it as a template for building real transcribe plugins.

## Interface Contract

Implements: `plugins/transcribe/<name>/SKILL.md`
See: `plugins/INTERFACE.md` for the full interface specification.

## Prerequisites

None. This plugin requires no API keys or external tools.

## CoT

### 1. Input Validation

- Confirm the input file exists
- If the file is not a text file (`.txt`, `.md`), warn that this dummy plugin only handles text

### 2. Copy to Output

```bash
cp "<input_file>" "<working_dir>/Script/<basename>.txt"
```

### 3. Report

Report the output path and file size.

## Output

- Default output: `<working_dir>/Script/<basename>.txt`
- Format: UTF-8 text (passthrough)

## Edge Cases

- **File not found**: Report and ask for correct path
- **Non-text input**: Warn that this dummy plugin does not transcribe audio — suggest switching to a real transcribe backend

---

## How to Build a Real Transcribe Plugin from This

1. Copy this directory: `cp -r plugins/examples/transcribe-dummy plugins/transcribe/my-backend`
2. Replace the copy step with actual transcription logic (API call, local Whisper, etc.)
3. Document prerequisites (API keys, ffmpeg, model downloads)
4. Update `plugins/registry.json` → `backends.transcribe.active` to `"my-backend"`

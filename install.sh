#!/usr/bin/env bash
# Umeboshi installer — copies skills to Claude Code's skill directory
set -euo pipefail

SKILLS_SRC="$(cd "$(dirname "$0")/skills" && pwd)"
SKILLS_DEST="${HOME}/.claude/skills"

echo "Umeboshi — AI-Powered Anki Card Generator"
echo "=========================================="
echo ""

# Check Claude Code
if ! command -v claude &>/dev/null; then
    echo "⚠️  Claude Code CLI not found. Install with:"
    echo "   npm install -g @anthropic-ai/claude-code"
    echo ""
fi

# Create destination if needed
mkdir -p "${SKILLS_DEST}"

# Copy skills
echo "Installing skills to ${SKILLS_DEST}..."
cp -r "${SKILLS_SRC}/"* "${SKILLS_DEST}/"
echo "✓ Skills installed"

# API key check
echo ""
echo "Next steps:"
echo "1. Set API keys:"
echo "   export FIREWORKS_API_KEY=\"fw_...\""
echo "   export DEEPSEEK_API_KEY=\"sk-...\""
echo ""
echo "2. Import the notetype to Anki (see docs/SETUP.md)"
echo ""
echo "3. Start generating cards:"
echo "   cd /path/to/lecture && claude"
echo "   > /anki-card-generator-without-hs"
echo ""
echo "Done! 🎉"

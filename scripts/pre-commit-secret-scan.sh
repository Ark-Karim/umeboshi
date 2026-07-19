#!/usr/bin/env bash
# Pre-commit hook: scans staged changes for secrets
# Requires: gitleaks (recommended) or falls back to basic grep

set -euo pipefail

echo "🔍 Scanning for secrets..."

# Patterns to detect (redacted preview only, not the actual secrets)
PATTERNS=(
  'FIREWORKS_API_KEY=fw_'
  'DEEPSEEK_API_KEY=sk-'
  'OPENAI_API_KEY=sk-'
  'ANTHROPIC_API_KEY=sk-ant-'
  'OPENROUTER_API_KEY=sk-or-'
  'Authorization: Bearer [A-Za-z0-9_\-]{20,}'
  '-----BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY-----'
)

# Try gitleaks first
if command -v gitleaks &>/dev/null; then
  gitleaks detect --source . --verbose --redact
  if [ $? -ne 0 ]; then
    echo "❌ gitleaks detected secrets. Commit blocked."
    echo "   If false positive, add to .gitleaks.toml allowlist."
    exit 1
  fi
  echo "✓ gitleaks: clean"
  exit 0
fi

# Fallback: basic grep for common patterns
echo "⚠️  gitleaks not installed. Using basic grep (install gitleaks for full coverage):"
echo "   brew install gitleaks  /  choco install gitleaks"

FOUND=0
for pattern in "${PATTERNS[@]}"; do
  # Check staged changes only
  git diff --cached --name-only | while read -r file; do
    if [ -f "$file" ] && [[ "$file" != ".gitleaks.toml" ]] && [[ "$file" != *"plans/"* ]]; then
      if grep -nE "$pattern" "$file" 2>/dev/null; then
        FOUND=1
      fi
    fi
  done
done

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "❌ Potential secrets found in staged changes."
  echo "   Review the matches above. If they are false positives,"
  echo "   install gitleaks and configure .gitleaks.toml."
  exit 1
fi

echo "✓ Basic grep: clean"
exit 0

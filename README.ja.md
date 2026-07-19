> [English version](README.md) | 日本語版

# Umeboshi — 医学生のための AI 搭載 Anki カード生成ツール

講義スライドや教科書を、バイリンガル注釈・図解・穴埋め問題付きの高品質な
Anki フラッシュカードに変換します。たった 2 つのコマンドで。

```bash
# 1. クローンしてインストール
git clone https://github.com/Ark-Karim/umeboshi.git && cd umeboshi
./install.sh

# 2. Claude Code を起動
claude
#    Claude Code 内で以下を入力: /anki-card-generator-without-hs
```

**API キーは不要です。** Claude Code は既存の Claude Pro（月額 $20）または
Max（月額 $100〜200）サブスクリプションで動作します。文字起こしにはローカル
マシンの GPU を使用します（ローカル Whisper、デフォルトは英語）。サブスクリプ
ションの詳細と現在の制限については [docs.claude.com](https://docs.anthropic.com/en/docs/claude-code) を参照してください。

## 前提条件

- **[Node.js](https://nodejs.org/) 18 以上** および **[Git](https://git-scm.com/)**
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** CLI（`npm install -g @anthropic-ai/claude-code`）
- **[Anki](https://apps.ankiweb.net/) 24.06 以上**（[AnkiConnect](https://ankiweb.net/shared/info/2055492159) を有効化）
- **Anki がバックグラウンドで起動していること**（カードはポート 8765 の AnkiConnect 経由で送信されます）

## 初回セットアップ

1. **ノートタイプをインポートする** — Anki を開く → ツール → ノートタイプ管理 → 追加。
   `notetype/Umeboshi-Kaname/Front.html`、`Back.html`、`Styling.css` をコピーしてください。
   スクリーンショット付きの手順は [docs/SETUP.md](docs/SETUP.md) を参照。

2. **（オプション）クラウド同期を有効にする** — Cloudflare ベースの LLM Q&A 同期については `plugins/sync/claudeflare/SKILL.md` を参照してください。デフォルトでは無効です。

## このツールが行うこと

1. **文字起こし** — 講義音声 → テキスト（ローカル Whisper、英語。差し替え可能）
2. **構造化** — 重要概念 → 整理されたセクション
3. **穴埋め問題** — スマートなグループ化による穴埋めカード
4. **注釈** — 英語の医学用語にふりがな（ルビ）を付与
5. **視覚化** — 自動生成される図表・テーブル・フローチャート
6. **インポート** — AnkiConnect 経由でカードを直接 Anki に送信

## コスト

| 経路 | コスト | 備考 |
|------|------|-------|
| **デフォルト**（Claude サブスクリプション + ローカル Whisper） | サブスクリプション以外 $0 | Claude Pro $20/月 または Max $100〜200/月 |
| DeepSeek（代替生成） | 90 分講義あたり約 $0.30 | `DEEPSEEK_API_KEY` が必要 |
| 外部文字起こし（代替） | 音声 1 分あたり約 $0.004 | Fireworks/OpenRouter、非英語向け |

### DeepSeek を使用する（Claude サブスクリプション不要）

[DeepSeek の Anthropic 互換 API](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code/)
を使用すると、Anthropic サブスクリプションなしで Claude Code を利用できます。

```bash
# Linux/macOS
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN="<your DeepSeek API Key>"
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash

# Windows PowerShell
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<your DeepSeek API Key>"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
```

API キーは [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) から取得してください。

### OpenRouter を使用する（代替プロバイダ）

[OpenRouter](https://openrouter.ai/docs/cookbook/coding-agents/claude-code-integration)
はマルチプロバイダのフェイルオーバーと予算管理を提供します。

```bash
export ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1
export ANTHROPIC_AUTH_TOKEN="<your OpenRouter API Key>"
# オプション: /fast モード
export ANTHROPIC_DEFAULT_HAIKU_MODEL=anthropic/claude-haiku-4-5
export CLAUDE_CODE_SUBAGENT_MODEL=anthropic/claude-haiku-4-5
```

キーは [openrouter.ai/keys](https://openrouter.ai/keys) から取得してください。

### 外部文字起こしを使用する（日本語・非英語）

```bash
export FIREWORKS_API_KEY="fw_..."  # または OPENROUTER_API_KEY
# plugins/registry.json を編集 → backends.transcribe.active を利用するバックエンドに変更
```

## バックエンドの切り替え

Umeboshi はプラグインシステムを採用しています。`plugins/registry.json` を変更することでバックエンドを切り替えられます。

```json
{
  "backends": {
    "transcribe": { "active": "local-whisper" },
    "generate":   { "active": "claude-code" },
    "import":     { "active": "ankiconnect" }
  }
}
```

[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) および [docs/PLUGIN_DEVELOPMENT.md](docs/PLUGIN_DEVELOPMENT.md) を参照してください。

## プロジェクト構造

```
plugins/         プラグインシステム — 差し替え可能なバックエンド
skills/          Claude Code スキル定義（パイプライン）
notetype/        Anki カードテンプレート（Umeboshi-Kaname）+ ソース EJS
claudeflare/     クラウド同期用 Cloudflare Worker（オプション）
docs/            アーキテクチャ、プラグイン開発、セットアップガイド
examples/        サンプルコンテンツと出典情報
```

## ライセンス

GNU AGPL-3.0 — [LICENSE](LICENSE) を参照。
AnKing Note Types から派生したコードを含みます — [NOTICE](NOTICE) を参照。

## コミュニティ

AI 生成カードには誤りが含まれる可能性があります。医学的内容は必ず信頼できる情報源で確認してください。

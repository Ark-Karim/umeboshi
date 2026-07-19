# COST.md — Cost Structure / コスト構造

## Overview / 概要

Umeboshi は複数のバックエンドを切り替えて使える設計です。どの経路を使うかで
コストが変わります。以下に全経路のコストを一覧します。

---

## Cost Breakdown / コスト一覧

### Default Path (Recommended) / デフォルト経路（推奨）

| 工程 | バックエンド | コスト |
|------|------------|--------|
| 文字起こし | ローカル Whisper | **$0**（PCの電力のみ） |
| カード生成 | Claude Code（サブスクリプション） | **$0**（サブスクリプション内） |
| Anki インポート | AnkiConnect | **$0**（Anki 標準機能） |
| **合計** | | **$0（サブスクリプション料金を除く）** |

Claude サブスクリプション:
- **Pro**: $20/月
- **Max**: $100/月 または $200/月

最新の料金・利用上限は [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) を参照。

### DeepSeek Path (Alternative) / DeepSeek 経路（代替）

| 工程 | バックエンド | コスト |
|------|------------|--------|
| 文字起こし | ローカル Whisper | $0 |
| カード生成 | DeepSeek API | **~$0.30 / 90分講義**（実測値） |
| Anki インポート | AnkiConnect | $0 |
| **合計** | | **~$0.30 / 講義** |

DeepSeek API の最新料金: [platform.deepseek.com](https://platform.deepseek.com)

### External Transcription (Japanese / non-English) / 外部文字起こし経路

| サービス | モデル | コスト |
|---------|--------|-------|
| Fireworks | Whisper v3 Turbo | ~$0.004/分 = **~$0.36 / 90分** |
| OpenRouter | Whisper large-v3 | ~$0.006/分 = **~$0.54 / 90分** |

---

## Cost Scenarios / 利用シーン別の目安

### 1 Course (15 lectures) / 1科目（15回講義）

| 経路 | 文字起こし | 生成 | 合計 |
|------|----------|------|------|
| デフォルト（英語講義） | $0 | $0 | **$0** |
| DeepSeek（日本語講義） | $0 | ~$4.50 | **~$4.50** |
| DeepSeek + Fireworks（日本語） | ~$5.40 | ~$4.50 | **~$9.90** |

### 1 Year (2 semesters, 5 courses each = 150 lectures) / 1年間（150講義）

| 経路 | 年間コスト |
|------|----------|
| デフォルト | **$240〜$2,400**（Claude サブスクリプションのみ） |
| DeepSeek | **~$45**（DeepSeek API） |
| DeepSeek + Fireworks | **~$99**（DeepSeek + Fireworks API） |

---

## Cost-Saving Tips / コスト削減のヒント

1. **英語の講義はローカル Whisper で十分** — 追加コストゼロ
2. **DeepSeek は極めて安価** — Claude サブスクリプションがない場合の最善手
3. **Claude Pro ($20/mo) で十分な場合が多い** — まずは Pro から試し、必要なら Max にアップグレード

## Notes / 注意事項

- 上記の金額は 2026年7月時点の実測値・公開価格に基づく概算です
- API 料金は変動する可能性があります。各サービスの最新料金ページを確認してください
- Claude Code の利用上限はサブスクリプションプランと時間帯によって変動します

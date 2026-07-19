---
name: sync-claudeflare
description: Cloudflare Worker for LLM Q&A sync across devices (optional)
interface: plugins/sync
---

# ClaudeFlare — Cloud Sync Backend

ClaudeFlare は Anki カード内の LLM Q&A チャット機能をクラウド経由で
動作させる Cloudflare Worker です。**デフォルトでは無効**です。

## 概要

Umeboshi-Kaname notetype には、カード内容について質問できる
LLM チャット機能が組み込まれています。通常、この機能は
Claude Code のローカル API を直接呼び出しますが、
ClaudeFlare をデプロイすると以下の利点があります：

- 複数デバイス間で LLM 設定を同期
- API キーを Worker 側で一元管理
- 使用量のトラッキング

**注意**: ClaudeFlare は上級者向けのオプション機能です。
これがなくてもカード生成・レビューは完全に動作します。

## 前提条件

- [Cloudflare アカウント](https://dash.cloudflare.com/sign-up)
- [Node.js 18+](https://nodejs.org/)
- Umeboshi-Kaname notetype が Anki にインストール済み

## デプロイ手順

1. **依存関係のインストール**:
   ```bash
   cd claudeflare
   npm install
   ```

2. **KV ネームスペースの作成**:
   ```bash
   npx wrangler kv:namespace create UMEBOSHI_KV
   ```

3. **`wrangler.toml` の更新**:
   出力された KV namespace ID を `wrangler.toml` に記入。

4. **デプロイ**:
   ```bash
   npx wrangler deploy
   ```

5. **Anki 側の設定**:
   Anki でカードを開き、`s` キーを押して設定モーダルを表示。
   「ClaudeFlare URL」にデプロイされた Worker の URL を入力。

## 有効化

1. `plugins/registry.json` を編集:
   ```json
   { "backends": { "sync": { "active": "claudeflare" } } }
   ```

2. Anki 側で Worker URL を設定（上記手順5）。

## Cost

Cloudflare Workers 無料枠で十分動作します（10万リクエスト/日まで無料）。

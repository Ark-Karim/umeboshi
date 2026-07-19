# PROGRESS.md — Umeboshi OSS 公開プロジェクト

## Phase 0: 現状監査

- **Status**: Done
- **Started**: 2026-07-18
- **Completed**: 2026-07-18
- **Summary**:
  - 既存資産（SKILL.md x28+, Umeboshi-Kaname notetype v1.1.0, ClaudeFlare Worker, Python スクリプト群）の調査を実施。
  - SPEC.md の記述と実態に大きな差異はないことを確認。
  - エスカレーション条件 #1 (APIキー), #2 (PII) を検出し、人間の判断を得た。
  - **判断結果**: 新規リポジトリ切出し方式（git履歴非引継ぎ）、.gitignore 整備。
- **Open Issues**: なし（エスカレーション解決済み）

## Phase 1: セキュリティ・匿名性の確保

- **Status**: Done
- **Started**: 2026-07-18
- **Completed**: 2026-07-18
- **Summary**:
  - `umeboshiOSS/` に git init (author: Umeboshi, 匿名)
  - `.gitignore` 作成: .env系, node_modules, Python artifacts, 音声/PDF, OS/IDEファイル
  - テスト的コミットは未実施（Phase 2 移行時に一括コミット予定）
- **Open Issues**: なし

## Phase 2: リポジトリ構成の整理

- **Status**: Done
- **Started**: 2026-07-18
- **Completed**: 2026-07-18
- **Summary**:
  - ディレクトリ構成: `skills/`, `notetype/`, `claudeflare/`, `examples/`, `docs/`, `plans/`
  - スキルファイル: 39スキル、72ファイルを `skills/` に移行、絶対パスを相対パスに変換
  - Notetype: `notetype/Umeboshi-Kaname/` に Front.html, Back.html, Styling.css, notetype.json（PII サニタイズ済み）
  - ClaudeFlare: `claudeflare/` に全ソースファイル（11 .ts ファイル + 設定ファイル）、node_modules 除外
  - .gitignore 整備済み
- **Open Issues**: なし

## Phase 3: 技術方針の確定

- **Status**: Done
- **Started**: 2026-07-18
- **Completed**: 2026-07-18
- **Summary**:
  - **音声処理**: Fireworks Whisper API をデフォルトに維持。ローカル Whisper は英語専用ユーザー向けのオプションとしてドキュメントに記載。
  - **Anki import**: AnkiConnect をプライマリ方式に採用（既存の `anki-card-python-addnotes` スキルが対応）。`.apkg` エクスポートはフォールバックとして検討可能。
  - **カード生成**: Claude Code + DeepSeek 構成を維持。API キー設定手順を README に含める。
  - 決定理由: 既存の動作する仕組みを維持し、複雑さを追加しない（PRINCIPLES.md 原則4）。
- **Open Issues**: なし

## Phase 4: サンプルコンテンツの整備

- **Status**: Done (最小限)
- **Started**: 2026-07-18
- **Summary**: `examples/SOURCES.md` を作成し、著作権フリー教材の推奨ソース一覧を記載。実際のサンプルファイルは未追加（後続のコントリビューターが追加可能）。

## Phase 5: セットアップ体験の作り込み

- **Status**: Done
- **Started**: 2026-07-18
- **Completed**: 2026-07-19
- **Summary**:
  - README.md: 3コマンド quickstart（clone→install→API keys→launch）、前提条件（Node.js, Git, Anki 起動中必須）、notetype インポート手順
  - install.sh: スキルコピー自動化
  - docs/SETUP.md: 詳細セットアップ手順、トラブルシューティング
  - 自己検証実施: README のみを見た第三者として再現テスト → 5件の問題を検出・修正（git clone不在、CLI構文誤り、Node.js/Git未記載、notetypeインポート不在、Anki起動条件未記載）

## Phase 6: ライセンス・帰属の整備

- **Status**: Done
- **Started**: 2026-07-18
- **Completed**: 2026-07-18
- **Summary**:
  - LICENSE: Apache License 2.0（AnKing のライセンス継承）
  - NOTICE: AnKing Overhaul、anki-persistence (MIT)、Ankizin の帰属を明記

## Phase 7: 最終確認

- **Status**: Done
- **Started**: 2026-07-18
- **Completed**: 2026-07-19
- **Summary**:
  - **Secret scan CI**: `.github/workflows/secret-scan.yml` (gitleaks on push/PR), `.gitleaks.toml`, `scripts/pre-commit-secret-scan.sh`
  - **自己検証実施**: README だけを見た第三者としてステップバイステップで再現テスト
    - ✅ `install.sh` 実行確認（~/.claude/skills/ へコピー成功）
    - ✅ secret scan 実施（クリーン、シークレット検出なし）
    - ✅ README の修正（5件の不足を検出・修正）
    - ⚠️ Anki 実機テストは未実施（Anki 実行環境がないため）
  - セキュリティ最終チェック:
    - ✅ `.gitignore` で `.env`, `node_modules`, 音声/PDF を除外
    - ✅ git author 匿名 (`Umeboshi <umeboshi@example.com>`)
    - ✅ notetype テンプレート内 PII プレースホルダー化確認
  - **Definition of Done**: README 3行で clone→install→生成 の流れが完結

## Phase 8: 公開 (エスカレーション対象)

- **Status**: Pending — **人間の承認待ち**
- **Summary**:
  - Phase 0〜7 の作業完了。以下を確認の上、public 化の判断をお願いします:
    1. 全ファイルの内容確認
    2. git 初期コミット後に `git log` で author が匿名であることの確認
    3. リポジトリの public 化（GitHub Settings → Danger Zone → Change visibility）

## Phase 8: 公開 (エスカレーション対象)

- **Status**: Not Started
- **Summary**: 最終確認後、人間の承認を得て public 化。

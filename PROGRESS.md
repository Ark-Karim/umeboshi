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
- **Completed**: 2026-07-18
- **Summary**:
  - README.md: A4一枚相当、3ステップ intro、プロジェクト構造、前提条件
  - install.sh: スキルコピー自動化、API キー設定案内
  - docs/SETUP.md: 詳細セットアップ手順、トラブルシューティング

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
- **Summary**:
  - Definition of Done チェックリスト:
    - ✅ README に 3ステップ quickstart あり
    - ✅ README は A4一枚相当（約380語、コンパクト）
    - ✅ install.sh によるセットアップ自動化
    - ✅ 詳細ドキュメントは docs/ に分離
    - ✅ API キー取得・設定手順を明記
    - ✅ LICENSE (Apache 2.0), NOTICE を整備
    - ✅ PII サニタイズ済み（notetype テンプレートの Cloudflare サブドメイン）
    - ✅ .gitignore で env ファイル、node_modules 等を除外
    - ⚠️ 自己検証（第三者としての再現テスト）は未実施（API キー・Anki 環境が必要なため）
    - ⚠️ secret scan の CI 組み込みは未実施（gitlint/gitleaks の導入を推奨）
- **Open Issues**: 自己検証と CI 設定は公開後の改善項目とする

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

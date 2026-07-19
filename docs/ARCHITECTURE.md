# ARCHITECTURE.md — Umeboshi の設計

Umeboshi は「講義スライドや教科書から Anki カードを自動生成する」ツールです。
Claude Code のスキル機構の上に、プラグインで拡張できるパイプラインとして設計されています。

## 全体像

```
┌─────────────────────────────────────────────────────────┐
│                      入力 (音声/PDF/テキスト)              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  ① 文字起こし (Transcribe Backend)                       │
│     音声ファイル → テキストファイル                         │
│     デフォルト: Fireworks Whisper API                     │
│     切替可能: ローカル Whisper, OpenRouter など            │
└────────────────────────┬────────────────────────────────┘
                         │ Script/<name>.txt
                         ▼
┌─────────────────────────────────────────────────────────┐
│  ② カード生成 (Generate Backend)                         │
│     テキスト → HTMLカード (detailedDescription +          │
│     highYieldSummary)                                    │
│     デフォルト: Claude Code + DeepSeek                    │
│     切替可能: 他の LLM プロバイダ                          │
└────────────────────────┬────────────────────────────────┘
                         │ detailedDescription/<name>.html
                         │ highYieldSummary/<name>.html
                         ▼
┌─────────────────────────────────────────────────────────┐
│  ③ Cloze整形・2か国語・図表生成 (Formatter Skills)        │
│     HTML内の {{cX::}} を正規化、英日併記、図表追加        │
│     skills/ 配下の formatter 群が担当                     │
└────────────────────────┬────────────────────────────────┘
                         │ notes/<name>.json
                         ▼
┌─────────────────────────────────────────────────────────┐
│  ④ Ankiインポート (Import Backend)                       │
│     JSON → AnkiConnect → Anki デッキ                     │
│     デフォルト: AnkiConnect (localhost:8765)              │
│     切替可能: .apkg エクスポート など                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  ⑤ カード表示 (Notetype)                                │
│     Anki 内でカードをレンダリング                          │
│     Front: 穴埋め問題、タイマー、設定                      │
│     Back: 解答、LLM Q&A、脳休めカウントダウン             │
└─────────────────────────────────────────────────────────┘
```

## プラグインシステム

Umeboshi は **4種類のバックエンド** をプラグインとして差し替え可能です。
各バックエンドは「何を受け取り、何を出力するか」という規約（インターフェース）を定めており、
その規約に従えば誰でも新しいバックエンドを追加できます。

### バックエンド一覧

| バックエンド | 役割 | 入力 → 出力 | デフォルト実装 |
|-------------|------|------------|--------------|
| **Transcribe** | 音声→テキスト | 音声ファイル → `.txt` | Fireworks Whisper |
| **Generate** | テキスト→カード原稿 | `.txt` → `.html` ({{cX::}}付き) | Claude Code + DeepSeek |
| **Import** | JSON→Anki | `notes/*.json` → Ankiデッキ | AnkiConnect |
| **Notetype** | カード表示 | Ankiフィールド → 表示HTML | Umeboshi-Kaname |

### プラグインの切替方法

`plugins/registry.json` の `active` を書き換えるだけです：

```json
{
  "backends": {
    "transcribe": { "active": "local-whisper" }
  }
}
```

`plugins/<type>/<name>/SKILL.md` が存在すれば、それが新しいバックエンドとして認識されます。

## ディレクトリ構成

```
umeboshi/
├── plugins/                 ← プラグインシステム
│   ├── registry.json        ← アクティブなプラグインの指定
│   ├── INTERFACE.md         ← 各バックエンドの規約
│   ├── transcribe/          ← 文字起こしプラグイン
│   │   └── fireworks-whisper/SKILL.md
│   ├── generate/            ← 生成プラグイン
│   │   └── claude-code/SKILL.md
│   ├── import/              ← インポートプラグイン
│   │   └── ankiconnect/SKILL.md
│   ├── notetype/            ← ノートタイププラグイン
│   │   └── umeboshi-kaname/{Front,Back,Styling}.html
│   └── examples/            ← サンプルプラグイン
│       └── transcribe-dummy/SKILL.md
├── skills/                  ← Claude Code スキル（パイプライン実装）
├── notetype/                ← ノートタイプテンプレート本体
├── claudeflare/             ← クラウド同期（オプション）
├── docs/                    ← ドキュメント
│   ├── ARCHITECTURE.md      ← このファイル
│   ├── PLUGIN_DEVELOPMENT.md← プラグインの作り方
│   └── SETUP.md             ← セットアップ詳細
└── examples/                ← サンプル教材ソース
```

## データの流れ（詳細）

### 処理ワーキングディレクトリ

ユーザーが指定したワーキングディレクトリ（例: `C:\Users\...\Public Health\`）の下に、
以下のサブディレクトリが自動生成されます：

```
<working_dir>/
├── Script/                  ← 文字起こし結果 (.txt)
├── detailedDescription/     ← カード本文 (.html)
│   ├── cloze/               ← cloze整形後
│   └── eng/                 ← 2か国語併記後
├── highYieldSummary/        ← 要約カード (.html)
├── visualAids/              ← 図表 (.html)
├── mapping/                 ← セクション対応表 (.json)
└── notes/                   ← Ankiインポート用JSON
```

### カード1枚のデータ構造

```json
{
  "text": "<h2>1.2 細胞肥大</h2><p>{{c1::<ruby>Hypertrophy<rt>肥大</rt></ruby>}}とは...</p>",
  "highYieldSummary": "<h1>1 細胞傷害</h1><p>要点まとめ</p>",
  "visualAids": "<h1>1</h1><table>...</table>",
  "umeboshiNoteId": "0192a8f0-7b3e-7c4d-8e1f-2a3b4c5d6e7f",
  "level": "easy",
  "oneByOne": "y"
}
```

## 拡張ポイント

新しいバックエンドを追加したい場合は、対応する `plugins/<type>/` に
ディレクトリを作り、`SKILL.md` を書くだけです。
詳しくは [PLUGIN_DEVELOPMENT.md](PLUGIN_DEVELOPMENT.md) を参照してください。

### 将来的な拡張余地

- **プラグインレジストリ**: サードパーティ製プラグインの配布・検索基盤
- **Notetype ホットスワップ**: カード生成中にノートタイプを動的切替
- **マルチモーダル入力**: 画像・動画からの直接カード生成

これらは公開後、コミュニティの需要に応じて検討します。

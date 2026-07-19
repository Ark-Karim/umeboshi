# プラグインの作り方

> [English version](PLUGIN_DEVELOPMENT.md) | 日本語版

---

## プラグインって何？

プラグインは**ゲームカセット**のようなものです。差し込むだけで本体が認識します。
Umeboshi には 5つの「差込口」があります。

| スロット | 役割 | 例 |
|------|-------------|---------|
| `transcribe` | 音声をテキストに変換 | ローカル Whisper |
| `generate` | テキストを Anki カードに変換 | Claude Code（デフォルト） |
| `import` | カードを Anki に投入 | AnkiConnect |
| `notetype` | カードの見た目を変える | Umeboshi-Kaname |
| `sync` | クラウド同期（オプション） | ClaudeFlare |

---

## 5分で作る初めてのプラグイン

実際には文字起こしをしない、ただファイルをコピーするだけのプラグインを作ってみましょう。
プラグインの「Hello World」です。

### ステップ1: フォルダを作る

```
plugins/
  transcribe/
    my-first-plugin/    ← このフォルダを作る
```

```bash
mkdir -p plugins/transcribe/my-first-plugin
```

### ステップ2: 1つだけファイルを書く

`plugins/transcribe/my-first-plugin/SKILL.md` を作る:

```markdown
---
name: transcribe-my-first-plugin
description: My first plugin — copies the input file as-is
interface: plugins/transcribe
---

# My First Plugin

## これがすること
入力テキストファイルを出力先にコピーします。

## 必要なもの
- なし！そのまま動きます。

## CoT

### 1. 入力の確認
ユーザーがファイルを指定したか確認します。

### 2. ファイルをコピー
入力テキストを `<working_dir>/Script/<basename>.txt` にコピーします。

### 3. 完了！
出力ファイルができたか確認します。

## Output
- `<working_dir>/Script/<basename>.txt`

## Cost
$0 — API呼び出しなし、ファイルコピーのみ。
```

たった1ファイル。コード不要。

### ステップ3: Umeboshi に教える

`plugins/registry.json` を開き、`"transcribe"` の `"active"` を変える:

```json
{
  "backends": {
    "transcribe": { "active": "my-first-plugin" }
  }
}
```

### ステップ4: 試してみる

```bash
claude
# Claude Code 内で以下を実行:
/anki-card-generator-without-hs
```

作ったプラグインが自動で使われます。

### 🎉 プラグイン完成！

**学んだこと:**
- プラグイン = フォルダ1つ + ファイル1つ + 設定1行
- `interface` 行でどの差込口か指定
- `## CoT` が説明書
- `## Output` で出力ファイルを宣言

---

## お約束

プラグインには守るべきルールが少しだけあります:

| ルール | なぜ？ |
|--------|--------|
| 名前は `kebab-case` | `my-plugin` ✅ `MyPlugin` ❌ `my_plugin` ❌ |
| 先頭に YAML を書く | `---` で囲まれた部分。Umeboshi への名刺代わり |
| ファイルパスは**絶対パス** | `/home/user/lectures/slides.pdf` のように全部書く。`./slides.pdf` は不可 |
| 1プラグイン = 1フォルダ = 1ファイル | 1つのフォルダに2つのプラグインは入れない |

---

## プラグインの種類 — 差込口を選ぶ

### 1. 文字起こし (Transcribe)

```
Input:  音声ファイル (mp3, wav, m4a, ...)
Output: <working_dir>/Script/<filename>.txt
```

**必須:**
- 音声/動画ファイルを受け取る
- Script/ フォルダに UTF-8 テキストを出力
- 必要なツール (FFmpeg 等) を明記する

📁 コピーして使える見本: `plugins/examples/transcribe-dummy/SKILL.md`

### 2. カード生成 (Generate)

```
Input:  <working_dir>/Script/<filename>.txt
Output: <working_dir>/detailedDescription/<filename>.html
```

**必須:**
- 文字起こしテキストを読む
- `{{c1::答え}}` 形式のクローズマーカー付き HTML を出力
- 見出しは `<h1>`〜`<h4>`

📁 コピーして使える見本: `plugins/generate/claude-code/SKILL.md`

### 3. インポート (Import)

```
Input:  <working_dir>/notes/<filename>.json
Output: Anki にカードが投入される
```

**必須:**
- `notes/` フォルダの JSON を読む
- AnkiConnect (localhost:8765) 経由で Anki に投入
- 結果を報告: "Created: 42, Skipped: 0, Failed: 0"

📁 コピーして使える見本: `plugins/import/ankiconnect/SKILL.md`

### 4. ノートタイプ (Notetype)

```
Input:  （なし — Anki に1回だけインポート）
Files:  Front.html, Back.html, Styling.css, notetype.json
```

ノートタイププラグインは Anki に**1回だけ**インポートするタイプです。
カードの見た目（フォント、色、タイマー、ボタン）を決めます。
毎回実行されるわけではありません。

### 5. 同期（Sync、オプション）

```
Default: "none"（無効）
Enable:  registry.json で sync.active = "claudeflare" に設定
```

同期プラグインはノートタイプ内蔵の LLM チャット機能用です。
クラウドサービス（Cloudflare Worker など）のデプロイが必要です。

---

## うまく動かないとき

```
プラグインが見つからない？ → フォルダ名と registry.json の active 名は完全一致？
読み込まれない？ → 先頭の --- 行は正しい？
出力ファイルがない？ → 書き込み権限はある？
Anki に繋がらない？ → Anki 起動してる？ curl http://localhost:8765 を試す
```

---

## プラグインを公開する

作ったプラグインを世界に公開したい？

1. 正しいフォルダに配置: `plugins/<type>/<name>/`
2. `plugins/registry.json` にエントリを追加（`active` はデフォルトのまま）
3. GitHub で Pull Request を出す
4. クレジットが必要なら `NOTICE` に自分の名前を追加

### PR 提出前チェック

- [ ] インターフェースルールに従っている
- [ ] 必要なもの（APIキー、ツール）が書いてある
- [ ] 外部APIを使う場合、料金が書いてある
- [ ] 実際に動かして確認した

---

## コピーして使える実例

| プラグイン | フォルダ | 役割 |
|--------|--------|-------------|
| Dummy Transcribe | `plugins/examples/transcribe-dummy/` | 最もシンプルなプラグイン — 最初の一歩に最適 |
| Local Whisper | `plugins/transcribe/local-whisper/` | PCのGPUを使った本格的な文字起こし |
| Claude Code | `plugins/generate/claude-code/` | Claudeを使った本格的なカード生成 |
| AnkiConnect | `plugins/import/ankiconnect/` | 本格的な Anki インポート（デフォルト） |
| Umeboshi-Kaname | `plugins/notetype/umeboshi-kaname/` | 本格的なカードテンプレート |
| ClaudeFlare | `plugins/sync/claudeflare/` | クラウド同期（上級者向け、オプション） |

> 💡 **ヒント**: まずは `transcribe-dummy` をコピーして改造するのが一番簡単です。
> 最も短いプラグインで、仕組みを理解しやすいです。

---

## まとめ

```
1. 差込口を選ぶ    (transcribe / generate / import / notetype / sync)
2. フォルダを作る   (plugins/<type>/<name>/)
3. SKILL.md を書く  (上記のテンプレートに従う)
4. registry を更新  (registry.json の "active" を変更)
5. テストする！     (/anki-card-generator-without-hs を実行)
```

**本当にこれだけです。**

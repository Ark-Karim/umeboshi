# How to Make a Plugin
> [日本語版](PLUGIN_DEVELOPMENT.ja.md) | English version

# プラグインの作り方

> **English** (primary) | **日本語** (for Japanese-speaking friends)

---

## What's a Plugin? | プラグインって何？

A plugin is like a **game cartridge**. You plug it in, and the game console
knows what to do. Umeboshi has **5 slots** where you can plug in different cartridges:

| Slot | What it does | Example |
|------|-------------|---------|
| `transcribe` | Turns audio into text | Local Whisper on your PC |
| `generate` | Turns text into Anki cards | Claude Code (default) |
| `import` | Puts cards into Anki | AnkiConnect |
| `notetype` | Changes how cards look | Umeboshi-Kaname |
| `sync` | Cloud sync (optional) | ClaudeFlare |

> プラグインは**ゲームカセット**のようなものです。差し込むだけで本体が認識します。
> Umeboshi には 5つの「差込口」があります。

---

## Your First Plugin in 5 Minutes | 5分で作る初めてのプラグイン

Let's make a **transcribe plugin** that doesn't actually transcribe anything —
it just copies a text file. This is the "Hello World" of Umeboshi plugins.

> 実際には文字起こしをしない、ただファイルをコピーするだけのプラグインを作ってみましょう。
> プラグインの「Hello World」です。

### Step 1: Make a Folder | フォルダを作る

```
plugins/
  transcribe/
    my-first-plugin/    ← Make this folder / このフォルダを作る
```

```bash
mkdir -p plugins/transcribe/my-first-plugin
```

### Step 2: Write One File | 1つだけファイルを書く

Create `plugins/transcribe/my-first-plugin/SKILL.md`:

> `plugins/transcribe/my-first-plugin/SKILL.md` を作る:

```markdown
---
name: transcribe-my-first-plugin
description: My first plugin — copies the input file as-is
interface: plugins/transcribe
---

# My First Plugin

## What this does | これがすること
Copies the input text file to the output location.
入力テキストファイルを出力先にコピーします。

## Prerequisites | 必要なもの
- Nothing! Just works.
- なし！そのまま動きます。

## CoT

### 1. Check the input | 入力の確認
Make sure the user gave us a file.
ユーザーがファイルを指定したか確認します。

### 2. Copy the file | ファイルをコピー
Copy the input text to `<working_dir>/Script/<basename>.txt`.
入力テキストを `<working_dir>/Script/<basename>.txt` にコピーします。

### 3. Done! | 完了！
Confirm the output file exists.
出力ファイルができたか確認します。

## Output
- `<working_dir>/Script/<basename>.txt`

## Cost
$0 — no API calls, just file copy.
```

That's it. **One file. No coding required.** | たった1ファイル。コード不要。

### Step 3: Tell Umeboshi to Use It | Umeboshi に教える

Open `plugins/registry.json`. Find `"transcribe"` and change `"active"`:

> `plugins/registry.json` を開き、`"transcribe"` の `"active"` を変える:

```json
{
  "backends": {
    "transcribe": { "active": "my-first-plugin" }
  }
}
```

### Step 4: Test It | 試してみる

```bash
claude
# Inside Claude Code, run:
/anki-card-generator-without-hs
```

Your plugin runs automatically. | 作ったプラグインが自動で使われます。

### 🎉 You Made a Plugin! | プラグイン完成！

**What you learned | 学んだこと:**
- A plugin = 1 folder + 1 file + 1 registry change | フォルダ1つ + ファイル1つ + 設定1行
- The `interface` line tells Umeboshi which slot it fits in | `interface` 行でどの差込口か指定
- The `## CoT` section is the instruction manual | `## CoT` が説明書
- The `## Output` section says what files it creates | `## Output` で出力ファイルを宣言

---

## The Rules | お約束

Every plugin must follow these rules. There aren't many:

> プラグインには守るべきルールが少しだけあります:

| Rule | Why |
|------|-----|
| Use `kebab-case` names | `my-plugin` ✅ &nbsp; `MyPlugin` ❌ &nbsp; `my_plugin` ❌ |
| Start with YAML frontmatter | The `---` lines at the top. Tells Umeboshi what kind of plugin this is. |
| Always use **absolute paths** | `/home/user/lectures/slides.pdf` not `./slides.pdf` |
| 1 plugin = 1 folder = 1 `SKILL.md` | Don't put two plugins in one folder. |

> | ルール | なぜ？ |
> |--------|--------|
> | 名前は `kebab-case` | `my-plugin` ✅ `MyPlugin` ❌ |
> | 先頭に YAML を書く | `---` で囲まれた部分。Umeboshi への名刺代わり |
> | ファイルパスは**絶対パス** | `C:\Users\...\slides.pdf` のように全部書く |
> | 1プラグイン = 1フォルダ = 1ファイル | 1つのフォルダに2つのプラグインは入れない |

---

## Plugin Types — Pick Your Slot | プラグインの種類

### 1. Transcribe (Audio → Text) | 文字起こし

```
Input:  音声ファイル (mp3, wav, m4a, ...)
Output: <working_dir>/Script/<filename>.txt
```

**Your plugin must:** | **必須:**
- Take an audio/video file as input | 音声/動画ファイルを受け取る
- Write UTF-8 text to the Script/ folder | Script/ フォルダにテキストを出力
- Mention if FFmpeg or other tools are needed | 必要なツール (FFmpeg 等) を書く

📁 Example to copy: `plugins/examples/transcribe-dummy/SKILL.md` | コピーして使える見本

### 2. Generate (Text → Cards) | カード生成

```
Input:  <working_dir>/Script/<filename>.txt
Output: <working_dir>/detailedDescription/<filename>.html
```

**Your plugin must:** | **必須:**
- Read the transcript text | 文字起こしテキストを読む
- Output HTML with `{{c1::answer}}` cloze markers | `{{c1::答え}}` 形式の HTML を出力
- Use `<h1>` to `<h4>` for headings | 見出しは `<h1>`〜`<h4>`

📁 Example to copy: `plugins/generate/claude-code/SKILL.md`

### 3. Import (Cards → Anki) | インポート

```
Input:  <working_dir>/notes/<filename>.json
Output: Cards appear in Anki
```

**Your plugin must:** | **必須:**
- Read JSON from `notes/` folder | `notes/` フォルダの JSON を読む
- Put cards into Anki (AnkiConnect on port 8765) | AnkiConnect (localhost:8765) 経由で Anki に投入
- Report: "Created: 42, Skipped: 0, Failed: 0" | 結果を報告

📁 Example to copy: `plugins/import/ankiconnect/SKILL.md`

### 4. Notetype (How Cards Look) | ノートタイプ

```
Input:  (none — imported once into Anki)
Files:  Front.html, Back.html, Styling.css, notetype.json
```

Notetype plugins are different — they're imported **once** into Anki, not run every time.
They control the card's appearance: fonts, colors, timers, buttons.

> ノートタイププラグインは Anki に**1回だけ**インポートするタイプです。
> カードの見た目（フォント、色、タイマー、ボタン）を決めます。

### 5. Sync (Cloud, Optional) | 同期（オプション）

```
Default: "none" (disabled)
Enable:  Set registry.json → sync.active = "claudeflare"
```

Sync plugins are for the notetype's built-in LLM Q&A chat feature.
They require deploying a cloud service (e.g., Cloudflare Worker).

> 同期プラグインはノートタイプ内蔵の LLM チャット機能用です。
> クラウドサービス（Cloudflare Worker など）のデプロイが必要です。

---

## Debugging: When Something Goes Wrong | うまく動かないとき

```
Plugin not found? ──→ Check: does the folder name match registry.json exactly?
プラグインが見つからない？ → フォルダ名と registry.json の active 名は完全一致？

SKILL.md not loaded? ──→ Check: are the --- lines at the very top?
読み込まれない？ → 先頭の --- 行は正しい？

Output file missing? ──→ Check: can you write to the working directory?
出力ファイルがない？ → 書き込み権限はある？

AnkiConnect fails? ──→ Check: is Anki running? Try: curl http://localhost:8765
Anki に繋がらない？ → Anki 起動してる？ curl http://localhost:8765 を試す
```

---

## Sharing Your Plugin | プラグインを公開する

Want to share your plugin with the world?

> 作ったプラグインを世界に公開したい？

1. Put it in the right folder: `plugins/<type>/<name>/`
2. Add an entry in `plugins/registry.json` (leave `active` as the default)
3. Open a Pull Request on GitHub
4. Add yourself to `NOTICE` if you want credit

### PR Checklist | PR 提出前チェック

- [ ] `SKILL.md` follows the interface rules | インターフェースルールに従っている
- [ ] Prerequisites are listed | 必要なもの（APIキー、ツール）が書いてある
- [ ] Cost is documented (if using external APIs) | 外部APIを使う場合、料金が書いてある
- [ ] I tested it end-to-end | 実際に動かして確認した

---

## Real Examples You Can Copy | コピーして使える実例

| Plugin | Folder | What it does |
|--------|--------|-------------|
| Dummy Transcribe | `plugins/examples/transcribe-dummy/` | Simplest possible plugin — great starting point |
| Local Whisper | `plugins/transcribe/local-whisper/` | Real transcription using your PC's GPU |
| Claude Code | `plugins/generate/claude-code/` | Real card generation using Claude |
| AnkiConnect | `plugins/import/ankiconnect/` | Real Anki import (the default) |
| Umeboshi-Kaname | `plugins/notetype/umeboshi-kaname/` | Real card template |
| ClaudeFlare | `plugins/sync/claudeflare/` | Cloud sync (advanced, optional) |

> 💡 **Tip**: Start by copying `transcribe-dummy` and changing it.
> It's the shortest plugin and easiest to understand.
>
> 💡 **ヒント**: まずは `transcribe-dummy` をコピーして改造するのが一番簡単です。

---

## Summary | まとめ

```
1. Pick a slot     (transcribe / generate / import / notetype / sync)
2. Make a folder   (plugins/<type>/<name>/)
3. Write SKILL.md  (follow the template above)
4. Update registry (change "active" in registry.json)
5. Test it!        (run /anki-card-generator-without-hs)
```

**That's really all there is to it.** | **本当にこれだけです。**
---
name: html-formatter
description: HTMLの出力形式や書式を定義する。HTMLでの出力やHTMLファイルの作成を求められたらどんな場合でもこのスキルに従う。
---

# Format

## Requirements

### MUST

1. Wrap plain text in `<p>` tags — even single-line paragraphs.
2. Follow the example format; generate output by adapting the provided examples.
3. Place a half-width space immediately before every `<ruby>`, `</ruby>`, `<rt>`, and `</rt>` tag.
<!-- （プレーンテキストも必ず <p> で囲む。例の書式に従って生成する。<ruby> 系タグの直前には半角スペースを入れる。） -->

### NEVER

1. Do not use `style` or `class` attributes inside HTML tags.
2. Do not define CSS with `<style>` — CSS is always provided separately.
3. Do not write CSS at all.
4. External CDNs, external fonts, and external images are prohibited.
5. Never include `<body>`, `<html>`, or any document-level wrapper tags.
6. Do not use `<details>` or `<summary>`.
7. Do not use `<pre>`, `<sup>`, or `<sub>` — they disrupt display when combined with `<ruby>`. Use HTML entities instead (e.g. `&#8308;` for superscript 4).
<!-- （style/class属性の併記禁止。<style>やCSS記述禁止。外部CDN・フォント・画像禁止。<body>/<html> は含めない。<details>/<summary> 禁止。<pre>/<sup>/<sub> は ruby との表示崩れのため禁止、エスケープで代替。） -->

### SHOULD

1. Use only the allowed tags listed below.
2. Escape characters that interfere with HTML parsing. Escape emojis.
<!-- （許可タグのみ使用。HTML干渉文字と絵文字はエスケープ。） -->

### COULD

1. Preserve `[]` attribute annotations for technical terms within bold text, if already present in input.
2. Preserve `『』` metaphor annotations, if already present in input.
<!-- （入力に既に含まれる [] 属性注釈や『』比喩注釈は引き継いでよい。） -->

## Chain of Thought

1. Identify the structural elements in the source content: headings, paragraphs, lists, tables, and any terminology/metaphor annotations already present.
2. Wrap every plain-text paragraph in `<p>` tags, applying `<strong>` for bold spans and `<code>` for inline code references.
3. Structure list items: use `<ul>` for unordered lists or `<ol>` for ordered lists, with each item in `<li>`.
4. Build tables: wrap in `<table>`, use `<thead>` / `<tbody>` / `<tfoot>` as appropriate, with `<tr>` for rows and `<th>` / `<td>` for cells.
5. Apply `<ruby>` and `<rt>` for furigana/reading annotations, ensuring a half-width space precedes each ruby tag.
6. Apply `[]` attribute annotations for technical terms within bold text (`<strong>`) — only if such annotations already exist in the input. Do not invent new ones.
7. Apply `『』` metaphor annotations — only if such annotations already exist in the input. Do not invent new ones.
8. Escape HTML-sensitive characters (`<`, `>`, `&`) and all emoji using HTML entities or numeric character references.
9. Strip or reject any prohibited constructs: `style`/`class` attributes, `<style>` blocks, external resource references, document-wrapper tags (`<html>`, `<body>`), `<details>`/`<summary>`, and `<pre>`/`<sup>`/`<sub>`.
10. Output only the content fragment — never wrap output in `<html>`, `<head>`, or `<body>`.
<!-- （1. 元コンテンツの構造を特定。2. プレーンテキストを <p> で囲み <strong>/<code> を適用。3. リストを <ul>/<ol>/<li> で構造化。4. 表を <table> 系タグで構築。5. <ruby>/<rt> を適用し直前に半角スペース。6-7. [] 属性注釈・『』比喩注釈は入力にあれば引き継ぎ、新規追加しない。8. HTML干渉文字と絵文字をエスケープ。9. 禁止要素を除去。10. コンテンツ断片のみ出力し <html>/<body> でラップしない。） -->

## Allowed Tags

- `<h1>`
- `<h2>`
- `<h3>`

- `<p>`
- `<strong>`

- `<ul>`
- `<ol>`
- `<li>`

- `<code>`

- `<table>`
- `<thead>`
- `<tbody>`
- `<tfoot>`
- `<tr>`
- `<th>`
- `<td>`

- `<ruby>`
- `<rt>`

- `<img>`
- `<audio>`

- `<hr>`
- `<blockquote>`

<!-- （使用を許可されているHTMLタグの一覧。） -->

## Prohibited Rules

- Do not use `style` or `class` attributes inside HTML tags.
- Do not define CSS with `<style>`. CSS is always provided separately.
- Do not write CSS at all.
- External CDNs, external fonts, and external images are prohibited.
- Never include tags such as `<body>` or `<html>`.
- `<details>` and `<summary>` are prohibited.
- `<pre>`, `<sup>`, and `<sub>` are prohibited. They disrupt display when used together with `<ruby>`. Use numeric character references instead, e.g. `&#8308;`.

<!-- （style/class属性併記禁止。<style>やCSS記述禁止。外部CDN・フォント・画像禁止。<body>/<html> を含めない。<details>/<summary> 禁止。<pre>/<sup>/<sub> は ruby 併用時の表示崩れのため禁止、数値文字参照で代用。） -->

## Special Requirements

- Plain text must also be wrapped in `<p>`.
- Escape content that interferes with HTML tags. Escape emojis.

<!-- （プレーンテキストも <p> で囲む。HTMLタグと干渉する文字と絵文字はエスケープする。） -->

## Passive Rules (Conservative Rules)

These rules need not be applied proactively; however, if the input file already contains these annotations, preserve the formatting as-is.

<!-- （積極的に適用する必要はないが、入力ファイルに既に含まれている場合は書式を引き継ぐルール群。） -->

### Terminology Attribute Annotation Rule (`[]`)

When a technical term (molecule, drug, anatomical term, disease, etc.) appears for the first time inside bold text (`**`, `<strong>`), append its category/classification in `[]` (square brackets) immediately after the term to reduce the reader's cognitive load. Choose the most appropriate label from the list below. Do not use any attribute outside this list. The content inside `[]` must be in English only; do not attach `<ruby>` to it.

<!-- （太字内で専門用語が初出する際、認知負荷軽減のため直後に [] で属性を明記。下記リストから選択し、リスト外は使わない。[] 内は英語のみ、ruby は付けない。） -->

Valid `[]` labels:

- Molecules / Substances: `[mol]` `[ion]` `[peptide]` `[prot]` (protein) `[enz]` `[rcpt]` `[ch]` `[gene]` `[bioact]` (physiologically active substance) `[bmrk]` (biomarker)
- Drugs / Treatments: `[drug]` `[MoA]` (mechanism of action) `[RoA]` (route of administration) `[metabolic path]` (metabolic pathway) `[trnsp]` (transporter) `[proc]` (procedure) `[anesthesia]` (anesthesia method) `[CI]` (contraindication) `[SE]` (side effect)
- Anatomy / Histology: `[sys]` `[site]` `[struct]` `[tis]` `[cell]` `[epithelial class]`
- Medicine / Pathology: `[dz]` `[sx]` `[sign]` `[pathog]` `[vir class]` `[Gram]` `[test]` `[lab]` `[ECG]` `[sev class]` `[RF]` `[px]` `[epidemiological index]`
- Other: `[class]`

<!-- （[] 内に指定可能なラベルの一覧。分子・物質、医薬品・治療、解剖・組織、医学・病態、その他に分類。） -->

### Metaphor Annotation Rule (`『』`)

Use `『』` (Japanese corner brackets) to explicitly mark metaphors. Do not attach `<ruby>` to content inside `『』`. Use either Japanese or English only — do not mix languages inside the brackets.

- Example: Ubiquitination 『タグ付けによる分解・廃棄の指示』
- Example: Cascade 『ドミノ倒し』

<!-- （比喩を『』で明記。『』内に ruby は付けない。日本語か英語の一方のみ。例を参照。） -->

---

## Priorities

When requirements conflict, resolve in the following priority order.

<!-- （要件が相反する場合の優先順位。） -->

MUST

1. Comply with all Prohibited Rules.
2. Comply with all Special Requirements.
3. Comply with the example format (generate output by adapting the examples).
4. Follow Passive Rules (conservative rules).

SHOULD

5. Comply with allowed-tag restrictions.
6. Always insert a half-width space immediately before `<ruby>`, `</ruby>`, `<rt>`, and `</rt>`.

<!-- （MUST: 1.禁止事項遵守 2.特殊要件遵守 3.例の書式遵守 4.消極的ルール準拠。SHOULD: 5.許可タグ遵守 6.ruby系タグ直前に半角スペース。） -->

---

# Example

```html
<h1>§1 浮腫の病態生理</h1>
<h2>Starlingの力と毛細血管での水分交換</h2>
<p>毛細血管壁は水や小さな分子を通す <strong>セミパーメアブル膜</strong> である。血管内と組織間の水分の移動方向は、血管内外の圧力バランスによって決まる。この圧力バランスを <strong>Starlingの力（Starling Forces）</strong> と呼ぶ。</p>
<p>水分の移動を支配する2つの力:</p>
<ul>
<li><strong>静水圧（Hydrostatic Pressure）</strong>: 血管内の血液が壁に加える圧力。水分を血管外へ押し出す方向に働く。</li>
<li><strong>膠質浸透圧（Oncotic Pressure）</strong>: 血漿蛋白、特に <strong>アルブミン（Albumin）</strong> が発生する浸透圧。水分を血管内へ引き戻す方向に働く。</li>
</ul>
<pre><code>動脈側: 静水圧 &gt; 膠質浸透圧 ──&gt; 水分が血管外へ濾出
静脈側: 静水圧 &lt; 膠質浸透圧 ──&gt; 水分が血管内へ再吸収
</code></pre>
<p>正常では濾出された液体の約90%が静脈側で再吸収される。残りの約10%は <strong>リンパ管（Lymphatic vessels）</strong> が回収し、静脈系へ還流する。この精密なバランスが崩れ、組織間に過剰な液体が貯留した状態が <strong>浮腫（Edema）</strong> である。</p>
<h2>浮腫の4つの発生機序</h2>
<p>浮腫は以下の4つの機序のいずれか、または複数の組み合わせで発生する。</p>
<table>
<thead>
<tr>
  <th>機序</th>
  <th>病態の概要</th>
```

```html
<h1>§1 {{c1::<span class='bl'><span class='bl-en'>Benzodiazepine</span><span class='bl-ja'>ベンゾジアゼピン</span></span>}}系薬物の作用と副作用</h1>
<p>GABA<sub>A</sub> Receptorを標的とする<b>「{{c1::Benzodiazepine}}系薬物」</b>は、臨床現場で極めて頻繁に使用され、国家試験やCBTでも必出の重要な薬である。代表的な薬物として{{c2::<span class='bl'><span class='bl-en'>Diazepam</span><span class='bl-ja'>ジアゼパム</span></span>}}（商品名：セルシン、ホリゾン）や{{c3::<span class='bl'><span class='bl-en'>Midazolam</span><span class='bl-ja'>ミダゾラム</span></span>}}（商品名：ドルミカム）がある。</p>
<code>
  <p>Q: {{c1::Benzodiazepine}}系薬物を高齢者に処方する際、特に注意すべき副作用とそのメカニズムは何か？</p>
  <p>A: 最も警戒すべきは「{{c4::ふらつき・転倒からの骨折}}」と「{{c5::<span class='bl'><span class='bl-en'>Amnesia</span><span class='bl-ja'>健忘</span></span>（記憶・学習能力の低下）}}」である。...</p>
</code>
```

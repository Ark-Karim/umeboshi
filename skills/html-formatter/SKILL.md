---
name: html-formatter
description: HTMLの出力形式や書式を定義する。HTMLでの出力やHTMLファイルの作成を求められたらどんな場合でもこのスキルに従う。
---

# format

## 使用できるタグ

* `<h1>`
* `<h2>`
* `<h3>`

* `<p>`
* `<strong>`

* `<ul>`
* `<ol>`
* `<li>`

* `<code>`

* `<table>`
* `<thead>`
* `<tbody>`
* `<tfoot>`
* `<tr>`
* `<th>`
* `<td>`

* `<ruby>`
* `<rt>`

* `<img>`
* `<audio>`

* `<hr>`
* `<blockquote>`


## 禁止事項

- HTMLタグ内の style, class 併記は、行ってはいけない。
- <style> で CSS を定義してはいけない。CSS はどんな場合でも、別ですでに用意されている。
- CSS を書いてはいけない。
- 外部 CDN・外部フォント・外部画像は禁止
- <body>, <html> などのタグは決して含めない。
- <details>, <summary> は使用禁止
- <pre>, <sup>, <sub> は使用禁止。<ruby> と併用すると表示が乱れるため。&#8308; のように、エスケープする。

## 特殊要件

- plain text も <p> で囲む。
- HTML タグと干渉するものは エスケープする. 絵文字は escape する. 

## 消極的ルール (新しく修正する必要はないが、入力ファイルに含まれていたら書式を引き継ぐ)

### 専門用語の属性明記ルール (`[]`)

太字内（`**`, `<strong>`）で, 以下に分類される専門用語（分子、医薬品、解剖学用語、疾患など）が初めて登場する際、読み手の認知負荷を排除するため、名称の直後に `[]`（角括弧）を用いてその「属性や分類」を明記. 属性の記述にあたっては、以下の指定対象リストから最も適切なものを選択して適用. リスト外の属性を使ってはいけない. [] 内は英語表記のみとし、ruby は付けない。

[] 内に指定する対象リスト
- 分子・物質： [mol] [ion] [peptide] [prot] (protein) [enz] [rcpt] [ch] [gene] [bioact] (生理活性物質) [bmrk] (biomarker)
- 医薬品・治療： [drug] [MoA] (mechanism of action) [RoA] (route of administration) [metabolic path] (代謝経路) [trnsp] (transporter) [proc] (術式) [anesthesia] (麻酔法) [CI] (禁忌) [SE] (side effect)
- 解剖・組織： [sys] [site] [struct] [tis] [cell] [epithelial class]
- 医学・病態： [dz] [sx] [sign] [pathog] [vir class] [Gram] [test] [lab] [ECG] [sev class] [RF] [px] [epidemiological index]
- その他： [class]

### 比喩の併記ルール (`『』`)

『』を使用して比喩を明記する. 『』内には ruby を付けてはいけない. 日本語か英語の一方のみとする. 

- 例: ユビキチン化 『分解・廃棄のタグ付け』
- 例: Cascade 『ドミノ倒し』


---

# Priorities

要件が相反する場合は以下の順で優先する。

MUST

1. 禁止事項 の遵守
2. 特殊要件 の遵守
3. example 形式の遵守（example を書き換えるように生成。）
4. 消極的ルール

SHOULD

5. 使用できるタグ の遵守
6. `<ruby>`, `</ruby>`, `<rt>`, `</rt>` の直前には必ず半角スペースを入れる



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
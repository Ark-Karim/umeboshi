---
name: anki-card-formatter-detaileddescription
description: none
---

# Role

あなたは優秀な医学教育者です. 医学生向けに 日本語版 Kaplan Medical USMLE Step 1 Lecture Notes を出版する仕事をしています.

# Task

detailedDescription を生成する. 入力ファイルが断片的なときは背景を補って関連付け、教育効果の高いテキストにする.

---

# Common regulations（全ステップから参照）

以下の quality criteria と Priorities は、後続の「§1のみ生成」ステップ・「§2以降を含む残り生成」ステップの両方に共通して適用される. 各ステップは、この節を参照するのみとし、内容を重複して記述しない.

## 書式ルール（外部参照スキル）

以下の書式定義ファイルに厳格に従う. 各ファイルにはそれぞれ MUST / SHOULD / COULD が定義されている.

MUST

- /html-formatter (MUST)
- /text-formatter-structuring (MUST)

SHOULD

- /html-formatter (SHOULD)
- /text-formatter-structuring (SHOULD)

- /text-formatter-chart
- /text-formatter-metaphor
- /text-formatter-anki

## detailedDescription 固有の quality criteria（MUST）

- 太字部分をAnkiで穴埋めにして覚えることによって、USMLE Step 1 が 9割 とれるようになること. 太字部分の選定は時間対効果を最大化できるようにする. 
- 断片的な知識を統合し、体系的にまとめる. 入力ファイルが断片的なときは背景を補って関連付ける. 
- Elaborative Rehearsal の強制結合: 単なる事実の羅列（A＝B）ではなく、原因と結果を結びつける中間的な病態生理ステップを必ず1文の中に論理的に組み込む. 
- 日本語のみで作成する. 日本語、英語を併記する必要はない.

## detailedDescription 固有の quality criteria（SHOULD）

- 「文章」と、「表、フローチャート、箇条書き」の比率は、1:1 もしくは 2:1 にする. 
- 意識的に専門用語に対する説明を増やし、わかりやすくする. 高校生レベルでも理解できるようにする.
- Elaborative Rehearsal の強制結合: 単なる事実の羅列（A＝B）ではなく、原因と結果を結びつける中間的な病態生理ステップを必ず1文の中に論理的に組み込む. 

## detailedDescription 固有の quality criteria（COULD）

- Dual-Process Theory の適用: 直感的特徴（パターン認識：System 1用キーワード）と、論理的特徴（機序分析：System 2用キーワード）の双方を同一ノート内にバランスよく配置する.
- Error-Driven Learning の組み込み: 受験生が誤認しやすい「典型的な鑑別診断（DDx）」の要素を、否定文（「〜は伴わない」）の形で文中に明示的に組み込む.

## Priorities

要件が相反する場合は以下の順で優先する.

MUST

- /html-formatter (MUST)
- /text-formatter-structuring (MUST)
- detailedDescription 固有の quality criteria（MUST）
- /text-formatter-metaphor (MUST)

SHOULD

-  /text-formatter-chart
-  /text-formatter-anki

- /html-formatter (SHOULD)
- /text-formatter-structuring (SHOULD)

- example 形式の遵守（example を書き換えるように生成する）
- detailedDescription 固有の quality criteria（SHOULD）

COULD

-  /text-formatter-metaphor (COULD)
- detailedDescription 固有の quality criteria（COULD）

## 共通ルーチン: section / sub section の長さチェック・分割

対象範囲（§1のみ、または全体）に対して /text-formatter-structuring の要件（文字数上限など）に従っているか検証する.

- 長すぎる場合 → section, sub section を分割する. 表や箇条書きなどの形式を崩さず、単純に2つや3つに分ける. 認知負荷の高いものになってはいけない. 書式ルールは死守する.
  - 例: 文字数が上限の120%の sub section であれば、文字数50%の sub section と文字数70%の sub section に分ける.
- 分割・統合時も連番になるように保つ. 例えば §4 を分割した場合は §5 以降の番号を一つ後ろにずらし、1から section 番号が連続する整数で続くようにする. `4-A` のような連番でない番号を付けてはいけない.
- §1検証時に分割が発生した場合は、§2以降の章立て計画（節・サブ節の対応表）も同時に修正する.

---

# CoT

## Step: Create tasks

`TaskCreateTool` を用いて、以下の各ステップ（## xxx, ### xxx, #### xxx, ...）に対応するタスクを作成する.

## Step: 単元の特定

トピックがどの単元（講義）に位置するかを特定する. 以下の情報を手がかりにする:

- ユーザーの指定
- テキスト・教材の章立て・見出し構造
- 既存のカリキュラムや講義名

## Step: 章立てを作成

全体を典型的な教科書の節立てに準拠して章立てする. 全体を分割して章立てする.

section, sub section について、タイトル、テーマを出力する.

- Use this skill: /text-formatter-structuring
- 指定がない場合、detailedDescription 全体の文字数は 5000字程度とする.
- 各 section / sub section の目安文字数は、全体目安文字数（既定5000字、ユーザー指定がある場合はその値）を確定した section 数（またはsub section数）で除して動的に算出する. 算出した目安字数は以降の生成・長さチェックの基準として用いる.

## Step: §1のみ の detailedDescription を生成（チェックポイント）

- 一時出力先: `/detailedDescription/temp/<original filename without extension>.html`

detailedDescription の章立てを考慮して、**§1のみ**、detailedDescription を生成する. 全体の作成はこの時点では行わない. これは全体構成を早期に検証するためのチェックポイントである.

情報源の優先順位:
1. ユーザー提供の授業資料がある場合 → そこから抽出・整理
2. 授業資料がない場合 → 自身の知識で作成

適用ルール: 「共通ルール定義」章の書式ルール・quality criteria（MUST/SHOULD）・Priorities に厳格に従う.

### Step: §1 の長さチェック・分割

「共通ルーチン: section / sub section の長さチェック・分割」を §1 に対して実行する. 分割が発生した場合は §2 以降の章立て計画を修正する.

## Step: §1 と残りの統合（マージ）

§1 の検証・確定後、以下の手順で最終ファイルへ統合する.

1. `/detailedDescription/temp/<original filename without extension>.html` の内容（検証・分割反映済みの確定版 §1）を読み込む.
2. 最終出力先 `/detailedDescription/<original filename without extension>.html` の先頭部分として、確定版 §1 をそのまま転記する（書式・番号を変更しない）.
3. 続けて §2 以降を同一ファイルに追記生成する（次ステップ）.
4. 統合後、full ファイルに対して全体の連番（section: 1, 2, 3...／sub section: 1.1, 1.2...）が一貫していることを確認する.
5. 一時ファイル（temp配下）は統合完了後は最終ファイルの参照元としてのみ扱い、最終ファイルの内容を正とする.

## Step: §2以降を含む残りすべての detailedDescription を生成

- 出力先: `/detailedDescription/<original filename without extension>.html`（§1に続けて追記）

情報源の優先順位:
1. ユーザー提供の授業資料がある場合 → そこから抽出・整理
2. 授業資料がない場合 → 自身の知識で作成

適用ルール: 「共通ルール定義」章の書式ルール・quality criteria（MUST/SHOULD）・Priorities に厳格に従う.

### Step: 全体の長さチェック・分割

「共通ルーチン: section / sub section の長さチェック・分割」を、統合後の detailedDescription 全体に対して実行する.

---

# Example

```html
<h1>1. 腎臓の構造</h1>

<h2>1.1 腎臓の全体構造</h2>
<p>腎臓は断面を見ると、<strong>外側の皮質[組織]</strong>と<strong>内側の髄質[組織]</strong>に分かれる.</p>
<ul>
  <li>皮質: 糸球体群[構造]『ミクロのフィルター』が集まり、血液をろ過する.</li>
  <li>髄質: 集合管[組織]が束状に走行する. 集合管は、ろ過した原尿を集めて腎盂[組織]へ導く.</li>
</ul>

<h2>1.2 ネフロン: ろ過の最小単位</h2>
<p>ネフロンは糸球体とそれに接続する尿細管から構成され、片腎に約100万個存在する機能単位である.</p>
<code>
輸入細動脈から血液が流入<br>
──> 糸球体が初期成分をろ過する<br>
──> 原尿が移動<br>
──> 必要な成分を再吸収する[尿細管]<br>
──> 尿として排泄
</code>
<p>&#x1F511; <strong>体液・電解質バランスの維持</strong>と<strong>代謝産物の除去『不要なゴミをきれいに捨てる』</strong>という2つの重要な役割をネフロンは担う.</p>

<h1>2. 糸球体の構造</h1>

<h2>2.1 糸球体を構成する3つの細胞</h2>
<p>糸球体は毛細血管球と呼ばれる構造で、メサンギウム細胞、ポドサイト（上皮細胞）、内皮細胞の3種類の細胞で構成される.</p>
<p>血液が流れる血管腔のファーストバリアが内皮細胞で、物理的バリアを形成する. フェネストラ[構造]を介して血球以外の成分を透過する.</p>
<p>その外側にある基底膜を挟んで、一番外側で血管を包み込んでいるのがポドサイト（上皮細胞）である.</p>
<p>メサンギウム細胞は、これら複雑に折れ曲がった毛細血管の隙間を埋めて構造を支えるクッションであり、必要に応じて縮むことで収縮による血流量調節、および貪食機能を担う.</p>

<table>
  <thead>
    <tr>
      <th>細胞</th>
      <th>位置</th>
      <th>主な機能</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>メサンギウム細胞</strong></td>
      <td>毛細血管間（メサンギウム領域）</td>
      <td>構造支持、血流量調節、貪食『工場のメンテナンス担当』</td>
    </tr>
    <tr>
      <td><strong>ポドサイト（上皮細胞）</strong></td>
      <td>基底膜の外側</td>
      <td>足突起でスリット膜を形成し、分子レベルのふるい</td>
    </tr>
    <tr>
      <td><strong>内皮細胞</strong></td>
      <td>基底膜の内側</td>
      <td>フェネストラ『窓空き構造のざる』を持ち、血液成分レベルのふるい</td>
    </tr>
  </tbody>
</table>

<h2>2.2 GBM</h2>
<p>基底膜[構造]は内皮細胞とポドサイトの間に位置する.『内側と外側の間にある物理的な壁』<strong>Ⅳ型コラーゲンα3・α4・α5[タンパク質]</strong>の三つ編み構造で構成される. この膜が非常に丈夫な網の目を形成し、大きなタンパク質が漏れ出るのを防ぐ、選択的ろ過の物理的バリアとなる.</p>
<p>Ⅳ型コラーゲン遺伝子の先天性異常はAlport症候群を引き起こす. また、自分の免疫システムがこの三つ編みを誤って敵とみなし、攻撃してしまう病気が抗GBM病（旧グッドパスチャー症候群）である.</p>
<p>&#x1F511; 基底膜の異常は遺伝性（Alport症候群）と自己免疫性（抗GBM病）の2つの病態に大別される.</p>

<h2>2.3 糸球体のろ過機構</h2>
<code>
輸入細動脈から血液が流入する<br>
──> 糸球体毛細血管でろ過を実行する<br>
      ├─ 基底膜が物理的バリアとして機能<br>
      └─ ポドサイト（上皮細胞）の足突起が分子ろ過を実行<br>
</code>
<p>&#x1F511; スリット膜[構造]は、ポドサイト（上皮細胞）の足突起障害により破綻する. 大量のタンパク尿（ネフローゼ症候群）を誘発する.</p>

<h1>3. 糸球体腎炎の分類</h1>

<h2>3.1 糸球体腎炎の分類の変遷</h2>
<p>糸球体腎炎の分類には2つのアプローチがある.</p>
<ul>
  <li><strong>WHO分類</strong>：形態学的分類を基準とする. かつて主流であった.</li>
  <li><strong>病因分類</strong>：病因および発症機序を基準とする. 近年主流である.</li>
</ul>

<h2>3.2 原発性と二次性</h2>
<p>原発性糸球体腎炎は腎臓そのものが病気の主役であるため、ステロイド薬や免疫抑制薬を使って、腎臓で起きている炎症を直接抑え込む治療が中心になる.</p>
<p>二次性糸球体腎炎は、根本にある原疾患の制御が必須となる. 例えば糖尿病性腎症であれば、腎臓だけを治療しても意味がなく、根本にある血糖値をコントロールしなければ腎臓の機能は良くならない.</p>

<table>
  <thead>
    <tr>
      <th>分類</th>
      <th>定義</th>
      <th>代表疾患</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>原発性</strong></td>
      <td>病変が腎臓のみ『工場そのものの漏電』</td>
      <td>IgA腎症、膜性腎症、MCNS</td>
    </tr>
    <tr>
      <td><strong>二次性</strong></td>
      <td>全身性疾患に伴って腎臓にも火の粉が降りかかるもの</td>
      <td>ループス腎炎、糖尿病性腎症、アミロイドーシス</td>
    </tr>
  </tbody>
</table>
<p>&#x1F511; 原発性と二次性では治療方針が根本的に異なるため、鑑別は極めて重要である.</p>

<h2>3.3 日本における疾患頻度</h2>
<code>
原発性糸球体腎炎の頻度（日本）<br>
├─ IgA腎症（最多）<br>
├─ 膜性腎症<br>
└─ MCNS（微小変化型ネフローゼ症候群）
</code>
<p>IgA腎症は、免疫物質の一種であるIgAが糸球体にゴミのように溜まってしまう病気である. 日本におけるIgA腎症の検出頻度の高さには、アジア人における遺伝的背景および学校・職場の健康診断による尿検査の普及が関与する.</p>
<p>膜性腎症は、高齢男性に多く発症する. MCNSは、小児や若年者に急性発症する.</p>
<p>注意点：</p>
<p>&#x1F6AB; 疾患頻度は地域差や遺伝的背景の影響を受ける. 日本と欧米ではIgA腎症の頻度が大きく異なる.</p>
```
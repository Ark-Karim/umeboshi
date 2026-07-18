---
name: anki-card-formatter-eng-full
description: null
---

# Task

添付のファイルについて、日本語→英語、英語→日本語、に翻訳し、保存する.2か国語併記にし、どちらの言語の native speaker でも読めるようにする. HTMLの <ruby>タグを用いて英文 (ベース) と和文 (ルビ) を併記. input file を上書きしてはならない. 

sub agent を使ってはいけない. 人力で処理する. 

# CoT

### step 1. ファイルの存在確認

### step 2. 要件確認

/html-formatter (skills/html-formatter/SKILL.md) の読み込み

Quality criteria の把握

### step 3. 各 HTMLファイルのテキスト要素を抽出し、以下の規則で ruby 単位に 分割する.

    - Cloze の有無による分割: 
            - {{cX::...}} を含まない文 --> 日本語の節 (文節ではない) を1つの単位とする. 節とは、主語と述語の関係 (述語部) を含み、1つのまとまった意味を表す文の一部である. 1つの節の目安は 30-60 文字程度である.  30 文字以内に 分割しすぎないようにする. 
            - e.g. 必要以上に分割しない: [昨日私が買った本は、とても面白い. ] --> [昨日私が買った本は、とても面白い. ]
            ⁻ e.g. 30-60 文字程度であれば, 分割してもいい: [スクリーニングにおける陽性的中率は低く、1万人の検診でがんが見つかるのは約33人に留まる. ] --> [スクリーニングにおける陽性的中率は低い. / 1万人の検診で【がんが見つかる】のは約33人に留まる. ]

            - {{cX::...}} を含む文 --> 「cloze の手前」「cloze 部分」「cloze の後ろ」に強制分割する. 
            - e.g. [  <ruby>  <rt>  </ruby> {{cX::  <ruby>  <rt>  </ruby>}}  <ruby>  <rt>  </ruby>]

    - 箇条書きの分離: 「A: B」の構造は「A:」と「B」に分離し、独立した文として扱う.
    - 除外対象のマーク: 見出し先頭数字 (4.4など) 、矢印 (→など) 、記号 (⚡、🚫、""、()) の位置を特定し、ルビ適用対象から除外する.
    - 除外対象の単語: 日本語でも英語でも同一の clozeや文については、英語のみでいい.日本語は不要.

### Cloze 外テキストの翻訳とルビ生成

分割した各チャンクを英訳し、 <ruby>英文 <rt>和文 </rt> </ruby> の形式を構築する.

- 翻訳レベル: 中学生レベルの基礎的英単語・文法を使用し、一文を短くする.ただし、医療・科学分野の専門用語はそのまま使用する.

- 対訳の対応関係: 英語と日本語の語順・文構成を極力一致させる (困難な場合は日本語の語順・構成を優先する) .


### Cloze内テキストの翻訳とパターン適用

{{cX::...}} 内のテキストに対し、セクション内での出現回数や構成に応じて以下のパターンを厳密に適用する. cloze 外とは異なる規則なので注意する. 

**パターン1: 専門用語 (はじめて出現) **
{{cX:: <ruby>English <rt>日本語 </ruby>}}
例: 一つ一つの細胞自身のサイズを大きくする「{{c5::肥大}}」 → 一つ一つの細胞自身のサイズを大きくする「{{c5:: <ruby>Hypertrophy <rt>肥大 </rt> </ruby>}}」

**パターン2: 専門用語 (同一セクション内2回目以降) **
{{cX::Only English}} (ruby 不要) 
例: §1で {{c1::感染}} が2回目に出てきた → {{c1::Infection}}

**パターン3: 略語 (同一セクション内で初出) **
{{cX:: <ruby>略称: 英語正式名称 <rt>日本語 </ruby>}}
例: {{c33::RCD}} → {{c33:: <ruby>RCD: Regulated Cell Death <rt>多様な制御性細胞死 </rt> </ruby>}}

**パターン4: 専門用語 (専門用語) **
{{cX:: <ruby>English1 <rt>日本語1 </rt> </ruby>}} ({{cX::<ruby>English2 <rt>日本語2 </rt> </ruby>}})
例: {{c4::腸上皮化生 (バレット食道) }} → {{c4:: <ruby>Intestinal Metaplasia <rt>腸上皮化生 </rt> </ruby>}} ({{c4:: <ruby>Barrett's Esophagus <rt>バレット食道 </rt> </ruby>}})

- {{cX::...}} タグが必ず <ruby> タグの最外殻に位置するように配置する. 日本語と英語の両方がクローズ内に隠れることを保証する.

### HTML構造の再構築とフォーマット適用

抽出・翻訳したものを、HTML構造へ戻す. この際、除外対象とした記号や矢印、見出し数字は  <ruby> や cloze の外側に配置する.

- /html-formatter に従う.

### Save

指定された「Final report format」のテンプレートに従い、実行結果、変更パス、変更内容の要約、例外事態の有無を記録したレポートを出力する.

成果物を 指定 ディレクトリに、指定ファイル名で保存する.



# Quality criteria

#### MUST

###### 概要

- 2か国語併記にし、どちらの言語の native speaker でも読めるようにする.
- /html-formatter (skills/html-formatter/SKILL.md) に従う.
- 省略の禁止: 元のテキストの要素を一切省略せず、すべて出力に反映させること.

###### 詳細

- ルビの粒度とclozeによる分割: cloze記法 ({{c1::...}} など) を含まない文は、原則として「節 (単語が集まって、その中に**「主語」と「述語」の関係 を含んでいる一続きのまとまり.読点 (、) の前後がそれぞれ「節」.) 」を1つの単位とし、 <ruby>英文 <rt>和文 </ruby> の形式で出力すること.

    e.g. 
    - 「EGFR遺伝子に変異が起こると」  (主語：変異が / 述語：起こると) 
    - 「細胞が異常に増殖します」  (主語：細胞が / 述語：増殖します) 

- 文中に cloze 記法が存在する場合は、その cloze 部分を独立したチャンクとして扱い、その前後で文を強制的に分割すること.分割された「clozeの手前」「cloze部分」「clozeの後ろ」のそれぞれに個別の  <ruby> タグを適用すること.

- 文中にカッコ ` () , ()` を含む場合はその前後、カッコ内、カッコ外で、必ず ruby 単位を分割すること.

- cloze 記法と ルビが重なる場合は、必ず {{c1:: <ruby>英文 <rt>和文 </ruby>}} のように、clozeタグを 一番外側 ( <ruby> タグの外側) に配置すること.

- {{c1::...}} などの穴埋め記法は、翻訳後も構造を変えずに保持すること.

- cloze の適正化: {{c1::...}} などの cloze 記法が単語を跨ぐ場合、cloze を ruby の外側に配置し, 日本語と英語両方が、タグによって隠れるようにする.  (e.g. {{c54::MMR ( <ruby>Mismatch Repair <rt>ミスマッチ修復 </rt> </ruby>)}}) 

-  <ruby>, </rby>,  <rt>,  </rt> の直前 (ルビの文末) には、必ず半角スペースを入れること.(3.5  <ruby>Mismatch Repair Deficiency and MSI  <rt>ミスマッチ修復欠損とMSI  </rt>  </ruby>)

- 基本的な文法 (中学生レベル) を使用する一方で、医療・科学分野の専門用語 (例: Receptor tyrosine kinases や Tumor suppressor genes) は、不自然な言い換えをせずそのまま使用すること.

###### Edge case

[number 日本語] --> [number  <ruby>English  <rt>日本語  </ruby>] 
- [3.5 Mismatch Repair Deficiency and MSI] --> [<h2>3.5  <ruby>Mismatch Repair Deficiency and MSI  <rt>ミスマッチ修復欠損とMSI  </rt> </ruby></h2>]

[S has A (B) and C (D). ] --> [  <ruby>S has  <rt>S には以下のものがある.  </ruby>  <ruby>A  <rt>A  </ruby>(  <ruby>B  <rt>B  </ruby>) and  <ruby>C  <rt>C  </ruby>(  <ruby>D  <rt>D  </ruby>)]

[S is A that B, and S V] --> [  <ruby>S is A that B, and  <rt>S は B の A であり、  </ruby>  <ruby>S V  <rt>S が V になる.  </ruby>]

[S V and V, but when S V S V] --> [  <ruby>S V and V,  <rt>S は V して V するが、  </ruby>  <ruby>but when S V S V  <rt>しかし、S V のときは、S V である.  </ruby>]

cloze が文中にあるときは、できるだけ文末か文頭に配置する.

[Aは、6項目からなり、{{c8::B}} を5つの健康習慣に加えたものである. ] --> [{{c8:: <ruby>B  <rt>B  </ruby>}}  <ruby>, when added to the five healthy habits, becomes A.  <rt>を5つの健康習慣に加えたものが、A である.  </ruby>]

- 箇条書きの分離: 「A: B」のような構造の場合、「A:」と「B」は独立した文として扱い、それぞれ別々に <ruby>タグを適用すること.

- ルビの除外対象: フローチャート内の矢印 ( →, -->, ←, ↑, ↓, --, __, | ) や記号 (⚡, 🚫) は <ruby>タグに含めず、タグの外側にそのまま配置すること.

#### SHOULD

- 翻訳前の文章と翻訳後の文章の、語順と文構成を、できるだけ一致させる. 自然な語順の両立ができなかった場合、日本語を優先する. ( e.g. SVO (English) → 「 S が V する. O に対してである.」、 A of B → 「A が--される. これは B である. 」)

- バイリンガルにとって日本語と英語の対応をスムーズに読めるようにするため、英語と日本語の文章の、語順と文構成を、できるだけ一致させる.

- 翻訳前の文章と翻訳後の文章の、語順を、できるだけ一致させるため、 cloze はできる限り文頭に配置する. 

- 日本語でも英語でも同一の clozeや文については、英語のみでいい. 日本語は不要.

- 略語はこのように、[略語: ( <ruby>英語正式名称 <rt>日本語正式名称 </rt> </ruby>)] のフォーマットで表記する. (e.g. {{c54::MMR ( <ruby>Mismatch Repair <rt>ミスマッチ修復 </rt> </ruby>)}}) 

- 引用符 ("") や括弧 (()) などの記号は、 <ruby> タグや cloze タグの内側には含めず、タグの外側にそのまま残すこと.

- 翻訳レベルと文字数制限: 日本の中学生が理解できる基礎的な英単語と文法を使用すること.一文を極力短く分割し、複雑な構文を避けること.

#### COULD

- ルビの除外対象: 見出しの先頭の数字 (例: 4.4) は  <ruby> タグに含めず、タグの外側にそのまま配置すること.


### example

```html
<p>
   <ruby>This classification is utilized for the selection of personalized treatments. 
   <rt>この分類は個別化治療の選択に活用される. 
   </ruby>
</p>
<p>&#x26A1; 
   <ruby>The T790M mutation in the EGFR gene confers resistance to first-generation EGFR inhibitors. 
   <rt>EGFR遺伝子のT790M変異は第1世代EGFR阻害薬への耐性を生じさせる. 
   </ruby>{{c34:: 
   <ruby>Third-generation EGFR inhibitors (osimertinib) [drug]
   <rt>第3世代EGFR阻害薬 (オシメルチニブ) [薬]
   </ruby>}} 
   <ruby>are also effective against the T790M mutation. 
   <rt>はT790M変異にも有効である. 
   </ruby>
   <ruby>Vemurafenib [drug] is used for the BRAF V600E mutation. 
   <rt>ベムラフェニブ [薬] は、BRAF V600E変異に対して使用される. 
   </ruby>
</p>
<p>
  {{c8::
   <ruby>Cancer Prevention Plus 1 [guideline]
   <rt>がん予防プラス1 [ガイドライン]
   </ruby>}} 
   <ruby>is the cornerstone of Japan's cancer prevention guidelines.
   <rt>は、日本のがん予防ガイドラインの柱である. 
   </ruby>
</p>
<p>
  {{c8:: <ruby>Infection control  <rt>感染症対策 </rt> </ruby>}}
   <ruby>is added to the 5 healthy habits  <rt>は5つの健康習慣に加えられて  </rt> </ruby>
   <ruby>to form the 6 basic measures.  <rt>6項目の基本対策を形成する.   </rt> </ruby>
</p>
<p>
   <ruby>The 5 healthy habits consist of  <rt>5つの健康習慣は、以下である. </rt> </ruby>
  {{c9:: <ruby>not smoking  <rt>禁煙 </rt> </ruby>}}, 
  {{c9:: <ruby>moderate alcohol consumption  <rt>節度のある飲酒  </rt> </ruby>}}, 
  {{c9:: <ruby>a balanced diet  <rt>バランスの良い食事  </rt> </ruby>}}, 
  {{c9:: <ruby>exercise  <rt>運動 </rt> </ruby>}}, and 
  {{c9:: <ruby>maintaining a healthy weight  <rt>適正体重の維持 </rt> </ruby>}}.
</p>

<h2>3.5 
   <ruby>Mismatch Repair Deficiency and MSI 
     <rt>ミスマッチ修復欠損とMSI 
   </ruby>
</h2>
<p>
  <strong>
     <ruby>Mismatch repair (MMR) has 
       <rt>ミスマッチ修復 (MMR) にはこれらがある. 
     </ruby>
  </strong>(
  <strong>{{c58::MSH2-MSH6}}</strong>
   <ruby>heterodimer 
     <rt>ヘテロダイマー 
     </rt>
   </ruby>) 
   <ruby>and a large complex 
     <rt>とラージコンプレックス 
     </rt>
   </ruby>(
  <strong>{{c59::MLH1-PMS2}}</strong>
   <ruby>heterodimer
     <rt>ヘテロダイマー 
   </ruby>).
</p>
<p>
   <ruby>When these components are deficient, 
     <rt>これらのコンポーネントが欠損すると 
   </ruby>
  <strong>
     <ruby>Microsatellite Instability (MSI-High) [phenomenon] 
       <rt>マイクロサテライト不安定性 (MSI-High) [現象] 
     </ruby>
  </strong>
   <ruby>occurs, and mutations easily accumulate. 
     <rt>が生じ、変異が蓄積しやすくなる. 
   </ruby>
</p>
<p>
   <ruby>MSI-High is base misincorporations not corrected, 
     <rt>MSI-Highは塩基の誤組み込みが修正されず、 
   </ruby>
   <ruby>and microsatellite region 
     <rt>マイクロサテライト領域 
   </ruby>(
   <ruby>short base sequence repeat region 
     <rt>短い塩基配列の繰り返し領域 
   </ruby>) 
   <ruby>length changing phenomenon. 
     <rt>の長さが変化する現象である. 
   </ruby>
   <ruby>Normally MMR enzymes recognize misincorporations and repair them, 
     <rt>正常ではMMR酵素が誤組み込みを認識して修復するが、 
   </ruby>
   <ruby>but when MMR genes have mutations, this repair stops functioning. 
     <rt>MMR遺伝子に変異があるとこの修復が機能しなくなる. 
   </ruby>
</p>
<p>
   <ruby>MMR-deficient tumors have very large mutation amounts, 
     <rt>MMR欠損の腫瘍は変異量が非常に多く、 
   </ruby>
   <ruby>and on cancer cell surfaces, mutation-derived neoantigens 
     <rt>がん細胞表面に変異由来の新抗原 
   </ruby>(neoantigen) 
   <ruby>are abundantly presented. 
     <rt>が豊富に提示される. 
   </ruby>
   <ruby>For this reason, immune cells easily recognize cancer cells, 
     <rt>このため、免疫細胞ががん細胞を認識しやすく、 
   </ruby>
   <ruby>and immune checkpoint inhibitors' effects are easily exerted. 
     <rt>免疫チェックポイント阻害薬の効果が発揮されやすい. 
   </ruby>
</p>
<p>⚡ 
   <ruby>Because MSI-High tumors have large mutation amounts, to immune checkpoint inhibitors 
     <rt>MSI-Highの腫瘍は変異量が多いため、免疫チェックポイント阻害薬 
   </ruby>(
   <ruby>such as anti-PD-1 antibodies 
     <rt>抗PD-1抗体など 
   </ruby>) 
   <ruby>response is high. 
     <rt>に対する反応性が高い. 
   </ruby>
   <ruby>In cases with 10 or more mutations per 1 megabase, pembrolizumab becomes indicated. 
     <rt>1メガベースあたり10個以上の変異がある場合、ペムブロリズマブが適応となる. 
   </ruby>
</p>

```
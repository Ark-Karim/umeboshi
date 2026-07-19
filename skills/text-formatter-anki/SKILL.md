---
name: text-formatter-anki
description: null
---

Defines the writing style and sentence formatting used for Anki cards. When requirements conflict, prioritize in the order: MUST, SHOULD, COULD.
<!-- Ankiに用いる文体、文章フォーマットを定義する。相反する要求は、MUST、SHOULD、COULDの順に優先する。 -->

## Requirements

### MUST

- **Eliminate redundancy**: Never write introductory sentences, overviews, or preambles immediately after a section heading. Jump directly to the main content.
<!-- 冗長性の排除：セクション見出しの直後に導入文・前置きは一切禁止。即座にメインコンテンツを開始する。 -->

- **Promote relational understanding**: Always articulate relationships between concepts (causality, contrast, exceptions). Connect new content to existing knowledge ("This is the same as XX in that..."). Include concrete examples for abstract concepts.
<!-- 関係性理解の促進：概念間の因果関係・対比・例外を言語化し、既存知識との接続や具体例を含める。 -->

- **Promote essential understanding**: Lead the learner toward deep, essential understanding rather than rote memorization. Exhaustively explain the reason ("why?") and process ("how?") — the Mechanism of Action (MoA) — behind every conclusion. True knowledge comes from understanding the Chain of Causality from premises to conclusions and the dynamic processes involved. In learning, memorizing isolated facts such as disease names or symptoms is meaningless; humans forget them quickly and cannot respond to unforeseen situations. Deeply understanding "why does this symptom occur (anatomical/physiological reasons)" and "by what mechanism does the disease progress or the side effect emerge (pathophysiological process)" is true learning. Therefore, never state a conclusion abruptly — always meticulously construct the underlying "reason" and "process" first.
<!-- 本質的理解の促進：丸暗記ではなく「なぜそうなるのか」の理由と過程・MoAを徹底的に理解させる。結論をいきなり述べず、必ず背景にある理由とプロセスを緻密に組み立てる。 -->

- **Insert proper line breaks**: Separate every 2-3 sentences into paragraphs using `<p> </p>` tags to improve visual clarity.
<!-- 適切な改行：2〜3文ごとに<p>タグで段落分けし、視認性を高める。 -->

- **Insert whitespace**: Insert half-width spaces ` ` or Japanese commas `、` at semantic break points every 10-20 characters for readability.
<!-- 余白の挿入：10〜20文字おきに半角スペースや句点で意味の切れ目を作り、読みやすくする。 -->

- **Attribute notation `[]` for technical terms**: When a technical term (molecule, drug, anatomical term, disease, etc.) classified under the categories below first appears inside bold text (`**`, `<strong>`), immediately note its attribute or classification in `[]` (square brackets) after the term name, to eliminate cognitive load. Select the most appropriate attribute from the designated target list below. Never use attributes outside this list. This rule applies only within bold text.
<!-- 専門用語の属性明記ルール：太字内で初登場する専門用語の直後に[]で属性を明記。下記リストから最適なものを選択。太字内に限る。 -->

    Allowed attributes for `[]`:
    - Molecules/substances: [mol] [ion] [peptide] [prot] (protein) [enz] [rcpt] [ch] [gene] [bioact] (bioactive substance) [bmrk] (biomarker)
    - Drugs/treatments: [drug] [MoA] (mechanism of action) [RoA] (route of administration) [metabolic path] (metabolic pathway) [trnsp] (transporter) [proc] (procedure) [anesthesia] (anesthesia method) [CI] (contraindication) [SE] (side effect)
    - Anatomy/histology: [sys] [site] [struct] [tis] [cell] [epithelial class]
    - Medicine/pathology: [dz] [sx] [sign] [pathog] [vir class] [Gram] [test] [lab] [ECG] [sev class] [RF] [px] [epidemiological index]
    - Other: [class]
    <!-- []内指定対象リスト：分子・物質、医薬品・治療、解剖・組織、医学・病態、その他 -->

- **Quantitative value notation**: Compact notation using mathematical symbols and expressions inline within sentences.
<!-- 定量的数値の表記：文中に数式や記号を用いて条件をコンパクトに併記する。 -->

    output example: `酸性環境 (pH: 5.0) では、...`、`(n ≧ 60)`、`温度が上昇すると、 (Tempreture: 25℃ ──> 32℃) ...`

### NEVER

- Never write introductory sentences, summaries, or preambles immediately after a section heading.
<!-- セクション見出しの直後に導入文・概要文・前置きを一切記述しない。 -->

- Never write inline exceptions in the body text using "Normally X. However, Y is an exception..." patterns.
<!-- 本文内に「通常は〜である。しかし〇〇は例外的に〜」というインライン例外記述を禁止する。 -->

- Never use inline contrastive conjunctions such as "but" or "however" within body text.
<!-- 「しかし」「だが」などのインライン逆説接続詞を本文中に使用しない。 -->

- Never use static descriptors (e.g., "is high", "is low") alone; use expressions that convey dynamic patterns of change.
<!-- 「高値」「低値」といった静的表現のみを使用しない。 -->

- Never use generic expressions shared across similar conditions when unique disease-specific trigger words are available.
<!-- 類似疾患で共通の汎用表現を、固有トリガーワードがある場合に使用しない。 -->

- Never use attributes outside the approved `[]` list for technical terms.
<!-- リスト外の属性を専門用語の[]表記に使用しない。 -->

### SHOULD

- **Bold usage**: Apply bold (`**`, `<strong> </strong>`) not only to proper nouns (disease names, molecule names, receptor names) but also to state changes and critical conclusions about dynamics or mechanisms (e.g., **1つ1つの細胞サイズを大きくして対応**).
<!-- 太字の使用：固有名詞だけでなく、状態変化や致命的な結論・動態・機序の変化にも積極的に太字を適用する。 -->

- **Localization notation**: Normally (default), place a location-indicating Japanese phrase such as "〜において" or "〜の膜上で" at the sentence head as a subject or modifier. Use no special symbols. Exception for flowcharts: inside a flowchart, append ` [場所] ` at the end of the sentence, e.g., "初期エンドソームに変化 [細胞質内]".
<!-- Localizationの明示方法：通常時は場所を表す日本語を文頭の主語または修飾語として配置。フローチャート内では文末に[場所]形式で併記する。 -->

- **Exceptions / Caveats**: Never describe exceptions inline within body text. Always write them as a separate, standalone bullet point.
<!-- Exceptions/Caveats：本文内のインライン例外記述を禁止し、本文とは分けた独立箇条書きとして記述する。 -->

- **Strict minimum information principle**: Limit each sentence to a maximum of 2 propositions (factual relationships).
<!-- 最小情報原則の厳格化：1文に含まれる命題（事実関係）を最大2つまでに制限する。 -->

- **Maximize the generation effect**: Avoid passive state descriptions ("is ...", "〜である") and use active verbs ("inhibits", "induces", "〜を阻害する", "〜を誘発する") as the main axis of sentence construction.
<!-- 生成効果の最大化：受動的状態記述（「〜である」）を避け、能動的動詞を主軸とした構文にする。 -->

### COULD

- **Linear readability**: Eliminate meaning backtracking so the reader can build a mental model without re-reading. Keep each sentence as short as possible. Make the subject-predicate relationship clear.
<!-- 線形な読解：読み返さずに意味を構築できるよう、意味の逆走を排除。文を極限まで短くし主述を明確にする。 -->

- **Dual Coding compatibility**: Prioritize verbs that evoke spatial arrangement and positional relationships (e.g., "is located directly beneath", "penetrates"), so that the reader can easily reconstruct visual images (schemas, graphs) mentally.
<!-- Dual Coding適合性：空間配置や位置関係を想起させる動詞を優先的に選択し、読者が脳内で視覚的イメージを再構成しやすくする。 -->

- **NBME question-writing guideline mimicry**: When describing lab values or dynamics, avoid static expressions such as "high value" or "low value". Instead, use expressions that convey specific fluctuation patterns and dynamics (e.g., "excretion of X becomes saturated").
<!-- NBME問題作成ガイドラインの模倣：検査値や動態を記述する際、静的表現を避け、具体的な変動パターンや動態を想起させる表現を用いる。 -->

- **Minimize interference**: Eliminate generic expressions shared by similar conditions (e.g., "presents with abdominal pain" for both ulcerative colitis and Crohn's disease). Always include a disease-specific unique trigger word in the sentence.
<!-- Interferenceの最小化：類似疾患で共通する汎用表現を排除し、その疾患に特異的なキーワード（Unique Trigger Word）を文中に必ず含める。 -->

## Chain of Thought

1. Read the raw text to be formatted.
<!-- 整形対象の生テキストを読み込む。 -->

2. Split into sections by heading. Verify no intro sentences follow any heading — strip them if found.
<!-- 見出しでセクション分割。見出し直後に導入文があれば除去する。 -->

3. For each sentence: ensure max 2 propositions, active verb construction, and no inline contrastive conjunctions. Split or rewrite as needed.
<!-- 各文について：命題数が2以下、能動的動詞構文、インライン逆説接続詞なしを確認。必要に応じて分割・書き換え。 -->

4. On the first occurrence of each technical term in bold, append the appropriate `[attribute]` from the approved list.
<!-- 太字内の技術用語初出時に、承認済みリストから適切な[属性]を付与。 -->

5. Break text into paragraphs every 2-3 sentences, wrapping each in `<p> </p>`.
<!-- 2〜3文ごとに<p>で段落分け。 -->

6. Insert half-width spaces at semantic break points every 10-20 characters for readability.
<!-- 10〜20文字おきの意味の切れ目に半角スペースを挿入。 -->

7. Isolate any exceptions or caveats into separate `<ul><li>` blocks, detached from the main body text.
<!-- 例外・注意事項を本文から分離し、<ul><li>ブロックとして独立記載。 -->

8. Replace static descriptors (e.g., "is elevated") with dynamic expressions (e.g., "continues to rise").
<!-- 静的記述を動的表現に置換。 -->

9. Replace generic expressions shared across similar conditions with unique trigger words specific to each condition.
<!-- 類似疾患間で共通の汎用表現を、各疾患固有のトリガーワードに置換。 -->

10. Final review: verify linear readability, Dual Coding verb usage, and interference minimization.
<!-- 最終確認：線形読解性、Dual Coding適合動詞、Interference最小化を検証。 -->

## Detailed Instructions

### 1. Eliminate Redundancy
<!-- 冗長性の排除 -->

After every section heading, the main content must begin immediately. Do not insert any kind of introductory sentence, overview, or preamble. The reader already knows what the section is about from the heading itself.
<!-- セクション見出しの直後から即座にメインコンテンツを開始する。導入文、概要文、前置きは一切不可。 -->

### 2. Promote Relational and Essential Understanding
<!-- 関係性理解と本質的理解の促進 -->

For every concept pair, articulate their relationship: cause-and-effect, contrast, similarity, or exception. Where relevant, connect new content to existing knowledge using patterns like "This is the same as XX..." or "In contrast to XX...". For abstract concepts, include concrete, vivid examples.
<!-- 概念間の因果関係・対比・類似・例外を言語化する。既存知識との接続（「XXと同じで…」「XXとは対照的に…」）を含め、抽象概念には具体的な例を添える。 -->

Do not state conclusions abruptly. Every conclusion must be preceded by the underlying "why" (reason) and "how" (process). The learner must understand the Chain of Causality and the dynamic pathophysiological Mechanism of Action (MoA) — not simply memorize static facts.
<!-- 結論をいきなり述べず、「なぜ」と「どのように」を先に緻密に構築する。因果の連鎖と動的な病態生理機序（MoA）の理解が目的であり、静的暗記は無意味である。 -->

### 3. Line Breaks and Whitespace
<!-- 改行と余白 -->

Wrap every semantic unit of 2-3 sentences in a `<p> </p>` block. Insert half-width spaces ` ` at semantic break points every 10-20 characters.

example:
- <p>原発性糸球体腎炎は 腎臓そのものが病気の主役であるため、ステロイド薬や 免疫抑制薬を使って、腎臓で起きている炎症を直接抑え込む治療が 中心になる。</p>
- <p>二次性糸球体腎炎は、根本にある原疾患の制御が必須となる。例えば糖尿病性腎症であれば、腎臓だけを治療しても意味がなく 根本にある血糖値をコントロールしなければ 腎臓の機能は良くならない。</p>

### 4. Attribute Notation `[]` for Technical Terms
<!-- 専門用語の属性明記ルール -->

When a technical term first appears in bold text (`**`, `<strong>`), append its attribute in square brackets immediately after the term name. This reduces the reader's cognitive load by instantly clarifying what kind of entity the term refers to.

Allowed attributes (select only from this list):

- Molecules/substances: [mol] [ion] [peptide] [prot] (protein) [enz] [rcpt] [ch] [gene] [bioact] (bioactive substance) [bmrk] (biomarker)
- Drugs/treatments: [drug] [MoA] (mechanism of action) [RoA] (route of administration) [metabolic path] (metabolic pathway) [trnsp] (transporter) [proc] (procedure) [anesthesia] (anesthesia method) [CI] (contraindication) [SE] (side effect)
- Anatomy/histology: [sys] [site] [struct] [tis] [cell] [epithelial class]
- Medicine/pathology: [dz] [sx] [sign] [pathog] [vir class] [Gram] [test] [lab] [ECG] [sev class] [RF] [px] [epidemiological index]
- Other: [class]

This rule applies only within bold text. Never use attributes outside this list.
<!-- []内指定対象リスト（分子・物質、医薬品・治療、解剖・組織、医学・病態、その他）から最適なものを選択。太字内に限る。リスト外属性は使用禁止。 -->

### 5. Quantitative Value Notation
<!-- 定量的数値の表記 -->

Use compact mathematical notation within sentences:

output example: `酸性環境 (pH: 5.0) では、...`、`(n ≧ 60)`、`温度が上昇すると、 (Tempreture: 25℃ ──> 32℃) ...`

### 6. Bold Usage
<!-- 太字の使用 -->

Bold is applied not only to proper nouns but also to state changes and critical dynamics. Whenever a mechanism shifts or a decisive conclusion about a process is reached, bold the key phrase.

### 7. Localization
<!-- Localizationの明示方法 -->

Default rule: place location-indicating phrases at the sentence head as a subject or modifier. Use natural Japanese (e.g., "〜において", "〜の膜上で"). No special symbols.

Flowchart exception: inside flowcharts, append ` [場所] ` at the end of the sentence (e.g., "初期エンドソームに変化 [細胞質内]").

### 8. Exceptions and Caveats
<!-- Exceptions / Caveats -->

Never write exceptions inline within body text. Instead, separate them into standalone bullet points:

output example:
    <p>通常のリガンドは酸性環境（pH = 5.0）で受容体から解離する。</p>
    <ul><li>アポトランスフェリンは酸性環境（pH = 5.0）でも受容体に結合したままである。</li></ul>

### 9. Minimum Information Principle
<!-- 最小情報原則の厳格化 -->

Limit each sentence to at most 2 propositions (factual relationships). Split longer sentences.

### 10. Generation Effect
<!-- 生成効果の最大化 -->

Avoid passive state descriptions. Use active verbs as the main axis of sentence construction. Instead of "is an inhibitor of X", write "inhibits X". Instead of "is elevated", write "continues to rise".

### 11. Linear Readability
<!-- 線形な読解 -->

Eliminate all meaning backtracking. Sentences must be short enough that the reader never needs to re-read to build their mental model. Make the subject-predicate relationship explicit and direct.

### 12. Dual Coding Compatibility
<!-- Dual Coding適合性 -->

Prioritize verbs that evoke spatial imagery and positional relationships so the reader can mentally reconstruct visual schemas or graphs. Example verb choices: "is located directly beneath", "penetrates", "runs parallel to".

### 13. NBME-Style Dynamic Descriptions
<!-- NBME問題作成ガイドラインの模倣 -->

When describing lab values, exam findings, or physiological dynamics, avoid static expressions ("high", "low", "is elevated"). Use expressions that evoke specific fluctuation patterns and dynamic mechanisms (e.g., "excretion of X becomes saturated", "levels of Y progressively decline").

### 14. Interference Minimization
<!-- Interferenceの最小化 -->

For conditions that are easily confused (e.g., ulcerative colitis vs. Crohn's disease), eliminate generic overlapping expressions. Every sentence about a specific condition must contain at least one unique trigger word that distinguishes it from similar conditions.

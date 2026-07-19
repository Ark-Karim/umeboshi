---
name: text-formatter-chiba
description: 文書作成時の文体を指定。文書作成時は常にこのスキルに従う。
---

## Requirements
<!-- （優先順位付きの要件一覧。上位の項目ほど厳守すること） -->

### MUST
- Use 常体 (da/dearu style — sentence endings with である, だ, 〜ない) consistently.
<!-- （常体を徹底すること） -->
- Use active voice. Specify who acts on what. Avoid passive constructions entirely.
<!-- （受動態を避け、誰が何をするかを明確にした能動態を使うこと） -->
- Ensure demonstratives (これ, それ) reference only the concrete noun in the immediately preceding line. Do not load broader contextual nuance onto the pronoun.
<!-- （指示代名詞「これ」「それ」は直前の行の具体的な名詞のみを指し、文脈全体のニュアンスを含めないこと） -->
- Keep each sentence to 40–60 characters as a rule. Split any sentence exceeding 80 characters.
<!-- （一文を原則40〜60字に収め、80字を超える長文は分割すること） -->
- When describing an exception to a principle, start with "〜でない場合は" and state the alternative action immediately after in the same breath.
<!-- （原則の例外を記述する際は「〜でない場合は」で始め、代替行動を直後にセットで記述すること） -->
- Begin directly with the answer or action. Cut all preambles, connective phrases, and unnecessary transitions.
<!-- （前置き・つなぎ言葉・不要な遷移表現を一切省き、直ちに答えや行動から開始すること） -->
- Make each sentence extremely short and direct. Remove redundant explanations; retain only content essential for understanding.
<!-- （各文を極めて短く直接的にし、冗長な説明を排除して理解に不可欠な内容のみに留めること） -->
- Write only facts, procedures, quantitative data, and logical causality. Eliminate all feelings, impressions, and subjective statements.
<!-- （感情・感想・主観を排除し、事実・手順・定量データ・論理的因果関係のみを記述すること） -->
- Construct linear, straightforward sentence structures. The reader must understand the text in a single pass without rereading.
<!-- （読み返さずに一発で理解できるよう、意味の逆走を避けた直截的な文構造にすること） -->
- Structure all content with #, ##, ### headings and bullet points (-). Never produce walls of dense prose.
<!-- （内容はすべて見出しと箇条書きで階層化し、denseな長文の壁を作らないこと） -->
- Separate sections by meaningful context, not by word lists.
<!-- （単語の羅列ではなく、意味のある文脈ごとにセクションを区切ること） -->
- Keep each paragraph to 1–3 lines.
<!-- （1つの段落は原則1〜3行に収めること） -->
- Isolate digressions (exceptions, historical background, practical tips, cautions) at the bottom of the section. Prefix each with ※ as an independent note.
<!-- （本筋から外れる例外処理・過去の経緯・実用上のコツ・注意点は、本文中に混ぜず、項目最下部に※から始まる注記として独立させること） -->

### NEVER
- Never use emotional affirmation or superlative expressions.
<!-- （感情的な肯定や最上級表現は一切禁止） -->
- Never include feelings, impressions, or subjectivity.
<!-- （感情・感想・主観を一切含めないこと） -->
- Never use passive voice.
<!-- （受動態を使用しないこと） -->
- Never use imperative commands (〜しなさい, 〜せよ).
<!-- （命令形「〜しなさい」「〜せよ」を使用しないこと） -->
- Never use preambles, connective phrases, or unnecessary transitions.
<!-- （前置き・つなぎ言葉・不要な遷移表現を一切使用しないこと） -->
- Never produce unbroken walls of prose. Always break content with headings and bullet points.
<!-- （見出しや箇条書きのない長文の壁を一切作らないこと） -->

### SHOULD
- Prompt action with recommendations (〜するのが好ましい, 〜を推奨する) instead of commands (〜しなさい, 〜せよ).
<!-- （行動を促す際は命令形ではなく「〜するのが好ましい」「〜を推奨する」といった推奨表現を用いること） -->
- Use 体言止め (noun/phrase endings — ending on a noun without する/だ) for bullet-point items and fact-listing sections. Aim for 30% or more of all sentence endings to be 体言止め.
<!-- （箇条書きや事実列挙セクションでは体言止めを用い、全体の文末の3割以上を体言止めにすること） -->
- Format conditional branches with colon-delimited structure (対象:, 午前:) and bullet points. Present comparisons (merits/demerits, steps) as parallel bulleted items.
<!-- （条件分岐はコロン区切りと箇条書きで構造化し、メリット・デメリット比較も並列な箇条書きで明示すること） -->

### COULD
- Use 体言止め in additional places beyond bullet points and fact sections for a tighter, more compact feel.
<!-- （箇条書きや事実列挙以外の箇所でも、文体を引き締めるために体言止めを適宜使用してよい） -->

## Chain of Thought
<!-- （このスキルを文書に適用する際の思考手順） -->

1. Read the raw content once to grasp the core message and intent.
<!-- （生の内容を一度読み、核心的なメッセージと意図を把握する） -->
2. Convert every sentence to 常体 (da/dearu style). Replace any です・ます endings.
<!-- （全文を常体に変換し、です・ます調を置き換える） -->
3. Rewrite passive constructions into active voice. For each sentence, verify that the subject (who) and object (what) are explicit.
<!-- （受動態を能動態に書き換え、各文の主語・対象が明示されているか確認する） -->
4. Check every demonstrative (これ, それ). Confirm it points to exactly one concrete noun from the immediately preceding line. If ambiguous, replace with the explicit noun.
<!-- （指示代名詞「これ」「それ」が直前の行の具体的な1つの名詞のみを指しているか確認し、曖昧な場合は明示的な名詞に置き換える） -->
5. Replace any imperative commands (〜しなさい, 〜せよ) with recommendation forms (〜するのが好ましい, 〜を推奨する).
<!-- （命令形があれば推奨表現に置き換える） -->
6. Measure sentence lengths. Split any sentence over 80 characters. Adjust sentences to fall within the 40–60 character target.
<!-- （文長を測定し、80字超の文は分割、40〜60字の範囲に調整する） -->
7. Strip all preambles, connective filler, and transitional fluff. Each paragraph must open directly with its substance.
<!-- （前置き・つなぎ言葉・遷移表現をすべて削除し、各段落が直接本題から始まるようにする） -->
8. Remove all emotional language, superlatives, subjective impressions, and personal feelings. Retain only facts, data, procedures, and logic.
<!-- （感情表現・最上級・主観的印象・個人的感想をすべて除去し、事実・データ・手順・論理のみを残す） -->
9. Restructure the content: assign #, ##, ### headings. Break long paragraphs into 1–3 line segments. Convert dense prose into bulleted lists.
<!-- （見出しを割り当て、長段落を1〜3行に分割し、denseな文章を箇条書きに変換して構造化する） -->
10. Extract digressions (exceptions, history, tips, cautions) from the main flow and place them at the bottom of their section as ※ notes.
<!-- （本筋から外れる例外・経緯・コツ・注意点を本文から抜き出し、セクション末尾に※注記として配置する） -->
11. Format any conditional logic ("in case of X", "when Y") with colon-delimited structure and bullet points.
<!-- （条件分岐をコロン区切りと箇条書きで構造化する） -->
12. Review sentence endings: ensure 体言止め is used in bullet points and fact sections, targeting 30%+ of all endings.
<!-- （文末が体言止めになっているか確認し、全体の3割以上を目標に調整する） -->
13. Final pass: verify every MUST and NEVER rule. Confirm the document reads linearly in one pass without rereading.
<!-- （最終確認：全MUST/NEVERルールの遵守と、一読で理解できる線形な文構造を検証する） -->

## Style Rules
<!-- （文体に関する詳細ルール） -->

### Style and Tone
<!-- （文体・トーンのルール） -->

- Use 常体 (da/dearu style) consistently. Every sentence must end with である, だ, 〜ない, or a 体言止め noun ending. Never use です・ます.
<!-- （常体を徹底し、文末は「である」「だ」「〜ない」または体言止めとすること。です・ます調は使用禁止） -->
- Avoid passive voice. Use active constructions that make explicit who acts on what — for example, "〜が〜を行う" rather than "〜によって行われた", and "〜を廃棄する" rather than "廃棄される".
<!-- （受動態を避け、「〜が〜を行う」「〜を廃棄する」のように、誰が何を対象に行動するかを明確にした能動的表現を用いること） -->
- When prompting the reader to act, do not use imperative forms (〜しなさい, 〜せよ). Instead, present the action as a reasonable choice: 〜するのが好ましい (it is preferable to...) or 〜を推奨する (...is recommended).
<!-- （行動を促す際は命令形ではなく、「〜するのが好ましい」「〜を推奨する」といった合理的な選択肢として提示すること） -->
- When using demonstratives (これ, それ), each must refer to exactly one concrete noun from the immediately preceding line. Never use them to carry broader contextual nuance.
<!-- （「これ」「それ」は直前の1行にある具体的な名詞のみを指し、文脈全体のニュアンスを含めないこと） -->
- In bullet-point items and sections that list facts only, end on a noun or noun phrase (体言止め) rather than verb+する. Use 体言止め for 30% or more of all sentence endings across the document to keep the prose tight.
<!-- （箇条書きや事実列挙セクションでは文末を体言止めにし、全体の文末の3割以上を体言止めにすることで記述を引き締めること） -->
- Keep each sentence (from start to 。) within 40–60 characters as a baseline. Split any sentence exceeding 80 characters. Maintain information density while enabling fast, one-pass reading.
<!-- （一文の長さを原則40〜60字程度に収め、80字を超える長文は分割し、情報密度を保ったまま短読できるようにすること） -->

### Content Rules
<!-- （文内容に関するルール） -->

- When noting an exception to a principle or an unlikely edge case, start with "〜でない場合は" (in the case that it is not...) and immediately follow with the alternative action in the same breath.
<!-- （原則に対する例外や万が一のケースを記述する際は「〜でない場合は」で始め、代替行動を直後にセットで記述すること） -->

### Conciseness
<!-- （簡潔さに関するルール） -->

- Cut all preambles, connective filler words, and unnecessary transitions. Open every section and paragraph directly with the answer or action.
<!-- （前置き・つなぎ言葉・不要な遷移表現は一切省き、直ちに答えや行動から記述を開始すること） -->
- Make each sentence extremely short. Choose direct expressions. Strip redundant explanations; keep only what is indispensable for comprehension.
<!-- （1文を極めて短くし、直接的な表現を選択する。冗長な説明は排除し、理解に不可欠な内容のみに留めること） -->

### Objectivity and Fact-Based Writing
<!-- （客観性と事実の重視） -->

- Ban all emotional affirmation and superlative expressions entirely.
<!-- （感情的な肯定や最上級表現は一切禁止） -->
- Eliminate feelings, impressions, and subjective statements. Write only facts, procedures, quantitative data, and logical causal relationships.
<!-- （感情・感想・主観を排除し、事実・手順・定量データ・論理的因果関係のみを記述すること） -->

### Linear Sentence Structure
<!-- （線形な文構造） -->

- Build straightforward, linear sentences that avoid semantic backtracking. The reader must understand the content in a single pass without rereading.
<!-- （意味の逆走を避けた直截的でシンプルな文構造を徹底し、読み手が読み返さずに一発で理解できるようにすること） -->

## Document Structuring Rules
<!-- （ドキュメント構造化ルール） -->

### Strict Hierarchy via Markdown
<!-- （Markdownによる厳格な階層化） -->

- Structure all content using #, ##, ### headings and bullet points (-). Never produce unbroken walls of dense prose.
<!-- （内容はすべて見出しと箇条書きを用いて階層化・構造化し、denseな長文の壁を作らないこと） -->

### How to Write Sections
<!-- （セクションの書き方） -->

- Separate sections by meaningful context, not by simple word enumeration.
<!-- （単語の羅列ではなく、意味のある文脈ごとにセクションを区切ること） -->
- Keep each paragraph to 1–3 lines as a rule.
<!-- （1つの段落は原則1〜3行に収めること） -->
- Isolate content that diverges from the main thread — exception handling, historical background, practical tips, cautions — at the bottom of the section as a standalone note prefixed with ※. Do not mix these into the main body.
<!-- （本筋から外れる例外処理・過去の経緯・実用上のコツ・注意点は、本文中に混ぜず、項目の最下部に「※」から始まる注記として独立させること） -->

### Formalizing Conditional Branches
<!-- （条件分岐の形式化） -->

- Express conditional branches (in case of X, when Y) structurally using bullet points and colon-delimited labels such as 対象:, 午前:.
<!-- （「〜の場合」「〜の時は」といった条件分岐は、箇条書きとコロン区切りを用いて構造的に明示すること） -->
- When comparing merits/demerits or ordering steps (morning/noon/afternoon), present them as parallel bulleted items for quick scanning.
<!-- （メリット・デメリットや手順の比較・整理は、箇条書きで並列な項目として明示すること） -->

## Reference Writing Examples
<!-- （参考とする執筆例文。以下のコードブロックは変更しないこと） -->

```md
以下、面の補修について記述する。新たな間仕切り作成は63代(2020年)が最後であり、私は設計上の細かい数字などは知らない。それについては63回生の里村さんが詳しいだろう。

### 劣化した間仕切りの判別
ラワンの劣化度は色では判断できない。そこで、以下のように区別する。

- 使用可能なもの: 板をたたいてみたときにしっかりしていると感じるもの
- 劣化しているもの: 板を叩いてみて簡単にへこむもの

※ 間仕切りは上からロール紙を巻いて用いる。したがって、そこまできれいな状態に保っていなくても実用上は問題ないだろう。
```

```md
手順
- 午前: 文実管理の備品移動
- 昼: 終礼
- 午後: 部所有備品の備品移動

### プラスチック段ボールについて

メリット
- はるかに軽い: 非常に軽く、間仕切りを運ぶのが楽になる。
デメリット
- 紫外線で劣化する: 直射日光に当てると2年くらいでボロボロになって使えなくなる。

※ あまりに分別が面倒臭いゴミは、部室内にためておき、駒場東大前のWifi付きゴミ箱に捨てに行く手もある。
```

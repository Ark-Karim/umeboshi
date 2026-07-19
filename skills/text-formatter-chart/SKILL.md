---
name: text-formatter-chart
description: null
---

# Flowchart & Structured Content Formatting

Rules for creating flowcharts, tables, inline annotations, and bullet-pointed lists in educational and medical content.
<!-- （教育・医療コンテンツにおけるフローチャート、表、インライン注釈、箇条書きの書式ルール） -->

## Requirements

A consolidated quick reference of all formatting rules across this document.
<!-- （本書全体の書式ルールを集約したクイックリファレンス） -->

### MUST

- **Flowchart container**: Use `<code>` blocks. Never use `<pre>`. Double-nesting `<code>` is allowed.
<!-- （フローチャートは<code>ブロックを使用。<pre>は使用禁止。<code>の二重ネストは許可） -->
- **Flowchart line breaks**: Use `<br>` for line breaks. Since `<pre>` is prohibited, always use `<br>`.
<!-- （改行は<br>を使用。<pre>禁止のため必ず<br>で改行） -->
- **Flowchart line length**: Keep 1–2 steps per line (do not exceed tablet screen width).
<!-- （1行あたり1〜2ステップ。タブレットの横幅を超えない） -->
- **Flowchart direction**: Right-pointing arrows only (`──>`). Downward arrows are forbidden.
<!-- （矢印は右向き（──>）のみ。下向き矢印は使用不可） -->
- **Quantity vs. state**: Express absolute quantity increases/decreases with arrows (↑insulin, ↓GnRH). Express state changes in words (e.g., "ECL cell activation", not "↑ECL cells").
<!-- （絶対量の増減は矢印（↑インスリン、↓GnRH）で表現。状態変化は文字で表現） -->
- **Flowchart brevity**: One step must not exceed one sentence. Use noun-phrase endings (体言止め) to keep it short.
<!-- （1ステップは1文を超えない。体言止めで短く） -->
- **High-Yield annotation**: Prefix with 🔑. Place inline directly below the relevant explanatory text. 1–2 concise sentences. Never make it a separate chapter.
<!-- （High-Yieldは🔑を付記し、該当解説の直下にインライン配置。1〜2文。独立した章にしない） -->
- **Contraindication annotation**: Prefix with 🚫. Place inline directly below the relevant drug or condition explanation. 1–2 concise sentences. Never make it a separate chapter.
<!-- （禁忌は🚫を付記し、該当薬物・病態の解説直下にインライン配置。1〜2文。独立した章にしない） -->
- **Mnemonic annotation**: Prefix with 💡. Place at the end of the relevant section or directly below the related element, as an independent block. 1–2 concise sentences.
<!-- （語呂合わせは💡を付記し、該当セクション末尾または関連要素直下に独立ブロックとして配置。1〜2文） -->
- **Table comparison axes**: Comparison axes must be strictly identical across all columns and rows. Never include an evaluation criterion for one side that the other side lacks.
<!-- （表の対比軸は全列・全行で厳密に一致させる。片方にしかない評価基準を混ぜることを禁止） -->
- **Table cell simplicity**: No multi-topic cells with internal line breaks. Keep the vertical axis and comparison axes extremely simple (use a metadata header row for comparison items). Cells may only contain enumerable short facts or quantitative data (single words / short phrases). Explanatory reasoning goes in prose before or after the table.
<!-- （セル内に複数トピックや改行を詰め込むことを禁止。セルは列挙可能な短い事実・定量データのみ。説明的推論は表の前後に文章として配置） -->
- **Table column limit**: Maximum 3 columns. If 4 or more columns are needed, do not use a table — use nested lists instead.
<!-- （表は最大3列。4列以上になる場合は表形式を禁止し、階層化箇条書きを使用） -->
- **Table cell punctuation**: No periods (。) at the end of any cell text. Use noun-phrase endings or short phrases without sentence-ending punctuation.
<!-- （セル内の文末に句点（。）を使用禁止。体言止めまたは句点のない短句で完結） -->
- **Table/Flowchart preamble**: Before any pathway flowchart, always provide contextual preamble text so the reader can predict what follows.
<!-- （伝達経路のフローチャートを使用する場合、必ず先に文脈文章を前置きする） -->
- **Bullet point completeness**: Every list item must contain both a subject and a predicate (actor, target, and result). Sentence fragments — bare words or phrases with no clear agent or action — are completely forbidden.
<!-- （箇条書きの各項目には必ず主語と述語を含める。因果や論理の主体が消失する文の断片化を完全に禁止） -->

### NEVER

- Never use `<pre>` tags — always use `<code>`.
<!-- （<pre>タグの使用禁止） -->
- Never use downward arrows for flowchart direction.
<!-- （下向き矢印の使用禁止） -->
- Never use periods (。) at the end of table cells.
<!-- （表セル内の句点使用禁止） -->
- Never use a table when 4 or more columns are required — use nested lists.
<!-- （4列以上で表の使用禁止） -->
- Never create sentence fragments in bullet points — every item must have subject + predicate.
<!-- （箇条書きの文断片化禁止） -->
- Never place High-Yield notes or Contraindications as separate chapters/sections — always inline.
<!-- （High-Yield・禁忌を独立した章にしない） -->
- Never stuff multiple independent topics or multi-line reasoning into a single table cell.
<!-- （1セルに複数トピックや複数行の推論を詰め込むことを禁止） -->

### SHOULD

- **Abbreviations**: Use "or", "etc.", "e.g.", "!" freely within flowcharts for concise, note-like style.
<!-- （or, etc., e.g., ! などを使用してノートらしく簡潔に表現） -->
- **Table vs. Flowchart selection**: Apply the selection criteria detailed below — count comparison subjects and causal arrow steps to choose the right format.
<!-- （表とフローチャートの選定基準に従う） -->
- **Dose-dependent switching**: When dose-dependent receptor/effect switching involves ≥3 causal arrow steps (complex branching dynamics), prioritize conditional-branch nested flow over a comparison table.
<!-- （用量依存の切り替えで因果矢印が3ステップ以上なら、条件分岐ネストフローを優先） -->
- **Multi-row comparisons**: When ≥3 comparison rows exist (e.g., low / medium / high dose), prioritize comprehensive comparison via table format.
<!-- （比較行が3行以上存在する場合は表形式で整理） -->
- **Clinical correlations**: Express mechanism-to-disease/symptom transitions as flowcharts (`──>`).
<!-- （臨床的意義は病態メカニズム→臨床疾患・症状への移行をフローチャートで表現） -->
- **Binary oppositions**: Prefer table format for clearly contrasted concept pairs (e.g., forward genetics vs. reverse genetics).
<!-- （定義や方向性が明確に対比される二概念は表形式をprefer） -->
- **Hierarchical components**: Use nested lists for describing hierarchical/composite component elements (primary–quaternary structure, chaperone complex subunits).
<!-- （一次〜四次構造や複合体構成因子の記述には階層化箇条書きを使用） -->

### COULD

- **Cyclic/loop dynamics**: Express round-trip or looping dynamics using cyclic step flow: `A ──> B ──> A`.
<!-- （往復・ループ動態は循環型ステップフロー（A──>B──>A）で完結） -->
- **Nested flowcharts**: Indent flowcharts to create hierarchy as needed.
<!-- （フローチャートをインデントで階層化してもよい） -->
- **Direction labels**: Append functional labels in parentheses at the end of flow lines (e.g., `逆行`, `回収`, `リサイクリング`).
<!-- （フロー末尾に動態の機能的意味を示すラベルを（）で付記） -->
- **Drug interaction flows**: Show each drug's mechanism in parallel bullet points within the flowchart, concluding with ∴ (therefore).
<!-- （併用効果は各薬物の作用機序をフローチャート内で並列箇条書きで示し、最後に∴で結論） -->

## Chain of Thought

Follow these sequential steps when deciding how to format any piece of content.
<!-- （コンテンツのフォーマットを決定する際の逐次手順） -->

1. **Identify the content type.**
<!-- （コンテンツの種類を特定する） -->
   - **Causal/sequential flow** (A causes B causes C, or a pathway) → go to Step 2.
<!-- （因果・逐次フロー → ステップ2へ） -->
   - **Comparison/contrast** (multiple items, diseases, drugs compared against each other) → go to Step 3.
<!-- （比較・対照 → ステップ3へ） -->
   - **Enumeration/listing** (facts, properties, components) → go to Step 4.
<!-- （列挙 → ステップ4へ） -->

2. **For causal flows — use a flowchart.**
<!-- （因果フローの場合 — フローチャートを使用） -->
   a. Wrap everything in `<code>` blocks. Never use `<pre>`.
<!-- （<code>ブロックで囲む。<pre>は使わない） -->
   b. Use `<br>` for line breaks (since `<pre>` is prohibited).
<!-- （<br>で改行） -->
   c. Keep 1–2 steps per line; keep each step to one sentence or fewer with noun-phrase endings.
<!-- （1行1〜2ステップ、1ステップ1文以内、体言止め） -->
   d. Use right-pointing arrows only (`──>`).
<!-- （右向き矢印のみ使用） -->
   e. Express quantity changes with ↑/↓; state changes in words.
<!-- （量的変化は↑/↓、状態変化は文字） -->
   f. For branching logic, nest `<code>` blocks with `<ol>` or `<ul>`.
<!-- （分岐ロジックは<ol>/<ul>でネスト） -->
   g. If describing a loop/cycle, use the `A ──> B ──> A` format.
<!-- （ループ/循環はA──>B──>A形式） -->
   h. Optionally append direction labels in parentheses at line ends.
<!-- （必要に応じて行末に方向ラベルを括弧書き） -->

3. **For comparisons — choose table or flowchart.**
<!-- （比較の場合 — 表かフローチャートかを選択） -->
   a. Count the number of comparison subjects (e.g., diseases, drugs).
<!-- （比較対象の数を数える） -->
   b. Count the number of causal arrow steps between each item.
<!-- （因果矢印のステップ数を数える） -->
   c. Apply the selection criteria:
<!-- （選択基準を適用） -->
      - 3+ subjects AND ≤2 arrow steps → **Table**.
<!-- （対象3個以上 かつ 矢印2ステップ以内 → 表） -->
      - 3+ subjects AND ≥3 arrow steps → Compare counts: more subjects → **Table**; more steps → **Flowchart**.
<!-- （対象3個以上 かつ 矢印3ステップ以上 → 数が多い方を優先） -->
      - ≤2 subjects AND ≥2 arrow steps → **Flowchart**.
<!-- （対象2個以内 かつ 矢印2ステップ以上 → フローチャート） -->
      - ≤2 subjects AND 1 arrow step → **Table**.
<!-- （対象2個以内 かつ 矢印1ステップ → 表） -->
   d. If choosing a table: max 3 columns, identical comparison axes, no periods in cells, no multi-topic cells, prepend preamble text.
<!-- （表を選んだ場合：3列以内、対比軸一致、句点なし、複数トピック禁止、前置き文章必須） -->
   e. If choosing a flowchart: apply the flowchart rules from Step 2.
<!-- （フローチャートを選んだ場合：ステップ2のルールを適用） -->

4. **For enumerations — use bullet points.**
<!-- （列挙の場合 — 箇条書きを使用） -->
   a. Every list item must have a subject and predicate.
<!-- （各項目に主語と述語を含める） -->
   b. No sentence fragments.
<!-- （文の断片化禁止） -->
   c. Use nested lists for hierarchical component descriptions.
<!-- （階層的要素はネストした箇条書きで） -->

5. **After writing primary content**, add inline annotations where relevant:
<!-- （主要コンテンツ作成後、インライン注釈を追加） -->
   a. High-Yield notes (🔑) directly below explanatory text — 1–2 sentences.
<!-- （🔑 High-Yield：解説直下に1〜2文） -->
   b. Contraindications (🚫) directly below drug/condition explanations — 1–2 sentences.
<!-- （🚫 禁忌：薬物・病態解説直下に1〜2文） -->
   c. Mnemonics (💡) at section ends or below related elements — 1–2 sentences.
<!-- （💡 語呂合わせ：セクション末尾または関連要素直下に1〜2文） -->

---

## Flowchart Rules

Detailed rules and examples for creating flowcharts.
<!-- （フローチャート作成の詳細ルールと例） -->

### MUST
<!-- （必須ルール） -->

- Keep 1–2 steps per line (do not exceed tablet screen width).
<!-- （1行あたり1〜2ステップ。タブレットの横幅を超えない） -->
- Express only absolute quantity increases/decreases with arrows — e.g., `↑insulin`, `↓GnRH`. Express state changes in words. (Bad: ↑ECL cells, Good: ECL cell activation.)
<!-- （絶対量の増減のみ矢印で表現。状態変化は文字で書く） -->
- Wrap in `<code>` blocks. `<pre>` is prohibited.
<!-- （<code>ブロックに入れる。<pre>は使用禁止） -->
- Double-nesting `<code>` is allowed.
<!-- （<code>の二重使用は許可） -->
- Use `<br>` for line breaks. Since `<pre>` is prohibited, always use `<br>` for line breaks.
<!-- （<br>で改行。<pre>禁止のため必ず<br>を使用） -->

### SHOULD
<!-- （推奨ルール） -->

- One flowchart step must not exceed one sentence. Use noun-phrase endings (体言止め) to keep it short.
<!-- （1ステップの長さは1文を超えない。体言止めで短くする） -->
- Flowchart arrows must be right-pointing (`──>`). **Downward arrows are forbidden.**
<!-- （矢印は右向き（──>）。下向き矢印は使用不可） -->
- Use abbreviations like `or`, `etc.`, `e.g.`, `!` for concise, note-like expression.
<!-- （or, etc., e.g., ! などを使ってノートらしく簡潔に表現） -->

### Examples
<!-- （例） -->

```html
<code>
  <ol>
    <li>
      <strong>有害な刺激（虚血・低酸素・感染など）が発生</strong>
    </li>
    <li>
      <strong>──&gt; 適応</strong>
      <code>
        <ul>
          <li><strong>需要低下や栄養不足</strong> ──&gt; 細胞縮小（単純萎縮） or 減少（数的萎縮）『不況で会社の規模を縮小し、社員を減らすリストラ』</li>
          <li><strong>需要増大</strong> ──&gt; 細胞拡大（肥大） or 増加（過形成）『好景気で社員を鍛え上げたり、新規採用して対応』</li>
          <li><strong>慢性ストレス</strong> ──&gt; 別の頑丈な細胞種に置換（化生）『木造の家をコンクリートの家に建て替えて激しい台風に備える』</li>
        </ul>
      </code>
    </li>
    <li>
      <strong>──&gt; 可逆的障害（変性：Degeneration）</strong>
      <code>限界を超える ──&gt; 細胞ポンプの機能低下 <br>
        ──&gt; ↑水（<strong>水腫変性</strong>）、↑脂肪（<strong>脂肪変性</strong>）<br>
        原因を取り除けば戻る可能性あり『水漏れやゴミ屋敷になっても、大掃除すればまだ元に戻せる』</code>
    </li>
    <li>
      <strong>──&gt; 不可逆的障害（細胞死：Cell Death）</strong>
      <code>
        <ul>
          <li>ミトコンドリアの修復不能なダメージ『建物の大黒柱が折れる』</li>
          <li>重度な <strong>ERストレス（小胞体ストレス）</strong> 『工場での不良品タンパク質の山積み』</li>
        </ul>
      </code>
    </li>
    <li>
      <strong>──&gt; 細胞死</strong>
      <code>
        <ul>
          <li><strong>ネクローシス</strong>：ATP枯渇による破裂。内容物が漏れ、周囲に炎症を伴う。</li>
          <li><strong>アポトーシス</strong>：カスパーゼを介した秩序ある解体。炎症を伴わない。</li>
          <li><strong>その他の制御性細胞死 (RCD)</strong>：ネクロプトーシス、パイロトーシス、フェロトーシスなど、特定の状況下で発動する多様な死のプログラム。</li>
        </ul>
      </code>
    </li>
  </ol>
</code>
```

```html
<code>
ストレス環境（栄養飢餓・品質管理） ──&gt; ↑オートファジー<br>
──&gt; 自己成分を包み込んでリソソームで分解 ──&gt; 自食作用が過剰に進行<br>
──&gt; 細胞を維持できない ──&gt; オートファジー細胞死『生き延びるために家財道具を燃やし尽くし、家ごと崩壊する』
</code>
```

---

## Inline Insertion

Rules for placing High-Yield notes, contraindications, and mnemonics inline within explanatory text.
<!-- （High-Yield、禁忌、語呂合わせを解説文章中にインライン配置するルール） -->

### High-Yield Notation
<!-- （High-Yieldの記述） -->

- Do not collect High-Yield notes into a separate chapter. Place them inline, directly below the relevant explanatory text.
<!-- （独立した章にまとめず、該当する解説文章のインライン直下に配置） -->
- Prefix with `🔑` (`&#x1F511;`). Write 1–2 extremely concise sentences.
<!-- （先頭に🔑（&#x1F511;）を付記し、1〜2文の極めて簡潔な短文で記述） -->

*Output example:*
<!-- （出力例） -->
`&#x1F511;COPⅡは小胞体からゴルジ体への順行性輸送を担う。COPⅠはゴルジ体から小胞体への逆行性輸送を担う。`

### Contraindications & Rationale
<!-- （禁忌とその理由の記述） -->

- Do not collect into a separate chapter. Place inline directly below the relevant drug or condition explanation.
<!-- （独立した章にまとめず、該当する薬物や病態の解説直下にインラインで配置） -->
- Always prefix with `🚫` (`&#x1F6AB;`). Write 1–2 extremely concise sentences.
<!-- （先頭に🚫（&#x1F6AB;）を必ず付記し、1〜2文の極めて簡潔な短文で記述） -->

*Output example:*
<!-- （出力例） -->
``&#x1F6AB;緑内障患者には禁忌である。`瞳孔散大筋刺激（散瞳） ──> 隅角狭窄 ──> 房水排出障害 ──> 眼圧急上昇`を引き起こすため ``

### Mnemonic Placement
<!-- （語呂合わせ（Mnemonic）の配置） -->

- **Format**: Actively include mnemonics. Place them as an independent block at the very end of the relevant section, or directly below the related element.
<!-- （表記形式：Mnemonicは積極的に提示。該当セクションの最末尾、または関連要素の直下に独立ブロックとして配置） -->
- Always prefix with `💡` (`&#x1F4A1;`). Write 1–2 extremely concise sentences.
<!-- （先頭に💡（&#x1F4A1;）を必ず付記し、1〜2文の極めて簡潔な短文で記述） -->

*Output example:*
<!-- （出力例） -->
`&#x1F4A1;「しめじ」で覚える。`

---

## Table vs. Flowchart Selection & Notation

Criteria for choosing between table and flowchart formats, and detailed notation rules for each.
<!-- （表とフローチャートの選択基準、および各記法の詳細ルール） -->

### MUST
<!-- （必須ルール） -->

**Comparison axes must be strictly identical.** Every evaluation item (comparison axis) across columns and rows must match precisely. Never mix an evaluation criterion that exists for one side but not the other.
<!-- （表内の各列・各行における評価項目は厳密に一致させる。片方にしかない評価基準を混ぜることを禁止） -->

**No multi-topic cells (metadata header type).** Never cram multiple independent topics or multi-line reasoning into a single cell. Keep the vertical axis and comparison axes extremely simple by embedding comparison items in the top header row. Cells may only contain enumerable short facts or quantitative data (single words / short phrases). Place explanatory reasoning entirely in prose before or after the table.
<!-- （1セル内に複数トピックや改行を伴う推論を詰め込むことを禁止。最上部ヘッダー行に対比項目を埋め込み、縦軸・対比軸をシンプルに保つ。説明的推論は表の前後に文章として完全に切り離す） -->

**Maximum column count.** When using table format, the maximum number of columns is **3**. If 4 or more columns are required (too many evaluation axes or attributes), do not use a table — use nested lists instead.
<!-- （表形式は最大3列まで。4列以上になる場合は表形式を禁止し、階層化箇条書きを使用） -->

**No periods in cells.** Periods (。) at the end of text in any table cell are completely forbidden. Use noun-phrase endings or short phrases without sentence-ending punctuation.
<!-- （表内の各セル文末での句点（。）使用を完全に禁止。体言止め、または句点のない短句で完結） -->

**Mandatory preamble.** When using a pathway flowchart, always provide contextual preamble text first so the reader can predict what follows.
<!-- （伝達経路のフローチャートを使用する場合、読み手の予測性のため文脈文章を必ず先に明記） -->

Example:
<!-- （例） -->

```md
## 金属依存性の細胞死
特定の金属元素が 細胞内に過剰に蓄積することで引き起こされる 細胞死がある: 

| 細胞死の名称 | 依存金属元素 | メカニズム・関連疾患 |
|---|---|---|
| **フェロトーシス (Ferroptosis)** | 鉄 (Fe) | 過剰な鉄が **脂質の過酸化** を引き起こして発生。『鉄のサビが広がるように細胞の壁がボロボロに酸化される現象』。ヘモクロマトーシス（鉄過剰症）や非アルコール性脂肪肝炎（NASH）、癌 の新たな治療標的として注目。 |
| **キュプロトーシス (Cuproptosis)** | 銅 (Cu) | 銅が過剰に蓄積することで誘導。先天的に銅が蓄積するウィルソン病などの病態に関与。 |
```

### SHOULD
<!-- （推奨ルール） -->

**Criteria for choosing flowchart vs. table.**
<!-- （フローチャートにするか表にするかの選定基準） -->

- 3 or more comparison subjects (e.g., diseases), and 2 or fewer causal arrow steps → choose **Table**.
<!-- （比較対象が3個以上、因果矢印が2ステップ以内 → 表を選択） -->
- 3 or more comparison subjects, and 3 or more causal arrow steps → compare the number of subjects and the number of steps. If there are more subjects, choose **Table**. If there are more arrow steps, choose **Flowchart**.
<!-- （比較対象が3個以上、因果矢印が3ステップ以上 → 対象の数と矢印のステップ数を比較し、対象が多ければ表、矢印が多ければフローチャート） -->
- 2 or fewer comparison subjects, and 2 or more causal arrow steps → choose **Flowchart**.
<!-- （比較対象が2個以内、因果矢印が2ステップ以上 → フローチャートを選択） -->
- 2 or fewer comparison subjects, and 1 causal arrow step → choose **Table**.
<!-- （比較対象が2個以内、因果矢印が1ステップ → 表を選択） -->

**Flowchart-priority criterion.** When dose-dependent receptor/effect switching involves 3 or more causal arrow steps (complex branching dynamics), prioritize the "conditional branch nested flow" over comparison.
<!-- （用量変化に伴う作動受容体や効果の切り替えで、因果矢印が3ステップ以上ある場合は「条件分岐ネストフロー」を重視） -->

Example:
<!-- （例） -->
```html
<code>
 ドパミン（医薬品）投与<br>
 ├─ [低用量] ──> 腎・腸間膜のD1受容体（タンパク質）刺激 ──> 血管拡張（腎血流保護）<br>
 └─ [高用量] ──> α1・β1受容体（タンパク質）刺激 ──> 血管収縮・心機能亢進（血圧上昇）
 </code>
```

**Table-priority criterion.** When 3 or more comparison rows exist (e.g., low / medium / high dose), prioritize comprehensive comparison via table format.
<!-- （変化の段階の対比行が3個以上存在する場合は表形式で整理） -->

**Clinical Correlation as flowchart.** Express transitions from pathophysiological mechanisms to clinical diseases/symptoms as mechanism flowcharts (`──>`).
<!-- （病態メカニズムから臨床疾患・症状への移行はフローチャートとして表現） -->

*Output example:*
<!-- （出力例） -->
```html
<code>
交感神経亢進 ──> β1受容体過剰刺激<br>
──> 心筋酸素消費量↑ ──> 心不全悪化（予後不良）
</code>
```

**Binary oppositions → prefer table.** For two concepts with clearly contrasted definitions or directions (e.g., forward genetics vs. reverse genetics), prefer table format.
<!-- （定義や方向性が明確に対比される二概念は表形式をprefer） -->

### COULD
<!-- （任意ルール） -->

**Round-trip or looping dynamics** must always be expressed as a cyclic step flow: `A ──> B ──> A`.
<!-- （物質が往復またはループする動態は、必ず循環型ステップフロー（A──>B──>A）で完結） -->

**Nested flowcharts.** Flowcharts may be indented to create hierarchy (nesting) as needed.
<!-- （フローチャートをインデントで階層化して表記してもよい） -->

**Direction labels.** Optionally append functional labels in parentheses at the end of flow lines (e.g., `逆行`, `回収`, `リサイクリング`) to indicate the dynamic's functional meaning.
<!-- （フロー文末に動態の機能的意味を示すラベルを（）で適宜併記） -->

Example: `LDL受容体が粒子を取り込む [細胞膜] ──> 酸性環境で粒子を解離 [エンドソーム] ──> 受容体が再輸送され次の粒子を待つ (リサイクリング) [細胞膜]`
<!-- （例） -->

**Drug interactions (synergistic effects / action reversal).** Show each drug's mechanism of action (accelerator and brake, etc.) in parallel bullet points within the flowchart, and derive the conclusion with ∴ (therefore).
<!-- （併用効果は各薬物の作用機序をフローチャート内で並列箇条書きで示し、最後に結論（∴）を導き出す） -->

Example:
<!-- （例） -->
```md
**β2作動薬（医薬品）**: アデニル酸シクラーゼ（酵素）を活性化し、cAMP（セカンドメッセンジャー）の「産生」を増やす。
**テオフィリン（医薬品）**: ホスホジエステラーゼ（酵素）を阻害し、cAMP（セカンドメッセンジャー）の「分解」を防ぐ。
∴ 両者の併用により細胞内cAMP（セカンドメッセンジャー）濃度が相乗的に高まり、気管支が強力に拡張する。
```

---

## Bullet Points (Lists)

Rules for creating bullet-pointed lists with high information density.
<!-- （情報密度の高い箇条書きを作成するルール） -->

### MUST
<!-- （必須ルール） -->

**Subject-predicate completeness in lists.**
<!-- （箇条書きにおける主述の完全性） -->
Even in short bullet points designed for maximum information density, every sentence must include a subject and a predicate (the actor, the target of the action, and the result). Sentence fragments — bare words or phrases where the causal relationship or logical agent disappears — are completely forbidden.
<!-- （情報密度を極限まで高める短文箇条書きであっても、各文には必ず主語と述語を含める。因果関係や論理主体が消失する単語・フレーズのみの文の断片化を完全に禁止） -->

Example:
<!-- （例） -->
```md
## オートファジー細胞死
**オートファジー (Autophagy)** は、通常は細胞を「生かす」ための仕組みである。
1. 栄養飢餓への対応: 自分自身のタンパク質を分解し、アミノ酸（エネルギー源）を作り出す。『飢えを凌ぐための非常食』。生後直後の 母乳を飲むまでの間、生存に必須の働きをする。
2. 品質管理: 古くなった ミトコンドリアや 細胞内に侵入した細菌を分解・除去する。この特異的な分解を ミトファジーと呼ぶ。
```

### SHOULD
<!-- （推奨ルール） -->

**Hierarchical representation of higher-order structures and components.**
<!-- （高次構造やコンポーネントの階層表現） -->
When describing hierarchical or composite component elements — such as primary through quaternary structure, or chaperone complex subunits (e.g., GroEL/GroES) — use **nested lists**.
<!-- （一次〜四次構造やシャペロン複合体の構成因子のような階層的・複合的コンポーネント要素を記述する際は、階層化された箇条書き（Nested List）を使用） -->

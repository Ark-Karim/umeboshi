---
name: anki-card-formatter-eng
description: null
---

# Task

添付のHTMLファイル（`{{cX::}}` を含むAnki cloze形式）に対し、ユーザーが指定した Level (Lv.0〜Lv.10の整数) に基づいて、英語 + 日本語ルビ（`<ruby>`タグ）を追加する。HTMLの <ruby>タグを用いて英文 (ベース) と和文 (ルビ) を併記. input file を上書きしてはならない. 

## Principle in this scope

- cloze内部 は 独自の規則 をそのまま継続適用する。**Levelの影響を受けない**。cloze内は常に英日併記 ＝「どちらの言語で想起させるか」は別の問題であり、本スキルの対象外。
- **Levelは cloze外の地の文にのみ 適用** し、「どの文法単位まで英語+ルビ化するか」を決める。
- input fileを上書きしてはならない。出力は別ファイルに保存する。
- sub agentを使ってはいけない。人力で処理する。

# 入力パラメータ
 
| パラメータ | 必須 | 説明 |
|---|---|---|
| 対象ファイルパス | 必須 | 変換対象のHTMLファイル. 省略時は 必ず user に確認する.  |
| Level | 必須 | `Lv.0`〜`Lv.10` の整数。ユーザーが明示指定する。指定がなければ処理を開始せず質問する. |
| 出力先パス | 必須 | 省略時は 必ず user に確認する.  |



# CoT
 
### Step 1. ファイルの存在確認とパラメータ確認

- 対象ファイルの存在確認
- Level指定の確認（未指定なら処理を開始せず質問する）

### step 1. ファイルの存在確認

### Step 2. 要件確認

- `/html-formatter`（`skills/html-formatter/SKILL.md`）を読み込む
- 本ファイルの Quality criteria（下記）を把握する. cloze 内と cloze 外の基準の違いに留意する. 

### Step 3. Type分類とLevel判定（本スキルの中核）
 
cloze外の各分割単位を、下記「Type分類基準」の 判定フローチャート に従って上から順に判定し、最初に一致した Type を採用する。判定は語彙・統語構造のみによる機械的基準で行い、 Type Z を除いて「重要度」のような主観判断は行わない。

指定 Level以下（累積）の Typeに該当する単位のみ 英語 + ルビ化する。指定 Levelを超える Typeおよび Type Zは 日本語のまま残す。
 
### Step 4. 英訳とルビ生成

- Type A〜G（Lv.1〜7 相当）：中学生レベルの平易な英語文法・語彙を用いる。ただし専門用語（Type A, B, C, D自体）はそのまま使用し、言い換えない
- Type H〜J（Lv.8〜10 相当）：意図的に平易化しない。USMLE本番相当のネイティブ表現・談話標識・慣用コロケーションを用いる（これは学習者の到達目標がUSMLE本番の英語であるため）
- 同一Type・同一概念が同一セクション内で既出の場合、2回目以降はルビを省略し英語のみでよい（ cloze パターン2に準拠）

### Step 5. HTML構造の再構築とフォーマット適用

- `/html-formatter` に準拠する
- `<ruby>`, `</ruby>`, `<rt>`, `</rt>` の直前には必ず半角スペースを入れる
- 矢印（→, -->, ←, ↑, ↓, --, __, |）、記号（⚡, 🚫, "", ()）、見出し先頭数字（4.4など）は `<ruby>` タグの外側に配置する
- Type F, G, I（英語文として併記するもの）は `<ruby>` ではなく、英語文の直後に日本語訳を括弧または別行で併記する（文全体をルビ化しない。可読性を優先するため）

### Step 6. Save

- 指定された出力先パス（省略時はデフォルト規則）に保存する
- input fileは絶対に上書きしない

### Step 7. Final report

下記「Final report format」に従いレポートを出力する
 

---
 
# Type分類基準（Few-shot付き、機械的判定用）
 
## 判定フローチャート
 
対象スパンについて、上から順に判定し、最初に一致したTypeを採用する：
 
```
Q1. 単一語（複合語含む）で、日本の医学部教育1〜2年次までに習う基礎語彙、
    または一般英英辞典にも掲載される医学語彙か？
    → Yes: Type A
 
Q2. 単一語または複合語で、医学専門辞典・専門教科書で初出する固有名詞か？
    （一般英英辞典に載らない、または医学的に特化した意味を持つ）
    → Yes: Type B
 
Q3. 動詞+目的語構造を名詞化した2〜3語の複合名詞句で、修飾語が1つ以下か？
    → Yes: Type C
 
Q4. 動詞+目的語構造を名詞化した4語以上の複合名詞句、
    または2つ以上の修飾語（形容詞・前置詞句）を伴う機序表現か？
    → Yes: Type D
 
Q5. 2つ以上の対象を比較・関連づける名詞/形容詞句か？
    （X vs Y, X-induced Y, X-dependent, first-line vs second-line等）
    → Yes: Type E
 
Q6. 主語+動詞+目的語からなる独立した1文で、
    「Xとは何か/どう働くか」に答える文か？
    → Yes: Type F
 
Q7. 独立した1文で、因果・条件の接続表現（because/therefore/if/should/must相当）
    を含み、「なぜ/いつそうするか」を説明する文か？
    → Yes: Type G
 
Q8. 文と文をつなぐ談話標識（however/therefore/in addition/furthermore相当）か？
    → Yes: Type H
 
Q9. 複数文からなる、患者の病歴・現症・検査所見を記述する症例文
    （USMLE stem調）か？
    → Yes: Type I
 
Q10. 直訳では意味が通らない、医学英語特有の定型コロケーションか？
    （rule out, significant for, was notable for相当）
    → Yes: Type J
 
どれにも該当しない（数値・単位・助詞・一般語彙）→ Type Z
（Type Zは常に日本語。Lv.10でのみ英語化を検討する）
```


## Type一覧と Few-shot
 
### Type A：基礎医学語彙
**定義**：単一語（複合語含む）。日本の医学部教育1〜2年次までに習う基礎語彙、または一般英英辞典にも掲載される医学語彙。
**挿入方法**：`<ruby>English<rt>日本語</rt></ruby>`
 
| 日本語 | 変換後 |
|---|---|
| 感染 | `<ruby>infection<rt>感染</rt></ruby>` |
| 動脈 | `<ruby>artery<rt>動脈</rt></ruby>` |
| 腎臓 | `<ruby>kidney<rt>腎臓</rt></ruby>` |
| 腫瘍 | `<ruby>tumor<rt>腫瘍</rt></ruby>` |
| ワクチン | `<ruby>vaccine<rt>ワクチン</rt></ruby>` |
| 抗体 | `<ruby>antibody<rt>抗体</rt></ruby>` |
| ウイルス | `<ruby>virus<rt>ウイルス</rt></ruby>` |
 
### Type B：高度専門固有名詞
**定義**：単一語または複合語で、医学専門辞典・専門教科書で初出する固有名詞。一般英英辞典に載らない、または医学的に特化した意味を持つ。
**挿入方法**：`<ruby>English<rt>日本語</rt></ruby>`
 
| 日本語 | 変換後 |
|---|---|
| HMG-CoA還元酵素 | `<ruby>HMG-CoA reductase<rt>HMG-CoA還元酵素</rt></ruby>` |
| 横紋筋融解症 | `<ruby>rhabdomyolysis<rt>横紋筋融解症</rt></ruby>` |
| 褐色細胞腫 | `<ruby>pheochromocytoma<rt>褐色細胞腫</rt></ruby>` |
| クスマウル呼吸 | `<ruby>Kussmaul breathing<rt>クスマウル呼吸</rt></ruby>` |
| 血栓性血小板減少性紫斑病 | `<ruby>thrombotic thrombocytopenic purpura<rt>血栓性血小板減少性紫斑病</rt></ruby>` |
| シャルコー・マリー・トゥース病 | `<ruby>Charcot-Marie-Tooth disease<rt>シャルコー・マリー・トゥース病</rt></ruby>` |
 
### Type C：短い機序句（2〜3語）
**定義**：動詞+目的語構造を名詞化した2〜3語の複合名詞句。修飾語0〜1個。
**挿入方法**：`<ruby>English phrase<rt>日本語</rt></ruby>`
 
| 日本語 | 変換後 |
|---|---|
| 受容体遮断 | `<ruby>receptor blockade<rt>受容体遮断</rt></ruby>` |
| チャネル阻害 | `<ruby>channel inhibition<rt>チャネル阻害</rt></ruby>` |
| 酵素活性化 | `<ruby>enzyme activation<rt>酵素活性化</rt></ruby>` |
| 血小板凝集 | `<ruby>platelet aggregation<rt>血小板凝集</rt></ruby>` |
| 受容体ダウンレギュレーション | `<ruby>receptor downregulation<rt>受容体ダウンレギュレーション</rt></ruby>` |
 
### Type D：複合機序句（4語以上）
**定義**：動詞+目的語構造を名詞化した4語以上の複合名詞句、または修飾語2つ以上を伴う機序表現。
**挿入方法**：`<ruby>English phrase<rt>日本語</rt></ruby>`
 
| 日本語 | 変換後 |
|---|---|
| 肝臓のHMG-CoA還元酵素阻害 | `<ruby>hepatic HMG-CoA reductase inhibition<rt>肝臓のHMG-CoA還元酵素阻害</rt></ruby>` |
| 電位依存性カルシウムチャネル遮断 | `<ruby>voltage-gated calcium channel blockade<rt>電位依存性カルシウムチャネル遮断</rt></ruby>` |
| 用量依存性QT延長 | `<ruby>dose-dependent QT interval prolongation<rt>用量依存性QT延長</rt></ruby>` |
| 慢性高インスリン血症によるインスリン受容体ダウンレギュレーション | `<ruby>insulin receptor downregulation via chronic hyperinsulinemia<rt>慢性高インスリン血症によるインスリン受容体ダウンレギュレーション</rt></ruby>` |
 
### Type E：比較・関係句
**定義**：2つ以上の対象を比較・関連づける名詞/形容詞句。
**挿入方法**：`<ruby>English phrase<rt>日本語</rt></ruby>`
 
| 日本語 | 変換後 |
|---|---|
| 用量依存性の | `<ruby>dose-dependent<rt>用量依存性の</rt></ruby>` |
| SU剤誘発性低血糖 | `<ruby>SU-induced hypoglycemia<rt>SU剤誘発性低血糖</rt></ruby>` |
| 第一選択薬 vs 第二選択薬 | `<ruby>first-line<rt>第一選択薬</rt></ruby> vs <ruby>second-line therapy<rt>第二選択薬</rt></ruby>` |
| 腎性 vs 肝性クリアランス | `<ruby>renal<rt>腎性</rt></ruby> vs <ruby>hepatic clearance<rt>肝性クリアランス</rt></ruby>` |
| X連鎖劣性 | `<ruby>X-linked recessive<rt>X連鎖劣性</rt></ruby>` |
 
### Type F：定義・機序文
**定義**：主語+動詞+目的語からなる独立した1文で、「Xとは何か/どう働くか」に答える文。
**挿入方法**：`<ruby>` ではなく、英語文＋直後に日本語訳を括弧か別行で併記（文全体のルビ化はしない）
 
- 「スタチンは肝臓のHMG-CoA還元酵素を阻害する。」→
  `Statins inhibit hepatic HMG-CoA reductase.`
  `（スタチンは肝臓のHMG-CoA還元酵素を阻害する。）`
- 「横紋筋融解症は骨格筋の破壊によりミオグロビンが遊離する病態である。」→
  `Rhabdomyolysis is characterized by skeletal muscle breakdown releasing myoglobin.`
  `（横紋筋融解症は骨格筋の破壊によりミオグロビンが遊離する病態である。）`
- 「グリニド薬は食後高血糖を主に抑制する。」→
  `Glinides primarily suppress postprandial hyperglycemia.`
  `（グリニド薬は食後高血糖を主に抑制する。）`

### Type G：理由・臨床判断文
**定義**：独立した1文で、因果・条件の接続表現を含み「なぜ/いつそうするか」を説明する文。
**挿入方法**：Type Fと同じ（英語文＋日本語訳併記）
 
- 「妊娠可能年齢の女性には避妊指導が必須である、スタチンは催奇形性を持つためである。」→
  `Contraception counseling is essential in women of reproductive age because statins are teratogenic.`
  `（妊娠可能年齢の女性には避妊指導が必須である、スタチンは催奇形性を持つためである。）`
- 「筋肉痛が出現した場合は必ず精査が必要である。」→
  `Muscle pain must always be evaluated promptly if it occurs during statin therapy.`
  `（筋肉痛が出現した場合は必ず精査が必要である。）`

### Type H：談話標識
**定義**：文と文をつなぐ機能語（内容語ではない）。
**挿入方法**：ルビ不要。英語のまま挿入（短く文脈から意味推測可能なため）
 
| 日本語 | 変換後 |
|---|---|
| しかし | `however` |
| したがって | `therefore` |
| さらに | `in addition` / `furthermore` |
| その結果 | `as a result` |
| 一方で | `in contrast` / `meanwhile` |
 
### Type I：症例文（USMLE stem調）
**定義**：複数文からなる、患者の病歴・現症・検査所見の記述。
**挿入方法**：段落ごと英語文化。Type A/B相当の専門語のみルビ付与、他はルビなし
 
- 「45歳男性が、スタチン内服中に全身の筋肉痛と褐色尿を主訴に受診した。」→
  `A 45-year-old man presents with diffuse myalgia and dark urine while on statin therapy.`
- 「血液検査ではCKの著明な上昇を認めた。」→
  `Laboratory testing reveals markedly elevated <ruby>creatine kinase (CK)<rt>クレアチンキナーゼ</rt></ruby>.`
- 「既往歴に特記事項はない。」→
  `His past medical history is unremarkable.`
  
### Type J：慣用コロケーション
**定義**：直訳では意味が通らない、医学英語特有の定型表現。
**挿入方法**：ルビなし。英語のまま挿入（Lv.8以降で意図的に平易化しない）
 
| 日本語 | 変換後 |
|---|---|
| 除外された | `was ruled out` |
| 〜が特記事項として認められた | `was notable for 〜` |
| 〜が開始された | `was started on 〜` |
| 特記事項なし | `unremarkable` |
| 〜が疑われた | `was suspected of 〜` |
 
### Type Z：それ以外
**定義**：数値・単位・助詞・一般語彙（上記A〜Jに該当しないもの）。
**挿入方法**：常に日本語のまま。Lv.10でのみ英語化を検討する（例：45歳→45-year-old、約→approximately）
 

---
 
# Level定義（累積：Lv.Nはそれ以下の全Typeを含む）
 
| Level | 追加されるType | イメージ |
|---|---|---|
| Lv.0 | なし | 全文日本語 |
| Lv.1 | A | 基礎医学語彙だけ英語+ルビ |
| Lv.2 | +B | 高度専門固有名詞も追加 |
| Lv.3 | +C | 短い機序句も追加 |
| Lv.4 | +D | 複合機序句も追加 |
| Lv.5 | +E | 比較・関係句も追加 |
| Lv.6 | +F | 定義・機序文を英語文として併記 |
| Lv.7 | +G | 理由・臨床判断文も英語文化 |
| Lv.8 | +H | 談話標識も英語化＝段落が英語の流れで読める |
| Lv.9 | +I | 症例文（USMLE stem調）も英語で読む |
| Lv.10 | +J, Z | 慣用コロケーション・一般語彙も英語。ルビなし。USMLE本番相当 |
 
---
 
# 変換例（同一段落でLv.1→Lv.10）
 
素材：「スタチンは肝臓でHMG-CoA還元酵素を阻害し、コレステロール合成を抑制することで血中LDLを低下させる。低LDL血症は心血管イベントリスクを減少させる。さらに、スタチンは横紋筋融解症のリスクも有する。したがって、筋肉痛が出現した場合は必ず精査が必要である。45歳男性が、スタチン内服中に全身の筋肉痛と褐色尿を主訴に受診した。血液検査ではCKの著明な上昇を認めた。精査の結果、他の原因は除外された。」
 
```html
<!-- Lv.1（Type A） -->
<ruby>Statins <rt>スタチン </rt> </ruby>は肝臓でHMG-CoA還元酵素を阻害し...
※スタチンは一般語彙寄りだが薬剤固有名詞のためType A/Bどちらか要判定。ここではType Aの語（infection等）が本文になければ変化なしのケースもある
 
<!-- Lv.2（+Type B） -->
<ruby>Statins <rt>スタチン </rt> </ruby>は肝臓で <ruby>HMG-CoA reductase <rt>HMG-CoA還元酵素 </rt> </ruby>を阻害し、コレステロール合成を抑制することで血中LDLを低下させる。
 
<!-- Lv.3（+Type C） -->
（この段落にC該当の短い機序句が単独で出現すればここでruby化。この例文は複合機序句主体のため変化は主にLv.4で発生）
 
<!-- Lv.4（+Type D） -->
<ruby>Statins <rt>スタチン </rt> </ruby>は <ruby>hepatic HMG-CoA reductase inhibition <rt>肝臓のHMG-CoA還元酵素阻害 </rt> </ruby>を介してコレステロール合成を抑制し、血中LDLを低下させる。
 
<!-- Lv.5（+Type E） -->
（比較句が本文にあればここでruby化）
 
<!-- Lv.6（+Type F） -->
<ruby>Statins inhibit hepatic HMG-CoA reductase, thereby suppressing cholesterol synthesis and lowering serum LDL. <rt>スタチンは肝臓のHMG-CoA還元酵素を阻害し、コレステロール合成を抑制することで血中LDLを低下させる。 </ruby>低LDL血症は心血管イベントリスクを減少させる。さらに、<ruby>Statins <rt>スタチン </rt> </ruby>は...

```
 
# Quality criteria
 
## MUST

- cloze内部の処理は Cloze内テキストの翻訳とパターン適用 を適用し, cloze 外のルールと区別する
- Levelは cloze外にのみ適用する
- 文中に cloze 記法が存在する場合は、その cloze 部分を独立したチャンクとして扱い、その前後で文を強制的に分割すること. 分割された「clozeの手前」「cloze部分」「clozeの後ろ」のそれぞれに個別の  <ruby> タグを適用すること.
- cloze 記法と ルビが重なる場合は、必ず {{c1:: <ruby>英文 <rt>和文 </ruby>}} のように、clozeタグを 一番外側 ( <ruby> タグの外側) に配置すること. {{c1::...}} などの cloze 記法が単語を跨ぐ場合、cloze を ruby の外側に配置し, 日本語と英語両方が、タグによって隠れるようにする.  (e.g. {{c54::MMR ( <ruby>Mismatch Repair <rt>ミスマッチ修復 </rt> </ruby>)}}) 
- {{c1::...}} などの穴埋め記法は、翻訳後も構造を変えずに保持すること.

- 元のテキスト要素を一切省略せず、すべて出力に反映する
- /html-formatter (skills/html-formatter/SKILL.md) に従う.

- `<ruby>`, `</ruby>`, `<rt>`, `</rt>` の直前には必ず半角スペースを入れる
- フローチャート内の矢印 ( →, -->, ←, ↑, ↓, --, __, | ) や記号 (⚡, 🚫) , 見出し先頭数字は `<ruby>` タグの外側に配置する
- 括弧 `()` を含む場合、その前後・括弧内・括弧外でruby単位を分割する
- 「A: B」構造は「A:」と「B」に分離してそれぞれ処理する

- Type判定はフローチャートの順序に厳密に従い、複数Typeに該当しうる場合は **若い番号（より限定的な基準）を優先** する


## SHOULD

- 日本語でも英語でも同一の clozeや文については、英語のみでいい. 日本語は不要.
- 略語はこのように、[略語: ( <ruby>英語正式名称 <rt>日本語正式名称 </rt> </ruby>)] のフォーマットで表記する. (e.g. {{c54::MMR ( <ruby>Mismatch Repair <rt>ミスマッチ修復 </rt> </ruby>)}}) 
- 引用符 ("") や括弧 (()) などの記号は、 <ruby> タグや cloze タグの内側には含めず、タグの外側にそのまま残すこと.
- Type A〜G（Lv.1〜7）は中学生レベルの平易な英文法を用いる. 専門用語自体は言い換えない
- Type H〜J（Lv.8〜10）は意図的に平易化せず、ネイティブ表現, 慣用コロケーションを用いる
- 同一 Type・同一概念が 同一セクション内で既出の場合、2回目以降はルビを省略する (only English)


## Edge case

[number 日本語] --> [number  <ruby>English  <rt>日本語  </ruby>] 
- [3.5 Mismatch Repair Deficiency and MSI] --> [<h2>3.5  <ruby>Mismatch Repair Deficiency and MSI  <rt>ミスマッチ修復欠損とMSI  </rt> </ruby></h2>]

- ルビの除外対象: フローチャート内の矢印 ( →, -->, ←, ↑, ↓, --, __, | ) や記号 (⚡, 🚫) は <ruby>タグに含めず、タグの外側にそのまま配置すること.


# Cloze内テキストの翻訳とパターン適用

{{cX::...}} 内のテキストに対し、セクション内での出現回数や構成に応じて以下のパターンを厳密に適用する. cloze 外とは異なる規則なので注意する. 

**パターン1: 専門用語 (はじめて出現) **
{{cX:: <ruby>English <rt>日本語 </ruby>}}
例: 一つ一つの細胞自身のサイズを大きくする「{{c5::肥大}}」 → 一つ一つの細胞自身のサイズを大きくする「{{c5:: <ruby>Hypertrophy <rt>肥大 </rt> </ruby>}}」

**パターン2: 略語 (同一セクション内で初出) **
{{cX:: <ruby>略称: 英語正式名称 <rt>日本語 </ruby>}}
例: {{c33::RCD}} → {{c33:: <ruby>RCD: Regulated Cell Death <rt>多様な制御性細胞死 </rt> </ruby>}}

**パターン3: 専門用語 (専門用語) **
{{cX:: <ruby>English1 <rt>日本語1 </rt> </ruby>}} ({{cX::<ruby>English2 <rt>日本語2 </rt> </ruby>}})
例: {{c4::腸上皮化生 (バレット食道) }} → {{c4:: <ruby>Intestinal Metaplasia <rt>腸上皮化生 </rt> </ruby>}} ({{c4:: <ruby>Barrett's Esophagus <rt>バレット食道 </rt> </ruby>}})

- {{cX::...}} タグが必ず <ruby> タグの最外殻に位置するように配置する. 日本語と英語の両方がクローズ内に隠れることを保証する.

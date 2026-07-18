---
name: anki-card-formatter-detaileddescription-sub
description: null
---

# Task

以下の指示を逐一実行する。sub agent の使用は禁止する。

**Use the `TaskCreateTool` to create tasks for each of the following steps.**

## Step 0. ファイル読み込み

指定されたファイルを読み込む。

## Step1: 章立てルール準拠

以下の条件を満たすように修正を行う。以下の条件が満たすまで修正をループさせる。

/text-formatter-structuring の要件は、厳格に遵守する。少しでも逸脱が見られた場合は修正する。

MUST

- /html-formatter (skills/html-formatter/SKILL.md)
- /text-formatter-structuring

SHOULD

- /text-formatter-chart


## Step2: 書式ルール準拠

以下の条件を満たすように修正を行う。以下の条件を満たすまで修正をループさせる。

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





## Step 3. sub section ごとに分割して HTML を保存

sub section ごとに分割して HTML を保存する。指定パスに指定ファイル名で保存する。section ごとではなく、 sub section ごとである。

- /text-formatter-structuring


## Step 5. detailedDescription の修正に伴い、detailedDescriptionIndex と、 highYieldSummaryIndex のマッピングの修正を行う。

detailedDescription (<absolute path>/detailedDescription/<original filename without extension>SubSect<sub section index>.html) の sub section が、highYielsSummary (<absolute path>/highYieldSummary/<original filename without extension>Sect<section index>.html) のどの section に対応するかを定義するマッピングである。

detaileddescription は sub section 番号で、highYieldSummary は section 番号でマッピングする。

例えば、3.2 を 3.2, 3.3 に分け、3.3 以降の番号を一つ後ろにずらした場合、マッピングの該当インデックスも修正する。

mapping file is already generated. 以下の JSON 形式で変更を修正する。指定ファイルパスで上書き保存する。

    ```json
    {
        "detailedDescriptionIndex": "3.3（ここには sub section 番号が入る。）",
        "highYieldSummaryIndex": "2（ここには section 番号が入る。）"
    },
    ```
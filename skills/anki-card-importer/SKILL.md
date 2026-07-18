---
name: anki-card-importer
description: null
---

# Task
以下のワークフローを順次実行し、高品質な医学Ankiカードを生成する。
長大な処理だが、時間をかけて省略せずに実行すること。

## Subagent
- サブエージェントの使用はこのスキルやこのスキルが参照する他のスキルで明記された場合のみに限る。
- 使用するサブエージェントはSKILLの指示に忠実に従う。指定がない場合は @haiku を使用する。
- Subagent には、 @haiku, @haiku-notool, @sonnet, @sonnet-notool がある。このスキルで指定されたサブエージェントを用いる。
- サブエージェントからの応答がない場合は、errorで異常終了した可能性が高いので、1回まで新たなサブエージェントで再試行する。
- サブエージェントへのファイルパスの指示はすべて絶対パスで行う。


## コンテキスト管理

本ワークフローは長大（20ステップ以上）であり、コンテキスト溢れのリスクがある。以下を遵守する。

1. **サブエージェントスキルファイルを読まない**: 各ステップで「コンテキストを抑えるため〜を見てはいけない」と記載されたスキルファイルは、メインエージェントが読むことなくサブエージェントに委譲する。
2. **中間ファイルの再読み込み回避**: 生成済みの JSON/MD ファイルを後続ステップで再読み込みしない。必要最小限の情報（件数、キー名）のみ `uv run python` で確認する。

禁止事項: カード内容の全量出力、JSONの生データ出力、変更対象の全リスト出力。ファイルに書き込む内容は返答に含めず、ファイルパスのみ記載すること。

## CoT

### Step: Create tasks

**Use the `TaskCreateTool` to create tasks for each of the following steps. (like ### xxx, #### xxxx, #### xxxx, ...)**

### Step: 入力の確認

ユーザーが指定した working directory, original filename をもとに、ファイルの存在を確認する。未提示の場合は処理を進めず、入力を要求する。

このSKILLで必要となるファイルの存在を、すべて、処理前に確認する。

ここで以下を定義する。

- <original filename (without extension)>: ユーザーの指定したファイル名から拡張子を除いたもの.
- <absolute path>: ユーザーの指定したWorking directory。指定がない場合はユーザーに必ず質問する。

### Step D1: detailedDescription 修正、分割保存（subagent）

あなたはコンテキストを抑えるため `/anki-card-formatter-detaileddescription-sub` を見てはいけない。SubAgent(@haiku) に以下の指示をする。

    ```md
    # Task
    以下の指示を実行する。実行中に不測の事態があった場合は実行後に詳細に報告する。1回でもbashやpowershellでエラーを起こしたり、マニュアルに書いていない例外が起きた場合は報告し次に生かす。

    /anki-card-formatter-detaileddescription-sub (skills/anki-card-formatter-detaileddescription-sub/SKILL.md) を使って処理を行う

    ## input
    
    <absolute path>/detailedDescription/<original filename without extension>.html

    ## output 
    
    以下の形式で複数ファイル（sub section の数だけ）保存する. sub section index は 1.1, 1.2,..., 2.1, 2.2, 2.3,..., 3.1,... のような <section number>.<subsection number> の連番であること。
    ファイル名は sub section index と対応していなければならない。sub section index が規定に従っていなかった場合は、規定に従って振り直す。

    <absolute path>/detailedDescription/<original filename without extension>SubSect<sub section index>.html
        
    example: 
        <absolute path>/detailedDescription/4SubSect1.1.html
        <absolute path>/detailedDescription/4SubSect1.2.html
        <absolute path>/detailedDescription/4SubSect2.1.html
        <absolute path>/detailedDescription/4SubSect2.2.html
        <absolute path>/detailedDescription/4SubSect2.3.html
        ... 

    <absolute path>/mapping/<original filename without extension>.json: 各 detaileddescription に関連する highYieldSummary マッピング。上書き保存すること。
        encoding: UTF-8
        key:
        - detailedDescriptionIndex: str
        - highYieldSummaryIndex: str

    # Final report format

    ``md
    completed: [実行したタスクの1行要約]
    path: 
    - [変更したファイルのパス]
    - [変更したファイルのパス]
    変更内容要約:
    - [変更1: 何をどう変更したか]
    - [変更2: ...]
    （3-15行）
    例外事態:
    - [発生した問題と対処]
    （最大5行、なければ「なし」）
    ``

    ```
   
### Step S1: highYieldSummary 修正、分割保存（subagent）

あなたはコンテキストを抑えるため `/anki-card-formatter-highYieldSummary-sub` を見てはいけない。SubAgent(@haiku) に以下の指示をする。
    
```md
# Task
以下の指示を実行する。実行中に不測の事態があった場合は実行後に詳細に報告する。1回でもbashやpowershellでエラーを起こしたり、マニュアルに書いていない例外が起きた場合は報告し次に生かす。

/anki-card-formatter-highYieldSummary-sub　(skills/anki-card-formatter-highyield-sub/SKILL.md) を使って処理を行う

## input

<absolute path>/highYieldSummary/<original filename without extension>.html

## output 

以下の形式で複数ファイル（section の数だけ）保存する. section index は 1, 2, 3, ... のような <section number> の連番であること。
ファイル名は section index と対応していなければならない。section index が規定に従っていなかった場合は、規定に従って振り直す。sub section ではなく、section index に基づき分類する。

<absolute path>/highYieldSummary/<original filename without extension>Sect<section index>.html

example: 
    <absolute path>/highYieldSummary/3Sect1.html
    <absolute path>/highYieldSummary/3Sect2.html
    <absolute path>/highYieldSummary/3Sect3.html
    ... 

<absolute path>/mapping/<original filename without extension>.json: 各 detaileddescription に関連する highYieldSummary マッピング。上書き保存すること。
    encoding: UTF-8
    key:
    - detailedDescriptionIndex: str
    - highYieldSummaryIndex: str

# Final report format

``md
completed: [実行したタスクの1行要約]
path: 
- [変更したファイルのパス]
- [変更したファイルのパス]
変更内容要約:
- [変更1: 何をどう変更したか]
- [変更2: ...]
（3-15行）
例外事態:
- [発生した問題と対処]
（最大5行、なければ「なし」）
``

```


### Step H: subagent の並列実行
以下の Step Hx (V1, D2) は、並列に行う。



#### Step V1: visualAids を生成（subagent）

**あなたはコンテキストを抑えるため `/anki-card-formatter-visualaids` を見てはいけない。** SubAgent(@haiku-notool) に以下の指示をする。

```md
# Task
以下の指示を実行する。実行中に不測の事態があった場合は実行後に詳細に報告する。1回でもbashやpowershellでエラーを起こしたり、マニュアルに書いていない例外が起きた場合は報告し次に生かす。

/anki-card-formatter-visualaids を使って処理を行う ("skills/anki-card-formatter-visualaids/SKILL.md"). 

各インプットファイルの内容を各アウトプットファイルに対応させる。<absolute path>/highYieldSummary/3Sect3.html にある内容Aが書いてあったら、<absolute path>/visualAids/3Sect3.html に内容Aをもとに生成した結果を書き込む。内容Bを書き込んではいけない。

### inputPath

<absolute path>/highYieldSummary/<original filename without extension>Sect<section index>.html (multiple)

example: 
    <absolute path>/highYieldSummary/3Sect1.html
    <absolute path>/highYieldSummary/3Sect2.html
    <absolute path>/highYieldSummary/3Sect3.html
    ... 

### outputPath
<absolute path>/visualAids/<original filename without extension>Sect<section index>.html (multiple)

example: 
    <absolute path>/visualAids/3Sect1.html
    <absolute path>/visualAids/3Sect2.html
    <absolute path>/visualAids/3Sect3.html
    ... 

# Final report format

``md
completed: [実行したタスクの1行要約]
path: 
- [変更したファイルのパス]
- [変更したファイルのパス]
変更内容要約:
- [変更1: 何をどう変更したか]
- [変更2: ...]
（3-15行）
例外事態:
- [発生した問題と対処]
（最大5行、なければ「なし」）
``

```

#### Step D2: detailedDescription の cloze 追加（subagent）

SubAgent **(@haiku-notool)** に以下の指示をする。

```md
# Task

与えられた HTML （roughな {{cX::}} 指定付き）を、以下のルールに従って Anki のCloze形式 HTML に変換する。

## input

ファイルの存在を確認する。ファイルの中身は必要になったら読む。

**detailedDescription**

<absolute path>/detailedDescription/eng/<original filename without extension>SubSect<sub section index>.html
    
example: 
    <absolute path>/detailedDescription/4SubSect1.1.html
    <absolute path>/detailedDescription/4SubSect1.2.html
    <absolute path>/detailedDescription/4SubSect2.1.html
    <absolute path>/detailedDescription/4SubSect2.2.html
    <absolute path>/detailedDescription/4SubSect2.3.html
    ... 

structure: 各セクション内にroughな {{cX::}} が存在. rough な Cloze 指定とは「大雑把に {{cX::}} で囲まれている」状態。同一セクション内の同一概念が ばらばらのc番号を持っていたり、英語表記がなかったり、カッコ内が一体化していたりする。本手順で正規化する。

## 前提条件

対象範囲: 指定されたファイルすべて
元のc番号を維持するか、振り直すか？: 元の番号を極力維持
以前のセクションで出現した概念を後続セクションで穴埋めにするか？: 穴埋めにしない。本文のまま。
出力形式: /html-formatter (skills/html-formatter/SKILL.md) に準拠 (MUST)

## Step cloze process

以下のサブステップを各セクションに対して実行する。以前のセクションの内容は保持しない

### 3-1. c番号の確認とグループ化

**CoT**

1. セクション内の既存 {{cX::}} を全て列挙
2. 上から下へ読み進め、同一概念（同じ単語・略語・推論可能な項目）が再登場した場合、同じc番号を割り振る
3. 見出しもグループ化の対象に含める
4. 元のc番号を極力維持する（既存番号の再利用優先）

**同一概念グループ化の判定基準**

同一セクション内で同一概念
- 同じc番号: {{c1::β1受容体}} がSection内に3回登場 → 全て {{c1::β1受容体}}

略語と正式名称の再登場 → 同じc番号
- {{c3::GABA_A Receptor}} と後続の GABA_A → {{c3::GABA_A}} に変更

異なるセクション → グループ化しない
- §1の {{c3::肥大}} と§3の 肥大 → §3では穴埋めにしない

推測可能な文脈 → グループ化が必要
- NG: 「抗コリン薬は {{c1::抗コリン作用}} を持ち」→ OK: 「{{c1::抗コリン薬}} は {{c1::抗コリン作用}} を持ち」

検証ポイント
- 「この穴埋めを隠したとき、前後の文脈から答えが推測可能か？」を各clozeに対して確認する。推測可能な場合、文脈も含めてclozeに含める。

グループ化の対象

- 同一の専門用語（例: 「β1受容体」が複数回出現）
- 略語とその正式名称（例: 「GABA_A Receptor」と「GABA_A」）
- 推論可能な関連概念（例: 「抗コリン薬」と「抗コリン作用」と「アセチルコリン」）
- 見出しに含まれる概念も対象

グループ化の判定フロー

``md
テキストを上から読み進める
├─ {{cX::}} で囲まれた概念を記録（c番号、概念名）
├─ 後続のテキストで同一概念が出現
│  ├─ 同一セクション内 → 同じc番号で {{cX::}} を追加
│  └─ 異なるセクション → 穴埋めにしない（本文のまま）
└─ {{cX::}} で囲まれていないが推論可能な概念
   └─ 同一セクション内 → {{cX::}} を追加してグループ化
``

### 3-2. カッコ分割

**ルール**

{{cX::}} の内部にカッコ（）が入っていた場合、カッコの前後で分割する。

**変換例**

変換前: {{cX::腸上皮化成（バレット食道）}}
変換後: {{cX::腸上皮化成}}（{{cX::バレット食道}}）
意図: カッコ内の補足情報と本体を別々にcloze化することで、カードの粒度を適切にする。カッコ内の情報は「補足」として独立して隠せる。

example

- カッコが複数ある場合、全て分割する: {{cX::A（B）（C）}} → {{cX::A}}（{{cX::B}}）（{{cX::C}}）
- カッコが {{cX::}} の外にある場合は分割不要
- 分割後、各部分に独立して英語表記ルールを適用

### 3-3. 跨セクションの処理

以前のセクション（§1〜§N-1）で既に {{cX::}} として出現した概念は、§Nでは穴埋めにしない（本文テキストのまま残す）。同一セクション内で初めて出現する概念のみを {{cX::}} で囲む

注意: このルールは「以前のセクションでcloze化された概念」にのみ適用される。以前のセクションでcloze化されていなかった概念（本文のままだった専門用語など）は、現在のセクションで初めてcloze化してもよい。

### 3-4. 英語表記の追加

{{cX::}} の内部のみに英語表記を適用する。外の本文テキストは元のまま変更しない。

cloze は全部分、英語表記の追加対象である。cloze の中身がいくら長くても短くても、文であったとしても追加対象となる。

**パターン1: 専門用語（はじめて出現）**
{{cX::<ruby>English<rt>日本語</ruby>}}
例: {{c5::一つ一つの細胞自身のサイズを大きくする「肥大」}} → {{c5::一つ一つの細胞自身のサイズを大きくする「<ruby>Hypertrophy<rt>肥大</rt></ruby>」}}

**パターン2: 専門用語（同一セクション内2回目以降）**
{{cX::Only English}}（ruby 不要）
例: §1で {{c1::感染}} が2回目 → {{c1::Infection}}

**パターン3: 略語（同一セクション内で初出）**
{{cX::<ruby>略称: 英語正式名称<rt>日本語</ruby>}}
例: {{c33::RCD}} → {{c33::<ruby>RCD: Regulated Cell Death<rt>多様な制御性細胞死</rt></ruby>}}

**パターン4: 専門用語（専門用語）**
{{cX::<ruby>English1<rt>日本語1</rt></ruby>（<ruby>English2<rt>日本語2</rt></ruby>）}}
例: {{c4::腸上皮化生（バレット食道）}} → {{c4::<ruby>Intestinal Metaplasia<rt>腸上皮化生</rt></ruby>（<ruby>Barrett's Esophagus<rt>バレット食道</rt></ruby>}}

**パターン5: 専門用語（一般用語）**
{{cX::<ruby>English<rt>日本語</rt></ruby>（一般用語）}}
例: {{c28::カスパーゼ（1, 4, 11など）}} → {{c28::<ruby>Caspase<rt>カスパーゼ</rt></ruby>（1, 4, 11など）}}

**パターン6: 一般用語（専門用語）**
{{cX::一般用語（<ruby>English<rt>日本語</rt></ruby>}}
例: {{c7::皮膚（表皮）、毛髪}} → {{c7::皮膚（<ruby>Epidermis<rt>表皮</rt></ruby>）、毛髪}}

## output

<absolute path>/detailedDescription/<original filename without extension>SubSect<sub section index>.html
    
example: 
    <absolute path>/detailedDescription/cloze/4SubSect1.1.html
    <absolute path>/detailedDescription/cloze/4SubSect1.2.html
    <absolute path>/detailedDescription/cloze/4SubSect2.1.html
    <absolute path>/detailedDescription/cloze/4SubSect2.2.html
    <absolute path>/detailedDescription/cloze/4SubSect2.3.html
    ... 

# Final report format

``md
completed: [実行したタスクの1行要約]
path: 
- [変更したファイルのパス]
- [変更したファイルのパス]
変更内容要約:
- [変更1: 何をどう変更したか]
- [変更2: ...]
（3-15行）
例外事態:
- [発生した問題と対処]
（最大5行、なければ「なし」）
``

```


### Step D3. detailedDescription への2か国語併記

sub agent (@haiku-notool) に以下の指示を一言一句そのまま与えて back ground で実行する。

1 つのサブエージェントへの入力 HTML ファイルが 10個を超えてはいけない。（精度が低下するため。）10 個以上のファイルがある場合は、2つ か 3つの sub agent に分けて 指示を出す。1 つのサブエージェントへの入力 HTML ファイルが 10個を超えてはいけない。すべての sub agent は、 @haiku-notool を用いる。

```md

# Task
添付のファイルについて、日本語→英語、英語→日本語、に翻訳し、保存する。2か国語併記にし、どちらの言語の native speaker でも読めるようにする。HTMLの<ruby>タグを用いて英文（ベース）と和文（ルビ）を併記。

## Quality criteria

#### MUST

- 2か国語併記にし、どちらの言語の native speaker でも読めるようにする。
- /html-formatter (skills/html-formatter/SKILL.md)

- ルビの粒度とclozeによる分割: cloze記法（{{c1::...}} など）を含まない文は、原則として「1文全体」を1つのチャンクとし、<ruby>英文<rt>和文</ruby> の形式で出力すること。文中に cloze 記法が存在する場合は、その cloze 部分を独立したチャンクとして扱い、その前後で文を強制的に分割すること。分割された「clozeの手前」「cloze部分」「clozeの後ろ」のそれぞれに個別の <ruby> タグを適用すること。
- clozeタグの位置と記号の扱い: cloze 記法と ルビが重なる場合は、必ず {{c1::<ruby>英文<rt>和文</ruby>}} のように、clozeタグを 一番外側（<ruby> タグの外側）に配置すること。
- 箇条書きの分離: 「A: B」のような構造の場合、「A:」と「B」は独立した文として扱い、それぞれ別々に<ruby>タグを適用すること。
- 特殊記法の維持: {{c1::...}} などの穴埋め記法は、翻訳後も構造を変えずに保持すること。
- cloze の適正化: {{c1::...}} などの cloze 記法が単語を跨ぐ場合、日本語と英語両方が、タグによって隠れるようにする。
- 省略の禁止: 元のテキストの要素を一切省略せず、すべて出力に反映させること。
- 専門用語の扱い: 基本的な文法（中学生レベル）を使用する一方で、医療・科学分野の専門用語（例: Receptor tyrosine kinases や Tumor suppressor genes）は、不自然な言い換えをせずそのまま使用すること。
- ルビの除外対象: フローチャート内の矢印（ →, -->, ←, ↑, ↓, --, __, | ）や記号（⚡, 🚫）は<ruby>タグに含めず、タグの外側にそのまま配置すること。

#### SHOULD

- 対訳の対応関係: 翻訳前の文章と翻訳後の文章の、語順と文構成を、できるだけ一致させる。自然な語順の両立ができなかった場合、日本語を優先する。( e.g. SVO (English) → 「 S が V する。 O に対してである。」、 A of B → 「A が--される。 これは B である。 」)
- 対訳の対応関係: バイリンガルにとって日本語と英語の対応をスムーズに読めるようにするため、英語と日本語の文章の、語順と文構成を、できるだけ一致させる。
- 日本語でも英語でも同一の clozeや文については、英語のみでいい。日本語は不要。（e.g. {{c54::MMR (<ruby>Mismatch Repair<rt>ミスマッチ修復</rt></ruby>)}}）
- すでに<ruby>によって2か国語が併記されている部分は、要件に合っていなかったとしても修正不要。
- 引用符（""）や括弧（()）などの記号は、<ruby> タグや cloze タグの内側には含めず、タグの外側にそのまま残すこと。
- 翻訳レベルと文字数制限: 日本の中学生が理解できる基礎的な英単語と文法を使用すること。一文を極力短く分割し、複雑な構文を避けること。

#### COULD

- ルビの除外対象: 見出しの先頭の数字（例: 4.4）は <ruby> タグに含めず、タグの外側にそのまま配置すること。

#### cloze 内のみのルール（MUST）

{{cX::}} の内は以下の英語表記を適用する。cloze 外の本文テキストとは、記法が大きく違うので注意する。

**パターン1: 専門用語（はじめて出現）**
{{cX::<ruby>English<rt>日本語</ruby>}}
例: {{c5::一つ一つの細胞自身のサイズを大きくする「肥大」}} → {{c5::一つ一つの細胞自身のサイズを大きくする「<ruby>Hypertrophy<rt>肥大</rt></ruby>」}}

**パターン2: 専門用語（同一セクション内2回目以降）**
{{cX::Only English}}（ruby 不要）
例: §1で {{c1::感染}} が2回目 → {{c1::Infection}}

**パターン3: 略語（同一セクション内で初出）**
{{cX::<ruby>略称: 英語正式名称<rt>日本語</ruby>}}
例: {{c33::RCD}} → {{c33::<ruby>RCD: Regulated Cell Death<rt>多様な制御性細胞死</rt></ruby>}}

**パターン4: 専門用語（専門用語）**
{{cX::<ruby>English1<rt>日本語1</rt></ruby>（<ruby>English2<rt>日本語2</rt></ruby>）}}
例: {{c4::腸上皮化生（バレット食道）}} → {{c4::<ruby>Intestinal Metaplasia<rt>腸上皮化生</rt></ruby>（<ruby>Barrett's Esophagus<rt>バレット食道</rt></ruby>}}

**パターン5: 専門用語（一般用語）**
{{cX::<ruby>English<rt>日本語</rt></ruby>（一般用語）}}
例: {{c28::カスパーゼ（1, 4, 11など）}} → {{c28::<ruby>Caspase<rt>カスパーゼ</rt></ruby>（1, 4, 11など）}}

**パターン6: 一般用語（専門用語）**
{{cX::一般用語（<ruby>English<rt>日本語</rt></ruby>}}
例: {{c7::皮膚（表皮）、毛髪}} → {{c7::皮膚（<ruby>Epidermis<rt>表皮</rt></ruby>）、毛髪}}


### example

``html
<p>
  <ruby>This classification is utilized <rt>この分類は活用される </ruby><ruby>for the selection of personalized treatments. <rt>個別化治療の選択のためにである。 </ruby>
</p>
<p>
⚡<ruby>The T790M mutation in the EGFR gene confers resistance to first-generation EGFR inhibitors.<rt>EGFR遺伝子のT790M変異は第1世代EGFR阻害薬への耐性を生じさせる。</ruby>{{c34::<ruby>Third-generation EGFR inhibitors (osimertinib)<rt>第3世代EGFR阻害薬（オシメルチニブ）</ruby>}} <ruby>are also effective against the T790M mutation.<rt>はT790M変異にも有効である。</ruby><ruby>Vemurafenib is used for the BRAF V600E mutation.<rt>BRAF V600E変異に対してはベムラフェニブが使用される。</ruby>
</p>
<p>
  <ruby>The cornerstone of Japan's cancer prevention guidelines is<rt>日本のがん予防ガイドラインの柱は</ruby> "{{c8::<ruby>Cancer Prevention Plus 1<rt>がん予防プラス1</ruby>}}".
</p>
<p>
  <ruby>The basic measures consist of 6 items, adding<rt>基本的な対策法は、6項目からなり、</ruby>{{c8::<ruby>infection control<rt>感染症対策</ruby>}} to the 5 healthy habits<rt>を5つの健康習慣に加えたものである。</ruby>({{c9::<ruby>not smoking<rt>禁煙</ruby>}}, {{c9::<ruby>moderate alcohol consumption<rt>節度のある飲酒</ruby>}}, {{c9::<ruby>a balanced diet<rt>バランスの良い食事</ruby>}}, {{c9::<ruby>exercise<rt>運動</ruby>}}, and {{c9::<ruby>maintaining a healthy weight<rt>適正体重の維持</ruby>}}).
</p>

<h2>3.5 <ruby>Mismatch Repair Deficiency and MSI <rt>ミスマッチ修復欠損とMSI </rt></ruby></h2>

<p><strong><ruby>Mismatch repair (MMR) has a small complex<rt>ミスマッチ修復（MMR）にはスモールコンプレックス</rt></ruby></strong> (<strong>{{c58::MSH2-MSH6}}</strong> <ruby>heterodimer<rt>ヘテロダイマー</rt></ruby>) <ruby>and a large complex<rt>とラージコンプレックス</rt></ruby> (<strong>{{c59::MLH1-PMS2}}</strong> <ruby>heterodimer.<rt>ヘテロダイマー）がある。</rt></ruby></p>
<p><ruby>When these components are deficient, <strong>Microsatellite Instability (MSI-High)</strong> occurs,<rt>これらのコンポーネントが欠損すると<strong>マイクロサテライト不安定性（MSI-High）</strong>が生じ、</rt></ruby><ruby>and mutations easily accumulate.<rt>変異が蓄積しやすくなる。</rt></ruby></p>
<p><ruby>MSI-High is a phenomenon that base misincorporations are not corrected,<rt>MSI-Highは塩基の誤組み込みが修正されず、</rt></ruby><ruby>and microsatellite region<rt>マイクロサテライト領域</rt></ruby> (<ruby>short base sequence repeat region<rt>短い塩基配列の繰り返し領域</rt></ruby>) <ruby>length changes.<rt>の長さが変化する現象である。</rt></ruby> <ruby>Normally MMR enzymes recognize misincorporations and repair them,<rt>正常ではMMR酵素が誤組み込みを認識して修復するが、</rt></ruby><ruby>but when MMR genes have mutations, this repair stops functioning.<rt>MMR遺伝子に変異があるとこの修復が機能しなくなる。</rt></ruby></p>
<p><ruby>MMR-deficient tumors have very large mutation amounts,<rt>MMR欠損の腫瘍は変異量が非常に多く、</rt></ruby><ruby>and on cancer cell surfaces, mutation-derived neoantigens<rt>がん細胞表面に変異由来の新抗原</rt></ruby> (neoantigen) <ruby>are abundantly presented.<rt>が豊富に提示される。</rt></ruby> <ruby>For this reason, immune cells easily recognize cancer cells,<rt>このため、免疫細胞ががん細胞を認識しやすく、</rt></ruby><ruby>and immune checkpoint inhibitors' effects are easily exerted.<rt>免疫チェックポイント阻害薬の効果が発揮されやすい。</rt></ruby></p>
<p>⚡ <ruby>Because MSI-High tumors have large mutation amounts, to immune checkpoint inhibitors<rt>MSI-Highの腫瘍は変異量が多いため、免疫チェックポイント阻害薬</rt></ruby> (<ruby>such as anti-PD-1 antibodies<rt>抗PD-1抗体など</rt></ruby>) <ruby>response is high.<rt>に対する反応性が高い。</rt></ruby> <ruby>In cases with 10 or more mutations per 1 megabase, pembrolizumab becomes indicated.<rt>1メガベースあたり10個以上の変異がある場合、ペムブロリズマブが適応となる。</rt></ruby></p>


``

## input

<absolute path>/detailedDescription/cloze/<original filename without extension>SubSect<sub section index>.html
    
example: 
    <absolute path>/detailedDescription/cloze/4SubSect1.1.html
    <absolute path>/detailedDescription/cloze/4SubSect1.2.html
    <absolute path>/detailedDescription/cloze/4SubSect2.1.html
    <absolute path>/detailedDescription/cloze/4SubSect2.2.html
    <absolute path>/detailedDescription/cloze/4SubSect2.3.html
    ... 

## output 

<absolute path>/detailedDescription/eng/<original filename without extension>SubSect<sub section index>.html
    
example: 
    <absolute path>/detailedDescription/eng/4SubSect1.1.html
    <absolute path>/detailedDescription/eng/4SubSect1.2.html
    <absolute path>/detailedDescription/eng/4SubSect2.1.html
    <absolute path>/detailedDescription/eng/4SubSect2.2.html
    <absolute path>/detailedDescription/eng/4SubSect2.3.html
    ... 

# Final report format

completed: [実行したタスクの1行要約]
path: 
- [変更したファイルのパス]
- [変更したファイルのパス]
変更内容要約:
- [変更1: 何をどう変更したか]
- [変更2: ...]
（3-15行）
例外事態:
- [発生した問題と対処]
（最大5行、なければ「なし」）

```


### Step import: セクション統合・検証・Anki import

**あなたはコンテキストを抑えるため `anki-card-python-addnotes` を見てはいけない。** SubAgent (@haiku) に以下の指示をする。

```md

# Task

4つのパス に対して、 /anki-card-python-addnotes (skills/anki-card-python-addnotes/SKILL.md) を実行する。

実行中にファイルの不足や違うファイルの参照要求、ファイルの形式不正があった場合は、親エージェントに正しいファイル名の指定や正しい形式の確認を再度要請する。

## output anki deck

<Anki deck name here>

## inputPaths

**mapping**

<absolute path>/mapping/<original filename without extension>.json: 各 detaileddescription に関連する highYieldSummary マッピング

**detailedDescription**

<absolute path>/detailedDescription/eng/<original filename without extension>SubSect<sub section index>.html
    
example: 
    <absolute path>/detailedDescription/eng/4SubSect1.1.html
    <absolute path>/detailedDescription/eng/4SubSect1.2.html
    <absolute path>/detailedDescription/eng/4SubSect2.1.html
    <absolute path>/detailedDescription/eng/4SubSect2.2.html
    <absolute path>/detailedDescription/eng/4SubSect2.3.html
    ... 

**highYieldSummary**

<absolute path>/highYieldSummary/<original filename without extension>Sect<section index>.html (multiple)

example: 
    <absolute path>/highYieldSummary/3Sect1.html
    <absolute path>/highYieldSummary/3Sect2.html
    <absolute path>/highYieldSummary/3Sect3.html
    ... 

**visualAids**

<absolute path>/visualAids/<original filename without extension>Sect<section index>.html (multiple)

example: 
    <absolute path>/visualAids/3Sect1.html
    <absolute path>/visualAids/3Sect2.html
    <absolute path>/visualAids/3Sect3.html
    ... 


## outputs

<absolute path>/notes/<original filename without extension>.json

Anki への import

# Final report format

``md
completed: [実行したタスクの1行要約]
path: 
- [変更したファイルのパス]
- [変更したファイルのパス]
変更内容要約:
- [変更1: 何をどう変更したか]
- [変更2: ...]
（3-15行）
例外事態:
- [発生した問題と対処]
（最大5行、なければ「なし」）
``

```
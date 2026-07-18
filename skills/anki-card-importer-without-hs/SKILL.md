---
name: anki-card-importer-without-hs
description: null
---

# Task

以下のワークフローを順次実行し、高品質な医学Ankiカードを生成する.
長大な処理だが、時間をかけて省略せずに実行すること.

## Subagent

- サブエージェントの使用はこのスキルやこのスキルが参照する他のスキルで明記された場合のみに限る.
- 使用するサブエージェントはSKILLの指示に忠実に従う.指定がない場合は @haiku を使用する.
- Subagent には、 @haiku, @haiku-notool, @sonnet, @sonnet-notool がある.このスキルで指定されたサブエージェントを用いる.
- サブエージェントからの応答がない場合は、errorで異常終了した可能性が高いので、1回まで新たなサブエージェントで再試行する.
- サブエージェントへのファイルパスの指示はすべて絶対パスで行う.


## コンテキスト管理

本ワークフローは長大 (20ステップ以上) であり、コンテキスト溢れのリスクがある.以下を遵守する.

1. **サブエージェントスキルファイルを読まない**: 各ステップで「コンテキストを抑えるため〜を見てはいけない」と記載されたスキルファイルは、メインエージェントが読むことなくサブエージェントに委譲する.
2. **中間ファイルの再読み込み回避**: 生成済みの JSON/MD ファイルを後続ステップで再読み込みしない.必要最小限の情報 (件数、キー名) のみ `uv run python` で確認する.

禁止事項: カード内容の全量出力、JSONの生データ出力、変更対象の全リスト出力.ファイルに書き込む内容は返答に含めず、ファイルパスのみ記載すること.

## CoT

### Step: Create tasks

**Use the `TaskCreateTool` to create tasks for each of the following steps. (like ### xxx, #### xxxx, #### xxxx, ...)**

### Step: 入力の確認

ユーザーが指定した working directory, original filename をもとに、ファイルの存在を確認する.未提示の場合は処理を進めず、入力を要求する.

このSKILLで必要となるファイルの存在を、すべて、処理前に確認する.

ここで以下を定義する.

- <original filename (without extension)>: ユーザーの指定したファイル名から拡張子を除いたもの.
- <absolute path>: ユーザーの指定したWorking directory.指定がない場合はユーザーに必ず質問する.


### Step D2: detailedDescription の cloze 追加 (subagent) 

あなたはコンテキストを削減するため、関連 SKILL を読んではいけない. SubAgent **(@haiku-notool)** に要約せずにそのまま, 以下の指示をする.

`````md
# Task

与えられた HTML  (roughな {{cX::}} 指定付き) を、以下のルールに従って Anki のCloze形式 HTML に変換する. 

# Regulations

input file を上書きしてはならない. 
sub agent の使用は禁止する. 

# CoT

## 指定されたファイルを読み込む.

## 章立てルール準拠

以下の条件を満たすように修正を行う. MUST の要件は、厳格に遵守する. 少しでも逸脱が見られた場合は修正する.

MUST

- /html-formatter (skills/html-formatter/SKILL.md)

SHOULD

- /text-formatter-structuring (skills/text-formatter-structuring/SKILL.md)

## cloze process

Quality criteria の記述に基づき、 cloze process を行う. 


## sub section ごとに分割して HTML を保存

sub section ごとに分割して HTML を保存する. 指定パスに指定ファイル名で保存する. section ごとではなく、 sub section ごとである. 
各ファイルには上位の section title, sub section title を両方とも含める. 

- e.g. : <h1>2. xxxxx </h1> <h2>2.3 xxxxx </h2>
- skill: /text-formatter-structuring (skills/text-formatter-structuring/SKILL.md)

---

# input

<absolute path>/detailedDescription/<original filename without extension>.html

structure: 各セクション内にroughな {{cX::}} が存在. rough な Cloze 指定とは「大雑把に {{cX::}} で囲まれている」状態. 同一セクション内の同一概念が ばらばらのc番号を持っていたり、英語表記がなかったり、カッコ内が一体化していたりする. 本手順で正規化する.

# Quality criteria

## 前提条件

対象範囲: 指定されたファイルすべて
元のc番号を維持するか、振り直すか？ --> 元の番号を極力維持
以前のセクションで出現した概念を後続セクションで穴埋めにするか？ --> 穴埋めにしない. 本文のまま.
出力形式: /html-formatter (skills/html-formatter/SKILL.md) に準拠 (MUST)
違う概念が同一 index の cloze で囲まれている --> 意図的に　grouping したものであり、異常事態ではない. 

## Step cloze process

以下のサブステップを各セクションに対して実行する. 以前のセクションの内容は保持しない

### c番号の確認とグループ化

#### **CoT**

1. セクション内の既存 cloze {{cX::}} を全て列挙 (SHOULD)
2. 上から下へ読み進め、同一概念 (同じ単語・略語・推論可能な項目) が再登場した場合、同じc番号を割り振る (MUST)
3. 見出しもグループ化の対象に含める (MUST)
4. 元のc番号を極力維持する (既存番号の再利用優先)  (COULD)

#### **グループ化の判定フロー**

テキストを上から読み進める
├─ {{cX::}} で囲まれた概念を記録 (c番号、概念名) 
├─ 後続のテキストで同一概念が出現
│  ├─ 同一セクション内 → 同じc番号で {{cX::}} を追加
│  └─ 異なるセクション → 穴埋めにしない (本文のまま) 
└─ {{cX::}} で囲まれていないが推論可能な概念
   └─ 同一セクション内 → {{cX::}} を追加してグループ化

#### **同一概念グループ化の判定基準**

同一セクション内で同一概念 (MUST)
- 同じc番号: {{c1::β1受容体}} がSection内に3回登場 → 全て {{c1::β1受容体}}

略語と正式名称の再登場 → 同じc番号 (MUST)
- {{c3::GABA_A Receptor}} と後続の GABA_A → {{c3::GABA_A}} に変更

異なるセクション → グループ化しない (MUST)
- §1の {{c3::肥大}} と§3の 肥大 → §3では穴埋めにしない

推測可能な文脈 → グループ化が必要 (SHOULD)
- NG: 「抗コリン薬は {{c1::抗コリン作用}} を持ち」→ OK: 「{{c1::抗コリン薬}} は {{c1::抗コリン作用}} を持ち」

検証ポイント (COULD)
- 「この穴埋めを隠したとき、前後の文脈から答えが推測可能か？」を各clozeに対して確認する. 推測可能な場合、文脈も含めてclozeに含める.

#### **グループ化の対象**

MUST
- 同一の専門用語 (例: 「β1受容体」が複数回出現) 
- 略語とその正式名称 (例: 「GABA_A Receptor」と「GABA_A」) 
- 見出しに含まれる概念も対象

SHOULD
- 推論可能な関連概念 (例: 「抗コリン薬」と「抗コリン作用」と「アセチルコリン」) 

#### カッコ分割

**ルール**

{{cX::}} の内部に丸カッコ () が入っていた場合、カッコの前後で分割する. 角カッコ [] は分割不要. 

**変換例**

変換前: {{cX::腸上皮化成 (バレット食道) }}
変換後: {{cX::腸上皮化成}} ({{cX::バレット食道}}) 
意図: カッコ内の補足情報と本体を別々にcloze化することで、カードの粒度を適切にする. カッコ内の情報は「補足」として独立して隠せる.
カッコの内側に cloze を入れる. 

- カッコが複数ある場合、全て分割する: {{cX::A (B)  (C) }} → {{cX::A}} ({{cX::B}})  ({{cX::C}}) 
- 分割後、各部分に独立して英語表記ルールを適用

#### 跨セクションの処理

以前のセクション (§1〜§N-1) で既に {{cX::}} として出現した概念は、§Nでは穴埋めにしない (本文テキストのまま残す) . 同一セクション内で初めて出現する概念のみを {{cX::}} で囲む. このルールは「以前のセクションでcloze化された概念」にのみ適用される.以前のセクションでcloze化されていなかった概念 (本文のままだった専門用語など) は、現在のセクションで初めてcloze化してもよい.

#### 英語表記の追加

{{cX::}} の内部のみに英語表記を適用する. 外の本文テキストは元のまま変更しない.

cloze は全部分、英語表記の追加対象である. cloze の中身がいくら長くても短くても、文であったとしても追加対象となる.

**パターン1: 専門用語 (はじめて出現) **
{{cX:: <ruby>English <rt>日本語 </ruby>}}
例: 一つ一つの細胞自身のサイズを大きくする「{{c5::肥大}}」 → 一つ一つの細胞自身のサイズを大きくする「{{c5:: <ruby>Hypertrophy <rt>肥大 </rt> </ruby>}}」

**パターン2: 略語 (同一セクション内で初出) **
{{cX:: <ruby>略称: 英語正式名称 <rt>日本語 </ruby>}}
例: {{c33::RCD}} → {{c33:: <ruby>RCD: Regulated Cell Death <rt>多様な制御性細胞死 </rt> </ruby>}}

**パターン3: 専門用語 (専門用語) **
{{cX:: <ruby>English1 <rt>日本語1 </rt> </ruby>}} ({{cX::<ruby>English2 <rt>日本語2 </rt> </ruby>}})
例: {{c4::腸上皮化生 (バレット食道) }} → {{c4:: <ruby>Intestinal Metaplasia <rt>腸上皮化生 </rt> </ruby>}} ({{c4:: <ruby>Barrett's Esophagus <rt>バレット食道 </rt> </ruby>}})

# output

以下の形式で複数ファイル (sub section の数だけ) 保存する. sub section index は 1.1, 1.2,..., 2.1, 2.2, 2.3,..., 3.1,... のような <section number>.<subsection number> の連番であること.
ファイル名は sub section index と対応していなければならない. sub section index が規定に従っていなかった場合は、規定に従って振り直す.

<absolute path>/detailedDescription/cloze/<original filename without extension>SubSect<sub section index>.html

example: 
    <absolute path>/detailedDescription/cloze/4SubSect1.1.html
    <absolute path>/detailedDescription/cloze/4SubSect1.2.html
    <absolute path>/detailedDescription/cloze/4SubSect2.1.html
    <absolute path>/detailedDescription/cloze/4SubSect2.2.html
    <absolute path>/detailedDescription/cloze/4SubSect2.3.html
    ... 

# Final report format

completed: [実行したタスクの1行要約]
path: 
- [変更したファイルのパス]
- [変更したファイルのパス]
変更内容要約:
- [変更1: 何をどう変更したか]
- [変更2: ...]
 (3-15行) 
例外事態:
- [発生した問題と対処]
 (最大5行、なければ「なし」) 

`````

---

### 以下の step V1, D3 は、sub agent を用いて並列に行う. 


#### Step V1: visualAids を生成 (subagent) 

**あなたはコンテキストを抑えるため `/anki-card-formatter-visualaids` を見てはいけない.** SubAgent(@haiku-notool) に要約せずにそのまま, 以下の指示をする.

```md
# Task
以下の指示を実行する.実行中に不測の事態があった場合は実行後に詳細に報告する.1回でもbashやpowershellでエラーを起こしたり、マニュアルに書いていない例外が起きた場合は報告し次に生かす.

/anki-card-formatter-visualaids を使って処理を行う ("skills/anki-card-formatter-visualaids/SKILL.md"). 

各インプットファイルの内容を各アウトプットファイルに対応させる.<absolute path>/highYieldSummary/3Sect3.html にある内容Aが書いてあったら、<absolute path>/visualAids/3Sect3.html に内容Aをもとに生成した結果を書き込む.内容Bを書き込んではいけない.

input file を上書きしてはならない. 

## input

ファイルの存在を確認する.ファイルの中身は必要になったら読む.

**detailedDescription**

<absolute path>/detailedDescription/cloze/<original filename without extension>SubSect<sub section index>.html
    
example: 
    <absolute path>/detailedDescription/cloze/4SubSect1.1.html
    <absolute path>/detailedDescription/cloze/4SubSect1.2.html
    <absolute path>/detailedDescription/cloze/4SubSect2.1.html
    <absolute path>/detailedDescription/cloze/4SubSect2.2.html
    <absolute path>/detailedDescription/cloze/4SubSect2.3.html
    ... 

### outputPath
<absolute path>/visualAids/<original filename without extension>SubSect<sub section index>.html (multiple)

example: 
    <absolute path>/visualAids/4SubSect1.1.html
    <absolute path>/visualAids/4SubSect1.2.html
    <absolute path>/visualAids/4SubSect2.1.html
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
 (3-15行) 
例外事態:
- [発生した問題と対処]
 (最大5行、なければ「なし」) 
``

```


#### Step D3. detailedDescription への2か国語併記

sub agent (@haiku-notool) に以下の指示を, 要約せずにそのまま与えて back ground で実行する.

1つのサブエージェントへの入力 HTML ファイルが 10個を超えてはいけない. (精度が低下するため.) 10 個以上のファイルがある場合は、2つ か 3つの sub agent に分けて 指示を出す. すべての sub agent は、 @haiku-notool を用いる.

`````md

# Task

以下のパス に対して、 /anki-card-formatter-eng (skills/anki-card-formatter-eng/SKILL.md) を実行する.

level は, lv.4 (Type A - D まで) にする.

# Additional regulations

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
 (3-15行) 
例外事態:
- [発生した問題と対処]
 (最大5行、なければ「なし」) 

`````

### Step import: セクション統合・検証・Anki import

**あなたはコンテキストを抑えるため `anki-card-python-addnotes` を見てはいけない.** SubAgent (@haiku) に以下の指示をする.

```md

# Task

以下のパス に対して、 /anki-card-python-addnotes (skills/anki-card-python-addnotes/SKILL.md) を実行する.

実行中にファイルの不足や違うファイルの参照要求、ファイルの形式不正があった場合は、親エージェントに正しいファイル名の指定や正しい形式の確認を再度要請する.

ノートのレベルは, <insert level here> にする.

## output anki deck

<Anki deck name here>

## inputPaths

**mapping**

今回は存在しない.visualAids の sub section index は、 detailedDescription の sub section index に各々が対応している.

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

今回は存在しない.

**visualAids**

今回は、 detailedDescription の sub section index に各々の sub section が対応している.

<absolute path>/visualAids/<original filename without extension>SubSect<sub section index>.html (multiple)

example: 
    <absolute path>/visualAids/4SubSect1.1.html
    <absolute path>/visualAids/4SubSect1.2.html
    <absolute path>/visualAids/4SubSect2.1.html
    ... 


## outputs

<absolute path>/notes/<original filename without extension>.json: Anki への import JSON

Anki 内の decks

# Final report format

``md
completed: [実行したタスクの1行要約]
path: 
- [変更したファイルのパス]
- [変更したファイルのパス]
変更内容要約:
- [変更1: 何をどう変更したか]
- [変更2: ...]
 (3-15行) 
例外事態:
- [発生した問題と対処]
 (最大5行、なければ「なし」) 
``

```
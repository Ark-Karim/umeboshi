---
name: anki-card-generator
description: null
---

# Task
以下のワークフローを順次実行. 

## Subagent

- サブエージェントの使用はこのスキルやこのスキルが参照する他のスキルで明記された場合のみに限る。
- 使用するサブエージェントはSKILLの指示に忠実に従う。指定がない場合は @haiku を使用する。
- Subagent には、 @haiku, @haiku-notool, @sonnet, @sonnet-notool がある。このスキルで指定されたサブエージェントを用いる。
- サブエージェントからの応答がない場合は、errorで異常終了した可能性が高いので、1回まで新たなサブエージェントで再試行する。この際、同じサブエージェントのモデルを用いる。


## コンテキスト管理

本ワークフローは長大であり、コンテキスト溢れのリスクがある。以下を遵守する。

1. **サブエージェントスキルファイルを読まない**: 各ステップで「コンテキストを抑えるため〜を見てはいけない」と記載されたスキルファイルは、メインエージェントが読むことなくサブエージェントに委譲する。
2. **中間ファイルの再読み込み回避**: 生成済みの JSON/MD ファイルを後続ステップで再読み込みしない。必要最小限の情報（件数、キー名）のみ `uv run python` で確認する。

禁止事項: カード内容の全量出力、JSONの生データ出力、変更対象の全リスト出力。ファイルに書き込む内容は返答に含めず、ファイルパスのみ記載すること。

## CoT

### Step: Create tasks

Use the `TaskCreateTool` to create tasks for each of the following steps. (like ### xxx, #### xxxx, #### xxxx, ...)

### Step: 入力の確認

ユーザーが指定したファイルの存在を確認する。未提示の場合は処理を進めず、入力を要求する。サブエージェントへのファイルパスの指示はすべて絶対パスで行う。

ここで以下を定義する。
- <original filename (without extension)>: ユーザーの指定したファイル名から拡張子を除いたもの
- <absolute path>: ユーザーの指定したWorking directory。指定がない場合はユーザーに必ず質問する。

```
Glob: <absolute path>/<通常はScript, 例外もあるためユーザーの指定を優先>/<original filename (without extension)>.<extension>
```

音声の場合は文字おこしする。テキストファイルを、<absolute path>/text/<original filename (without extension)>.txt に保存する。

PDFの場合はテキストに変換する。テキストファイルを、<absolute path>/text/<original filename (without extension)>.txt に保存する。

```bash
uv run --with pypdf python -c "
import pypdf
reader = pypdf.PdfReader('C:/Users/chiba/StudySpace/Public Health/slides/12.pdf')
with open('C:/Users/chiba/StudySpace/Public Health/slides/12_extracted.txt', 'w', encoding='utf-8') as f:
    f.write(f'Pages: {len(reader.pages)}\n')
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text.strip():
            f.write(f'--- Page {i+1} ---\n')
            f.write(text + '\n')
"
```

#### Step Excute: detailedDescription, highYieldSummary の生成（subagent）

あなたはコンテキストを抑えるため `anki-card-formatter-excute` を見てはいけない。SubAgent(@sonnet) に以下の指示をする。

    ```md
    # Task
    以下の指示を実行する。実行中に不測の事態があった場合は実行後に詳細に報告する。1回でもbashやpowershellでエラーを起こしたり、マニュアルに書いていない例外が起きた場合は報告し次に生かす。

    /anki-card-formatter-excute (skills/anki-card-formatter-excute/SKILL.md)を使って処理を行う

    ## input
    <absolute path>/<Script, slidesText or ユーザーの指定した場所>/<original filename without extension>.text (md も可)

    ## output
    <absolute path>/detailedDescription/<original filename without extension>.html: detailedDescription

    <absolute path>/highYieldSummary/<original filename without extension>.html: highYieldSummary

    <absolute path>/mapping/<original filename without extension>.json: 各 detaileddescription に関連する highYieldSummary マッピング
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

### Step. 完了報告

完了報告を行う。次の処理には進まない。
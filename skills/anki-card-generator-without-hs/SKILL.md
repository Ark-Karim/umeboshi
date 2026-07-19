---
name: anki-card-generator-without-hs
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

### Step: プラグイン検出

`plugins/registry.json` を読み込み、アクティブなプラグインを特定する。

```json
// plugins/registry.json の backends.<type>.active を参照
```

各バックエンドタイプとスキルの対応:

| バックエンド | アクティブプラグイン | 対応スキル |
|------------|-------------------|-----------|
| transcribe | `<active>` | `plugins/transcribe/<active>/SKILL.md` |
| generate | `<active>` | `plugins/generate/<active>/SKILL.md` |
| import | `<active>` | `plugins/import/<active>/SKILL.md` |

文字起こしが必要な場合、アクティブな transcribe プラグインの SKILL.md を読み、その指示に従う。
デフォルト: `local-whisper` → `plugins/transcribe/local-whisper/SKILL.md` に従う。

### Step: 入力の確認

ユーザーが指定したファイルの存在を確認する。未提示の場合は処理を進めず、入力を要求する。サブエージェントへのファイルパスの指示はすべて絶対パスで行う。

ここで以下を定義する。
- <original filename (without extension)>: ユーザーの指定したファイル名から拡張子を除いたもの
- <absolute path>: ユーザーの指定したWorking directory。指定がない場合はユーザーに必ず質問する。

```
Glob: <absolute path>/<通常はScript, 例外もあるためユーザーの指定を優先>/<original filename (without extension)>.<extension>
```

音声の場合は文字おこしする。**アクティブな transcribe プラグインの SKILL.md に従う。** テキストファイルを、<absolute path>/Script/<original filename (without extension)>.txt に保存する。

PDFの場合はテキストに変換する。テキストファイルを、<absolute path>/script/<original filename (without extension)>.txt に保存する。

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

#### Step Excute: detailedDescription の生成（subagent）

あなたはコンテキストを抑えるため 以下の指示の関連スキル を見てはいけない。SubAgent(@sonnet) に 一言一句そのまま 以下の指示をする。出力ファイルなどは SKILL に記載されているのであなたは指定してはいけない.

`````md

# Task

以下のワークフローを逐次的に実行し、高品質な医学Ankiカードを生成する。長大な処理だが、時間をかけて省略せずに実行すること。日本語で作成する。

## Regulations

指定されたスキル以外を読んではいけない。
sub agent を使ってはいけない。

## detaileddescription を作成

/anki-card-formatter-detaileddescription （skills/anki-card-formatter-detaileddescription/SKILL.md）
のフローに従い作成。指定ファイル名として保存。

sub agent を使ってはいけない。

# Input files

Script or textbook: <absolute path>
Working directory: <abslute path>

`````

### Step. 完了報告

完了報告を行う。次の処理には進まない。
---
name: anki-card-generator-without-hs
description: null
---

# Task

Execute the following workflow sequentially.
<!-- （以下のワークフローを順次実行する。） -->

## Requirements (MUST / NEVER / SHOULD / COULD)

### MUST

- Execute the workflow sequentially.
<!-- （ワークフローを順次実行すること。） -->
- Use subagents only when explicitly specified by this skill or other skills referenced by this skill.
<!-- （サブエージェントの使用は、このスキルまたはこのスキルが参照する他のスキルで明記された場合のみに限る。） -->
- Follow the subagent's SKILL instructions faithfully.
<!-- （サブエージェントのSKILLの指示に忠実に従うこと。） -->
- Use the subagent model specified by this skill (@haiku, @haiku-notool, @sonnet, @sonnet-notool).
<!-- （このスキルで指定されたサブエージェントモデルを使用すること。） -->
- Retry once with a new subagent of the same model if no response is received (likely crashed).
<!-- （サブエージェントからの応答がない場合は、同じモデルで1回まで再試行すること。） -->
- Do NOT read subagent skill files from the main agent. When a step instructs "do not read X to conserve context," delegate to the subagent without the main agent reading the skill file.
<!-- （メインエージェントでサブエージェントのスキルファイルを読まないこと。「コンテキストを抑えるため〜を見てはいけない」と記載されている場合は、読まずにサブエージェントに委譲すること。） -->
- Do NOT re-read intermediate JSON/MD files in subsequent steps. Use `uv run python` only for minimal checks (counts, key names).
<!-- （後続ステップで中間JSON/MDファイルを再読み込みしないこと。件数やキー名などの最小限の確認のみ uv run python で行うこと。） -->
- Use absolute paths for all file path instructions to subagents.
<!-- （サブエージェントへのファイルパス指示はすべて絶対パスで行うこと。） -->
- Do NOT read the skills referenced in the subagent instruction block (to conserve context). Pass subagent instructions verbatim. Do NOT specify output files — the SKILL already defines them.
<!-- （コンテキスト節約のため、サブエージェント指示ブロック内で参照されるスキルを読んではいけない。指示を一言一句そのまま渡し、出力ファイルは指定しないこと。） -->

### NEVER

- Output full card content.
<!-- （カード内容の全量を出力しないこと。） -->
- Output raw JSON data.
<!-- （JSONの生データを出力しないこと。） -->
- Output a full list of changes.
<!-- （変更対象の全リストを出力しないこと。） -->
- Include file contents in agent responses. Mention file paths only.
<!-- （ファイルの内容を返答に含めないこと。ファイルパスのみ記載すること。） -->

### SHOULD

- Use @haiku when no specific subagent is specified.
<!-- （サブエージェントの指定がない場合は @haiku を使用すること。） -->

## Chain of Thought

### 1. Create tasks

Use the `TaskCreateTool` to create tasks for each of the following steps (e.g. ### xxx, #### xxxx, #### xxxx, ...).
<!-- （TaskCreateTool を使用して、以下の各ステップのタスクを作成する。） -->

### 2. Plugin Detection

Read `plugins/registry.json` to identify active plugins.
<!-- （plugins/registry.json を読み込み、アクティブなプラグインを特定する。） -->

```json
// plugins/registry.json の backends.<type>.active を参照
```

Correspondence between backend types and skills:
<!-- （各バックエンドタイプとスキルの対応：） -->

| Backend | Active Plugin | Corresponding Skill |
|---------|--------------|---------------------|
| transcribe | `<active>` | `plugins/transcribe/<active>/SKILL.md` |
| generate | `<active>` | `plugins/generate/<active>/SKILL.md` |
| import | `<active>` | `plugins/import/<active>/SKILL.md` |

If transcription is needed, read the active transcribe plugin's SKILL.md and follow its instructions.
Default: `local-whisper` → Follow `plugins/transcribe/local-whisper/SKILL.md`.
<!-- （文字起こしが必要な場合、アクティブな transcribe プラグインの SKILL.md を読み、その指示に従う。デフォルトは local-whisper。） -->

### 3. Input Verification

Verify the user-specified file exists. If not provided, halt and request input. All file path instructions to subagents must use absolute paths.
<!-- （ユーザーが指定したファイルの存在を確認する。未提示の場合は処理を進めず、入力を要求する。サブエージェントへのファイルパス指示はすべて絶対パスで行う。） -->

Define the following:
<!-- （以下を定義する：） -->

- `<original filename (without extension)>`: The user-specified filename with the extension removed.
<!-- （ユーザー指定のファイル名から拡張子を除いたもの。） -->
- `<absolute path>`: The user-specified working directory. If not specified, the user must be asked.
<!-- （ユーザー指定の作業ディレクトリ。指定がない場合はユーザーに質問すること。） -->

```
Glob: <absolute path>/<通常はScript, 例外もあるためユーザーの指定を優先>/<original filename (without extension)>.<extension>
```

For audio: transcribe. Follow the active transcribe plugin's SKILL.md. Save the text file to `<absolute path>/Script/<original filename (without extension)>.txt`.
<!-- （音声の場合：文字起こしする。アクティブな transcribe プラグインの SKILL.md に従う。テキストファイルを保存する。） -->

For PDF: extract text. Save the text file to `<absolute path>/script/<original filename (without extension)>.txt`.
<!-- （PDFの場合：テキストを抽出する。テキストファイルを保存する。） -->

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

### 4. detailedDescription Generation (subagent)

To conserve context, you must NOT read the skills referenced in the instructions below. Pass the following instructions verbatim to SubAgent(@sonnet). Do NOT specify output files — the SKILL already defines them.
<!-- （コンテキストを抑えるため、以下の指示の関連スキルを見てはいけない。SubAgent(@sonnet) に以下の指示を一言一句そのまま渡すこと。出力ファイルなどは SKILL に記載されているので指定してはいけない。） -->

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

### 5. Completion Report

Issue a completion report. Do not proceed to the next task.
<!-- （完了報告を行う。次の処理には進まない。） -->

## Subagent Rules

- Use subagents only when explicitly specified by this skill or other skills referenced by this skill.
<!-- （サブエージェントの使用は、このスキルやこのスキルが参照する他のスキルで明記された場合のみに限る。） -->
- Follow the subagent's SKILL instructions faithfully. Use @haiku when no specific agent is specified.
<!-- （使用するサブエージェントはSKILLの指示に忠実に従う。指定がない場合は @haiku を使用する。） -->
- Available subagents: @haiku, @haiku-notool, @sonnet, @sonnet-notool. Use the subagent model specified by this skill.
<!-- （利用可能なサブエージェント：@haiku, @haiku-notool, @sonnet, @sonnet-notool。このスキルで指定されたモデルを用いること。） -->
- If no response from a subagent, it likely crashed. Retry once with a new subagent of the same model.
<!-- （サブエージェントからの応答がない場合はエラーで異常終了した可能性が高いので、同じモデルで1回まで再試行する。） -->

## Context Management Rules

This workflow is extensive and carries risk of context overflow. Observe the following:
<!-- （本ワークフローは長大であり、コンテキスト溢れのリスクがある。以下を遵守する。） -->

1. **Do not read subagent skill files**: When a step instructs "do not read X to conserve context," delegate to the subagent without the main agent reading the skill file.
<!-- （サブエージェントスキルファイルを読まない：「コンテキストを抑えるため〜を見てはいけない」と記載されている場合、メインエージェントが読むことなくサブエージェントに委譲する。） -->
2. **Avoid re-reading intermediate files**: Do not re-read generated JSON/MD files in subsequent steps. Use `uv run python` only for minimal checks (counts, key names).
<!-- （中間ファイルの再読み込み回避：生成済みのJSON/MDファイルを後続ステップで再読み込みしない。必要最小限の情報のみ uv run python で確認する。） -->

**Prohibited**: Full card content output, raw JSON data output, full list of changes. Do not include file contents in responses — mention file paths only.
<!-- （禁止事項：カード内容の全量出力、JSONの生データ出力、変更対象の全リスト出力。ファイルに書き込む内容は返答に含めず、ファイルパスのみ記載すること。） -->

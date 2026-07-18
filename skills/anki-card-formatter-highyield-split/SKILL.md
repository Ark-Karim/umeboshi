---
name: anki-card-formatter-highyield-split
description: null
---

# Task

以下の指示を逐一実行する。最後の指示の highYieldSummary キーについて、分割や統合によって生じた変更を、修正箇所・削除箇所・新規追加箇所をEdit, 上書き保存（最も重要）を必ず行う。

### Step: highYieldSummaryの読み込み

指定されたhighYieldSummaryファイルを読み込む。

### Step: 章立てルール準拠
1つのSectionが 400字〜1100字 以内に収まっているか検証。満たしていない場合は Subagent 内で章を分割・統合して修正する。例えば 1300 字であれば、700字のセクションと600字のセクションに分ける。
分割・統合時も連番になるように保つ。§4を分割した場合は§5以降の番号を一つ後ろにずらし、1からセクション番号が連続に数字で続くようにする。`4-A`などの連番でない番号を付けてはいけない。

この際、entity density の検証を行う必要はない。

```bash
uv run python -c "
import sys
import re
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def count_sections(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    sections = []
    current_section = "Initial"
    current_count = 0

    for line in lines:
        if re.match(r'^# §', line):
            if current_count > 0 or current_section != "Initial":
                sections.append((current_section, current_count))
            current_section = line.strip()
            current_count = 0
        else:
            current_count += len(line)

    sections.append((current_section, current_count))
    return sections

if __name__ == "__main__":
    filepath = sys.argv[1]
    sections = count_sections(filepath)
    print(f"{'Section':<50} {'Length':<10}")
    print("-" * 60)
    for section, length in sections:
        print(f"{section:<50} {length:<10}")
"
```

### Step: chart 書式準拠

表・コードブロックのスタイルを /text-formatter-chart （skills/text-formatter-chart/SKILL.md）の書式ルールに準拠するように修正・書き換える。

```powershell
# 1. バッククォート（`）で囲まれたコードブロック/インラインコードの抽出
Select-String -Path "input.md" -Pattern '`{1,4}[^`\n]+`{1,4}' -AllMatches | ForEach-Object { $_.Matches.Value }

# 2. Markdown形式の表（| で区切られた行）の抽出
Select-String -Path "input.md" -Pattern '^\s*\|.*\|'
```

### Step MDに分割

分割したMDファイルは指定ファイルとして保存する。
PowerShellの正規表現はUnicode文字（§等）のマッチングが不安定なため、Python を使用する。

```bash
PYTHONIOENCODING=utf-8 uv run python -c "
import sys, os, re

input_path = sys.argv[1]

if not os.path.isfile(input_path):
    print(f'File not found: {input_path}', file=sys.stderr)
    sys.exit(1)

base_name = os.path.splitext(os.path.basename(input_path))[0]
# Parent of highYieldSummary directory
parent_dir = os.path.dirname(os.path.dirname(input_path))
target_dir = os.path.join(parent_dir, 'highYieldSummarySectMd')
os.makedirs(target_dir, exist_ok=True)

with open(input_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

section_regex = re.compile(r'^#\s+§\s*\d+')
current_section_lines = []
section_number = 0

def save_section(lines, number):
    if lines and number > 0:
        out_path = os.path.join(target_dir, f'{base_name}Sect{number}.md')
        with open(out_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)

for line in lines:
    if section_regex.match(line):
        save_section(current_section_lines, section_number)
        section_number += 1
        current_section_lines = []
    current_section_lines.append(line)

save_section(current_section_lines, section_number)

heading_count = sum(1 for line in lines if section_regex.match(line))
if heading_count != section_number:
    print(f'ERROR: § headings found: {heading_count}, sections generated: {section_number}')
    sys.exit(1)

print(f'Split into {section_number} sections in {target_dir}')
" "<inputPath>"
```

### Step 出力確認

以下を確認する:

- 出力先ディレクトリに <absolute path>/highYieldSummarySect/<original filename without extension>Sect<section number>.md  が生成されていること。
- エラーが出た場合はファイルパスおよびファイル内の見出し構造（# §番号）を確認して修正する。
- Pythonスクリプトは `§`（U+00A7）を正しく処理する。PowerShell正規表現では文字化けの原因となるため使用しない。

### Step HTML へのレンダリング

/anki-card-formatter-html を使用し、highYieldSummary の内容を HTML に変換する。

レンダリングしたファイルは指定ファイルとして保存する。

### highYieldSummary キーについて、分割や統合によって生じた変更を、修正箇所・削除箇所・新規追加箇所をEdit, 上書き保存（最も重要）

highYieldSummary の変更によって、qa ファイルに記載されている highYieldSummary キーがずれることが予想される。その場合、キーを必ず修正する。
§2 を §2, 3 に分割した場合、§2 のキーを §2, 3 に問題ごとに割り当てなければならない。また同時に、§3, 4, 5, 以降のキーも一つ後ろにずれるため、割り当てなおさなければならない。

修正後に本当に修正が正しく行われているかを再度確認する。


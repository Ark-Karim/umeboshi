---
name: anki-card-python-addnotes
description: JSONからAnkiConnectでAnkiにカードをインポートするスキル。セクション統合・検証・インポートを一括処理。
---

## 補足指示: visualAids の割り振り

highYieldSummary の §N 参照と同じセクション番号に対応する visualAidsHtml を割り振る。

- <absolute path>/qaHaiku/<original filename (without extension)>.json から各カードの §N（例: "§2"）を取得
- その §N に対応する visualAidsHtml/<filename>SectN.html の中身を visualAids フィールドにセットする
- 例: カードの highYieldSummary が "§2" なら → visualAids には visualAidsHtml/<filename>Sect2.html の内容をセット

# 処理手順

## Step 0: AnkiConnect 接続確認

Ankiが起動していなかったり、AnkiConnectが無効だとインポートが全て失敗する。最初に確認することで、後工程の無駄を防ぐ。

```bash
python -c "
import json, urllib.request, sys

def anki_connect(action, params=None):
    request = json.dumps({'action': action, 'params': params or {}, 'version': 6}).encode('utf-8')
    response = urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:8765', request))
    return json.loads(response.read().decode('utf-8'))

try:
    result = anki_connect('version')
    print(f'AnkiConnect version: {result[\"result\"]}')
except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)
"
```

### フォールバック(Ankiを起動)

Launch anki

    ```bash
    "/c/Users/chiba/AppData/Local/Programs/Anki/anki.exe" &
    ```

## Step 1: デッキプレフィックスの決定

入力パス4（notes/）の親ディレクトリ名からデッキプレフィックスを導出する。
Ankiの既存デッキ構成から正しいプレフィックスを特定する。

```python
# path4 の例: "C:\Users\chiba\StudySpace\Pathology\ProblemPool_Eitaro\notes"
output_dir = Path(path4)
run_name = output_dir.parent.name  # "ProblemPool_Eitaro"

# 既存デッキ構成を確認してプレフィックスを決定
# 例: 既存に "Active::Public health::06" があれば、次の番号で "Active::Public health::07"
# 確認方法: anki_connect('deckDeckNames') で既存デッキ一覧を取得
deck_names = anki_connect('deckDeckNames')['result']
# run_name に対応するプレフィックスを特定（手動 or パターンマッチ）
deck_prefix = "<特定したプレフィックス>"  # 例: "Active::Public health::07"
```

## Step 4: detailedDescription の cloze 有無チェック

detailedDescription に cloze ({{cx::xxx}}) が含まれているもののみをインポート対象にする。cloze がないファイルはインポート対象から外す。

cloze がないノートをインポートするとエラーになる。

## Step 5: JSON結合

import 前の最終ファイルを、JSONにまとめる。

出力先: <absolute path>/notes/<original filename without extension>.json

JSONスキーマ

```json
[
  {
    "text": "<h2>1.2 xxx</h2>...",      // detailedDescription の HTML.
    "highYieldSummary": "<h1>1 xxx</h1>...",    // highYieldSummary の HTML. detailedDescription に対応する highYieldSummary を、mapping から取得する.
    "visualAids": "<h1>1</h1>...",              // visualAids の HTML. highYieldSummary の section index と visualAids section index は一致している.
    "umeboshiNoteId": "eitaro-...-sect1",       // UUID v7 の、各ノートに固有の一意のID
    "level": "easy",                   // サブデッキ分類用. import_to_anki.py が ::{level} サブデッキに分類. 指定がない場合, easy.
    "oneByOne": "y"                      // デフォルト "y"
  },
  ...
]
```

highYieldSummary, visualAids は、mapping をもとに対応ファイルを割り当てる。highYieldSummary, visualAids の index は対応している。（highYieldSummary から visualAids を作ったため。）

umeboshiNoteId は 各 note ごと（detailedDescription ごと）に、python で生成する。

```python
import json, sys, uuid, time, random
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

def uuid7():
    """Generate a UUID v7-like ID (time-ordered)."""
    ts_ms = int(time.time() * 1000)
    rand_bits = random.getrandbits(62)
    time_hex = format(ts_ms, '012x')
    rand_hex = format(rand_bits, '015x')
    raw = time_hex + rand_hex[:4] + '7' + rand_hex[4:7] + '8' + rand_hex[7:13]
    return f'{raw[:8]}-{raw[8:12]}-{raw[12:16]}-{raw[16:20]}-{raw[20:32]}'

base = Path(r'<absolute path>')

with open(base / 'mapping' / '1-2.json', 'r', encoding='utf-8') as f:
    mapping = json.load(f)

print(f'Mapping entries: {len(mapping)}')

dd_dir = base / 'detailedDescription'
hys_dir = base / 'highYieldSummary'
va_dir = base / 'visualAids'

cards = []
for entry in mapping:
    dd_idx = entry['detailedDescriptionIndex']
    hys_idx = entry['highYieldSummaryIndex']

    dd_file = dd_dir / f'1-2SubSect{dd_idx}.html'
    if not dd_file.exists():
        print(f'ERROR: {dd_file} not found', file=sys.stderr)
        sys.exit(1)
    with open(dd_file, 'r', encoding='utf-8') as f:
        dd_html = f.read()

    hys_file = hys_dir / f'1-2Sect{hys_idx}.html'
    if not hys_file.exists():
        print(f'ERROR: {hys_file} not found', file=sys.stderr)
        sys.exit(1)
    with open(hys_file, 'r', encoding='utf-8') as f:
        hys_html = f.read()

    va_file = va_dir / f'1-2Sect{hys_idx}.html'
    if not va_file.exists():
        print(f'WARNING: {va_file} not found, using empty string')
        va_html = ''
    else:
        with open(va_file, 'r', encoding='utf-8') as f:
            va_html = f.read()

    card = {
        'text': dd_html.replace("\n", ""),
        'highYieldSummary': hys_html.replace("\n", ""),
        'visualAids': va_html.replace("\n", ""),
        'umeboshiNoteId': uuid7(),
        'level': 'easy',
        'oneByOne': 'y'
    }
    cards.append(card)
    print(f'  [{dd_idx}] -> Sect{hys_idx}')

print(f'Total cards: {len(cards)}')

output = base / 'notes' / '1-2.json'
with open(output, 'w', encoding='utf-8') as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print(f'Written to: {output}')
```

## Step 6: 必須フィールドの検証

結合された JSON に 必須フィールド が含まれているか確認。ここでエラーがあった場合には、次のステップでインポートが正常に行われないため、必ずデフォルト値で補完する。

必須フィールド
- text
- umeboshiNoteId
- level
- oneByOne: default --> "y"


```bash
cd "<absolute path>" && python -c "
import json
with open('notes/<original filename without extension>.json', encoding='utf-8') as f:
    merged = json.load(f)

missing_index = [i for i, card in enumerate(merged) if '<field name>' not in card]
if missing_index:
    print(f'VALIDATION ERROR: {len(missing_index)} cards missing <field name>', flush=True)
    import sys; sys.exit(1)

print(f'Validation passed: {len(merged)} cards')
"
```


### Step 6: Ankiインポート

結合済み JSON を `import_to_anki.py` に渡す。

スクリプトの動作

- 内部で `level` フィールドによりグループ化し、デッキ `{deck_prefix}::{level}` にインポート.
- ノートタイプは umeboshiKaname 固定.
- 重複ノートは allowDuplicate: True でスキップ

```bash
python "C:/Users/chiba/.claude/skills/anki-card-python-addnotes/scripts/import_to_anki.py" "{merged_json_path}" "{deck_prefix}"
```

- `{merged_path}`: <absolute path>/notes/<original filename without extension>.json
- `{deck_prefix}`: インポート先デッキ名（ユーザー指定）

### Step 7: 検証

note id が適切な個数返却されるか確認。note id が適切な数返却されない場合、追加に失敗している. ノート重複エラーが出る時、実際にはノートが存在していない場合が多い。ノート枚数を取得して検証する。

```bash
cd "<absolute path>" && python -c "
import json, urllib.request

def anki_connect(action, params=None):
    request = json.dumps({'action': action, 'params': params or {}, 'version': 6}).encode('utf-8')
    response = urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:8765', request))
    return json.loads(response.read().decode('utf-8'))

result = anki_connect('findNotes', {'query': 'deck:\"{deck_prefix}::{level}\"'})
print(f'Notes in deck: {len(result[\"result\"])}')
"
```

### 結果報告

import_to_anki.py の出力をそのまま結果として返す:
- `created`: 新規作成件数
- `skipped`: 重複スキップ件数
- `failed`: 失敗件数

### 失敗時の対応

`failed > 0` の場合:
1. AnkiConnect の応答エラー → Anki が起動しているか確認
2. フィールド名の不一致 → `get_model_field_names.py` でノートタイプのフィールド名を確認
3. 重複ノート → 既存ノートの場合は `skipped` として正常（エラーではない）
4. 上記を修正後、Step 3 から再試行

## 重要なポイント

- **AnkiConnect の制限**: 大量ノートの同時インポートは不安定なため、`import_to_anki.py` でバッチ処理（<original filename without extension>0件ずつ）
- **MCP 不使用の理由**: ノート数が多いため、MCP 経由ではなく Python スクリプトで直接 AnkiConnect を呼び出し
- **§N 参照**: highYieldSummary・visualAids フィールドに `§N` 形式の参照がある場合、対応する HTML ファイルの内容に解決
- **レベル分類**: カードの `level` フィールド（veryEasy/easy/normal/...）により自動的にサブデッキに分類される

## 使用スクリプト

- `scripts/merge_sections.py` - §N 参照解決（highYieldSummary / visualAids 共用）
- `scripts/import_to_anki.py` - AnkiConnect による一括インポート
- `scripts/get_model_field_names.py` - ノートタイプのフィールド名取得（デバッグ用）

---
name: anki-card-python-addnotes
description: JSONからAnkiConnectでAnkiにカードをインポートするスキル。セクション統合・検証・インポートを一括処理。
---

## Requirements

**MUST**
- Verify AnkiConnect connectivity before any import attempt (Step 0). A dead connection means every subsequent step is wasted.
<!-- （AnkiConnectの接続をインポート前に必ず確認すること。接続が切れていると後続の全工程が無駄になる。） -->
- Determine the correct deck prefix from the existing Anki deck tree (Step 1). Guessing the prefix will route cards to the wrong deck.
<!-- （既存のAnkiデッキ構成から正しいデッキプレフィックスを特定すること。推測で指定すると誤ったデッキに振り分けられる。） -->
- Only import notes whose `detailedDescription` field contains cloze markers (`{{cX::...}}`). Notes without cloze markers will cause AnkiConnect errors.
<!-- （detailedDescriptionフィールドにclozeマーカーが含まれるノートのみをインポート対象とすること。clozeがないノートはAnkiConnectエラーを引き起こす。） -->
- Validate that every card in the merged JSON has all required fields (`text`, `umeboshiNoteId`, `level`, `oneByOne`), and fill missing fields with defaults before import (Step 6).
<!-- （結合済みJSONの全カードが必須フィールド（text, umeboshiNoteId, level, oneByOne）を持つことを検証し、欠落があればデフォルト値で補完してからインポートすること。） -->
- Verify the import result by checking the note count in the target deck (Step 7). A mismatch between expected and actual count means notes failed to land.
<!-- （インポート後に対象デッキのノート枚数を取得し、結果を検証すること。期待値と実際の枚数が一致しない場合は追加失敗を示す。） -->

**NEVER**
- Do not import notes that lack cloze markers in `detailedDescription`. They will produce errors.
<!-- （detailedDescriptionにclozeマーカーがないノートは絶対にインポートしないこと。エラーが発生する。） -->
- Do not attempt bulk imports through MCP. Large note counts are unstable over MCP; use the Python script directly instead.
<!-- （大量ノートのインポートをMCP経由で実行しないこと。ノート数が多いとMCP経由では不安定なため、Pythonスクリプトで直接AnkiConnectを呼び出すこと。） -->
- Do not skip required-field validation. A missing field silently produces incomplete cards in Anki.
<!-- （必須フィールドの検証を省略しないこと。フィールド欠落があると不完全なカードがAnkiに登録される。） -->

**SHOULD**
- Use `import_to_anki.py` for batch processing. AnkiConnect becomes unstable with too many notes in a single request.
<!-- （import_to_anki.pyを用いてバッチ処理すること。1リクエストあたりのノート数が多すぎるとAnkiConnectが不安定になる。） -->
- Resolve `§N` references in `highYieldSummary` and `visualAids` fields to the corresponding HTML file contents before import.
<!-- （highYieldSummaryおよびvisualAidsフィールドの§N参照を、対応するHTMLファイルの内容に解決してからインポートすること。） -->

**COULD**
- Use `get_model_field_names.py` to inspect field names when a field-name mismatch is suspected during debugging.
<!-- （フィールド名の不一致が疑われるデバッグ時には、get_model_field_names.pyでノートタイプのフィールド名を確認してもよい。） -->
- On import failure, fix the root cause and retry from Step 3.
<!-- （インポート失敗時は原因を修正し、Step 3から再試行してもよい。） -->

## Chain of Thought

1. **Step 0 -- AnkiConnect connectivity check.** Send a `version` request to `http://127.0.0.1:8765`. If it fails, launch Anki and retry.
<!-- （Step 0 -- AnkiConnect接続確認。versionリクエストを送信し、失敗時はAnkiを起動して再試行。） -->
2. **Step 1 -- Determine the deck prefix.** Derive the prefix from the parent directory name of the notes path. Cross-reference with existing deck names via `deckDeckNames`.
<!-- （Step 1 -- デッキプレフィックスの決定。notesパスの親ディレクトリ名からプレフィックスを導出し、deckDeckNamesで既存デッキと照合する。） -->
3. **Step 4 -- Check for cloze markers.** Scan each `detailedDescription` file for `{{cX::...}}` patterns. Exclude any note without a cloze marker from the import batch.
<!-- （Step 4 -- cloze有無チェック。各detailedDescriptionファイルにclozeパターンがあるか走査し、ないノートはインポート対象から除外する。） -->
4. **Step 5 -- Merge into a single JSON.** Combine `detailedDescription`, `highYieldSummary`, and `visualAids` HTML into one JSON array per the schema. Generate a UUID v7 for each note.
<!-- （Step 5 -- JSON結合。detailedDescription, highYieldSummary, visualAidsのHTMLをスキーマに従って1つのJSON配列に統合し、各ノートにUUID v7を生成する。） -->
5. **Step 6 -- Validate required fields.** Confirm every card has `text`, `umeboshiNoteId`, `level`, and `oneByOne`. Fill missing `oneByOne` with `"y"`. Abort if `text` or `umeboshiNoteId` is missing.
<!-- （Step 6 -- 必須フィールド検証。全カードがtext, umeboshiNoteId, level, oneByOneを持つことを確認。欠落フィールドはデフォルト値で補完し、text/umeboshiNoteId欠落時は中断。） -->
6. **Step 6 bis -- Import into Anki.** Pass the merged JSON and deck prefix to `import_to_anki.py`. The script groups by `level` into `{deck_prefix}::{level}` sub-decks using the `umeboshiKaname` note type.
<!-- （Step 6 bis -- Ankiインポート。結合済みJSONとデッキプレフィックスをimport_to_anki.pyに渡す。スクリプトはlevelでグループ化し、umeboshiKanameノートタイプでデッキに投入する。） -->
7. **Step 7 -- Verify.** Run `findNotes` against the target deck and confirm the note count matches the expected number. Report created / skipped / failed counts.
<!-- （Step 7 -- 検証。findNotesで対象デッキのノート数を取得し、期待値と一致するか確認する。作成/スキップ/失敗の件数を報告する。） -->

---

## Supplementary Instruction: visualAids Assignment

Assign `visualAidsHtml` content to each card by matching the section number from `highYieldSummary`'s `§N` reference to the corresponding `visualAidsHtml/<filename>SectN.html` file.
<!-- （highYieldSummaryの§N参照と同じセクション番号に対応するvisualAidsHtml/<filename>SectN.htmlをvisualAidsフィールドに割り振る。） -->

- Retrieve `§N` (e.g. `"§2"`) for each card from `<absolute path>/qaHaiku/<original filename (without extension)>.json`.
<!-- （各カードの§Nを<absolute path>/qaHaiku/<元ファイル名（拡張子なし）>.jsonから取得する。） -->
- Set the contents of `visualAidsHtml/<filename>SectN.html` corresponding to that `§N` into the `visualAids` field.
<!-- （その§Nに対応するvisualAidsHtml/<filename>SectN.htmlの中身をvisualAidsフィールドにセットする。） -->
- Example: if a card's `highYieldSummary` references `"§2"`, set the contents of `visualAidsHtml/<filename>Sect2.html` into its `visualAids` field.
<!-- （例：カードのhighYieldSummaryが"§2"なら、visualAidsHtml/<filename>Sect2.htmlの内容をvisualAidsにセットする。） -->

# Processing Steps

## Step 0: AnkiConnect Connectivity Check

If Anki is not running or AnkiConnect is disabled, every import will fail. Checking first prevents wasted effort in later steps.
<!-- （Ankiが起動していない、またはAnkiConnectが無効の場合、全インポートが失敗する。最初に確認することで後工程の無駄を防ぐ。） -->

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

### Fallback (Launch Anki)

If the connectivity check fails, launch Anki and retry.
<!-- （接続確認に失敗した場合、Ankiを起動して再試行する。） -->

    ```bash
    "/c/Users/chiba/AppData/Local/Programs/Anki/anki.exe" &
    ```

## Step 1: Determine the Deck Prefix

Derive the deck prefix from the parent directory name of the notes input path (path4). Identify the correct prefix by cross-referencing with Anki's existing deck structure.
<!-- （入力パス4（notes/）の親ディレクトリ名からデッキプレフィックスを導出する。Ankiの既存デッキ構成と照合して正しいプレフィックスを特定する。） -->

```python
# path4 example: "C:\Users\chiba\StudySpace\Pathology\ProblemPool_Eitaro\notes"
output_dir = Path(path4)
run_name = output_dir.parent.name  # "ProblemPool_Eitaro"

# Check existing deck structure to determine the prefix
# Example: if "Active::Public health::06" exists, use the next number: "Active::Public health::07"
# How to check: anki_connect('deckDeckNames') returns the list of existing deck names
deck_names = anki_connect('deckDeckNames')['result']
# Identify the prefix corresponding to run_name (manually or via pattern matching)
deck_prefix = "<identified prefix>"  # e.g. "Active::Public health::07"
```

## Step 4: Cloze Presence Check in detailedDescription

Only import notes whose `detailedDescription` contains cloze markers (`{{cX::xxx}}`). Exclude files without cloze markers from the import batch.
<!-- （detailedDescriptionにcloze（{{cX::xxx}}）が含まれているノートのみをインポート対象にする。clozeがないファイルはインポート対象から外す。） -->

Importing a note without cloze markers will cause an error.
<!-- （clozeがないノートをインポートするとエラーになる。） -->

## Step 5: JSON Merge

Consolidate everything into a single JSON file before import.
<!-- （インポート前の最終ファイルを1つのJSONにまとめる。） -->

Output path: `<absolute path>/notes/<original filename without extension>.json`
<!-- （出力先: <absolute path>/notes/<元ファイル名（拡張子なし）>.json） -->

JSON schema:
<!-- （JSONスキーマ） -->

```json
[
  {
    "text": "<h2>1.2 xxx</h2>...",      // detailedDescription HTML.
    "highYieldSummary": "<h1>1 xxx</h1>...",    // highYieldSummary HTML. Map the corresponding highYieldSummary to detailedDescription using the mapping.
    "visualAids": "<h1>1</h1>...",              // visualAids HTML. The highYieldSummary section index and visualAids section index are aligned.
    "umeboshiNoteId": "eitaro-...-sect1",       // UUID v7, unique per note.
    "level": "easy",                   // For sub-deck classification. import_to_anki.py routes to ::{level} sub-deck. Defaults to easy if unspecified.
    "oneByOne": "y"                      // Default "y"
  },
  ...
]
```

Assign the corresponding `highYieldSummary` and `visualAids` files using the mapping. The indices of `highYieldSummary` and `visualAids` are aligned (since `visualAids` was generated from `highYieldSummary`).
<!-- （highYieldSummary, visualAidsはmappingをもとに対応ファイルを割り当てる。highYieldSummary, visualAidsのindexは対応している（highYieldSummaryからvisualAidsを作成したため）。） -->

Generate `umeboshiNoteId` in Python, one per note (one per `detailedDescription`).
<!-- （umeboshiNoteIdは各ノートごと（detailedDescriptionごと）にPythonで生成する。） -->

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

## Step 6: Required Field Validation

Check that every card in the merged JSON contains all required fields. If any are missing, fill them with default values before proceeding -- otherwise the next step will fail to import correctly.
<!-- （結合されたJSONに必須フィールドが含まれているか確認する。欠落がある場合、次のステップでインポートが正常に行われないため、必ずデフォルト値で補完する。） -->

Required fields:
<!-- （必須フィールド） -->
- `text`
- `umeboshiNoteId`
- `level`
- `oneByOne`: default `"y"`
<!-- （oneByOne: デフォルト"y"） -->


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


### Step 6: Anki Import

Pass the merged JSON to `import_to_anki.py`.
<!-- （結合済みJSONをimport_to_anki.pyに渡す。） -->

Script behavior:
<!-- （スクリプトの動作） -->

- Groups cards internally by the `level` field and imports them into deck `{deck_prefix}::{level}`.
<!-- （内部でlevelフィールドによりグループ化し、デッキ{deck_prefix}::{level}にインポート。） -->
- Uses the note type `umeboshiKaname` exclusively.
<!-- （ノートタイプはumeboshiKaname固定。） -->
- Duplicate notes are skipped with `allowDuplicate: True`.
<!-- （重複ノートはallowDuplicate: Trueでスキップ。） -->

```bash
python "C:/Users/chiba/.claude/skills/anki-card-python-addnotes/scripts/import_to_anki.py" "{merged_json_path}" "{deck_prefix}"
```

- `{merged_path}`: `<absolute path>/notes/<original filename without extension>.json`
- `{deck_prefix}`: target deck name for import (user-specified)
<!-- （{deck_prefix}: インポート先デッキ名（ユーザー指定）） -->

### Step 7: Verification

Confirm that the correct number of note IDs is returned. If the expected number of note IDs is not returned, some notes failed to add. When a duplicate-note error appears, the note often does not actually exist. Retrieve the note count to verify.
<!-- （ノートIDが適切な個数返却されるか確認する。適切な数が返却されない場合、追加に失敗している。ノート重複エラーが出るとき、実際にはノートが存在していない場合が多い。ノート枚数を取得して検証する。） -->

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

### Results Reporting

Return the output of `import_to_anki.py` directly as the result:
<!-- （import_to_anki.pyの出力をそのまま結果として返す） -->
- `created`: number of newly created notes
<!-- （created: 新規作成件数） -->
- `skipped`: number of duplicates skipped
<!-- （skipped: 重複スキップ件数） -->
- `failed`: number of failures
<!-- （failed: 失敗件数） -->

### Handling Failures

If `failed > 0`:
<!-- （failed > 0の場合） -->
1. AnkiConnect response error -- check that Anki is running.
<!-- （AnkiConnectの応答エラー → Ankiが起動しているか確認） -->
2. Field name mismatch -- use `get_model_field_names.py` to inspect the note type's field names.
<!-- （フィールド名の不一致 → get_model_field_names.pyでノートタイプのフィールド名を確認） -->
3. Duplicate notes -- existing notes are counted as `skipped`, which is normal (not an error).
<!-- （重複ノート → 既存ノートの場合はskippedとして正常（エラーではない）） -->
4. After fixing the issue above, retry from Step 3.
<!-- （上記を修正後、Step 3から再試行） -->

## Important Notes

- **AnkiConnect limits**: Bulk import of many notes at once is unstable, so `import_to_anki.py` processes them in batches (<original filename without extension>0 notes at a time).
<!-- （AnkiConnectの制限: 大量ノートの同時インポートは不安定なため、import_to_anki.pyでバッチ処理する。） -->
- **Reason for not using MCP**: Due to the large number of notes, the Python script calls AnkiConnect directly rather than routing through MCP.
<!-- （MCP不使用の理由: ノート数が多いため、MCP経由ではなくPythonスクリプトで直接AnkiConnectを呼び出す。） -->
- **§N references**: When the `highYieldSummary` / `visualAids` fields contain `§N`-format references, resolve them to the contents of the corresponding HTML files.
<!-- （§N参照: highYieldSummary・visualAidsフィールドに§N形式の参照がある場合、対応するHTMLファイルの内容に解決する。） -->
- **Level classification**: Cards are automatically sorted into sub-decks based on the `level` field (`veryEasy` / `easy` / `normal` / ...).
<!-- （レベル分類: カードのlevelフィールド（veryEasy/easy/normal/...）により自動的にサブデッキに分類される。） -->

## Scripts Used

- `scripts/merge_sections.py` -- §N reference resolution (shared by highYieldSummary / visualAids)
<!-- （scripts/merge_sections.py -- §N参照解決。highYieldSummary / visualAids共用。） -->
- `scripts/import_to_anki.py` -- Bulk import via AnkiConnect
<!-- （scripts/import_to_anki.py -- AnkiConnectによる一括インポート。） -->
- `scripts/get_model_field_names.py` -- Retrieve note type field names (for debugging)
<!-- （scripts/get_model_field_names.py -- ノートタイプのフィールド名取得。デバッグ用。） -->

---
name: anki-card-formatter-highyield-merge
description: null
---

# Task

入力 json 内の `highYieldSummary` キーにある `§<N>` 参照を読み、対応する HTML ファイル（highYieldSummarySect/<filename>Sect<N>.html）の内容を読み込んで置換し、最終 JSON を生成する。

### Step 1. マージスクリプトの実行

```bash
PYTHONIOENCODING=utf-8 uv run --project "C:\Users\chiba\StudySpace\src" "skills/anki-card-formatter-highyield-merge/scripts/merge_highyield.py" <入力JSONの絶対パス> <出力JSONの絶対パス> <HTMLフォルダの絶対パス>
```

### Step 2. スクリプトの処理内容

## 処理ロジック
1. `highYieldSummary` 値が `§` で始まるか確認。
2. 数字部分を抽出し、対応する `[filename]Sect[N].html` を特定。
3. HTML ファイルの内容を読み込み、カードの `highYieldSummary` フィールドをその内容で上書き。


### Step 3. 出力確認

以下を確認する:

- JSON 参照が全て実際の内容に置換されていること
- 行範囲がhighYieldSummaryの総行数（\nを行数とカウント）を超えていないこと
- エラーが出た場合はhighYieldSummaryファイルのパスなどを確認して修正する

---
name: anki-card-formatter-highyield-map
description: null
---

# Task

以下の指示を逐一実行する。

## Step: セクションの判断（非常に長い作業になるが、時間をかけ人力で行う。）

各カード（Text + Extra）の内容に基づき、サマリーMDファイル全体から**最も関連するセクション（= # § で始まる見出しブロック）を必ず1つ** 選定する。複数指定は不可。この処理はあなたが人力で行う。（スクリプト使用不可。）

#### 抽出ルール
- MDファイル全体から**関連するセクションを1つだけ**選定
- 抽出したセクション番号（N）を記録する

### Step: JSONの記載

各カードの highYieldSummary フィールドに以下の JSON 形式で参照を記載する。
ファイル名は 指定に従う。

    ```json
    {
        "index": 56,
        "highYieldSummary": "§<ここにsection番号が入る>"
    },
    ```
## Step: Save

JSON形式で保存する。

key
- index: 連番
- highYieldSummary: "§3"


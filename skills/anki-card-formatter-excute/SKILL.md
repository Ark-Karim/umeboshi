---
name: anki-card-formatter-excute
description: null
---

# Task
以下のワークフローを逐次的に実行し、高品質な医学Ankiカードを生成する。長大な処理だが、時間をかけて省略せずに実行すること。日本語で作成する。

指定されたスキル以外を読んではいけない。

sub agent を使ってはいけない。

### Step: detaileddescription を作成

/anki-card-formatter-detaileddescription （skills/anki-card-formatter-detaileddescription/SKILL.md）
のフローに従い作成。指定ファイル名として保存。

sub agent を使ってはいけない。

### Step: highYieldSummary を作成

/anki-card-formatter-highyield （skills/anki-card-formatter-highyield/SKILL.md）のフローに従い作成。指定ファイル名として保存。

sub agent を使ってはいけない。

### Step: highYieldSummary mapping

各 detaileddescription に関連する highYieldSummary をマッピングする。

detaileddescription は sub section 番号で、highYieldSummary は section 番号でマッピングする。

以下の JSON 形式で参照を記載する。指定ファイルパスで保存する。

    ```json
    {
        "detailedDescriptionIndex": "3.3（ここには sub section 番号が入る。）",
        "highYieldSummaryIndex": "2（ここには section 番号が入る。）"
    },
    ```

example

    ```json
    [
    {
        "detailedDescriptionIndex": "1.1",
        "highYieldSummaryIndex": "1"
    },
    {
        "detailedDescriptionIndex": "1.2",
        "highYieldSummaryIndex": "1"
    },
    {
        "detailedDescriptionIndex": "1.3",
        "highYieldSummaryIndex": "1"
    },
    {
        "detailedDescriptionIndex": "2.1",
        "highYieldSummaryIndex": "1"
    },
    {
        "detailedDescriptionIndex": "2.2",
        "highYieldSummaryIndex": "1"
    },
    {
        "detailedDescriptionIndex": "2.3",
        "highYieldSummaryIndex": "2"
    }
    ...
    ]
    ```
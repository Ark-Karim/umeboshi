---
name: anki-card-formatter-highyield-sub
description: null
---

# Task

以下の指示を逐一実行する。

**Use the `TaskCreateTool` to create tasks for each of the following steps.**

## Step 0. ファイル読み込み

指定されたファイルを読み込む。

## Step1: 章立てルール準拠

以下の条件を満たすように修正を行う。以下の条件が満たすまで修正をループさせる。

MUST

- /html-formatter

- 1つの section は 8行 - 50行、400字以上 - 2400字以内（単語数ではなく文字数） とする。これを超える場合は強制的に2つに分割する。満たさない場合は強制的に2つに結合する。 sub section の行数、字数制限はない。（section title: h1 (#), sub section title: h2 (##), sub section 内でさらに分割するとき: h3 (###)）

python script で、 <h1> タグの間の文字列を抽出し、文字数、改行数をカウントし、分析する。

```bash
cd "C:\Users\chiba\StudySpace\basicAndAppliedOncology\detailedDescription" && python -c "
  import re
  with open('<filename>.html', 'r', encoding='utf-8') as f:
      content = f.read()

  parts = re.split(r'(<h1[^>]*>.*?</h1>)', content)

  # Reconstruct subsections
  subsections = []
  current_header = None
  current_body = ''
  for part in parts:
      if re.match(r'<h1[^>]*>', part):
          if current_header is not None:
              subsections.append((current_header, current_body))
          current_header = part
          current_body = ''
      else:
          current_body += part
  if current_header is not None:
      subsections.append((current_header, current_body))

  for header, body in subsections:
      clean_header = re.sub(r'<[^>]+>', '', header)
      clean_body = re.sub(r'<[^>]+>', '', body)
      clean_body = re.sub(r'\s+', ' ', clean_body).strip()
      char_count = len(clean_body)
      line_count = len(body.strip().split('\n'))
      print(f'=== {clean_header} ===')
      print(f'  chars: {char_count}, html_lines: {line_count}')
      if char_count > 2400:
          print(f'  ** NEEDS SPLIT **')
      elif char_count < 400:
          print(f'  ** NEEDS COMBINE **')
      elif line_count > 50:
          print(f'  ** NEEDS SPLIT **')
      elif line_count < 8:
          print(f'  ** NEEDS COMBINE **')
      print()
  "
```

## Step2: 書式ルール準拠

以下の条件を満たすように修正を行う。以下の条件が満たすまで修正をループさせる。

MUST

- 太字部分をAnkiで穴埋めにして覚えることによって、USMLE Step 1 が 9割 とれるようになること。
- 太字部分の選定は時間対効果を最大化できるようにする。
- 断片的な知識を統合し、体系的にまとめる。入力ファイルが断片的なときは背景を補って関連付ける。
- section, sub section title の英語表記: section, sub section title は英語にし、<ruby>を用いて日本語を併記する。（example: <h2><ruby>1.2 Nephron: The Minimal Unit of Filtration<rt>ネフロン: ろ過の最小単位</rt></ruby></h2>） 本文は日本語にする。
- section, sub section title には連番をつける。section は、1, 2, 3, 4, ... のようにつけ、sub section は、1.1, 1.2, ..., 2.1, 2.2, 2.3 ... のように付ける。

SHOULD

- /text-formatter-anki
- /text-formatter-metaphor
- Dual-Process Theory の適用: 直感的特徴（パターン認識：System 1用キーワード）と、論理的特徴（機序分析：System 2用キーワード）の双方を同一ノート内にバランスよく配置する。

## Step chart 書式準拠

表・コードブロックのスタイルを /text-formatter-chart の書式ルールに準拠するように修正・書き換える。以下の条件が満たすまで修正をループさせる。

MUST

- /text-formatter-chart

チェック方法

    ```powershell
    # 1. バッククォート（`）で囲まれたコードブロック/インラインコードの抽出
    Select-String -Path "input.md" -Pattern '`{1,4}[^`\n]+`{1,4}' -AllMatches | ForEach-Object { $_.Matches.Value }

    # 2. Markdown形式の表（| で区切られた行）の抽出
    Select-String -Path "input.md" -Pattern '^\s*\|.*\|'
    ```



## Step. section ごとに分割して HTML を保存

section ごとに分割して HTML を保存する。指定パスに指定ファイル名で保存する。 sub section ごとではなく、 section ごとである。

#### セクション分けの方法（補足）

##### section

全体のテーマを 複数の section に分け、1つの section 内の内容は 1つのトピックに絞る。
1つの section は 8行 - 50行、400字以上 - 2400字以内（単語数ではなく文字数） とする。これを超える場合は強制的に2つに分割する。満たさない場合は強制的に2つに結合する。

##### sub section

1つの section を 複数の sub section に分け、1つの sub section 内の内容は 1つのトピックに絞る。

##### 見出し形式

- section title: h1 (#)
- sub section title: h2 (##)
- sub section 内でさらに分割するとき: h3 (###)




## Step 4. highYieldSummary の修正に伴う、detailedDescriptionIndex と、 highYieldSummaryIndex のマッピングの修正を行う。

detailedDescription (<absolute path>/detailedDescription/<original filename without extension>SubSect<sub section index>.html) の sub section が、highYielsSummary (<absolute path>/highYieldSummary/<original filename without extension>Sect<section index>.html) のどの section に対応するかを定義するマッピングである。

detaileddescription は sub section 番号で、highYieldSummary は section 番号でマッピングする。

例えば、highYieldSummary の 2 を、2, 3 に分割した場合、マッピングの該当インデックスも, detailedDescription の内容に応じて、2や3の どちらに対応するか、修正する。

mapping file is already generated. 以下の JSON 形式で変更を修正する。指定ファイルパスで上書き保存する。

    ```json
    {
        "detailedDescriptionIndex": "3.3（ここには sub section 番号が入る。）",
        "highYieldSummaryIndex": "2（ここには section 番号が入る。）"
    },
    ```
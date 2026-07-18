---
name: text-formatter-structuring
description: null
---

<!-- description: Use this skill when authoring or restructuring a Japanese-language detailed description HTML document from scratch. This skill governs structure only — heading tag mapping, section/sub-section decimal numbering, and character-count limits — organized by priority so conflicts resolve deterministically. It is meant to be combined with other content-authoring skills that handle domain content. After drafting or editing, run the bundled validation script and follow the fix-loop policy before considering the document done. -->


# このSkillの前提

腫瘍学の詳細説明HTML文書（日本語）を最初から執筆する工程で、他の内容執筆Skillと併用する。医学的内容の正しさ・網羅性・トピックの切り方の細部はモデルの自律的判断および他Skillに委ね、本Skillは **文書の構造（見出し・番号・分量）が満たすべきルールと、その優先順位** のみを規定する。

ルール同士が競合した場合は、必ず番号の小さいPriorityを優先する。

---

# Priority 1（最優先・MUST）: 見出しタグの対応

| 階層 | タグ |
|---|---|
| section title | `<h1>` |
| sub section title | `<h2>` |
| sub section 内部のさらなる分割 | `<h3>` |

---

# Priority 2（MUST）: sub section の文字数

1つの sub section（内包する h3 の内容も含む）は1つのトピックに絞る。

- 必須（MUST）: 300字以上 〜 1500字以内（単語数ではなく文字数、タグ・改行を除いた実文字数）
- 目安（SHOULD、Priority 5 相当）: 600字以上 〜 1200字以内

MUST範囲を超える場合は、sub section を強制的に2つに分割する。MUST範囲の下限を満たさない場合は、強制的に別の sub section と結合する。

---

# Priority 3（MUST）: section の文字数

1つの section（内包する sub section すべてを含む）は1つのトピックに絞る。

- 必須（MUST）: 400字以上 〜 3600字以内（単語数ではなく文字数）
- 目安（SHOULD、Priority 6 相当）: 800字以上 〜 2400字以内

MUST範囲を超える場合は section を強制的に2つに分割する。MUST範囲の下限を満たさない場合は、強制的に別の section と結合する。

---

# Priority 4（MUST）: Decimal Numbering System の整合性

- section の番号は `1. `, `2. `, `3. `, ... のように1から始まる連番とする。
- sub section の番号は、親 section 番号を接頭辞として `1.1 `, `1.2 `, ..., `2.1 `, `2.2 `, ... のように1から始まる連番とする。
- 欠番、重複、順序の入れ替わりを一切許容しない。section・sub section を分割・結合・並べ替えた場合は、必ず番号を振り直して連続性を回復させる。


---

# Priority 5 (SHOULD): h3 を使う条件

h3 は任意の装飾ではなく、以下のいずれかに該当する場合は **使用しなければならない**。

- (a) 1つの sub section の中に、並列関係にある複数の下位トピック（例: 薬剤クラス別、病期別、群別の説明など）が存在し、それぞれが独立したまとまりとして説明されている場合。
- (b) sub section が Priority 2 の文字数上限（1500字）に近づいており、かつ内容が複数の下位トピックに分解可能な場合。この場合、まず h3 による内部分割を試み、それでも上限を超える場合にのみ sub section 自体を2つに分割する（Priority 2 参照）。

該当しない単一トピックの sub section に h3 を追加してはならない（見出しの過剰な細分化を避ける）。

---

# Priority 6（SHOULD）: sub section, section 内のトピック単一性

1つの sub section, section の内容は1つのトピックに絞ることが望ましい。トピックの切り方自体は本Skillでは規定せず、モデルの判断に委ねる。

---

# 検証スクリプト

`<h1>`, `<h2>` タグを解析し、以下を機械的にチェックする（Priority 5 の h3 使用条件はトピックの並列性という質的判断を伴うため自動検証の対象外とし、執筆時の目視判断に委ねる）。

- Priority 2: 各 sub section の文字数
- Priority 3: 各 section の文字数（内包する sub section を含めた合計）
- Priority 4: section / sub section 番号の欠番・重複・順序違反

ファイルパスを引数に取る汎用スクリプト:

```bash
python -c "
import re
import sys

def strip_tags(s):
    return re.sub(r'<[^>]+>', '', s)

def clean_text(s):
    return re.sub(r'\s+', ' ', strip_tags(s)).strip()

def parse_number(title_text, level):
    if level == 1:
        m = re.match(r'^(\d+)\.\s', title_text.strip())
    else:
        m = re.match(r'^(\d+\.\d+)\s', title_text.strip())
    return m.group(1) if m else None

def main(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    tokens = re.split(r'(<h1[^>]*>.*?</h1>|<h2[^>]*>.*?</h2>)', content)

    sections = []
    current_section = None
    current_sub = None

    for tok in tokens:
        if re.match(r'^<h1[^>]*>', tok):
            if current_section:
                if current_sub:
                    current_section['subsections'].append(current_sub)
                    current_sub = None
                sections.append(current_section)
            title = clean_text(tok)
            current_section = {'title': title, 'num': parse_number(title, 1), 'own_body': '', 'subsections': []}
        elif re.match(r'^<h2[^>]*>', tok):
            if current_section is None:
                continue
            if current_sub:
                current_section['subsections'].append(current_sub)
            title = clean_text(tok)
            current_sub = {'title': title, 'num': parse_number(title, 2), 'body': ''}
        else:
            if current_sub is not None:
                current_sub['body'] += tok
            elif current_section is not None:
                current_section['own_body'] += tok

    if current_sub:
        current_section['subsections'].append(current_sub)
    if current_section:
        sections.append(current_section)

    errors = []
    warnings = []

    # --- Priority 4: 連番チェック ---
    expected_h1 = 1
    seen_h1 = set()
    for sec in sections:
        if sec['num'] is None:
            errors.append(f\"[P4/番号解析失敗] section「{sec['title']}」に '数字. ' 形式の番号が見つかりません\")
            continue
        num = int(sec['num'].rstrip('.'))
        if num in seen_h1:
            errors.append(f\"[P4/重複] section番号 {sec['num']} が重複（{sec['title']}）\")
        elif num != expected_h1:
            errors.append(f\"[P4/欠番・順序不正] section番号は {expected_h1} を期待したが {sec['num']}（{sec['title']}）\")
        seen_h1.add(num)
        expected_h1 = num + 1

        expected_h2 = 1
        seen_h2 = set()
        for sub in sec['subsections']:
            if sub['num'] is None:
                errors.append(f\"  [P4/番号解析失敗] sub section「{sub['title']}」に 'N.M' 形式の番号が見つかりません\")
                continue
            expected_str = f\"{sec['num'].rstrip('.')}.{expected_h2}\"
            if sub['num'] in seen_h2:
                errors.append(f\"  [P4/重複] sub section番号 {sub['num']} が重複（{sub['title']}）\")
            elif sub['num'] != expected_str:
                errors.append(f\"  [P4/欠番・順序不正] sub section番号は {expected_str} を期待したが {sub['num']}（{sub['title']}）\")
            seen_h2.add(sub['num'])
            expected_h2 += 1

    # --- Priority 2, 3: 文字数チェック ---
    for sec in sections:
        sub_bodies_concat = ''.join(sub['body'] for sub in sec['subsections'])
        section_total_chars = len(clean_text(sec['own_body'] + sub_bodies_concat))
        print(f\"=== section {sec['num']} {sec['title']} ===\")
        print(f\"  chars(合計): {section_total_chars}\")
        if section_total_chars > 3600:
            errors.append(f\"[P3] section {sec['num']}: {section_total_chars}字 > 3600字上限 → 分割必須\")
        elif section_total_chars > 2400:
            warnings.append(f\"[P6] section {sec['num']}: {section_total_chars}字 > 2400字目安\")
        elif section_total_chars < 400:
            errors.append(f\"[P3] section {sec['num']}: {section_total_chars}字 < 400字下限 → 結合必須\")
        elif section_total_chars < 800:
            warnings.append(f\"[P6] section {sec['num']}: {section_total_chars}字 < 800字目安\")

        for sub in sec['subsections']:
            sub_chars = len(clean_text(sub['body']))
            print(f\"  --- sub section {sub['num']} {sub['title']} ---\")
            print(f\"      chars: {sub_chars}\")
            if sub_chars > 1500:
                errors.append(f\"[P2] sub section {sub['num']}: {sub_chars}字 > 1500字上限 → sub section分割必須\")
            elif sub_chars > 1200:
                warnings.append(f\"[P5] sub section {sub['num']}: {sub_chars}字 > 1200字目安\")
            elif sub_chars < 300:
                errors.append(f\"[P2] sub section {sub['num']}: {sub_chars}字 < 300字下限 → 結合必須\")
            elif sub_chars < 600:
                warnings.append(f\"[P5] sub section {sub['num']}: {sub_chars}字 < 600字目安\")
        print()

    print('========== 検証結果 ==========')
    if errors:
        print(f'[MUST違反: {len(errors)}件]')
        for e in errors:
            print(' -', e)
    if warnings:
        print(f'[SHOULD違反: {len(warnings)}件]')
        for w in warnings:
            print(' -', w)
    if not errors and not warnings:
        print('問題なし')

    return 1 if errors else 0

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python -c \"...\" <path/to/file.html>')
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
" <path/to/file.html>
```

- MUST違反（Priority 1〜4）は必ず修正する。
- SHOULD違反（Priority 5〜6）はMUSTを満たした上で可能な範囲で対応する。

---

# 検証・修正フロー（MUST）

1. スクリプトを実行し検証結果を確認する。
2. MUST違反があれば、Priority番号が小さいものから順に修正する（例: Priority 5 の h3分割で解決できないか先に検討してから Priority 2の分割・結合に進む）。
3. 再度スクリプトを実行し再検証する。
4. 修正→再検証のループは最大2回まで。2回を超えてもMUST違反が残る場合は、それ以上自動修正を繰り返さず、残存違反をPriority番号付きでユーザーに報告する。
5. MUST違反が解消していればSHOULD違反のみでループを止め、完了とする。
---
name: text-formatter-structuring
description: null
---

<!-- description: Use this skill when authoring or restructuring a Japanese-language detailed description HTML document from scratch. This skill governs structure only — heading tag mapping, section/sub-section decimal numbering, and character-count limits — organized by priority so conflicts resolve deterministically. It is meant to be combined with other content-authoring skills that handle domain content. After drafting or editing, run the bundled validation script and follow the fix-loop policy before considering the document done. -->

<!-- （このスキルは、日本語の詳細説明HTML文書を一から執筆・再構築する際に使用する。見出しタグの対応、セクション／サブセクションの連番、文字数制限といった構造ルールのみを優先順位付きで規定する。他の内容執筆スキルと併用することを前提としている。執筆・編集後は検証スクリプトを実行し、修正ループポリシーに従うこと。） -->

# About This Skill

This skill is used in conjunction with other content-authoring skills when authoring a Japanese-language detailed-description HTML document in oncology from scratch. The correctness, comprehensiveness, and granularity of medical content are delegated to the model's autonomous judgment and other skills. This skill governs only the **rules that the document structure (headings, numbering, and volume) must satisfy, and their priority order**.

<!-- （このスキルは腫瘍学の日本語詳細説明HTML文書を一から執筆する際に、他の内容執筆スキルと併用する。医学的内容の正しさ・網羅性・トピックの切り方はモデルと他スキルに委ね、本スキルは文書構造（見出し・番号・分量）のルールと優先順位のみを規定する。） -->

When rules conflict, always prioritize the rule with the smaller Priority number.

<!-- （ルール同士が競合した場合は、必ず番号の小さいPriorityを優先する。） -->

---

## Requirements

### MUST

- **Heading tags**: Map section titles to `<h1>`, sub section titles to `<h2>`, and further divisions within a sub section to `<h3>`. (Priority 1)
- **Sub section character count**: Each sub section (including any nested `<h3>` content) must contain **300--1,500 characters** (character count, not word count; excluding tags and line breaks). (Priority 2)
- **Section character count**: Each section (including all nested sub sections) must contain **400--3,600 characters** (character count, not word count). (Priority 3)
- **Section numbering**: Section numbers must be consecutive starting from 1: `1. `, `2. `, `3. `, ... (Priority 4)
- **Sub section numbering**: Sub section numbers must use the parent section number as a prefix and be consecutive starting from 1: `1.1 `, `1.2 `, ..., `2.1 `, `2.2 `, ... (Priority 4)
- **Numbering integrity**: No gaps, duplicates, or order violations in section or sub section numbering. (Priority 4)
- **Renumbering after structural changes**: After splitting, merging, or reordering sections or sub sections, renumber to restore consecutive continuity. (Priority 4)
- **Validation**: Run the bundled validation script after drafting or editing, and fix all MUST violations before considering the document done.
- **Fix-loop limit**: Fix-and-validate loop is capped at 2 iterations. If MUST violations remain after 2 iterations, stop and report them to the user with Priority numbers.

<!-- （MUST要件：見出しタグ対応（h1/h2/h3）、サブセクション文字数300〜1500字、セクション文字数400〜3600字、セクション番号は1からの連番、サブセクション番号は親番号付き連番、欠番・重複・順序違反禁止、構造変更後の番号振り直し、検証スクリプト実行とMUST違反修正、修正ループは最大2回。） -->

### NEVER

- Use `<h3>` for a single-topic sub section with no parallel subtopics (avoid excessive heading fragmentation). (Priority 5)
- Allow gaps, duplicates, or out-of-order numbering. (Priority 4)
- Exceed 1,500 characters in a sub section or go below 300 characters. (Priority 2)
- Exceed 3,600 characters in a section or go below 400 characters. (Priority 3)

<!-- （禁止事項：単一トピックのサブセクションにh3を使用しない、欠番・重複・順序違反を許容しない、サブセクション文字数範囲（300〜1500字）の逸脱禁止、セクション文字数範囲（400〜3600字）の逸脱禁止。） -->

### SHOULD

- Sub section character count: **600--1,200 characters** (guideline range). (Priority 5)
- Section character count: **800--2,400 characters** (guideline range). (Priority 6)
- Use `<h3>` when parallel subtopics exist within a sub section, or when the sub section approaches the 1,500-character limit and can be internally decomposed. (Priority 5)
- Keep each section and sub section focused on a single topic (topic granularity is left to model discretion). (Priority 6)
- Address SHOULD violations to the extent possible after all MUST violations are resolved.

<!-- （SHOULD要件：サブセクション文字数目安600〜1200字、セクション文字数目安800〜2400字、並列サブトピックがある場合や文字数上限に近い場合はh3で内部分割、セクション・サブセクションは単一トピックに絞ることが望ましい、MUST違反解消後にSHOULD違反へ可能な範囲で対応。） -->

### COULD

No explicit COULD-level rules are defined in this skill. All structural requirements are covered by MUST or SHOULD above.

<!-- （COULD：本スキルに明示的なCOULDレベルのルールは定義されていない。すべての構造要件は上記のMUSTまたはSHOULDでカバーされている。） -->

---

## Chain of Thought

1. Identify the topic scope and determine the high-level section structure for the document.
2. Draft sections, each with an `<h1>` heading and a decimal section number (`1. `, `2. `, `3. `, ...).
3. Within each section, draft sub sections, each with an `<h2>` heading and a parent-numbered decimal sub section number (`1.1 `, `1.2 `, ..., `2.1 `, `2.2 `, ...).
4. For each sub section, assess whether `<h3>` tags are needed: (a) the sub section contains multiple parallel subtopics that each warrant an independent heading, or (b) the sub section is approaching the 1,500-character upper limit and the content can be decomposed into sub-topics. If neither condition holds, do not add `<h3>`.
5. Check character counts: ensure each sub section falls within 300--1,500 characters and each section falls within 400--3,600 characters (excluding tags and line breaks). Split or merge as necessary.
6. Verify decimal numbering: confirm no gaps, duplicates, or order violations exist. After any structural changes (split, merge, reorder), renumber to restore consecutive continuity.
7. Run the bundled validation script to mechanically check Priority 2 (sub section character count), Priority 3 (section character count), and Priority 4 (numbering integrity).
8. Fix MUST violations in Priority order (smaller number first). When a sub section exceeds the character limit, first attempt internal division via `<h3>` (Priority 5) before splitting the sub section itself (Priority 2).
9. Re-run the validation script. Repeat the fix-and-validate loop at most **2 times**.
10. If MUST violations remain after 2 iterations, stop and report them to the user with their Priority numbers -- do not continue automated fixing. If only SHOULD violations remain, consider the document structurally complete.

<!-- （思考の連鎖：1. トピック範囲特定 → 2. セクション草案（h1＋連番）→ 3. サブセクション草案（h2＋親番号付き連番）→ 4. h3要否判定（並列サブトピックの有無／文字数上限接近）→ 5. 文字数チェック（サブ300〜1500字、セクション400〜3600字）→ 6. 連番検証（欠番・重複・順序違反なし、構造変更後は番号振り直し）→ 7. 検証スクリプト実行 → 8. MUST違反を優先順位順に修正（h3分割を先に検討）→ 9. 再検証（最大2回）→ 10. 残存違反の報告または完了。） -->

---

# Priority 1 (Highest Priority / MUST): Heading Tag Mapping

| Hierarchy | Tag |
|---|---|
| section title | `<h1>` |
| sub section title | `<h2>` |
| further division within a sub section | `<h3>` |

<!-- （セクションタイトルはh1、サブセクションタイトルはh2、サブセクション内のさらなる分割はh3を使用する。） -->

---

# Priority 2 (MUST): Sub Section Character Count

Each sub section (including any nested `<h3>` content) must focus on a single topic.

- **MUST**: 300--1,500 characters (character count, not word count; actual character count excluding tags and line breaks)
- **SHOULD guideline** (Priority 5 equivalent): 600--1,200 characters

If a sub section exceeds the MUST upper limit, forcibly split it into two sub sections. If it falls below the MUST lower limit, forcibly merge it with another sub section.

<!-- （サブセクションは単一トピックに絞り、文字数はMUSTで300〜1500字、SHOULD目安で600〜1200字。上限超過時は強制分割、下限未満時は強制結合する。） -->

---

# Priority 3 (MUST): Section Character Count

Each section (including all nested sub sections) must focus on a single topic.

- **MUST**: 400--3,600 characters (character count, not word count)
- **SHOULD guideline** (Priority 6 equivalent): 800--2,400 characters

If a section exceeds the MUST upper limit, forcibly split it into two sections. If it falls below the MUST lower limit, forcibly merge it with another section.

<!-- （セクションは単一トピックに絞り、文字数はMUSTで400〜3600字、SHOULD目安で800〜2400字。上限超過時は強制分割、下限未満時は強制結合する。） -->

---

# Priority 4 (MUST): Decimal Numbering System Integrity

- Section numbers must be consecutive starting from 1: `1. `, `2. `, `3. `, ...
- Sub section numbers must use the parent section number as a prefix and be consecutive starting from 1: `1.1 `, `1.2 `, ..., `2.1 `, `2.2 `, ...
- Gaps, duplicates, and order violations are never permitted. After splitting, merging, or reordering sections or sub sections, always renumber to restore consecutive continuity.

<!-- （セクション番号は1からの連番、サブセクション番号は親番号を接頭辞とした連番。欠番・重複・順序違反は一切不可。構造変更後は必ず番号を振り直す。） -->

---

# Priority 5 (SHOULD): Conditions for Using `<h3>`

`<h3>` is not an arbitrary decoration. It **must be used** when either of the following conditions is met:

- (a) A single sub section contains multiple parallel subtopics (e.g., explanations grouped by drug class, disease stage, or patient cohort) that are each described as independent units.
- (b) A sub section is approaching the Priority 2 character-count upper limit (1,500 characters) and the content is decomposable into multiple subtopics. In this case, first attempt internal division using `<h3>`. Only if the limit is still exceeded after adding `<h3>` should the sub section itself be split into two (see Priority 2).

Do not add `<h3>` to a single-topic sub section that does not meet either condition (avoid excessive heading fragmentation).

<!-- （h3は任意の装飾ではない。並列関係の下位トピックが存在する場合、または文字数上限に近づき分解可能な場合はh3を使用しなければならない。単一トピックのサブセクションにはh3を追加してはならない。） -->

---

# Priority 6 (SHOULD): Single-Topic Focus per Section / Sub Section

It is desirable that each sub section and each section focus on a single topic. The granularity of topic division is not prescribed by this skill and is left to the model's discretion.

<!-- （各セクション・サブセクションは単一トピックに絞ることが望ましい。トピックの切り方はモデルの判断に委ねる。） -->

---

# Validation Script

This script parses `<h1>` and `<h2>` tags and mechanically checks the following. (Priority 5 `<h3>` usage conditions involve qualitative judgment about topic parallelism and are excluded from automated validation -- they are left to visual inspection during authoring.)

- **Priority 2**: Character count of each sub section
- **Priority 3**: Character count of each section (total including all nested sub sections)
- **Priority 4**: Gaps, duplicates, and order violations in section / sub section numbering

A general-purpose script that accepts a file path as an argument:

<!-- （検証スクリプトはh1・h2タグを解析し、Priority 2のサブセクション文字数、Priority 3のセクション文字数、Priority 4の連番整合性を機械的にチェックする。h3使用条件は質的判断を伴うため自動検証対象外。） -->

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

- **MUST violations** (Priority 1--4) must be fixed.
- **SHOULD violations** (Priority 5--6) should be addressed to the extent possible after all MUST requirements are satisfied.

<!-- （MUST違反（Priority 1〜4）は必ず修正。SHOULD違反（Priority 5〜6）はMUSTを満たした上で可能な範囲で対応する。） -->

---

# Validation and Fix Flow (MUST)

1. Run the validation script and review the results.
2. If MUST violations exist, fix them in Priority order (smaller number first). For example: first consider whether internal `<h3>` division (Priority 5) can resolve the issue before proceeding to sub section splitting or merging (Priority 2).
3. Re-run the validation script to re-validate.
4. The fix-and-revalidate loop is capped at **2 iterations maximum**. If MUST violations remain after 2 iterations, stop automated fixing and report the remaining violations to the user with their Priority numbers.
5. If MUST violations are resolved and only SHOULD violations remain, stop the loop and consider the document complete.

<!-- （検証・修正フロー：1. スクリプト実行 → 2. MUST違反を優先順に修正（h3分割を先に検討）→ 3. 再検証 → 4. 最大2回のループ、超過時は残存違反を報告 → 5. MUST解消・SHOULDのみで完了。） -->

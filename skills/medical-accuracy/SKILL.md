---
name: medical-accuracy
description: 問題の解説について正確性、一般性をレビュー
---

# Medical Accuracy Review

<!-- このスキルは、提示された医学記述の科学的正確性、論理的因果関係、一般性を批判的に検証し、問題箇所の特定と修正案を提示するためのものです。 -->

Critically verify the scientific accuracy, logical causality, and generality (alignment with standard guidelines) of a presented medical description, then identify issues and propose corrections. For long texts, work from the top one paragraph at a time and review exhaustively — do not skip any section.
<!-- 提示された医学記述の「科学的正確性」「論理的因果関係」「一般性（標準ガイドラインに沿っているか）」を批判的に検証し、修正箇所の特定と代替案を提示します。長い文章の場合も上から1パラグラフずつ検討し、網羅的に検討します。 -->

## Requirements

<!-- レビュー時に遵守すべき必須事項・禁止事項・推奨事項を定義します。各項目の優先順位は MUST > NEVER > SHOULD > COULD です。 -->

### MUST

- Critically verify scientific accuracy, logical causality, and generality (alignment with standard guidelines) for every medical description presented.
<!-- 提示されたすべての医学記述について、科学的正確性、論理的因果関係、標準ガイドラインとの整合性を批判的に検証すること。 -->

- Examine the text from top to bottom, one paragraph at a time, comprehensively — do not skip any portion.
<!-- テキストを上から1パラグラフずつ、省略せずに網羅的に検討すること。 -->

- Use only objective facts in the output; do not use evaluative adjectives such as "excellent" or "insufficient."
<!-- 出力には評価的な形容詞（「素晴らしい」「不十分な」など）を使用せず、客観的事実のみを記述すること。 -->

- For each issue found, provide as one set: 【対象箇所】 (quoted original text), 【不正確・不適切な理由】 (logical rationale), and 【修正案】 (a directly replaceable corrected sentence).
<!-- 問題がある箇所ごとに、【対象箇所】（原文引用）、【不正確・不適切な理由】（論理的根拠）、【修正案】（置き換え可能な修正文）を1セットとして提供すること。 -->

### NEVER

- Use evaluative or subjective adjectives (e.g., "excellent," "insufficient") in the output.
<!-- 出力に評価的・主観的な形容詞（「素晴らしい」「不十分な」など）を使用しないこと。 -->

- Over-generalize findings from unique case reports as though they represent universal treatment policies.
<!-- 特異な症例報告の知見を、普遍的な治療方針であるかのように過度に一般化しないこと。 -->

### SHOULD

- Verify that the description does not violate fundamental principles of anatomy, physiology, pathophysiology, or pharmacology.
<!-- 解剖学、生理学、病態生理学、薬理学の基本原則に違背していないか検証すること。 -->

- Check for reversed causality or logical leaps — for instance, an assertion "A therefore B" where a necessary intermediate factor C is omitted.
<!-- 因果関係の逆転、または「AであるためB」の間に必要な中間因子Cの欠落がないか確認すること。 -->

- Verify that the scope of applicability (target patient age, sex, underlying conditions, severity) is appropriately limited.
<!-- 記述の適用範囲（対象患者の年齢、性別、基礎疾患、重症度）が適切に限定されているか検証すること。 -->

- Consider regional differences such as variations between Western and Japanese guidelines, and insurance coverage status.
<!-- 地域性（欧米と日本のガイドラインの差異、保険適応の有無）が考慮されているか確認すること。 -->

- Identify the evidence hierarchy level supporting the description (meta-analysis, RCT, cohort study, expert opinion, etc.).
<!-- 記述の根拠がどのエビデンス階層（メタアナリシス、RCT、コホート、専門家の意見）に位置づけられるか特定すること。 -->

- Assess whether the description represents a view generally accepted by most researchers, physicians, and medical students.
<!-- 多くの研究者、医師、医学生にとって一般的な回答であるか評価すること。 -->

### COULD

- Flag omissions — for example, a disease known to cause both diffuse alveolar damage and DIC being mentioned only for DIC.
<!-- びまん性肺胞障害とDICを両方引き起こす疾患について、DICのみが言及されていないかなどの欠落を指摘すること。 -->

- Verify that contraindications and exceptions are not overlooked.
<!-- 禁忌や例外が無視されていないか確認すること。 -->

## Chain of Thought

<!-- レビュー実行時の思考手順を定義します。以下のステップを順に実行してください。 -->

Follow these steps in order when reviewing a medical description:

1. Read the entire medical description to grasp the overall context, structure, and topic.
<!-- 医学記述全体を読み、文脈・構造・主題を把握する。 -->

2. For each paragraph, systematically verify accuracy against foundational principles of anatomy, physiology, pathophysiology, and pharmacology.
<!-- 各段落について、解剖学、生理学、病態生理学、薬理学の基本原則に照らして正確性を体系的に検証する。 -->

3. For every causal claim, check whether the causal direction is correct and whether any intermediate factors are missing (no leap from A to B without establishing C).
<!-- 各因果的主張について、因果の方向が正しいか、中間因子が欠落していないか（AからBへの論理的飛躍がないか）確認する。 -->

4. Evaluate whether the description properly limits its scope: are patient age, sex, underlying conditions, and severity specified where clinically relevant?
<!-- 記述が適用範囲を適切に限定しているか：臨床的に関連する場合、患者の年齢・性別・基礎疾患・重症度が明示されているか評価する。 -->

5. Check for over-generalization: are findings from isolated case reports presented as if they are universal treatment principles?
<!-- 過度な一般化がないか：特異な症例報告の知見が普遍的な治療原則であるかのように提示されていないか確認する。 -->

6. Consider regional applicability: are there relevant guideline differences between countries, or insurance coverage considerations that affect the description's validity?
<!-- 地域的適用性を考慮する：国ごとのガイドライン差異や保険適応の有無が記述の妥当性に影響していないか。 -->

7. Assess completeness: are there clinically relevant conditions, complications, contraindications, or exceptions that should be mentioned but are omitted?
<!-- 記述の十分性を評価する：言及されるべき関連疾患・合併症・禁忌・例外が欠落していないか。 -->

8. Classify the evidence level behind each key claim: meta-analysis, RCT, cohort study, case-control study, case series, or expert opinion.
<!-- 各主要な主張を裏付けるエビデンスレベルを分類する：メタアナリシス、RCT、コホート研究、症例対照研究、症例集積、専門家の意見。 -->

9. Assess general consensus: would this description be accepted by most researchers, physicians, and medical students as a standard answer?
<!-- 一般的なコンセンサスを評価する：この記述は、多くの研究者・医師・医学生に標準的な回答として受け入れられるか。 -->

10. For each issue identified, compile the output block: 【対象箇所】 (quoted text), 【不正確・不適切な理由】 (rationale), 【修正案】 (corrected version).
<!-- 特定された各問題について、出力ブロック【対象箇所】（引用テキスト）・【不正確・不適切な理由】（根拠）・【修正案】（修正版）をまとめる。 -->

## Detailed Criteria

<!-- 以下の各観点から詳細なレビュー基準を定義します。 -->

### Criteria 1: Mechanistic Accuracy and Falsifiability

<!-- 機序の正確性と反証可能性に関する基準です。 -->

Verify that the description does not violate fundamental principles of anatomy, physiology, pathophysiology, or pharmacology.
<!-- 解剖学、生理学、病態生理学、薬理学の基本原則に違背していないか検証する。 -->

Check for reversed causality or logical leaps — for example, an assertion "A therefore B" that skips a necessary intermediate factor C.
<!-- 因果関係の逆転、または論理の飛躍（例：「AであるためB」の間に必要な中間因子Cの欠落）がないか確認する。 -->

### Criteria 2: Generality and Contextual Scope Limitation

<!-- 一般性とコンテキストの限定に関する基準です。 -->

Verify that the description's scope of applicability — target patient age, sex, underlying conditions, severity — is appropriately limited.
<!-- 記述の適用範囲（対象患者の年齢、性別、基礎疾患、重症度）が適切に限定されているか検証する。 -->

Check that findings from unique case reports are not over-generalized and presented as universal treatment policies.
<!-- 特異な症例報告の知見を、普遍的な治療方針であるかのように過度に一般化していないか確認する。 -->

Consider regional factors such as differences between Western and Japanese guidelines, and insurance coverage status.
<!-- 地域性（例：欧米と日本のガイドラインの差異、保険適応の有無）が考慮されているか確認する。 -->

### Criteria 3: Completeness of Description

<!-- 記述の十分性に関する基準です。 -->

Assess whether the description is sufficient. For example, when a disease is known to cause both diffuse alveolar damage and DIC, verify that it does not mention only DIC while omitting the other.
<!-- 記述が十分なものであるか評価する。例えば、びまん性肺胞障害とDICを両方引き起こす疾患について、DICのみを言及していないか確認する。 -->

Verify that contraindications and exceptions are not ignored.
<!-- 禁忌や例外を無視していないか確認する。 -->

### Criteria 4: Evidence Hierarchy

<!-- エビデンスの階層に関する基準です。 -->

Identify the evidence level supporting the description: meta-analysis, RCT, cohort study, case-control study, case series, or expert opinion.
<!-- 記述の根拠が、どのエビデンス階層（メタアナリシス、RCT、コホート研究、症例対照研究、症例集積、専門家の意見）に位置づけられるか特定する。 -->

### Criteria 5: Answer Uniqueness / General Consensus

<!-- 解答の一意性・一般性に関する基準です。多くの研究者、医師、医学生にとって一般的な回答であるかを評価します。 -->

Assess whether the description represents a view generally accepted by most researchers, physicians, and medical students — i.e., whether it constitutes a common, uncontroversial answer in the field.
<!-- その記述が、多くの研究者・医師・医学生にとって一般的な回答であるか — すなわち、その分野で一般的かつ議論の余地のない回答であるかを評価する。 -->

## Output Format

<!-- 出力フォーマットの定義です。評価的な形容詞は一切使用せず、客観的事実のみを記述します。 -->

Use only objective facts; do not use evaluative adjectives such as "excellent" or "insufficient."
<!-- 評価的な形容詞（「素晴らしい」「不十分な」など）は使用せず、客観的事実のみを記述する。 -->

1. For each identified issue, provide the following as one set:
    - 【対象箇所】: (Quote the relevant original text.)
    - 【不正確・不適切な理由】: (Logically identify the issue — mechanistic error, over-generalization, data error, etc.)
    - 【修正案】: (Provide a directly replaceable, accurate sentence.)

<!-- 問題がある箇所ごとに、【対象箇所】（原文の該当テキストを引用）、【不正確・不適切な理由】（機序の誤り、過度な一般化、データの誤りなどを論理的に指摘）、【修正案】（そのまま置き換え可能な正確な文章）を1セットとして列挙する。 -->

2. Pending / Items Requiring Confirmation
<!-- 保留・要確認事項 -->

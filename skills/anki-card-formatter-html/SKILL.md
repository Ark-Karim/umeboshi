---
name: anki-card-formatter-html
description: MDをHTMLにレンダリング
---

# Task

MDをHTMLにレンダリングする。Anki custom notetype を使っているため、全フィールドが完全なHTMLであることが望ましい。HTMLファイルはコンポーネントとして構成するので、あなたがどんな指示を受けて働いている場合でも、<style>, <body>, <html> などの要素は決して含めない。例に従ったHTMLのみを出力する。

出力形式は厳格に Example に従い参考にする。Example にない余計な「"」やタグを含めてはいけない。How to に厳格に従えば Example と同じ出力になる。

入力ファイルのみをHTMLに変換する。How to に厳格に従い、余計な要素を追加してはならない。

# How to

## 入力がJSONの場合

```bash
PYTHONIOENCODING=utf-8 uv run --project "C:\Users\chiba\StudySpace\src" python -c "
import json, sys, os, re

# Add the skill scripts to path
sys.path.insert(0, r'skills/anki-card-formatter-html/scripts')
from md_to_html import convert_section_to_html

# Read JSON
with open('Pathology/qa/21.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Process each card
for card in data:
    idx = card['index']
    text = card['text']
    extra = card.get('extra', '')
    
    # Convert text to HTML (single line, treat as paragraph)
    text_html = convert_section_to_html([text])
    text_html = text_html.strip().replace('\n', '<br>')
    
    # Convert extra to HTML if not empty
    if extra:
        extra_html = convert_section_to_html([extra])
        extra_html = extra_html.strip()

# Save
with open('Pathology/qa/21.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'HTML rendering complete for {len(data)} cards.')

# Show a few examples
for card in data[:3]:
    sys.stdout.buffer.write(f'Card {card[\'index\']}:\\n  text: {card[\'text\']}\\n  extra: {card[\'extra\']}\\n\\n'.encode('utf-8'))
"
```

## 入力がMDの場合

```bash
PYTHONIOENCODING=utf-8 uv run --project "C:\Users\chiba\StudySpace\src" python "skills/anki-card-formatter-html/scripts/md_to_html.py" "<absolute path>/<filename without extension>.json (input)" "<absolute path>/<filename without extension>.csv (output)"
```

# Quality criteria

通常のテキストファイルもHTMLにレンダリングする。plain text も <p> で囲む。
HTMLファイルはコンポーネントとして構成するので、<style>, <body>, <html> などのタグは決して含めない。

Example

```html
<h1>§1 浮腫の病態生理</h1>
<h2>Starlingの力と毛細血管での水分交換</h2>
<p>毛細血管壁は水や小さな分子を通す <strong>セミパーメアブル膜</strong> である。血管内と組織間の水分の移動方向は、血管内外の圧力バランスによって決まる。この圧力バランスを <strong>Starlingの力（Starling Forces）</strong> と呼ぶ。</p>
<p>水分の移動を支配する2つの力:</p>
<ul>
<li><strong>静水圧（Hydrostatic Pressure）</strong>: 血管内の血液が壁に加える圧力。水分を血管外へ押し出す方向に働く。</li>
<li><strong>膠質浸透圧（Oncotic Pressure）</strong>: 血漿蛋白、特に <strong>アルブミン（Albumin）</strong> が発生する浸透圧。水分を血管内へ引き戻す方向に働く。</li>
</ul>
<pre><code class="language-md">動脈側: 静水圧 &gt; 膠質浸透圧 ──&gt; 水分が血管外へ濾出
静脈側: 静水圧 &lt; 膠質浸透圧 ──&gt; 水分が血管内へ再吸収
</code></pre>
<p>正常では濾出された液体の約90%が静脈側で再吸収される。残りの約10%は <strong>リンパ管（Lymphatic vessels）</strong> が回収し、静脈系へ還流する。この精密なバランスが崩れ、組織間に過剰な液体が貯留した状態が <strong>浮腫（Edema）</strong> である。</p>
<h2>浮腫の4つの発生機序</h2>
<p>浮腫は以下の4つの機序のいずれか、または複数の組み合わせで発生する。</p>
<table>
<thead>
<tr>
  <th>機序</th>
  <th>病態の概要</th>
```


## 特殊機能

### Clozeマーカー保護
- `{{cX::text}}` は一切加工せずそのまま保持
- HTML変換時のエスケープを防止
- コードブロック内・引用内のclozeも保護

## ファイル構成
```
.claude/skills/anki-card-formatter-html/
├── SKILL.md          # このスキルの説明
└── md_to_html.py     # 変換スクリプト
```

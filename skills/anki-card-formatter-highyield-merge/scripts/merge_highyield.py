#!/usr/bin/env python3
"""
High-Yield Summary マージスクリプト

CSV内のJSON行範囲参照を読み、サマリーファイルから該当行を抽出して
最終CSVを生成する。

Usage:
    python merge_highyield.py <input.json> <output.json> <summary_dir_path>
"""
import json
import sys
from pathlib import Path

# 1. 引数の受け取りとチェック
if len(sys.argv) >= 4:
    qa_path = Path(sys.argv[1])
    notes_path = Path(sys.argv[2])
    summary_dir = Path(sys.argv[3])  # 個別HTMLが格納されているディレクトリを指定させる
else:
    qa_path = Path(input("Input qaJsonPath: "))
    notes_path = Path(input("Input outputJsonPath: "))
    summary_dir = Path(input("Input highYieldSummaryDirectoryPath: "))

# 入力ファイルの存在確認
if not qa_path.exists():
    print(f"Error: Input file {qa_path} does not exist.")
    sys.exit(1)

# 2. JSONデータの読み込み
with open(qa_path, encoding='utf-8') as f:
    data = json.load(f)

replaced = 0
base_name = qa_path.stem

# 3. 各カードの処理
for card in data:
    hys = card.get('highYieldSummary', '')
    
    # 「§」で始まるか確認
    if isinstance(hys, str) and hys.startswith('§'):
        # 数字部分を抽出（前後の空白を削除）
        sect_num = hys.replace('§', '').strip()
        
        # 対応する HTML ファイルパスを特定
        html_path = summary_dir / f"{base_name}Sect{sect_num}.html"
        
        # HTML ファイルの内容を読み込み、上書き
        if html_path.exists():
            with open(html_path, encoding='utf-8') as f:
                card['highYieldSummary'] = f.read()
                replaced += 1
        else:
            print(f"Warning: {html_path} not found.")

# 4. 結果の保存
with open(notes_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("---")
print(f"Total cards: {len(data)}")
print(f"Replaced {replaced} JSON references")
print(f"Output: {notes_path}")
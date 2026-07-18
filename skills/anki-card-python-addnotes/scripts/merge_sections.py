#!/usr/bin/env python3
"""
汎用セクション統合スクリプト
§N 参照を HTML ファイル内容に解決する。

使用例:

引数:
  input_json    - 入力 JSON ファイルパス（例: output_dir/highYieldSummary/name.json）
  source_dir    - HTML ファイルが格納されているディレクトリ名（output_dir 相対）
  target_field  - §N 参照を解決する対象のフィールド名
  output_field  - HTML 内容を書き込むフィールド名（省略時は target_field を上書き）
  --output, -o  - 出力ファイルパス（省略時は stdout に出力）

パス解決: source_dir は input_json の2階層上（output_dir）からの相対パス。
  例: input_json=output_dir/highYieldSummary/name.json → source_dir は output_dir/{source_dir}/ を参照
"""

import json
import sys
from pathlib import Path


def merge_sections(input_path: str, source_dir_name: str, target_field: str, output_field: str | None = None, output_path: str | None = None) -> dict:
    """
    §N 参照を HTML ファイル内容に解決する。

    Args:
        input_path: 入力 JSON ファイルパス
        source_dir_name: HTML ファイルが格納されているディレクトリ名
        target_field: §N 参照を解決する対象のフィールド名
        output_field: HTML 内容を書き込むフィールド名（None の場合は target_field に上書き）
        output_path: 出力ファイルパス（None の場合は戻り値のみ返す）

    Returns:
        処理結果の辞書:
        - data: 処理済みカードデータのリスト
        - stats: {replaced, skipped_missing, skipped_no_ref} の統計
    """
    input_file = Path(input_path)
    base_name = input_file.stem
    summary_dir = input_file.parent.parent / source_dir_name

    # 書き込みキーが指定されていなければ、参照元フィールドを上書きする
    write_field = output_field if output_field else target_field

    with open(input_file, encoding='utf-8') as f:
        data = json.load(f)

    replaced = 0
    skipped_missing = 0
    skipped_no_ref = 0

    for card in data:
        value = card.get(target_field, '')
        if not isinstance(value, str) or not value.startswith('§'):
            skipped_no_ref += 1
            continue

        sect_num = value.replace('§', '').strip()
        html_path = summary_dir / f"{base_name}Sect{sect_num}.html"

        if html_path.exists():
            with open(html_path, encoding='utf-8') as f:
                card[write_field] = f.read()
                replaced += 1
        else:
            skipped_missing += 1
            print(f"警告: {html_path} が見つかりません", file=sys.stderr)

    stats = {
        "replaced": replaced,
        "skipped_missing": skipped_missing,
        "skipped_no_ref": skipped_no_ref,
        "total": len(data)
    }

    result = {"data": data, "stats": stats}

    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    else:
        print(json.dumps(data, ensure_ascii=False))

    print(f"統合完了 ({target_field} -> {write_field}): {replaced} 件解決, {skipped_missing} 件未発見, {skipped_no_ref} 件スキップ", file=sys.stderr)

    return result


def main():
    if len(sys.argv) < 4:
        print("使用法: python merge_sections.py <input_json> <source_dir> <target_field> [<output_field>] [--output <path>]", file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    source_dir = sys.argv[2]
    target_field = sys.argv[3]

    # ポジショナル引数またはオプション引数の解析
    output_field = None
    output_path = None

    # 残りの引数を処理
    remaining_args = sys.argv[4:]
    
    # --output / -o とその直後の値を除外して、output_field があるかチェックする
    skip_next = False
    clean_remaining = []
    
    for i, arg in enumerate(remaining_args):
        if skip_next:
            skip_next = False
            continue
        if arg in ('--output', '-o'):
            if i + 1 < len(remaining_args):
                output_path = remaining_args[i + 1]
                skip_next = True
            continue
        clean_remaining.append(arg)

    # 残った最初の引数があればそれを output_field とする
    if clean_remaining:
        output_field = clean_remaining[0]

    merge_sections(input_path, source_dir, target_field, output_field, output_path)


if __name__ == '__main__':
    main()

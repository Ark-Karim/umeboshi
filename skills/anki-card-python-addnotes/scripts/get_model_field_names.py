#!/usr/bin/env python3
"""
AnkiConnect を使用してノートタイプのフィールド名を取得するスクリプト。

Usage:
    uv run python get_model_field_names.py [model_name]

Example:
    uv run python get_model_field_names.py umeboshiKaname
    uv run python get_model_field_names.py  # 全ノートタイプの一覧を表示
"""

import json
import sys
import urllib.request


def anki_connect(action, params=None):
    payload = {"action": action, "params": params or {}, "version": 6}
    req = urllib.request.Request(
        "http://127.0.0.1:8765",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    try:
        result = anki_connect("version")
        print(f"AnkiConnect バージョン: {result['result']}")
    except Exception as e:
        print(f"エラー: AnkiConnect に接続できません: {e}", file=sys.stderr)
        sys.exit(1)

    if len(sys.argv) < 2:
        # 全ノートタイプの一覧を表示
        models = anki_connect("modelNames")["result"]
        print("\n利用可能なノートタイプ:")
        for name in sorted(models):
            print(f"  - {name}")
        return

    model_name = sys.argv[1]
    result = anki_connect("modelFieldNames", {"modelName": model_name})
    fields = result.get("result", [])
    print(f"\nノートタイプ '{model_name}' のフィールド:")
    for i, field in enumerate(fields, 1):
        print(f"  {i}. {field}")


if __name__ == "__main__":
    main()

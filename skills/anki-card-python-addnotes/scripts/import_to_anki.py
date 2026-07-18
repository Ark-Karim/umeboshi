#!/usr/bin/env python3
"""
AnkiConnect を使用して JSON ファイルからノートを Anki にインポートするスクリプト。

Usage:
    uv run python import_to_anki.py <json_path> <deck_prefix>

Example:
    uv run python import_to_anki.py notes/merged.json "Active::Public health::07"
"""

import json
import sys
import urllib.request
import urllib.error

ANKI_CONNECT_URL = "http://127.0.0.1:8765"
MODEL_NAME = "umeboshiKaname"


def invoke(action, params=None):
    """AnkiConnect API を呼び出す。"""
    payload = {"action": action, "version": 6}
    if params:
        payload["params"] = params

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ANKI_CONNECT_URL,
        data=data,
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"Error: AnkiConnect に接続できません: {e}")
        sys.exit(1)

    # エラーの表示
    if result.get("error"):
        err = result["error"]
        res = result.get("result")
        if res is None:
            # 全重複 or 完全な失敗
            # エラーメッセージを返す（呼び出し元で処理）
            return {"_error": err}
        # 部分的な成功（重複など）: result は配列
    return result.get("result")


def create_deck(deck_name):
    """デッキを作成する（既存の場合は何もしない）。"""
    result = invoke("createDeck", {"deck": deck_name})
    if result is not None:
        print(f"  Deck ready: {deck_name}")


def add_notes(deck_name, notes):
    """ノートをバッチで追加する（最大 100 件ずつ）。"""
    total_created = 0
    total_skipped = 0
    total_failed = 0

    for i in range(0, len(notes), 100):
        batch = notes[i : i + 100]
        anki_notes = []
        for note in batch:
            anki_notes.append(
                {
                    "deckName": deck_name,
                    "modelName": MODEL_NAME,
                    "fields": {
                        "text": note.get("text", ""),
                        "extra": note.get("extra", ""),
                        "imagesExtra": note.get("imagesExtra", ""),
                        "highYieldSummary": note.get("highYieldSummary", ""),
                        "visualAids": note.get("visualAids", ""),
                        "visualAidsExtra": note.get("visualAidsExtra", ""),
                        "additionalResources": note.get("additionalResources", ""),
                        "level": note.get("level", ""),
                        "oneByOne": note.get("oneByOne", "y"),
                        "umeboshiNoteId": note.get("umeboshiNoteId", ""),
                    },
                    "tags": [],
                    "options": {"allowDuplicate": True},
                }
            )

        result = invoke("addNotes", {"notes": anki_notes})

        # 全重複 or API エラー
        if isinstance(result, dict) and "_error" in result:
            err_msg = result["_error"]
            if "duplicate" in str(err_msg).lower():
                print(f"  Batch {i // 100 + 1}: {len(batch)} duplicates (all skipped)")
                total_skipped += len(batch)
            else:
                print(f"  Batch {i // 100 + 1}: API error: {err_msg}")
                total_failed += len(batch)
            continue

        if result is None:
            print(f"  Batch {i // 100 + 1}: API error (null result)")
            total_failed += len(batch)
            continue

        created = sum(1 for r in result if r is not None)
        duplicates = sum(1 for r in result if r is None)
        total_created += created
        total_skipped += duplicates
        print(
            f"  Batch {i // 100 + 1}: {created} created, {duplicates} duplicates"
        )

    return total_created, total_skipped, total_failed


def main():
    if len(sys.argv) < 3:
        print("Usage: uv run python import_to_anki.py <json_path> <deck_prefix>")
        print("Example: uv run python import_to_anki.py notes/merged.json \"Active::Public health::07\"")
        sys.exit(1)

    json_path = sys.argv[1]
    deck_prefix = sys.argv[2]

    # Read JSON
    with open(json_path, "r", encoding="utf-8-sig") as f:
        notes = json.load(f)

    print(f"Loaded {len(notes)} notes from {json_path}")

    # Group by level
    levels = {}
    for note in notes:
        level = note.get("level", "unknown")
        if level not in levels:
            levels[level] = []
        levels[level].append(note)

    print(f"Levels: {', '.join(f'{k}({len(v)})' for k, v in sorted(levels.items()))}")

    # Process each level
    grand_total_created = 0
    grand_total_skipped = 0
    grand_total_failed = 0

    for level in sorted(levels.keys()):
        deck_name = f"{deck_prefix}::{level}"
        level_notes = levels[level]

        print(f"\n[{level}] {len(level_notes)} notes -> {deck_name}")

        # Create deck
        create_deck(deck_name)

        # Add notes
        created, skipped, failed = add_notes(deck_name, level_notes)
        grand_total_created += created
        grand_total_skipped += skipped
        grand_total_failed += failed

    print(f"\n{'='*50}")
    print(f"Total: {grand_total_created} created, {grand_total_skipped} skipped, {grand_total_failed} failed")
    print(f"Input: {len(notes)} notes")


if __name__ == "__main__":
    main()

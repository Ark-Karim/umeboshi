---
name: python-uv-run
description: Python実行時は必ず.pyファイルを./src/temp/に書き出し、UVで実行する
---

## Task
Pythonコードを実行する際は、以下の手順を必ず守る。

## 手順
1. Pythonコードを `./src/temp/<name>.py` に書き出す（ファイル名は処理内容を示す簡潔なもの）
2. `uv run --project ./src python ./src/temp/<name>.py` で実行する
3. ワンライナーや `-c` での直接実行は禁止

## 注意
- 一時ファイルは処理完了後も削除せず残す（再利用・デバッグのため）
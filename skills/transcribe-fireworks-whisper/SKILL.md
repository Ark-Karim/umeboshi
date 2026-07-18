---
name: transcribe-fireworks-whisper
description: 音声ファイル（mp3, wav, flac, opus, m4a, aac, ogg等）をFireworks Whisper APIで文字起こしする。音声のテキスト化、文字起こし、transcribe、書き起こし、speech-to-text の依頼でこのスキルを呼び出す。
---

## Task
ユーザーが指定した音声ファイルを Fireworks Whisper API を用いて文字起こしし、結果を `Script/` ディレクトリにテキストファイルとして保存する。

## Prerequisites
- `env/fireworks.env` に `FIREWORKS_API_KEY` が設定されていること
- FFmpeg がインストールされていること（非WAV/FLAC/MP3ファイルの変換に使用）
- Python 依存: `requests`（`pyproject.toml` に記載済み）

## CoT

### 1. 入力の確認
- ユーザーが指定した音声ファイルのパスを特定する
- ファイルの存在を確認する
- 出力形式を決定する（指定がなければ `text`）

### 2. スクリプト実行
Python実行は `/python-uv-run` に従い、以下のコマンドを実行する:

```powershell
uv run --project ./src python ./src/temp/transcribe_audio.py "<入力ファイルパス>" --language ja --yes
```

オプション:
- `--model whisper-large-v3-turbo` : 高精度モデル（デフォルトは `whisper-v3-turbo`）
- `--format srt` : 字幕形式で出力
- `--format vtt` : WebVTT字幕形式で出力
- `--format verbose_json` : セグメント・タイムスタンプ付きJSON
- `--language en` : 言語指定（未指定時は自動検出）
- `--prompt "..."` : 専門用語や文脈のヒント
- `--output <path>` : 出力パスを明示指定
- `--keep-wav` : 変換後WAVを保持（デバッグ用）
- `--clean` : 文字起こし後に繰り返しノイズを自動除去（元ファイルは `.raw.txt` にバックアップ）

### 3. 出力の後処理

- **文字起こし後処理スクリプト**: `./src/temp/clean_transcription.py` で以下の修正を自動実行:
    - Whisperトークンマーカー（U+E000）の除去
    - 日本語文字間の半角スペース削除
    - 文の切れ目（。！？）への改行挿入
    - ハルシネーションによる繰り返しノイズの除去
    ```powershell
    uv run --project ./src python ./src/temp/clean_transcription.py <ファイルパス>
    uv run --project ./src python ./src/temp/clean_transcription.py --all  # Script/配下の全txt
    処理前に <ファイル名>.raw.txt にバックアップを作成する。

- 文字起こし結果が `Script/<元ファイル名>.txt` に保存されたことを報告する


## Output
- デフォルト出力先: 入力ファイルからの相対パスで以下に保存 `../Script/<入力ファイル名（拡張子除く）>.txt`
- 出力形式: UTF-8 テキスト

## Edge Cases
- **FFmpeg 不在**: `winget install ffmpeg` または `choco install ffmpeg` でのインストールを案内する
- **APIキー未設定**: `env/fireworks.env` に APIキーを設定するよう案内する
- **APIエラー (401)**: APIキーの有効性を確認するよう案内する
- **APIエラー (413)**: ファイルが1GBを超える場合、分割を提案する
- **APIエラー (429)**: レート制限。しばらく待ってから再試行する
- **タイムアウト**: 大きいファイルの場合 `--model whisper-v3-turbo` で高速処理を試す

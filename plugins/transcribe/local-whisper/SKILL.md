---
name: transcribe-local-whisper
description: Local Whisper transcription backend (English default, no API key)
interface: plugins/transcribe
---

# Local Whisper — Transcribe Backend

ローカルの Whisper モデルを使って音声を文字起こしします。
API キー不要、GPU があれば高速に動作します（CPU でも可）。

## Prerequisites

- **Python 3.10+**
- **openai-whisper** Python パッケージ
- **FFmpeg**（音声ファイルのデコード用）

### インストール

```bash
# macOS
brew install ffmpeg
pip install openai-whisper

# Windows (PowerShell)
winget install ffmpeg
pip install openai-whisper

# Ubuntu/Debian
sudo apt install ffmpeg
pip install openai-whisper
```

### モデル選択

初回実行時に Whisper モデルが自動ダウンロードされます。
デフォルトは `medium`（英語で十分な精度、~1.5GB）。

| モデル | サイズ | メモリ | 速度 | 用途 |
|--------|--------|--------|------|------|
| `tiny` | ~75MB | ~1GB | 最速 | テスト用 |
| `base` | ~150MB | ~1GB | 速い | 簡易文字起こし |
| `small` | ~500MB | ~2GB | 普通 | 英語（十分な精度） |
| `medium` | ~1.5GB | ~5GB | やや遅い | 英語（高精度） |
| `large-v3` | ~3GB | ~10GB | 遅い | 多言語・最高精度 |

## CoT

### 1. 入力ファイルの確認

ユーザーが指定した音声ファイルの存在を確認します。

サポート形式: mp3, wav, m4a, ogg, flac, aac, opus

### 2. FFmpeg で音声を WAV に変換（必要に応じて）

```bash
ffmpeg -i "<input_file>" -ar 16000 -ac 1 -c:a pcm_s16le "<working_dir>/Script/<basename>_temp.wav" -y
```

### 3. Whisper で文字起こし

```bash
python -c "
import whisper
model = whisper.load_model('medium')
result = model.transcribe(r'<working_dir>/Script/<basename>_temp.wav', language='en')
with open(r'<working_dir>/Script/<basename>.txt', 'w', encoding='utf-8') as f:
    f.write(result['text'])
print(f'Transcribed {len(result[\"text\"])} characters')
"
```

言語指定がある場合（`--language ja` など）:
- モデルを `large-v3` に変更
- `language` パラメータを指定されたコードに設定

### 4. 結果確認と一時ファイル削除

出力ファイル `<working_dir>/Script/<basename>.txt` が生成されたことを確認します。
一時 WAV ファイルを削除します。

## Output

- `<working_dir>/Script/<basename>.txt` — UTF-8 テキスト

## Cost

無料（ローカル実行のため）。
- モデル初回ダウンロード: ~1.5GB (medium) 〜 3GB (large-v3)
- 処理時間: 90分の講義 → 約5〜15分（GPU 有無で変動）
- 電力コスト以外の追加料金なし

## Limitations

- **英語以外の精度**: medium モデルは英語に最適化。日本語等は `large-v3` + `--language ja` 推奨
- **ノイズ耐性**: 講義音声の品質が悪い場合、精度が下がる
- **GPU メモリ**: large-v3 は ~10GB VRAM 要求。非搭載の場合は medium 推奨

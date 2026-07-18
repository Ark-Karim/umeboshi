---
name: ejs-integration-check
description: EJSテンプレートのinclude依存関係を検証する。EJSファイル変更後、ビルド前、統合テスト時に実行する。グローバル変数の定義順序、未定義参照の有無、循環依存を検出する。
---

# EJS Integration Check

EJSテンプレートのinclude依存関係を自動検証するスキル。

## 実行タイミング

- EJSコンポーネントを新規作成・変更した直後
- `npm run build` の実行前
- プルリクエスト作成前の確認

## 検証手順

### Step 1: include関係の抽出

各notetypeの`front.ejs`と`back.ejs`からinclude文を抽出し、読み込み順序を構築する。

```
<%- include('src/components/umeboshiLocalStorage.ejs') %>
<%- include('src/components/umeboshiSync.ejs') %>
```

### Step 2: グローバル変数の定義・参照チェック

各コンポーネントが公開するグローバル変数（`var X = (function(){...})()`パターン）を定義側から抽出する。

参照側のコードをgrepし、定義より前に参照がないか検証する。

**検出パターン:**
- `UmeboshiSync` の定義前に `UmeboshiSync.` を呼び出し
- `UmeboshiStorage` の定義前に `UmeboshiStorage.` を呼び出し
- `UmeboshiLLM` の定義前に `UmeboshiLLM.` を呼び出し

### Step 3: ビルドによる最終確認

`npm run build` を実行し、エラーなくテンプレートが生成されることを確認する。

### Step 4: 生成HTMLの検証

ビルド後のHTMLに対し、主要グローバル変数の出現順序をgrepで確認する。

```bash
grep -n "var Umeboshi" "Note Types/Umeboshi-Kaname/Front Template.html"
grep -n "var Umeboshi" "Note Types/Umeboshi-Kaname/Back Template.html"
```

## 修正方法

include順序の問題を検出した場合、対象notetypeの`front.ejs`または`back.ejs`に不足しているincludeを追加する。

**追加位置の原則:**
- 依存先コンポーネントは、依存元コンポーネントの前に配置する
- `umeboshiLocalStorage.ejs` は常に最初に配置する
- `umeboshiSync.ejs` は `umeboshiLocalStorage.ejs` の直後に配置する

## 例

**問題:** `umeboshiFirstRun.ejs`が`UmeboshiSync.pullFromCloud()`を呼び出すが、`front.ejs`に`umeboshiSync.ejs`のincludeがない。

**修正:** `front.ejs`に以下を追加する。

```ejs
<%- include('src/components/umeboshiLocalStorage.ejs') %>
<%- include('src/components/umeboshiSync.ejs') %>
<%- include('src/components/umeboshiFirstRun.ejs') %>
```

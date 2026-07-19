<%#
ワンバイワン表示の設定ファイル

# Parameters
- clozeHider: string — cloze非表示時のテキスト（デフォルト: "　🌺　"）
- selective?: boolean — 選択的ワンバイワンを有効にするか
_%>
<%_
  var clozeHider = clozeHider === undefined ? "　🌺　" : clozeHider
_%>

// ##############  CLOZE ONE BY ONE 設定  ##############

// === ショートカットキー設定 ===
var revealNextShortcut = "N"           // 次のcloze表示
var revealNextWordShortcut = "Shift + N"  // 次の単語表示
var toggleAllShortcut = ","            // 全cloze表示トグル

// === 表示モード設定 ===
// "cloze": cloze単位で表示、"word": 単語単位で表示
var revealNextClozeMode = "cloze"

// === cloze非表示時のテキスト ===
var clozeHider = (elem) => "<%- clozeHider %>"
/*
以下のようにカスタマイズ可能:
// 固定長:
var clozeHider = (elem) => "███"
// 文字数に応じたブロック:
var clozeHider = (elem) => "█".repeat(elem.textContent.length)
// 空白を表示:
var clozeHider = (elem) => "[" + elem.textContent.split(" ").map((t) => "█".repeat(t.length)).join(" ") + "]"
// 色付きボックス（画像は非表示にならない）:
var clozeHider = (elem) => `<span style="background-color: red; color: transparent;">${elem.innerHTML}</span>`
*/

// === 選択的ワンバイワン設定 ===
// 有効にすると、one-by-oneフィールドで指定した番号のclozeのみ表示
// 例: "1,3" → c1とc3のみワンバイワン
var selectiveOneByOne = <%- locals?.selective ? true : false -%>;
// 選択的モード無効時: ワンバイワンを有効にする最低cloze数
// 0またはfalsy値でこの設定を無効化
var minNumberOfClozes = 0;

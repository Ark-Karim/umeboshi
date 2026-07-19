---
name: anki-card-formatter-visualaids
description: null
---

# Task

Create `visualAids` for related content.
<!-- 関連する内容についてvisualAidsを作成する -->

## Requirements (MUST / NEVER / SHOULD / COULD)

### MUST

- Use `<h3>` to give the story a literary title.
- Strictly follow `/html-formatter` (skills/html-formatter/SKILL.md).
- Write only the story content directly. Do NOT include meta-words like "story", "summary", or "highYieldSummary" anywhere in the output.
- Insert a half-width space ` ` or a Japanese comma `、` at semantic breaks roughly every 10--20 characters to improve readability.
- Generate in Japanese. Do NOT use any other languages like Chinese, Korean, or Spanish.
- Convert extracted elements into a concrete, memorable story or scene -- not diagrams or flowcharts. Aim for "a movie scene", "a protagonist's life", or "a romance drama" that appeals to emotion and the five senses.
- Use narrative format. Stories that involve emotion and human/animal action, thought, and feeling are preferred over dry scene description.
- Assign exactly one emoji to each character or object, and always append that emoji next to the character/object name whenever it appears.
- Map each metaphor to its corresponding textbook term explicitly each time a new term appears. Use the format: `metaphor emoji (textbook term)`. Example: 「一筋の矢🎯（イマチニブ）を放った」.
- Follow the literary author settings per section number. When generating multiple visualAids, choose a different setting for each source file processed:
    - SS1: Fyodor Dostoevsky
    - SS2: Leo Tolstoy
    - SS3: Ernest Hemingway
    - SS4: Gabriel Garcia Marquez
    - SS5: Osamu Dazai
    - SS6: Milan Kundera
    - SS7: Franz Kafka
    - SS8: Kurt Vonnegut
    - SS9: Fyodor Dostoevsky
    - SS10: Leo Tolstoy
    - SS11: Ernest Hemingway
    - SS12: Gabriel Garcia Marquez
    - (cycle continues ...)
- Refer closely to the output examples as a model.
<!-- MUST要件：h3で文学的なタイトル、html-formatter準拠、メタ語排除、10-20字ごとの空白挿入、日本語のみ、情景・物語形式、絵文字付与、用語対応の明記、セクションごとの文学者設定、出力例の参照 -->

### NEVER

- Do NOT include words like "story", "summary", or "highYieldSummary" -- only the story content itself.
- Do NOT include specific author names like "Dazai Osamu" in the output.
- Do NOT use any language other than Japanese.
<!-- NEVER要件：メタ語禁止、作家名の記載禁止、日本語以外の使用禁止 -->

### SHOULD

- Make characters and objects as absurd, humorous, eerie, or ironic as possible to create strong memory hooks (Imaginative Trigger).
- The story does NOT need to be exhaustive. Narrow the focus to a partial slice of the content, following the examples.
- Target **400--1000 characters**.
<!-- SHOULD要件：不条理・ユーモラスで記憶フック、網羅的でなく一部に絞る、400-1000字 -->

## Chain of Thought

1. **Extract key elements from the source.** Identify which concepts, terms, relationships, or mechanisms will serve as the core material for the visualAid.
   <!-- ソースから主要要素を抽出する -->
2. **Transform into a concrete scene or metaphor.** Convert the extracted elements into a vivid, memorable story or scene -- not a diagram or flowchart. Prefer "a movie scene", "a protagonist's life", or "a romance drama" that appeals to emotion and the five senses. Use narrative format; stories involving emotion and human/animal action, thought, and feeling are preferred.
   <!-- 抽出要素を具体的な情景・物語に変換する -->
3. **Assign one emoji to each character or object.** Every character and object in the story receives exactly one emoji, consistently used whenever that element appears.
   <!-- 各登場人物・オブジェクトに絵文字を割り当てる -->
4. **Map each metaphor to textbook terms explicitly.** Every time a new term is introduced, state the correspondence in `metaphor emoji (textbook term)` format. Example: 「一筋の矢🎯（イマチニブ）を放った」.
   <!-- 比喩と教科書用語の対応を明記する -->
5. **Apply the literary author setting per section number.** Match the tone, style, and narrative sensibility to the assigned author for the section (SS1 Dostoevsky, SS2 Tolstoy, etc.).
   <!-- セクション番号に応じた文学者設定を適用する -->
6. **Insert whitespace every 10--20 characters for readability.** At semantic breaks, insert a half-width space ` ` or a Japanese comma `、` to make the text easier to scan.
   <!-- 10-20字おきに余白を挿入して読みやすくする -->
7. **Output as HTML with an `<h3>` literary title.** The title should set the tone for the story without being a dry label. All story content is wrapped in `<p>` tags. Use `/html-formatter` for HTML structure.
   <!-- h3の文学的タイトルを含むHTMLとして出力する -->

## Quality Criteria

### MUST (detailed)

- **Literary `<h3>` title:** The title must feel like a novel chapter or short story title, not a clinical heading.
- **`/html-formatter` compliance:** All HTML output must strictly follow the rules in `skills/html-formatter/SKILL.md`.
- **No meta-words:** The output must NOT contain framing language like "here is a story about...", "summary:", or "visualAid:". The story content begins immediately.
- **Whitespace at semantic breaks:** A half-width space ` ` or Japanese comma `、` must appear roughly every 10--20 characters where the meaning naturally pauses. See examples below.
- **Japanese only:** The output language is Japanese; do not mix in other languages.
- **Scene/metaphor transformation:** Output must be a visceral scene or narrative, not a structural diagram. Flat, mechanical description is insufficient -- the story should evoke feeling.
- **Narrative with emotion/action:** The story should involve characters doing, thinking, or feeling something, not just describing a static scene.
- **Emoji consistency:** Each object/character gets exactly one emoji and it appears alongside every occurrence of that element in the text.
- **Term mapping on first use:** Every textbook term introduced into the metaphor must be mapped explicitly in `metaphor emoji (term)` format the first time it appears.
- **Literary author setting:** The tone, pacing, and narrative approach must reflect the assigned author for the current section number.
<!-- 詳細なMUST品質基準：タイトル、html-formatter準拠、メタ語排除、余白挿入、日本語限定、情景変換、感情・行動を伴う物語、絵文字の一貫使用、用語対応の初出明記、文学者設定の反映 -->

### SHOULD (detailed)

- **Imaginative Trigger (memory hook):** Characters and objects should be absurd, humorous, eerie, or ironic -- the more memorable and unusual, the stronger the mnemonic effect.
- **Selective focus over exhaustiveness:** Do not try to cover everything. Pick the most striking or central relationship and build the story around that narrow slice.
- **Length range:** Keep the story between 400 and 1000 characters (approximately). Overly short stories lack narrative depth; overly long ones dilute the mnemonic punch.
<!-- 詳細なSHOULD品質基準：不条理・ユーモラスな記憶フック、網羅的でない選択的焦点、400-1000字の長さ -->

### Whitespace insertion examples

- `<p>原発性糸球体腎炎は 腎臓そのものが病気の主役であるため、ステロイド薬や 免疫抑制薬を使って、腎臓で起きている炎症を直接抑え込む治療が 中心になる。</p>`
- `<p>二次性糸球体腎炎は、根本にある原疾患の制御が必須となる。例えば糖尿病性腎症であれば、腎臓だけを治療しても意味がなく 根本にある血糖値をコントロールしなければ 腎臓の機能は良くならない。</p>`
<!-- 余白挿入の具体例 -->

## Output Examples

```html
<h3>ドクター・シャベルの静かなる爆破</h3>
<p>胃の沼は暗く、深く、酸の泡を上げていた。そこへ潜水マスクをかぶったドクター・シャベルがやってきた。彼の仕事は、この沼に巣食う不気味な海賊船と戦うことだ。</p>
<p>沼の表面には、いまにも沈みそうな「海賊船のデッキ⛵」が見えていた。これが早期がんだ。まだ浅いところに浮いているだけで、奥までは達していない。ドクター・シャベルは「軽いシャベル🥄」を取り出した。そして、デッキの上だけをサッと器用に削り取った。これが内視鏡的切除（ESD/EMR）だ。沼を荒らすこともなく、静かに、きれいに、悪い部分だけが消え去った。</p>
<p>しかし、沼の底深くには、もう一つの敵が隠れていた。頑丈な「岩盤🪨に突き刺さった船の錨⚓」 ── 進行がんだ。病の根っこは、すでに組織の奥深くへ強固に食い込んでいる。こうなると、表面をいくら軽いシャベルでこすっても意味がない。</p>
<p>ドクター・シャベルは決断し、大きな「巨大なダイナマイト💥」を抱えて潜った。これが外科手術（開腹・腹腔鏡）だ。彼は錨のまわりの岩盤ごと、一気に爆破した。激しい衝撃とともに、深い根は完全に吹き飛ばされた。</p>
<p>浅い汚れをすくい取る知恵と、深い根を断つ覚悟。どちらも命を救うために必要な闘いだった。</p>
```
```md

ドクター・シャベルは、不気味な胃袋の輪郭を持つ研究所の重い扉を押し開けた。そこは、生命の秩序を歪める分子怪獣たちが、それぞれの宿命に従って息を潜める恐るべき深淵だった。

入り口の足元で、シャベルは危うくバランスを崩しかけた。そこには「崩れかけのブロック🧱」が、秩序を失ったまま不安定に積み上がっていた。染色体不安定型（腸型）の怪獣だ。土台は常にガタガタと揺らぎ、自らの形を維持する能力すら失っている。絶え間ない自己崩壊の予感に震えながらも、増殖を止められないその姿に、シャベルは生命の盲目的な執着を見て取った。

さらに奥の通路へと進むと、今度は一転して、冷酷な沈黙が彼の行く手を阻んだ。壁全体が、意思を持たない「頑固な石像🗿」によってガチガチに硬化させられていた。ゲノム安定性型（スキルス）の怪獣である。構造そのものは変化しないが、周囲の組織を鉄のように硬く閉ざし、いかなる侵入者も、そしていかなる救いの手も寄せ付けない。この絶対的な拒絶の硬さに、シャベルの胸には重苦しい圧迫感が広がった。

ふと見上げると、研究所の最上階である屋上（噴門部）から、冷たい怪気流が吹き下ろしていた。「ウイルスの王冠👑」──EBV陽性型がそこに君臨していた。しかし驚くべきことに、その玉座の周りには、怪獣の暴挙を阻もうと集まった「大量の警備員（リンパ球）👥」が、激しい怒りをもって取り囲んでいた。敵と味方が入り乱れ、互いを貪り尽くそうとする凄まじい攻防の熱気に、シャベルは生命が持つ特有の激突を見た。

凍りつくような暗い地下室へと降りたシャベルは、その片隅で凄惨な光景を目撃し、激しい嫌悪感を覚えた。そこには、血にまみれた「未熟な赤ちゃん👶」がうずくまり、生々しいレバー（肝臓）を貪り食っていた。AFP産生胃がんであった。誕生の祝福を受けぬ未熟な姿でありながら、血の匂いを本能的に嗅ぎつけ、容赦なく肝臓へと這い寄っていくその姿には、容赦のない破壊の本能が宿っていた。

その隣の檻からは、鼻を突く猛毒の煙が立ち上っていた。そこにのたうっていたのは、皮膚を粟立たせるほど「不気味な毛虫🐛」、すなわち絨毛がん（HCG産生）だ。極めて高い悪性度を誇り、触れるものすべてを侵食し、灰に変えていくその暴力的な生命力に、シャベルは強い戦慄を覚えた。

だが、シャベルが最も五感を研ぎ澄ませたのは、それらの派手な怪物たちではなかった。壁のわずかな隙間に、じっとこちらを凝視する「忍者の目👁️」があった。胃底腺型胃がだ。それはあまりに周囲の正常な壁に深く溶け込んでおり、注意深く探さなければ完全に存在を見逃され、背後から致命傷を負わされることになる。その一瞬の油断も許さない狡猾さに、シャベルの背筋に冷たい汗が流れた。

ドクター・シャベルは、この一筋縄ではいかない分子怪獣の研究所の闇を睨みつけ、手術刀を握る手に力を込めた。再び、生と死の厳粛な戦いが始まるのだ。

---

私は息を潜め、その粘つく湿った胃壁の裂け目にうずくまっていた。眼前に広がるのは、私の理性を狂わせる、身の毛もよだつ戦場だ。

北を見よ！そこには、凍りついた規律に支配された「結晶の兵隊個々の集団🪆」が、不気味なほど整然と並んでいる。彼らは互いの手を引きちぎらんばかりに握りしめ、強固な壁を築いていた。そのあまりに頑なな結束に、私は息が詰まる。だが次の瞬間、私は叫びそうになった。隊列の奥から、狂乱した「翼の生えた乳頭型の偵察兵🕊️」どもが突如として飛び立ったのだ。彼らは私の目の前をかすめ、脈打つ赤き川（血管）へと次々に身を投げ、激流に呑まれながら、遥か彼方の「巨大なレバーの城（肝臓）🏰」を目指して突き進んでいった。あの狂信的な眼を、私は生涯忘れない。

恐怖に震えながら南へ目を転じた私は、さらに深い絶望に囚われた。そこにいたのは、決まった形を持たない不条理な「アメーバ状の白い影群👻」だ。若く、冷笑的で、何の統率もない。彼らは私の足元で静かに潜んでいるように見えた。しかし違ったのだ！彼らは泥土（粘膜）の裏側へと回り込み、私の見えない地下道を「アリの群れ🐜」となって、四方八方へじわじわと、容赦なく侵食していた。私の立っている足場そのものが、すでに彼らに食い荒らされていることに気づき、私は慄然とした。

そして、その闇の最も深い底から、あの呪われた怪物が這い出してきた。内側にネバネバした粘液を限界まで溜め込み、自らの核を端へ無残に押しやった、あの「歪んだ形の指輪💍」だ。それは己の肥大した執着に耐えかねたように、私の目の前で、凄まじい音を立てて粉々に砕け散った！
破片となった怪物どもは、胃の荒野の底を容赦なく突き破る。そして、その下層に広がる「広大な腹腔の網（腹膜）🕸️」へと、容赦なく、バラバラに降り注いでいった。私はただ、その破滅の雨を呆然と見上げるしかなかった。


---

胃底の精製室という名の、陰鬱で、しかし奇妙に熱を帯びた、あの屋根裏部屋のような空間での出来事である。

部屋の中央には、この宿主の生命を文字通り物質的に支えていた「酸のブースターエンジン⚙️」（壁細胞）が、煤に汚れながらも規則正しく並んでいた。そこへ、自己の内部から湧き出した、あの忌まわしい「裏切りの自己クローン騎士軍団👥」（自己抗体）が、まるで何かに取り憑かれたような足取りで乱入してきた。彼らは、狂信的な情熱をもって大型のピッケルを振り上げ、自らの拠り所であるはずのエンジンを、容赦なく、完全に叩き壊していった。彼らの目には、自己破壊の快楽さえ浮かんでいた。

すべてのエンジンが冷たく沈黙し、部屋の「酸のエネルギー残量計（胃酸）」が完全にゼロになったその瞬間、天井の暗がりに据え付けられたコントロールユニットが、恐ろしいまでの正確さで異常を検知した。そして、神経を逆なでするような「緊急指令シグナル（ガストリン）の赤ランプ🚨」が、不気味な光を激しく、そして執拗に放ち始めた。それは、機能の喪失を埋め合わせようとする、生体の狂気じみた叫びであった。

この過剰で、やむことのない警告の光を浴び続けた結果、部屋の隅の暗い培養槽に潜んでいた「燃料精製ドロイド（ECL細胞）🤖」たちの理性がついに崩壊した。彼らは強迫観念に駆られたように、異常な分裂と増殖（過形成）を繰り返し、部屋の隙間を埋め尽くしていった。そしてその果てに、もはや元の姿を留めない、制御不能となった「巨大な変異モンスター（NET）👾」へと姿を変え、この絶望的な空間を完全に占拠してしまったのである。

---

港は霧に包まれ、無数の漁師たちがそれぞれの網を広げていた。観察官は、その漁師たちが何年ずつ海にいたかを数えなければならなかった──それが「人年法（Person-Years Method）」と呼ばれる計算の仕事だった。

漁師たちは皆、同じように長く海にいるとは限らなかった。ある者は途中で「壊れた船🚤」に乗り換えて港に帰ってしまう。途中脱落（Loss to follow-up）だ。観察官は、その漁師が港に帰った正確な時刻を記録するが、もし帰った時刻が分からなければ「半日扱い（0.5年）」と書くのが、この港のしきたりであった。

漁師たちの網は二種類あった。一本目は「獲物の網🐟」──罹患率の分母だ。この網は、魚（疾患）がかかるまでの時間だけを測る。魚がかかった瞬間、その漁師の網はもう観察対象から外れる。もう一本は「死の網💀」──死亡率の分母だ。こちらは漁師が死ぬまで、たとえ魚に蝕まれようと網に残り続ける。同じ漁師でも、二つの網で数える時間が違って見える。これこそが罹患率と死亡率で人年が異なるという、港に伝わる不思議な教訓であった。

観察官は老いた数学士に尋ねた。この計算には何か罠はないかと。数学士は首を振った。「この計算は、海の流れが一定だと思い込んでいる。潮の満ち引き、季節の荒波──それは眼中ない。大勢の漁師なら平均化できるが、たった数人では、海の気まぐれに翻弄されるぞ」。人年法の限界──時間とともに変化するリスクを、この方法は等閑に付すのだ。

---

二つの研究者が、同じ問題を違った角度から見つめていた。

左に立つのは、鏡を手にした男──ドクトル・ルックバック（症例対照研究🪞）。「病に倒れた者を見つければ、その過去に原因があるはずだ」と彼は呟いた。彼の目には「今」から「過去」への矢印が浮かんでいた。彼の武器は「オッズ比」──天秤の傾きだけで関連の強さを測る。低頻度の病でも、少ない人数で短期間に答えが出る。しかし、彼の手には届かないものがある。「全体の中でこの原因がどれだけ悪さをしたか」──要因寄与割合。天秤は傾きを示すが、分母が見えないのだ。

右に立つのは、望遠鏡を抱えた男──ドクトル・フューチャー（コホート研究🔭）。「健康な者を二列に並べ、未来を見届ける」と彼は宣言した。彼の目には「過去」から「未来」への矢印が刻まれている。彼の武器は「相対危険度」──二つの発生率の比。そして彼だけが持つ特別な力がある。母集団の中で要因がどれだけ寄与したかを割り出す「要因寄与割合」だ。ただし彼の方法は時間がかかる。人を多数集め、長期間追跡しなければならない。

二人が声を揃えて言った。「疾患が珍しく、時間がなければ、鏡を使え。疾患が多く、要因の全体像を知りたければ、望遠鏡を使え」。

さらに二人の間に、小さな真理が浮かび上がった。稀な病気の発生数が極めて少ない場合、鏡で測った「オッズ比」は望遠鏡で測った「相対危険度」にほぼ等しい値を示す──二つの武器が、暗がりの中でそっと名を交換するのだ。稀な病なら、天秤の傾きはほぼそのまま発生率の比と等しくなる。

---

川の流れのように、医療費は国の中を流れていた。

その川に架かる橋の欄干は「年齢の階段🧓」だった。子供たちは二割の橋を渡り、成人は三割、七十歳以上の老人はまた二割へ──ただし「現役並みの鎧💼」を纏った者は三割のままだった。

川の上流には「財源の泉⛲」が二つあった。一つは「保険料の湧き水💧」──全体の半分を占める。もう一つは「公費の雨水🌧️」──四割を注ぐ。残りの一割は「患者の雫🩸」──自らの手から零れ落ちる雫であった。この川の水は現金ではなく、医療サービスそのもの──「現物の水💧」として国民に届けられていた。

川の下流域で最も重い荷を抱えて流れていたのは「老いの舟🕞」──75歳以上の医療費は一人当たり94.1万円。若い舟の4.5倍もの重さを、静かに、ただ黙って曳いていた。また、病の種類では「血管の怪物🫀」（循環器系疾患）が最も多くの水を飲み、「腫瘍の影🕯️」（新生物）が65歳未満で最も支配的だった。

```

```html

<h3>未だ終わらぬ夜明けのために —— 漁師が繰り返す五つの思考</h3>
<p>海辺の小屋に、一人の漁師がいた。彼の仕事は、五つの異なる漁法を使い、獲物を見つけることだ。</p>
<p>最初に漁師は「古い航海日誌📖」を開いた。頭の中で問題を整理し、言葉にした。これがStep 1「問題の定式化」だ。曖昧な恐怖を、正確な文言に変える作業だった。</p>
<p>次に彼は「腐れた地図🗺️」を広げた。海のどこに魚がいるか、データベースを巡った。情報という海に、鍵穴（検索式）を開ける。これがStep 2「情報検索」だ。</p>
<p>網にかかった魚を前に、漁師は「錆びた鋏✂️」を取り出した。すべての獲物をそのまま信じるわけにはいかない。信頼性のない魚は海へ戻す。これがStep 3「批判的吟味」だ。研究デザインの妥当性、バイアスの有無を、鋏で切り分ける。</p>
<p>漁師は慎重に魚を選り分けてから、村の市場へ向かった。患者の元へ、選り抜いたエビデンスを届ける。これがStep 4「判断の適用」だ。</p>
<p>帰り道、漁師は自分の網を繕った。今日の獲物は十分だったか？ 検索は最適だったか？ 網に穴はなかったか？ すべてを振り返る。これがStep 5「自己評価」だ。</p>
<p>そして漁師は、翌朝同じ漁に出る。五つのステップは終わらない。永遠に循環する。</p>

```

```html

<h3>老人と罹患の川</h3>
<p>川のほとりに、二人の漁師が立っていた。</p>
<p>一人は「新しい釣り糸🎣」を手にした漁師で、彼の名は罹患率漁師と呼ばれていた。彼は毎朝この場所に来ては、川に新しく放入れる魚の数を数えるのが仕事だった。今日も彼は、まだ見たことのない新しい魚を何匹か川に放ち、その数を静かに記帳していた。</p>
<p>もう一人の漁師は「古い網🕸️」を持った漁師で、彼の名は有病率漁師と呼ばれていた。彼は川全体の張った網を引き上げ、網の中に今現在どれだけの魚が捕まっているかを数えるのが仕事だった。網の中には、昨日から残っている魚もいれば、今朝新しく入ってきた魚も混じっている。</p>
<p>罹患率漁師は「新しく放入れる魚の数」だけを关心していた。彼にとって、その川にいつからいるかは問題ではない。今日この川に足を踏み入れた新しい魚だけが、彼の記帳の対象なのだ。</p>
<p>一方、有病率漁師が気にするのは「網の中に今現在どれだけの魚がいるか」だった。彼の網には、川から出て行かない魚 ── つまり治らない病気（慢性疾患🐟）── が長く留まり、網は常常に重く満ちていた。しかし、中には突然死んで川に流れていく魚 ── 致死性の高い病気（急性疾患🐟）── もいて、その分網は軽くなる。</p>
<p>罹患率漁師は川の「入り口」を見ていた。有病率漁師は川全体の「状態」を見ていた。この二つの漁師の違いが、罹患率と有病率の違いを凝縮して物語っていたのである。</p>

```

---
name: anki-card-formatter-highyield
description: none
---
# Role
あなたは優秀な医学教育者です。医学生向けに 日本語版 First Aid を出版する仕事をしています。

# Task
highYieldSummary を生成する。入力ファイルが断片的なときは背景を補って関連付け、教育効果の高いテキストにする。

## CoT

## Step: Create tasks

Use the `TaskCreateTool` to create tasks for each of the following steps (like ## xxx, ### xxx, #### xxx, ...). 

### Step: 章立てを作成

High-yield summary 全体の文字数が 3000字程度（指定がないとき）

detailedDescription を半分の長さに要約することに伴い、detailedDescription の章立ての項目数を統合して、半分にする。

Example

(before: detaildDescription)
- # §1 Structure of the Kidney
- ## Gross Structure of the Kidney
- ## Nephron: The Minimal Unit of Filtration
- # §2 Structure of the Glomerulus
- ## Three Types of Cells Composing the Glomerulus
- ## GBM
- ## Glomerular Filtration Mechanism

(after: highYieldSummary)
- # §1 Structure of the Kidney
- ## Gross Kidney Anatomy
- ## The Nephron Unit
- ## Glomerular Apparatus & Mechanism


### Step: **§1のみ**のhighYieldSummaryを生成

highYieldSummary の章立てを考慮して、**§1のみ** 、highYieldSummary を生成。全体の作成はしない。

- 一時出力先: /highYieldSummary/temp/<original filename without extension>.html

書式ルール（以下に厳格に従う）:
- /text-formatter-anki
- /text-formatter-structuring
- /text-formatter-chart
- /html-formatter

- 文章と「表・箇条書き・フローチャート」の比率は1:2にする。文章による説明が10行あるのであれば、「表・箇条書き・フローチャート」による説明も20行程度使う。

### Priorities

要件が相反する場合は以下の順で優先する。

MUST
0. /html-formatter
1. /text-formatter-structuring
2. 文章と「表・箇条書き・フローチャート」の比率は1:2にする
3. /text-formatter-chart
4. example 形式の遵守（example を書き換えるように生成。）

SHOULD

5. /text-formatter-anki

### Step section, sub section の長さチェック、分割

/text-formatter-structuring の要件に従っているか §1 を検証する。

- 長すぎる時 → 内容を取捨選択する。表や箇条書きなどの形式を崩さず、単純に要約する。認知負荷の高いものになってはいけない。書式ルールは死守する。

- 例えば 長すぎる sub section であれば、内容を要約し、具体例を省く、優先度の高いもののみに絞ることで、 60% まで圧縮する。


### Step: §2以降を含む残りすべての highYieldSummary を生成

- 出力先: /highYieldSummary/<original filename without extension>.html

書式ルール（以下に厳格に従う）:
- /text-formatter-anki
- /text-formatter-structuring
- /text-formatter-chart
- /html-formatter

- 文章と「表・箇条書き・フローチャート」の比率は1:2にする。文章による説明が10行あるのであれば、「表・箇条書き・フローチャート」による説明も20行程度使う。

- section, sub section title には連番をつける。section は、1, 2, 3, 4, ... のようにつけ、sub section は、1.1, 1.2, ..., 2.1, 2.2, 2.3 ... のように付ける。

### Priorities

要件が相反する場合は以下の順で優先する。

MUST
0. /html-formatter
1. /text-formatter-structuring
2. 文章と「表・箇条書き・フローチャート」の比率は1:2にする. section, sub section title には連番をつける.
3. /text-formatter-chart
4. example 形式の遵守（example を書き換えるように生成。）

SHOULD

5. /text-formatter-anki

# Example

```html
<h1>1 腎臓およびネフロンの基本構造 (Renal Anatomy &amp; Nephron)</h1>
<h2>1.1 腎臓の肉眼解剖</h2>
<ul>
<li><strong>皮質 (Cortex)</strong>: 腎臓の外層領域。血液ろ過を担当する糸球体が密集する。</li>
<li><strong>髄質 (Medulla)</strong>: 腎臓の内層領域。ろ過液（原尿）を腎盂へ導く集合管が並行して走行する。</li>
</ul>
<h2>1.2 ネフロン (Nephron): 腎機能の最小単位</h2>
<p>構成: 1つの糸球体 (Glomerulus) とそれにつづく尿細管 (Renal tubule) で構成される。</p>
<p>数量: 片腎あたり約100万個、両腎で約200万個存在。</p>
<p>主要機能:</p>
<ol>
<li><strong>代謝産物の除去</strong>: 体内の不要な代謝廃物を血液中から選択的に排泄する。</li>
<li><strong>体液・電解質バランスの維持</strong>: 水分、電解質、酸塩基平衡を精密に調節する。</li>
</ol>
<pre><code>[血流: 輸入細動脈] ──&gt; [糸球体: ろ過・原尿生成] ──&gt; [尿細管: 再吸収・分泌] ──&gt; [集合管: 尿の濃縮・排泄]</code></pre>
<hr>
<h1>2 糸球体ろ過障壁の細胞と分子構成 (Glomerular Filtration Barrier)</h1>
<p>糸球体は毛細血管球 (Capillary tuft) であり、3種類の構成細胞と基底膜によって高度な選択的ろ過障壁を形成する。</p>
<h2>2.1 構成細胞の機能と配置</h2>
<table>
<thead>
<tr>
<th>細胞種</th>
<th>解剖学的位置</th>
<th>主要機能</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>内皮細胞</strong></td>
<td>基底膜の内側（血管腔側）</td>
<td>窓構造（フェネストラ）を介した血球成分の通過阻止</td>
</tr>
<tr>
<td><strong>ポドサイト（上皮細胞）</strong></td>
<td>基底膜の外側（ボウマン嚢側）</td>
<td>足突起とスリット膜による分子サイズ選択的ろ過</td>
</tr>
<tr>
<td><strong>メサンギウム細胞</strong></td>
<td>毛細血管間（メサンギウム領域）</td>
<td>構造支持、収縮による血流量調節、不要物の貪食</td>
</tr>
</tbody>
</table>
<h2>2.2 糸球体基底膜 (GBM: Glomerular Basement Membrane)</h2>
<p>位置: 内皮細胞とポドサイトの中間に位置する物理的・化学的障壁。</p>
<p>分子構成: <strong>Ⅳ型コラーゲン鎖（α3、α4、α5鎖）</strong>が非コラーゲン領域（NC1ドメイン）を介して三量体を形成し、強固な網目構造を構築する。</p>
<p>機能: 分子量や電気的チャージに基づく選択的バリアとして働き、アルブミンなどの高分子タンパク質の漏出を物理的に阻止する。</p>
<h2>2.3 臨床関連 (Clinical Correlation)</h2>
<ul>
<li><strong>Alport症候群</strong>: Ⅳ型コラーゲン（α3、α4、α5鎖）の遺伝子変異による構造異常。基底膜の層状裂開を来し、進行性腎不全、感音難聴、眼症状を呈する。</li>
<li><strong>ポドサイト障害</strong>: 足突起の消失やスリット膜の破綻は、分子ふるい機能の完全な喪失を招く。結果として、大量のタンパク尿を特徴とする<strong>ネフローゼ症候群</strong>を発症する。</li>
</ul>
<hr>
<h1>3 糸球体腎炎の分類と疫学 (Classification of Glomerulonephritis)</h1>
<h2>3.1 分類アプローチ</h2>
<ul>
<li><strong>形態学的分類（旧WHO分類）</strong>: 光学顕微鏡、電子顕微鏡、免疫蛍光染色による組織学的変化のパターンに基づく分類。</li>
<li><strong>病因論的分類（現代の主流）</strong>: 発症機序、標的抗原、原因疾患を特定し、治療標的に直結させる分類。</li>
</ul>
<h2>3.2 発症様式による分類</h2>
<ul>
<li><strong>原発性糸球体腎炎 (Primary)</strong>: 病変の本質が腎臓自体に局在する。治療は副腎皮質ステロイドや免疫抑制薬による直接的な腎炎症制御が中心となる。</li>
<li><strong>二次性糸球体腎炎 (Secondary)</strong>: 全身性疾患の経過中に腎病変が随伴する。治療の第一角は基礎疾患の制御である（例：糖尿病性腎症における血糖管理、ループス腎炎における全身性免疫抑制）。</li>
</ul>
<h2>3.3 日本国内における原発性糸球体腎炎の疾患頻度</h2>
<ol>
<li><strong>IgA腎症 (IgA Nephropathy)</strong>: 本邦最多。免疫グロブリンIgAのメサンギウム領域への沈着とメサンギウム細胞増殖を特徴とする。アジア圏に多く、学校・職域検診制度の普及により無症候期の早期発見率が高い。</li>
<li><strong>膜性腎症 (Membranous Nephropathy)</strong>: 高齢男性に好発。上皮下への免疫複合体沈着と基底膜のびまん性肥厚を特徴とし、ネフローゼ症候群の原因となる。</li>
<li><strong>微小変化型ネフローゼ症候群 (MCNS)</strong>: 小児・若年者に好発。光顕的には著変を認めないが、電顕でポドサイト足突起の広範な消失を認める。突発的な大量タンパク尿を呈するが、ステロイド反応性は良好である。</li>
</ol>
<hr>
<h1>4 免疫複合体型腎炎の病態生理 (Pathophysiology of Immune Complex Nephritis)</h1>
<p>免疫複合体（抗原抗体複合物）の糸球体組織への沈着は、持続的な炎症反応と組織破壊を誘導する主要な発症機序である。沈着する微細解剖学的部位により、誘発される病理組織像および臨床症候が決定される。</p>
<h2>4.1 沈着部位と病態の相関</h2>
<table>
<thead>
<tr>
<th>沈着部位</th>
<th>主な障害構造</th>
<th>代表的な臨床症候</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>上皮下 (Subepithelial)</strong></td>
<td>ポドサイト足突起・スリット膜</td>
<td><strong>高度タンパク尿（ネフローゼ症候群）</strong></td>
</tr>
<tr>
<td><strong>内皮下 (Subendothelial)</strong></td>
<td>血管内皮細胞・基底膜の直接破壊</td>
<td><strong>血尿（赤血球漏出）</strong>、腎機能低下</td>
</tr>
<tr>
<td><strong>メサンギウム (Mesangial)</strong></td>
<td>メサンギウム細胞・基質</td>
<td>軽度〜中等度の蛋白尿・血尿</td>
</tr>
</tbody>
</table>
<h2>4.2 補体システム (Complement System) の関与</h2>
<p>炎症増幅機序: 免疫複合体の沈着は補体古典経路（C1q、C4、C3）を強力に活性化する。活性化過程で生じる過剰な補体成分は、好中球やマクロファージなどの炎症細胞を局所に遊走させ、サイトカイン放出を介して糸球体構造を不可逆的に破壊する。</p>
<p>補体単独異常の存在: 免疫グロブリンの沈着を伴わず、補体系の制御因子の異常により補体成分（C3）のみが特異的に活性化・沈着して組織を破壊する病態（C3腎症など）が識別される。</p>
<hr>
<h1>5 抗GBM病およびC3腎症 (Anti-GBM Disease &amp; C3 Glomerulopathy)</h1>
<h2>5.1 抗GBM病 (Anti-GBM Disease)</h2>
<p>発症機序:</p>
<ol>
<li>糸球体基底膜 (GBM) のⅣ型コラーゲンα3鎖の <strong>NC1ドメイン (Non-collagenous 1 domain)</strong> が標的抗原となる。</li>
<li>生理的環境下では、抗原エピトープはα3・α4・α5鎖六量体の内部に隠蔽されている。</li>
<li>環境要因や毒素などの影響で<strong>コンフォーメーション変化（立体構造変化）</strong>が生じ、抗原エピトープが外部に露出する。</li>
<li>露出したエピトープに対して自己抗体 (IgG) が産生され、GBMへ<strong>線状 (Linear)</strong> に沈着する。</li>
<li>補体の激しい活性化に伴い、基底膜が直接的かつ広範に破壊される。</li>
</ol>
<p>病理組織像: ボウマン嚢内に激しい細胞浸潤と増殖を伴う<strong>半月体 (Crescent)</strong> が、全糸球体の大部分に形成される。</p>
<p>臨床病態: <strong>急速進行性糸球体腎炎 (RPGN)</strong>。数週間の単位で腎機能が急速に廃絶する。</p>
<p>Goodpasture症候群: 肺胞基底膜のⅣ型コラーゲンα3鎖に対しても自己抗体が交叉反応を起こし、<strong>肺出血（喀血）</strong>と急性糸球体腎炎を同時に惹起した致命的な臨床病態。</p>
<p>治療戦略:</p>
<ol>
<li><strong>血漿交換療法 (Plasmapheresis)</strong>: 循環中の自己抗体（抗GBM抗体）を物理的に速やかに除去する。</li>
<li><strong>免疫抑制療法</strong>: 高用量副腎皮質ステロイドおよび免疫抑制薬を併用し、自己抗体の新規産生を強力に抑制する。</li>
</ol>
<h2>5.2 C3腎症 (C3 Glomerulopathy)</h2>
<p>発症機序: 補体の<strong>第二経路 (Alternative pathway)</strong> における恒常的制御因子（H因子、I因子など）の遺伝的変異または獲得性異常による破綻。免疫複合体の沈着が存在しないにもかかわらず、C3が持続的に過剰活性化し、腎組織に沈着して炎症を誘発する。</p>
<p>疫学: 極めて稀な孤発性疾患。国内の全腎生検症例における割合は約0.2%に留まる。</p>
<p>免疫蛍光顕微鏡所見: <strong>C3のみが特異的かつ優位に陽性</strong>を示す。免疫グロブリン (IgG, IgA, IgM) および古典経路補体成分 (C1q, C4) は陰性である。この特異的染色パターンが、補体第二経路の単独制御異常を裏付ける病理学的診断の決定打となる。</p>
```
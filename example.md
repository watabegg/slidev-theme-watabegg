---
theme: ./
title: Theme Demo
subtitle: slidev-theme-watabeggの紹介
author: watabegg
date: '2025/08/03'
themeConfig:
  watabegg:
    color: blue
    footer:
      text: slidev-theme-watabegg
transition: fade
---

# 基本機能とスタイル

このスライドではテーマの基本スタイルをテストします。

- **太字** / *斜体* / `code`
- 入れ子リスト
  - 第二階層
  - もう一つ
- テーマカラーは `themeConfig.watabegg.color` で deck 全体に設定可能
- 各スライドの frontmatter `color` で個別上書きも可能

```ts
function hello(name: string) {
  console.log(`Hello, ${name}`)
}
```


---
layout: agenda
title: Agenda
agenda:
  - レイアウト
  - コンポーネント
  - その他の機能
agendaActive: 2
---

---
layout: two-cols
title: 2カラムレイアウト
color: green
---

::left::
### 左側
- ポイント1
- ポイント2
- ポイント3

左右に内容を分割表示。

::right::
### 右側
```js
const nums = [1,2,3]
const doubled = nums.map(n=>n*2)
console.log(doubled)
```
図表 / コード / 説明などを分割表示。

---
layout: section
title: コンポーネント
---

---

# QuestionList 基本

<QuestionList
  :items="[
    '正答のためのリストコンポーネント **Markdown OK**',
    {
      text: '2番目 (子を含む)',
      items: [
        { label: 'A', text: 'A の内容'},
        { label: 'B', text: 'B の内容'},
        { text: 'さらにネスト', items: ['深い1', '深い2'] }
      ]
    },
    { label: '★', text: 'labelスタイルも複数用意しカスタムも可能。' }
  ]"
  :styles="['decimal-circle','katakana-paren','loweralpha-dot']"
/>

---

# QuestionList start 指定

配列で各階層の開始番号/文字を指定可能。

<QuestionList
  :items="[
    { text: '大問1: サブ', items: ['1つ目','2つ目'] },
    { text: '大問2: サブ', items: ['A','B','C'] }
  ]"
  :styles="['decimal-q','hiragana-paren']"
  :start="[1,1]"
/>

---

# KaTeX と QuestionList

KaTeX コンポーネント `<KaTexReveal>` を QuestionList 内で使用可能。

<KaTexReveal formula="\int_0^{2\pi} \sin x\,dx = 0" block class="text-2xl" />

<KaTexReveal
  formula="E = mc^2"
  :block="false"
  class="text-primary font-bold"
  v-click="1"
/>

---

# KaTeX と Markdown の混在

<QuestionList
  :items="[
    {
      label: '①',
      text: 'Markdownと **KaTeX** を混在',
      items: [
        { formula: 'a^2 + b^2 = c^2', block: true, class: 'text-lg', tex: true },
        { text: '$$\\frac{d}{dx} \\sin x = \\cos x$$' }
      ]
    },
    {
      label: '②',
      formula: '\\sum_{k=1}^n k = \\frac{n(n+1)}{2}',
      block: false,
      class: 'text-xl'
    }
  ]"
  :styles="['decimal-circle','loweralpha-paren']"
  :start="[1]"
/>

---
layout: image
image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2370&q=80'
---

<TextBox :x="80" :y="140" :width="360" v-click="1">1番目に表示される注釈。</TextBox>
<TextBox :x="200" :y="380" :width="340" textBg="green" v-click="2">背景色付き 2番目。</TextBox>
<TextBox :x="500" :y="120" :width="300" color="red">常時表示 (赤文字)。</TextBox>
<TextBox :x="40" :y="20" :width="420" textBg="yellow" v-click="3">最後に表示される黄色背景。</TextBox>

---
layout: image-scroll
image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80'
imageScroll:
  offsetY: -120
---

## image-scroll: 縦長画像を「横幅フィット＋縦スクロール」で表示

- 画像はスライド幅に合わせて表示
- 縦方向はホイール / タッチでスクロール
- `offsetY` で初期位置を調整（中心からのpx）

ここでは `offsetY: -120` で少し上寄せしています。

---
layout: image-scroll
image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80'
---

## offsetY の例（中心から上へ 300px）

背景の見せたい位置が決まっているときに便利です。

---

# テーブル

| レイアウト | 用途 |
|:--|:--|
| agenda | 目次 |
| section | 章タイトル |
| two-cols | 2カラム |

表の下には余白が入ります。

---

# 複雑な表：多段見出しとセル結合

HTML の `colspan` / `rowspan` で、列と行をまとめられます。

<table style="width: 100%; font-size: 18px; line-height: 1.35;">
  <caption style="caption-side: bottom; padding-top: 8px; font-size: 16px; color: var(--slidev-theme-text-secondary);">表1　条件ごとの手法比較（表示確認用の架空データ）</caption>
  <thead>
    <tr>
      <th rowspan="2" scope="col">条件</th>
      <th rowspan="2" scope="col">手法</th>
      <th colspan="3" scope="colgroup" style="text-align: center;">評価指標 ↑</th>
      <th colspan="2" scope="colgroup" style="text-align: center;">計算コスト ↓</th>
    </tr>
    <tr>
      <th scope="col" style="text-align: right;">適合率</th>
      <th scope="col" style="text-align: right;">再現率</th>
      <th scope="col" style="text-align: right;">F1</th>
      <th scope="col" style="text-align: right;">時間<br>(ms)</th>
      <th scope="col" style="text-align: right;">メモリ<br>(MB)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th rowspan="2" scope="rowgroup">小規模<br>100件</th>
      <th scope="row">基準手法</th>
      <td style="text-align: right;">0.81</td><td style="text-align: right;">0.76</td><td style="text-align: right;">0.78</td><td style="text-align: right;">12</td><td style="text-align: right;">64</td>
    </tr>
    <tr style="background: color-mix(in srgb, var(--slidev-theme-primary) 10%, white);">
      <th scope="row">改良手法</th>
      <td style="text-align: right;">0.88</td><td style="text-align: right;">0.86</td><td style="text-align: right;"><strong>0.87</strong></td><td style="text-align: right;">18</td><td style="text-align: right;">80</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th rowspan="2" scope="rowgroup">大規模<br>1,000件</th>
      <th scope="row">基準手法</th>
      <td style="text-align: right;">0.78</td><td style="text-align: right;">0.71</td><td style="text-align: right;">0.74</td><td style="text-align: right;">95</td><td style="text-align: right;">256</td>
    </tr>
    <tr style="background: color-mix(in srgb, var(--slidev-theme-primary) 10%, white);">
      <th scope="row">改良手法</th>
      <td style="text-align: right;">0.87</td><td style="text-align: right;">0.84</td><td style="text-align: right;"><strong>0.85</strong></td><td style="text-align: right;">125</td><td style="text-align: right;">320</td>
    </tr>
  </tbody>
</table>

<SmallText>↑ は大きいほど、↓ は小さいほど良い指標です。太字は各条件で最大の F1 を示します。</SmallText>

---

# Mermaid

```mermaid
flowchart LR
  A[入力] --> B[処理] --> C[出力]
```

---

# Mermaid：処理の流れ

データの整形から学習・評価までの流れを示します。

<DiagramFrame>

```mermaid
flowchart LR
  subgraph prepare[前処理]
    direction TB
    A[観測データ] --> B[欠損値の確認]
    B -->|あり| C[補完]
    B -->|なし| D[データの整形]
    C --> D
  end
  subgraph train[学習]
    direction TB
    E[データの分割] --> F[学習用データ]
    E --> G[評価用データ]
    F --> H[モデルの学習]
  end
  subgraph evaluate[評価]
    direction TB
    I[予測] --> J[指標の計算] --> K[結果を確認]
    K -->|完了| L[結果の保存]
  end
  prepare --> train --> evaluate
  evaluate -->|条件を見直す| train
```

</DiagramFrame>

評価結果を確認し、必要に応じて学習条件を見直します。

---

# Mermaid：処理のやり取り

キャッシュがある場合と、解析が必要な場合を分けて示します。

<DiagramFrame :height="320">

```mermaid
sequenceDiagram
  autonumber
  participant U as 利用者
  participant A as API
  participant C as キャッシュ
  participant W as 解析処理
  U->>A: 解析を要求
  A->>C: 保存済みの結果を確認
  alt 結果あり
    C-->>A: 保存済みの結果
  else 結果なし
    C-->>A: 該当なし
    A->>W: 解析を開始
    activate W
    Note over W: データの整形と解析
    W-->>A: 解析結果
    deactivate W
    A->>C: 結果を保存
  end
  A-->>U: 結果を返す
```

</DiagramFrame>

一度解析した結果は保存し、同じ要求では再利用します。

---

# 図を1枚、キャプション付きで載せる

<FigureGrid
  :images="[{ src: '/examples/sin-cos.svg', alt: 'sin x と cos x の曲線を重ねたグラフ' }]"
  caption="図1　sin x と cos x の位相の比較"
  :height="340"
>
  <template #before>
    <p>1枚の横長グラフを、縦横比を保って表示します。</p>
  </template>
  <template #after>
    <p>画像を1つ指定するだけで、図の下にキャプションが付きます。</p>
  </template>
</FigureGrid>

---

# 図を2枚並べる

<FigureGrid
  :images="[
    { src: '/examples/sin.svg', alt: 'sin x' },
    { src: '/examples/cos.svg', alt: 'cos x' }
  ]"
  caption="図2　sin x と cos x"
>
  <template #before>
    <p>同じ範囲で2つの関数を比較します。<br>横軸は x、縦軸は関数の値です。</p>
  </template>
  <template #after>
    <p>どちらも周期は 2π です。<br>位相が π/2 だけ異なります。</p>
  </template>
</FigureGrid>

---

# 図を4枚並べる

<FigureGrid
  :images="[
    { src: '/examples/sin.svg', alt: 'sin x' },
    { src: '/examples/cos.svg', alt: 'cos x' },
    { src: '/examples/gaussian.svg', alt: 'exp(-x²)' },
    { src: '/examples/sinc.svg', alt: 'sin x / x' }
  ]"
  caption="図3　4つの関数の比較"
>
  <template #before>
    <p>横軸の範囲を揃えて表示しています。<br>同じ大きさの図を横に並べる例です。</p>
  </template>
  <template #after>
    <p>各図をまとめて1つのキャプションにします。<br>補足の文章は図の下にも置けます。</p>
  </template>
</FigureGrid>

---

# 小さい文字と参考文献

Slidev の記法は公式ドキュメントで確認できます。<Cite :number="1" />

<SmallText>
  <p>補足の説明は SmallText で少し小さく表示します。</p>
</SmallText>

書籍<Cite :number="2" />や論文<Cite :number="3" />も、同じ形式で下部に表示します。

<SlideReferences :items="[
  { number: 1, type: 'web', title: 'Slidev Documentation', url: 'https://sli.dev/', accessed: '2026-10-05' },
  { number: 2, type: 'book', title: 'Pattern Recognition and Machine Learning', authors: ['Christopher M. Bishop'], publisher: 'Springer', year: 2006 },
  { number: 3, type: 'article', title: 'Attention Is All You Need', authors: ['Ashish Vaswani et al.'], venue: 'NeurIPS', year: 2017, url: 'https://arxiv.org/abs/1706.03762' }
]" />

---

# ユーティリティ

普通のテキストと <span class="text-highlight">ハイライト</span>。

<div class="card mt-8" v-click="1">
  <h3>カードスタイル</h3>
  <p>重要事項をまとめるのに便利です。</p>
</div>

---

# フッターとショートカット

このテーマでは Enter / Backspace キーで進行を制御できます。

- Enter: 次のスライド / v-click
- Backspace: 前へ戻る
- フッター: (cover / image / image-scroll 以外) 日付 + 任意のテキスト + ページ番号

---

# まとめ

- レイアウト: cover / agenda / section / two-cols / image / image-scroll / end
- コンポーネント: QuestionList / TextBox / KaTexReveal
- 自動フッター
- ラベルスタイル多彩 & Markdown 埋め込み

ご利用ありがとうございます

---
layout: end
---

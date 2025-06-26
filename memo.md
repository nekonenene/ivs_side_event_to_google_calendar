# 最初の指示

https://4s.link/ja/d548d4ed-6af2-4554-99d3-d7706deed2b5 のようなURLをもとに、ページ構造を見て、Googleカレンダーに登録するボタンを作成し、ユーザーがGoogle カレンダーへの登録をかんたんにできる Next.js アプリを作りたいです。
スマホやタブレットのレスポンシブ対応は必須です。

まずは CLAUDE.md だけを英語で作成してください。
コーディングルールとして

- 関数に対して、JSDoc に従ったコメントを日本語で必ず付けること
- 行末の空白文字を削除する（マークダウン以外）
- ファイル末尾は必ず改行で終わるように
- HTML/CSS/JSファイルなどの変更後、必ずコードフォーマッター、もしくは Linter の Auto Fix を通す

# 次の指示

どのように実装していきましょう？

と、 Plan Mode で聞いたのちに実装。

# コーディングルールを守っていないことに対する指摘

行末のスペースが残っているファイルや、最後が改行で終わっていないファイルがありました。
CLAUDE.md に書いたはずのこのルールが守られていない原因を見つけ修正してください。
コードフォーマッターが機能していないなら強制するように CLAUDE.md を修正してください。

# ビルドエラーが出る問題を修正

npm run dev を実行すると
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
のエラーが出ます。

# HTML構造を適切に読み取って情報取得ができていない問題を修正

日時、場所などを適切に取得できていません。
例えば https://4s.link/ja/8b9056ad-c96e-467f-b2f9-6c484e7b4b17 は、
イベントタイトルが『ディープテックとリーガル・チャンス　成功へのリーガル・チャンス・マネージメント』で「EventDetailOverviewScreen*title**2q6XJ」クラスの中、
日時が『2025年6月27日 16:00 - 17:00』で「EventInfoItem_value**qkL6b」クラスの中、
場所が「日本、〒144-0041 東京都大田区羽田空港１丁目１−４ Zone K, 羽田空港 Kicspace Haneda』で「EventInfoItem_value**qkL6b」クラスの中、
イベント詳細は「RichText_component**Sa07*」クラスの中にあります。
これらを適切に取得できるように修正してください。

ただし、これらのクラス名の末尾にあるハッシュ値は動的に変わる可能性があるため、正規表現などを用いて柔軟に対応できるようにしてください。
また、親子関係の要素構造を読み取って、適切に文字列を取得できるようにしてください。

# puppeteer を使ってもらえるように

全然直ってないですが？！ JSの読み込みが終わった状態のHTMLを使ってパースする方法はないですか？

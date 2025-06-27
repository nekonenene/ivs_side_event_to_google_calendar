# IVSサイドイベント to Googleカレンダー

4s.link のイベントページ（[https://4s.link/ja/explore](https://4s.link/ja/explore)）からイベント情報を抽出し、  
Googleカレンダーにかんたんに予定を追加できる Next.js 製のアプリケーションです。

## 技術スタック

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **HTMLパース**: Cheerio
- **ブラウザ自動化**: Puppeteer

## セットアップ

1. 依存関係をインストール:
   ```bash
   npm install
   ```

2. 環境変数を設定（オプション）:
   ```bash
   cp .env.example .env.local
   ```
   `.env.local` ファイルで Google Analytics ID を設定:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
   ※ この設定は任意です。設定しない場合は Google Analytics による計測はおこなわれません。

3. 開発サーバーを起動:
   ```bash
   npm run dev
   ```

4. ブラウザで `http://localhost:3000` を開く

## スクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバー起動
- `npm run lint` - ESLintチェック
- `npm run format` - Prettierフォーマット
- `npm run type-check` - TypeScriptタイプチェック

## 制限事項

- 4s.linkの構造変更により動作しなくなる可能性があります
- Puppeteerが必要なため、サーバーレス環境では制限があります
- 一部の複雑な日時形式は未対応の場合があります

# CLAUDE.md

## プロジェクト概要

4s.link のイベントページから IVS のイベント情報を抽出し、
ユーザーがGoogleカレンダーに予定を追加できるようにする Next.js アプリケーション。
現在は終了告知ページのみを表示している。

## 技術スタック

- **フレームワーク**: Next.js 16（App Router）
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript 6
- **ランタイム**: Node.js 24（`.node-version` で指定）
- **パッケージマネージャー**: npm

## プロジェクト構成

```
src/
├── app/
│   ├── layout.tsx        # ルートレイアウト（メタデータ、GA）
│   ├── page.tsx          # メインページ
│   └── globals.css       # グローバルスタイル
└── components/
    └── EventExtractor.tsx # 終了告知コンポーネント
```

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run lint         # ESLint 実行
npm run lint:fix     # ESLint 自動修正
npm run format       # Prettier フォーマット
npm run format:check # フォーマットチェック
npm run type-check   # TypeScript 型チェック
```

コミット前に必ず以下を実行すること：

```bash
npm run format
npm run lint:fix
npm run type-check
```

## コード規約

- 関数・メソッドには JSDoc コメントを日本語で記述する
- 行末の空白は削除する
- ファイルの末尾は改行で終わる
- インデント: スペース 2 つ
- 文字列: シングルクォート
- セミコロン: なし

## プルリクエスト作成

1. main ブランチから新しいブランチを切る
2. コミットされていないファイルがあるときはコミットをするか `AskUserQuestion` ツールでユーザーに確認する
3. git fetch origin をおこない、git push が必要であれば、おこなうか `AskUserQuestion` ツールでユーザーに確認する
4. テンプレートがあるか `.github` ディレクトリを確認する
5. `gh pr create` コマンドを実行してプルリクエストを作成する

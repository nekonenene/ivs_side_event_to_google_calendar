import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IVS Side Event to Google Calendar',
  description: 'IVSサイドイベントをGoogleカレンダーに簡単登録',
}

/**
 * ルートレイアウトコンポーネント
 * アプリケーション全体のレイアウトを提供する
 * @param children - 子コンポーネント
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&display=swap" rel="stylesheet" />
      </head>
      <body style={{ position: 'relative' }}>
        {/* 星アニメーション背景 */}
        <div className="starry-bg" id="starry-bg"></div>
        {children}
      </body>
    </html>
  )
}

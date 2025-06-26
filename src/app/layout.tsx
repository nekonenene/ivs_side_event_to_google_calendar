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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
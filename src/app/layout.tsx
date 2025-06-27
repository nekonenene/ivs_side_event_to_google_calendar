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
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&display=swap"
          rel="stylesheet"
        />
        {/* SEO & OGP meta tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="IVSサイドイベントをGoogleカレンダーにカンタン登録！"
        />
        <meta name="author" content="@yokoe24" />
        <meta name="theme-color" content="#192638" />
        <link rel="icon" href="/images/icon256.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/icon1024.png" />
        <link rel="canonical" href="https://ivs-side.l-master.net" />
        {/* OGP */}
        <meta
          property="og:title"
          content="IVSサイドイベント to Googleカレンダー"
        />
        <meta
          property="og:description"
          content="IVSサイドイベントをGoogleカレンダーにカンタン登録！"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ivs-side.l-master.net" />
        <meta property="og:image" content="/images/icon1024.png" />
        <meta
          property="og:site_name"
          content="IVSサイドイベント to Googleカレンダー"
        />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="IVSサイドイベント to Googleカレンダー"
        />
        <meta
          name="twitter:description"
          content="IVSサイドイベントをGoogleカレンダーにカンタン登録！"
        />
        <meta name="twitter:image" content="/images/icon1024.png" />
      </head>
      <body style={{ position: 'relative' }}>
        {/* 星アニメーション背景 */}
        <div className="starry-bg" id="starry-bg"></div>
        {children}
      </body>
    </html>
  )
}

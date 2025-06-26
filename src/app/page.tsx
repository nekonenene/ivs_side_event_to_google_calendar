import EventExtractor from '@/components/EventExtractor'

/**
 * メインページコンポーネント
 * イベントURL入力とGoogleカレンダー登録機能を提供する
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            IVSサイドイベント to Googleカレンダー
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            4s.linkのイベントURLを入力して、Googleカレンダーに簡単登録
          </p>
        </div>
        
        <EventExtractor />
      </div>
    </main>
  )
}
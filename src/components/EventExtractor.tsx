'use client'

import { useState } from 'react'
import { EventInfo, LoadingState, ParseEventResponse } from '@/types/event'
import { isValid4sLinkUrl, formatEventPeriod } from '@/lib/calendar-utils'
import CalendarButton from './CalendarButton'
import LoadingSpinner from './LoadingSpinner'

/**
 * イベント抽出メインコンポーネント
 * URL入力からイベント情報表示、カレンダー追加までの一連の機能を提供する
 */
export default function EventExtractor() {
  const [url, setUrl] = useState('')
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * イベント情報の取得処理
   */
  const handleExtractEvent = async () => {
    // URLバリデーション
    if (!url.trim()) {
      setError('URLを入力してください')
      return
    }

    if (!isValid4sLinkUrl(url)) {
      setError('有効な4s.linkのURLを入力してください')
      return
    }

    setLoadingState('loading')
    setError(null)
    setEventInfo(null)

    try {
      const response = await fetch('/api/parse-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data: ParseEventResponse = await response.json()

      if (data.success && data.event) {
        setEventInfo(data.event)
        setLoadingState('success')
      } else {
        setError(data.error || 'イベント情報の取得に失敗しました')
        setLoadingState('error')
      }
    } catch (error) {
      console.error('APIエラー:', error)
      setError('サーバーエラーが発生しました')
      setLoadingState('error')
    }
  }

  /**
   * フォームリセット処理
   */
  const handleReset = () => {
    setUrl('')
    setEventInfo(null)
    setError(null)
    setLoadingState('idle')
  }

  /**
   * Enter キー押下でフォーム送信
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && loadingState !== 'loading') {
      handleExtractEvent()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* URL入力フォーム */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          イベントURL入力
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="event-url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              4s.link イベントURL
            </label>
            <input
              id="event-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://4s.link/ja/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
              disabled={loadingState === 'loading'}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExtractEvent}
              disabled={loadingState === 'loading' || !url.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loadingState === 'loading' ? '解析中...' : 'イベント情報を取得'}
            </button>

            {(eventInfo || error) && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                リセット
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ローディング表示 */}
      {loadingState === 'loading' && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <LoadingSpinner />
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-2">⚠️</div>
            <div className="text-red-800 font-medium">エラー</div>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* イベント情報表示 */}
      {eventInfo && loadingState === 'success' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            イベント情報
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {eventInfo.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">開催日時</p>
                <p className="text-gray-900 mt-1">
                  {formatEventPeriod(eventInfo.startDate, eventInfo.endDate)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">開催場所</p>
                <p className="text-gray-900 mt-1">{eventInfo.location}</p>
              </div>
            </div>

            {eventInfo.description && (
              <div>
                <p className="text-sm font-medium text-gray-600">詳細</p>
                <p className="text-gray-900 mt-1 text-sm leading-relaxed">
                  {eventInfo.description}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <CalendarButton
                event={eventInfo}
                size="large"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

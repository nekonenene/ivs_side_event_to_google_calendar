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
    <div className="w-full block" style={{ fontFamily: "'Mochiy Pop P One', system-ui, sans-serif" }}>
      {/* URL入力フォーム */}
      <div style={{
        margin: '0 auto 1.5em',
        position: 'relative',
        maxWidth: '480px',
        width: '100%',
        minWidth: 0,
      }}>
        <h2>4s.link  イベントURL入力</h2>
        <div className="space-y-4">
          <div>
            <input
              id="event-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://4s.link/ja/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              style={{
                width: '100%',
                padding: '1em',
                border: '3px solid #0ff',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontFamily: "'Mochiy Pop P One', system-ui, sans-serif",
                background: '#f0f8ff',
                color: '#222',
                boxShadow: '0 2px 0 #00f',
                outline: 'none',
                marginBottom: '0.5em',
                boxSizing: 'border-box',
              }}
              disabled={loadingState === 'loading'}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {!(eventInfo && loadingState === 'success') && (
              <button
                onClick={handleExtractEvent}
                disabled={loadingState === 'loading' || !url.trim()}
                className="tacky-btn"
                style={{ width: '100%', flex: 1, minWidth: 0 }}
              >
                {loadingState === 'loading' ? '解析中...' : 'イベントURLを入力する'}
              </button>
            )}

            {loadingState === 'success' && (eventInfo || error) && (
              <button
                onClick={handleReset}
                style={{
                  padding: '0.9em 2em',
                  background: 'linear-gradient(180deg, #eee 0%, #b0e0ff 100%)',
                  border: '3px solid #00c0ff',
                  color: '#222',
                  fontSize: '1.1rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 0 #0088cc, 0 0 8px #00c0ff',
                  textShadow: '1px 1px 0 #fff, 2px 2px 0 #00c0ff',
                  margin: '0.5em 0',
                  cursor: 'pointer',
                  fontFamily: "'Mochiy Pop P One', system-ui, sans-serif",
                  fontWeight: 700,
                  width: '100%',
                  minWidth: 0,
                }}
              >
                リセット
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ローディング表示 */}
      {loadingState === 'loading' && (
        <div style={{
          background: '#fff',
          border: '4px solid #0ff',
          borderRadius: '18px',
          boxShadow: '0 0 16px #0ff, 0 0 4px #00f',
          marginBottom: '1.5em',
          padding: '2em 1.5em',
          textAlign: 'center',
        }}>
          <LoadingSpinner />
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div style={{
          background: '#fff0f0',
          border: '4px solid #f00',
          borderRadius: '18px',
          boxShadow: '0 0 12px #f00',
          marginBottom: '1.5em',
          padding: '1.5em',
        }}>
          <div style={{ color: '#f00', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5em', textShadow: '1px 1px 0 #fff' }}>
            ⚠️ エラー
          </div>
          <p style={{ color: '#a00', fontWeight: 700 }}>{error}</p>
        </div>
      )}

      {/* イベント情報表示 */}
      {eventInfo && (loadingState === 'success' || loadingState === 'idle') && (
        <div style={{
          background: '#fff',
          border: '4px solid #0f0',
          borderRadius: '18px',
          boxShadow: '0 0 16px #0f0, 0 0 4px #080',
          margin: '0 auto 1.5em',
          padding: '2em 1.5em',
          maxWidth: '800px',
        }}>

          <div style={{ fontSize: '1.1rem', color: '#222', fontFamily: "'Mochiy Pop P One', system-ui, sans-serif", letterSpacing: '0.07em' }}>
            <div style={{ marginBottom: '0.7em' }}>
              <h3 style={{ fontWeight: 700, color: '#080', textShadow: '1px 1px 0 #fff' }}>{eventInfo.title}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1em', marginBottom: '1em' }}>
              <div>
                <p style={{ fontWeight: 700, color: '#00f', marginBottom: '0.1em' }}>開催日時</p>
                <p style={{ color: '#222', fontWeight: 700 }}>{formatEventPeriod(eventInfo.startDate, eventInfo.endDate)}</p>
              </div>

              <div>
                <p style={{ fontWeight: 700, color: '#00f', marginBottom: '0.1em' }}>開催場所</p>
                <p style={{ color: '#222', fontWeight: 700 }}>{eventInfo.location}</p>
              </div>
            </div>

            <div style={{ paddingTop: '1em', borderTop: '2px dashed #0f0', marginTop: '1em' }}>
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

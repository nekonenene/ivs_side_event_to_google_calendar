import { EventInfo } from '@/types/event'
import { generateGoogleCalendarUrl } from '@/lib/calendar-utils'

interface CalendarButtonProps {
  /** イベント情報 */
  event: EventInfo
  /** ボタンのサイズ（デフォルト: 'medium'） */
  size?: 'small' | 'medium' | 'large'
  /** カスタムクラス名 */
  className?: string
}

/**
 * Googleカレンダー追加ボタンコンポーネント
 * イベント情報を基にGoogleカレンダーに追加するボタンを表示する
 * @param event - イベント情報
 * @param size - ボタンのサイズ
 * @param className - カスタムクラス名
 */
export default function CalendarButton({
  event,
  size = 'medium',
  className = '',
}: CalendarButtonProps) {
  /**
   * Googleカレンダーへの追加処理
   */
  const handleAddToCalendar = () => {
    const calendarUrl = generateGoogleCalendarUrl(event)
    window.open(calendarUrl, '_blank', 'noopener,noreferrer')
  }

  // サイズに応じたクラス名を決定
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-sm'
      case 'large':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  return (
    <div>
      <button
        onClick={handleAddToCalendar}
        className="win98-btn"
        type="button"
        style={{ width: '100%', zIndex: 1000 }}
      >
        📅 Googleカレンダーに登録
      </button>
      <p className="text-xs mt-2 text-center">
        ※Googleに未ログインの方は、先に
        <a
          href="https://calendar.google.com/calendar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ログイン
        </a>
        してください
      </p>
    </div>
  )
}

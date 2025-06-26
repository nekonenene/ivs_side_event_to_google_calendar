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
  className = '' 
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
    <button
      onClick={handleAddToCalendar}
      className={`
        ${getSizeClasses()}
        bg-blue-600 hover:bg-blue-700 
        text-white font-semibold rounded-lg 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        shadow-md hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      type="button"
    >
      📅 Googleカレンダーに追加
    </button>
  )
}
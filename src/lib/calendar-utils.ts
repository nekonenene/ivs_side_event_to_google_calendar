import { EventInfo } from '@/types/event'

/**
 * イベント情報からGoogleカレンダーのURLを生成する
 * @param event - イベント情報
 * @returns Googleカレンダーの追加URL
 */
export function generateGoogleCalendarUrl(event: EventInfo): string {
  const baseUrl = 'https://calendar.google.com/calendar/render'

  // パラメータを構築
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: formatDatesForGoogle(event.startDate, event.endDate),
    details: formatDetailsForGoogle(event),
    location: event.location,
    ctz: event.timezone,
  })

  return `${baseUrl}?${params.toString()}`
}

/**
 * 日時をGoogleカレンダー形式にフォーマットする
 * @param startDate - 開始日時（ISO文字列）
 * @param endDate - 終了日時（ISO文字列）
 * @returns Googleカレンダー形式の日時文字列
 */
function formatDatesForGoogle(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // UTC時刻でフォーマット（YYYYMMDDTHHmmssZ形式）
  const formatDate = (date: Date): string => {
    return date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')
  }

  return `${formatDate(start)}/${formatDate(end)}`
}

/**
 * イベント詳細をGoogleカレンダー用にフォーマットする
 * @param event - イベント情報
 * @returns フォーマットされた詳細文
 */
function formatDetailsForGoogle(event: EventInfo): string {
  let details = event.description

  // 元のURLを追加
  if (event.originalUrl) {
    details += `\n\n詳細: ${event.originalUrl}`
  }

  return details
}

/**
 * 日時を日本語形式で表示用にフォーマットする
 * @param dateString - ISO形式の日時文字列
 * @returns 日本語形式の日時文字列
 */
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  }

  return new Intl.DateTimeFormat('ja-JP', options).format(date)
}

/**
 * イベント期間を日本語形式で表示用にフォーマットする
 * @param startDate - 開始日時（ISO文字列）
 * @param endDate - 終了日時（ISO文字列）
 * @returns フォーマットされた期間文字列
 */
export function formatEventPeriod(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const isSameDay = start.toDateString() === end.toDateString()

  if (isSameDay) {
    // 同じ日の場合
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Tokyo',
    }

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tokyo',
    }

    const dateStr = new Intl.DateTimeFormat('ja-JP', dateOptions).format(start)
    const startTime = new Intl.DateTimeFormat('ja-JP', timeOptions).format(
      start
    )
    const endTime = new Intl.DateTimeFormat('ja-JP', timeOptions).format(end)

    return `${dateStr} ${startTime} - ${endTime}`
  } else {
    // 異なる日の場合
    const startStr = formatDateForDisplay(startDate)
    const endStr = formatDateForDisplay(endDate)
    return `${startStr} - ${endStr}`
  }
}

/**
 * URLが有効な4s.linkのURLかチェックする
 * @param url - チェックするURL
 * @returns 有効かどうか
 */
export function isValid4sLinkUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('4s.link')
  } catch {
    return false
  }
}

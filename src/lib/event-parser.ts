import * as cheerio from 'cheerio'
import { EventInfo } from '@/types/event'

/**
 * 4s.linkのURLからイベント情報を抽出する
 * @param url - パースするイベントURL
 * @returns イベント情報のPromise
 */
export async function parseEventFromUrl(url: string): Promise<EventInfo> {
  // URLのバリデーション
  if (!url || !url.includes('4s.link')) {
    throw new Error('有効な4s.linkのURLを入力してください')
  }

  try {
    // HTMLを取得
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`)
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)

    // イベント情報を抽出
    const eventInfo = extractEventInfo($, url)
    
    return eventInfo
  } catch (error) {
    console.error('イベント情報の取得に失敗しました:', error)
    throw new Error('イベント情報の取得に失敗しました')
  }
}

/**
 * CheerioのロードされたHTMLからイベント情報を抽出する
 * @param $ - Cheerioオブジェクト
 * @param originalUrl - 元のURL
 * @returns イベント情報
 */
function extractEventInfo($: cheerio.Root, originalUrl: string): EventInfo {
  // タイトルを抽出
  const title = extractTitle($)
  
  // 日時情報を抽出
  const { startDate, endDate } = extractDateTime($)
  
  // 場所を抽出
  const location = extractLocation($)
  
  // 説明を抽出
  const description = extractDescription($)

  return {
    title,
    startDate,
    endDate,
    description,
    location,
    timezone: 'Asia/Tokyo',
    originalUrl
  }
}

/**
 * イベントタイトルを抽出する
 * @param $ - Cheerioオブジェクト
 * @returns イベントタイトル
 */
function extractTitle($: cheerio.Root): string {
  // 複数のセレクタを試行
  const selectors = [
    'h1',
    '.event-title',
    '[data-testid="event-title"]',
    'title',
    '.title'
  ]

  for (const selector of selectors) {
    const element = $(selector).first()
    if (element.length > 0) {
      const text = element.text().trim()
      if (text) {
        return text
      }
    }
  }

  return '不明なイベント'
}

/**
 * 日時情報を抽出する
 * @param $ - Cheerioオブジェクト
 * @returns 開始日時と終了日時
 */
function extractDateTime($: cheerio.Root): { startDate: string; endDate: string } {
  // 日時を含む可能性のあるセレクタを試行
  const dateSelectors = [
    '.date',
    '.event-date',
    '.datetime',
    '[data-testid="event-date"]',
    '.time'
  ]

  let dateText = ''
  for (const selector of dateSelectors) {
    const element = $(selector).first()
    if (element.length > 0) {
      const text = element.text().trim()
      if (text) {
        dateText = text
        break
      }
    }
  }

  // 日時パターンを解析
  if (dateText) {
    const parsedDate = parseDateString(dateText)
    if (parsedDate) {
      return parsedDate
    }
  }

  // デフォルト値（現在時刻から1時間後）
  const now = new Date()
  const startDate = new Date(now.getTime() + 60 * 60 * 1000) // 1時間後
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2時間後

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  }
}

/**
 * 日時文字列を解析する
 * @param dateString - 日時文字列
 * @returns 解析された日時情報
 */
function parseDateString(dateString: string): { startDate: string; endDate: string } | null {
  // 日本語の日時パターンを解析
  const patterns = [
    // 2025年6月27日 8:00 - 10:00
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/,
    // 6月27日 8:00-10:00
    /(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/,
    // 2025-06-27 08:00-10:00
    /(\d{4})-(\d{1,2})-(\d{1,2})\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/
  ]

  for (const pattern of patterns) {
    const match = dateString.match(pattern)
    if (match) {
      let year, month, day, startHour, startMinute, endHour, endMinute

      if (match.length === 8) {
        // 年が含まれる場合
        [, year, month, day, startHour, startMinute, endHour, endMinute] = match
      } else if (match.length === 7) {
        // 年が含まれない場合（現在年を使用）
        year = new Date().getFullYear().toString()
        ;[, month, day, startHour, startMinute, endHour, endMinute] = match
      } else {
        continue
      }

      const startDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(startHour),
        parseInt(startMinute)
      )

      const endDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(endHour),
        parseInt(endMinute)
      )

      return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }
  }

  return null
}

/**
 * 開催場所を抽出する
 * @param $ - Cheerioオブジェクト
 * @returns 開催場所
 */
function extractLocation($: cheerio.Root): string {
  const locationSelectors = [
    '.location',
    '.venue',
    '.place',
    '[data-testid="location"]',
    '.address'
  ]

  for (const selector of locationSelectors) {
    const element = $(selector).first()
    if (element.length > 0) {
      const text = element.text().trim()
      if (text) {
        return text
      }
    }
  }

  return 'オンライン'
}

/**
 * イベント説明を抽出する
 * @param $ - Cheerioオブジェクト
 * @returns イベント説明
 */
function extractDescription($: cheerio.Root): string {
  const descriptionSelectors = [
    '.description',
    '.event-description',
    '.content',
    '[data-testid="description"]',
    '.summary'
  ]

  for (const selector of descriptionSelectors) {
    const element = $(selector).first()
    if (element.length > 0) {
      const text = element.text().trim()
      if (text && text.length > 10) {
        return text
      }
    }
  }

  return 'イベントの詳細情報'
}
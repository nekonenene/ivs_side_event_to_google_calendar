import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'
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
    // PuppeteerでJavaScript実行後のHTMLを取得
    const html = await fetchRenderedHTML(url)

    // JavaScript実行後のHTMLをDOM解析
    const $ = cheerio.load(html)
    const eventInfo = extractEventInfo($, url)

    return eventInfo
  } catch (error) {
    console.error('イベント情報の取得に失敗しました:', error)
    throw new Error('イベント情報の取得に失敗しました')
  }
}

/**
 * PuppeteerでJavaScript実行後のHTMLを取得する
 * @param url - 取得するURL
 * @returns レンダリング後のHTML
 */
async function fetchRenderedHTML(url: string): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    // ユーザーエージェントを設定
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    )

    // ページに移動して、コンテンツが読み込まれるまで待機
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

    // イベントタイトルが表示されるまで待機
    await page.waitForSelector('[class*="EventDetailOverviewScreen_title"]', {
      timeout: 10000,
    })

    // レンダリング後のHTMLを取得
    const html = await page.content()

    return html
  } finally {
    await browser.close()
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
  const description = extractDescription($, originalUrl)

  return {
    title,
    startDate,
    endDate,
    description,
    location,
    timezone: 'Asia/Tokyo',
    originalUrl,
  }
}

/**
 * イベントタイトルを抽出する
 * @param $ - Cheerioオブジェクト
 * @returns イベントタイトル
 */
function extractTitle($: cheerio.Root): string {
  const titleElement = $('[class*="EventDetailOverviewScreen_title"]').first()
  return titleElement.length > 0 ? titleElement.text().trim() : '不明なイベント'
}

/**
 * 日時情報を抽出する
 * @param $ - Cheerioオブジェクト
 * @returns 開始日時と終了日時
 */
function extractDateTime($: cheerio.Root): {
  startDate: string
  endDate: string
} {
  // EventInfoItem_valueの最初の要素（通常は日時）
  const dateElement = $('[class*="EventInfoItem_value"]').first()
  const dateText = dateElement.length > 0 ? dateElement.text().trim() : ''

  if (dateText) {
    const parsedDate = parseDateString(dateText)
    if (parsedDate) {
      return parsedDate
    }
  }

  throw new Error('イベントの日時情報を取得できませんでした')
}

/**
 * 日時文字列を解析する
 * @param dateString - 日時文字列
 * @returns 解析された日時情報
 */
function parseDateString(
  dateString: string
): { startDate: string; endDate: string } | null {
  // 英語の日時パターンを先にチェック
  const englishMatch = parseEnglishDateString(dateString)
  if (englishMatch) {
    return englishMatch
  }

  // 日本語の日時パターンを解析
  const multiDayPattern =
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})\s*-\s*(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})/
  const singleDayPattern =
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/

  const multiDayMatch = dateString.match(multiDayPattern)
  if (multiDayMatch) {
    const [
      ,
      startYear,
      startMonth,
      startDay,
      startHour,
      startMinute,
      endYear,
      endMonth,
      endDay,
      endHour,
      endMinute,
    ] = multiDayMatch
    const startDate = new Date(
      parseInt(startYear),
      parseInt(startMonth) - 1,
      parseInt(startDay),
      parseInt(startHour),
      parseInt(startMinute)
    )
    const endDate = new Date(
      parseInt(endYear),
      parseInt(endMonth) - 1,
      parseInt(endDay),
      parseInt(endHour),
      parseInt(endMinute)
    )
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }
  }

  const singleDayMatch = dateString.match(singleDayPattern)
  if (singleDayMatch) {
    const [, year, month, day, startHour, startMinute, endHour, endMinute] =
      singleDayMatch
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
      endDate: endDate.toISOString(),
    }
  }

  return null
}

/**
 * 英語の日時文字列を解析する
 * @param dateString - 日時文字列
 * @returns 解析された日時情報
 */
function parseEnglishDateString(
  dateString: string
): { startDate: string; endDate: string } | null {
  // 月名のマッピング
  const monthNames = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  }

  // July 2, 2025 10:00 AM - July 4, 2025 5:00 PM
  const multiDayPattern =
    /(\w+)\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)\s*-\s*(\w+)\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)/i
  const multiDayMatch = dateString.match(multiDayPattern)

  if (multiDayMatch) {
    const [
      ,
      startMonthName,
      startDay,
      startYear,
      startHour,
      startMinute,
      startPeriod,
      endMonthName,
      endDay,
      endYear,
      endHour,
      endMinute,
      endPeriod,
    ] = multiDayMatch

    const startMonth =
      monthNames[startMonthName.toLowerCase() as keyof typeof monthNames]
    const endMonth =
      monthNames[endMonthName.toLowerCase() as keyof typeof monthNames]
    if (!startMonth || !endMonth) return null

    let startHour24 = parseInt(startHour)
    if (startPeriod.toUpperCase() === 'PM' && startHour24 !== 12)
      startHour24 += 12
    if (startPeriod.toUpperCase() === 'AM' && startHour24 === 12)
      startHour24 = 0

    let endHour24 = parseInt(endHour)
    if (endPeriod.toUpperCase() === 'PM' && endHour24 !== 12) endHour24 += 12
    if (endPeriod.toUpperCase() === 'AM' && endHour24 === 12) endHour24 = 0

    const startDate = new Date(
      parseInt(startYear),
      startMonth - 1,
      parseInt(startDay),
      startHour24,
      parseInt(startMinute)
    )
    const endDate = new Date(
      parseInt(endYear),
      endMonth - 1,
      parseInt(endDay),
      endHour24,
      parseInt(endMinute)
    )

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }
  }

  // June 27, 2025 4:00 PM - 5:00 PM
  const singleDayPattern =
    /(\w+)\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s+(AM|PM)/i
  const singleDayMatch = dateString.match(singleDayPattern)

  if (singleDayMatch) {
    const [
      ,
      monthName,
      day,
      year,
      startHour,
      startMinute,
      startPeriod,
      endHour,
      endMinute,
      endPeriod,
    ] = singleDayMatch

    const month = monthNames[monthName.toLowerCase() as keyof typeof monthNames]
    if (!month) return null

    // 12時間制を24時間制に変換
    let startHour24 = parseInt(startHour)
    let endHour24 = parseInt(endHour)

    if (startPeriod.toUpperCase() === 'PM' && startHour24 !== 12) {
      startHour24 += 12
    } else if (startPeriod.toUpperCase() === 'AM' && startHour24 === 12) {
      startHour24 = 0
    }

    if (endPeriod.toUpperCase() === 'PM' && endHour24 !== 12) {
      endHour24 += 12
    } else if (endPeriod.toUpperCase() === 'AM' && endHour24 === 12) {
      endHour24 = 0
    }

    const startDate = new Date(
      parseInt(year),
      month - 1,
      parseInt(day),
      startHour24,
      parseInt(startMinute)
    )

    const endDate = new Date(
      parseInt(year),
      month - 1,
      parseInt(day),
      endHour24,
      parseInt(endMinute)
    )

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
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
  // EventInfoItem_valueの2番目の要素（通常は場所）
  const locationElement = $('[class*="EventInfoItem_value"]').eq(1)
  return locationElement.length > 0 ? locationElement.text().trim() : '不明'
}

/**
 * イベント説明を抽出する
 * @param $ - Cheerioオブジェクト
 * @param originalUrl - 元のイベントURL
 * @returns イベント説明
 */
function extractDescription($: cheerio.Root, originalUrl: string): string {
  const descriptionElement = $('[class*="RichText_component"]').first()

  if (descriptionElement.length > 0) {
    const formattedDescription = formatDescriptionHTML(descriptionElement)
    return `詳細: ${originalUrl}\n\n${formattedDescription}`
  }

  return `詳細: ${originalUrl}\n\nイベントの詳細情報`
}

/**
 * 説明文のHTMLを適切な形式に変換する
 * @param element - CheerioのHTML要素
 * @returns フォーマットされた説明文
 */
function formatDescriptionHTML(element: cheerio.Cheerio): string {
  // HTMLのコピーを作成して処理
  const tempElement = element.clone()

  // <br>タグを改行文字に変換
  tempElement.find('br').replaceWith('\n')

  // 段落ごとに処理
  let formattedText = ''
  tempElement.find('p').each((index: number, pElement: cheerio.Element) => {
    const paragraphText = cheerio.load(pElement)('p').text().trim()
    if (paragraphText) {
      formattedText += paragraphText + '\n\n'
    }
  })

  // <p>タグが見つからない場合は、直接テキストを抽出
  if (!formattedText.trim()) {
    formattedText = tempElement.text().trim()
  }

  // 余分な改行とスペースを整理
  formattedText = formattedText
    .replace(/\n\s*\n\s*\n+/g, '\n\n') // 3つ以上の連続改行を2つに
    .replace(/[ \t]+/g, ' ') // 複数のスペース・タブを1つのスペースに
    .replace(/ *\n */g, '\n') // 改行前後のスペースを削除
    .trim()

  return formattedText || element.text().trim()
}

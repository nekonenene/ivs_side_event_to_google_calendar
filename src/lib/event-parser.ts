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
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    // ユーザーエージェントを設定
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    // ページに移動して、コンテンツが読み込まれるまで待機
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
    
    // イベントタイトルが表示されるまで待機
    await page.waitForSelector('[class*="EventDetailOverviewScreen_title"]', { timeout: 10000 })
    
    // レンダリング後のHTMLを取得
    const html = await page.content()
    
    return html
  } finally {
    await browser.close()
  }
}


/**
 * HTML文字列からテキストを抽出する
 * @param html - HTML文字列
 * @returns テキスト
 */
function extractTextFromHtml(html: string): string {
  try {
    // HTMLエンティティをデコード
    const decoded = html
      .replace(/\\u003c/g, '<')
      .replace(/\\u003e/g, '>')
      .replace(/\\u0026/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')

    // Cheerioでテキストを抽出
    const $ = cheerio.load(decoded)
    const text = $('body').text().trim() || $.root().text().trim()

    // 長すぎる場合は最初の500文字に制限
    return text.length > 500 ? text.substring(0, 500) + '...' : text
  } catch (error) {
    return 'イベントの詳細情報'
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
  // 4s.link特有のクラス名パターンを含むセレクタを試行
  const selectors = [
    // 4s.linkのタイトルクラス（ハッシュ値に対応）
    '[class*="EventDetailOverviewScreen_title"]',
    '[class^="EventDetailOverviewScreen_title"]',
    // 一般的なセレクタ
    'h1',
    'h2',
    '.event-title',
    '.title',
    '[data-testid="event-title"]',
    'title',
  ]

  for (const selector of selectors) {
    const element = $(selector).first()
    if (element.length > 0) {
      const text = element.text().trim()
      if (text && text.length > 3) {
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
function extractDateTime($: cheerio.Root): {
  startDate: string
  endDate: string
} {
  // 4s.link特有のクラス名と一般的なセレクタを試行
  const dateSelectors = [
    // 4s.linkのEventInfoItem_valueクラス（ハッシュ値に対応）
    '[class*="EventInfoItem_value"]',
    '[class^="EventInfoItem_value"]',
    // 一般的なセレクタ
    '.date',
    '.event-date',
    '.datetime',
    '.time',
    '[data-testid="event-date"]',
    '.event-time',
    '.schedule',
  ]

  let dateText = ''

  // EventInfoItem_valueクラスから日時情報を探す
  $('[class*="EventInfoItem_value"]').each((index, element) => {
    const text = $(element).text().trim()
    // 日時パターンを含むテキストかチェック
    if (
      text &&
      (text.includes('年') ||
        text.includes('月') ||
        text.includes('日') ||
        text.includes(':') ||
        text.includes('時'))
    ) {
      dateText = text
      return false // break
    }
  })

  // 見つからない場合は他のセレクタを試行
  if (!dateText) {
    for (const selector of dateSelectors) {
      const element = $(selector).first()
      if (element.length > 0) {
        const text = element.text().trim()
        if (
          text &&
          (text.includes('年') ||
            text.includes('月') ||
            text.includes('日') ||
            text.includes(':'))
        ) {
          dateText = text
          break
        }
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
    endDate: endDate.toISOString(),
  }
}

/**
 * 日時文字列を解析する
 * @param dateString - 日時文字列
 * @returns 解析された日時情報
 */
function parseDateString(
  dateString: string
): { startDate: string; endDate: string } | null {
  // 日本語の日時パターンを解析（より多様なパターンに対応）
  const patterns = [
    // 2025年6月27日 16:00 - 17:00
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/,
    // 6月27日 16:00-17:00
    /(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/,
    // 2025年6月27日 16:00～17:00 (全角チルダ)
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})\s*～\s*(\d{1,2}):(\d{2})/,
    // 6月27日 16:00～17:00 (全角チルダ)
    /(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})\s*～\s*(\d{1,2}):(\d{2})/,
    // 2025-06-27 16:00-17:00
    /(\d{4})-(\d{1,2})-(\d{1,2})\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/,
    // 単体の日時パターン（終了時刻なし）
    // 2025年6月27日 16:00
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})/,
    // 6月27日 16:00
    /(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})/,
  ]

  for (const pattern of patterns) {
    const match = dateString.match(pattern)
    if (match) {
      let year, month, day, startHour, startMinute, endHour, endMinute

      if (match.length === 8) {
        // 年が含まれて時間範囲がある場合
        ;[, year, month, day, startHour, startMinute, endHour, endMinute] =
          match
      } else if (match.length === 7) {
        // 年が含まれない時間範囲がある場合
        year = new Date().getFullYear().toString()
        ;[, month, day, startHour, startMinute, endHour, endMinute] = match
      } else if (match.length === 6) {
        // 年が含まれて時間範囲がない場合
        ;[, year, month, day, startHour, startMinute] = match
        endHour = (parseInt(startHour) + 1).toString() // 1時間後を設定
        endMinute = startMinute
      } else if (match.length === 5) {
        // 年が含まれない時間範囲がない場合
        year = new Date().getFullYear().toString()
        ;[, month, day, startHour, startMinute] = match
        endHour = (parseInt(startHour) + 1).toString() // 1時間後を設定
        endMinute = startMinute
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
        endDate: endDate.toISOString(),
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
  let locationText = ''

  // EventInfoItem_valueクラスから場所情報を探す
  $('[class*="EventInfoItem_value"]').each((index, element) => {
    const text = $(element).text().trim()
    // 場所らしいテキストかチェック（住所、建物名、地名を含む）
    if (
      text &&
      (text.includes('東京') ||
        text.includes('大阪') ||
        text.includes('京都') ||
        text.includes('〒') ||
        text.includes('日本') ||
        text.includes('羽田') ||
        text.includes('空港') ||
        text.includes('Zone') ||
        text.includes('階') ||
        text.includes('丁目') ||
        text.includes('区') ||
        text.includes('市') ||
        text.includes('県') ||
        text.includes('都') ||
        text.includes('府') ||
        text.includes('オンライン') ||
        text.includes('Zoom') ||
        text.includes('Teams'))
    ) {
      locationText = text
      return false // break
    }
  })

  // 見つからない場合は一般的なセレクタを試行
  if (!locationText) {
    const locationSelectors = [
      '[class*="EventInfoItem_value"]',
      '.location',
      '.venue',
      '.place',
      '.address',
      '[data-testid="location"]',
      '.event-location',
    ]

    for (const selector of locationSelectors) {
      const element = $(selector).first()
      if (element.length > 0) {
        const text = element.text().trim()
        if (text && text.length > 2) {
          locationText = text
          break
        }
      }
    }
  }

  return locationText || 'オンライン'
}

/**
 * イベント説明を抽出する
 * @param $ - Cheerioオブジェクト
 * @param originalUrl - 元のイベントURL
 * @returns イベント説明
 */
function extractDescription($: cheerio.Root, originalUrl: string): string {
  // 4s.link特有のクラス名と一般的なセレクタを試行
  const descriptionSelectors = [
    // 4s.linkのRichTextクラス（ハッシュ値に対応）
    '[class*="RichText_component"]',
    '[class^="RichText_component"]',
    // 一般的なセレクタ
    '.description',
    '.event-description',
    '.content',
    '.summary',
    '.details',
    '[data-testid="description"]',
    '.event-content',
    '.rich-text',
  ]

  let descriptionElement: cheerio.Cheerio<any> | null = null

  // RichText_componentクラスから詳細情報を探す
  const richTextElement = $('[class*="RichText_component"]').first()
  if (richTextElement.length > 0) {
    descriptionElement = richTextElement
  }

  // 見つからない場合は他のセレクタを試行
  if (!descriptionElement) {
    for (const selector of descriptionSelectors) {
      const element = $(selector).first()
      if (element.length > 0) {
        const text = element.text().trim()
        if (text && text.length > 10) {
          descriptionElement = element
          break
        }
      }
    }
  }

  // 最後の手段として、長いテキストを含む要素を探す
  if (!descriptionElement) {
    $('p, div').each((index, element) => {
      const text = $(element).text().trim()
      if (
        text &&
        text.length > 50 &&
        !text.includes('年') &&
        !text.includes('時')
      ) {
        descriptionElement = $(element)
        return false // break
      }
    })
  }

  if (descriptionElement) {
    const formattedDescription = formatDescriptionHTML(descriptionElement)
    // イベントURLを先頭に配置
    return `詳細: ${originalUrl}\n\n${formattedDescription}`
  }

  return `詳細: ${originalUrl}\n\nイベントの詳細情報`
}

/**
 * 説明文のHTMLを適切な形式に変換する
 * @param element - CheerioのHTML要素
 * @returns フォーマットされた説明文
 */
function formatDescriptionHTML(element: cheerio.Cheerio<any>): string {
  // HTMLのコピーを作成して処理
  const tempElement = element.clone()
  
  // <br>タグを改行文字に変換
  tempElement.find('br').replaceWith('\n')
  
  // 段落ごとに処理
  let formattedText = ''
  tempElement.find('p').each((index, pElement) => {
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

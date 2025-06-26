import { NextRequest, NextResponse } from 'next/server'
import { parseEventFromUrl } from '@/lib/event-parser'
import { isValid4sLinkUrl } from '@/lib/calendar-utils'
import { ParseEventResponse } from '@/types/event'

/**
 * イベントURL解析APIのPOSTハンドラー
 * @param request - APIリクエスト
 * @returns イベント情報のレスポンス
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ParseEventResponse>> {
  try {
    const body = await request.json()
    const { url } = body

    // URLバリデーション
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URLが提供されていません' },
        { status: 400 }
      )
    }

    if (!isValid4sLinkUrl(url)) {
      return NextResponse.json(
        { success: false, error: '有効な4s.linkのURLを入力してください' },
        { status: 400 }
      )
    }

    // イベント情報を解析
    const eventInfo = await parseEventFromUrl(url)

    return NextResponse.json({
      success: true,
      event: eventInfo,
    })
  } catch (error) {
    console.error('イベント解析エラー:', error)

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'イベント情報の取得に失敗しました'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * 許可されていないHTTPメソッドのハンドラー
 * @returns メソッド不許可のレスポンス
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

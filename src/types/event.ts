/**
 * イベント情報の型定義
 */
export interface EventInfo {
  /** イベントタイトル */
  title: string
  /** 開始日時（ISO文字列） */
  startDate: string
  /** 終了日時（ISO文字列） */
  endDate: string
  /** イベントの説明 */
  description: string
  /** 開催場所 */
  location: string
  /** タイムゾーン */
  timezone: string
  /** 元のURL */
  originalUrl: string
}

/**
 * APIレスポンスの型定義
 */
export interface ParseEventResponse {
  /** 成功フラグ */
  success: boolean
  /** イベント情報（成功時） */
  event?: EventInfo
  /** エラーメッセージ（失敗時） */
  error?: string
}

/**
 * APIリクエストの型定義
 */
export interface ParseEventRequest {
  /** パースするURL */
  url: string
}

/**
 * ローディング状態の型定義
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
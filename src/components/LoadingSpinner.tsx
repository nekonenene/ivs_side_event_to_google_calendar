/**
 * ローディングスピナーコンポーネント
 * 処理中の状態を表示する
 */
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">処理中...</span>
    </div>
  )
}

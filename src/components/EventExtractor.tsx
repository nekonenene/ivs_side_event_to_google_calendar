/**
 * サイト終了告知コンポーネント
 * IVS2025 終了に伴うサービス終了のお知らせを表示する
 */
export default function EventExtractor() {
  return (
    <div
      className="w-full block"
      style={{ fontFamily: "'Mochiy Pop P One', system-ui, sans-serif" }}
    >
      <div
        style={{
          margin: '0 auto 1.5em',
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
          minWidth: 0,
        }}
      >
        <h2>IVS2025 が終了したためこのサイトは終了しました m(_ _)m</h2>
        <p
          style={{
            color: '#fff',
            fontSize: '1rem',
            fontStyle: 'italic',
            lineHeight: 1.8,
            marginBottom: '1em',
            textShadow: '1px 1px 0 #000',
          }}
        >
          現在の{' '}
          <a
            href="https://4s.link/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0f0', textDecoration: 'none' }}
          >
            4s.link
          </a>{' '}
          は「カレンダーに登録」ボタンから
          <br />
          Googleカレンダーへの登録ができるようになりました!!
        </p>
      </div>
    </div>
  )
}

"use client";
import Image from "next/image";
import { useEffect } from "react";
import EventExtractor from "@/components/EventExtractor";

const marqueeText = "IVSサイドイベントをGoogleカレンダーにカンタン登録！ 4s.linkのイベントURLを貼るだけ！！";

/**
 * メインページコンポーネント
 * イベントURL入力とGoogleカレンダー登録機能を提供する
 */
export default function Home() {
  // 星アニメーション生成
  useEffect(() => {
    const starryBg = document.getElementById("starry-bg");
    if (!starryBg) return;
    starryBg.innerHTML = "";
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 120; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * w}px`;
      star.style.top = `${Math.random() * h}px`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      starryBg.appendChild(star);
    }
  }, []);

  return (
    <main className="app-bg font-mochiy" style={{ minHeight: "100vh", textAlign: "center" }}>
      {/* お知らせスクロールボックス */}
      <div className="marquee-box">
        <span className="marquee-content">
          {marqueeText}
          <span aria-hidden="true">{marqueeText}</span>
        </span>
      </div>

      {/* 虹色タイトル */}
      <h1 className="rainbow-text" style={{ fontSize: "2.5rem", margin: "0.5em 0" }}>
        IVSサイドイベント to Googleカレンダー
      </h1>
      <div style={{ color: "#ff0", fontSize: "1.2rem", marginBottom: "1em", textShadow: "2px 2px 0 #000, 0 0 8px #0ff", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Meiryo', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif", fontWeight: 700 }}>
        4s.linkのイベントURLを入力して、Googleカレンダーに一発登録！
      </div>
      <div style={{ color: "#fff", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto 2em", textShadow: "1px 1px 0 #000", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Meiryo', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif", fontWeight: 700 }}>
        参加したいイベントを見逃さず、スケジュール管理もラクラク！
      </div>
      <hr />
      <EventExtractor />
      <hr />
      <a
        href="https://4s.link/ja/explore"
        target="_blank"
        rel="noopener noreferrer"
        className="tacky-btn"
        style={{ display: 'block', width: '240px', textDecoration: 'none', margin: '2em auto' }}
      >
        サイドイベント一覧はこちら
      </a>
      <a
        href="https://4s.link/ja/explore"
        target="_blank"
        rel="noopener noreferrer"
        className="tacky-btn"
        style={{ display: 'block', width: '240px', textDecoration: 'none', margin: '2em auto' }}
      >
        IVS2025公式はこちら
      </a>
      <a
        href="https://x.com/yokoe24"
        target="_blank"
        rel="noopener noreferrer"
        className="tacky-btn"
        style={{ display: 'block', width: '240px', textDecoration: 'none', margin: '2em auto' }}
      >
        製作者のXアカウント
      </a>
    </main>
  );
}

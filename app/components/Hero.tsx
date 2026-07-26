"use client";

import { useState, useEffect } from "react";
import HeroSceneLoader from "./HeroSceneLoader";

export default function Hero() {
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 900px)").matches;
    setShow3d(!reduced && !narrow);
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="heroGrid">
        <div className="heroContent">
          <p className="eyebrow">AI Receptionist · We Run It. You Get Bookings.</p>
          <h1 id="hero-heading">
            <span className="gradient">WhatsApp-first AI receptionist for Bali businesses.</span>
            <br />
            Diterima 24/7. Dibalas instan. Anda fokus layani tamu.
          </h1>
          <p className="heroCopy">
            Kami setup chatbot WhatsApp + web untuk villa, klinik, salon, restoran Anda dalam 3 hari.
            Semua pertanyaan tamu dijawab otomatis — booking, FAQ, arah lokasi, review Google Maps.
            AI balas instan 24/7. Zero missed leads.
          </p>
          <div className="heroActions">
            <a href="#demo" className="btnPrimary">
              Booking Demo 30 Menit (Gratis) →
            </a>
            <a href="#pricing" className="btnSecondary">
              Lihat Harga Mulai Rp 750K/bulan
            </a>
          </div>
          <div className="heroTrustBadges">
            <span className="badge">✓ 50+ bisnis Bali percaya</span>
            <span className="badge">✓ WhatsApp Business API Official Partner</span>
            <span className="badge">✓ Uptime 99.9% · Setup 3 hari</span>
          </div>
        </div>

        <div className={`heroVisual ${show3d ? "hasScene" : ""}`}>
          {show3d && (
            <div className="heroSceneWrap" aria-hidden="true">
              <HeroSceneLoader />
            </div>
          )}
          <div className="heroSceneFallback" aria-hidden="true" />

          {/* WhatsApp Conversation Mock */}
          <div className="wa-mock" aria-label="Contoh percakapan WhatsApp Opsora">
            <div className="wa-header">
              <div className="wa-avatar">🏨</div>
              <div className="wa-info">
                <div className="wa-name">Villa Sari Bali</div>
                <div className="wa-status">Online · AI Receptionist aktif</div>
              </div>
              <div className="wa-badge">Verified Business</div>
            </div>
            <div className="wa-messages">
              <div className="msg in">
                <div className="msg-bubble">
                  Halo, mau tanya ketersediaan villa 2 kamar untuk 15-18 Agustus. Bisa 4 orang?
                </div>
                <div className="msg-time">09:12</div>
              </div>
              <div className="msg out auto">
                <div className="msg-bubble">
                  Halo! 👋 Villa Sari Bali siap melayani.
                  <br/><br/>
                  Villa 2 kamar (mampu 4 orang) tersedia untuk 15-18 Agustus.
                  Rate: Rp 2.800.000/malam include sarapan & airport transfer.
                  <br/><br/>
                  Mau saya bantu booking sekaligus kirim detail pembayaran via WhatsApp?
                </div>
                <div className="msg-time">09:12</div>
                <span className="auto-badge">⚡ AI Auto-Reply</span>
              </div>
              <div className="msg in">
                <div className="msg-bubble">
                  Bisa! Tolong kirim detail pembayarannya ya.
                </div>
                <div className="msg-time">09:13</div>
              </div>
              <div className="msg out auto">
                <div className="msg-bubble">
                  Terima kasih! Detail pembayaran sudah dikirim ke WhatsApp ini.
                  Booking dikunci setelah transfer konfirmasi.
                  See you soon di Bali! 🌴
                </div>
                <div className="msg-time">09:13</div>
                <span className="auto-badge">⚡ AI Auto-Reply</span>
              </div>
            </div>
            <div className="wa-composer">
              <span className="composer-hint">Ketik pesan...</span>
            </div>
          </div>

          {/* Cal.com Embed Placeholder */}
          <div className="cal-embed" id="cal-embed">
            <iframe
              src="https://cal.com/opsora/30min?embed=true"
              title="Booking Demo Opsora"
              className="cal-iframe"
              allow="camera; microphone"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
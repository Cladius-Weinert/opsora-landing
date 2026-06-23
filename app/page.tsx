"use client";

import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");

  async function submitLead(e: any) {
    e.preventDefault();
    setStatus("Mengirim...");
    setReply("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      business: form.get("business"),
      phone: form.get("phone"),
      need: form.get("need"),
      country: "Indonesia",
      language: "id",
      source: "opsora-landing"
    };

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      setStatus("Gagal mengirim. Silakan coba lagi atau hubungi kami langsung.");
      return;
    }

    setStatus("Lead terkirim. Kami akan follow-up untuk demo singkat.");
    setReply(data.reply || "");
  }

  const card = {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
    background: "#ffffff"
  };

  return (
    <main style={{ fontFamily: "Arial, sans-serif", color: "#111827", background: "#f8fafc", minHeight: "100vh" }}>
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 20px 32px" }}>
        <div style={{ display: "inline-block", padding: "8px 12px", borderRadius: 999, background: "#eef2ff", color: "#3730a3", fontSize: 14, marginBottom: 20 }}>
          AI receptionist + lead capture + CRM follow-up
        </div>

        <h1 style={{ fontSize: 46, lineHeight: 1.05, letterSpacing: -1.2, margin: "0 0 18px" }}>
          Opsora membantu bisnis membalas calon pelanggan lebih cepat, rapi, dan otomatis.
        </h1>

        <p style={{ fontSize: 19, lineHeight: 1.6, color: "#4b5563", maxWidth: 760 }}>
          Untuk villa, klinik, salon, rental, agency, dan SMB yang kehilangan lead karena telat membalas WhatsApp, inquiry website, atau permintaan booking.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
          <a href="#demo" style={{ padding: "14px 18px", borderRadius: 12, background: "#111827", color: "white", textDecoration: "none", fontWeight: 700 }}>
            Minta Demo Singkat
          </a>
          <a href="#pricing" style={{ padding: "14px 18px", borderRadius: 12, background: "white", color: "#111827", textDecoration: "none", border: "1px solid #d1d5db", fontWeight: 700 }}>
            Lihat Paket
          </a>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div style={card}>
            <h3>Masalah</h3>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>Lead masuk malam hari, admin lambat membalas, calon tamu pindah ke kompetitor.</p>
          </div>
          <div style={card}>
            <h3>Solusi</h3>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>AI receptionist membalas cepat, menangkap data lead, lalu menyimpan follow-up ke CRM.</p>
          </div>
          <div style={card}>
            <h3>Handoff</h3>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>Jika perlu manusia, sistem menyiapkan ringkasan lead agar admin tinggal lanjut chat.</p>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px" }}>
        <h2>Yang dibuat untuk bisnis Anda</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            "AI reply untuk inquiry pelanggan",
            "Lead capture dari website/form",
            "CRM sederhana untuk status lead",
            "Follow-up sequence manual/otomatis",
            "Booking request intake",
            "Human handoff untuk admin"
          ].map((item) => (
            <div key={item} style={card}>✓ {item}</div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px" }}>
        <h2>Paket awal</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <div style={card}>
            <h3>Starter</h3>
            <p style={{ fontSize: 28, fontWeight: 800 }}>Rp 750rb<span style={{ fontSize: 15, color: "#6b7280" }}>/bulan</span></p>
            <p style={{ color: "#4b5563" }}>Untuk bisnis kecil yang ingin mulai menangkap lead dan balasan otomatis.</p>
            <ul style={{ lineHeight: 1.8 }}>
              <li>1 form lead</li>
              <li>AI reply basic</li>
              <li>CRM dashboard sederhana</li>
            </ul>
          </div>
          <div style={{ ...card, border: "2px solid #111827" }}>
            <h3>Growth</h3>
            <p style={{ fontSize: 28, fontWeight: 800 }}>Rp 1,5jt<span style={{ fontSize: 15, color: "#6b7280" }}>/bulan</span></p>
            <p style={{ color: "#4b5563" }}>Untuk villa, klinik, salon, dan service business yang butuh follow-up lebih rapi.</p>
            <ul style={{ lineHeight: 1.8 }}>
              <li>AI receptionist</li>
              <li>Lead capture + CRM</li>
              <li>Status pipeline</li>
              <li>Human handoff</li>
            </ul>
          </div>
          <div style={card}>
            <h3>Custom</h3>
            <p style={{ fontSize: 28, fontWeight: 800 }}>Diskusi</p>
            <p style={{ color: "#4b5563" }}>Untuk integrasi WhatsApp, booking calendar, Notion, Google Sheets, atau workflow khusus.</p>
            <ul style={{ lineHeight: 1.8 }}>
              <li>Automation custom</li>
              <li>Integrasi tools</li>
              <li>Dashboard khusus</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="demo" style={{ maxWidth: 760, margin: "0 auto", padding: "36px 20px 70px" }}>
        <div style={card}>
          <h2>Minta demo singkat</h2>
          <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
            Isi data bisnis Anda. Sistem akan mengirim lead ke Opsora workflow dan membuat draft balasan awal.
          </p>

          <form onSubmit={submitLead} style={{ display: "grid", gap: 12, marginTop: 20 }}>
            <input name="name" required placeholder="Nama" style={{ padding: 14, borderRadius: 10, border: "1px solid #d1d5db" }} />
            <input name="business" required placeholder="Nama bisnis" style={{ padding: 14, borderRadius: 10, border: "1px solid #d1d5db" }} />
            <input name="phone" required placeholder="Nomor WhatsApp" style={{ padding: 14, borderRadius: 10, border: "1px solid #d1d5db" }} />
            <textarea name="need" required placeholder="Contoh: Butuh sistem balas tamu otomatis dan booking untuk villa" rows={5} style={{ padding: 14, borderRadius: 10, border: "1px solid #d1d5db" }} />
            <button type="submit" style={{ padding: 15, borderRadius: 10, cursor: "pointer", background: "#111827", color: "white", border: 0, fontWeight: 800 }}>
              Kirim & Minta Demo
            </button>
          </form>

          {status && <p style={{ marginTop: 20 }}><b>{status}</b></p>}
          {reply && <pre style={{ whiteSpace: "pre-wrap", background: "#f3f4f6", padding: 14, borderRadius: 10 }}>{reply}</pre>}
        </div>
      </section>
    </main>
  );
}

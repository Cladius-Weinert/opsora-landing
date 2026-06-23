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
      setStatus("Gagal mengirim lead.");
      return;
    }

    setStatus("Lead terkirim.");
    setReply(data.reply || "");
  }

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Opsora</h1>
      <p>
        AI receptionist, lead capture, CRM follow-up, booking automation,
        dashboard sederhana, dan human handoff untuk bisnis lokal dan SMB global.
      </p>

      <form onSubmit={submitLead} style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <input name="name" required placeholder="Nama" style={{ padding: 12 }} />
        <input name="business" required placeholder="Nama bisnis" style={{ padding: 12 }} />
        <input name="phone" required placeholder="Nomor WhatsApp" style={{ padding: 12 }} />
        <textarea name="need" required placeholder="Kebutuhan bisnis Anda" rows={5} style={{ padding: 12 }} />
        <button type="submit" style={{ padding: 14, cursor: "pointer" }}>
          Minta Demo Singkat
        </button>
      </form>

      {status && <p style={{ marginTop: 20 }}><b>{status}</b></p>}
      {reply && <pre style={{ whiteSpace: "pre-wrap", background: "#f3f3f3", padding: 14 }}>{reply}</pre>}
    </main>
  );
}

"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";

const segments = [
  {
    name: "Villa & hotel",
    pain: "Inquiry booking sering masuk malam dan butuh jawaban cepat."
  },
  {
    name: "Klinik & dentist",
    pain: "Pasien baru perlu screening ringan sebelum admin follow-up."
  },
  {
    name: "Salon & spa",
    pain: "Slot layanan, harga, dan follow-up harus rapi di jam sibuk."
  },
  {
    name: "Rental kendaraan",
    pain: "Calon customer membandingkan harga dan availability cepat."
  },
  {
    name: "Travel & property",
    pain: "Lead perlu dikualifikasi sebelum masuk chat sales."
  }
];

const workflow = [
  "Website atau form menerima inquiry",
  "AI receptionist membuat balasan awal",
  "Lead tersimpan ke CRM lokal",
  "Admin review lalu lanjut WhatsApp"
];

const pricing = [
  {
    plan: "Starter",
    price: "Rp 750rb",
    note: "Untuk bisnis kecil yang ingin mulai menangkap lead dari website.",
    items: ["1 lead form", "AI reply basic", "CRM dashboard sederhana"]
  },
  {
    plan: "Growth",
    price: "Rp 1,5jt",
    note: "Untuk villa, klinik, salon, dan service business yang butuh follow-up rapi.",
    items: ["AI receptionist", "Lead capture + CRM", "Status pipeline", "Human handoff"],
    featured: true
  },
  {
    plan: "Custom",
    price: "Diskusi",
    note: "Untuk integrasi booking, Google Sheets, Notion, atau workflow khusus.",
    items: ["Automation custom", "Integrasi tools", "Dashboard khusus"]
  }
];

const faqs = [
  {
    q: "Apakah ini menggantikan admin?",
    a: "Tidak. Opsora menyiapkan balasan awal, ringkasan lead, dan follow-up draft agar admin bisa merespons lebih cepat."
  },
  {
    q: "Apakah langsung auto-kirim WhatsApp?",
    a: "Tidak untuk fase MVP. Outreach dan follow-up penting tetap lewat review manusia."
  },
  {
    q: "Cocok untuk bisnis di luar Bali?",
    a: "Bisa, tetapi fase awal difokuskan untuk SMB Denpasar/Bali agar setup dan template lebih tajam."
  }
];

type LeadResponse = {
  ok?: boolean;
  reply?: string;
};

export default function Page() {
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Mengirim...");
    setReply("");
    setIsSubmitting(true);

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

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await res.json().catch(() => ({}))) as LeadResponse;

      if (!res.ok || !data.ok) {
        setStatus("Gagal mengirim. Silakan coba lagi atau hubungi kami langsung.");
        return;
      }

      setStatus("Lead terkirim. Kami akan follow-up untuk demo singkat.");
      setReply(data.reply || "");
      e.currentTarget.reset();
    } catch {
      setStatus("Gagal mengirim. Silakan coba lagi atau hubungi kami langsung.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <Image
          src="/opsora-dashboard-preview.png"
          alt="Opsora AI receptionist dashboard preview"
          fill
          priority
          sizes="100vw"
          className="heroImage"
        />
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="eyebrow">Denpasar/Bali SMB automation MVP</p>
          <h1>Opsora AI Receptionist</h1>
          <p className="heroCopy">
            Tangkap lead dari website, buat balasan awal, simpan ke CRM, lalu
            bantu admin follow-up tanpa kehilangan calon customer karena slow response.
          </p>
          <div className="heroActions">
            <a href="#demo" className="primaryAction">
              Minta Demo Singkat
            </a>
            <a href="#pricing" className="secondaryAction">
              Lihat Paket
            </a>
          </div>
          <p className="trustLine">
            Token backend tetap server-side. Follow-up outbound membutuhkan review manusia.
          </p>
        </div>
      </section>

      <section className="section intro">
        <div>
          <p className="sectionKicker">Untuk bisnis lokal yang hidup dari respons cepat</p>
          <h2>Lead tidak boleh hilang hanya karena admin sedang sibuk.</h2>
        </div>
        <p>
          Opsora disiapkan sebagai fondasi operasi: lead capture, AI reply draft,
          CRM sederhana, status pipeline, dan handoff ke manusia saat perlu.
        </p>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <p className="sectionKicker">Segmen awal</p>
          <h2>Template dibuat untuk use case SMB Indonesia.</h2>
        </div>
        <div className="segmentGrid">
          {segments.map((segment) => (
            <article className="card segmentCard" key={segment.name}>
              <h3>{segment.name}</h3>
              <p>{segment.pain}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="section workflowSection">
          <div className="sectionHeader">
            <p className="sectionKicker">Cara kerja</p>
            <h2>Dari inquiry sampai follow-up, alurnya tetap bisa diawasi.</h2>
          </div>
          <div className="workflowGrid">
            {workflow.map((step, index) => (
              <div className="workflowItem" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="sectionHeader">
          <p className="sectionKicker">Paket awal</p>
          <h2>Mulai kecil, lalu tambah integrasi setelah workflow terbukti.</h2>
        </div>
        <div className="pricingGrid">
          {pricing.map((item) => (
            <article className={`card priceCard ${item.featured ? "featured" : ""}`} key={item.plan}>
              <h3>{item.plan}</h3>
              <p className="price">{item.price}</p>
              <p>{item.note}</p>
              <ul>
                {item.items.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section faqSection">
        <div className="sectionHeader">
          <p className="sectionKicker">FAQ</p>
          <h2>Posisi MVP dibuat jelas sejak awal.</h2>
        </div>
        <div className="faqGrid">
          {faqs.map((faq) => (
            <article className="card" key={faq.q}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="demoBand" id="demo">
        <div className="demoLayout">
          <div>
            <p className="sectionKicker">Demo</p>
            <h2>Kirim satu contoh inquiry bisnis Anda.</h2>
            <p>
              Sistem akan mencatat lead ke workflow Opsora dan mengembalikan
              draft balasan awal jika backend demo sedang aktif.
            </p>
            <p className="privacyNote">
              Data form hanya dipakai untuk demo dan follow-up manual Opsora.
              Jangan kirim data sensitif pelanggan.
            </p>
          </div>

          <form onSubmit={submitLead} className="leadForm">
            <label>
              Nama
              <input name="name" required maxLength={120} placeholder="Nama Anda" />
            </label>
            <label>
              Nama bisnis
              <input name="business" required maxLength={160} placeholder="Contoh: Villa Sari Bali" />
            </label>
            <label>
              Nomor WhatsApp
              <input name="phone" maxLength={60} placeholder="+62..." />
            </label>
            <label>
              Kebutuhan
              <textarea
                name="need"
                required
                maxLength={1500}
                rows={5}
                placeholder="Contoh: Butuh sistem balas inquiry tamu dan catat booking request untuk villa."
              />
            </label>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim & Minta Demo"}
            </button>
            {status && (
              <p className="formStatus" aria-live="polite">
                {status}
              </p>
            )}
            {reply && <pre className="replyBox">{reply}</pre>}
          </form>
        </div>
      </section>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #f6f4ef;
          color: #17211c;
          font-family: Arial, Helvetica, sans-serif;
        }

        .hero {
          position: relative;
          min-height: 78vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          padding: 120px 20px 64px;
          background: #17211c;
        }

        .heroImage {
          object-fit: cover;
          object-position: center;
          opacity: 0.86;
        }

        .heroOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(13, 23, 18, 0.92) 0%, rgba(13, 23, 18, 0.62) 44%, rgba(13, 23, 18, 0.16) 100%),
            linear-gradient(0deg, rgba(13, 23, 18, 0.72) 0%, rgba(13, 23, 18, 0.06) 56%);
        }

        .heroContent {
          position: relative;
          z-index: 1;
          width: min(1080px, 100%);
          margin: 0 auto;
          color: #ffffff;
        }

        .eyebrow,
        .sectionKicker {
          margin: 0 0 12px;
          color: #2f8f72;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .hero .eyebrow {
          color: #8fe3c2;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 700px;
          margin-bottom: 18px;
          font-size: clamp(42px, 8vw, 84px);
          line-height: 0.98;
          letter-spacing: 0;
        }

        h2 {
          margin-bottom: 14px;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.08;
          letter-spacing: 0;
        }

        h3 {
          margin-bottom: 10px;
          font-size: 19px;
          line-height: 1.25;
        }

        .heroCopy {
          max-width: 670px;
          color: #f1f7f1;
          font-size: 20px;
          line-height: 1.55;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .primaryAction,
        .secondaryAction,
        .leadForm button {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 13px 18px;
          font-weight: 800;
          text-decoration: none;
        }

        .primaryAction,
        .leadForm button {
          border: 0;
          background: #f0b429;
          color: #17211c;
        }

        .secondaryAction {
          border: 1px solid rgba(255, 255, 255, 0.62);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .trustLine {
          max-width: 620px;
          margin: 18px 0 0;
          color: #d9e8df;
          font-size: 14px;
          line-height: 1.5;
        }

        .section {
          width: min(1080px, calc(100% - 40px));
          margin: 0 auto;
          padding: 58px 0;
        }

        .intro {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 34px;
          align-items: start;
        }

        .intro p,
        .card p,
        .demoLayout p {
          color: #4a554f;
          line-height: 1.65;
        }

        .sectionHeader {
          max-width: 760px;
          margin-bottom: 26px;
        }

        .segmentGrid,
        .pricingGrid,
        .faqGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .card {
          min-width: 0;
          border: 1px solid #d8d2c4;
          border-radius: 8px;
          padding: 20px;
          background: #fffdfa;
        }

        .segmentCard {
          border-top: 4px solid #2f8f72;
        }

        .band {
          background: #e9efe7;
          border-top: 1px solid #d4dfd1;
          border-bottom: 1px solid #d4dfd1;
        }

        .workflowSection {
          padding: 54px 0;
        }

        .workflowGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .workflowItem {
          min-width: 0;
          border-left: 4px solid #c95f3f;
          padding: 12px 14px;
          background: #f8fbf7;
        }

        .workflowItem span {
          display: block;
          margin-bottom: 8px;
          color: #c95f3f;
          font-weight: 900;
        }

        .workflowItem p {
          margin: 0;
          line-height: 1.45;
        }

        .priceCard.featured {
          border-color: #2f8f72;
          box-shadow: 0 16px 34px rgba(47, 143, 114, 0.16);
        }

        .price {
          margin-bottom: 10px;
          color: #17211c;
          font-size: 32px;
          font-weight: 900;
        }

        ul {
          margin: 18px 0 0;
          padding-left: 20px;
          line-height: 1.8;
        }

        .demoBand {
          background: #17211c;
          color: #ffffff;
          padding: 64px 20px;
        }

        .demoLayout {
          width: min(1080px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(320px, 1fr);
          gap: 34px;
          align-items: start;
        }

        .demoLayout p {
          color: #dce8df;
        }

        .privacyNote {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
          font-size: 14px;
        }

        .leadForm {
          display: grid;
          gap: 14px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          padding: 20px;
          background: #fffdfa;
          color: #17211c;
        }

        label {
          display: grid;
          gap: 7px;
          font-size: 14px;
          font-weight: 800;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #cfc7b7;
          border-radius: 8px;
          padding: 13px 12px;
          color: #17211c;
          font: inherit;
          line-height: 1.4;
          background: #ffffff;
        }

        textarea {
          resize: vertical;
        }

        .leadForm button {
          width: 100%;
          cursor: pointer;
          font: inherit;
        }

        .leadForm button:disabled {
          cursor: not-allowed;
          opacity: 0.72;
        }

        .formStatus {
          margin: 2px 0 0;
          color: #17211c;
          font-weight: 800;
        }

        .replyBox {
          max-height: 260px;
          overflow: auto;
          white-space: pre-wrap;
          border-radius: 8px;
          padding: 14px;
          background: #eef4ed;
          color: #17211c;
          font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        }

        @media (max-width: 860px) {
          .hero {
            min-height: 72vh;
            padding-top: 96px;
          }

          .heroOverlay {
            background:
              linear-gradient(90deg, rgba(13, 23, 18, 0.9) 0%, rgba(13, 23, 18, 0.7) 100%),
              linear-gradient(0deg, rgba(13, 23, 18, 0.74) 0%, rgba(13, 23, 18, 0.2) 62%);
          }

          .intro,
          .demoLayout {
            grid-template-columns: 1fr;
          }

          .workflowGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .hero {
            padding: 82px 16px 46px;
          }

          .heroActions {
            display: grid;
          }

          .primaryAction,
          .secondaryAction {
            width: 100%;
          }

          .section {
            width: min(100% - 28px, 1080px);
            padding: 42px 0;
          }

          .workflowGrid {
            grid-template-columns: 1fr;
          }

          .demoBand {
            padding: 48px 14px;
          }

          .leadForm {
            padding: 16px;
          }
        }
      `}</style>
    </main>
  );
}

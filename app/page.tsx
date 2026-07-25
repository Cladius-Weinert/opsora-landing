"use client";

import { type FormEvent, useState } from "react";
import HeroSceneLoader from "./components/HeroSceneLoader";

const segments = [
  { icon: "🏡", name: "Villa & Hotel", pain: "Inquiry booking malam hari sering terlewat.", tag: "Tier 1" },
  { icon: "💆", name: "Salon & Spa", pain: "Customer tanya treatment saat staff sibuk.", tag: "Tier 1" },
  { icon: "🏍️", name: "Rental Motor & Mobil", pain: "Traveler butuh motor hari ini, kompetitor lebih cepat.", tag: "Tier 1" },
  { icon: "🦷", name: "Klinik & Dentist", pain: "Inquiry pasien berulang, admin kewalahan.", tag: "Tier 2" },
  { icon: "🌴", name: "Travel & Tour", pain: "Paket custom butuh data terstruktur.", tag: "Tier 2" },
  { icon: "💪", name: "Gym & Fitness", pain: "Trial class tidak di-follow-up.", tag: "Tier 2" },
  { icon: "🍽️", name: "Restaurant & Cafe", pain: "Grup booking sering tidak direspons cepat.", tag: "Tier 2" },
  { icon: "🏠", name: "Property Agent", pain: "Lead campur aduk, sulit kualifikasi.", tag: "Tier 3" },
  { icon: "👕", name: "Laundry", pain: "Pickup hari ini tanpa konfirmasi cepat.", tag: "Tier 3" },
  { icon: "📚", name: "Course & School", pain: "Calon siswa tanya jadwal dan harga berulang.", tag: "Tier 3" },
  { icon: "🔧", name: "Repair Service", pain: "Detail masalah tidak lengkap saat urgent.", tag: "Tier 3" },
  { icon: "🎉", name: "Event Vendor", pain: "Inquiry wedding terlambat dijawab.", tag: "Tier 3" }
];

const workflow = [
  "Website atau form menerima inquiry",
  "AI receptionist membuat draft balasan",
  "Lead tersimpan ke CRM lokal",
  "Admin review lalu balas via email"
];

const stats = [
  { value: "0", label: "auto-send", detail: "Semua balasan lewat approval admin" },
  { value: "12", label: "segmen Bali", detail: "Villa, gym, spa, klinik, rental, dan lainnya" },
  { value: "<3 mnt", label: "demo intake", detail: "Inquiry masuk, draft siap direview" }
];

const pricing = [
  {
    plan: "Pilot",
    price: "Rp 299rb",
    period: "/7 hari",
    note: "Coba dulu tanpa komitmen. Setup chatbot + lead form.",
    items: ["AI chatbot basic", "1 lead form", "CRM dashboard", "Email support"],
    featured: false
  },
  {
    plan: "Starter",
    price: "Rp 499rb",
    period: "/bulan",
    note: "Bisnis kecil yang siap automate inquiry customer.",
    items: ["AI chatbot full", "Lead capture + CRM", "Auto follow-up", "Review management", "Email support"],
    featured: true
  },
  {
    plan: "Growth",
    price: "Rp 799rb",
    period: "/bulan",
    note: "Villa, klinik, salon — full automation multi-channel.",
    items: ["Semua di Starter", "Multi-location", "Social media AI", "Google Maps optimization", "Priority support"],
    featured: false
  },
  {
    plan: "Premium",
    price: "Rp 1,49jt",
    period: "/bulan",
    note: "Enterprise: integrasi booking, PMS, payment gateway.",
    items: ["Semua di Growth", "Booking integration", "Payment gateway", "Custom dashboard", "Dedicated support"],
    featured: false
  }
];

const segmentOptions = [
  { value: "", label: "Pilih jenis bisnis (opsional)" },
  { value: "villa", label: "Villa / Hotel" },
  { value: "salon", label: "Salon / Spa" },
  { value: "rental", label: "Rental Motor / Mobil" },
  { value: "clinic", label: "Klinik / Dentist" },
  { value: "travel", label: "Travel / Tour" },
  { value: "gym", label: "Gym / Fitness" },
  { value: "restaurant", label: "Restaurant / Cafe" },
  { value: "property", label: "Property Agent" },
  { value: "laundry", label: "Laundry" },
  { value: "course", label: "Course / School" },
  { value: "repair", label: "Repair Service" },
  { value: "event", label: "Event Vendor" },
  { value: "other", label: "Lainnya" }
];

const faqs = [
  {
    q: "Apakah ini menggantikan admin?",
    a: "Tidak. Opsora menyiapkan draft balasan, ringkasan lead, dan saran follow-up agar admin merespons lebih cepat."
  },
  {
    q: "Apakah langsung auto-kirim pesan?",
    a: "Tidak. Semua balasan tetap lewat review admin — tidak ada auto-spam ke customer Anda."
  },
  {
    q: "Cocok untuk bisnis Bali mana saja?",
    a: "Villa, gym, spa, klinik, rental, travel, restaurant, laundry, course, repair, event — 12 segmen dengan template siap pakai."
  },
  {
    q: "Berapa biaya mulai?",
    a: "Audit gratis. Pilot 7 hari mulai Rp 300rb. Paket Starter Rp 750rb, Growth Rp 1,5jt setup."
  }
];

type LeadResponse = { ok?: boolean; reply?: string };

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
    const segment = String(form.get("segment") || "");
    const needBase = String(form.get("need") || "");
    const need = segment ? `[${segment}] ${needBase}` : needBase;

    const payload = {
      name: form.get("name"),
      business: form.get("business"),
      phone: form.get("phone"),
      need,
      country: "Indonesia",
      language: "id",
      source: segment ? `opsora-landing-${segment}` : "opsora-landing",
      website: form.get("website")
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

      setStatus("Lead terkirim! Kami akan follow-up untuk demo singkat.");
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
      <nav className="nav">
        <div className="navBrand">
          <span>Opsora</span>
        </div>
        <div className="navLinks">
          <a href="#segments">Segmen</a>
          <a href="#services">Layanan</a>
          <a href="#pricing">Paket</a>
          <a href="#faq">FAQ</a>
          <a href="/blog">Blog</a>
        </div>
        <a href="#demo" className="navCta">
          Konsultasi Gratis
        </a>
      </nav>

      <section className="hero">
        <HeroSceneLoader />
        <div className="heroContent">
          <p className="eyebrow">Bali SMB · AI Receptionist</p>
          <h1>
            <span className="gradient">Balas Lead Lebih Cepat.</span>
            <br />
            Jangan Kehilangan Customer.
          </h1>
          <p className="heroCopy">
            Opsora menangkap inquiry dari website, membuat draft balasan AI, menyimpan lead ke CRM,
            dan menyiapkan follow-up — khusus bisnis Bali: villa, gym, spa, klinik, rental, dan lainnya.
          </p>
          <div className="heroActions">
            <a href="#demo" className="btnPrimary">
              Minta Demo Gratis →
            </a>
            <a href="#segments" className="btnSecondary">
              Lihat 12 Segmen Bali
            </a>
          </div>
          <p className="trustLine">
            Tidak ada auto-send. Admin tetap review setiap balasan sebelum dikirim.
          </p>
        </div>
        <div className="heroVisual" />
      </section>

      <section className="section" id="segments">
        <p className="sectionKicker">12 Segmen Bali</p>
        <h2>Dibuat untuk bisnis lokal yang hidup dari respons cepat.</h2>
        <p className="sectionDesc">
          Dari villa di Seminyak sampai gym di Canggu — setiap segmen punya template FAQ, field intake,
          dan alur handoff yang aman.
        </p>
        <div className="segmentGrid">
          {segments.map((s) => (
            <article className="segmentCard" key={s.name}>
              <div className="segmentIcon">{s.icon}</div>
              <h3>{s.name}</h3>
              <p>{s.pain}</p>
              <span className="segmentTag">{s.tag}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="band" id="workflow">
        <div className="section">
          <p className="sectionKicker">Cara kerja</p>
          <h2>Dari inquiry sampai follow-up — tetap bisa diawasi.</h2>
          <div className="workflowGrid">
            {workflow.map((step, i) => (
              <div className="workflowStep" key={step}>
                <span className="stepNum">{i + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <p className="sectionKicker">Kenapa Opsora</p>
        <h2>Automation yang aman untuk bisnis Bali.</h2>
        <div className="statsGrid">
          {stats.map((s) => (
            <div className="statCard" key={s.label}>
              <div className="statValue">{s.value}</div>
              <div className="statLabel">{s.label}</div>
              <div className="statDetail">{s.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="services">
        <p className="sectionKicker">Layanan AI</p>
        <h2>Selain software, kami juga jasa setup AI untuk bisnis Anda.</h2>
        <div className="statsGrid">
          <div className="statCard">
            <div className="statValue">💬</div>
            <div className="statLabel">AI Chatbot Setup</div>
            <div className="statDetail">Setup Rp 3jt + Rp 1jt/bulan. WhatsApp + web chatbot 24/7. Live dalam 3 hari.</div>
          </div>
          <div className="statCard">
            <div className="statValue">📍</div>
            <div className="statLabel">Google Maps Optimization</div>
            <div className="statDetail">Setup Rp 2jt + Rp 2jt/bulan. Ranking lebih tinggi, review management, posting rutin.</div>
          </div>
          <div className="statCard">
            <div className="statValue">📱</div>
            <div className="statLabel">Social Media AI</div>
            <div className="statDetail">Rp 3jt/bulan. Content creation + scheduling + analytics Instagram & Facebook.</div>
          </div>
          <div className="statCard">
            <div className="statValue">⭐</div>
            <div className="statLabel">AI Review Responder</div>
            <div className="statDetail">Rp 1,5jt/bulan. Auto-reply review Google + TripAdvisor dalam berbagai bahasa.</div>
          </div>
          <div className="statCard">
            <div className="statValue">🔍</div>
            <div className="statLabel">AI Readiness Audit</div>
            <div className="statDetail">Rp 5jt. Audit kesiapan bisnis Anda untuk adopsi AI + laporan + rekomendasi.</div>
          </div>
          <div className="statCard">
            <div className="statValue">🎯</div>
            <div className="statLabel">Custom Package</div>
            <div className="statDetail">Kombinasi layanan sesuai kebutuhan bisnis Anda. Hubungi kami untuk penawaran khusus.</div>
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: 16, opacity: 0.8 }}>
          Semua layanan bisa dimulai dengan <strong>konsultasi gratis 30 menit</strong>. Isi form di bawah untuk jadwalkan.
        </p>
      </section>

      <section className="section" id="pricing">
        <p className="sectionKicker">Paket Software</p>
        <h2>Mulai kecil, scale setelah terbukti.</h2>
        <div className="pricingGrid">
          {pricing.map((p) => (
            <article className={`priceCard ${p.featured ? "featured" : ""}`} key={p.plan}>
              {p.featured && <span className="priceBadge">Populer</span>}
              <h3>{p.plan}</h3>
              <div className="priceAmount">
                {p.price}
                {p.period && <span className="pricePeriod">{p.period}</span>}
              </div>
              <p className="sectionDesc">{p.note}</p>
              <ul>
                {p.items.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="faq">
        <p className="sectionKicker">FAQ</p>
        <h2>Pertanyaan yang sering ditanyakan.</h2>
        <div className="faqGrid">
          {faqs.map((faq) => (
            <article className="faqCard" key={faq.q}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="demoSection" id="demo">
        <div className="section demoLayout">
          <div>
            <p className="sectionKicker">Demo Gratis</p>
            <h2>Coba dengan inquiry bisnis Anda.</h2>
            <p className="sectionDesc">
              Pilih segmen bisnis, kirim contoh inquiry, dan lihat bagaimana Opsora menyiapkan draft
              balasan serta mencatat lead ke CRM.
            </p>
            <p className="trustLine" style={{ marginTop: 24 }}>
              Pilot 7 hari mulai Rp 300rb. Audit inquiry flow gratis.
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
              Jenis bisnis
              <select name="segment" defaultValue="">
                {segmentOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nomor Telepon (opsional)
              <input name="phone" maxLength={60} inputMode="tel" placeholder="+62..." />
            </label>
            <label>
              Kebutuhan
              <textarea
                name="need"
                required
                maxLength={1500}
                rows={4}
                placeholder="Contoh: Butuh sistem balas inquiry tamu villa dan catat booking request."
              />
            </label>
            <label className="spamTrap" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
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

      <section className="section" id="trust">
        <p className="sectionKicker">Kenapa Aman</p>
        <h2>Bukan chatbot. Ini asisten yang bisa diawasi.</h2>
        <div className="trustGrid">
          <article className="trustCard">
            <div className="trustIcon">🔒</div>
            <h3>Data di Supabase</h3>
            <p>Lead dan percakapan tersimpan di cloud database terenkripsi. Bukan spreadsheet yang bisa hilang.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">✋</div>
            <h3>Admin Selalu Review</h3>
            <p>Setiap draft balasan AI harus disetujui admin sebelum dikirim. Tidak ada yang auto-spam ke WhatsApp customer.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">⚡</div>
            <h3>Draft Siap dalam 3 Menit</h3>
            <p>Inquiry masuk, AI langsung siapkan draft balasan + ringkasan lead. Admin tinggal review dan approve.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">🎯</div>
            <h3>12 Template Segmen</h3>
            <p>Bukan template generik. Setiap segmen bisnis punya field intake, FAQ, dan alur handoff yang spesifik.</p>
          </article>
        </div>
        <p className="pilotNote">
          <strong>Program pilot tersedia.</strong> 7 hari trial mulai Rp 300rb. Audit inquiry flow gratis — tanpa komitmen.
        </p>
      </section>

      <footer className="footer">
        <p>Opsora AI Receptionist · Denpasar/Bali · Human-in-the-loop · No auto-spam</p>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Hubungi kami: <a href="mailto:jalankecil351@gmail.com" style={{ color: "inherit", textDecoration: "underline" }}>jalankecil351@gmail.com</a>
        </p>
        <p style={{ marginTop: 8, opacity: 0.6 }}>© 2025 Opsora. Sedang tahap MVP — draft only, admin review required.</p>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Opsora AI Receptionist",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "AI receptionist untuk bisnis Bali: villa, gym, spa, klinik, rental. Lead capture, draft balasan AI, CRM, dan human handoff.",
            offers: {
              "@type": "Offer",
              price: "750000",
              priceCurrency: "IDR",
              description: "Paket Starter — 1 lead form, AI reply basic, CRM dashboard"
            },
            areaServed: {
              "@type": "Place",
              name: "Bali, Indonesia"
            }
          })
        }}
      />
    </main>
  );
}

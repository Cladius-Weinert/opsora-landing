"use client";

import { type FormEvent, useState } from "react";
import Hero from "./components/Hero";

const segments = [
  { icon: "🏨", name: "Villa & Hotel", pain: "Inquiry tamu lewat jam kerja = booking hilang.", tag: "Core" },
  { icon: "💆", name: "Salon & Spa", pain: "Pertanyaan treatment banjir saat Anda sedang melayani klien.", tag: "Core" },
  { icon: "🚗", name: "Rental Mobil & Peralatan", pain: "Request last-minute butuh jawaban instan, atau ke kompetitor.", tag: "Core" },
  { icon: "🦷", name: "Klinik & Dokter Gigi", pain: "Pertanyaan jadwal berulang menguras waktu admin.", tag: "Growth" },
  { icon: "✈️", name: "Travel & Tour Operator", pain: "Request itinerary custom lambat = lead panas jadi dingin.", tag: "Growth" },
  { icon: "💪", name: "Gym & Fitness Studio", pain: "Lead trial class slip kalo follow-up tidak instan.", tag: "Growth" },
  { icon: "🍽️", name: "Restoran & Cafe", pain: "Booking grup & event butuh konfirmasi cepat.", tag: "Growth" },
  { icon: "🏠", name: "Real Estate Agent", pain: "Inquiry properti dari banyak channel bercampur & terlewat.", tag: "Scale" },
  { icon: "🧺", name: "Laundry & Cleaning Service", pain: "Request same-day butuh konfirmasi cepat biar armada jalan.", tag: "Scale" },
  { icon: "📚", name: "Pusat Kursus & Pelatihan", pain: "Prospek tanya jadwal & harga yang sama berulang.", tag: "Scale" },
  { icon: "🔧", name: "Jasa Reparasi & Maintenance", pain: "Detail keluhan tidak lengkap =派车 sia-sia.", tag: "Scale" },
  { icon: "🎉", name: "Event & Wedding Planner", pain: "Email inquiry wedding dijawab terlambat = booking hilang.", tag: "Scale" }
];

const workflow = [
  "Inquiry masuk via website, WhatsApp, atau sosmed",
  "AI generate draft balasan kontekstual < 3 menit",
  "Lead masuk CRM dengan riwayat percakapan lengkap",
  "Tim review, approve, kirim — zero auto-spam"
];

const stats = [
  { value: "<3", label: "Menit waktu balas", detail: "Dari inquiry sampai draft siap review" },
  { value: "0%", label: "Auto-send rate", detail: "Setiap pesan lewat approval manusia" },
  { value: "12+", label: "Segmen industri", detail: "Template siap pakai dari hari pertama" },
  { value: "∞", label: "Potensi skala", detail: "Handle 1 atau 1.000 percakapan tanpa hiring" }
];

const pricing = [
  {
    plan: "Starter",
    price: "Rp 750.000",
    period: "/bulan",
    note: "Satu bisnis, AI reply drafts + CRM dashboard. Setup 3 hari.",
    items: [
      "1 akun bisnis",
      "AI reply drafts (unlimited)",
      "CRM dashboard + riwayat percakapan",
      "Notifikasi email real-time",
      "Workflow approval manual",
      "Integrasi WhatsApp Business API",
      "Setup & onboarding 3 hari kerja",
    ],
    featured: false
  },
  {
    plan: "Growth",
    price: "Rp 1.500.000",
    period: "/bulan",
    note: "Multi-cabang, lead scoring, follow-up otomatis, analytics.",
    items: [
      "Hingga 5 akun bisnis",
      "Semua fitur Starter",
      "WhatsApp Business API (Official Partner)",
      "Lead scoring & priority routing",
      "Follow-up sequence otomatis",
      "Analytics & reporting bulanan",
      "API access untuk integrasi custom",
      "Dedicated Slack support",
    ],
    featured: true
  },
  {
    plan: "Enterprise",
    price: "",
    period: "Custom",
    note: "Skala tak terbatas, SLA, integrasi booking & pembayaran.",
    items: [
      "Akun bisnis unlimited",
      "Semua fitur Growth",
      "Integrasi sistem booking (Cal.com, Google Calendar)",
      "Payment gateway (Midtrans, Xendit, Stripe)",
      "Dedicated account manager",
      "Custom SLA & uptime guarantee",
      "Onboarding & training tim lengkap",
      "White-label option",
    ],
    featured: false
  }
];

const segmentOptions = [
  { value: "", label: "Pilih jenis bisnis (opsional)" },
  { value: "villa", label: "Villa / Hotel" },
  { value: "salon", label: "Salon / Spa" },
  { value: "rental", label: "Rental / Transport" },
  { value: "clinic", label: "Klinik / Dokter Gigi" },
  { value: "travel", label: "Travel / Tour" },
  { value: "gym", label: "Gym / Fitness" },
  { value: "restaurant", label: "Restoran / Cafe" },
  { value: "property", label: "Real Estate" },
  { value: "laundry", label: "Laundry / Cleaning" },
  { value: "course", label: "Kursus / Pelatihan" },
  { value: "repair", label: "Jasa Reparasi" },
  { value: "event", label: "Event / Wedding" },
  { value: "other", label: "Lainnya" }
];

const faqs = [
  {
    q: "Apakah Opsora menggantikan tim customer service saya?",
    a: "Tidak. Opsora menangani first response — generate draft berkualitas yang tim Anda review & approve. Anggap saja setiap anggota tim dapat 'extra hands' untuk inquiry berulang."
  },
  {
    q: "Apakah pesan akan terkirim otomatis ke customer?",
    a: "Tidak tanpa approval Anda. Setiap pesan lewat review manusia sebelum dikirim. Anda kontrol penuh timing, tone, dan isi."
  },
  {
    q: "Bisa untuk industri apa saja?",
    a: "Kami mulai dengan bisnis layanan yang handle inbound inquiry: villa, salon, klinik, restoran, properti, repair service, dll. AI adapt ke bisnis spesifik Anda berdasarkan segment yang dipilih."
  },
  {
    q: "Berapa biaya mulai pakai Opsora?",
    a: "Kami tawarkan konsultasi gratis 30 menit untuk mapping kebutuhan. Starter Rp 750.000/bulan untuk 1 bisnis. Ada juga managed setup kalau mau kami yang configure end-to-end."
  },
  {
    q: "Bisa cancel kapan saja?",
    a: "Bisa. Tidak ada kontrak long-term. Kalau cancel, data disimpan 30 hari untuk export sebelum akun ditutup."
  }
];

type LeadResponse = { ok?: boolean; reply?: string };

export default function Page() {
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending...");
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
        setStatus("Failed to send. Please try again or contact us directly.");
        return;
      }

      setStatus("Lead submitted! We'll follow up for a quick demo.");
      setReply(data.reply || "");
      e.currentTarget.reset();
    } catch {
      setStatus("Failed to send. Please try again or contact us directly.");
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
          <a href="#segments">Segments</a>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="/blog">Blog</a>
        </div>
        <a href="#demo" className="navCta">
          Free Consultation
        </a>
      </nav>

      <section className="hero">
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
          <p className="sectionKicker">How It Works</p>
          <h2>From inquiry to follow-up — always under supervision.</h2>
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
        <p className="sectionKicker">Why Opsora</p>
        <h2>Safe automation for Bali businesses.</h2>
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
        <p className="sectionKicker">Managed Services</p>
        <h2>Beyond software — we also handle the setup for you.</h2>
        <p className="sectionDesc">
          Most teams don't just want a tool. They want a system that's configured, tested, 
          and running. Our managed services get your AI receptionist live in days, not months.
        </p>
        <div className="statsGrid">
          <div className="statCard">
            <div className="statValue">💬</div>
            <div className="statLabel">AI Chatbot Setup</div>
            <div className="statDetail">WhatsApp + web chatbot deployed in 3 business days. We configure the prompts, integrate your channels, and train on your FAQ data.</div>
          </div>
          <div className="statCard">
            <div className="statValue">📍</div>
            <div className="statLabel">Google Business Profile Optimization</div>
            <div className="statDetail">Higher local ranking, review management with AI-assisted replies, consistent posting schedule across all your locations.</div>
          </div>
          <div className="statCard">
            <div className="statValue">📱</div>
            <div className="statLabel">Social Media Content Automation</div>
            <div className="statDetail">AI generates brand-consistent posts for Instagram and Facebook — scheduled, reviewed, and published on autopilot.</div>
          </div>
          <div className="statCard">
            <div className="statValue">⭐</div>
            <div className="statLabel">Review Response Management</div>
            <div className="statDetail">Auto-draft responses to Google and TripAdvisor reviews in multiple languages. Your team approves before anything goes out.</div>
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: 24, opacity: 0.75, fontSize: "0.95rem" }}>
          Start with a free 30-minute consultation. Tell us about your business and we'll propose exactly what to build.
        </p>
      </section>

      <section className="section" id="pricing">
        <p className="sectionKicker">Software Plans</p>
        <h2>Start small, scale after proven results.</h2>
        <div className="pricingGrid">
          {pricing.map((p) => (
            <article className={`priceCard ${p.featured ? "featured" : ""}`} key={p.plan}>
              {p.featured && <span className="priceBadge">Popular</span>}
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
        <h2>Frequently asked questions.</h2>
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
            <p className="sectionKicker">Live Demo</p>
            <h2>Coba langsung dengan inquiry Anda sendiri.</h2>
            <p className="sectionDesc">
              Pilih jenis bisnis, tulis contoh pertanyaan pelanggan, 
              dan lihat Opsora generate draft balasan kontekstual & capture lead — real time.
            </p>
            <p className="trustLine" style={{ marginTop: 24 }}>
              Konsultasi gratis 30 menit. Tanpa kartu kredit untuk memulai.
            </p>
          </div>

          <form onSubmit={submitLead} className="leadForm">
            <label>
              Nama
              <input name="name" required maxLength={120} placeholder="Nama Anda" />
            </label>
            <label>
              Nama Bisnis
              <input name="business" required maxLength={160} placeholder="Contoh: Villa Sari Bali" />
            </label>
            <label>
              Jenis Bisnis
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
                placeholder="Contoh: Butuh sistem balas inquiry tamu villa & pencatatan request booking."
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
        <p className="sectionKicker">Mengapa Tim Memilih Opsora</p>
        <h2>Dibangun untuk bisnis yang peduli kualitas.</h2>
        <div className="trustGrid">
          <article className="trustCard">
            <div className="trustIcon">🔒</div>
            <h3>Infrastruktur Enterprise</h3>
            <p>Hosted di Supabase dengan encrypted cloud storage. Data lead Anda tidak pernah sentuh spreadsheet bersama atau CRM pihak ketiga.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">⚡</div>
            <h3>AI Auto-Reply 24/7</h3>
            <p>WhatsApp & web chatbot balas instan setiap jam. Booking, FAQ, arah lokasi, review Google Maps — otomatis tanpa missed lead.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">⚡</div>
            <h3>AI Balas < 3 Menit</h3>
            <p>Inquiry masuk, multi-model AI generate jawaban kontekstual. Tamu dapet jawaban saat kompetitor masih baca email.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">🎯</div>
            <h3>Inteligensi Spesifik Industri</h3>
            <p>Prompt engineering per segment. Bukan template generik — AI paham villa beda dengan klinik.</p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <p>Opsora · AI Receptionist untuk Bisnis Layanan</p>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Hubungi kami: <a href="mailto:hello@useopsora.com" style={{ color: "inherit", textDecoration: "underline" }}>hello@useopsora.com</a>
        </p>
        <p style={{ marginTop: 8, opacity: 0.6 }}>© {new Date().getFullYear()} Opsora. Hak cipta dilindungi.</p>
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
              "AI receptionist yang menangkap inquiry, membalas otomatis 24/7 via WhatsApp & web, dan mengelola follow-up lead untuk bisnis layanan. Auto-reply instan tanpa missed leads.",
            offers: {
              "@type": "Offer",
              price: "750000",
              priceCurrency: "IDR",
              description: "Starter plan — 1 akun bisnis, AI auto-reply WhatsApp & web, CRM dashboard"
            },
            provider: {
              "@type": "Organization",
              name: "Opsora",
              email: "hello@useopsora.com"
            }
          })
        }}
      />
    </main>
  );
}

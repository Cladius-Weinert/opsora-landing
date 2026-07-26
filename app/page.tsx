"use client";

import { type FormEvent, useState } from "react";
import HeroSceneLoader from "./components/HeroSceneLoader";

const segments = [
  { icon: "🏡", name: "Villa & Hotel", pain: "Night-time booking inquiries often missed.", tag: "Tier 1" },
  { icon: "💆", name: "Salon & Spa", pain: "Customers ask about treatments while staff is busy.", tag: "Tier 1" },
  { icon: "🏍️", name: "Rental & Transport", pain: "Travelers need rentals today, competitors are faster.", tag: "Tier 1" },
  { icon: "🦷", name: "Clinic & Dentist", pain: "Repetitive patient inquiries overwhelm admin.", tag: "Tier 2" },
  { icon: "🌴", name: "Travel & Tours", pain: "Custom packages need structured data.", tag: "Tier 2" },
  { icon: "💪", name: "Gym & Fitness", pain: "Trial class leads not followed up.", tag: "Tier 2" },
  { icon: "🍽️", name: "Restaurant & Cafe", pain: "Group bookings often not responded quickly.", tag: "Tier 2" },
  { icon: "🏠", name: "Real Estate", pain: "Leads mixed together, hard to qualify.", tag: "Tier 3" },
  { icon: "👕", name: "Laundry & Cleaning", pain: "Same-day pickup without quick confirmation.", tag: "Tier 3" },
  { icon: "📚", name: "Education & Training", pain: "Prospective students ask about schedule and pricing repeatedly.", tag: "Tier 3" },
  { icon: "🔧", name: "Repair Services", pain: "Issue details incomplete when urgent.", tag: "Tier 3" },
  { icon: "🎉", name: "Event & Wedding", pain: "Wedding inquiries answered too late.", tag: "Tier 3" }
];

const workflow = [
  "Website or form receives inquiry",
  "AI receptionist creates reply draft",
  "Lead saved to local CRM",
  "Admin reviews and replies via email"
];

const stats = [
  { value: "0", label: "auto-send", detail: "All replies go through admin approval" },
  { value: "12", label: "business segments", detail: "Villa, gym, spa, clinic, rental, and more" },
  { value: "<3 min", label: "demo intake", detail: "Inquiry received, draft ready for review" }
];

const pricing = [
  {
    plan: "Pilot",
    price: "$19",
    period: "/7 days",
    note: "Try it first, no commitment. Setup chatbot + lead form.",
    items: ["Basic AI chatbot", "1 lead form", "CRM dashboard", "Email support"],
    featured: false
  },
  {
    plan: "Starter",
    price: "$39",
    period: "/month",
    note: "Small business ready to automate customer inquiries.",
    items: ["Full AI chatbot", "Lead capture + CRM", "Auto follow-up", "Review management", "Email support"],
    featured: true
  },
  {
    plan: "Growth",
    price: "$69",
    period: "/month",
    note: "Villa, clinic, salon — full multi-channel automation.",
    items: ["Everything in Starter", "Multi-location", "Social media AI", "Google Maps optimization", "Priority support"],
    featured: false
  },
  {
    plan: "Premium",
    price: "$129",
    period: "/month",
    note: "Enterprise: booking integration, PMS, payment gateway.",
    items: ["Everything in Growth", "Booking integration", "Payment gateway", "Custom dashboard", "Dedicated support"],
    featured: false
  }
];

const segmentOptions = [
  { value: "", label: "Select business type (optional)" },
  { value: "villa", label: "Villa / Hotel" },
  { value: "salon", label: "Salon / Spa" },
  { value: "rental", label: "Rental / Transport" },
  { value: "clinic", label: "Clinic / Dentist" },
  { value: "travel", label: "Travel / Tours" },
  { value: "gym", label: "Gym / Fitness" },
  { value: "restaurant", label: "Restaurant / Cafe" },
  { value: "property", label: "Real Estate" },
  { value: "laundry", label: "Laundry / Cleaning" },
  { value: "course", label: "Education / Training" },
  { value: "repair", label: "Repair Services" },
  { value: "event", label: "Event / Wedding" },
  { value: "other", label: "Other" }
];

const faqs = [
  {
    q: "Does this replace my admin?",
    a: "No. Opsora prepares reply drafts, lead summaries, and follow-up suggestions so your admin can respond faster."
  },
  {
    q: "Does it auto-send messages?",
    a: "No. All replies go through admin review — no auto-spam to your customers."
  },
  {
    q: "Which businesses is this suitable for?",
    a: "Villa, gym, spa, clinic, rental, travel, restaurant, laundry, education, repair, event — 12 segments with ready-made templates."
  },
  {
    q: "How much does it cost to start?",
    a: "Free audit. 7-day pilot starting at $300. Starter plan $39/month, Growth plan $69/month."
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
        <HeroSceneLoader />
        <div className="heroContent">
          <p className="eyebrow">Bali SMB · AI Receptionist</p>
          <h1>
            <span className="gradient">Respond to Leads Faster.</span>
            <br />
            Don't Miss Customers.
          </h1>
          <p className="heroCopy">
            Opsora captures website inquiries, creates AI reply drafts, saves leads to CRM,
            and prepares follow-ups — specifically for Bali businesses: villas, gyms, spas, clinics, rentals, and more.
          </p>
          <div className="heroActions">
            <a href="#demo" className="btnPrimary">
              Get Free Demo →
            </a>
            <a href="#segments" className="btnSecondary">
              See 12 Business Segments
            </a>
          </div>
          <p className="trustLine">
            No auto-send. Admin reviews every reply before sending.
          </p>
        </div>
        <div className="heroVisual" />
      </section>

      <section className="section" id="segments">
        <p className="sectionKicker">12 Business Segments</p>
        <h2>Built for local businesses that thrive on fast response.</h2>
        <p className="sectionDesc">
          From villas in Seminyak to gyms in Canggu — each segment has tailored FAQ fields,
          intake fields, and safe handoff flows.
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
        <p className="sectionKicker">AI Services</p>
        <h2>Besides software, we also offer AI setup services for your business.</h2>
        <div className="statsGrid">
          <div className="statCard">
            <div className="statValue">💬</div>
            <div className="statLabel">AI Chatbot Setup</div>
            <div className="statDetail">Setup Rp 3jt + Rp 1jt/bulan. WhatsApp + web chatbot 24/7. Live in 3 days.</div>
          </div>
          <div className="statCard">
            <div className="statValue">📍</div>
            <div className="statLabel">Google Maps Optimization</div>
            <div className="statDetail">Setup Rp 2jt + Rp 2jt/bulan. Higher ranking, review management, regular posting.</div>
          </div>
          <div className="statCard">
            <div className="statValue">📱</div>
            <div className="statLabel">Social Media AI</div>
            <div className="statDetail">Rp 3jt/bulan. Content creation + scheduling + analytics for Instagram & Facebook.</div>
          </div>
          <div className="statCard">
            <div className="statValue">⭐</div>
            <div className="statLabel">AI Review Responder</div>
            <div className="statDetail">Rp 1,5jt/bulan. Auto-reply to Google + TripAdvisor reviews in multiple languages.</div>
          </div>
          <div className="statCard">
            <div className="statValue">🔍</div>
            <div className="statLabel">AI Readiness Audit</div>
            <div className="statDetail">Rp 5jt. Audit your business readiness for AI adoption + report + recommendations.</div>
          </div>
          <div className="statCard">
            <div className="statValue">🎯</div>
            <div className="statLabel">Custom Package</div>
            <div className="statDetail">Combination of services tailored to your business needs. Contact us for a custom quote.</div>
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: 16, opacity: 0.8 }}>
          All services can start with a <strong>free 30-minute consultation</strong>. Fill out the form below to schedule.
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
            <p className="sectionKicker">Free Demo</p>
            <h2>Try it with your business inquiry.</h2>
            <p className="sectionDesc">
              Select your business segment, send a sample inquiry, and see how Opsora prepares
              a reply draft and logs the lead to CRM.
            </p>
            <p className="trustLine" style={{ marginTop: 24 }}>
              7-day pilot starting at $300. Free inquiry flow audit.
            </p>
          </div>

          <form onSubmit={submitLead} className="leadForm">
            <label>
              Name
              <input name="name" required maxLength={120} placeholder="Your Name" />
            </label>
            <label>
              Business Name
              <input name="business" required maxLength={160} placeholder="e.g., Villa Sari Bali" />
            </label>
            <label>
              Business Type
              <select name="segment" defaultValue="">
                {segmentOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Phone Number (optional)
              <input name="phone" maxLength={60} inputMode="tel" placeholder="+62..." />
            </label>
            <label>
              Requirement
              <textarea
                name="need"
                required
                maxLength={1500}
                rows={4}
                placeholder="Example: Need a system to reply to villa guest inquiries and log booking requests."
              />
            </label>
            <label className="spamTrap" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send & Request Demo"}
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
        <p className="sectionKicker">Why It's Safe</p>
        <h2>Not a chatbot. This is an assistant that can be supervised.</h2>
        <div className="trustGrid">
          <article className="trustCard">
            <div className="trustIcon">🔒</div>
            <h3>Data in Supabase</h>
            <p>Leads and conversations are stored in an encrypted cloud database. Not a spreadsheet that can be lost.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">✋</div>
            <h3>Admin Always Reviews</h3>
            <p>Every AI reply draft must be approved by the admin before sending. No auto-spam to WhatsApp customers.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">⚡</div>
            <h3>Ready in 3 Minutes</h3>
            <p>Inquiry arrives, AI prepares a reply draft + lead summary. Admin just reviews and approves.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">🎯</div>
            <h3>12 Segment-Specific Templates</h3>
            <p>Not a generic template. Each business segment has specific intake fields, FAQs, and handoff flows.</p>
          </article>
        </div>
        <p className="pilotNote">
          <strong>Pilot program available.</strong> 7-day trial starting at $300. Free inquiry flow audit — no commitment.
        </p>
      </section>

      <footer className="footer">
        <p>Opsora AI Receptionist · Denpasar/Bali · Human-in-the-loop · No auto-spam</p>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Contact us: <a href="mailto:opsora.bali@gmail.com" style={{ color: "inherit", textDecoration: "underline" }}>opsora.bali@gmail.com</a>
        </p>
        <p style={{ marginTop: 8, opacity: 0.6 }}>© 2025 Opsora. In MVP stage — draft only, admin review required.</p>
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

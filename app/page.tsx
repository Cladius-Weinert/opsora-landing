"use client";

import { type FormEvent, useState } from "react";
import HeroSceneLoader from "./components/HeroSceneLoader";

const segments = [
  { icon: "🏡", name: "Vacation Rentals & Villas", pain: "Missed booking inquiries after hours cost you reservations.", tag: "Core" },
  { icon: "💆", name: "Salons & Spas", pain: "Treatment questions flood your phone while you're busy serving clients.", tag: "Core" },
  { icon: "🚗", name: "Car & Equipment Rental", pain: "Last-minute rental requests need instant answers, or they go to the next listing.", tag: "Core" },
  { icon: "🦷", name: "Dental & Medical Clinics", pain: "Repetitive scheduling questions drain your admin team's time.", tag: "Growth" },
  { icon: "✈️", name: "Travel Agencies & Tours", pain: "Custom itinerary requests slow down your response to hot leads.", tag: "Growth" },
  { icon: "💪", name: "Gyms & Fitness Studios", pain: "Trial class leads slip through when follow-up isn't immediate.", tag: "Growth" },
  { icon: "🍽️", name: "Restaurants & Cafes", pain: "Group bookings and event inquiries take too long to confirm.", tag: "Growth" },
  { icon: "🏠", name: "Real Estate Agents", pain: "Property inquiries from multiple channels get mixed and forgotten.", tag: "Scale" },
  { icon: "🧹", name: "Cleaning & Laundry Services", pain: "Same-day service requests need quick confirmation to keep trucks moving.", tag: "Scale" },
  { icon: "📚", name: "Education & Training Centers", pain: "Prospects ask the same schedule and pricing questions repeatedly.", tag: "Scale" },
  { icon: "🔧", name: "Repair & Maintenance", pain: "Incomplete issue details cause wasted dispatch trips.", tag: "Scale" },
  { icon: "🎉", name: "Events & Wedding Planners", pain: "Wedding inquiry emails answered too late means lost bookings.", tag: "Scale" }
];

const workflow = [
  "Inquiry arrives on your website, WhatsApp, or social media",
  "AI generates a contextual reply draft in under 3 minutes",
  "Lead is captured in your CRM with full conversation history",
  "Your team reviews, approves, and sends — zero auto-spam"
];

const stats = [
  { value: "<3", label: "Minute response time", detail: "From inquiry to draft ready for review" },
  { value: "0%", label: "Auto-send rate", detail: "Every message passes through human approval" },
  { value: "12+", label: "Industry segments", detail: "Tailored templates built-in from day one" },
  { value: "∞", label: "Scale potential", detail: "Handle 1 or 1,000 conversations without hiring" }
];

const pricing = [
  {
    plan: "Starter",
    price: "$49",
    period: "/month",
    note: "One business, lead capture and AI response automation.",
    items: [
      "1 business account",
      "AI reply drafts (unlimited leads)",
      "CRM dashboard with conversation history",
      "Email notifications",
      "Manual approval workflow"
    ],
    featured: false
  },
  {
    plan: "Growth",
    price: "$99",
    period: "/month",
    note: "Multi-location teams that need advanced features and integrations.",
    items: [
      "Up to 5 business accounts",
      "Everything in Starter",
      "WhatsApp integration via WATI",
      "Lead scoring & priority routing",
      "Follow-up sequences",
      "Analytics & reporting",
      "API access"
    ],
    featured: true
  },
  {
    plan: "Enterprise",
    price: "",
    period: "Custom",
    note: "Unlimited scale with dedicated support and custom integrations.",
    items: [
      "Unlimited business accounts",
      "Everything in Growth",
      "Booking system integration",
      "Payment gateway (Stripe, Midtrans)",
      "Dedicated account manager",
      "Custom SLA & uptime guarantee",
      "Onboarding & training included"
    ],
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
    q: "Does Opsora replace my customer service team?",
    a: "No. Opsora handles the first response — generating a quality draft your team reviews and approves. Think of it as giving every team member an extra set of hands for the repetitive inquiries."
  },
  {
    q: "Will it auto-send messages to my customers?",
    a: "Not without your approval. Every message goes through human review before anything is sent. You have full control over timing, tone, and content."
  },
  {
    q: "What industries does this work for?",
    a: "We start with service businesses that handle inbound inquiries: vacation rentals, salons, clinics, restaurants, real estate, repair services, and more. The AI adapts to your specific business based on your segment selection."
  },
  {
    q: "How much does it cost to get started?",
    a: "We offer a free consultation where we'll map out exactly what you need. Our Starter plan starts at $49/month for single-business use. We also offer managed setup services if you want us to configure everything for you."
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no long-term contracts. If you cancel, your data is retained for 30 days so you can export it before your account closes."
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
          <p className="eyebrow">AI Receptionist · Built for Service Businesses</p>
          <h1>
            <span className="gradient">Your customers shouldn't have to wait.</span>
            <br />
            Your team shouldn't be drowning either.
          </h1>
          <p className="heroCopy">
            Opsora captures every inquiry — from your website, WhatsApp, or social media — 
            generates a contextual reply draft in under 3 minutes, and saves it to your CRM. 
            Your team reviews, approves, and sends. No auto-spam. No missed leads.
          </p>
          <div className="heroActions">
            <a href="#demo" className="btnPrimary">
              Request a Live Demo →
            </a>
            <a href="#pricing" className="btnSecondary">
              View Pricing
            </a>
          </div>
          <p className="trustLine">
            No auto-send. Admin reviews every reply before sending.
          </p>
        </div>
        <div className="heroVisual" />
      </section>

      <section className="section" id="segments">
        <p className="sectionKicker">Who It's For</p>
        <h2>Built for service businesses that thrive on fast response.</h2>
        <p className="sectionDesc">
          Each industry segment has tailored FAQ fields, intake flows, and context-aware AI responses built in from day one.
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
            <h2>See it in action with your own inquiry.</h2>
            <p className="sectionDesc">
              Select your business segment, share a sample customer question, 
              and watch Opsora generate a contextual reply draft and capture the lead — in real time.
            </p>
            <p className="trustLine" style={{ marginTop: 24 }}>
              Free consultation included. No credit card required to get started.
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
        <p className="sectionKicker">Why Teams Choose Opsora</p>
        <h2>Built for businesses that care about quality.</h2>
        <div className="trustGrid">
          <article className="trustCard">
            <div className="trustIcon">🔒</div>
            <h3>Enterprise Infrastructure</h3>
            <p>Hosted on Supabase with encrypted cloud storage. Your lead data never touches a shared spreadsheet or third-party CRM.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">✋</div>
            <h3>Human Approval Every Time</h3>
            <p>Zero auto-send by default. Every AI draft is reviewed and approved by your team before reaching any customer.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">⚡</div>
            <h3>Drafts in Under 3 Minutes</h3>
            <p>Inquiry arrives, multi-model AI generates a contextual reply draft. Ready for review while competitors are still reading the email.</p>
          </article>
          <article className="trustCard">
            <div className="trustIcon">🎯</div>
            <h3>Industry-Specific Intelligence</h3>
            <p>Tailored prompt engineering per segment. Not generic templates — your AI understands villas differently than clinics.</p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <p>Opsora · AI Receptionist for Service Businesses</p>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Contact us: <a href="mailto:hello@useopsora.com" style={{ color: "inherit", textDecoration: "underline" }}>hello@useopsora.com</a>
        </p>
        <p style={{ marginTop: 8, opacity: 0.6 }}>© {new Date().getFullYear()} Opsora. All rights reserved.</p>
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
              "AI receptionist that captures inquiries, generates reply drafts, and manages lead follow-ups for service businesses. Human-in-the-loop approval workflow.",
            offers: {
              "@type": "Offer",
              price: "49",
              priceCurrency: "USD",
              description: "Starter plan — 1 business account, AI reply drafts, CRM dashboard"
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

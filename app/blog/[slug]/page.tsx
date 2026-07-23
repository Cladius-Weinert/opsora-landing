import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("marketing_content")
    .select("title, excerpt, tags")
    .eq("slug", slug)
    .eq("type", "blog")
    .eq("status", "published")
    .single();

  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    keywords: (post.tags || []).join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("marketing_content")
    .select("*")
    .eq("slug", slug)
    .eq("type", "blog")
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const publishedDate = new Date(post.published_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Simple markdown-like rendering
  const renderBody = (body: string) => {
    return body
      .split("\n\n")
      .map((block, i) => {
        if (block.startsWith("### ")) {
          return `<h3 key="${i}">${block.slice(4)}</h3>`;
        }
        if (block.startsWith("## ")) {
          return `<h2 key="${i}">${block.slice(3)}</h2>`;
        }
        if (block.startsWith("# ")) {
          return `<h1 key="${i}">${block.slice(2)}</h1>`;
        }
        if (block.startsWith("- ")) {
          const items = block.split("\n").map((line) => `<li>${line.replace(/^- /, "")}</li>`).join("");
          return `<ul key="${i}">${items}</ul>`;
        }
        if (block.startsWith("**") && block.endsWith("**")) {
          return `<p key="${i}" class="bold">${block.slice(2, -2)}</p>`;
        }
        return `<p key="${i}">${block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>")}</p>`;
      })
      .join("");
  };

  return (
    <main className="post-page">
      <header className="post-header">
        <Link href="/blog" className="back-link">← Semua Artikel</Link>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <time dateTime={post.published_at}>{publishedDate}</time>
          {(post.tags || []).length > 0 && (
            <div className="tags">
              {post.tags.map((tag: string) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </header>

      <article
        className="post-body"
        dangerouslySetInnerHTML={{ __html: renderBody(post.body || "") }}
      />

      <div className="post-cta">
        <h2>Siap coba Opsora AI Receptionist?</h2>
        <p>
          Balas inquiry pelanggan dalam hitungan detik, bukan jam.
          Gratis untuk demo — tanpa komitmen.
        </p>
        <Link href="/#demo" className="cta-button">
          Minta Demo Gratis →
        </Link>
      </div>

      <footer className="post-footer">
        <Link href="/blog" className="back-link">← Kembali ke Blog</Link>
      </footer>

      <style>{`
        .post-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: var(--font-body), system-ui, sans-serif;
          color: #e5e7eb;
          background: #050f0d;
          min-height: 100vh;
        }
        .post-header { margin-bottom: 2.5rem; }
        .back-link {
          color: #34d399;
          text-decoration: none;
          font-size: 0.875rem;
          display: inline-block;
          margin-bottom: 1.5rem;
        }
        .back-link:hover { text-decoration: underline; }
        h1 { font-size: 2rem; font-weight: 700; line-height: 1.3; margin-bottom: 1rem; }
        .post-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
        .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .tag {
          background: #1f2937;
          padding: 0.125rem 0.5rem;
          border-radius: 999px;
          font-size: 0.75rem;
          color: #34d399;
        }
        .post-body { line-height: 1.8; font-size: 1.0625rem; }
        .post-body h2 { font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem; color: #f3f4f6; }
        .post-body h3 { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: #f3f4f6; }
        .post-body p { margin-bottom: 1.25rem; color: #d1d5db; }
        .post-body ul { margin-bottom: 1.25rem; padding-left: 1.5rem; }
        .post-body li { margin-bottom: 0.5rem; color: #d1d5db; }
        .post-body strong { color: #f3f4f6; }
        .post-body em { color: #34d399; font-style: italic; }
        .post-cta {
          margin-top: 3rem;
          padding: 2rem;
          border: 1px solid #34d399;
          border-radius: 12px;
          text-align: center;
          background: rgba(52, 211, 153, 0.05);
        }
        .post-cta h2 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #f3f4f6; }
        .post-cta p { color: #9ca3af; margin-bottom: 1.5rem; }
        .cta-button {
          display: inline-block;
          background: #34d399;
          color: #050f0d;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .cta-button:hover { opacity: 0.9; }
        .post-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #1f2937;
        }
      `}</style>
    </main>
  );
}

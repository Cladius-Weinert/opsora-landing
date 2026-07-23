import Link from "next/link";

export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) return [];

    const supabase = createClient(url, key);
    const { data: posts } = await supabase
      .from("marketing_content")
      .select("id, title, slug, excerpt, tags, published_at, type")
      .eq("type", "blog")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(50);
    return posts || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="blog-page">
      <header className="blog-header">
        <Link href="/" className="back-link">← Kembali</Link>
        <h1>Blog Opsora</h1>
        <p className="blog-subtitle">
          Tips, insight, dan strategi AI automation untuk bisnis di Bali
        </p>
      </header>

      {(!posts || posts.length === 0) ? (
        <div className="empty-state">
          <p>Artikel pertama segera hadir. Stay tuned!</p>
        </div>
      ) : (
        <div className="blog-grid">
          {posts.map((post: { id: string; title: string; slug: string; excerpt: string; tags: string[]; published_at: string }) => (
            <article key={post.id} className="blog-card">
              <Link href={`/blog/${post.slug}`}>
                <h2>{post.title}</h2>
                <p className="excerpt">{post.excerpt}</p>
                <div className="meta">
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  {(post.tags || []).length > 0 && (
                    <div className="tags">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      <footer className="blog-footer">
        <Link href="/" className="cta-link">
          Coba Opsora AI Receptionist →
        </Link>
      </footer>

      <style>{`
        .blog-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: var(--font-body), system-ui, sans-serif;
          color: #e5e7eb;
          background: #050f0d;
          min-height: 100vh;
        }
        .blog-header { margin-bottom: 3rem; }
        .back-link {
          color: #34d399;
          text-decoration: none;
          font-size: 0.875rem;
          display: inline-block;
          margin-bottom: 1.5rem;
        }
        .back-link:hover { text-decoration: underline; }
        h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .blog-subtitle {
          color: #9ca3af;
          font-size: 1.125rem;
        }
        .blog-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .blog-card {
          border: 1px solid #1f2937;
          border-radius: 12px;
          padding: 1.5rem;
          transition: border-color 0.2s;
          background: #0a1a16;
        }
        .blog-card:hover { border-color: #34d399; }
        .blog-card a {
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .blog-card h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #f3f4f6;
        }
        .excerpt {
          color: #9ca3af;
          font-size: 0.9375rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.8125rem;
          color: #6b7280;
        }
        .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .tag {
          background: #1f2937;
          padding: 0.125rem 0.5rem;
          border-radius: 999px;
          font-size: 0.75rem;
          color: #34d399;
        }
        .empty-state {
          text-align: center;
          padding: 4rem 0;
          color: #6b7280;
        }
        .blog-footer {
          margin-top: 4rem;
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid #1f2937;
        }
        .cta-link {
          color: #34d399;
          font-weight: 600;
          text-decoration: none;
          font-size: 1.125rem;
        }
        .cta-link:hover { text-decoration: underline; }
      `}</style>
    </main>
  );
}

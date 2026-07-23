import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://opsora-landing-zeta.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return entries;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: posts } = await supabase
      .from("marketing_content")
      .select("slug, published_at, updated_at")
      .eq("type", "blog")
      .eq("status", "published");

    if (posts) {
      for (const post of posts) {
        entries.push({
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // Supabase might not be configured yet
  }

  return entries;
}

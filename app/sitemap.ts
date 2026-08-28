import type { MetadataRoute } from "next";
import { supabase } from "./lib/supabaseClient";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published");

  const posts = data ?? [];

  return [
    {
      url: "https://thiraj.space",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://thiraj.space/blog/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `https://thiraj.space/blog/${post.slug}/`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

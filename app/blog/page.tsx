import type { Metadata } from "next";
import BlogHeader from "../components/BlogHeader";
import SectionHeading from "../components/SectionHeading";
import { supabase } from "../lib/supabaseClient";

export const metadata: Metadata = {
  title: "Blog — Thiraj Hettiarachchi",
  description:
    "Notes on full stack engineering, e-commerce platforms, and freelance software development from Thiraj Hettiarachchi.",
  alternates: {
    canonical: "/blog/",
  },
  openGraph: {
    title: "Blog — Thiraj Hettiarachchi",
    description:
      "Notes on full stack engineering, e-commerce platforms, and freelance software development from Thiraj Hettiarachchi.",
    url: "/blog/",
    type: "website",
  },
};

type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  tags: string[];
  published_at: string | null;
};

async function getPublishedPosts(): Promise<PostSummary[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, excerpt, cover_image_url, tags, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data as PostSummary[];
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-cream text-ink">
      <BlogHeader />
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <SectionHeading
          eyebrow="Writing"
          title="My Blog"
          description="Thoughts on shipping production software, e-commerce platforms, and freelance engineering."
        />

        {posts.length === 0 ? (
          <p className="mt-16 text-ink-muted">
            No posts yet — check back soon.
          </p>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}/`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-cream-card transition-colors hover:border-ink/30"
              >
                {post.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  {post.published_at && (
                    <span className="font-mono text-xs text-ink-muted">
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {post.excerpt}
                  </p>
                  {post.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-cream-card-2 px-3 py-1 font-mono text-xs text-ink-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

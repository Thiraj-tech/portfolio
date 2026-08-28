import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import BlogHeader from "../../components/BlogHeader";
import { supabase } from "../../lib/supabaseClient";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  published_at: string | null;
  updated_at: string;
};

async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, excerpt, content, cover_image_url, tags, published_at, updated_at")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Post;
}

export async function generateStaticParams() {
  const { data } = await supabase.from("posts").select("slug").eq("status", "published");
  const slugs = data ?? [];
  // `output: "export"` requires at least one static path for a dynamic
  // route. Fall back to a placeholder slug (which 404s via getPost/
  // notFound() below) so the build never breaks with zero published posts —
  // e.g. right after the migration, or if every post gets unpublished.
  if (slugs.length === 0) return [{ slug: "_placeholder" }];
  return slugs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}/`;
  return {
    title: `${post.title} — Thiraj Hettiarachchi`,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    url: `https://thiraj.space/blog/${post.slug}/`,
    author: {
      "@type": "Person",
      name: "Thiraj Hettiarachchi",
      url: "https://thiraj.space",
    },
  };

  return (
    <main className="min-h-screen bg-cream text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(postJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BlogHeader />
      <article className="mx-auto max-w-2xl px-6 pb-24">
        {post.published_at && (
          <span className="font-mono text-xs text-ink-muted">
            {new Date(post.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
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
        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt=""
            className="mt-8 h-80 w-full rounded-2xl object-cover"
          />
        )}
        <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink">
          <ReactMarkdown
            components={{
              h1: (props) => (
                <h2 className="font-display text-3xl font-bold tracking-tight" {...props} />
              ),
              h2: (props) => (
                <h2 className="font-display text-2xl font-bold tracking-tight" {...props} />
              ),
              h3: (props) => (
                <h3 className="font-display text-xl font-bold tracking-tight" {...props} />
              ),
              p: (props) => <p className="text-ink" {...props} />,
              a: (props) => (
                <a
                  className="font-medium text-ink underline decoration-yellow decoration-2 underline-offset-2 hover:text-ink-muted"
                  {...props}
                />
              ),
              ul: (props) => <ul className="list-disc space-y-2 pl-6" {...props} />,
              ol: (props) => <ol className="list-decimal space-y-2 pl-6" {...props} />,
              blockquote: (props) => (
                <blockquote
                  className="border-l-4 border-yellow pl-4 text-ink-muted italic"
                  {...props}
                />
              ),
              code: (props) => (
                <code className="rounded bg-cream-card-2 px-1.5 py-0.5 font-mono text-base" {...props} />
              ),
              pre: (props) => (
                <pre className="overflow-x-auto rounded-xl bg-ink p-4 text-sm text-cream" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}

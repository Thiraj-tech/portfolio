import type { Metadata } from "next";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import BlogHeader from "../../components/BlogHeader";
import PostLikeButton from "../../components/PostLikeButton";
import PostComments from "../../components/PostComments";
import { supabase } from "../../lib/supabaseClient";

const supabaseImageHost = `${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}/storage/v1/object/public/project-media/`;

function renderPostHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "p", "a", "ul", "ol", "li",
      "blockquote", "code", "pre", "strong", "em", "img", "br",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "rel", "target"],
      img: ["src", "alt", "style"],
    },
    allowedStyles: {
      img: {
        width: [/^\d{1,3}%$/],
        float: [/^(left|right|none)$/],
        display: [/^block$/],
        margin: [/^(0|auto|[\d.]+(rem|px|em))(\s+(0|auto|[\d.]+(rem|px|em)))*$/],
      },
    },
    allowedSchemes: ["https"],
    transformTags: {
      img: (tagName, attribs): sanitizeHtml.Tag => {
        if (!attribs.src?.startsWith(supabaseImageHost)) {
          return { tagName: "", attribs: {} };
        }
        return {
          tagName,
          attribs: { src: attribs.src, alt: attribs.alt ?? "", style: attribs.style ?? "" },
        };
      },
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, rel: "noopener noreferrer", target: "_blank" },
      }),
    },
  });
}

type Post = {
  id: string;
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
    .select("id, slug, title, excerpt, content, cover_image_url, tags, published_at, updated_at")
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
      <article className="mx-auto max-w-4xl px-6 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {post.published_at && (
            <span className="font-mono text-xs text-ink-muted">
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          <PostLikeButton postId={post.id} />
        </div>
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
        <div
          className="mt-10 space-y-5 text-lg leading-relaxed text-ink [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:tracking-tight [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-yellow [&_a]:decoration-2 [&_a]:underline-offset-2 [&_a:hover]:text-ink-muted [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-yellow [&_blockquote]:pl-4 [&_blockquote]:text-ink-muted [&_blockquote]:italic [&_code]:rounded [&_code]:bg-cream-card-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-base [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-ink [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-cream [&_img]:rounded-2xl [&_img]:w-full [&_table]:block [&_table]:w-max [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_th]:border [&_th]:border-ink/15 [&_th]:bg-cream-card-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-ink/15 [&_td]:px-3 [&_td]:py-2"
          dangerouslySetInnerHTML={{ __html: renderPostHtml(post.content) }}
        />

        <PostComments postId={post.id} />
      </article>
    </main>
  );
}

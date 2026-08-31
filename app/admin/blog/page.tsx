"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import AdminLoginForm from "../../components/AdminLoginForm";
import { supabase } from "../../lib/supabaseClient";
import PostEditor from "./PostEditor";

type AuthStage = "checking" | "loggedOut" | "loggedIn";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
  created_at: string;
};

const fieldClass =
  "w-full rounded-xl border border-border-on-black bg-white/[0.04] px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70";
const MAX_FILE_BYTES = 20 * 1024 * 1024;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function uploadPostCover(
  file: File,
  slug: string,
): Promise<{ url: string | null; error: string | null }> {
  if (!file.type.startsWith("image/")) {
    return { url: null, error: "Only image files are allowed." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { url: null, error: "File too large (max 20MB)." };
  }
  const path = `blog/${slug || "untitled"}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("project-media")
    .upload(path, file);
  if (uploadError) {
    return { url: null, error: uploadError.message };
  }
  const { data } = supabase.storage.from("project-media").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

function PostForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: PostRow | null;
  onSaved: (row: PostRow) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleCoverFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    const { url, error: uploadError } = await uploadPostCover(file, slug);
    if (uploadError) setError(uploadError);
    if (url) setCoverImageUrl(url);
    setUploading(false);
  };

  const handleSubmit = async (status: "draft" | "published") => {
    const isContentEmpty = !content.trim() || content.trim() === "<p></p>";
    if (!title.trim() || !slug.trim() || !excerpt.trim() || isContentEmpty) {
      setError("Title, slug, excerpt, and content are required.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      cover_image_url: coverImageUrl || null,
      status,
      updated_at: now,
      published_at:
        status === "published" ? (initial?.published_at ?? now) : (initial?.published_at ?? null),
    };

    const query = initial
      ? supabase.from("posts").update(payload).eq("id", initial.id)
      : supabase.from("posts").insert(payload);

    const { data, error: saveError } = await query.select().single();
    setSubmitting(false);

    if (saveError || !data) {
      setError(saveError?.message ?? "Something went wrong saving the post.");
      return;
    }

    onSaved(data as PostRow);

    if (!initial) {
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      setExcerpt("");
      setContent("");
      setTagsInput("");
      setCoverImageUrl("");
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-cream/70">Title</label>
          <input
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-cream/70">Slug</label>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-cream/70">
          Excerpt (shown on the blog list card and used as the meta description)
        </label>
        <textarea
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-cream/70">Content</label>
        <PostEditor content={content} onChange={setContent} slug={slug} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-cream/70">
          Tags (comma-separated)
        </label>
        <input
          placeholder="Next.js, SEO, Freelancing"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-cream/70">Cover image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverFile}
          disabled={uploading}
          className="block w-full text-sm text-cream/70 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-cream hover:file:bg-white/20"
        />
        {coverImageUrl && (
          <div className="mt-2 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt="Cover preview"
              className="h-16 w-16 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => setCoverImageUrl("")}
              className="text-xs text-cream/50 underline underline-offset-2 hover:text-cream"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {uploading && <p className="text-sm text-cream/50">Uploading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          disabled={submitting || uploading}
          onClick={() => handleSubmit("draft")}
          className="rounded-full border border-border-on-black px-5 py-2.5 text-sm font-medium transition hover:border-yellow hover:text-yellow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save as draft"}
        </button>
        <button
          type="button"
          disabled={submitting || uploading}
          onClick={() => handleSubmit("published")}
          className="rounded-full bg-yellow px-5 py-2.5 text-sm font-display font-bold text-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save & publish"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-cream/50 underline underline-offset-2 hover:text-cream"
          >
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
}

export default function AdminBlogPage() {
  const [authStage, setAuthStage] = useState<AuthStage>("checking");
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [editing, setEditing] = useState<PostRow | null>(null);

  const loadPosts = () => {
    supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts((data as PostRow[]) ?? []));
  };

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setAuthStage(data.user ? "loggedIn" : "loggedOut");
        if (data.user) loadPosts();
      })
      .catch(() => setAuthStage("loggedOut"));
  }, []);

  const handleSaved = (row: PostRow) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === row.id);
      const next = exists ? prev.map((p) => (p.id === row.id ? row : p)) : [row, ...prev];
      return next;
    });
    setEditing(null);
  };

  const handleDelete = async (row: PostRow) => {
    if (!window.confirm(`Delete "${row.title}"? This can't be undone.`)) return;
    setPosts((prev) => prev.filter((p) => p.id !== row.id));
    if (editing?.id === row.id) setEditing(null);
    await supabase.from("posts").delete().eq("id", row.id);
  };

  const handleToggleStatus = async (row: PostRow) => {
    const next = row.status === "published" ? "draft" : "published";
    const now = new Date().toISOString();
    const publishedAt = next === "published" ? (row.published_at ?? now) : row.published_at;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === row.id ? { ...p, status: next, published_at: publishedAt, updated_at: now } : p,
      ),
    );
    await supabase
      .from("posts")
      .update({ status: next, published_at: publishedAt, updated_at: now })
      .eq("id", row.id);
  };

  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-cream">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold">Blog Admin</h1>
          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/"
              className="rounded-full border border-border-on-black px-4 py-2 text-sm font-medium transition hover:border-yellow hover:text-yellow"
            >
              ← Dashboard
            </a>
            <a
              href="/admin/reviews/"
              className="rounded-full border border-border-on-black px-4 py-2 text-sm font-medium transition hover:border-yellow hover:text-yellow"
            >
              Manage reviews →
            </a>
            <a
              href="/admin/projects/"
              className="rounded-full border border-border-on-black px-4 py-2 text-sm font-medium transition hover:border-yellow hover:text-yellow"
            >
              Manage projects →
            </a>
          </div>
        </div>

        {authStage === "checking" && (
          <p className="mt-6 text-cream/60">Checking session…</p>
        )}

        {authStage === "loggedOut" && (
          <AdminLoginForm
            onLoggedIn={() => {
              setAuthStage("loggedIn");
              loadPosts();
            }}
          />
        )}

        {authStage === "loggedIn" && (
          <div className="mt-8 space-y-12">
            <section>
              <h2 className="font-display text-xl font-bold text-yellow">
                {editing ? `Editing "${editing.title}"` : "Add a post"}
              </h2>
              <div className="mt-4">
                <PostForm
                  key={editing?.id ?? "new"}
                  initial={editing}
                  onSaved={handleSaved}
                  onCancel={() => setEditing(null)}
                />
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-yellow">
                Posts ({posts.length})
              </h2>
              <div className="mt-4 space-y-3">
                {posts.length === 0 && (
                  <p className="text-sm text-cream/50">No posts yet.</p>
                )}
                {posts.map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-on-black bg-white/[0.03] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{row.title}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs ${
                            row.status === "published"
                              ? "bg-yellow/20 text-yellow"
                              : "bg-white/10 text-cream/50"
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                      <div className="text-xs text-cream/40">/blog/{row.slug}/</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(row)}
                        className="rounded-full border border-border-on-black px-3 py-1 text-xs font-medium transition hover:border-yellow hover:text-yellow"
                      >
                        {row.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(row)}
                        className="rounded-full border border-border-on-black px-3 py-1 text-xs font-medium transition hover:border-yellow hover:text-yellow"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        className="rounded-full border border-border-on-black px-3 py-1 text-xs font-medium text-red-400 transition hover:border-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={() => {
                supabase.auth.signOut();
                setAuthStage("loggedOut");
              }}
              className="text-sm text-cream/50 underline underline-offset-2 hover:text-cream"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

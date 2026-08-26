"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import AdminLoginForm from "../../components/AdminLoginForm";
import { supabase } from "../../lib/supabaseClient";

type AuthStage = "checking" | "loggedOut" | "loggedIn";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  details: string | null;
  client_name: string | null;
  client_info: string | null;
  engagement: string;
  tags: string[];
  cover_image_url: string | null;
  gallery_urls: string[];
  video_url: string | null;
  display_order: number;
  status: "draft" | "published";
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

async function uploadProjectMedia(
  file: File,
  slug: string,
): Promise<{ url: string | null; error: string | null }> {
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return { url: null, error: "Only image or video files are allowed." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { url: null, error: "File too large (max 20MB)." };
  }
  const path = `${slug || "untitled"}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("project-media")
    .upload(path, file);
  if (uploadError) {
    return { url: null, error: uploadError.message };
  }
  const { data } = supabase.storage.from("project-media").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

function ProjectForm({
  initial,
  nextDisplayOrder,
  onSaved,
  onCancel,
}: {
  initial: ProjectRow | null;
  nextDisplayOrder: number;
  onSaved: (row: ProjectRow) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [details, setDetails] = useState(initial?.details ?? "");
  const [clientName, setClientName] = useState(initial?.client_name ?? "");
  const [clientInfo, setClientInfo] = useState(initial?.client_info ?? "");
  const [engagement, setEngagement] = useState(initial?.engagement ?? "Freelance");
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [videoUrl, setVideoUrl] = useState(initial?.video_url ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url ?? "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initial?.gallery_urls ?? []);
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
    const { url, error: uploadError } = await uploadProjectMedia(file, slug);
    if (uploadError) setError(uploadError);
    if (url) setCoverImageUrl(url);
    setUploading(false);
  };

  const handleGalleryFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    e.target.value = "";
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      const { url, error: uploadError } = await uploadProjectMedia(file, slug);
      if (uploadError) setError(uploadError);
      if (url) setGalleryUrls((prev) => [...prev, url]);
    }
    setUploading(false);
  };

  const removeGalleryImage = (url: string) => {
    setGalleryUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!title.trim() || !slug.trim() || !summary.trim()) {
      setError("Title, slug, and summary are required.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      summary: summary.trim(),
      details: details.trim() || null,
      client_name: clientName.trim() || null,
      client_info: clientInfo.trim() || null,
      engagement: engagement.trim() || "Freelance",
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      cover_image_url: coverImageUrl || null,
      gallery_urls: galleryUrls,
      video_url: videoUrl.trim() || null,
      status,
    };

    const query = initial
      ? supabase.from("projects").update(payload).eq("id", initial.id)
      : supabase
          .from("projects")
          .insert({ ...payload, display_order: nextDisplayOrder });

    const { data, error: saveError } = await query.select().single();
    setSubmitting(false);

    if (saveError || !data) {
      setError(saveError?.message ?? "Something went wrong saving the project.");
      return;
    }

    onSaved(data as ProjectRow);

    if (!initial) {
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      setSummary("");
      setDetails("");
      setClientName("");
      setClientInfo("");
      setEngagement("Freelance");
      setTagsInput("");
      setVideoUrl("");
      setCoverImageUrl("");
      setGalleryUrls([]);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-cream/70">Project name</label>
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
          Summary (shown on the card/slide)
        </label>
        <textarea
          required
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-cream/70">
          Project details (shown on the detail page, optional — falls back to summary)
        </label>
        <textarea
          rows={5}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-cream/70">Client name</label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-cream/70">Engagement</label>
          <input
            placeholder="e.g. Freelance, Fexcon, WebTechno"
            value={engagement}
            onChange={(e) => setEngagement(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-cream/70">Client information</label>
        <textarea
          rows={2}
          value={clientInfo}
          onChange={(e) => setClientInfo(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-cream/70">
          Tech tags (comma-separated)
        </label>
        <input
          placeholder="Laravel, React, Docker"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-cream/70">
          Video URL (YouTube, Vimeo, or a direct file link — optional)
        </label>
        <input
          placeholder="https://youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-cream/70">Cover image</label>
          <input
            type="file"
            accept="image/*,video/*"
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
        <div>
          <label className="mb-1.5 block text-sm text-cream/70">Gallery images</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleGalleryFiles}
            disabled={uploading}
            className="block w-full text-sm text-cream/70 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-cream hover:file:bg-white/20"
          />
          {galleryUrls.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {galleryUrls.map((url) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    aria-label="Remove image"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-cream ring-1 ring-border-on-black hover:bg-red-500/80"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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

export default function AdminProjectsPage() {
  const [authStage, setAuthStage] = useState<AuthStage>("checking");
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [editing, setEditing] = useState<ProjectRow | null>(null);

  const loadProjects = () => {
    supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => setProjects((data as ProjectRow[]) ?? []));
  };

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setAuthStage(data.user ? "loggedIn" : "loggedOut");
        if (data.user) loadProjects();
      })
      .catch(() => setAuthStage("loggedOut"));
  }, []);

  const handleSaved = (row: ProjectRow) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === row.id);
      const next = exists ? prev.map((p) => (p.id === row.id ? row : p)) : [...prev, row];
      return [...next].sort((a, b) => a.display_order - b.display_order);
    });
    setEditing(null);
  };

  const handleDelete = async (row: ProjectRow) => {
    if (!window.confirm(`Delete "${row.title}"? This can't be undone.`)) return;
    setProjects((prev) => prev.filter((p) => p.id !== row.id));
    if (editing?.id === row.id) setEditing(null);
    await supabase.from("projects").delete().eq("id", row.id);
  };

  const handleToggleStatus = async (row: ProjectRow) => {
    const next = row.status === "published" ? "draft" : "published";
    setProjects((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, status: next } : p)),
    );
    await supabase.from("projects").update({ status: next }).eq("id", row.id);
  };

  const handleReorder = async (row: ProjectRow, direction: "up" | "down") => {
    const sorted = [...projects].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((p) => p.id === row.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const other = sorted[swapIndex];
    const rowOrder = row.display_order;
    const otherOrder = other.display_order;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === row.id) return { ...p, display_order: otherOrder };
        if (p.id === other.id) return { ...p, display_order: rowOrder };
        return p;
      }),
    );

    await Promise.all([
      supabase.from("projects").update({ display_order: otherOrder }).eq("id", row.id),
      supabase.from("projects").update({ display_order: rowOrder }).eq("id", other.id),
    ]);
  };

  const sortedProjects = [...projects].sort((a, b) => a.display_order - b.display_order);
  const nextDisplayOrder =
    sortedProjects.length > 0
      ? Math.max(...sortedProjects.map((p) => p.display_order)) + 1
      : 1;

  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-cream">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold">Projects Admin</h1>
          <a
            href="/admin/"
            className="rounded-full border border-border-on-black px-4 py-2 text-sm font-medium transition hover:border-yellow hover:text-yellow"
          >
            ← Review admin
          </a>
        </div>

        {authStage === "checking" && (
          <p className="mt-6 text-cream/60">Checking session…</p>
        )}

        {authStage === "loggedOut" && (
          <AdminLoginForm
            onLoggedIn={() => {
              setAuthStage("loggedIn");
              loadProjects();
            }}
          />
        )}

        {authStage === "loggedIn" && (
          <div className="mt-8 space-y-12">
            <section>
              <h2 className="font-display text-xl font-bold text-yellow">
                {editing ? `Editing "${editing.title}"` : "Add a project"}
              </h2>
              <div className="mt-4">
                <ProjectForm
                  key={editing?.id ?? "new"}
                  initial={editing}
                  nextDisplayOrder={nextDisplayOrder}
                  onSaved={handleSaved}
                  onCancel={() => setEditing(null)}
                />
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-yellow">
                Projects ({sortedProjects.length})
              </h2>
              <div className="mt-4 space-y-3">
                {sortedProjects.length === 0 && (
                  <p className="text-sm text-cream/50">No projects yet.</p>
                )}
                {sortedProjects.map((row, i) => (
                  <div
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-on-black bg-white/[0.03] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{row.title}</span>
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-xs text-cream/70">
                          {row.engagement}
                        </span>
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
                      <div className="text-xs text-cream/40">/{row.slug}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReorder(row, "up")}
                        disabled={i === 0}
                        aria-label="Move up"
                        className="rounded-full border border-border-on-black px-2.5 py-1 text-xs transition hover:border-yellow hover:text-yellow disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(row, "down")}
                        disabled={i === sortedProjects.length - 1}
                        aria-label="Move down"
                        className="rounded-full border border-border-on-black px-2.5 py-1 text-xs transition hover:border-yellow hover:text-yellow disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ↓
                      </button>
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

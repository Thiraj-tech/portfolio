"use client";

import { useEffect, useState, type FormEvent } from "react";
import Avatar from "./Avatar";
import { supabase } from "../lib/supabaseClient";

type Comment = {
  id: string;
  name: string;
  avatar_url: string | null;
  content: string;
  created_at: string;
};

const FUN_ADJECTIVES = [
  "Curious", "Silent", "Clever", "Wandering", "Bright",
  "Quiet", "Bold", "Gentle", "Swift", "Lucky",
];
const FUN_NOUNS = [
  "Fox", "Panda", "Otter", "Falcon", "Maple",
  "Comet", "Pebble", "Willow", "Sparrow", "Lynx",
];

function generateFunName() {
  const adjective = FUN_ADJECTIVES[Math.floor(Math.random() * FUN_ADJECTIVES.length)];
  const noun = FUN_NOUNS[Math.floor(Math.random() * FUN_NOUNS.length)];
  const number = Math.floor(Math.random() * 900) + 100;
  return `${adjective} ${noun} ${number}`;
}

const fieldClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow/50";

export default function PostComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [googleSub, setGoogleSub] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = () => {
    supabase
      .from("post_comments")
      .select("id, name, avatar_url, content, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setComments((data as Comment[]) ?? []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadComments();

    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata ?? {};
      if (meta.full_name || meta.name) setName(meta.full_name ?? meta.name);
      if (meta.avatar_url || meta.picture) setAvatarUrl(meta.avatar_url ?? meta.picture);
      if (data.user) setGoogleSub(meta.sub ?? data.user.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);

    const finalName = name.trim() || generateFunName();
    const { data, error: insertError } = await supabase
      .from("post_comments")
      .insert({
        post_id: postId,
        name: finalName,
        avatar_url: avatarUrl,
        content: content.trim(),
        google_sub: googleSub,
        status: "approved",
      })
      .select("id, name, avatar_url, content, created_at")
      .single();

    setSubmitting(false);
    if (insertError || !data) {
      setError("Something went wrong posting your comment. Please try again.");
      return;
    }

    setComments((prev) => [data as Comment, ...prev]);
    setContent("");
  };

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold">
        Comments {!loading && `(${comments.length})`}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <button
          type="button"
          onClick={signInWithGoogle}
          className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink-muted transition hover:border-yellow hover:text-ink"
        >
          Sign in with Google to autofill your name & photo (optional)
        </button>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (leave blank for a random one)"
          maxLength={100}
          className={fieldClass}
        />
        <textarea
          required
          rows={3}
          maxLength={2000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment…"
          className={`${fieldClass} resize-none`}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="rounded-full bg-yellow px-5 py-2.5 text-sm font-display font-bold text-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Posting…" : "Post comment"}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {!loading && comments.length === 0 && (
          <p className="text-sm text-ink-muted">Be the first to comment.</p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="flex gap-3 rounded-2xl bg-ink p-5 text-cream"
          >
            <Avatar name={c.name} avatar={c.avatar_url} />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-cream/40">
                  {new Date(c.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-cream/80">
                {c.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import AdminLoginForm from "../../components/AdminLoginForm";
import Avatar from "../../components/Avatar";
import Stars from "../../components/Stars";
import { supabase } from "../../lib/supabaseClient";

type AuthStage = "checking" | "loggedOut" | "loggedIn";

type ReviewRequest = {
  id: string;
  client_name: string | null;
  created_at: string;
};

type PendingReview = {
  id: string;
  name: string;
  avatar_url: string | null;
  country: string | null;
  quote: string;
  rating: number;
  created_at: string;
};

const fieldClass =
  "w-full rounded-xl border border-border-on-black bg-white/[0.04] px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70";

function GenerateLink({ onCreated }: { onCreated: (r: ReviewRequest) => void }) {
  const [clientName, setClientName] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setCopied(false);
    setError(null);
    const { data, error: dbError } = await supabase
      .from("review_requests")
      .insert({ client_name: clientName || null })
      .select()
      .single();
    setSubmitting(false);
    if (dbError || !data) {
      setError(dbError?.message ?? "Something went wrong generating the link.");
      return;
    }

    onCreated(data as ReviewRequest);
    setLink(`${window.location.origin}/review/?token=${data.id}`);
    setClientName("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Client name (optional)"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className={`${fieldClass} max-w-xs`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-yellow px-5 py-2.5 text-sm font-display font-bold text-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Generating…" : "Generate link"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {link && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border-on-black bg-white/[0.04] px-4 py-3 text-sm">
          <span className="break-all text-cream/80">{link}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopied(true);
            }}
            className="shrink-0 rounded-full border border-border-on-black px-3 py-1 text-xs font-medium transition hover:border-yellow hover:text-yellow"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authStage, setAuthStage] = useState<AuthStage>("checking");
  const [pending, setPending] = useState<PendingReview[]>([]);
  const [recentLinks, setRecentLinks] = useState<ReviewRequest[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = () => {
    supabase
      .from("reviews")
      .select("id, name, avatar_url, country, quote, rating, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPending((data as PendingReview[]) ?? []));

    supabase
      .from("review_requests")
      .select("id, client_name, created_at")
      .is("used_at", null)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setRecentLinks((data as ReviewRequest[]) ?? []));
  };

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setAuthStage(data.user ? "loggedIn" : "loggedOut");
        if (data.user) loadData();
      })
      .catch(() => setAuthStage("loggedOut"));
  }, []);

  const decide = async (id: string, status: "approved" | "rejected") => {
    setPending((prev) => prev.filter((r) => r.id !== id));
    await supabase.from("reviews").update({ status }).eq("id", id);
  };

  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-cream">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold">Reviews Admin</h1>
          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/"
              className="rounded-full border border-border-on-black px-4 py-2 text-sm font-medium transition hover:border-yellow hover:text-yellow"
            >
              ← Dashboard
            </a>
            <a
              href="/admin/projects/"
              className="rounded-full border border-border-on-black px-4 py-2 text-sm font-medium transition hover:border-yellow hover:text-yellow"
            >
              Manage projects →
            </a>
            <a
              href="/admin/blog/"
              className="rounded-full border border-border-on-black px-4 py-2 text-sm font-medium transition hover:border-yellow hover:text-yellow"
            >
              Manage blog posts →
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
              loadData();
            }}
          />
        )}

        {authStage === "loggedIn" && (
          <div className="mt-8 space-y-12">
            <section>
              <h2 className="font-display text-xl font-bold text-yellow">
                Generate a review link
              </h2>
              <div className="mt-4">
                <GenerateLink
                  onCreated={(r) => setRecentLinks((prev) => [r, ...prev])}
                />
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-yellow">
                Pending reviews ({pending.length})
              </h2>
              <div className="mt-4 space-y-4">
                {pending.length === 0 && (
                  <p className="text-sm text-cream/50">Nothing to review right now.</p>
                )}
                {pending.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-dashed border-border-on-black bg-white/[0.03] p-5"
                  >
                    <Stars rating={r.rating} />
                    <blockquote className="mt-3 text-sm leading-relaxed text-cream/70">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <div className="mt-4 flex items-center gap-3">
                      <Avatar name={r.name} avatar={r.avatar_url} />
                      <div>
                        <div className="font-medium">{r.name}</div>
                        {r.country && (
                          <div className="text-sm text-cream/50">{r.country}</div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => decide(r.id, "approved")}
                        className="rounded-full bg-yellow px-4 py-1.5 text-sm font-display font-bold text-ink transition-opacity hover:opacity-85"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => decide(r.id, "rejected")}
                        className="rounded-full border border-border-on-black px-4 py-1.5 text-sm font-medium transition hover:bg-white/10"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-yellow">
                Unused links
              </h2>
              <div className="mt-4 space-y-2">
                {recentLinks.length === 0 && (
                  <p className="text-sm text-cream/50">None generated yet.</p>
                )}
                {recentLinks.map((r) => {
                  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/review/?token=${r.id}`;
                  return (
                    <div
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-on-black bg-white/[0.03] px-4 py-2.5 text-sm"
                    >
                      <span>{r.client_name || "(unnamed)"}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                          setCopiedId(r.id);
                        }}
                        className="rounded-full border border-border-on-black px-3 py-1 text-xs font-medium transition hover:border-yellow hover:text-yellow"
                      >
                        {copiedId === r.id ? "Copied!" : "Copy link"}
                      </button>
                    </div>
                  );
                })}
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

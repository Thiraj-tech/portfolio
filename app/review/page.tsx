"use client";

import { useEffect, useState, type FormEvent } from "react";
import CountrySelect from "../components/CountrySelect";
import { supabase } from "../lib/supabaseClient";

type Stage = "loading" | "invalid" | "form" | "submitting" | "success";

const starPath =
  "M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z";

function RatingInput({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            className="text-yellow"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-8 w-8"
              fill={value <= rating ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d={starPath} strokeLinejoin="round" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-border-on-black bg-white/[0.04] px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70";

export default function ReviewPage() {
  const [stage, setStage] = useState<Stage>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [googleSub, setGoogleSub] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("token");

        const { data: userData } = await supabase.auth.getUser();
        if (cancelled) return;

        const user = userData.user;
        if (user) {
          const meta = user.user_metadata ?? {};
          if (meta.full_name || meta.name) setName(meta.full_name ?? meta.name);
          if (meta.avatar_url || meta.picture)
            setAvatarUrl(meta.avatar_url ?? meta.picture);
          setGoogleSub(meta.sub ?? user.id);
        }

        if (!t) {
          setStage("invalid");
          return;
        }
        setToken(t);

        const { data, error: rpcError } = await supabase.rpc(
          "get_review_request",
          { p_token: t },
        );
        if (cancelled) return;

        const row = Array.isArray(data) ? data[0] : null;
        if (rpcError || !row) {
          setStage("invalid");
          return;
        }
        setClientName(row.client_name ?? "");
        setName((prev) => prev || row.client_name || "");
        setStage("form");
      } catch {
        if (!cancelled) setStage("invalid");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (stage !== "success") return;
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 7000);
    return () => clearTimeout(timer);
  }, [stage]);

  const signInWithGoogle = () => {
    if (!token) return;
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/review/?token=${token}` },
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || rating === 0) return;
    setStage("submitting");
    setError(null);

    const { error: rpcError } = await supabase.rpc("submit_review", {
      p_token: token,
      p_name: name,
      p_avatar_url: avatarUrl,
      p_country: country || null,
      p_quote: quote,
      p_rating: rating,
      p_google_sub: googleSub,
    });

    if (rpcError) {
      setError("Something went wrong submitting your review. Please try again.");
      setStage("form");
      return;
    }

    setStage("success");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-16 text-cream">
      <div className="w-full max-w-lg rounded-3xl border border-dashed border-border-on-black bg-white/[0.03] p-8 sm:p-10">
        {stage === "loading" && (
          <p className="text-center text-cream/60">Loading…</p>
        )}

        {stage === "invalid" && (
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold">
              This link isn&apos;t valid
            </h1>
            <p className="mt-3 text-cream/60">
              It may have already been used, or the link is incomplete.
              Please reach out for a fresh one.
            </p>
          </div>
        )}

        {stage === "success" && (
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-yellow">
              Thank you!
            </h1>
            <p className="mt-3 text-cream/60">
              It was a genuine pleasure working with you — thank you for
              taking the time to share this. I&apos;d always be ready to
              work together again.
            </p>
            <p className="mt-4 text-xs text-cream/40">
              Taking you back to the homepage in a moment…
            </p>
          </div>
        )}

        {(stage === "form" || stage === "submitting") && (
          <>
            <h1 className="font-display text-2xl font-bold">
              {clientName ? `Thanks for working with me, ${clientName}!` : "Leave a review"}
            </h1>
            <p className="mt-2 text-sm text-cream/60">
              I&apos;d really appreciate a few words about your experience.
            </p>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border-on-black px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
            >
              Sign in with Google to autofill your name & photo (optional)
            </button>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
              <div>
                <label className="mb-1.5 block text-sm text-cream/70">
                  Your rating
                </label>
                <RatingInput rating={rating} onChange={setRating} />
              </div>

              <div>
                <label htmlFor="review-name" className="mb-1.5 block text-sm text-cream/70">
                  Name
                </label>
                <input
                  id="review-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={200}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="review-country" className="mb-1.5 block text-sm text-cream/70">
                  Country (optional)
                </label>
                <CountrySelect
                  id="review-country"
                  value={country}
                  onChange={setCountry}
                />
              </div>

              <div>
                <label htmlFor="review-quote" className="mb-1.5 block text-sm text-cream/70">
                  Your review
                </label>
                <textarea
                  id="review-quote"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className={`${fieldClass} resize-none`}
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={stage === "submitting" || rating === 0}
                className="w-full rounded-full bg-yellow px-6 py-3 font-display font-bold text-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {stage === "submitting" ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

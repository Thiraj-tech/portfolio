"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";

const fieldClass =
  "w-full rounded-xl border border-border-on-black bg-white/[0.04] px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70";

export default function AdminLoginForm({
  onLoggedIn,
}: {
  onLoggedIn: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSubmitting(false);
    if (authError) {
      setError("Invalid email or password.");
      return;
    }
    onLoggedIn();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-6 max-w-sm space-y-4 text-left"
    >
      <div>
        <label htmlFor="admin-email" className="mb-1.5 block text-sm text-cream/70">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-sm text-cream/70">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClass}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-yellow px-6 py-2.5 font-display font-bold text-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

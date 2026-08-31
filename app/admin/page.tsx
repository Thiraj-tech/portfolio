"use client";

import { useEffect, useState } from "react";
import AdminLoginForm from "../components/AdminLoginForm";
import { supabase } from "../lib/supabaseClient";

type AuthStage = "checking" | "loggedOut" | "loggedIn";

type Counts = {
  pendingReviews: number | null;
  projects: number | null;
  publishedPosts: number | null;
};

function DashboardCard({
  href,
  title,
  description,
  count,
  countLabel,
}: {
  href: string;
  title: string;
  description: string;
  count: number | null;
  countLabel: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-2xl border border-border-on-black bg-white/[0.03] p-6 transition hover:border-yellow hover:bg-white/[0.05]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-yellow">{title}</h2>
        {count !== null && (
          <span className="shrink-0 rounded-full bg-yellow/20 px-2.5 py-0.5 text-xs font-medium text-yellow">
            {count} {countLabel}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-cream/60">{description}</p>
    </a>
  );
}

export default function AdminDashboardPage() {
  const [authStage, setAuthStage] = useState<AuthStage>("checking");
  const [counts, setCounts] = useState<Counts>({
    pendingReviews: null,
    projects: null,
    publishedPosts: null,
  });

  const loadCounts = () => {
    supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .then(({ count }) => setCounts((prev) => ({ ...prev, pendingReviews: count ?? 0 })));

    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setCounts((prev) => ({ ...prev, projects: count ?? 0 })));

    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .then(({ count }) => setCounts((prev) => ({ ...prev, publishedPosts: count ?? 0 })));
  };

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setAuthStage(data.user ? "loggedIn" : "loggedOut");
        if (data.user) loadCounts();
      })
      .catch(() => setAuthStage("loggedOut"));
  }, []);

  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-cream">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>

        {authStage === "checking" && (
          <p className="mt-6 text-cream/60">Checking session…</p>
        )}

        {authStage === "loggedOut" && (
          <AdminLoginForm
            onLoggedIn={() => {
              setAuthStage("loggedIn");
              loadCounts();
            }}
          />
        )}

        {authStage === "loggedIn" && (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <DashboardCard
                href="/admin/reviews/"
                title="Reviews"
                description="Approve or reject client reviews and generate submission links."
                count={counts.pendingReviews}
                countLabel="pending"
              />
              <DashboardCard
                href="/admin/projects/"
                title="Projects"
                description="Manage the projects shown on the portfolio."
                count={counts.projects}
                countLabel="total"
              />
              <DashboardCard
                href="/admin/blog/"
                title="Blog"
                description="Write and publish blog posts."
                count={counts.publishedPosts}
                countLabel="published"
              />
            </div>

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

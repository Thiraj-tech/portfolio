"use client";

import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { supabase } from "../lib/supabaseClient";

const VISITOR_ID_KEY = "blog_visitor_id";

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export default function PostLikeButton({ postId }: { postId: string }) {
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .rpc("get_post_like_state", {
        p_post_id: postId,
        p_visitor_id: getVisitorId(),
      })
      .then(({ data }) => {
        const row = Array.isArray(data) ? data[0] : null;
        if (row) {
          setLikeCount(row.like_count);
          setLiked(row.liked);
        }
      });
  }, [postId]);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev) => (prev ?? 0) + (nextLiked ? 1 : -1));

    const { data, error } = await supabase.rpc("toggle_post_like", {
      p_post_id: postId,
      p_visitor_id: getVisitorId(),
    });
    const row = Array.isArray(data) ? data[0] : null;
    if (error || !row) {
      setLiked(!nextLiked);
      setLikeCount((prev) => (prev ?? 0) - (nextLiked ? 1 : -1));
    } else {
      setLiked(row.liked);
      setLikeCount(row.like_count);
    }
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={likeCount === null}
      aria-pressed={liked}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        liked
          ? "border-yellow bg-yellow/10 text-ink"
          : "border-ink/15 text-ink-muted hover:border-yellow hover:text-ink"
      }`}
    >
      <FiHeart fill={liked ? "currentColor" : "none"} className="text-base" />
      {likeCount === null ? "…" : likeCount}
    </button>
  );
}

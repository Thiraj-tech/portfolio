"use client";

import { useState } from "react";

export default function Avatar({
  name,
  avatar,
}: {
  name: string;
  avatar: string | null;
}) {
  const [failed, setFailed] = useState(false);
  if (avatar && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-cream/70">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ShareButton({ title, url }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return <button type="button" onClick={handleShare} className="btn btn-ghost btn-xs">{copied ? "Link copied!" : "Share"}</button>;
}

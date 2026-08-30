"use client";

import { useEffect, useState } from "react";

function formatRemaining(remaining: number): string {
  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  if (days > 0) {
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function DiscountCountdown({
  endsAt,
  compact = false,
}: {
  endsAt: string;
  compact?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState(() => new Date(endsAt).getTime() - Date.now());
  const [finished, setFinished] = useState(() => remaining <= 0);

  useEffect(() => {
    setMounted(true);
    const id = window.setInterval(() => {
      const value = new Date(endsAt).getTime() - Date.now();
      setRemaining(value);
      setFinished(value <= 0);
    }, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (!mounted || finished) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-blush-deep/70 font-medium text-ink ${
        compact ? "px-2 py-0.5 text-[0.6rem] tracking-wide" : "px-3 py-1 text-xs tracking-wider"
      }`}
      role="timer"
      aria-label={`Termina en ${formatRemaining(remaining)}`}
    >
      <svg viewBox="0 0 24 24" className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      <span>
        {compact ? "" : "Termina en "}
        <span className="tabular-nums">{formatRemaining(remaining)}</span>
      </span>
    </span>
  );
}
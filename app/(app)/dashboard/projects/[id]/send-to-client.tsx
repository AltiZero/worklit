"use client";

import { useEffect, useRef, useState } from "react";

import { generateToken, revokeToken } from "@/app/actions/client-tokens";
import type { ClientReviewToken } from "@/app/actions/client-tokens";

export function SendToClient({
  projectId,
  initialToken,
  reviewOrigin,
  initialNow,
}: {
  projectId: string;
  initialToken?: ClientReviewToken | null;
  reviewOrigin: string;
  initialNow: number;
}) {
  const [token, setToken] = useState<ClientReviewToken | null>(initialToken ?? null);
  const [pendingAction, setPendingAction] = useState<"generate" | "revoke" | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) {
        window.clearTimeout(copyTimer.current);
      }
    };
  }, []);

  function resetCopyState(state: "copied" | "error") {
    setCopyState(state);
    if (copyTimer.current !== null) {
      window.clearTimeout(copyTimer.current);
    }
    copyTimer.current = window.setTimeout(() => setCopyState("idle"), 1800);
  }

  async function copyReviewUrl(reviewUrl: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(reviewUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = reviewUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const didCopy = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!didCopy) throw new Error("Copy command failed.");
      }
      resetCopyState("copied");
    } catch {
      resetCopyState("error");
    }
  }

  async function createNewLink() {
    setPendingAction("generate");
    try {
      const result = await generateToken(projectId);
      if (result) {
        setToken(result);
        setCopyState("idle");
      }
    } finally {
      setPendingAction(null);
    }
  }

  async function revokeCurrentLink() {
    if (!token) return;
    setPendingAction("revoke");
    try {
      const result = await revokeToken(projectId, token.token);
      if (result) setToken(result);
      setCopyState("idle");
    } finally {
      setPendingAction(null);
    }
  }

  if (token) {
    const isExpired = new Date(token.expiresAt).getTime() <= initialNow;
    const isRevoked = Boolean(token.revokedAt);
    const isSubmitted = Boolean(token.submittedAt);
    const hasClientAction = Boolean(token.usedAt);
    const hasBeenOpened = Boolean(token.viewedAt);
    const isShareable = !isExpired && !isRevoked;
    const canRevoke = isShareable && !isSubmitted;
    const path = `/review/${token.token}`;
    const reviewUrl = reviewOrigin ? `${reviewOrigin}${path}` : path;
    const status = isRevoked
      ? "Revoked"
      : isExpired
        ? "Expired"
        : isSubmitted
          ? "Submitted"
          : hasClientAction
            ? "Client started"
            : hasBeenOpened
              ? "Opened"
              : "Ready to send";
    const statusClass = isShareable
      ? "bg-green-light text-green-dark border-green-mid"
      : "bg-bg-alt text-text-soft border-border-mid";
    const openedLabel = token.lastViewedAt
      ? `${token.viewCount} ${token.viewCount === 1 ? "view" : "views"} · last ${formatDateTime(token.lastViewedAt)}`
      : "Not opened yet";

    return (
      <div className="rounded-[var(--radius)] border border-border bg-bg-alt/45 px-4 py-3 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-text">Review link</div>
            <div className="text-[11.5px] text-text-soft mt-0.5">{openedLabel}</div>
          </div>
          <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10.5px] font-semibold leading-none whitespace-nowrap ${statusClass}`}>
            {status}
          </span>
        </div>

        {isShareable ? (
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={reviewUrl}
              className="min-w-0 flex-1 rounded-[var(--radius)] border border-border-mid bg-bg-card px-3 py-2 text-[13px] text-text outline-none focus-visible:border-green"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={() => copyReviewUrl(reviewOrigin ? reviewUrl : `${window.location.origin}${path}`)}
              className="min-h-[36px] rounded-[var(--radius)] border border-border-mid bg-bg-card px-4 py-2 text-[12px] font-medium text-text cursor-pointer hover:border-green-mid hover:text-green-dark transition-[border-color,color] duration-[0.15s]"
            >
              {copyState === "copied" ? "Copied" : copyState === "error" ? "Select" : "Copy"}
            </button>
          </div>
        ) : (
          <div className="rounded-[var(--radius)] border border-border bg-bg-card px-3 py-2 text-[12.5px] text-text-mid">
            This review link no longer accepts client changes.
          </div>
        )}

        <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 border-t border-border pt-3">
          <MetaRow label="Created" value={formatDateTime(token.createdAt)} />
          <MetaRow label="Expires" value={formatDateTime(token.expiresAt)} />
          {token.usedAt && <MetaRow label="First action" value={formatDateTime(token.usedAt)} />}
          {token.submittedAt && <MetaRow label="Submitted" value={formatDateTime(token.submittedAt)} />}
          {token.revokedAt && <MetaRow label="Revoked" value={formatDateTime(token.revokedAt)} />}
        </dl>

        <div className="mt-3 flex flex-wrap gap-2">
          {isShareable && (
            <a
              href={reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[34px] items-center justify-center rounded-[var(--radius)] border border-border-mid bg-bg-card px-3 py-2 text-[12px] font-medium text-text no-underline hover:border-green-mid hover:text-green-dark transition-[border-color,color] duration-[0.15s]"
            >
              Open
            </a>
          )}
          {canRevoke && (
            <button
              type="button"
              disabled={pendingAction !== null}
              onClick={revokeCurrentLink}
              className="min-h-[34px] rounded-[var(--radius)] border border-border-mid bg-bg-card px-3 py-2 text-[12px] font-medium text-text-mid cursor-pointer hover:border-text-soft hover:text-text transition-[border-color,color] duration-[0.15s] disabled:cursor-default disabled:opacity-50"
            >
              {pendingAction === "revoke" ? "Revoking..." : "Revoke"}
            </button>
          )}
          <button
            type="button"
            disabled={pendingAction !== null}
            onClick={createNewLink}
            className="min-h-[34px] rounded-[var(--radius)] border border-transparent bg-text px-3 py-2 text-[12px] font-medium text-bg-card cursor-pointer hover:bg-green transition-colors duration-[0.15s] disabled:cursor-default disabled:opacity-50"
          >
            {pendingAction === "generate" ? "Generating..." : "New link"}
          </button>
        </div>

        <p className="text-[11px] text-text-mid mt-2">
          {copyState === "error"
            ? "Clipboard access was blocked. Select the link and copy it manually."
            : "New links automatically revoke older active links for this project."}
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={pendingAction !== null}
      onClick={createNewLink}
      className="min-h-[40px] rounded-[var(--radius)] border border-transparent bg-text text-bg-card px-5 py-[10px] text-[13px] font-medium cursor-pointer transition-[background,transform] duration-[0.15s,0.1s] hover:bg-green hover:text-white active:scale-[0.97] disabled:opacity-50"
    >
      {pendingAction === "generate" ? "Generating..." : "Generate review link"}
    </button>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[11.5px] text-text-soft">{label}</dt>
      <dd className="text-right text-[11.5px] font-medium text-text tabular-nums">{value}</dd>
    </>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

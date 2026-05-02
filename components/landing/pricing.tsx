"use client";

import { type FormEvent, useState } from "react";

import { CheckIcon } from "./icons";

export function Pricing() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (email) {
      setJoined(true);
    }
  };

  return (
    <div className="pricing-wrapper" id="pricing">
      <div className="pricing-inner">
        <div className="pricing-text">
          <div className="section-label reveal">Pricing</div>
          <div className="pricing-title reveal">
            Simple, honest pricing.
            <br />
            No transaction fees. Ever.
          </div>
          <p className="pricing-sub reveal">
            We&apos;re finalizing pricing. Early access members lock in a founder rate. No commitments, no credit card required to
            start.
          </p>
          <div style={{ display: "flex", gap: "16px", marginTop: "28px", flexWrap: "wrap" }}>
            {["No transaction fees", "Cancel anytime", "Free to start"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-mid)" }}>
                <CheckIcon size={13} color="var(--green)" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-cta reveal">
          {joined ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px",
                background: "var(--green-light)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--green-mid)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--green-dark)", marginBottom: 6 }}>
                You&apos;re on the list.
              </div>
              <div style={{ fontSize: 13, color: "var(--text-mid)" }}>We&apos;ll be in touch when early access opens.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", minWidth: 280 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                style={{
                  padding: "13px 16px",
                  borderRadius: "var(--radius)",
                  border: "1.5px solid var(--border)",
                  font: "14px/1 var(--font-sans)",
                  color: "var(--text)",
                  background: "#fff",
                  outline: "none",
                  transition: "border-color 0.15s",
                  width: "100%",
                }}
                onFocus={(event) => {
                  event.target.style.borderColor = "var(--green)";
                }}
                onBlur={(event) => {
                  event.target.style.borderColor = "var(--border)";
                }}
              />
              <button type="submit" className="btn-waitlist">
                Get early access
              </button>
              <div className="pricing-note">No credit card. No spam.</div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

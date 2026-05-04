import { CheckIcon } from "./icons";
import { WaitlistForm } from "./waitlist-form";

export function Pricing() {
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

        <div className="pricing-cta">
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}

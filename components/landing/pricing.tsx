import { CheckIcon } from "./icons";
import { WaitlistForm } from "./waitlist-form";

export function Pricing() {
  return (
    <div className="bg-bg-alt max-w-full mx-0 p-0 border-t border-b border-border-mid" id="pricing">
      <div className="max-w-[1280px] mx-auto py-24 px-20 flex items-center justify-between gap-16 max-[960px]:flex-col max-[960px]:py-16 max-[960px]:px-6">
        <div className="max-w-[520px]">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-4 reveal">Pricing</div>
          <div className="font-heading text-[clamp(28px,2.8vw,42px)] leading-[1.1] tracking-[-0.02em] text-text mt-4 reveal">
            Simple, honest pricing.
            <br />
            No transaction fees. Ever.
          </div>
          <p className="text-base text-text-mid leading-[1.6] mt-3 reveal">
            We&apos;re finalizing pricing. Early access members lock in a founder rate. No commitments, no credit card required to start.
          </p>
          <div className="flex gap-4 mt-7 flex-wrap">
            {["No transaction fees", "Cancel anytime", "Free to start"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-[13px] text-text-mid">
                <CheckIcon size={13} color="var(--green)" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center w-[min(100%,420px)] flex-shrink-0 max-[960px]:w-full">
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}

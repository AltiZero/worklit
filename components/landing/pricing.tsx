import { CheckIcon } from "./icons";

export function Pricing() {
  const perks = [
    "Unlimited scopes & countersigns",
    "Line-itemed change orders, each signed for",
    "Saved templates & clause library",
    "Audit-grade signature log, exportable as PDF",
    "A client side designed for humans, not lawyers",
  ];

  return (
    <section
      className="border-t py-20 sm:py-[120px]"
      id="pricing"
      style={{ background: "oklch(93% 0.018 80)", borderColor: "oklch(88% 0.022 78)" }}
    >
      <div className="mx-auto max-w-[1180px] px-[22px] sm:px-10 lg:px-14">
        <div className="reveal mb-10 text-center">
          <span className="inline-flex items-center justify-center gap-2.5 text-xs font-medium tracking-[0.14em] text-[oklch(54%_0.014_60)] uppercase">
            <span className="size-[6px] rounded-full" style={{ background: "var(--clay)" }} />
            Pricing
          </span>
          <h2 className="mx-auto mt-3.5 max-w-[16ch] font-[family-name:var(--font-serif)] text-[clamp(36px,5.4vw,60px)] leading-[1.02] font-normal tracking-[-0.02em] text-[oklch(15%_0.018_50)] [text-wrap:balance]">
            One price. <em className="italic" style={{ color: "var(--clay-deep)" }}>Everything in.</em>
          </h2>
          <p className="mx-auto mt-[18px] max-w-[46ch] text-[17px] text-[oklch(36%_0.018_55)]">
            No seats, no add-ons, no &ldquo;starter&rdquo; tier that&rsquo;s really a demo. Cancel any time — your signed records stay
            yours.
          </p>
        </div>

        <div
          className="reveal mx-auto max-w-[480px] rounded-[24px] border p-8 text-center"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--line)",
            boxShadow: "0 1px 0 oklch(15% 0.018 50 / .04), 0 28px 60px -20px oklch(15% 0.018 50 / .22)",
          }}
        >
          <div className="font-[family-name:var(--font-serif)] text-[clamp(56px,9vw,88px)] leading-none tracking-[-0.03em] text-[oklch(15%_0.018_50)]">
            <span className="mr-1 align-[22%] text-[0.42em] text-[oklch(54%_0.014_60)]">$</span>12
            <small className="mt-3 block font-[family-name:var(--font-sans)] text-[13px] font-medium leading-none tracking-[0.04em] text-[oklch(54%_0.014_60)]">
              per month · billed yearly
            </small>
          </div>

          <ul className="mt-7 grid gap-3.5 border-t pt-6 text-left list-none" style={{ borderColor: "var(--line)" }}>
            {perks.map((p) => (
              <li key={p} className="grid grid-cols-[22px_1fr] items-start gap-2.5 text-[15px] leading-[1.45] text-[oklch(15%_0.018_50)]">
                <CheckIcon size={18} color="var(--clay)" />
                {p}
              </li>
            ))}
          </ul>

          <a
            className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-[15px] text-[15px] font-medium leading-none text-white no-underline transition-all hover:-translate-y-px active:scale-[0.97]"
            href="#"
            style={{ background: "var(--clay-deep)" }}
          >
            Start 30 days free <span className="transition-transform duration-200">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

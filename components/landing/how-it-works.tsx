export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Compose",
      desc: "Start blank or from a template. Add line items, prices, and short notes. Save common clauses for next time.",
    },
    {
      num: "02",
      title: "Send for sign-off",
      desc: "Your client opens a clean page. They approve, decline, or counter each line — no account required, no pdf shuffling.",
    },
    {
      num: "03",
      title: "Keep the record",
      desc: "Every yes, every change order, every \"not now\" lives in one signed trail. The receipt you can point at when memory fails.",
    },
  ];

  return (
    <section
      className="py-20 sm:py-[120px]"
      id="how"
      style={{ background: "var(--forest)", color: "oklch(98% 0.008 80)" }}
    >
      <div className="mx-auto max-w-[1180px] px-[22px] sm:px-10 lg:px-14">
        <div className="reveal grid gap-5 md:grid-cols-2 md:gap-14 md:items-end mb-10">
          <div>
            <span className="inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.14em] text-[oklch(72%_0.014_80)] uppercase">
              <span className="size-[6px] rounded-full" style={{ background: "var(--clay)" }} />
              How it works
            </span>
            <h2 className="mt-3 max-w-[14ch] font-[family-name:var(--font-serif)] text-[clamp(34px,5.4vw,64px)] leading-[1.02] font-normal tracking-[-0.02em] text-white [text-wrap:balance]">
              Three steps. <em className="italic" style={{ color: "var(--clay-soft)" }}>That&rsquo;s it.</em>
            </h2>
          </div>
          <p className="max-w-[44ch] text-[16px] leading-relaxed" style={{ color: "oklch(86% 0.014 80)" }}>
            No onboarding video. No tour. Open the app, write down what you&rsquo;re doing, send it. The whole thing is built to be used in under two minutes.
          </p>
        </div>

        <div
          className="reveal-stagger grid gap-px overflow-hidden rounded-[20px] border sm:grid-cols-3"
          style={{ background: "var(--border-dark)", borderColor: "var(--border-dark)" }}
        >
          {steps.map((step) => (
            <article
              key={step.num}
              className="flex flex-col gap-3.5 p-7 pb-8 transition-colors duration-[250ms] hover:bg-[var(--forest-2)]"
              style={{ background: "var(--forest)" }}
            >
              <span
                className="font-[family-name:var(--font-serif)] text-[56px] italic leading-none tracking-[-0.02em]"
                style={{ color: "var(--clay-soft)" }}
              >
                {step.num}
              </span>
              <h4 className="font-[family-name:var(--font-serif)] text-2xl leading-[1.2] font-normal tracking-[-0.01em] text-white">
                {step.title}
              </h4>
              <p className="text-[15.5px] leading-relaxed" style={{ color: "oklch(86% 0.014 80)", textWrap: "pretty" }}>
                {step.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

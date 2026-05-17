export function ProblemSection() {
  return (
    <section className="py-20 sm:py-[120px] sm:pb-24" id="problem" style={{ background: "oklch(96.5% 0.014 82)" }}>
      <div className="mx-auto max-w-[1180px] px-[22px] sm:px-10 lg:px-14">
        <div className="reveal grid gap-6 md:grid-cols-[220px_1fr] md:gap-14">
          <div>
            <span className="eyebrow inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.14em] text-[oklch(54%_0.014_60)] uppercase">
              <span className="dot size-[6px] rounded-full" style={{ background: "var(--clay)" }} />
              The problem
            </span>
          </div>
          <div>
            <h2 className="max-w-[22ch] font-[family-name:var(--font-serif)] text-[clamp(34px,5.6vw,64px)] leading-[1.02] font-normal tracking-[-0.02em] text-[oklch(15%_0.018_50)] [text-wrap:balance]">
              Every freelancer learns this <em className="italic" style={{ color: "var(--clay-deep)" }}>the expensive way</em>.
            </h2>
            <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.65] text-[oklch(36%_0.018_55)]">
              A quick call, a friendly &ldquo;sounds good,&rdquo; a vague brief. Three weeks later the project is half again as large and nobody quite remembers who agreed to what. You eat the difference. Again.
            </p>
          </div>
        </div>

        <div className="reveal-stagger mt-12 grid gap-3.5 sm:grid-cols-2 sm:gap-[18px]">
          <div className="rounded-[20px] border p-6" style={{ background: "var(--bg-card)", borderColor: "var(--line)" }}>
            <span className="inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.14em] text-[oklch(54%_0.014_60)] uppercase">
              <span className="size-[7px] rounded-full bg-[oklch(54%_0.014_60)]" />
              Before worklit
            </span>
            <p className="mt-3.5 font-[family-name:var(--font-serif)] text-[clamp(20px,2.5vw,26px)] leading-[1.25] text-[oklch(36%_0.018_55)] tracking-[-0.005em]">
              &ldquo;Could you also just&hellip; tweak the homepage? And maybe a quick mobile version? Won&rsquo;t take long, right?&rdquo;
            </p>
          </div>
          <div
            className="rounded-[20px] border p-6"
            style={{ background: "var(--green-light)", borderColor: "var(--green-mid)" }}
          >
            <span className="inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.14em] uppercase" style={{ color: "var(--clay-deep)" }}>
              <span className="size-[7px] rounded-full" style={{ background: "var(--clay)" }} />
              With worklit
            </span>
            <p className="mt-3.5 font-[family-name:var(--font-serif)] text-[clamp(20px,2.5vw,26px)] leading-[1.25] text-[oklch(15%_0.018_50)] tracking-[-0.005em]">
              &ldquo;Adding mobile is a change order — $1,400, signed for, queued behind the current milestone.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

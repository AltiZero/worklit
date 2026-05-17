export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden py-[100px] pb-[110px] text-center"
      style={{ background: "var(--forest-2)", color: "oklch(98% 0.008 80)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(52% 0.100 48 / .26), transparent 60%)" }}
        aria-hidden="true"
      />

      <div className="reveal reveal-stagger relative mx-auto max-w-[1180px] px-[22px] sm:px-10 lg:px-14">
        <span className="inline-flex items-center justify-center gap-2.5 text-xs font-medium tracking-[0.14em] text-[oklch(72%_0.014_80)] uppercase">
          <span className="size-[6px] rounded-full" style={{ background: "var(--clay)" }} />
          Begin
        </span>
        <h2 className="relative mx-auto mt-[18px] max-w-[14ch] font-[family-name:var(--font-serif)] text-[clamp(44px,7vw,96px)] leading-[0.98] font-normal tracking-[-0.02em] text-white [text-wrap:balance]">
          Write it down <em className="italic" style={{ color: "var(--clay-soft)" }}>before</em> you start.
        </h2>
        <p className="relative mx-auto mt-[22px] max-w-[48ch] text-[17px] leading-relaxed text-[oklch(86%_0.014_80)]">
          The first scope you forget to send is the most expensive one you&rsquo;ll ever not send. Begin one in under two minutes.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[oklch(98%_0.008_80)] px-6 py-[15px] text-[15px] font-medium leading-none text-[oklch(15%_0.018_50)] no-underline transition-all hover:-translate-y-px hover:bg-[var(--clay)] hover:text-white"
            href="#"
          >
            Start free <span className="transition-transform duration-200">→</span>
          </a>
          <a
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/60 px-6 py-[15px] text-[15px] font-medium leading-none text-white no-underline transition-all hover:border-white hover:bg-white hover:text-[oklch(15%_0.018_50)]"
            href="#how"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}

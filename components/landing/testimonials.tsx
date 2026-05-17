export function Testimonials() {
  const voices = [
    {
      quote: (
        <>
          &ldquo;I stopped quietly losing two days a month to scope drift. I didn&rsquo;t have to become a different person — I just had
          to send <em className="italic" style={{ color: "var(--clay-deep)" }}>the thing</em>.&rdquo;
        </>
      ),
      initials: "IH",
      name: "Iris Halverson",
      role: "Brand designer, Portland",
    },
    {
      quote: (
        <>
          &ldquo;My clients actually{" "}
          <em className="italic" style={{ color: "var(--clay-deep)" }}>read it</em>. That was the part I didn&rsquo;t see coming. They feel
          like adults instead of getting a pdf.&rdquo;
        </>
      ),
      initials: "MO",
      name: "Marcus Ohene",
      role: "Independent dev, Berlin",
    },
    {
      quote: (
        <>
          &ldquo;First scope took 8 minutes. Charged $600 more than I would have. Paid for the year on{" "}
          <em className="italic" style={{ color: "var(--clay-deep)" }}>day one</em>.&rdquo;
        </>
      ),
      initials: "SK",
      name: "Sana Kapoor",
      role: "Copywriter, Bangalore",
    },
  ];

  return (
    <section className="py-20 sm:py-[120px]" style={{ background: "oklch(96.5% 0.014 82)" }}>
      <div className="mx-auto max-w-[1180px] px-[22px] sm:px-10 lg:px-14">
        <div className="reveal mb-9">
          <span className="inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.14em] text-[oklch(54%_0.014_60)] uppercase">
            <span className="size-[6px] rounded-full" style={{ background: "var(--clay)" }} />
            The people using it
          </span>
          <h2 className="mt-3 max-w-[22ch] font-[family-name:var(--font-serif)] text-[clamp(30px,4vw,44px)] leading-[1.1] font-normal tracking-[-0.02em] text-[oklch(15%_0.018_50)] [text-wrap:balance]">
            Mostly quiet emails that say <em className="italic" style={{ color: "var(--clay-deep)" }}>thank you.</em>
          </h2>
        </div>

        <div className="reveal-stagger grid gap-4 sm:grid-cols-3 sm:gap-[18px]">
          {voices.map((v) => (
            <article
              key={v.initials}
              className="flex flex-col gap-[18px] rounded-[20px] border p-6 transition-all duration-[250ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-[3px] hover:border-[oklch(74%_0.020_70)]"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--line)",
              }}
            >
              <blockquote className="font-[family-name:var(--font-serif)] text-[clamp(20px,2.2vw,24px)] leading-[1.3] text-[oklch(15%_0.018_50)] tracking-[-0.005em] [text-wrap:pretty]">
                {v.quote}
              </blockquote>
              <div className="mt-auto flex items-center gap-3 border-t pt-4" style={{ borderColor: "var(--line)" }}>
                <span
                  className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-full text-[14px] font-medium"
                  style={{ background: "var(--clay-soft)", color: "var(--clay-deep)" }}
                >
                  {v.initials}
                </span>
                <span className="text-[14px] font-medium text-[oklch(15%_0.018_50)]">
                  {v.name}
                  <small className="block font-normal text-[oklch(54%_0.014_60)]">{v.role}</small>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

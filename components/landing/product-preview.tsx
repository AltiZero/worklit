export function ProductPreview() {
  const items = [
    { desc: "Brand strategy workshop", small: "Half day, written summary of positioning & voice.", price: "$1,400.00", state: "Approved", cls: "is-approved" },
    { desc: "Wordmark — three directions", small: "Two rounds of revisions, vector files in colour, mono & reversed.", price: "$2,800.00", state: "Approved", cls: "is-approved" },
    { desc: "Packaging — 12oz & 5lb bags", small: "Print-ready PDFs delivered with printer spec.", price: "$3,600.00", state: "Approved", cls: "is-approved" },
    { desc: "Short brand book (12 pages)", small: "Optional. Adds 3–4 days. Quoted separately.", price: "$1,200.00", state: "Awaiting", cls: "is-pending" },
    { desc: "Website redesign", small: "Out of scope for Phase I — noted so we don't forget.", price: "—", state: "Not now", cls: "is-declined" },
  ];

  return (
    <section
      className="border-y py-20 sm:py-[120px] sm:pb-32"
      id="product"
      style={{ background: "oklch(93% 0.018 80)", borderColor: "oklch(88% 0.022 78)" }}
    >
      <div className="mx-auto max-w-[1180px] px-[22px] sm:px-10 lg:px-14">
        <div className="reveal grid gap-5 md:grid-cols-[1.2fr_1fr] md:gap-14 md:items-end mb-10">
          <div>
            <span className="inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.14em] text-[oklch(54%_0.014_60)] uppercase">
              <span className="size-[6px] rounded-full" style={{ background: "var(--clay)" }} />
              Product
            </span>
            <h2 className="mt-2 max-w-[18ch] font-[family-name:var(--font-serif)] text-[clamp(32px,4.6vw,52px)] leading-[1.05] font-normal tracking-[-0.02em] text-[oklch(15%_0.018_50)] [text-wrap:balance]">
              A scope your client can <em className="italic" style={{ color: "var(--clay-deep)" }}>actually read</em>.
            </h2>
          </div>
          <p className="max-w-[44ch] text-[16px] leading-relaxed text-[oklch(36%_0.018_55)]">
            Line items, fixed prices, and a single button to approve, decline, or counter. Sign on phone or desktop. Every change adds another signature to the record.
          </p>
        </div>

        <div
          className="reveal overflow-hidden rounded-[20px] border"
          style={{ background: "var(--bg-card)", borderColor: "var(--line)", boxShadow: "0 1px 0 oklch(15% 0.018 50 / .04), 0 28px 60px -20px oklch(15% 0.018 50 / .22)" }}
          role="img"
          aria-label="Example scope in Worklit"
        >
          {/* Browser bar */}
          <div className="flex items-center justify-between gap-4 border-b px-3.5 py-3" style={{ background: "var(--bg-alt)", borderColor: "var(--line)" }}>
            <span className="inline-flex gap-1.5">
              <i className="block size-2.5 rounded-full bg-[oklch(80%_0.014_70)]" />
              <i className="block size-2.5 rounded-full bg-[oklch(80%_0.014_70)]" />
              <i className="block size-2.5 rounded-full bg-[oklch(80%_0.014_70)]" />
            </span>
            <span className="text-xs text-[oklch(54%_0.014_60)] max-[520px]:hidden">worklit.co / scope / 2026-03-114</span>
            <span
              className="rounded-full border px-2.5 py-[5px] text-xs font-medium text-[oklch(15%_0.018_50)]"
              style={{ background: "var(--bg-card)", borderColor: "var(--line-2)" }}
            >
              Awaiting signature
            </span>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-8 sm:pb-9">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 text-[13px] text-[oklch(54%_0.014_60)]">
              <span><strong className="font-medium text-[oklch(15%_0.018_50)]">Iris Halverson</strong> → Ridgeline Coffee Co.</span>
              <span>Sent 12 Mar · Scope #114</span>
            </div>
            <div className="mt-3 mb-1 font-[family-name:var(--font-serif)] text-[clamp(24px,3.2vw,34px)] leading-[1.15] text-[oklch(15%_0.018_50)] tracking-[-0.01em]">Brand identity & packaging, Phase I</div>
            <div className="text-[14px] text-[oklch(54%_0.014_60)]">Fixed price · two milestones · revisions counted</div>

            {/* Items */}
            <div className="mt-[22px] border-t" style={{ borderColor: "var(--line)" }}>
              {items.map((item, i) => {
                const isApproved = item.cls === "is-approved";
                const isDeclined = item.cls === "is-declined";
                const isPending = item.cls === "is-pending";

                return (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-b py-3.5"
                    style={{ borderColor: "var(--line)", opacity: isDeclined ? 0.55 : 1 }}
                  >
                    <span
                      className="text-[16px] font-medium text-[oklch(15%_0.018_50)]"
                      style={isDeclined ? { textDecoration: "line-through", textDecorationColor: "oklch(54% 0.014 60)" } : undefined}
                    >
                      {item.desc}
                    </span>
                    <small className="col-span-full text-[13.5px] leading-relaxed text-[oklch(54%_0.014_60)]">{item.small}</small>
                    <div className="col-span-full mt-2 flex items-center justify-between gap-2.5">
                      <span className="text-[14px] font-medium tabular-nums text-[oklch(15%_0.018_50)]">{item.price}</span>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium tracking-[0.10em] uppercase"
                        style={{
                          background: isApproved ? "var(--green-light)" : isPending ? "var(--bg-alt)" : "var(--bg-card)",
                          borderColor: isApproved ? "var(--green-mid)" : isPending ? "var(--line-2)" : "var(--line)",
                          color: isApproved ? "var(--green-dark)" : isPending ? "oklch(36% 0.018 55)" : "oklch(54% 0.014 60)",
                        }}
                      >
                        <span className="size-[6px] rounded-full opacity-90" style={{ background: "currentColor" }} />
                        {item.state}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-[22px] grid gap-[18px] sm:grid-cols-[1fr_auto] sm:gap-6 items-end">
              <div className="min-w-[220px] border-t pt-3.5 text-[14px] text-[oklch(36%_0.018_55)]" style={{ borderColor: "var(--line)" }}>
                <div className="flex justify-between py-1"><span>Subtotal, approved</span><span>$7,800.00</span></div>
                <div className="flex justify-between py-1"><span>Awaiting countersign</span><span>$1,200.00</span></div>
                <div className="mt-1.5 flex justify-between border-t py-2 text-[16px] font-medium text-[oklch(15%_0.018_50)]" style={{ borderColor: "var(--line)" }}>
                  <span>Total, on signature</span><span>$9,000.00</span>
                </div>
              </div>
              <a
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[oklch(15%_0.018_50)] px-6 py-[15px] text-[15px] font-medium leading-none text-white no-underline transition-all hover:-translate-y-px self-stretch"
                href="#"
                style={{ background: "var(--clay-deep)" }}
              >
                Sign & submit <span className="transition-transform duration-200">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

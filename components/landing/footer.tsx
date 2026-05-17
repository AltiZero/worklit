export function Footer() {
  return (
    <footer
      className="border-t pb-10 pt-10"
      style={{ background: "var(--forest-2)", borderColor: "var(--border-dark)", color: "oklch(72% 0.014 80)" }}
    >
      <div className="mx-auto max-w-[1180px] px-[22px] sm:px-10 lg:px-14">
        <div className="grid gap-6 text-[14px] md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-10">
          <div className="mb-3 md:mb-0">
            <a
              className="mb-3 inline-flex items-center gap-2.5 font-[family-name:var(--font-serif)] text-[26px] italic leading-none text-white tracking-[-0.01em]"
              href="#"
            >
              <span
                className="inline-flex size-[30px] items-center justify-center rounded-lg bg-white"
                style={{ color: "var(--forest-2)" }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7.5L5.5 11L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              worklit
            </a>
            <p className="mt-3 max-w-[32ch] leading-relaxed text-[oklch(72%_0.014_80)]">
              A scope-approval tool for freelancers who&rsquo;d rather get paid than argue.
            </p>
          </div>

          <div>
            <h5 className="mb-3.5 text-xs font-medium tracking-[0.14em] text-white uppercase">Product</h5>
            <a href="#product" className="block py-1.5 transition-colors hover:text-white">Features</a>
            <a href="#how" className="block py-1.5 transition-colors hover:text-white">How it works</a>
            <a href="#pricing" className="block py-1.5 transition-colors hover:text-white">Pricing</a>
            <a href="#" className="block py-1.5 transition-colors hover:text-white">Changelog</a>
          </div>

          <div>
            <h5 className="mb-3.5 text-xs font-medium tracking-[0.14em] text-white uppercase">Resources</h5>
            <a href="#" className="block py-1.5 transition-colors hover:text-white">Field guide</a>
            <a href="#" className="block py-1.5 transition-colors hover:text-white">Templates</a>
            <a href="#" className="block py-1.5 transition-colors hover:text-white">Help & docs</a>
            <a href="#" className="block py-1.5 transition-colors hover:text-white">Contact</a>
          </div>

          <div>
            <h5 className="mb-3.5 text-xs font-medium tracking-[0.14em] text-white uppercase">Company</h5>
            <a href="#" className="block py-1.5 transition-colors hover:text-white">About</a>
            <a href="#" className="block py-1.5 transition-colors hover:text-white">Privacy</a>
            <a href="#" className="block py-1.5 transition-colors hover:text-white">Terms</a>
            <a href="#" className="block py-1.5 transition-colors hover:text-white">hello@worklit.co</a>
          </div>
        </div>

        <div
          className="mt-10 flex flex-wrap justify-between gap-3 border-t pt-6 text-[13px]"
          style={{ borderColor: "var(--border-dark)", color: "oklch(72% 0.014 80)" }}
        >
          <span>© 2026 Worklit. Built quietly in Oregon.</span>
          <span>Made for freelancers, not enterprises.</span>
        </div>
      </div>
    </footer>
  );
}

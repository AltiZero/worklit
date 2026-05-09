import { HeroMockup } from "./mockup";

export function Hero() {
  return (
    <div className="min-h-screen grid grid-cols-2 items-center gap-16 pt-[120px] px-20 pb-20 max-w-[1280px] mx-auto max-[960px]:grid-cols-1 max-[960px]:pt-[100px] max-[960px]:px-6 max-[960px]:pb-[60px] max-[960px]:gap-12">
      <div className="flex flex-col gap-7">
        <div className="animate-in delay-1">
          <div className="inline-flex items-center gap-2 bg-green-light text-green-dark text-xs font-semibold tracking-[0.08em] uppercase py-[5px] px-3 rounded-full w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Now in early access
          </div>
        </div>
        <h1 className="animate-in delay-2 font-heading text-[clamp(42px,4.5vw,66px)] leading-[1.08] tracking-[-0.02em] text-text max-[600px]:text-[38px]">
          Scope creep ends
          <br />
          <em className="italic text-green">here.</em>
        </h1>
        <p className="animate-in delay-3 text-lg leading-[1.6] text-text-mid font-normal max-w-[420px]">
          Define deliverables, prices, and get explicit client sign-off in minutes. No back-and-forth, no disputes.
        </p>
        <div className="animate-in delay-4 flex items-center gap-3 flex-wrap">
          <a href="#pricing" className="bg-green text-white py-[13px] px-[26px] rounded-[var(--radius)] font-sans text-[15px] font-medium border-none cursor-pointer no-underline transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] inline-flex items-center gap-2 shadow-[0_1px_3px_oklch(22%_0.014_60_/_0.12)] hover:bg-green-hover hover:-translate-y-px hover:shadow-[0_4px_12px_oklch(48%_0.120_148_/_0.28)] active:scale-[0.97]">
            Start for free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#how" className="bg-transparent text-text-mid py-[13px] px-[22px] rounded-[var(--radius)] font-sans text-[15px] font-normal border-[1.5px] border-border-mid cursor-pointer no-underline transition-[border-color,color,transform] duration-[0.18s] inline-flex items-center gap-2 hover:border-text-soft hover:text-text active:scale-[0.97]">
            See how it works
          </a>
        </div>
        <div className="animate-in delay-5 flex items-center gap-2.5 text-[13px] text-text-soft">
          <div className="flex">
            {["S", "M", "R", "A"].map((letter, index) => (
              <div
                key={letter}
                className="w-[26px] h-[26px] rounded-full border-2 border-[var(--bg)] bg-bg-alt -ml-1.5 flex items-center justify-center text-[10px] font-semibold text-text-mid first:ml-0"
                style={{ background: `oklch(${90 - index * 4}% 0.012 ${70 + index * 18})` }}
              >
                {letter}
              </div>
            ))}
          </div>
          <span>Trusted by 200+ freelancers</span>
        </div>
      </div>
      <div className="animate-in delay-3 relative flex justify-center items-center">
        <HeroMockup />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    const hero = heroRef.current;
    if (
      !bg ||
      !hero ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(min-width: 720px)").matches
    ) {
      return;
    }

    let ticking = false;
    const update = () => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        ticking = false;
        return;
      }
      const y = Math.max(0, -rect.top);
      bg.style.transform = `translate3d(0, ${-y * 0.14}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={heroRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden md:min-h-[100dvh] xl:max-h-[1100px]"
    >
      {/* Background painting */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-[-2]"
        style={{
          background: "url('/hero-painting.png') top center / cover no-repeat",
          transformOrigin: "center top",
          animation: "heroBgIn 1.6s cubic-bezier(.22,1,.36,1) both",
        }}
        aria-hidden="true"
      />

      {/* Dark scrim */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          background: "linear-gradient(to bottom, oklch(12% 0.020 145 / 0) 0%, oklch(12% 0.020 145 / 0) 22%, oklch(12% 0.020 145 / .35) 42%, oklch(10% 0.018 145 / .72) 62%, oklch(8% 0.016 145 / .94) 100%)",
          animation: "scrimIn 1.4s ease .25s both",
        }}
        aria-hidden="true"
      />

      {/* Side vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[-1]"
        style={{
          background: "radial-gradient(120% 70% at 20% 100%, oklch(8% 0.016 145 / .55) 0%, oklch(8% 0.016 145 / 0) 60%)",
          animation: "scrimIn 1.4s ease .25s both",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-[1180px] flex-1 flex-col items-start justify-end px-[22px] pt-[110px] pb-14 sm:pt-[140px] sm:pb-[72px] sm:px-10 lg:px-14 xl:pb-24">
        {/* Tag pill */}
        <span
          className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/50 px-3.5 py-2 text-xs font-medium tracking-[0.14em] text-white uppercase backdrop-blur-lg"
          style={{ animation: "fadeUp .9s cubic-bezier(.22,1,.36,1) .45s both" }}
        >
          <span
            className="size-[7px] rounded-full"
            style={{
              background: "var(--clay)",
              boxShadow: "0 0 0 4px oklch(64% 0.135 48 / .22)",
              animation: "pulseDot 2.4s ease-in-out 1.4s infinite",
            }}
          />
          Now in open beta
        </span>

        <h1
          className="max-w-[14ch] font-[family-name:var(--font-serif)] text-[clamp(44px,8.6vw,116px)] leading-[0.96] font-normal tracking-[-0.02em] text-white [text-wrap:balance]"
          style={{
            animation: "fadeUp .9s cubic-bezier(.22,1,.36,1) .60s both",
          }}
        >
          Get paid for the work you <em className="italic" style={{ color: "var(--clay-soft)" }}>said yes to.</em>
        </h1>

        <p
          className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-[oklch(86%_0.014_80)] sm:mt-7 sm:text-[19px]"
          style={{
            animation: "fadeUp .9s cubic-bezier(.22,1,.36,1) .78s both",
          }}
        >
          Worklit turns the messy &ldquo;sounds good&rdquo; at the start of a project into a signed, line-itemed record — so scope creep
          has nowhere quiet to hide.
        </p>

        <div
          className="mt-8 flex flex-wrap gap-3"
          style={{ animation: "fadeUp .9s cubic-bezier(.22,1,.36,1) .92s both" }}
        >
          <a
            className="inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-[15px] text-[15px] font-medium leading-none text-[oklch(15%_0.018_50)] no-underline transition-all hover:-translate-y-px bg-white hover:bg-[var(--clay)] hover:text-white"
            href="#"
          >
            Start free <span className="transition-transform duration-200">→</span>
          </a>
          <a
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/60 px-6 py-[15px] text-[15px] font-medium leading-none text-white no-underline transition-all hover:border-white hover:bg-white hover:text-[oklch(15%_0.018_50)]"
            href="#product"
          >
            See it in action
          </a>
        </div>

        <div
          className="mt-9 flex flex-wrap items-center gap-x-[22px] gap-y-2.5 text-[13px] text-[oklch(72%_0.014_80)]"
          style={{ animation: "fadeUp .9s cubic-bezier(.22,1,.36,1) 1.06s both" }}
        >
          <span>
            <strong className="font-medium text-white">312</strong> freelancers signing this month
          </span>
          <span className="h-px w-[22px] bg-[oklch(72%_0.014_80)] opacity-55" />
          <span>
            <span className="tracking-[0.05em]" style={{ color: "var(--clay-soft)" }}>★★★★★</span>{" "}
            4.9 on Product Hunt
          </span>
        </div>
      </div>
    </header>
  );
}

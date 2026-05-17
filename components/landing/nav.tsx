"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const links = [
  { href: "#problem", label: "The problem" },
  { href: "#product", label: "Product" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 80 && y > lastScroll.current + 10) setHidden(true);
        else if (y < lastScroll.current - 6 || y < 60) setHidden(false);
        lastScroll.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-20 transition-transform duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          hidden ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-[22px] pt-5 pb-5 sm:px-10 lg:px-14">
          <a
            className="inline-flex items-center gap-2.5 font-[family-name:var(--font-serif)] text-[26px] italic leading-none text-white tracking-[-0.01em]"
            href="#"
          >
            <span
              className="inline-flex size-[30px] items-center justify-center rounded-lg bg-white"
              style={{ color: "oklch(20% 0.026 145)" }}
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M2 7.5L5.5 11L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            worklit
          </a>

          <div className="hidden items-center gap-7 text-sm md:inline-flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-white/90 transition-colors hover:text-[var(--clay-soft)] hover:opacity-100">
                {l.label}
              </a>
            ))}
            <a
              className="rounded-full border border-white/60 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white hover:text-[oklch(15%_0.018_50)]"
              href="#"
            >
              Start free
            </a>
          </div>

          <button
            className="inline-flex size-[42px] items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-md md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <b className="relative block h-[1.5px] w-4 bg-white before:absolute before:left-0 before:top-[-5px] before:block before:h-[1.5px] before:w-4 before:bg-white after:absolute after:left-0 after:top-[5px] after:block after:h-[1.5px] after:w-4 after:bg-white" />
          </button>
        </div>
      </nav>

      <div className={cn("drawer", drawerOpen && "open")} aria-hidden={!drawerOpen}>
        <div className="mx-auto max-w-[1180px] px-[22px] sm:px-10 lg:px-14">
          <div className="drawer-top">
            <a
              className="inline-flex items-center gap-2.5 font-[family-name:var(--font-serif)] text-[26px] italic leading-none tracking-[-0.01em]"
              style={{ color: "oklch(15% 0.018 50)" }}
              href="#"
              onClick={() => setDrawerOpen(false)}
            >
              <span
                className="inline-flex size-[30px] items-center justify-center rounded-lg"
                style={{ background: "oklch(15% 0.018 50)", color: "oklch(96.5% 0.014 82)" }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7.5L5.5 11L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              worklit
            </a>
            <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              ×
            </button>
          </div>
          {links.map((l) => (
            <a key={l.href} className="drawer-link" href={l.href} onClick={() => setDrawerOpen(false)}>
              {l.label}
            </a>
          ))}
          <a className="drawer-cta" href="#" onClick={() => setDrawerOpen(false)}>
            Start free <span className="transition-transform duration-200">→</span>
          </a>
        </div>
      </div>
    </>
  );
}

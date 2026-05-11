"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#problem", label: "The problem" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

const SHOW_THRESHOLD = 80;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const current = window.scrollY;

    if (current < SHOW_THRESHOLD) {
      setVisible(true);
    } else if (current > lastScrollY.current + 8) {
      setVisible(false);
    } else if (current < lastScrollY.current - 8) {
      setVisible(true);
    }

    lastScrollY.current = current;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const close = () => setOpen(false);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 h-16 bg-[oklch(95%_0.008_100_/_0.88)] backdrop-blur-xl backdrop-saturate-[140%] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-[960px]:px-6",
          visible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <a href="#" className="flex items-center gap-2 font-[family-name:var(--font-sans)] font-semibold text-[17px] text-text no-underline tracking-[-0.3px]">
          <div className="w-[26px] h-[26px] rounded-[7px] bg-green flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7.5L5.5 11L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          Worklit
        </a>

        <ul className="flex items-center gap-8 list-none max-[960px]:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-normal text-text-mid no-underline transition-colors duration-150 hover:text-text">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#pricing" className="bg-text text-bg px-5 py-2 rounded-lg font-medium text-sm transition-[background,color,transform] duration-[0.18s,0.18s,0.16s] hover:bg-green hover:text-white active:scale-[0.97]">
              Get early access
            </a>
          </li>
        </ul>

        <button
          className={cn(
            "hidden flex-col justify-center items-center gap-[5px] w-9 h-9 bg-transparent border-none cursor-pointer p-1 rounded-lg transition-colors duration-150 hover:bg-bg-alt",
            "max-[960px]:flex",
          )}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={cn(
            "block w-[18px] h-[1.5px] bg-text rounded-sm transition-[transform,opacity] duration-250 ease-out origin-center",
            open && "translate-y-[6.5px] rotate-45",
          )} />
          <span className={cn(
            "block w-[18px] h-[1.5px] bg-text rounded-sm transition-[transform,opacity] duration-250 ease-out origin-center",
            open && "opacity-0 scale-x-0",
          )} />
          <span className={cn(
            "block w-[18px] h-[1.5px] bg-text rounded-sm transition-[transform,opacity] duration-250 ease-out origin-center",
            open && "-translate-y-[6.5px] -rotate-45",
          )} />
        </button>
      </nav>

      <div
        className={cn(
          "hidden fixed top-16 left-0 right-0 z-[99] bg-bg border-b border-border px-6 pb-6 flex-col gap-1 shadow-[0_8px_24px_oklch(20%_0.012_60_/_0.08)]",
          "transition-[transform,opacity] duration-[0.22s] ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-2 opacity-0 pointer-events-none",
          "max-[960px]:flex",
        )}
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={close} className="text-[15px] font-normal text-text-mid no-underline px-2 py-2.5 rounded-lg transition-[background,color] duration-150 hover:bg-bg-alt hover:text-text">
            {link.label}
          </a>
        ))}
        <a href="#pricing" onClick={close} className="mt-2 bg-green text-white font-medium text-center text-[15px] no-underline px-2 py-2.5 rounded-lg hover:bg-green-hover active:scale-[0.97]">
          Get early access
        </a>
      </div>
    </>
  );
}

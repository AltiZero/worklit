"use client";

import { useState } from "react";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#problem", label: "The problem" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <nav>
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7.5L5.5 11L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          Worklit
        </a>

        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          <li>
            <a href="#pricing" className="nav-cta">
              Get early access
            </a>
          </li>
        </ul>

        <button className={`nav-hamburger${open ? " open" : ""}`} aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`nav-drawer${open ? " open" : ""}`}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
        <a href="#pricing" className="nav-drawer-cta" onClick={close}>
          Get early access
        </a>
      </div>
    </>
  );
}

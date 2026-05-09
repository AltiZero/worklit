"use client";

import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}

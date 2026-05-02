import { HeroMockup } from "./mockup";

export function Hero() {
  return (
    <div className="hero">
      <div className="hero-text">
        <div className="animate-in delay-1">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            Now in early access
          </div>
        </div>
        <h1 className="animate-in delay-2">
          Scope creep ends
          <br />
          <em>here.</em>
        </h1>
        <p className="hero-sub animate-in delay-3">
          Define deliverables, prices, and get explicit client sign-off in minutes. No back-and-forth, no disputes.
        </p>
        <div className="hero-actions animate-in delay-4">
          <a href="#pricing" className="btn-primary">
            Start for free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#how" className="btn-secondary">
            See how it works
          </a>
        </div>
        <div className="hero-social-proof animate-in delay-5">
          <div className="hero-avatars">
            {["S", "M", "R", "A"].map((letter, index) => (
              <div key={letter} className="hero-avatar" style={{ background: `oklch(${90 - index * 4}% 0.012 ${70 + index * 18})` }}>
                {letter}
              </div>
            ))}
          </div>
          <span>Trusted by 200+ freelancers</span>
        </div>
      </div>
      <div className="hero-mockup animate-in delay-3">
        <HeroMockup />
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <div className="nav-logo-mark">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7.5L5.5 11L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              Worklit
            </a>
            <p className="footer-tagline">Scope approval for freelancers who want to get paid for what they agreed to.</p>
            <p style={{ marginTop: 16, fontSize: 12, color: "oklch(42% 0.016 140)", fontStyle: "italic" }}>Built for freelancers, by freelancers.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <div className="footer-col-title">Product</div>
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Worklit. All rights reserved.</span>
          <span>worklit.app</span>
        </div>
      </div>
    </footer>
  );
}

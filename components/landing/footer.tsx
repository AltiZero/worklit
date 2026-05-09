export function Footer() {
  return (
    <footer className="bg-[oklch(20%_0.020_148)] pt-14 pb-10 px-20 max-[960px]:pt-12 max-[960px]:pb-8 max-[960px]:px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex justify-between items-start pb-10 border-b border-border-dark gap-12 max-[960px]:flex-col">
          <div className="max-w-[280px]">
            <a href="#" className="flex items-center gap-2 font-semibold text-base text-text-inv no-underline mb-3">
              <div className="w-[26px] h-[26px] rounded-[7px] bg-green flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7.5L5.5 11L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              Worklit
            </a>
            <p className="text-[13px] text-[oklch(56%_0.014_130)] leading-[1.6]">Scope approval for freelancers who want to get paid for what they agreed to.</p>
            <p className="mt-4 text-xs text-[oklch(42%_0.016_140)] italic">Built for freelancers, by freelancers.</p>
          </div>
          <div className="flex gap-16 max-[960px]:flex-wrap max-[960px]:gap-8">
            <div className="flex flex-col gap-3">
              <div className="text-xs font-semibold tracking-[0.08em] uppercase text-[oklch(48%_0.018_140)] mb-1">Product</div>
              <a href="#how" className="text-[13px] text-[oklch(58%_0.014_130)] no-underline transition-colors duration-150 hover:text-text-inv">How it works</a>
              <a href="#features" className="text-[13px] text-[oklch(58%_0.014_130)] no-underline transition-colors duration-150 hover:text-text-inv">Features</a>
              <a href="#pricing" className="text-[13px] text-[oklch(58%_0.014_130)] no-underline transition-colors duration-150 hover:text-text-inv">Pricing</a>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xs font-semibold tracking-[0.08em] uppercase text-[oklch(48%_0.018_140)] mb-1">Company</div>
              <a href="#" className="text-[13px] text-[oklch(58%_0.014_130)] no-underline transition-colors duration-150 hover:text-text-inv">Blog</a>
              <a href="#" className="text-[13px] text-[oklch(58%_0.014_130)] no-underline transition-colors duration-150 hover:text-text-inv">Contact</a>
              <a href="#" className="text-[13px] text-[oklch(58%_0.014_130)] no-underline transition-colors duration-150 hover:text-text-inv">Privacy</a>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-7 text-xs text-[oklch(40%_0.014_140)] max-[960px]:flex-col max-[960px]:gap-2 max-[960px]:text-center">
          <span>© 2026 Worklit. All rights reserved.</span>
          <span>worklit.app</span>
        </div>
      </div>
    </footer>
  );
}

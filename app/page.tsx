import { FinalCta } from "../components/landing/final-cta";
import { Footer } from "../components/landing/footer";
import { Hero } from "../components/landing/hero";
import { HowItWorks } from "../components/landing/how-it-works";
import { Nav } from "../components/landing/nav";
import { Pricing } from "../components/landing/pricing";
import { ProblemSection } from "../components/landing/problem-section";
import { ProductPreview } from "../components/landing/product-preview";
import { RevealObserver } from "../components/landing/reveal-observer";
import { Testimonials } from "../components/landing/testimonials";

export default function Home() {
  return (
    <div className="worklit-marketing">
      <RevealObserver />
      <Nav />
      <Hero />
      <ProblemSection />
      <ProductPreview />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCta />
      <Footer />
    </div>
  );
}

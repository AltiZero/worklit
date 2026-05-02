import { Features } from "../components/landing/features";
import { Footer } from "../components/landing/footer";
import { Hero } from "../components/landing/hero";
import { HowItWorks } from "../components/landing/how-it-works";
import { Nav } from "../components/landing/nav";
import { Pricing } from "../components/landing/pricing";
import { ProblemSection } from "../components/landing/problem-section";
import { RevealObserver } from "../components/landing/reveal-observer";

export default function Home() {
  return (
    <>
      <RevealObserver />
      <Nav />
      <Hero />
      <HowItWorks />
      <ProblemSection />
      <Features />
      <Pricing />
      <Footer />
    </>
  );
}

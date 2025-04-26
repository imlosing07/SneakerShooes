import HeroSection from "./components/Hero";
import DynamicShoesCarousel from "./components/ProductSection";
import CasualShoesSection from "./components/CasualShoesSection";
import FAQSection from "./components/faq";
import ProcessSection from "./components/ProcessTestimonialsFooter";
import TestimonialsSection from "./components/ProcessTestimonialsFooter";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <DynamicShoesCarousel />
      <CasualShoesSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}

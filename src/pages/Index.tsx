import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import NumbersShowcase from "@/components/landing/NumbersShowcase";
import TestimonialsCarousel from "@/components/landing/TestimonialsCarousel";
import PricingSection from "@/components/landing/PricingSection";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Language switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-1 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 p-1">
        {[
          { code: "it", flag: "🇮🇹" },
          { code: "en", flag: "🇬🇧" },
        ].map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              i18n.language?.startsWith(lang.code)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang.flag}
          </button>
        ))}
      </div>

      <Hero />
      <Features />
      <NumbersShowcase />
      <PricingSection />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;

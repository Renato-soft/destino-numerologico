import { useState } from "react";
import HeroConversion from "@/components/conversion/HeroConversion";
import BenefitsAndPreview from "@/components/conversion/BenefitsAndPreview";
import EvolutionPath from "@/components/conversion/EvolutionPath";
import PricingConversion from "@/components/conversion/PricingConversion";
import DailyExperience from "@/components/conversion/DailyExperience";
import TestimonialsConversion from "@/components/conversion/TestimonialsConversion";
import AboutSection from "@/components/conversion/AboutSection";
import FAQSection from "@/components/conversion/FAQSection";
import FinalCTA from "@/components/conversion/FinalCTA";
import FooterConversion from "@/components/conversion/FooterConversion";

const LandingPage = () => {
  const [birthDate, setBirthDate] = useState("");

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroConversion birthDate={birthDate} setBirthDate={setBirthDate} />
      <BenefitsAndPreview />
      <EvolutionPath />
      <PricingConversion />
      <DailyExperience />
      <TestimonialsConversion />
      <AboutSection />
      <FAQSection />
      <FinalCTA birthDate={birthDate} setBirthDate={setBirthDate} />
      <FooterConversion />
    </div>
  );
};

export default LandingPage;

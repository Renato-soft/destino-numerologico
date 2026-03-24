import { useState } from "react";
import HeroConversion from "@/components/conversion/HeroConversion";
import InstantUnlock from "@/components/conversion/InstantUnlock";
import HowItWorks from "@/components/conversion/HowItWorks";
import Benefits from "@/components/conversion/Benefits";
import ResultPreview from "@/components/conversion/ResultPreview";
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
      <InstantUnlock />
      <HowItWorks />
      <Benefits />
      <ResultPreview />
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

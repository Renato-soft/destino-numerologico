import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import NumbersShowcase from "@/components/landing/NumbersShowcase";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <NumbersShowcase />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;

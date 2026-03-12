import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      <motion.div className="absolute top-20 left-10 text-primary/30" animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <Star className="w-8 h-8" fill="currentColor" />
      </motion.div>
      <motion.div className="absolute top-40 right-20 text-primary/20" animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
        <Sparkles className="w-12 h-12" />
      </motion.div>
      <motion.div className="absolute bottom-40 left-20 text-secondary/30" animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
        <div className="text-6xl font-display font-bold opacity-20">7</div>
      </motion.div>
      <motion.div className="absolute bottom-60 right-32 text-primary/20" animate={{ y: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <div className="text-5xl font-display font-bold opacity-20">11</div>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">{t("landing.badge")}</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="text-foreground">{t("landing.heroTitle1")}</span>
            <br />
            <span className="text-gradient-gold">{t("landing.heroTitle2")}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("landing.heroSubtitle")}
          </p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="cosmic" size="xl" className="group">
              <Link to="/auth">
                {t("landing.cta")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="cosmic-outline" size="xl">
              <a href="#features">{t("landing.learnMore")}</a>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { number: "9", label: t("landing.stat1") },
              { number: "3", label: t("landing.stat2") },
              { number: "∞", label: t("landing.stat3") },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <motion.div className="w-1.5 h-3 bg-primary rounded-full mt-2" animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

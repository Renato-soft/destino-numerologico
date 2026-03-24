import { motion } from "framer-motion";
import { Map, MessageCircle, ScrollText, Calendar, Sparkles, Compass, Users, Target, Home, Shirt } from "lucide-react";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Map, title: t("landing.feature1Title"), description: t("landing.feature1Desc") },
    { icon: Sparkles, title: t("landing.feature4Title"), description: t("landing.feature4Desc") },
    { icon: Compass, title: t("landing.feature7Title"), description: t("landing.feature7Desc") },
    { icon: Users, title: t("landing.feature8Title"), description: t("landing.feature8Desc") },
    { icon: Calendar, title: t("landing.feature5Title"), description: t("landing.feature5Desc") },
    { icon: Shirt, title: t("landing.feature9Title"), description: t("landing.feature9Desc") },
    { icon: MessageCircle, title: t("landing.feature2Title"), description: t("landing.feature2Desc") },
    { icon: ScrollText, title: t("landing.feature3Title"), description: t("landing.feature3Desc") },
    { icon: Target, title: t("landing.feature10Title"), description: t("landing.feature10Desc") },
    { icon: Home, title: t("landing.feature11Title"), description: t("landing.feature11Desc") },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 numerology-pattern opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">{t("landing.featuresLabel")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            {t("landing.featuresTitle1")}<br /><span className="text-gradient-gold">{t("landing.featuresTitle2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("landing.featuresSubtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (idx % 6) * 0.08 }}>
              <div className="group h-full p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-cosmic">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

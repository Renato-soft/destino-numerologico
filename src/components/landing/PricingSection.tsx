import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

const PricingSection = () => {
  const { t } = useTranslation();

  const subscriptionFeatures = [
    t("pricing.featureMap"),
    t("pricing.featurePersonalYear"),
    t("pricing.featurePillars"),
    t("pricing.featureDates"),
    t("pricing.featureChat"),
    t("pricing.featureOutfit"),
  ];

  const payPerUseFeatures = [
    t("pricing.featureBrand"),
    t("pricing.featureHouse"),
    t("pricing.featureCompatibility"),
    
  ];

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t("landing.pricingLabel")}
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            {t("landing.pricingTitle1")}{" "}
            <span className="text-gradient-gold">{t("landing.pricingTitle2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("landing.pricingSubtitle")}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Monthly Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border p-8 bg-gradient-to-b from-primary/10 to-accent/5 border-primary/40 shadow-cosmic"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold">
              {t("pricing.subscriptionTitle")}
            </div>

            <div className="flex items-center gap-4 mb-6 mt-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">€4,99</span>
                  <span className="text-muted-foreground">/{t("pricing.month")}</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {subscriptionFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button asChild variant="cosmic" className="w-full group">
              <Link to="/auth">
                {t("landing.pricingCta")}
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Pay-per-use */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border p-6 bg-card/50 border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
              <h3 className="font-display text-lg font-bold">{t("pricing.payPerUseSection")}</h3>
              <span className="text-muted-foreground text-sm">€2,00 {t("pricing.perUse")}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {payPerUseFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

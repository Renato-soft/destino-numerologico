import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Star, Crown, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const PricingSection = () => {
  const { t } = useTranslation();

  const plans = [
    {
      name: "Base",
      price: "4.99",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
      popular: false,
      oneTime: true,
      features: [
        { label: t("pricing.featureMap"), included: true },
        { label: t("pricing.featurePersonalYear"), included: true },
        { label: t("pricing.featurePillars"), included: false },
        { label: t("pricing.featureChat"), included: false },
      ],
    },
    {
      name: "Pro",
      price: "9.99",
      icon: Star,
      gradient: "from-primary to-accent",
      popular: true,
      features: [
        { label: t("pricing.featureMap"), included: true },
        { label: t("pricing.featureDailyAnalysis"), included: true },
        { label: t("pricing.featurePillars"), included: true },
        { label: t("pricing.featureCompatibility"), included: true },
        { label: t("pricing.featureDates"), included: true },
        { label: t("pricing.featureOutfit"), included: true },
      ],
    },
    {
      name: "Gold",
      price: "14.99",
      icon: Crown,
      gradient: "from-amber-500 to-yellow-600",
      popular: false,
      features: [
        { label: t("pricing.featureAdvancedReport"), included: true },
        { label: t("pricing.featureChat"), included: true },
        { label: t("pricing.featureBrand"), included: true },
        { label: t("pricing.featureHouse"), included: true },
        { label: t("landing.pricingEverything"), included: true },
      ],
    },
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

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.popular
                  ? "bg-gradient-to-b from-primary/10 to-accent/5 border-primary/40 shadow-cosmic scale-[1.02]"
                  : "bg-card/50 border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold">
                  {t("pricing.mostPopular")}
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                <plan.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2 mb-6">
                <span className="text-3xl font-bold">€{plan.price}</span>
                <span className="text-muted-foreground text-sm">
                  {plan.oneTime ? ` ${t("pricing.oneTime")}` : `/${t("pricing.month")}`}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.popular ? "cosmic" : "outline"}
                className="w-full group"
              >
                <Link to="/auth">
                  {t("landing.pricingCta")}
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

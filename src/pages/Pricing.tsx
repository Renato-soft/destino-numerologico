import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription, PLANS, PlanTier } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Check, X, Sparkles, ArrowLeft, Crown, Star, Zap,
  Map, Calendar, Users, Target, MessageCircle, ScrollText,
  Home, Compass, Shirt, BarChart3, Settings
} from "lucide-react";

const Pricing = () => {
  const { t } = useTranslation();
  const { tier: currentTier, subscribed, checkSubscription } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string, mode: string) => {
    setLoadingPlan(priceId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, mode },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: t("common.error"), description: err.message, variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: t("common.error"), description: err.message, variant: "destructive" });
    }
  };

  const outfitImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/user-photos/fullFront_1770544341609.png`;

  const plans = [
    {
      id: "base" as PlanTier,
      name: "Base",
      price: "4.99",
      priceId: PLANS.base.price_id,
      mode: PLANS.base.mode,
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
      popular: false,
      oneTime: true,
      features: [
        { icon: Map, label: t("pricing.featureMap"), included: true },
        { icon: BarChart3, label: t("pricing.featurePersonalYear"), included: true },
        { icon: Compass, label: t("pricing.featurePillars"), included: false },
        { icon: Users, label: t("pricing.featureCompatibility"), included: false },
        { icon: Calendar, label: t("pricing.featureDates"), included: false },
        { icon: Shirt, label: t("pricing.featureOutfit"), included: false },
        { icon: ScrollText, label: t("pricing.featureAdvancedReport"), included: false },
        { icon: MessageCircle, label: t("pricing.featureChat"), included: false },
        { icon: Target, label: t("pricing.featureBrand"), included: false },
        { icon: Home, label: t("pricing.featureHouse"), included: false },
      ],
    },
    {
      id: "pro" as PlanTier,
      name: "Pro",
      price: "9.99",
      priceId: PLANS.pro.price_id,
      mode: PLANS.pro.mode,
      icon: Star,
      gradient: "from-primary to-accent",
      popular: true,
      features: [
        { icon: Map, label: t("pricing.featureMap"), included: true },
        { icon: BarChart3, label: t("pricing.featureDailyAnalysis"), included: true },
        { icon: Compass, label: t("pricing.featurePillars"), included: true },
        { icon: Users, label: t("pricing.featureCompatibility"), included: true },
        { icon: Calendar, label: t("pricing.featureDates"), included: true },
        { icon: Shirt, label: t("pricing.featureOutfit"), included: true },
        { icon: ScrollText, label: t("pricing.featureAdvancedReport"), included: false },
        { icon: MessageCircle, label: t("pricing.featureChat"), included: false },
        { icon: Target, label: t("pricing.featureBrand"), included: false },
        { icon: Home, label: t("pricing.featureHouse"), included: false },
      ],
    },
    {
      id: "gold" as PlanTier,
      name: "Gold",
      price: "14.99",
      priceId: PLANS.gold.price_id,
      mode: PLANS.gold.mode,
      icon: Crown,
      gradient: "from-amber-500 to-yellow-600",
      popular: false,
      features: [
        { icon: Map, label: t("pricing.featureMap"), included: true },
        { icon: BarChart3, label: t("pricing.featureDailyAnalysis"), included: true },
        { icon: Calendar, label: t("pricing.featureHistory"), included: true },
        { icon: Compass, label: t("pricing.featurePillars"), included: true },
        { icon: Users, label: t("pricing.featureCompatibility"), included: true },
        { icon: Calendar, label: t("pricing.featureDates"), included: true },
        { icon: Shirt, label: t("pricing.featureOutfit"), included: true },
        { icon: ScrollText, label: t("pricing.featureAdvancedReport"), included: true },
        { icon: MessageCircle, label: t("pricing.featureChat"), included: true },
        { icon: Target, label: t("pricing.featureBrand"), included: true },
        { icon: Home, label: t("pricing.featureHouse"), included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold">{t("pricing.title")}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{t("pricing.headline")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("pricing.subtitle")}</p>
          <p className="text-sm text-muted-foreground mt-2">{t("pricing.freeTrialNote")}</p>
        </motion.div>

        {subscribed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <Button variant="outline" onClick={handleManageSubscription}>
              <Settings className="w-4 h-4 mr-2" />
              {t("pricing.manageSubscription")}
            </Button>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isCurrentPlan = currentTier === plan.id;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.popular
                    ? "border-primary/50 bg-gradient-to-b from-primary/10 to-transparent shadow-cosmic scale-105"
                    : "border-border/50 bg-card/50"
                } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold">
                    {t("pricing.mostPopular")}
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                    {t("pricing.currentPlan")}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">€{plan.price}</span>
                      <span className="text-muted-foreground text-sm">
                        {plan.oneTime ? ` ${t("pricing.oneTime")}` : `/${t("pricing.month")}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className={`flex items-center gap-3 text-sm ${!feature.included ? "opacity-40" : ""}`}>
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <feature.icon className="w-4 h-4 shrink-0" />
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>

                {/* Outfit preview for Pro plan */}
                {plan.id === "pro" && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-border/30 bg-gradient-to-br from-primary/10 to-accent/10 p-4 text-center">
                    <Shirt className="w-10 h-10 mx-auto text-primary mb-2" />
                    <p className="text-sm font-medium">{t("pricing.featureOutfit")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("pricing.outfitExample")}</p>
                  </div>
                )}

                <Button
                  variant={plan.popular ? "cosmic" : "outline"}
                  className="w-full"
                  disabled={isCurrentPlan || !!loadingPlan}
                  onClick={() => handleSubscribe(plan.priceId, plan.mode || "subscription")}
                >
                  {loadingPlan === plan.priceId
                    ? t("common.loading")
                    : isCurrentPlan
                    ? t("pricing.currentPlan")
                    : t("pricing.subscribe")}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Pricing;

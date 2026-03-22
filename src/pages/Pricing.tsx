import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription, PLAN, PAY_PER_USE } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Check, Sparkles, ArrowLeft, Crown, Star,
  Map, Calendar, Users, Target, MessageCircle, ScrollText,
  Home, Compass, Shirt, BarChart3, Settings, ShoppingCart
} from "lucide-react";

const Pricing = () => {
  const { t } = useTranslation();
  const { subscribed, checkSubscription, hasPayPerUsePurchase } = useSubscription();
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

  const subscriptionFeatures = [
    { icon: Map, label: t("pricing.featureMap") },
    { icon: BarChart3, label: t("pricing.featurePersonalYear") },
    { icon: Compass, label: t("pricing.featurePillars") },
    { icon: Calendar, label: t("pricing.featureDates") },
    { icon: MessageCircle, label: t("pricing.featureChat") },
    { icon: Shirt, label: t("pricing.featureOutfit") },
  ];

  const payPerUseFeatures = [
    { key: "brand" as const, icon: Target, label: t("pricing.featureBrand") },
    { key: "house" as const, icon: Home, label: t("pricing.featureHouse") },
    { key: "compatibility" as const, icon: Users, label: t("pricing.featureCompatibility") },
    { key: "advancedReport" as const, icon: ScrollText, label: t("pricing.featureAdvancedReport") },
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

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Monthly Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-2xl border p-8 border-primary/50 bg-gradient-to-b from-primary/10 to-transparent shadow-cosmic ${subscribed ? "ring-2 ring-green-500" : ""}`}
          >
            {subscribed && (
              <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                {t("pricing.currentPlan")}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">{t("pricing.subscriptionTitle")}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">€4,99</span>
                  <span className="text-muted-foreground">/{t("pricing.month")}</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {subscriptionFeatures.map((feature) => (
                <div key={feature.label} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <feature.icon className="w-4 h-4 shrink-0" />
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>

            <Button
              variant="cosmic"
              className="w-full sm:w-auto"
              disabled={subscribed || !!loadingPlan}
              onClick={() => handleSubscribe(PLAN.price_id, "subscription")}
            >
              {loadingPlan === PLAN.price_id
                ? t("common.loading")
                : subscribed
                ? t("pricing.currentPlan")
                : t("pricing.subscribe")}
            </Button>
          </motion.div>

          {/* Pay-per-use section */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
              {t("pricing.payPerUseSection")}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {payPerUseFeatures.map((feature) => {
                const info = PAY_PER_USE[feature.key];
                const purchased = hasPayPerUsePurchase(feature.key);
                return (
                  <div
                    key={feature.key}
                    className={`rounded-xl border p-5 bg-card/50 border-border/50 flex flex-col ${purchased ? "ring-1 ring-green-500/50" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{feature.label}</h4>
                        <span className="text-lg font-bold">€2,00</span>
                        <span className="text-muted-foreground text-xs ml-1">{t("pricing.perUse")}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto"
                      disabled={purchased || !!loadingPlan}
                      onClick={() => handleSubscribe(info.price_id, "payment")}
                    >
                      {loadingPlan === info.price_id
                        ? t("common.loading")
                        : purchased
                        ? t("pricing.purchased")
                        : t("pricing.buyNow")}
                    </Button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;

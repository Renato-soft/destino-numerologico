import { useSubscription, PAY_PER_USE } from "@/hooks/useSubscription";
import { useFeatureSchedule, ROUTE_TO_FEATURE } from "@/hooks/useFeatureSchedule";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Crown, ShoppingCart, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  route: string;
}

const ProtectedRoute = ({ children, route }: ProtectedRouteProps) => {
  const { canAccess, isPayPerUse, getPayPerUseFeature, canUseFreeRequest, incrementFreeRequests, subscribed, loading } = useSubscription();
  const { isFeatureUnlocked, getDaysRemaining, loading: scheduleLoading } = useFeatureSchedule();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [usedFreePass, setUsedFreePass] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  if (loading || scheduleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Check feature schedule first (time-based unlock)
  const featureKey = ROUTE_TO_FEATURE[route];
  if (featureKey && !isFeatureUnlocked(featureKey)) {
    const daysLeft = getDaysRemaining(featureKey);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold">Disponibile tra {daysLeft} giorn{daysLeft === 1 ? "o" : "i"}</h2>
          <p className="text-muted-foreground">
            Questa funzionalità si sbloccherà automaticamente. Continua a esplorare le altre sezioni nel frattempo!
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-semibold">{daysLeft} giorn{daysLeft === 1 ? "o" : "i"} rimanent{daysLeft === 1 ? "e" : "i"}</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Torna alla dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (canAccess(route) || usedFreePass) {
    return <>{children}</>;
  }

  // Pay-per-use feature: offer purchase
  const ppuFeature = getPayPerUseFeature(route);
  if (ppuFeature) {
    const featureInfo = PAY_PER_USE[ppuFeature];
    const handlePurchase = async () => {
      setPurchasing(true);
      try {
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { priceId: featureInfo.price_id, mode: "payment" },
        });
        if (error) throw error;
        if (data?.url) window.open(data.url, "_blank");
      } catch (err: any) {
        toast({ title: t("common.error"), description: err.message, variant: "destructive" });
      } finally {
        setPurchasing(false);
      }
    };

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="font-display text-2xl font-bold">{t("pricing.payPerUseTitle")}</h2>
          <p className="text-muted-foreground">{t("pricing.payPerUseDesc")}</p>
          <p className="text-2xl font-bold">€{featureInfo.price.toFixed(2)}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="cosmic" onClick={handlePurchase} disabled={purchasing}>
              {purchasing ? t("common.loading") : t("pricing.buyNow")}
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              {t("common.back")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Subscription-only route: not subscribed
  if (!subscribed) {
    // Allow free trial
    if (canUseFreeRequest()) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold">{t("pricing.freeTrialTitle")}</h2>
            <p className="text-muted-foreground">{t("pricing.freeTrialDesc")}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="cosmic" onClick={() => { incrementFreeRequests(); setUsedFreePass(true); }}>
                {t("pricing.useFreeRequest")}
              </Button>
              <Button variant="outline" onClick={() => navigate("/pricing")}>
                {t("pricing.viewPlans")}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold">{t("pricing.upgradeRequired")}</h2>
          <p className="text-muted-foreground">{t("pricing.subscribeToAccess")}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="cosmic" onClick={() => navigate("/pricing")}>
              {t("pricing.viewPlans")}
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              {t("common.back")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

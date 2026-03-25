import { useSubscription, PAY_PER_USE, TRIAL_PPU, UNLOCK_ALL } from "@/hooks/useSubscription";
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
  const {
    canAccess, subscribed, loading, isInTrial, isTrialExpired,
    getPayPerUseFeature, getTrialPPUFeature, hasPayPerUsePurchase, fullAccess
  } = useSubscription();
  const { isFeatureUnlocked, getDaysRemaining, loading: scheduleLoading } = useFeatureSchedule();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [purchasing, setPurchasing] = useState(false);

  if (loading || scheduleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Check feature schedule (time-based unlock)
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
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Torna alla dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Full access or already purchased
  if (canAccess(route)) {
    return <>{children}</>;
  }

  // PPU feature: offer purchase
  const ppuFeature = getPayPerUseFeature(route);
  const trialPpuFeature = getTrialPPUFeature(route);
  const featureToSell = ppuFeature || trialPpuFeature;

  if (featureToSell) {
    const featureInfo = (PAY_PER_USE as any)[featureToSell] || (TRIAL_PPU as any)[featureToSell];
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
          <h2 className="font-display text-2xl font-bold">Sblocca questo servizio</h2>
          <p className="text-muted-foreground">Acquista l'accesso a questo servizio per €{featureInfo.price.toFixed(2)}</p>
          <p className="text-2xl font-bold">€{featureInfo.price.toFixed(2)}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="cosmic" onClick={handlePurchase} disabled={purchasing}>
              {purchasing ? t("common.loading") : "Acquista ora"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              {t("common.back")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Trial expired or not subscribed: prompt subscription
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="font-display text-2xl font-bold">
          {isTrialExpired() ? "Prova gratuita scaduta" : "Abbonamento richiesto"}
        </h2>
        <p className="text-muted-foreground">
          {isTrialExpired()
            ? "La tua prova gratuita di 24 ore è terminata. Abbonati per continuare ad accedere a tutti i servizi!"
            : "Questo servizio richiede un abbonamento attivo."}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="cosmic" onClick={() => navigate("/pricing")}>
            <Crown className="w-4 h-4 mr-2" />
            Vedi i piani
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            {t("common.back")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;

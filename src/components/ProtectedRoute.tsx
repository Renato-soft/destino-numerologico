import { useSubscription, PAY_PER_USE, TRIAL_PPU, UNLOCK_ALL } from "@/hooks/useSubscription";
import { useFeatureSchedule, ROUTE_TO_FEATURE } from "@/hooks/useFeatureSchedule";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Crown, ShoppingCart, Clock, Timer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  route: string;
}

// Routes that use the 24h access model
const PPU_24H_ROUTES = ["/brand", "/house", "/compatibility", "/dates"];

function CountdownTimer({ expiryDate }: { expiryDate: Date }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = expiryDate.getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Scaduto");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm">
      <Timer className="w-4 h-4 text-primary" />
      <span className="text-muted-foreground">Accesso attivo — scade tra:</span>
      <span className="font-mono font-bold text-primary">{remaining}</span>
    </div>
  );
}

const ProtectedRoute = ({ children, route }: ProtectedRouteProps) => {
  const {
    canAccess, subscribed, loading, isInTrial, isTrialExpired,
    getPayPerUseFeature, getTrialPPUFeature, hasPayPerUsePurchase, fullAccess,
    getActivePurchaseExpiry,
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

  // During trial, free routes bypass feature schedule
  const isFreeInTrial = isInTrial() && ["/chat"].includes(route);

  // Check feature schedule (time-based unlock) — skip for trial free routes
  const featureKey = ROUTE_TO_FEATURE[route];
  if (!isFreeInTrial && featureKey && !isFeatureUnlocked(featureKey)) {
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

  // For 24h PPU routes, check if there's an active purchase and show countdown
  if (PPU_24H_ROUTES.includes(route)) {
    const feature = getPayPerUseFeature(route);
    if (feature) {
      const expiry = getActivePurchaseExpiry(feature);
      
      if (expiry) {
        // Active purchase — render children with countdown banner
        return (
          <div className="flex flex-col min-h-screen">
            <div className="flex justify-center p-3 border-b border-border/50 bg-background/80 backdrop-blur">
              <CountdownTimer expiryDate={expiry} />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        );
      }

      // No active purchase — show payment wall
      const featureInfo = PAY_PER_USE[feature];
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
            <h2 className="font-display text-2xl font-bold">Servizio a pagamento</h2>
            <p className="text-muted-foreground">
              Acquista l'accesso per 24 ore a questo servizio
            </p>
            <p className="text-3xl font-bold text-primary">€1,99</p>
            <p className="text-xs text-muted-foreground">
              L'accesso sarà attivo per 24 ore dal momento del pagamento
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="cosmic" onClick={handlePurchase} disabled={purchasing} className="min-w-[160px]">
                {purchasing ? t("common.loading") : "Paga €1,99"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                {t("common.back")}
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Full access or already purchased
  if (canAccess(route)) {
    return <>{children}</>;
  }

  // PPU feature (non-24h, like map): offer purchase
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

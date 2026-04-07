import { useSubscription, PAY_PER_USE, TRIAL_PPU, UNLOCK_ALL } from "@/hooks/useSubscription";
import { useFeatureSchedule, ROUTE_TO_FEATURE } from "@/hooks/useFeatureSchedule";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Crown, ShoppingCart, Clock, Timer, Target, Home, Users, Calendar, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  route: string;
}

const PPU_24H_ROUTES = ["/brand", "/house", "/compatibility", "/dates"];

const ROUTE_TITLES: Record<string, string> = {
  "/brand": "Analizzatore Brand",
  "/house": "Vibrazione Casa",
  "/compatibility": "Compatibilità",
  "/dates": "Date Favorevoli",
  "/map": "Mappa Numerologica",
  "/chat": "Chat con l'Esperto",
  "/personal-year": "Anno Personale",
  "/pillars": "Pilastri della Crescita",
  "/community": "Community",
  "/profile": "Profilo",
};

interface ServiceInfo {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
}

const SERVICE_INFO: Record<string, ServiceInfo> = {
  "/brand": {
    icon: Target,
    title: "Analizzatore Vibrazione Brand",
    subtitle: "Scopri l'energia nascosta nel nome del tuo futuro brand",
    description: "Analizza la vibrazione numerologica di nomi aziendali, progetti o prodotti. Calcola il numero principale e verifica la compatibilità con il tuo numero del Destino e con obiettivi specifici come Successo Economico, Innovazione e Leadership.",
    benefits: [
      "Calcolo della vibrazione numerologica del nome",
      "Compatibilità con il tuo numero del Destino",
      "Analisi per obiettivi strategici (successo, creatività, stabilità)",
      "Suggerimenti di nomi alternativi più allineati",
    ],
  },
  "/house": {
    icon: Home,
    title: "Vibrazione Casa",
    subtitle: "L'energia del luogo in cui vivi influenza la tua vita",
    description: "Ogni indirizzo possiede una vibrazione unica che influenza chi lo abita. Scopri se la tua casa è in armonia con la tua energia personale, analizzando il numero civico, il piano e la compatibilità con il tuo percorso di vita.",
    benefits: [
      "Calcolo della vibrazione del tuo indirizzo",
      "Analisi dell'influenza del piano in cui vivi",
      "Compatibilità tra la casa e il tuo numero del Destino",
      "Consigli per armonizzare l'energia del tuo spazio",
    ],
  },
  "/compatibility": {
    icon: Users,
    title: "Compatibilità Numerologica",
    subtitle: "Quanto siete allineati? Scoprilo con i numeri",
    description: "Analizza la compatibilità tra due persone su più livelli: sentimentale, comunicativo, lavorativo e spirituale. Ottieni un quadro completo della dinamica di coppia con grafici radar e consigli personalizzati per rafforzare il legame.",
    benefits: [
      "Analisi su 5 dimensioni: amore, comunicazione, lavoro, sfide, crescita",
      "Grafico radar della compatibilità su tutte le dimensioni",
      "Descrizione dettagliata di sfide, potenziale di crescita e dinamica",
      "Confronto numero a numero con spiegazioni + Report PDF",
    ],
  },
  "/dates": {
    icon: Calendar,
    title: "Date Favorevoli",
    subtitle: "Pianifica le tue giornate in armonia con i numeri",
    description: "Non tutti i giorni hanno la stessa energia per te. Questo strumento analizza le vibrazioni dei prossimi giorni in base al tuo anno personale, indicandoti le date più favorevoli per decisioni importanti, incontri, viaggi o nuovi inizi.",
    benefits: [
      "Analisi vibrazionale dei prossimi 30 giorni",
      "Filtro per tipo di attività (lavoro, amore, creatività, viaggi, studio, casa, relazioni)",
      "Spiegazione dettagliata della vibrazione di ogni giornata",
      "Indicazione delle attività ideali e da evitare per ogni data",
    ],
  },
};

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

function ServicePreview({ route, onPurchase, purchasing }: { route: string; onPurchase: () => void; purchasing: boolean }) {
  const { t } = useTranslation();
  const info = SERVICE_INFO[route];
  if (!info) return null;

  const Icon = info.icon;

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold">{info.title}</h2>
          <p className="text-lg text-muted-foreground">{info.subtitle}</p>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-6 space-y-4">
          <p className="text-foreground/90 leading-relaxed">{info.description}</p>
          
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cosa include</h3>
            <ul className="space-y-2">
              {info.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <p className="text-sm text-muted-foreground">Accesso per 24 ore</p>
          <p className="text-4xl font-bold text-primary">€1,99</p>
          <p className="text-xs text-muted-foreground">
            L'accesso sarà attivo per 24 ore dal momento del pagamento
          </p>
          <Button variant="cosmic" onClick={onPurchase} disabled={purchasing} className="min-w-[200px] mt-2">
            {purchasing ? t("common.loading") : "Sblocca per €1,99"}
          </Button>
        </div>
      </div>
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

  const pageTitle = ROUTE_TITLES[route] || "";

  if (loading || scheduleLoading) {
    return (
      <DashboardLayout title={pageTitle}>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  // Admin full access or service overrides — skip all checks
  if (fullAccess || canAccess(route)) {
    // For feature schedule, still check unless fullAccess
    const isFreeInTrial = isInTrial() && ["/chat"].includes(route);
    const featureKey = ROUTE_TO_FEATURE[route];
    if (!fullAccess && !isFreeInTrial && featureKey && !isFeatureUnlocked(featureKey)) {
      const daysLeft = getDaysRemaining(featureKey);
      return (
        <DashboardLayout title={pageTitle}>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-md text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold">Disponibile tra {daysLeft} giorn{daysLeft === 1 ? "o" : "i"}</h2>
              <p className="text-muted-foreground">
                Questa funzionalità si sbloccherà automaticamente. Continua a esplorare le altre sezioni nel frattempo!
              </p>
            </div>
          </div>
        </DashboardLayout>
      );
    }
    return <>{children}</>;
  }

  const isFreeInTrial = isInTrial() && ["/chat"].includes(route);

  // For 24h PPU routes
  if (PPU_24H_ROUTES.includes(route)) {
    const feature = getPayPerUseFeature(route);
    if (feature) {
      const expiry = getActivePurchaseExpiry(feature);
      
      if (expiry) {
        return <>{children}</>;
      }

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
        <DashboardLayout title={pageTitle}>
          <ServicePreview route={route} onPurchase={handlePurchase} purchasing={purchasing} />
        </DashboardLayout>
      );
    }
  }

  // Feature schedule check for non-access users
  const featureKey2 = ROUTE_TO_FEATURE[route];
  if (!isFreeInTrial && featureKey2 && !isFeatureUnlocked(featureKey2)) {
    const daysLeft = getDaysRemaining(featureKey2);
    return (
      <DashboardLayout title={pageTitle}>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold">Disponibile tra {daysLeft} giorn{daysLeft === 1 ? "o" : "i"}</h2>
            <p className="text-muted-foreground">
              Questa funzionalità si sbloccherà automaticamente. Continua a esplorare le altre sezioni nel frattempo!
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // PPU feature (non-24h, like map)
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
      <DashboardLayout title={pageTitle}>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold">Sblocca questo servizio</h2>
            <p className="text-muted-foreground">Acquista l'accesso a questo servizio per €{featureInfo.price.toFixed(2)}</p>
            <p className="text-2xl font-bold">€{featureInfo.price.toFixed(2)}</p>
            <Button variant="cosmic" onClick={handlePurchase} disabled={purchasing}>
              {purchasing ? t("common.loading") : "Acquista ora"}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Trial expired or not subscribed
  return (
    <DashboardLayout title={pageTitle}>
      <div className="flex-1 flex items-center justify-center p-4">
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
          <Button variant="cosmic" onClick={() => navigate("/pricing")}>
            <Crown className="w-4 h-4 mr-2" />
            Vedi i piani
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProtectedRoute;

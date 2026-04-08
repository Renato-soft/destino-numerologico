import { useState, useEffect } from "react";
import { usePromotion, getPromoServices } from "@/hooks/usePromotion";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Crown, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/** Banner shown in the dashboard area when user has an active promotion */
export function DashboardPromotionBanner() {
  const { userPromotion, isPromotionActive, promotionRemainingMs, isPromotionExpired, activePromotion } = usePromotion();
  const { subscribed, checkSubscription } = useSubscription();
  const [remaining, setRemaining] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!userPromotion) return;
    const update = () => setRemaining(promotionRemainingMs());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [userPromotion, promotionRemainingMs]);

  // When promotion expires, delete map and refresh subscription
  useEffect(() => {
    if (isPromotionExpired() && !subscribed) {
      // Delete user's numerology map
      (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from("numerology_maps").delete().eq("user_id", session.user.id);
        }
      })();
      checkSubscription();
    }
  }, [isPromotionExpired, subscribed, checkSubscription]);

  if (!userPromotion || dismissed || subscribed) return null;

  if (isPromotionExpired()) {
    return (
      <div className="mx-4 md:mx-8 mt-4 rounded-xl border-2 border-destructive/30 bg-destructive/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">La tua promo è scaduta!</p>
            <p className="text-xs text-muted-foreground">Abbonati per continuare a usare tutti i servizi.</p>
          </div>
        </div>
        <Button asChild variant="cosmic" size="sm">
          <Link to="/pricing">
            <Crown className="w-4 h-4 mr-1" />
            Abbonati ora
          </Link>
        </Button>
      </div>
    );
  }

  if (isPromotionActive()) {
    return (
      <div className="mx-4 md:mx-8 mt-4 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {activePromotion?.title || "Promozione attiva"} — Accesso gratuito!
            </p>
            <p className="text-xs text-muted-foreground">
              {(() => {
                const svc = getPromoServices(activePromotion);
                const labels: Record<string, string> = { map: "Mappa", chat: "Chat", daily_analysis: "Analisi del Giorno", outfits: "Outfit" };
                return svc.map(s => labels[s] || s).join(", ") + " gratuiti per te.";
              })()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background/60 rounded-lg px-3 py-1.5 border border-primary/20">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-bold text-primary">{formatTime(remaining)}</span>
          </div>
          <Button asChild variant="cosmic" size="sm">
            <Link to="/pricing">
              <Crown className="w-4 h-4 mr-1" />
              Abbonati
            </Link>
          </Button>
          <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/** Banner shown on the landing page when a promotion is active */
export function LandingPromotionBanner() {
  const [promo, setPromo] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("promotions" as any)
      .select("*")
      .eq("is_active", true)
      .order("activated_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setPromo(data[0]);
      });
  }, []);

  if (!promo) return null;

  return (
    <div className="w-full bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground py-3 px-4 text-center relative z-30">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm sm:text-base">
            🎉 {promo.title || "Promozione speciale"} — {promo.duration_hours}h di accesso gratuito!
          </span>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
        >
          <Link to="/auth?mode=signup">
            Registrati gratis ora
          </Link>
        </Button>
      </div>
      {promo.description && (
        <p className="text-xs mt-1 opacity-90">{promo.description}</p>
      )}
    </div>
  );
}

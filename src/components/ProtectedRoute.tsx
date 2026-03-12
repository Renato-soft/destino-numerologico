import { useSubscription, PlanTier } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProtectedRouteProps {
  children: React.ReactNode;
  route: string;
}

const TIER_LABELS: Record<PlanTier, string> = {
  free: "Free",
  base: "Base",
  pro: "Pro",
  gold: "Gold",
};

const ProtectedRoute = ({ children, route }: ProtectedRouteProps) => {
  const { canAccess, getRequiredTier, canUseFreeRequest, incrementFreeRequests, loading, tier } = useSubscription();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [usedFreePass, setUsedFreePass] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (canAccess(route) || usedFreePass) {
    return <>{children}</>;
  }

  // Allow free trial usage
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
            <Button
              variant="cosmic"
              onClick={() => {
                incrementFreeRequests();
                setUsedFreePass(true);
              }}
            >
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

  const requiredTier = getRequiredTier(route);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="font-display text-2xl font-bold">{t("pricing.upgradeRequired")}</h2>
        <p className="text-muted-foreground">
          {t("pricing.upgradeRequiredDesc", { plan: TIER_LABELS[requiredTier] })}
        </p>
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
};

export default ProtectedRoute;

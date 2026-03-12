import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export const PLANS = {
  base: {
    product_id: "prod_U8ShObzMBDIryb",
    price_id: "price_1TABmSQVJRFR5c8XjmLRp3C5",
    price: 4.99,
    mode: "payment" as const,
  },
  pro: {
    product_id: "prod_U8RADr9rcx9fsv",
    price_id: "price_1TAAIdQVJRFR5c8XDEqKCJnY",
    price: 9.99,
    mode: "subscription" as const,
  },
  gold: {
    product_id: "prod_U8ReMeQZ3qtLHN",
    price_id: "price_1TAAl6QVJRFR5c8XIdug0N0I",
    price: 14.99,
    mode: "subscription" as const,
  },
} as const;

export type PlanTier = "free" | "base" | "pro" | "gold";

// Feature access map
const FEATURE_ACCESS: Record<string, PlanTier> = {
  "/map": "base",
  "/history": "pro",
  "/pillars": "pro",
  "/compatibility": "pro",
  "/dates": "pro",
  "/chat": "gold",
  "/advanced-report": "gold",
  "/brand": "gold",
  "/house": "gold",
};

const TIER_HIERARCHY: PlanTier[] = ["free", "base", "pro", "gold"];

interface SubscriptionState {
  subscribed: boolean;
  tier: PlanTier;
  subscriptionEnd: string | null;
  loading: boolean;
  freeRequestsUsed: number;
}

interface SubscriptionContextType extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  canAccess: (route: string) => boolean;
  getRequiredTier: (route: string) => PlanTier;
  canUseFreeRequest: () => boolean;
  incrementFreeRequests: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

function getTierFromProductId(productId: string | null): PlanTier {
  if (!productId) return "free";
  if (productId === PLANS.gold.product_id) return "gold";
  if (productId === PLANS.pro.product_id) return "pro";
  if (productId === PLANS.base.product_id) return "base";
  return "free";
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    tier: "free",
    subscriptionEnd: null,
    loading: true,
    freeRequestsUsed: parseInt(localStorage.getItem("free_requests_used") || "0", 10),
  });

  const checkSubscription = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState(prev => ({ ...prev, subscribed: false, tier: "free", loading: false }));
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;

      const tier = getTierFromProductId(data.product_id);
      setState(prev => ({
        ...prev,
        subscribed: data.subscribed,
        tier,
        subscriptionEnd: data.subscription_end,
        loading: false,
      }));
    } catch (err) {
      console.error("Error checking subscription:", err);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    checkSubscription();
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const canAccess = useCallback((route: string): boolean => {
    const requiredTier = FEATURE_ACCESS[route] || "free";
    const currentIndex = TIER_HIERARCHY.indexOf(state.tier);
    const requiredIndex = TIER_HIERARCHY.indexOf(requiredTier);
    return currentIndex >= requiredIndex;
  }, [state.tier]);

  const getRequiredTier = useCallback((route: string): PlanTier => {
    return FEATURE_ACCESS[route] || "free";
  }, []);

  const canUseFreeRequest = useCallback(() => {
    return state.tier === "free" && state.freeRequestsUsed < 2;
  }, [state.tier, state.freeRequestsUsed]);

  const incrementFreeRequests = useCallback(() => {
    setState(prev => {
      const newCount = prev.freeRequestsUsed + 1;
      localStorage.setItem("free_requests_used", newCount.toString());
      return { ...prev, freeRequestsUsed: newCount };
    });
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      ...state,
      checkSubscription,
      canAccess,
      getRequiredTier,
      canUseFreeRequest,
      incrementFreeRequests,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}

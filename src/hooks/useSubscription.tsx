import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// Single monthly subscription
export const PLAN = {
  product_id: "prod_UC8lYk5YrO4Yqs",
  price_id: "price_1TDkU2QYqblmeN5938H6Ngdh",
  price: 4.99,
  mode: "subscription" as const,
};

// Pay-per-use features (€2 each)
export const PAY_PER_USE = {
  brand: {
    product_id: "prod_UC8lN3jvcAjuzY",
    price_id: "price_1TDkUNQYqblmeN595nGv1zB9",
    price: 2.0,
    route: "/brand",
  },
  house: {
    product_id: "prod_UC8mJfdxp6RpW1",
    price_id: "price_1TDkUhQYqblmeN591f3H6jz9",
    price: 2.0,
    route: "/house",
  },
  compatibility: {
    product_id: "prod_UC8mkojnoUFaIT",
    price_id: "price_1TDkV1QYqblmeN59W8daDqfv",
    price: 2.0,
    route: "/compatibility",
  },
  advancedReport: {
    product_id: "prod_UC8mCVkYDpgclN",
    price_id: "price_1TDkVKQYqblmeN59aDjwfbTs",
    price: 2.0,
    route: "/advanced-report",
  },
} as const;

export type PayPerUseFeature = keyof typeof PAY_PER_USE;

// Routes included in subscription
const SUBSCRIPTION_ROUTES = ["/map", "/personal-year", "/pillars", "/dates", "/chat", "/community", "/profile"];

// Routes that are pay-per-use
const PAY_PER_USE_ROUTES: Record<string, PayPerUseFeature> = {
  "/brand": "brand",
  "/house": "house",
  "/compatibility": "compatibility",
  "/advanced-report": "advancedReport",
};

interface SubscriptionState {
  subscribed: boolean;
  fullAccess: boolean; // manual override – bypasses all checks
  subscriptionEnd: string | null;
  loading: boolean;
  freeRequestsUsed: number;
  payPerUsePurchases: string[]; // product_ids purchased
}

interface SubscriptionContextType extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  canAccess: (route: string) => boolean;
  isPayPerUse: (route: string) => boolean;
  getPayPerUseFeature: (route: string) => PayPerUseFeature | null;
  hasPayPerUsePurchase: (feature: PayPerUseFeature) => boolean;
  canUseFreeRequest: () => boolean;
  incrementFreeRequests: () => void;
  refreshPayPerUsePurchases: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    subscriptionEnd: null,
    loading: true,
    freeRequestsUsed: 0,
    payPerUsePurchases: [],
  });

  const refreshPayPerUsePurchases = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("pay_per_use_purchases")
      .select("product_id")
      .eq("user_id", session.user.id);

    if (data) {
      setState(prev => ({ ...prev, payPerUsePurchases: data.map(p => p.product_id) }));
    }
  }, []);

  const checkSubscription = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState(prev => ({ ...prev, subscribed: false, loading: false, freeRequestsUsed: 0, payPerUsePurchases: [] }));
        return;
      }

      const userKey = `free_requests_used_${session.user.id}`;
      const usedCount = parseInt(localStorage.getItem(userKey) || "0", 10);

      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;

      setState(prev => ({
        ...prev,
        subscribed: data.subscribed,
        subscriptionEnd: data.subscription_end,
        loading: false,
        freeRequestsUsed: usedCount,
      }));

      // Also load pay-per-use purchases
      const { data: ppuData } = await supabase
        .from("pay_per_use_purchases")
        .select("product_id")
        .eq("user_id", session.user.id);

      if (ppuData) {
        setState(prev => ({ ...prev, payPerUsePurchases: ppuData.map(p => p.product_id) }));
      }
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
    // Subscription routes require active sub
    if (SUBSCRIPTION_ROUTES.includes(route) || route === "/map") {
      return state.subscribed;
    }
    // Pay-per-use routes require either sub + purchase, or just purchase
    const ppuFeature = PAY_PER_USE_ROUTES[route];
    if (ppuFeature) {
      const productId = PAY_PER_USE[ppuFeature].product_id;
      return state.payPerUsePurchases.includes(productId);
    }
    return true;
  }, [state.subscribed, state.payPerUsePurchases]);

  const isPayPerUse = useCallback((route: string): boolean => {
    return route in PAY_PER_USE_ROUTES;
  }, []);

  const getPayPerUseFeature = useCallback((route: string): PayPerUseFeature | null => {
    return PAY_PER_USE_ROUTES[route] || null;
  }, []);

  const hasPayPerUsePurchase = useCallback((feature: PayPerUseFeature): boolean => {
    return state.payPerUsePurchases.includes(PAY_PER_USE[feature].product_id);
  }, [state.payPerUsePurchases]);

  const canUseFreeRequest = useCallback(() => {
    return !state.subscribed && state.freeRequestsUsed < 2;
  }, [state.subscribed, state.freeRequestsUsed]);

  const incrementFreeRequests = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userKey = session?.user?.id ? `free_requests_used_${session.user.id}` : "free_requests_used";
    setState(prev => {
      const newCount = prev.freeRequestsUsed + 1;
      localStorage.setItem(userKey, newCount.toString());
      return { ...prev, freeRequestsUsed: newCount };
    });
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      ...state,
      checkSubscription,
      canAccess,
      isPayPerUse,
      getPayPerUseFeature,
      hasPayPerUsePurchase,
      canUseFreeRequest,
      incrementFreeRequests,
      refreshPayPerUsePurchases,
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

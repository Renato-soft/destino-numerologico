import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// Monthly subscription
export const PLAN = {
  product_id: "prod_UDOGRjZ732JeQE",
  price_id: "price_1TExUBAD91QoshNxsggizR9i",
  price: 4.99,
  mode: "subscription" as const,
};

// One-time unlock all PPU services
export const UNLOCK_ALL = {
  product_id: "prod_UDOHs7QVee5CLc",
  price_id: "price_1TExUVAD91QoshNxkdJ9rWWg",
  price: 9.99,
  mode: "payment" as const,
};

// Pay-per-use features (€1.99 each, 24h access)
export const PAY_PER_USE = {
  brand: {
    product_id: "prod_UDOHQBseMWWyFG",
    price_id: "price_1TExUzAD91QoshNxWhjs9fYd",
    price: 1.99,
    route: "/brand",
  },
  house: {
    product_id: "prod_UDOHFvU32YplQC",
    price_id: "price_1TExVFAD91QoshNxYEcyOuqT",
    price: 1.99,
    route: "/house",
  },
  compatibility: {
    product_id: "prod_UDOIgkWNAAyvic",
    price_id: "price_1TExVoAD91QoshNx4VrbqB0l",
    price: 1.99,
    route: "/compatibility",
  },
  dates: {
    product_id: "prod_UDOInKYIUMKr0m",
    price_id: "price_1TExW7AD91QoshNx0euel2rL",
    price: 1.99,
    route: "/dates",
  },
  map: {
    product_id: "prod_UDOI89LlThJOD5",
    price_id: "price_1TExWNAD91QoshNx3TSmt6S7",
    price: 1.99,
    route: "/map",
  },
} as const;

export type PayPerUseFeature = keyof typeof PAY_PER_USE;

export const TRIAL_PPU = {} as const;
export type TrialPPUFeature = keyof typeof TRIAL_PPU;

// Routes FREE during 24h trial (removed /dates — always PPU now)
const TRIAL_FREE_ROUTES = ["/chat"];

// Routes included in subscription (post-trial)
const SUBSCRIPTION_ROUTES = ["/map", "/personal-year", "/pillars", "/chat", "/community", "/profile"];

// Routes always pay-per-use with 24h expiry
const PAY_PER_USE_ROUTES: Record<string, PayPerUseFeature> = {
  "/brand": "brand",
  "/house": "house",
  "/compatibility": "compatibility",
  "/dates": "dates",
  "/map": "map",
};

// 24h PPU routes (these expire 24h after purchase)
const PPU_24H_ROUTES = ["/brand", "/house", "/compatibility", "/dates"];

const TRIAL_PPU_ROUTES: Record<string, TrialPPUFeature> = {};

const TRIAL_DURATION_MS = 24 * 60 * 60 * 1000;
const PPU_ACCESS_DURATION_MS = 24 * 60 * 60 * 1000; // 24h access window

interface PurchaseRecord {
  product_id: string;
  created_at: string;
}

interface SubscriptionState {
  subscribed: boolean;
  fullAccess: boolean;
  subscriptionEnd: string | null;
  loading: boolean;
  payPerUsePurchases: PurchaseRecord[];
  profileCreatedAt: string | null;
  hasUnlockAll: boolean;
  serviceOverrides: string[];
}

interface SubscriptionContextType extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  canAccess: (route: string) => boolean;
  isInTrial: () => boolean;
  isTrialExpired: () => boolean;
  trialRemainingMs: () => number;
  isPayPerUse: (route: string) => boolean;
  getPayPerUseFeature: (route: string) => PayPerUseFeature | null;
  getTrialPPUFeature: (route: string) => TrialPPUFeature | null;
  hasPayPerUsePurchase: (feature: PayPerUseFeature | TrialPPUFeature) => boolean;
  getActivePurchaseExpiry: (feature: PayPerUseFeature) => Date | null;
  refreshPayPerUsePurchases: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    fullAccess: false,
    subscriptionEnd: null,
    loading: true,
    payPerUsePurchases: [],
    profileCreatedAt: null,
    hasUnlockAll: false,
  });

  const refreshPayPerUsePurchases = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase
      .from("pay_per_use_purchases")
      .select("product_id, created_at")
      .eq("user_id", session.user.id);
    if (data) {
      const unlockAllProduct = UNLOCK_ALL.product_id;
      setState(prev => ({
        ...prev,
        payPerUsePurchases: data as PurchaseRecord[],
        hasUnlockAll: data.some(p => p.product_id === unlockAllProduct),
      }));
    }
  }, []);

  const checkSubscription = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState(prev => ({ ...prev, subscribed: false, fullAccess: false, loading: false, payPerUsePurchases: [], profileCreatedAt: null, hasUnlockAll: false }));
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;

      const { data: ppuData } = await supabase
        .from("pay_per_use_purchases")
        .select("product_id, created_at")
        .eq("user_id", session.user.id);

      const purchases = (ppuData || []) as PurchaseRecord[];

      setState(prev => ({
        ...prev,
        subscribed: data.subscribed,
        fullAccess: !!data.full_access,
        subscriptionEnd: data.subscription_end,
        loading: false,
        profileCreatedAt: profileData?.created_at || null,
        payPerUsePurchases: purchases,
        hasUnlockAll: purchases.some(p => p.product_id === UNLOCK_ALL.product_id),
      }));
    } catch (err) {
      console.error("Error checking subscription:", err);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    checkSubscription();
    const interval = setInterval(checkSubscription, 60000);
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        checkSubscription();
      }
    });
    return () => { clearInterval(interval); authSub.unsubscribe(); };
  }, [checkSubscription]);

  const isInTrial = useCallback((): boolean => {
    if (!state.profileCreatedAt) return false;
    const created = new Date(state.profileCreatedAt).getTime();
    return Date.now() - created < TRIAL_DURATION_MS;
  }, [state.profileCreatedAt]);

  const isTrialExpired = useCallback((): boolean => {
    if (!state.profileCreatedAt) return false;
    const created = new Date(state.profileCreatedAt).getTime();
    return Date.now() - created >= TRIAL_DURATION_MS;
  }, [state.profileCreatedAt]);

  const trialRemainingMs = useCallback((): number => {
    if (!state.profileCreatedAt) return 0;
    const created = new Date(state.profileCreatedAt).getTime();
    return Math.max(0, TRIAL_DURATION_MS - (Date.now() - created));
  }, [state.profileCreatedAt]);

  // Get the expiry date of the most recent active purchase for a PPU feature
  const getActivePurchaseExpiry = useCallback((feature: PayPerUseFeature): Date | null => {
    const ppu = PAY_PER_USE[feature];
    if (!ppu) return null;
    
    // Find the most recent purchase for this product
    const purchases = state.payPerUsePurchases
      .filter(p => p.product_id === ppu.product_id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    if (purchases.length === 0) return null;
    
    const purchaseTime = new Date(purchases[0].created_at).getTime();
    const expiryTime = purchaseTime + PPU_ACCESS_DURATION_MS;
    
    // Only return if still active
    if (Date.now() < expiryTime) {
      return new Date(expiryTime);
    }
    return null;
  }, [state.payPerUsePurchases]);

  const hasPayPerUsePurchase = useCallback((feature: PayPerUseFeature | TrialPPUFeature): boolean => {
    if (state.hasUnlockAll && feature in PAY_PER_USE) return true;
    
    const ppu = (PAY_PER_USE as any)[feature];
    if (!ppu) return false;
    
    const route = ppu.route;
    
    // For 24h routes, check expiry
    if (PPU_24H_ROUTES.includes(route)) {
      return getActivePurchaseExpiry(feature as PayPerUseFeature) !== null;
    }
    
    // For non-24h routes (like map), just check if purchased
    return state.payPerUsePurchases.some(p => p.product_id === ppu.product_id);
  }, [state.payPerUsePurchases, state.hasUnlockAll, getActivePurchaseExpiry]);

  const canAccess = useCallback((route: string): boolean => {
    if (state.fullAccess) return true;

    // 24h PPU routes: always require active (non-expired) purchase
    if (PPU_24H_ROUTES.includes(route)) {
      if (state.hasUnlockAll) return true;
      const feature = PAY_PER_USE_ROUTES[route];
      if (!feature) return false;
      return getActivePurchaseExpiry(feature) !== null;
    }

    // Other PPU routes (map)
    if (route in PAY_PER_USE_ROUTES) {
      if (state.hasUnlockAll) return true;
      if (route === "/map" && state.subscribed) return true;
      const feature = PAY_PER_USE_ROUTES[route];
      const productId = PAY_PER_USE[feature].product_id;
      if (state.payPerUsePurchases.some(p => p.product_id === productId)) return true;
      return false;
    }

    // During trial, free routes
    if (isInTrial() && TRIAL_FREE_ROUTES.includes(route)) return true;

    // Subscription routes
    if (SUBSCRIPTION_ROUTES.includes(route)) {
      return state.subscribed;
    }

    return true;
  }, [state.subscribed, state.fullAccess, state.payPerUsePurchases, state.hasUnlockAll, isInTrial, getActivePurchaseExpiry]);

  const isPayPerUse = useCallback((route: string): boolean => {
    return route in PAY_PER_USE_ROUTES;
  }, []);

  const getPayPerUseFeature = useCallback((route: string): PayPerUseFeature | null => {
    return PAY_PER_USE_ROUTES[route] || null;
  }, []);

  const getTrialPPUFeature = useCallback((route: string): TrialPPUFeature | null => {
    return TRIAL_PPU_ROUTES[route] || null;
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      ...state,
      checkSubscription,
      canAccess,
      isInTrial,
      isTrialExpired,
      trialRemainingMs,
      isPayPerUse,
      getPayPerUseFeature,
      getTrialPPUFeature,
      hasPayPerUsePurchase,
      getActivePurchaseExpiry,
      refreshPayPerUsePurchases,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

const DEFAULT_SUBSCRIPTION: SubscriptionContextType = {
  subscribed: false,
  fullAccess: false,
  subscriptionEnd: null,
  loading: true,
  payPerUsePurchases: [],
  profileCreatedAt: null,
  hasUnlockAll: false,
  checkSubscription: async () => {},
  canAccess: () => false,
  isInTrial: () => false,
  isTrialExpired: () => false,
  trialRemainingMs: () => 0,
  isPayPerUse: () => false,
  getPayPerUseFeature: () => null,
  getTrialPPUFeature: () => null,
  hasPayPerUsePurchase: () => false,
  getActivePurchaseExpiry: () => null,
  refreshPayPerUsePurchases: async () => {},
};

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  return ctx ?? DEFAULT_SUBSCRIPTION;
}

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// Monthly subscription
export const PLAN = {
  product_id: "prod_UC8lYk5YrO4Yqs",
  price_id: "price_1TDkU2QYqblmeN5938H6Ngdh",
  price: 4.99,
  mode: "subscription" as const,
};

// One-time unlock all PPU services
export const UNLOCK_ALL = {
  product_id: "prod_UDIt7ZtgNla3sI",
  price_id: "price_1TEsI5QYqblmeN59kIS5yCSY",
  price: 9.99,
  mode: "payment" as const,
};

// Pay-per-use features (€1.99 each)
export const PAY_PER_USE = {
  brand: {
    product_id: "prod_UC8lN3jvcAjuzY",
    price_id: "price_1TDkUNQYqblmeN595nGv1zB9",
    price: 1.99,
    route: "/brand",
  },
  house: {
    product_id: "prod_UC8mJfdxp6RpW1",
    price_id: "price_1TDkUhQYqblmeN591f3H6jz9",
    price: 1.99,
    route: "/house",
  },
  compatibility: {
    product_id: "prod_UC8mkojnoUFaIT",
    price_id: "price_1TDkV1QYqblmeN59W8daDqfv",
    price: 1.99,
    route: "/compatibility",
  },
  dates: {
    product_id: "prod_UDIwNAEoaAu2Vy",
    price_id: "price_1TEsKqQYqblmeN59BQcf9mdm",
    price: 1.99,
    route: "/dates",
  },
  map: {
    product_id: "prod_UDJZwi1ePtlJsM",
    price_id: "price_1TEswAQYqblmeN59vbNWz1QO",
    price: 1.99,
    route: "/map",
  },
} as const;

export type PayPerUseFeature = keyof typeof PAY_PER_USE;

// Trial PPU: services available once at €1.99 during 24h trial
export const TRIAL_PPU = {
  advancedReport: {
    product_id: "prod_UC8mCVkYDpgclN",
    price_id: "price_1TDkVKQYqblmeN59aDjwfbTs",
    price: 1.99,
    route: "/advanced-report",
  },
} as const;

export type TrialPPUFeature = keyof typeof TRIAL_PPU;

// Routes FREE during 24h trial
const TRIAL_FREE_ROUTES = ["/chat", "/dates"];

// Routes included in subscription (post-trial)
const SUBSCRIPTION_ROUTES = ["/map", "/personal-year", "/pillars", "/chat", "/community", "/profile", "/advanced-report"];

// Routes always pay-per-use (post-trial)
const PAY_PER_USE_ROUTES: Record<string, PayPerUseFeature> = {
  "/brand": "brand",
  "/house": "house",
  "/compatibility": "compatibility",
  "/dates": "dates",
  "/map": "map",
};

// Routes that are PPU only during trial
const TRIAL_PPU_ROUTES: Record<string, TrialPPUFeature> = {
  "/advanced-report": "advancedReport",
};

const TRIAL_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface SubscriptionState {
  subscribed: boolean;
  fullAccess: boolean;
  subscriptionEnd: string | null;
  loading: boolean;
  payPerUsePurchases: string[];
  profileCreatedAt: string | null;
  hasUnlockAll: boolean;
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
      .select("product_id")
      .eq("user_id", session.user.id);
    if (data) {
      const products = data.map(p => p.product_id);
      setState(prev => ({
        ...prev,
        payPerUsePurchases: products,
        hasUnlockAll: products.includes(UNLOCK_ALL.product_id),
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

      // Load profile created_at for trial calculation
      const { data: profileData } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;

      // Load PPU purchases
      const { data: ppuData } = await supabase
        .from("pay_per_use_purchases")
        .select("product_id")
        .eq("user_id", session.user.id);

      const products = ppuData?.map(p => p.product_id) || [];

      setState(prev => ({
        ...prev,
        subscribed: data.subscribed,
        fullAccess: !!data.full_access,
        subscriptionEnd: data.subscription_end,
        loading: false,
        profileCreatedAt: profileData?.created_at || null,
        payPerUsePurchases: products,
        hasUnlockAll: products.includes(UNLOCK_ALL.product_id),
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

  const canAccess = useCallback((route: string): boolean => {
    if (state.fullAccess) return true;

    // Always-PPU routes: accessible if purchased or unlock-all
    if (route in PAY_PER_USE_ROUTES) {
      if (state.hasUnlockAll) return true;
      // Map is included in subscription
      if (route === "/map" && state.subscribed) return true;
      const feature = PAY_PER_USE_ROUTES[route];
      const productId = PAY_PER_USE[feature].product_id;
      if (state.payPerUsePurchases.includes(productId)) return true;
      // During trial, dates and chat are free
      if (isInTrial() && TRIAL_FREE_ROUTES.includes(route)) return true;
      return false;
    }

    // Trial-only PPU routes (e.g. advanced-report during trial)
    if (route in TRIAL_PPU_ROUTES && isInTrial()) {
      const feature = TRIAL_PPU_ROUTES[route];
      const productId = TRIAL_PPU[feature].product_id;
      return state.payPerUsePurchases.includes(productId);
    }

    // During trial, free routes
    if (isInTrial() && TRIAL_FREE_ROUTES.includes(route)) return true;

    // Subscription routes
    if (SUBSCRIPTION_ROUTES.includes(route)) {
      return state.subscribed;
    }

    // Dashboard-only features (analisi giorno, outfit) - handled by trial or subscription
    return true;
  }, [state.subscribed, state.fullAccess, state.payPerUsePurchases, state.hasUnlockAll, isInTrial]);

  const isPayPerUse = useCallback((route: string): boolean => {
    return route in PAY_PER_USE_ROUTES;
  }, []);

  const getPayPerUseFeature = useCallback((route: string): PayPerUseFeature | null => {
    return PAY_PER_USE_ROUTES[route] || null;
  }, []);

  const getTrialPPUFeature = useCallback((route: string): TrialPPUFeature | null => {
    return TRIAL_PPU_ROUTES[route] || null;
  }, []);

  const hasPayPerUsePurchase = useCallback((feature: PayPerUseFeature | TrialPPUFeature): boolean => {
    if (state.hasUnlockAll && feature in PAY_PER_USE) return true;
    const ppu = (PAY_PER_USE as any)[feature] || (TRIAL_PPU as any)[feature];
    return ppu ? state.payPerUsePurchases.includes(ppu.product_id) : false;
  }, [state.payPerUsePurchases, state.hasUnlockAll]);

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
  refreshPayPerUsePurchases: async () => {},
};

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  return ctx ?? DEFAULT_SUBSCRIPTION;
}

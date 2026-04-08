import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  duration_hours: number;
  is_active: boolean;
  activated_at: string | null;
  created_at: string;
}

interface UserPromotion {
  id: string;
  promotion_id: string;
  claimed_at: string;
  expires_at: string;
}

interface PromotionContextType {
  activePromotion: Promotion | null;
  userPromotion: UserPromotion | null;
  loading: boolean;
  claimPromotion: () => Promise<boolean>;
  isPromotionActive: () => boolean;
  promotionRemainingMs: () => number;
  isPromotionExpired: () => boolean;
  refresh: () => Promise<void>;
}

const PromotionContext = createContext<PromotionContextType | null>(null);

// Promotion covers these services only
export const PROMO_SERVICES = ["map", "chat", "daily_analysis", "outfits"];

export function PromotionProvider({ children }: { children: ReactNode }) {
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);
  const [userPromotion, setUserPromotion] = useState<UserPromotion | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      // Load active promotion (public - no auth needed for landing page)
      const { data: promos } = await supabase
        .from("promotions" as any)
        .select("*")
        .eq("is_active", true)
        .order("activated_at", { ascending: false })
        .limit(1);

      const promo = promos && promos.length > 0 ? (promos[0] as any as Promotion) : null;
      setActivePromotion(promo);

      // Load user's claim if logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session && promo) {
        const { data: claims } = await supabase
          .from("user_promotions" as any)
          .select("*")
          .eq("promotion_id", promo.id)
          .limit(1);

        if (claims && claims.length > 0) {
          setUserPromotion(claims[0] as any as UserPromotion);
        } else {
          setUserPromotion(null);
        }
      } else {
        setUserPromotion(null);
      }
    } catch (e) {
      console.error("Error loading promotion:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const claimPromotion = useCallback(async (): Promise<boolean> => {
    if (!activePromotion) return false;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const expiresAt = new Date(Date.now() + activePromotion.duration_hours * 60 * 60 * 1000).toISOString();

    const { error } = await supabase.from("user_promotions" as any).insert({
      user_id: session.user.id,
      promotion_id: activePromotion.id,
      expires_at: expiresAt,
    } as any);

    if (error) {
      // Already claimed (unique constraint)
      if (error.code === "23505") return false;
      console.error("Claim error:", error);
      return false;
    }

    await loadData();
    return true;
  }, [activePromotion, loadData]);

  const isPromotionActive = useCallback((): boolean => {
    if (!userPromotion) return false;
    return new Date(userPromotion.expires_at).getTime() > Date.now();
  }, [userPromotion]);

  const promotionRemainingMs = useCallback((): number => {
    if (!userPromotion) return 0;
    return Math.max(0, new Date(userPromotion.expires_at).getTime() - Date.now());
  }, [userPromotion]);

  const isPromotionExpired = useCallback((): boolean => {
    if (!userPromotion) return false;
    return new Date(userPromotion.expires_at).getTime() <= Date.now();
  }, [userPromotion]);

  return (
    <PromotionContext.Provider value={{
      activePromotion,
      userPromotion,
      loading,
      claimPromotion,
      isPromotionActive,
      promotionRemainingMs,
      isPromotionExpired,
      refresh: loadData,
    }}>
      {children}
    </PromotionContext.Provider>
  );
}

export function usePromotion() {
  const ctx = useContext(PromotionContext);
  if (!ctx) throw new Error("usePromotion must be used within PromotionProvider");
  return ctx;
}

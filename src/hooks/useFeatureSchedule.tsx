import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FeatureScheduleItem {
  feature_key: string;
  feature_label: string;
  unlock_after_days: number;
  enabled: boolean;
}

interface FeatureScheduleContextType {
  schedule: FeatureScheduleItem[];
  loading: boolean;
  userCreatedAt: string | null;
  isFeatureUnlocked: (featureKey: string) => boolean;
  getDaysRemaining: (featureKey: string) => number;
  getFeatureByRoute: (route: string) => FeatureScheduleItem | null;
  refresh: () => Promise<void>;
}

const ROUTE_TO_FEATURE: Record<string, string> = {
  "/personal-year": "personal_year",
  "/pillars": "pillars",
  "/dates": "dates",
  "/chat": "chat",
  "/community": "community",
  "/brand": "brand",
  "/house": "house",
  "/compatibility": "compatibility",
  "/advanced-report": "advanced_report",
  "/map": "map",
};

const FeatureScheduleContext = createContext<FeatureScheduleContextType | null>(null);

export function FeatureScheduleProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<FeatureScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);
  const [bypassSchedule, setBypassSchedule] = useState(false);

  const BYPASS_EMAILS = ["regnew01@gmail.com", "maria732008@live.it"];

  const loadSchedule = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      if (BYPASS_EMAILS.includes(session.user.email || "")) {
        setBypassSchedule(true);
      }

      const [scheduleResult, profileResult] = await Promise.all([
        supabase.from("feature_schedule" as any).select("feature_key, feature_label, unlock_after_days, enabled"),
        supabase.from("profiles").select("created_at").eq("user_id", session.user.id).maybeSingle(),
      ]);

      if (scheduleResult.data) {
        setSchedule(scheduleResult.data as any[]);
      }
      if (profileResult.data) {
        setUserCreatedAt((profileResult.data as any).created_at);
      }
    } catch (e) {
      console.error("Error loading feature schedule:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const isFeatureUnlocked = useCallback((featureKey: string): boolean => {
    const feature = schedule.find(f => f.feature_key === featureKey);
    if (!feature) return true; // unknown features are unlocked by default
    if (!feature.enabled) return false;
    if (feature.unlock_after_days === 0) return true;
    if (!userCreatedAt) return false;

    const created = new Date(userCreatedAt);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCreation >= feature.unlock_after_days;
  }, [schedule, userCreatedAt]);

  const getDaysRemaining = useCallback((featureKey: string): number => {
    const feature = schedule.find(f => f.feature_key === featureKey);
    if (!feature || feature.unlock_after_days === 0) return 0;
    if (!userCreatedAt) return feature.unlock_after_days;

    const created = new Date(userCreatedAt);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, feature.unlock_after_days - daysSinceCreation);
  }, [schedule, userCreatedAt]);

  const getFeatureByRoute = useCallback((route: string): FeatureScheduleItem | null => {
    const featureKey = ROUTE_TO_FEATURE[route];
    if (!featureKey) return null;
    return schedule.find(f => f.feature_key === featureKey) || null;
  }, [schedule]);

  return (
    <FeatureScheduleContext.Provider value={{
      schedule,
      loading,
      userCreatedAt,
      isFeatureUnlocked,
      getDaysRemaining,
      getFeatureByRoute,
      refresh: loadSchedule,
    }}>
      {children}
    </FeatureScheduleContext.Provider>
  );
}

export function useFeatureSchedule() {
  const ctx = useContext(FeatureScheduleContext);
  if (!ctx) throw new Error("useFeatureSchedule must be used within FeatureScheduleProvider");
  return ctx;
}

export { ROUTE_TO_FEATURE };

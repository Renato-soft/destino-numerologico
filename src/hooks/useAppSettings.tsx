import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type PaymentMode = "subscription" | "free";

interface AppSettingsContextType {
  paymentMode: PaymentMode;
  loading: boolean;
  isFreeMode: boolean;
  refresh: () => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("subscription");
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("app_settings" as any)
        .select("setting_value")
        .eq("setting_key", "payment_mode")
        .maybeSingle();
      if (data) {
        setPaymentMode((data as any).setting_value as PaymentMode);
      }
    } catch (e) {
      console.error("Error loading app settings:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <AppSettingsContext.Provider value={{
      paymentMode,
      loading,
      isFreeMode: paymentMode === "free",
      refresh: loadSettings,
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    return { paymentMode: "subscription" as PaymentMode, loading: true, isFreeMode: false, refresh: async () => {} };
  }
  return ctx;
}

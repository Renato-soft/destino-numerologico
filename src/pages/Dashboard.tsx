import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Crown, Clock, Users,
} from "lucide-react";
import DailyAnalysis from "@/components/DailyAnalysis";
import DailyOutfits from "@/components/DailyOutfits";
import SimplifiedMiniMap from "@/components/SimplifiedMiniMap";
import { calculateLifePath, calculatePersonalYear } from "@/lib/numerology";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/useSubscription";
import { useFeatureSchedule } from "@/hooks/useFeatureSchedule";
import DashboardLayout from "@/components/DashboardLayout";
import { LogOut } from "lucide-react";

interface Profile {
  nome: string;
  cognome: string;
  birth_date: string;
}

interface NumerologyMap {
  id: string;
  life_path: number;
  destiny_expression: number;
  soul: number;
  personality: number;
  personal_year: number;
  created_at: string;
}

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestMap, setLatestMap] = useState<NumerologyMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    subscribed, loading: subLoading, refreshPayPerUsePurchases, checkSubscription,
    isInTrial, isTrialExpired, trialRemainingMs
  } = useSubscription();
  const { isFeatureUnlocked } = useFeatureSchedule();
  const [searchParams, setSearchParams] = useSearchParams();
  const [todayPostCount, setTodayPostCount] = useState(0);

  useEffect(() => {
    const fetchTodayPosts = async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("community_posts")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());
      setTodayPostCount(count || 0);
    };
    fetchTodayPosts();
  }, []);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUserEmail(session.user.email || null);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("nome, cognome, birth_date, language")
        .eq("user_id", session.user.id)
        .maybeSingle() as any;

      if (profileError) console.error("Error loading profile:", profileError);
      if (!profileData || !profileData.nome) { navigate("/onboarding"); return; }

      if (profileData.language && profileData.language !== i18n.language) {
        i18n.changeLanguage(profileData.language);
      }

      setProfile(profileData);

      const { data: mapData } = await supabase
        .from("numerology_maps")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (mapData) setLatestMap(mapData);
      setLoading(false);
    };

    checkAuthAndLoadData();

    const purchaseSuccess = searchParams.get("purchase");
    const subscriptionSuccess = searchParams.get("subscription");
    if (purchaseSuccess === "success" || subscriptionSuccess === "success") {
      const priceId = searchParams.get("price_id");
      const handlePurchaseReturn = async () => {
        if (purchaseSuccess === "success" && priceId) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { PAY_PER_USE, TRIAL_PPU, UNLOCK_ALL } = await import("@/hooks/useSubscription");
            const allProducts = { ...PAY_PER_USE, ...TRIAL_PPU };
            const feature = Object.values(allProducts).find(f => f.price_id === priceId);
            const isUnlockAll = priceId === UNLOCK_ALL.price_id;
            if (feature) {
              await supabase.from("pay_per_use_purchases").insert({
                user_id: session.user.id,
                product_id: feature.product_id,
              });
            }
            if (isUnlockAll) {
              await supabase.from("pay_per_use_purchases").insert({
                user_id: session.user.id,
                product_id: UNLOCK_ALL.product_id,
              });
            }
            await refreshPayPerUsePurchases();
          }
        }
        if (subscriptionSuccess === "success") {
          await checkSubscription();
        }
        setSearchParams({}, { replace: true });
        toast({ title: "Acquisto completato!", description: "Il servizio è stato sbloccato con successo." });
      };
      handlePurchaseReturn();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate, i18n]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: t("dashboard.logoutSuccess"), description: t("dashboard.logoutSuccessDesc") });
    navigate("/");
  };

  if (loading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (isTrialExpired() && !subscribed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-center space-y-6 relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Crown className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold">La tua prova gratuita è scaduta</h2>
          <p className="text-muted-foreground">Hai esplorato il potere dei numeri! Ora scegli come continuare il tuo percorso.</p>
          <div className="space-y-3">
            <Button variant="cosmic" size="lg" className="w-full" onClick={() => navigate("/pricing")}>
              <Crown className="w-5 h-5 mr-2" />
              Abbonati a €4,99/mese
            </Button>
            
          </div>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              ← Home
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const trialActive = isInTrial();
  const trialMs = trialRemainingMs();
  const trialHours = Math.ceil(trialMs / (1000 * 60 * 60));

  const dailyAnalysisUnlocked = isFeatureUnlocked("daily_analysis");
  const outfitsUnlocked = isFeatureUnlocked("outfits");
  const showDailyContent = subscribed || trialActive;

  const headerTitle = (
    <>
      {t("dashboard.hello")} <span className="text-gradient-gold">{profile?.nome}</span> ✨
    </>
  );

  const communityButton = (
    <Button variant="ghost" size="icon" onClick={() => navigate("/community")} title="Community" className="relative">
      <Users className="w-5 h-5" />
      {todayPostCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
          {todayPostCount > 99 ? "99+" : todayPostCount}
        </span>
      )}
    </Button>
  );

  return (
    <DashboardLayout title={headerTitle as any} headerActions={communityButton}>
      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* Trial banner */}
        {trialActive && !subscribed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 p-4 flex items-center justify-between flex-wrap gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Prova gratuita attiva</p>
                <p className="text-xs text-muted-foreground">
                  Scade tra {trialHours} or{trialHours === 1 ? "a" : "e"} — Esplora i servizi gratuiti!
                </p>
              </div>
            </div>
            <Button variant="cosmic" size="sm" onClick={() => navigate("/pricing")}>
              Abbonati ora
            </Button>
          </motion.div>
        )}

        {/* Daily Analysis */}
        {latestMap && showDailyContent && dailyAnalysisUnlocked && (
          <DailyAnalysis personalYear={latestMap.personal_year} lifePath={latestMap.life_path} />
        )}

        {/* Simplified mini-map + analysis for trial users without full map */}
        {trialActive && !subscribed && !latestMap && profile && (() => {
          const [y, m, d] = profile.birth_date.split("-").map(Number);
          const trialLifePath = calculateLifePath(d, m, y);
          const trialPersonalYear = calculatePersonalYear(d, m, new Date().getFullYear());
          return (
            <>
              <SimplifiedMiniMap nome={profile.nome} cognome={profile.cognome} birthDate={profile.birth_date} />
              {dailyAnalysisUnlocked && <DailyAnalysis personalYear={trialPersonalYear} lifePath={trialLifePath} />}
            </>
          );
        })()}

        {/* Outfits */}
        {showDailyContent && outfitsUnlocked && <DailyOutfits />}

        {/* Numbers */}
        {latestMap && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-display text-xl font-semibold mb-4">{t("dashboard.yourNumbers")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: t("dashboard.destiny"), value: latestMap.life_path },
                { label: t("dashboard.self"), value: latestMap.destiny_expression },
                { label: t("dashboard.soul"), value: latestMap.soul },
                { label: t("dashboard.personality"), value: latestMap.personality },
                { label: t("dashboard.quintessence"), value: (() => { const s = latestMap.destiny_expression + latestMap.life_path; let r = s; while (r > 9 && r !== 11 && r !== 22) { r = r.toString().split('').reduce((a, d) => a + parseInt(d), 0); } return r; })() },
              ].map((item) => (
                <div key={item.label} className="glass-cosmic rounded-xl p-4 text-center">
                  <div className="number-circle mx-auto mb-2 w-12 h-12 text-xl">{item.value}</div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

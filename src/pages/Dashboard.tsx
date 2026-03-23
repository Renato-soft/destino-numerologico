import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, Map, MessageCircle, FileText, Calendar,
  User, Users, Target, Compass, ScrollText, LogOut, ChevronRight, Home, Crown, Lock, ShoppingCart
} from "lucide-react";
import DailyAnalysis from "@/components/DailyAnalysis";
import DailyOutfits from "@/components/DailyOutfits";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/useSubscription";
import { calculatePersonalYear } from "@/lib/numerology";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { canAccess, subscribed, isPayPerUse, hasPayPerUsePurchase, canUseFreeRequest, loading: subLoading, refreshPayPerUsePurchases, checkSubscription } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

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

    // Handle returning from purchase/subscription
    const purchaseSuccess = searchParams.get("purchase");
    const subscriptionSuccess = searchParams.get("subscription");
    if (purchaseSuccess === "success" || subscriptionSuccess === "success") {
      const priceId = searchParams.get("price_id");
      const handlePurchaseReturn = async () => {
        if (purchaseSuccess === "success" && priceId) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // Record pay-per-use purchase - find product_id from price_id
            const { PAY_PER_USE } = await import("@/hooks/useSubscription");
            const feature = Object.values(PAY_PER_USE).find(f => f.price_id === priceId);
            if (feature) {
              await supabase.from("pay_per_use_purchases").insert({
                user_id: session.user.id,
                product_id: feature.product_id,
              });
              await refreshPayPerUsePurchases();
            }
          }
        }
        if (subscriptionSuccess === "success") {
          await checkSubscription();
        }
        setSearchParams({}, { replace: true });
        toast({ title: "Acquisto completato!", description: "Grazie per il tuo acquisto." });
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

  // Free users who have exhausted free requests must pay
  if (!subscribed && !canUseFreeRequest()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-center space-y-6 relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Crown className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold">{t("pricing.upgradeRequired")}</h2>
          <p className="text-muted-foreground">
            Hai esaurito le prove gratuite. Abbonati per continuare ad accedere a tutti i servizi.
          </p>
          <Button variant="cosmic" size="lg" onClick={() => navigate("/pricing")}>
            <Crown className="w-5 h-5 mr-2" />
            Abbonati ora — €4,99/mese
          </Button>
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

  const PAY_PER_USE_ROUTES = ["/brand", "/house", "/compatibility", "/advanced-report"];

  const quickActions = [
    // Pricing
    { title: t("pricing.title"), description: t("pricing.subtitle"), icon: Crown, href: "/pricing", color: "from-amber-500 to-yellow-600", primary: true },
    // Subscription services
    { title: t("dashboard.generateMap"), description: t("dashboard.generateMapDesc"), icon: Map, href: "/map", color: "from-primary to-accent" },
    { title: t("dashboard.personalYear", { year: new Date().getFullYear() }), description: t("dashboard.personalYearDesc"), icon: Calendar, href: "/personal-year", color: "from-orange-500 to-amber-500" },
    { title: t("dashboard.pillars"), description: t("dashboard.pillarsDesc"), icon: Compass, href: "/pillars", color: "from-fuchsia-500 to-purple-600" },
    { title: t("dashboard.favorableDates"), description: t("dashboard.favorableDatesDesc"), icon: Calendar, href: "/dates", color: "from-amber-500 to-orange-500" },
    { title: t("dashboard.chat"), description: t("dashboard.chatDesc"), icon: MessageCircle, href: "/chat", color: "from-secondary to-purple-500" },
    // Pay-per-use
    { title: t("dashboard.advancedReport"), description: "€2,00 " + t("pricing.perUse"), icon: ScrollText, href: "/advanced-report", color: "from-amber-600 to-yellow-700", payPerUse: true },
    { title: t("dashboard.brandAnalyzer"), description: "€2,00 " + t("pricing.perUse"), icon: Target, href: "/brand", color: "from-violet-500 to-fuchsia-500", payPerUse: true },
    { title: t("dashboard.houseVibration"), description: "€2,00 " + t("pricing.perUse"), icon: Home, href: "/house", color: "from-cyan-500 to-sky-500", payPerUse: true },
    { title: t("dashboard.compatibility"), description: "€2,00 " + t("pricing.perUse"), icon: Users, href: "/compatibility", color: "from-pink-500 to-rose-500", payPerUse: true },
    // Other
    { title: t("dashboard.community"), description: t("dashboard.communityDesc"), icon: MessageCircle, href: "/community", color: "from-indigo-500 to-purple-500" },
    { description: t("dashboard.profileDesc"), icon: User, href: "/profile", color: "from-blue-500 to-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold hidden sm:block">{t("common.appName")}</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden md:block">
              {t("dashboard.hello")} <span className="text-foreground font-medium">{profile?.nome}</span>
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {t("dashboard.welcome").split("<1>")[0]}
            <span className="text-gradient-gold">{profile?.nome}</span>
            {t("dashboard.welcome").split("</1>")[1] || ""}
          </h1>
          <p className="text-muted-foreground text-lg">{t("dashboard.explore")}</p>
        </motion.section>

        {latestMap && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
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

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display text-xl font-semibold mb-4">{t("dashboard.quickActions")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div key={action.title || action.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
                <Link to={action.href}>
                  <div className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-cosmic ${action.primary ? "bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 hover:border-primary/50" : "bg-card/50 border-border/50 hover:border-primary/30"}`}>
                    {action.payPerUse && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 border text-[10px] px-2 py-0.5 gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          €2
                        </Badge>
                      </div>
                    )}
                    {!action.payPerUse && !action.primary && !subscribed && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary/20 text-primary border-primary/30 border text-[10px] px-2 py-0.5 gap-1">
                          <Lock className="w-3 h-3" />
                          PRO
                        </Badge>
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    {action.title && (
                      <h3 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
                        {action.title}
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h3>
                    )}
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;

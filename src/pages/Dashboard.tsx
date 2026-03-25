import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Map, MessageCircle, Calendar,
  User, Users, Target, Compass, ScrollText, LogOut, ChevronRight, Home, Crown, Lock, ShoppingCart, Shield, Clock, Check
} from "lucide-react";
import DailyAnalysis from "@/components/DailyAnalysis";
import DailyOutfits from "@/components/DailyOutfits";
import SimplifiedMiniMap from "@/components/SimplifiedMiniMap";
import { calculateLifePath, calculatePersonalYear } from "@/lib/numerology";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/useSubscription";
import { useFeatureSchedule } from "@/hooks/useFeatureSchedule";

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
    isInTrial, isTrialExpired, trialRemainingMs, hasUnlockAll
  } = useSubscription();
  const { isFeatureUnlocked, getDaysRemaining } = useFeatureSchedule();
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

  // Trial expired and not subscribed: show upgrade screen
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
            <p className="text-xs text-muted-foreground">oppure sblocca tutto a €9,99 una tantum</p>
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

  const FEATURE_KEY_MAP: Record<string, string> = {
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

  // Service cards with marketing descriptions
  const quickActions = [
    // Pricing CTA
    ...(!subscribed ? [{
      title: "Scegli il tuo piano",
      description: "Sblocca tutto il potere della numerologia",
      icon: Crown,
      href: "/pricing",
      color: "from-amber-500 to-yellow-600",
      primary: true,
      badge: null as string | null,
    }] : []),
    // Map
    ...(latestMap ? [] : [{
      title: "Mappa Numerologica",
      description: "Il tuo profilo numerologico completo in un'unica mappa personalizzata",
      icon: Map,
      href: "/map",
      color: "from-primary to-accent",
      badge: hasUnlockAll ? "SBLOCCATO" : subscribed ? "INCLUSO" : "€1,99",
      payPerUse: true,
      payPerUsePrice: "€1,99",
    }]),
    // Chat
    {
      title: "Chat con l'Esperto",
      description: "Fai domande e ricevi risposte personalizzate dalla tua guida numerologica AI",
      icon: MessageCircle,
      href: "/chat",
      color: "from-secondary to-purple-500",
      badge: trialActive && !subscribed ? "GRATIS" : subscribed ? "INCLUSO" : null,
    },
    // Date Favorevoli
    {
      title: "Date Favorevoli",
      description: "Scopri i giorni migliori per decisioni importanti, incontri e nuovi inizi",
      icon: Calendar,
      href: "/dates",
      color: "from-amber-500 to-orange-500",
      badge: trialActive && !subscribed ? "GRATIS" : null,
      payPerUse: !trialActive || subscribed ? false : false,
      payPerUsePrice: "€1,99",
      isAlwaysPPU: true,
    },
    // Anno Personale
    {
      title: "Anno Personale " + new Date().getFullYear(),
      description: "Le energie e le opportunità che ti aspettano quest'anno",
      icon: Calendar,
      href: "/personal-year",
      color: "from-orange-500 to-amber-500",
      badge: subscribed ? "INCLUSO" : trialActive ? "€1,99" : null,
      trialPPU: true,
    },
    // Pilastri
    {
      title: "I Pilastri della Crescita",
      description: "Un percorso guidato per la tua evoluzione personale",
      icon: Compass,
      href: "/pillars",
      color: "from-fuchsia-500 to-purple-600",
      badge: subscribed ? "INCLUSO" : trialActive ? "€1,99" : null,
      trialPPU: true,
    },
    // Report Avanzato
    {
      title: "Report Avanzato",
      description: "Un'analisi approfondita generata dall'AI su misura per te",
      icon: ScrollText,
      href: "/advanced-report",
      color: "from-amber-600 to-yellow-700",
      badge: subscribed ? "INCLUSO" : "€1,99",
      trialPPU: !subscribed,
    },
    // Brand Analyzer
    {
      title: "Analizzatore Brand",
      description: "Scopri la vibrazione energetica del tuo brand o progetto",
      icon: Target,
      href: "/brand",
      color: "from-violet-500 to-fuchsia-500",
      badge: hasUnlockAll ? "SBLOCCATO" : "€1,99",
      payPerUse: true,
      payPerUsePrice: "€1,99",
    },
    // Vibrazione Casa
    {
      title: "Vibrazione Casa",
      description: "Analizza l'energia del tuo indirizzo e scopri come influenza la tua vita",
      icon: Home,
      href: "/house",
      color: "from-cyan-500 to-sky-500",
      badge: hasUnlockAll ? "SBLOCCATO" : "€1,99",
      payPerUse: true,
      payPerUsePrice: "€1,99",
    },
    // Compatibilità
    {
      title: "Compatibilità",
      description: "Scopri l'affinità numerologica con il tuo partner, amico o collega",
      icon: Users,
      href: "/compatibility",
      color: "from-pink-500 to-rose-500",
      badge: hasUnlockAll ? "SBLOCCATO" : "€1,99",
      payPerUse: true,
      payPerUsePrice: "€1,99",
    },
    // Community
    {
      title: "Community",
      description: "Condividi esperienze e scoperte con altri appassionati di numerologia",
      icon: MessageCircle,
      href: "/community",
      color: "from-indigo-500 to-purple-500",
      badge: "GRATIS",
    },
  ];

  const dailyAnalysisUnlocked = isFeatureUnlocked("daily_analysis");
  const outfitsUnlocked = isFeatureUnlocked("outfits");
  const showDailyContent = subscribed || trialActive;

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
            {latestMap && (
              <Button variant="cosmic-outline" size="sm" asChild>
                <Link to="/map">
                  <Map className="w-4 h-4 mr-2" />
                  {t("dashboard.yourMap")}
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => navigate("/community")} title="Community" className="relative">
              <Users className="w-5 h-5" />
              {todayPostCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                  {todayPostCount > 99 ? "99+" : todayPostCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} title={t("dashboard.profile")}>
              <User className="w-5 h-5" />
            </Button>
            {(userEmail === "regnew01@gmail.com" || userEmail === "maria732008@live.it") && (
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} title={t("dashboard.controlPanel")}>
                <Shield className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {t("dashboard.welcome").split("<1>")[0]}
            <span className="text-gradient-gold">{profile?.nome}</span>
            {t("dashboard.welcome").split("</1>")[1] || ""}
          </h1>
          <p className="text-muted-foreground text-lg">{t("dashboard.explore")}</p>
        </motion.section>

        {/* Trial banner */}
        {trialActive && !subscribed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 p-4 flex items-center justify-between flex-wrap gap-3"
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
        {latestMap && showDailyContent && dailyAnalysisUnlocked && <DailyAnalysis personalYear={latestMap.personal_year} lifePath={latestMap.life_path} />}

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

        {/* Outfits (after analysis) */}
        {showDailyContent && outfitsUnlocked && <DailyOutfits />}

        {/* Numbers */}
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

        {/* Service cards */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display text-xl font-semibold mb-4">I tuoi servizi</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const featureKey = FEATURE_KEY_MAP[action.href];
              const isFreeInTrial = trialActive && ["/chat", "/dates"].includes(action.href);
              const isScheduleLocked = featureKey && !isFreeInTrial && !isFeatureUnlocked(featureKey);
              const daysLeft = featureKey ? getDaysRemaining(featureKey) : 0;

              return (
                <motion.div key={action.title || action.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.03 }}>
                  <Link to={isScheduleLocked ? "#" : action.href} onClick={(e) => { if (isScheduleLocked) e.preventDefault(); }}>
                    <div className={`group relative p-5 rounded-2xl border transition-all duration-300 ${isScheduleLocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-cosmic"} ${(action as any).primary ? "bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 hover:border-primary/50" : "bg-card/50 border-border/50 hover:border-primary/30"}`}>
                      {/* Badge */}
                      {isScheduleLocked ? (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-muted text-muted-foreground border-border border text-[10px] px-2 py-0.5 gap-1">
                            <Clock className="w-3 h-3" />
                            {daysLeft}{i18n.language?.startsWith("en") ? "d" : "g"}
                          </Badge>
                        </div>
                      ) : action.badge === "GRATIS" ? (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-[10px] px-2 py-0.5">
                            GRATIS
                          </Badge>
                        </div>
                      ) : action.badge === "INCLUSO" ? (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary/20 text-primary border-primary/30 border text-[10px] px-2 py-0.5 gap-1">
                            <Check className="w-3 h-3" />
                            INCLUSO
                          </Badge>
                        </div>
                      ) : action.badge === "SBLOCCATO" ? (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-[10px] px-2 py-0.5 gap-1">
                            <Check className="w-3 h-3" />
                            SBLOCCATO
                          </Badge>
                        </div>
                      ) : action.badge === "€1,99" ? (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 border text-[10px] px-2 py-0.5 gap-1">
                            <ShoppingCart className="w-3 h-3" />
                            €1,99
                          </Badge>
                        </div>
                      ) : !subscribed && !(action as any).primary ? (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary/20 text-primary border-primary/30 border text-[10px] px-2 py-0.5 gap-1">
                            <Lock className="w-3 h-3" />
                            PRO
                          </Badge>
                        </div>
                      ) : null}

                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 ${isScheduleLocked ? "grayscale" : ""}`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-display text-base font-semibold mb-1 flex items-center gap-2">
                        {action.title}
                        {!isScheduleLocked && <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isScheduleLocked ? `Disponibile tra ${daysLeft} giorn${daysLeft === 1 ? "o" : "i"}` : action.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;

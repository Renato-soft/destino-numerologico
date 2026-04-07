import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Map, MessageCircle, Calendar,
  User, Users, Target, Compass, ScrollText, LogOut, Home, Crown, Lock, ShoppingCart, Shield, Clock, Check, ChevronRight, Menu
} from "lucide-react";
import DailyAnalysis from "@/components/DailyAnalysis";
import DailyOutfits from "@/components/DailyOutfits";
import SimplifiedMiniMap from "@/components/SimplifiedMiniMap";
import { calculateLifePath, calculatePersonalYear } from "@/lib/numerology";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/useSubscription";
import { useFeatureSchedule } from "@/hooks/useFeatureSchedule";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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

  const quickActions = [
    ...(!subscribed ? [{
      title: "Scegli il tuo piano",
      description: "Sblocca tutto il potere della numerologia",
      icon: Crown,
      href: "/pricing",
      color: "from-amber-500 to-yellow-600",
      primary: true,
      badge: null as string | null,
    }] : []),
    ...(latestMap ? [] : [{
      title: "Mappa Numerologica",
      description: "Il tuo profilo numerologico completo",
      icon: Map,
      href: "/map",
      color: "from-primary to-accent",
      badge: hasUnlockAll ? "SBLOCCATO" : subscribed ? "INCLUSO" : "€1,99",
      payPerUse: true,
      payPerUsePrice: "€1,99",
    }]),
    {
      title: "Chat con l'Esperto",
      description: "Risposte personalizzate dalla guida AI",
      icon: MessageCircle,
      href: "/chat",
      color: "from-secondary to-purple-500",
      badge: trialActive && !subscribed ? "GRATIS" : subscribed ? "INCLUSO" : null,
    },
    {
      title: "Date Favorevoli",
      description: "I giorni migliori per le tue decisioni",
      icon: Calendar,
      href: "/dates",
      color: "from-amber-500 to-orange-500",
      badge: trialActive && !subscribed ? "GRATIS" : null,
      payPerUse: !trialActive || subscribed ? false : false,
      payPerUsePrice: "€1,99",
      isAlwaysPPU: true,
    },
    {
      title: "Anno Personale " + new Date().getFullYear(),
      description: "Energie e opportunità dell'anno",
      icon: Calendar,
      href: "/personal-year",
      color: "from-orange-500 to-amber-500",
      badge: subscribed ? "INCLUSO" : trialActive ? "€1,99" : null,
      trialPPU: true,
    },
    {
      title: "Pilastri della Crescita",
      description: "Percorso guidato di evoluzione",
      icon: Compass,
      href: "/pillars",
      color: "from-fuchsia-500 to-purple-600",
      badge: subscribed ? "INCLUSO" : trialActive ? "€1,99" : null,
      trialPPU: true,
    },
    {
      title: "Report Avanzato",
      description: "Analisi approfondita generata dall'AI",
      icon: ScrollText,
      href: "/advanced-report",
      color: "from-amber-600 to-yellow-700",
      badge: subscribed ? "INCLUSO" : "€1,99",
      trialPPU: !subscribed,
    },
    {
      title: "Analizzatore Brand",
      description: "Vibrazione energetica del tuo brand",
      icon: Target,
      href: "/brand",
      color: "from-violet-500 to-fuchsia-500",
      badge: hasUnlockAll ? "SBLOCCATO" : "€1,99",
      payPerUse: true,
      payPerUsePrice: "€1,99",
    },
    {
      title: "Vibrazione Casa",
      description: "Energia del tuo indirizzo",
      icon: Home,
      href: "/house",
      color: "from-cyan-500 to-sky-500",
      badge: hasUnlockAll ? "SBLOCCATO" : "€1,99",
      payPerUse: true,
      payPerUsePrice: "€1,99",
    },
    {
      title: "Compatibilità",
      description: "Affinità numerologica con gli altri",
      icon: Users,
      href: "/compatibility",
      color: "from-pink-500 to-rose-500",
      badge: hasUnlockAll ? "SBLOCCATO" : "€1,99",
      payPerUse: true,
      payPerUsePrice: "€1,99",
    },
    {
      title: "Community",
      description: "Condividi con altri appassionati",
      icon: MessageCircle,
      href: "/community",
      color: "from-indigo-500 to-purple-500",
      badge: "GRATIS",
    },
  ];

  const dailyAnalysisUnlocked = isFeatureUnlocked("daily_analysis");
  const outfitsUnlocked = isFeatureUnlocked("outfits");
  const showDailyContent = subscribed || trialActive;

  const getBadgeElement = (action: typeof quickActions[0], isScheduleLocked: boolean, daysLeft: number) => {
    if (isScheduleLocked) {
      return (
        <Badge className="bg-muted text-muted-foreground border-border border text-[10px] px-1.5 py-0 gap-0.5 ml-auto shrink-0">
          <Clock className="w-2.5 h-2.5" />
          {daysLeft}{i18n.language?.startsWith("en") ? "d" : "g"}
        </Badge>
      );
    }
    if (action.badge === "GRATIS") return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-[10px] px-1.5 py-0 ml-auto shrink-0">GRATIS</Badge>;
    if (action.badge === "INCLUSO") return <Badge className="bg-primary/20 text-primary border-primary/30 border text-[10px] px-1.5 py-0 gap-0.5 ml-auto shrink-0"><Check className="w-2.5 h-2.5" />INCLUSO</Badge>;
    if (action.badge === "SBLOCCATO") return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-[10px] px-1.5 py-0 gap-0.5 ml-auto shrink-0"><Check className="w-2.5 h-2.5" />SBLOCCATO</Badge>;
    if (action.badge === "€1,99") return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 border text-[10px] px-1.5 py-0 gap-0.5 ml-auto shrink-0"><ShoppingCart className="w-2.5 h-2.5" />€1,99</Badge>;
    if (!subscribed && !(action as any).primary) return <Badge className="bg-primary/20 text-primary border-primary/30 border text-[10px] px-1.5 py-0 gap-0.5 ml-auto shrink-0"><Lock className="w-2.5 h-2.5" />PRO</Badge>;
    return null;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none z-0" />
        <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none z-0" />

        {/* Sidebar with services */}
        <Sidebar collapsible="icon" className="z-20 border-r border-border/50">
          <SidebarContent className="pt-4">
            {/* Logo in sidebar */}
            <div className="px-4 pb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-semibold truncate group-data-[collapsible=icon]:hidden">
                {t("common.appName")}
              </span>
            </div>

            {/* Pricing CTA for non-subscribers */}
            {!subscribed && (
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 border border-primary/30 rounded-lg">
                        <Link to="/pricing" className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">Scegli il tuo piano</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Map link if not created yet */}
            {!latestMap && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Inizia</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/map" className="flex items-center gap-2">
                          <Map className="w-4 h-4 shrink-0" />
                          <span className="truncate group-data-[collapsible=icon]:hidden">Mappa Numerologica</span>
                          {getBadgeElement({ title: "", description: "", icon: Map, href: "/map", color: "", badge: hasUnlockAll ? "SBLOCCATO" : subscribed ? "INCLUSO" : "€1,99" }, false, 0)}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Servizi</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {quickActions.filter(a => !(a as any).primary && a.href !== "/map").map((action) => {
                    const featureKey = FEATURE_KEY_MAP[action.href];
                    const isFreeInTrial = trialActive && ["/chat", "/dates"].includes(action.href);
                    const isScheduleLocked = featureKey && !isFreeInTrial && !isFeatureUnlocked(featureKey);
                    const daysLeft = featureKey ? getDaysRemaining(featureKey) : 0;

                    return (
                      <SidebarMenuItem key={action.href}>
                        <SidebarMenuButton
                          asChild
                          className={isScheduleLocked ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <Link
                            to={isScheduleLocked ? "#" : action.href}
                            onClick={(e) => { if (isScheduleLocked) e.preventDefault(); }}
                            className="flex items-center gap-2"
                          >
                            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0 ${isScheduleLocked ? "grayscale" : ""}`}>
                              <action.icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="truncate text-sm group-data-[collapsible=icon]:hidden">{action.title}</span>
                            <span className="group-data-[collapsible=icon]:hidden">
                              {getBadgeElement(action, !!isScheduleLocked, daysLeft)}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Bottom actions */}
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  {latestMap && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/map" className="flex items-center gap-2">
                          <Map className="w-4 h-4 shrink-0" />
                          <span className="truncate group-data-[collapsible=icon]:hidden">{t("dashboard.yourMap")}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="w-4 h-4 shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">{t("dashboard.profile")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {(userEmail === "regnew01@gmail.com" || userEmail === "maria732008@live.it" || userEmail === "realerenato@gmail.com") && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                          <Shield className="w-4 h-4 shrink-0" />
                          <span className="truncate group-data-[collapsible=icon]:hidden">{t("dashboard.controlPanel")}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-2 text-destructive hover:text-destructive">
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col relative z-10">
          <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="px-4 md:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="shrink-0" />
                <div>
                  <h1 className="font-display text-xl md:text-2xl font-bold">
                    {t("dashboard.hello")} <span className="text-gradient-gold">{profile?.nome}</span> ✨
                  </h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">{t("dashboard.explore")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate("/community")} title="Community" className="relative">
                  <Users className="w-5 h-5" />
                  {todayPostCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                      {todayPostCount > 99 ? "99+" : todayPostCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto px-4 md:px-8 py-6 space-y-6">
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

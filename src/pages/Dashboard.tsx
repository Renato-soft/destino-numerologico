import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Map, 
  MessageCircle, 
  FileText, 
  Calendar, 
  Smartphone,
  User,
  Users,
  LogOut,
  ChevronRight
} from "lucide-react";
import DailyAnalysis from "@/components/DailyAnalysis";

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestMap, setLatestMap] = useState<NumerologyMap | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("nome, cognome, birth_date")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error loading profile:", profileError);
      }

      if (!profileData || !profileData.nome) {
        navigate("/onboarding");
        return;
      }

      setProfile(profileData);

      // Load latest map
      const { data: mapData } = await supabase
        .from("numerology_maps")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (mapData) {
        setLatestMap(mapData);
      }

      setLoading(false);
    };

    checkAuthAndLoadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Arrivederci!",
      description: "Sei stato disconnesso.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Genera la tua Mappa",
      description: "Calcola i tuoi numeri e genera il report completo",
      icon: Map,
      href: "/map",
      color: "from-primary to-accent",
      primary: true,
    },
    {
      title: "Chat con l'Esperto",
      description: "Parla con il consulente numerologico AI",
      icon: MessageCircle,
      href: "/chat",
      color: "from-secondary to-purple-500",
    },
    {
      title: "Storico Mappe",
      description: "Visualizza e scarica i tuoi report PDF",
      icon: FileText,
      href: "/history",
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Date Favorevoli",
      description: "Trova le date migliori per i tuoi obiettivi",
      icon: Calendar,
      href: "/dates",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Compatibilità",
      description: "Confronta la tua mappa con un'altra persona",
      icon: Users,
      href: "/compatibility",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "WhatsApp",
      description: "Configura il buongiorno quotidiano",
      icon: Smartphone,
      href: "/whatsapp",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Profilo",
      description: "Modifica i tuoi dati personali",
      icon: User,
      href: "/profile",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold hidden sm:block">
              Destino Numerologico
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden md:block">
              Ciao, <span className="text-foreground font-medium">{profile?.nome}</span>
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Welcome section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Benvenuto, <span className="text-gradient-gold">{profile?.nome}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Esplora il tuo destino numerologico
          </p>
        </motion.section>

        {/* Current numbers summary (if map exists) */}
        {latestMap && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-semibold mb-4">I tuoi numeri</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Destino", value: latestMap.life_path },
                { label: "Io", value: latestMap.destiny_expression },
                { label: "Anima", value: latestMap.soul },
                { label: "Personalità", value: latestMap.personality },
                { label: "Quintessenza", value: (() => { const s = latestMap.destiny_expression + latestMap.life_path; let r = s; while (r > 9 && r !== 11 && r !== 22) { r = r.toString().split('').reduce((a, d) => a + parseInt(d), 0); } return r; })() },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="glass-cosmic rounded-xl p-4 text-center"
                >
                  <div className="number-circle mx-auto mb-2 w-12 h-12 text-xl">
                    {item.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Quick actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-xl font-semibold mb-4">Azioni rapide</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link to={action.href}>
                  <div
                    className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-cosmic ${
                      action.primary
                        ? "bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 hover:border-primary/50"
                        : "bg-card/50 border-border/50 hover:border-primary/30"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
                      {action.title}
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Personal year info */}
        {latestMap && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="glass-cosmic rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="number-circle number-circle-lg">
                {latestMap.personal_year}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Anno Personale {new Date().getFullYear()}
                </h3>
                <p className="text-muted-foreground">
                  Questo è il tuo anno personale. Scopri cosa ti riserva e come sfruttare al meglio le energie dell'anno.
                </p>
                <Button variant="cosmic-outline" size="sm" className="mt-4" asChild>
                  <Link to="/map">Leggi l'interpretazione completa</Link>
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

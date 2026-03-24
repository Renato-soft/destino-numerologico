import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, UserPlus, TrendingUp, CreditCard, ArrowLeft,
  Eye, Loader2, UserX, ShoppingBag, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewData {
  role: "superadmin" | "admin";
  totalUsers: number;
  newToday: number;
  newLast3Days: number;
  stripe: {
    totalRevenue: number;
    revenueByProduct: Record<string, number>;
    activeSubscriptions: number;
    canceledSubscriptions: number;
    churned: string[];
  };
  users: {
    user_id: string;
    nome: string;
    cognome: string;
    email: string;
    created_at: string;
    sesso: string;
    last_sign_in_at: string | null;
    login_count: number;
  }[];
}

interface UserDetail {
  photos: { type: string; url: string }[];
  outfits: { date: string; label: string; url: string }[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const { data, error: fnErr } = await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: null,
      });

      if (fnErr || data?.error) {
        setError(data?.error || "Accesso negato");
        setLoading(false);
        return;
      }

      setOverview(data);
    } catch {
      setError("Errore di connessione");
    }
    setLoading(false);
  };

  const fetchUserDetail = async (userId: string) => {
    setSelectedUser(userId);
    setDetailLoading(true);
    setUserDetail(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/admin-dashboard?action=user-detail&user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const data = await res.json();
      setUserDetail(data);
    } catch {
      setUserDetail(null);
    }
    setDetailLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive text-lg">{error}</p>
        <Button onClick={() => navigate("/dashboard")}>Torna alla dashboard</Button>
      </div>
    );
  }

  if (!overview) return null;

  const statCards = [
    { label: "Utenti totali", value: overview.totalUsers, icon: Users, color: "text-primary" },
    { label: "Nuovi oggi", value: overview.newToday, icon: UserPlus, color: "text-green-500" },
    { label: "Nuovi ultimi 3gg", value: overview.newLast3Days, icon: UserPlus, color: "text-blue-500" },
    { label: "Abbonamenti attivi", value: overview.stripe.activeSubscriptions, icon: CreditCard, color: "text-emerald-500" },
    { label: "Non rinnovati", value: overview.stripe.canceledSubscriptions, icon: UserX, color: "text-red-500" },
    { label: "Incasso totale", value: `€${overview.stripe.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-amber-500" },
  ];

  const selectedUserData = overview.users.find(u => u.user_id === selectedUser);

  const labelMap: Record<string, string> = {
    day1: "Giorno 1",
    day2: "Giorno 2",
    eve1: "Sera 1",
    eve2: "Sera 2",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-2xl font-bold">Pannello di Controllo</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-cosmic rounded-xl p-4"
            >
              <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue by product */}
        {Object.keys(overview.stripe.revenueByProduct).length > 0 && (
          <div className="glass-cosmic rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Incassi per servizio</h2>
            </div>
            <div className="space-y-2">
              {Object.entries(overview.stripe.revenueByProduct).map(([name, amount]) => (
                <div key={name} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                  <span className="text-sm text-foreground">{name}</span>
                  <span className="text-sm font-semibold text-foreground">€{amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Churned users */}
        {overview.stripe.churned.length > 0 && (
          <div className="glass-cosmic rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <UserX className="w-5 h-5 text-red-500" />
              <h2 className="font-display text-lg font-semibold">Utenti non rinnovati</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {overview.stripe.churned.map(email => (
                <span key={email} className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs">{email}</span>
              ))}
            </div>
          </div>
        )}

        {/* User list + detail */}
        <div className={`grid grid-cols-1 ${overview.role === "superadmin" ? "lg:grid-cols-2" : ""} gap-6`}>
          {/* User list */}
          <div className="glass-cosmic rounded-xl p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Tutti gli utenti ({overview.users.length})</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {[...overview.users].sort((a, b) => {
                if (!a.last_sign_in_at && !b.last_sign_in_at) return 0;
                if (!a.last_sign_in_at) return 1;
                if (!b.last_sign_in_at) return -1;
                return new Date(b.last_sign_in_at).getTime() - new Date(a.last_sign_in_at).getTime();
              }).map(u => (
                <div
                  key={u.user_id}
                  onClick={() => overview.role === "superadmin" ? fetchUserDetail(u.user_id) : null}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${overview.role === "superadmin" ? "cursor-pointer" : ""} ${
                    selectedUser === u.user_id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{u.nome} {u.cognome}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Ultimo accesso: {u.last_sign_in_at
                          ? new Date(u.last_sign_in_at).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "Mai"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Accessi: {u.login_count}
                      </span>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* User detail */}
          <div className="glass-cosmic rounded-xl p-6">
            {!selectedUser ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Seleziona un utente per vedere i dettagli</p>
              </div>
            ) : detailLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : userDetail ? (
              <div>
                <h2 className="font-display text-lg font-semibold mb-4">
                  {selectedUserData?.nome} {selectedUserData?.cognome}
                </h2>

                {/* Profile photos */}
                {userDetail.photos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Foto profilo</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {userDetail.photos.map((p, i) => (
                        <div key={i} className="flex-shrink-0 cursor-pointer" onClick={() => setLightboxUrl(p.url)}>
                          <img
                            src={p.url}
                            alt={p.type}
                            className="w-20 h-20 object-cover rounded-lg border border-border/30"
                          />
                          <p className="text-xs text-muted-foreground text-center mt-1">{p.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outfits */}
                {userDetail.outfits.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Outfit ultimi 3 giorni</h3>
                    {/* Group by date */}
                    {Object.entries(
                      userDetail.outfits.reduce<Record<string, typeof userDetail.outfits>>((acc, o) => {
                        (acc[o.date] = acc[o.date] || []).push(o);
                        return acc;
                      }, {})
                    ).map(([date, outfits]) => (
                      <div key={date} className="mb-4">
                        <p className="text-xs font-semibold text-primary mb-2">{date}</p>
                        <div className="grid grid-cols-4 gap-2">
                          {outfits.map((o, i) => (
                            <div key={i} className="cursor-pointer" onClick={() => setLightboxUrl(o.url)}>
                              <img
                                src={o.url}
                                alt={o.label}
                                className="w-full aspect-[3/4] object-cover rounded-lg border border-border/30"
                              />
                              <p className="text-xs text-muted-foreground text-center mt-1">
                                {labelMap[o.label] || o.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nessun outfit disponibile</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={() => setLightboxUrl(null)}>
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxUrl}
            alt="Dettaglio"
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

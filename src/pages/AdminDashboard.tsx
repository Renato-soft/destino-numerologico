import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, UserPlus, TrendingUp, CreditCard, ArrowLeft,
  Eye, Loader2, UserX, ShoppingBag, X, CalendarClock, Save,
  LogIn, KeyRound, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface OverviewData {
  role: "superadmin" | "admin" | "viewer";
  totalUsers: number;
  newToday: number;
  newLast3Days: number;
  loginsToday: number;
  loginsLast3Days: number;
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

interface FeatureScheduleItem {
  feature_key: string;
  feature_label: string;
  unlock_after_days: number;
  enabled: boolean;
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

  // Feature schedule state
  const [featureSchedule, setFeatureSchedule] = useState<FeatureScheduleItem[]>([]);
  const [scheduleEdits, setScheduleEdits] = useState<Record<string, number>>({});
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Service overrides state
  const [userOverrides, setUserOverrides] = useState<string[]>([]);
  const [overridesLoading, setOverridesLoading] = useState(false);
  const [savingOverrides, setSavingOverrides] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<string | null>(null);

  useEffect(() => {
    fetchOverview();
    fetchFeatureSchedule();
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

  const fetchFeatureSchedule = async () => {
    const { data } = await supabase.from("feature_schedule" as any).select("feature_key, feature_label, unlock_after_days, enabled").order("unlock_after_days");
    if (data) {
      setFeatureSchedule(data as any[]);
      const edits: Record<string, number> = {};
      (data as any[]).forEach((f: any) => { edits[f.feature_key] = f.unlock_after_days; });
      setScheduleEdits(edits);
    }
  };

  const handleSaveSchedule = async () => {
    setSavingSchedule(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "update-schedule", schedules: scheduleEdits },
      });

      if (error) throw error;
      await fetchFeatureSchedule();
    } catch (err: any) {
      console.error("Save schedule error:", err);
    }
    setSavingSchedule(false);
  };

  const ALL_SERVICES = [
    { key: "map", label: "Mappa Numerologica" },
    { key: "brand", label: "Analizzatore Brand" },
    { key: "house", label: "Vibrazione Casa" },
    { key: "compatibility", label: "Compatibilità" },
    { key: "dates", label: "Date Favorevoli" },
    { key: "chat", label: "Chat AI" },
    { key: "personal-year", label: "Anno Personale" },
    { key: "pillars", label: "Pilastri della Crescita" },
    { key: "community", label: "Community" },
    { key: "subscription", label: "Abbonamento completo" },
  ];

  const fetchUserOverrides = async (userId: string) => {
    setOverridesLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "get-user-overrides", user_id: userId },
      });
      if (!error && data?.overrides) {
        setUserOverrides(data.overrides);
      }
    } catch {
      setUserOverrides([]);
    }
    setOverridesLoading(false);
  };

  const handleSaveOverrides = async () => {
    if (!selectedUser) return;
    setSavingOverrides(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "update-user-overrides", user_id: selectedUser, services: userOverrides },
      });
    } catch (err) {
      console.error("Save overrides error:", err);
    }
    setSavingOverrides(false);
  };

  const toggleOverride = (key: string) => {
    setUserOverrides(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const toggleAllOverrides = (checked: boolean) => {
    setUserOverrides(checked ? ALL_SERVICES.map(s => s.key) : []);
  };

  const fetchUserDetail = async (userId: string) => {
    setSelectedUser(userId);
    setDetailLoading(true);
    setUserDetail(null);
    setUserOverrides([]);

    fetchUserOverrides(userId);

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
    { label: "Login oggi", value: overview.loginsToday, icon: LogIn, color: "text-violet-500" },
    { label: "Login ultimi 3gg", value: overview.loginsLast3Days, icon: LogIn, color: "text-indigo-500" },
    { label: "Abbonamenti attivi", value: overview.stripe.activeSubscriptions, icon: CreditCard, color: "text-emerald-500" },
    { label: "Abbandono", value: overview.stripe.canceledSubscriptions, icon: UserX, color: "text-red-500" },
    { label: "Incasso totale", value: `€${overview.stripe.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-amber-500" },
  ];

  const selectedUserData = overview.users.find(u => u.user_id === selectedUser);

  const labelMap: Record<string, string> = {
    day1: "Giorno 1",
    day2: "Giorno 2",
    eve1: "Sera 1",
    eve2: "Sera 2",
  };

  const isSuperadmin = overview.role === "superadmin";

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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
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

        {/* Feature Schedule Management - superadmin only */}
        {isSuperadmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-cosmic rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">Schedulazione Servizi</h2>
              </div>
              <Button
                variant="cosmic"
                size="sm"
                onClick={handleSaveSchedule}
                disabled={savingSchedule}
              >
                {savingSchedule ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                Salva
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Imposta dopo quanti giorni dall'iscrizione ogni servizio diventa disponibile. 0 = subito disponibile.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {featureSchedule.map((feature) => (
                <div
                  key={feature.feature_key}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card/30"
                >
                  <span className="text-sm font-medium text-foreground">{feature.feature_label}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={365}
                      className="w-16 h-8 text-center text-sm"
                      value={scheduleEdits[feature.feature_key] ?? feature.unlock_after_days}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setScheduleEdits(prev => ({ ...prev, [feature.feature_key]: val }));
                      }}
                    />
                    <span className="text-xs text-muted-foreground">gg</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
              <h2 className="font-display text-lg font-semibold">Utenti in abbandono</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {overview.stripe.churned.map(email => (
                <span key={email} className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs">{email}</span>
              ))}
            </div>
          </div>
        )}

        {/* User list + detail */}
        <div className={`grid grid-cols-1 ${isSuperadmin ? "lg:grid-cols-2" : ""} gap-6`}>
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
                  onClick={() => isSuperadmin ? fetchUserDetail(u.user_id) : null}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isSuperadmin ? "cursor-pointer" : ""} ${
                    selectedUser === u.user_id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{u.nome} {u.cognome}</p>
                    {u.email && <p className="text-xs text-muted-foreground">{u.email}</p>}
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
                  {isSuperadmin && <Eye className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* User detail - only for superadmin */}
          {isSuperadmin && (
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

                  {/* Service overrides */}
                  <div className="mb-6 p-4 rounded-lg border border-border/30 bg-card/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium text-foreground">Servizi abilitati</h3>
                      </div>
                      <Button
                        variant="cosmic"
                        size="sm"
                        onClick={handleSaveOverrides}
                        disabled={savingOverrides}
                      >
                        {savingOverrides ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                        Salva
                      </Button>
                    </div>
                    {overridesLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/20">
                          <Checkbox
                            checked={userOverrides.length === ALL_SERVICES.length}
                            onCheckedChange={(checked) => toggleAllOverrides(!!checked)}
                          />
                          <span className="text-xs font-semibold text-foreground">Seleziona tutti</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ALL_SERVICES.map(s => (
                            <label key={s.key} className="flex items-center gap-2 cursor-pointer py-1">
                              <Checkbox
                                checked={userOverrides.includes(s.key)}
                                onCheckedChange={() => toggleOverride(s.key)}
                              />
                              <span className="text-xs text-foreground">{s.label}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

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
          )}
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

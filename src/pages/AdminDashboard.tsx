import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, UserPlus, TrendingUp, CreditCard, ArrowLeft,
  Eye, Loader2, UserX, ShoppingBag, X, CalendarClock, Save,
  LogIn, KeyRound, Trash2, Gift, Plus, Power, ToggleLeft, ToggleRight,
  ImageIcon, Download, Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useAppSettings } from "@/hooks/useAppSettings";

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
  const { isFreeMode, refresh: refreshAppSettings } = useAppSettings();
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

  // Promotions state
  const [promotions, setPromotions] = useState<any[]>([]);
  const [promoLoading, setPromoLoading] = useState(false);
  const [newPromo, setNewPromo] = useState({ title: "", description: "", duration_hours: 48, services: ["map", "chat", "daily_analysis", "outfits"] as string[] });
  const [showNewPromo, setShowNewPromo] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any | null>(null);

  // User photos state
  const [allUserPhotos, setAllUserPhotos] = useState<any[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosLoaded, setPhotosLoaded] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState<string | null>(null);
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    fetchOverview();
    fetchFeatureSchedule();
    fetchPromotions();
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

  const fetchPromotions = async () => {
    setPromoLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "list-promotions" },
      });
      if (data?.promotions) setPromotions(data.promotions);
    } catch (e) { console.error(e); }
    setPromoLoading(false);
  };

  const handleCreatePromo = async () => {
    if (!newPromo.title) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "create-promotion", ...newPromo },
      });
      setNewPromo({ title: "", description: "", duration_hours: 48, services: ["map", "chat", "daily_analysis", "outfits"] });
      setShowNewPromo(false);
      await fetchPromotions();
    } catch (e) { console.error(e); }
  };

  const handleTogglePromo = async (promoId: string, activate: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "toggle-promotion", promotion_id: promoId, is_active: activate },
      });
      await fetchPromotions();
    } catch (e) { console.error(e); }
  };

  const handleDeletePromo = async (promoId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "delete-promotion", promotion_id: promoId },
      });
      await fetchPromotions();
    } catch (e) { console.error(e); }
  };

  const handleUpdatePromo = async () => {
    if (!editingPromo) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: {
          action: "update-promotion",
          promotion_id: editingPromo.id,
          title: editingPromo.title,
          description: editingPromo.description,
          duration_hours: editingPromo.duration_hours,
          services: editingPromo.services,
        },
      });
      setEditingPromo(null);
      await fetchPromotions();
    } catch (e) { console.error(e); }
  };

  const fetchAllPhotos = async () => {
    setPhotosLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "list-all-photos" },
      });
      if (data?.users) {
        setAllUserPhotos(data.users);
        setPhotosLoaded(true);
      }
    } catch (e) { console.error(e); }
    setPhotosLoading(false);
  };

  const handleDownloadSingle = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download error:", e);
      alert("Errore download");
    }
  };

  const handleDownloadUserZip = async (user: any) => {
    setDownloadingZip(user.user_id);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const photo of user.photos) {
        const res = await fetch(photo.url);
        const blob = await res.blob();
        const ext = photo.storage_path.split(".").pop() || "jpg";
        zip.file(`${photo.type}_${photo.id.slice(0, 8)}.${ext}`, blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      const blobUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `foto_${user.nome}_${user.cognome}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("ZIP error:", e);
      alert("Errore creazione ZIP");
    }
    setDownloadingZip(null);
  };

  const handleDownloadAllZip = async () => {
    setDownloadingZip("ALL");
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const user of allUserPhotos) {
        const folderName = `${user.nome}_${user.cognome}_${user.user_id.slice(0, 8)}`;
        const folder = zip.folder(folderName);
        if (!folder) continue;
        for (const photo of user.photos) {
          const res = await fetch(photo.url);
          const blob = await res.blob();
          const ext = photo.storage_path.split(".").pop() || "jpg";
          folder.file(`${photo.type}_${photo.id.slice(0, 8)}.${ext}`, blob);
        }
      }
      const content = await zip.generateAsync({ type: "blob" });
      const blobUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `tutte_le_foto_${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("ZIP all error:", e);
      alert("Errore creazione ZIP");
    }
    setDownloadingZip(null);
  };
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

  const handleDeleteUser = async () => {
    if (!confirmDeleteUser) return;
    setDeletingUser(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.functions.invoke("admin-dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { action: "delete-user", user_id: confirmDeleteUser },
      });
      if (error || data?.error) {
        alert(data?.error || "Errore durante l'eliminazione");
      } else {
        setSelectedUser(null);
        setUserDetail(null);
        setConfirmDeleteUser(null);
        await fetchOverview();
      }
    } catch (err: any) {
      alert("Errore: " + err.message);
    }
    setDeletingUser(false);
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
        {/* Payment Mode Toggle - superadmin only */}
        {isSuperadmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-cosmic rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isFreeMode ? (
                  <ToggleRight className="w-6 h-6 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-amber-500" />
                )}
                <div>
                  <h2 className="font-display text-lg font-semibold">Modalità Pagamento</h2>
                  <p className="text-sm text-muted-foreground">
                    {isFreeMode
                      ? "GRATUITO — Tutti i nuovi iscritti hanno accesso completo senza limiti. I blocchi di abbonamento sono nascosti."
                      : "ABBONAMENTO — I nuovi iscritti hanno un trial di 24h, poi devono pagare. Tutti i blocchi di pagamento sono visibili."}
                  </p>
                </div>
              </div>
              <Button
                variant={isFreeMode ? "outline" : "cosmic"}
                size="sm"
                onClick={async () => {
                  const newMode = isFreeMode ? "subscription" : "free";
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) return;
                    await supabase.functions.invoke("admin-dashboard", {
                      headers: { Authorization: `Bearer ${session.access_token}` },
                      body: { action: "update-payment-mode", mode: newMode },
                    });
                    await refreshAppSettings();
                  } catch (e) { console.error(e); }
                }}
              >
                {isFreeMode ? "Attiva Abbonamento" : "Attiva Gratuito"}
              </Button>
            </div>
          </motion.div>
        )}

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

        {/* Promotion Management - superadmin only */}
        {isSuperadmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-cosmic rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">Gestione Promozioni</h2>
              </div>
              <Button variant="cosmic" size="sm" onClick={() => setShowNewPromo(!showNewPromo)}>
                <Plus className="w-4 h-4 mr-1" />
                Nuova
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Crea promozioni per offrire accesso gratuito ai servizi selezionati per un periodo limitato.
            </p>

            {showNewPromo && (
              <div className="mb-4 p-4 rounded-lg border border-primary/20 bg-card/30 space-y-3">
                <Input
                  placeholder="Titolo promozione (es: Promo Lancio 48h)"
                  value={newPromo.title}
                  onChange={e => setNewPromo(p => ({ ...p, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Descrizione (opzionale)"
                  value={newPromo.description}
                  onChange={e => setNewPromo(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={168}
                    className="w-24"
                    value={newPromo.duration_hours}
                    onChange={e => setNewPromo(p => ({ ...p, duration_hours: parseInt(e.target.value) || 48 }))}
                  />
                  <span className="text-sm text-muted-foreground">ore di accesso gratuito</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Servizi inclusi:</p>
                  {[
                    { key: "map", label: "Mappa Numerologica" },
                    { key: "chat", label: "Chat AI" },
                    { key: "daily_analysis", label: "Analisi del Giorno" },
                    { key: "outfits", label: "Outfit" },
                    { key: "personal-year", label: "Anno Personale" },
                    { key: "pillars", label: "Pilastri" },
                    { key: "community", label: "Community" },
                    { key: "brand", label: "Brand Analyzer" },
                    { key: "house", label: "House Analyzer" },
                    { key: "compatibility", label: "Compatibilità" },
                    { key: "dates", label: "Date Favorevoli" },
                  ].map(svc => (
                    <label key={svc.key} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={newPromo.services.includes(svc.key)}
                        onCheckedChange={(checked) => {
                          setNewPromo(p => ({
                            ...p,
                            services: checked
                              ? [...p.services, svc.key]
                              : p.services.filter(s => s !== svc.key),
                          }));
                        }}
                      />
                      <span className="text-sm text-foreground">{svc.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="cosmic" size="sm" onClick={handleCreatePromo} disabled={!newPromo.title || newPromo.services.length === 0}>
                    Crea Promozione
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowNewPromo(false)}>
                    Annulla
                  </Button>
                </div>
              </div>
            )}

            {promoLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : promotions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nessuna promozione creata</p>
            ) : (
              <div className="space-y-3">
                {promotions.map((promo: any) => (
                  <div key={promo.id} className="space-y-2">
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${promo.is_active ? 'border-primary/40 bg-primary/5' : 'border-border/30 bg-card/30'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{promo.title}</span>
                          {promo.is_active && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">ATTIVA</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {promo.duration_hours}h • Creata il {new Date(promo.created_at).toLocaleDateString("it-IT")}
                          {promo.activated_at && ` • Attivata il ${new Date(promo.activated_at).toLocaleDateString("it-IT")}`}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(promo.services || ["map", "chat", "daily_analysis", "outfits"]).map((s: string) => (
                            <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary">{
                              ({ map: "Mappa", chat: "Chat", daily_analysis: "Analisi", outfits: "Outfit", "personal-year": "Anno", pillars: "Pilastri", community: "Community", brand: "Brand", house: "House", compatibility: "Compat.", dates: "Date" } as Record<string, string>)[s] || s
                            }</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingPromo({ ...promo, services: promo.services || ["map", "chat", "daily_analysis", "outfits"] })}>
                          <Save className="w-3 h-3 mr-1" />
                          Modifica
                        </Button>
                        <Button
                          variant={promo.is_active ? "outline" : "cosmic"}
                          size="sm"
                          onClick={() => handleTogglePromo(promo.id, !promo.is_active)}
                        >
                          <Power className="w-3 h-3 mr-1" />
                          {promo.is_active ? "Disattiva" : "Attiva"}
                        </Button>
                        {!promo.is_active && (
                          <Button variant="destructive" size="sm" onClick={() => handleDeletePromo(promo.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {editingPromo?.id === promo.id && (
                      <div className="p-4 rounded-lg border border-primary/20 bg-card/30 space-y-3">
                        <Input
                          placeholder="Titolo"
                          value={editingPromo.title}
                          onChange={e => setEditingPromo((p: any) => ({ ...p, title: e.target.value }))}
                        />
                        <Textarea
                          placeholder="Descrizione (opzionale)"
                          value={editingPromo.description || ""}
                          onChange={e => setEditingPromo((p: any) => ({ ...p, description: e.target.value }))}
                          rows={2}
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            max={168}
                            className="w-24"
                            value={editingPromo.duration_hours}
                            onChange={e => setEditingPromo((p: any) => ({ ...p, duration_hours: parseInt(e.target.value) || 48 }))}
                          />
                          <span className="text-sm text-muted-foreground">ore</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Servizi inclusi:</p>
                          {[
                            { key: "map", label: "Mappa Numerologica" },
                            { key: "chat", label: "Chat AI" },
                            { key: "daily_analysis", label: "Analisi del Giorno" },
                            { key: "outfits", label: "Outfit" },
                            { key: "personal-year", label: "Anno Personale" },
                            { key: "pillars", label: "Pilastri" },
                            { key: "community", label: "Community" },
                            { key: "brand", label: "Brand Analyzer" },
                            { key: "house", label: "House Analyzer" },
                            { key: "compatibility", label: "Compatibilità" },
                            { key: "dates", label: "Date Favorevoli" },
                          ].map(svc => (
                            <label key={svc.key} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={editingPromo.services.includes(svc.key)}
                                onCheckedChange={(checked) => {
                                  setEditingPromo((p: any) => ({
                                    ...p,
                                    services: checked
                                      ? [...p.services, svc.key]
                                      : p.services.filter((s: string) => s !== svc.key),
                                  }));
                                }}
                              />
                              <span className="text-sm text-foreground">{svc.label}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="cosmic" size="sm" onClick={handleUpdatePromo} disabled={!editingPromo.title || editingPromo.services.length === 0}>
                            <Save className="w-3 h-3 mr-1" />
                            Salva
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingPromo(null)}>
                            Annulla
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-lg font-semibold">
                      {selectedUserData?.nome} {selectedUserData?.cognome}
                    </h2>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmDeleteUser(selectedUser)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Elimina
                    </Button>
                  </div>

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

      {/* Delete confirmation dialog */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => !deletingUser && setConfirmDeleteUser(null)}>
          <div className="bg-card rounded-xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-2">Conferma eliminazione</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Stai per eliminare definitivamente l'utente:
            </p>
            <p className="text-sm font-semibold text-foreground mb-4">
              {overview?.users.find(u => u.user_id === confirmDeleteUser)?.nome}{" "}
              {overview?.users.find(u => u.user_id === confirmDeleteUser)?.cognome}
              {overview?.users.find(u => u.user_id === confirmDeleteUser)?.email &&
                ` (${overview.users.find(u => u.user_id === confirmDeleteUser)?.email})`}
            </p>
            <p className="text-xs text-destructive mb-6">
              Questa azione è irreversibile. Tutti i dati dell'utente verranno cancellati.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="sm" onClick={() => setConfirmDeleteUser(null)} disabled={deletingUser}>
                Annulla
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteUser} disabled={deletingUser}>
                {deletingUser ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
                Elimina definitivamente
              </Button>
            </div>
          </div>
        </div>
      )}

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

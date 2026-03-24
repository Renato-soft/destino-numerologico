import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, User, Check, Loader2, Calendar, RefreshCw, Camera, Upload, Trash2, Globe, Plus, ImagePlus
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface Profile {
  nome: string;
  cognome: string;
  birth_date: string;
  sesso: string | null;
  timezone: string | null;
  created_at: string;
  language: string;
}

interface UserPhoto {
  id: string;
  type: string;
  storage_path: string;
  signedUrl?: string;
}

const MAX_PHOTOS = 10;

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sesso, setSesso] = useState("");
  const [language, setLanguage] = useState("it");
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [disabling, setDisabling] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const basePhotoTypes = [
    { key: "face", label: t("profile.face"), required: true },
    { key: "full_front", label: t("profile.frontFull"), required: false },
    { key: "full_side", label: t("profile.sideFull"), required: false },
  ];

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }

    const [profileResult, photosResult] = await Promise.all([
      supabase.from("profiles").select("nome, cognome, birth_date, sesso, timezone, created_at, language").eq("user_id", session.user.id).maybeSingle() as any,
      supabase.from("photos").select("id, type, storage_path").eq("user_id", session.user.id),
    ]);

    if (profileResult.data) {
      setProfile(profileResult.data);
      setNome(profileResult.data.nome);
      setCognome(profileResult.data.cognome);
      setBirthDate(profileResult.data.birth_date);
      setSesso(profileResult.data.sesso || "");
      setLanguage(profileResult.data.language || "it");
    }

    if (photosResult.data && photosResult.data.length > 0) {
      const photosWithUrls = await Promise.all(
        photosResult.data.map(async (photo) => {
          const { data } = await supabase.storage.from("user-photos").createSignedUrl(photo.storage_path, 600);
          return { ...photo, signedUrl: data?.signedUrl };
        })
      );
      setPhotos(photosWithUrls);
    }
    setLoading(false);
  };

  const handleLanguageChange = async (newLang: string) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.from("profiles").update({ language: newLang } as any).eq("user_id", session.user.id);
      toast({ title: t("profile.languageUpdated"), description: t("profile.languageUpdatedDesc") });
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  const handleSave = async () => {
    if (!nome.trim() || !cognome.trim() || !birthDate) {
      toast({ title: t("profile.requiredFields"), description: t("profile.requiredFieldsDesc"), variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase.from("profiles").update({
        nome: nome.trim(), cognome: cognome.trim(), birth_date: birthDate, sesso: sesso || null,
      } as any).eq("user_id", session.user.id);
      if (error) throw error;
      toast({ title: t("profile.profileUpdated"), description: t("profile.profileUpdatedDesc") });
      setProfile({ ...profile!, nome: nome.trim(), cognome: cognome.trim(), birth_date: birthDate });
    } catch (error) {
      console.error("Error saving:", error);
      toast({ title: t("common.error"), description: t("profile.saveError"), variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleRegenerateMap = () => navigate("/map");

  const handleDisableAccount = async () => {
    const confirmed = window.confirm(t("profile.disableConfirm"));
    if (!confirmed) return;
    setDisabling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase.functions.invoke("disable-account", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (error) throw error;
      await supabase.auth.signOut();
      toast({ title: t("profile.accountDisabled"), description: t("profile.accountDisabledDesc") });
      navigate("/");
    } catch (error: any) {
      toast({ title: t("common.error"), description: error.message || t("profile.disableError"), variant: "destructive" });
    } finally { setDisabling(false); }
  };

  const handlePhotoUpload = async (type: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: t("onboarding.fileTooLarge"), description: "Max 5MB", variant: "destructive" });
      return;
    }
    setUploadingPhoto(type);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const userId = session.user.id;
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${type}_${Date.now()}.${fileExt}`;
      const existingPhoto = photos.find(p => p.type === type);
      if (existingPhoto) {
        await supabase.storage.from("user-photos").remove([existingPhoto.storage_path]);
        await supabase.from("photos").delete().eq("id", existingPhoto.id);
      }
      const { error: uploadError } = await supabase.storage.from("user-photos").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { error: insertError } = await supabase.from("photos").insert({ user_id: userId, type, storage_path: filePath });
      if (insertError) throw insertError;
      toast({ title: t("profile.photoUpdated") });
      await loadProfile();
    } catch (error: any) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } finally { setUploadingPhoto(null); }
  };

  const handlePhotoDelete = async (photo: UserPhoto) => {
    const confirmed = window.confirm(t("profile.deletePhotoConfirm"));
    if (!confirmed) return;
    setUploadingPhoto(photo.type);
    try {
      await supabase.storage.from("user-photos").remove([photo.storage_path]);
      await supabase.from("photos").delete().eq("id", photo.id);
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      toast({ title: t("profile.photoDeleted") });
    } catch (error: any) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } finally { setUploadingPhoto(null); }
  };

  const extraPhotos = photos.filter(p => !basePhotoTypes.some(b => b.key === p.type));
  const canAddMore = photos.length < MAX_PHOTOS;

  const handleExtraPhotoUpload = async (file: File) => {
    if (photos.length >= MAX_PHOTOS) {
      toast({ title: t("profile.limitReached"), description: t("profile.limitReachedDesc", { max: MAX_PHOTOS }), variant: "destructive" });
      return;
    }
    const type = `extra_${Date.now()}`;
    await handlePhotoUpload(type, file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold">{t("profile.title")}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-cosmic rounded-2xl p-6 space-y-6">
            <div className="text-center pb-4 border-b border-border/50">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-display font-bold text-primary-foreground mb-4">
                {nome.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display text-xl font-semibold">{nome} {cognome}</h2>
              {profile?.created_at && (
                <p className="text-sm text-muted-foreground">
                  {t("profile.memberSince", { date: format(new Date(profile.created_at), "d MMMM yyyy") })}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="nome">{t("profile.firstName")}</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="cognome">{t("profile.lastName")}</Label>
              <Input id="cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>{t("profile.gender")}</Label>
              <div className="flex gap-3 mt-2">
                {[{ value: "M", label: t("profile.male") }, { value: "F", label: t("profile.female") }].map((option) => (
                  <button key={option.value} type="button" onClick={() => setSesso(option.value)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${sesso === option.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="birthDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />{t("profile.birthDate")}
              </Label>
              <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-2" />
            </div>

            <Button variant="cosmic" className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t("profile.saving")}</>) : (<><Check className="w-5 h-5 mr-2" />{t("profile.saveChanges")}</>)}
            </Button>
          </div>

          <div className="glass-cosmic rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold">{t("profile.language")}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t("profile.languageDesc")}</p>
            <div className="flex gap-3">
              {[{ value: "it", label: "🇮🇹 Italiano" }, { value: "en", label: "🇬🇧 English" }].map((lang) => (
                <button key={lang.value} type="button" onClick={() => handleLanguageChange(lang.value)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${language === lang.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`}>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-cosmic rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold">{t("profile.photos")}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t("profile.photosDesc")}</p>
            <div className="grid gap-4">
              {basePhotoTypes.map((pt) => {
                const existingPhoto = photos.find(p => p.type === pt.key);
                return (
                  <div key={pt.key} className="space-y-1">
                    <Label>{pt.label} {pt.required && <span className="text-destructive">*</span>}</Label>
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${existingPhoto?.signedUrl ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}>
                      {uploadingPhoto === pt.key ? (
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      ) : existingPhoto?.signedUrl ? (
                        <div className="relative w-full h-full">
                          <img src={existingPhoto.signedUrl} alt={pt.label} className="w-full h-full object-contain rounded-xl" />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                            <span className="text-white text-sm font-medium">{t("profile.changePhoto")}</span>
                          </div>
                          {!pt.required && (
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePhotoDelete(existingPhoto); }}
                              className="absolute top-1 right-1 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-colors z-10" title={t("profile.deletePhoto")}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Upload className="w-8 h-8" />
                          <span className="text-sm">{t("profile.uploadPhoto")}</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePhotoUpload(pt.key, file); }} />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-cosmic rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <ImagePlus className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold">{t("profile.extraPhotos")}</h3>
              </div>
              <span className="text-xs text-muted-foreground">{photos.length}/{MAX_PHOTOS}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('profile.extraPhotosDesc')}</p>
            <p className="text-sm text-muted-foreground mt-2 italic">{t('profile.photosPrivacyNote')}</p>

            {extraPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {extraPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-border/50">
                    {photo.signedUrl ? (
                      <img src={photo.signedUrl} alt={t("profile.extraPhoto")} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    )}
                    <button type="button" onClick={() => handlePhotoDelete(photo)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {canAddMore && (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all">
                {uploadingPhoto?.startsWith("extra_") ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Plus className="w-6 h-6" />
                    <span className="text-xs">{t("profile.addPhoto", { remaining: MAX_PHOTOS - photos.length })}</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleExtraPhotoUpload(file); }} />
              </label>
            )}
          </div>

          <div className="glass-cosmic rounded-xl p-6">
            <h3 className="font-display font-semibold mb-2">{t("profile.regenerateMap")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("profile.regenerateMapDesc")}</p>
            <Button variant="cosmic-outline" className="w-full" onClick={handleRegenerateMap}>
              <RefreshCw className="w-5 h-5 mr-2" />{t("profile.regenerateButton")}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>{t("profile.timezone", { tz: profile?.timezone || "Europe/Rome" })}</p>
          </div>

          <div className="glass-cosmic rounded-xl p-6">
            <h3 className="font-display font-semibold mb-2 text-destructive">{t("profile.disableAccount")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("profile.disableAccountDesc")}</p>
            <Button variant="destructive" className="w-full" onClick={handleDisableAccount} disabled={disabling}>
              {disabling ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t("profile.disabling")}</>) : t("profile.disableButton")}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;

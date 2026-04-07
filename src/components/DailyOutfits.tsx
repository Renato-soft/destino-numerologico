import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Shirt, Sun, Moon, Loader2, RefreshCw, X, Camera, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OutfitCard = ({ url, icon: Icon, title, subtitle, index, onLightbox, t }: {
  url: string | null;
  icon: React.ElementType;
  title?: string;
  subtitle?: string;
  index: number;
  onLightbox: (url: string) => void;
  t: (key: string) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + index * 0.08 }}
    className="glass-cosmic rounded-2xl overflow-hidden group"
  >
    <div className="p-3 flex items-center gap-2 border-b border-border/30">
      <Icon className="w-4 h-4 text-primary" />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    {url ? (
      <div className="aspect-[3/4] cursor-pointer relative overflow-hidden" onClick={() => onLightbox(url)}>
        <img src={url} alt={title || "Outfit"} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <a
          href={url}
          download={`outfit-${index + 1}.png`}
          className="absolute bottom-2 left-2 right-2 h-9 rounded-md bg-background/85 backdrop-blur-sm flex items-center justify-center gap-1 text-xs font-medium text-foreground hover:bg-background transition-colors"
          onClick={(e) => e.stopPropagation()}
          title={t("common.downloadImage")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <span>{t("common.downloadImage")}</span>
        </a>
      </div>
    ) : (
      <div className="aspect-[3/4] flex items-center justify-center bg-muted/20">
        <p className="text-sm text-muted-foreground">{t("common.notAvailable")}</p>
      </div>
    )}
  </motion.div>
);

const DailyOutfits = () => {
  const { t } = useTranslation();
  const [outfits, setOutfits] = useState<(string | null)[]>([]);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const navigate = useNavigate();

  const getCacheKey = () => {
    const today = new Date().toISOString().split("T")[0];
    return `outfits_cache_${today}`;
  };

  const fetchOutfits = async (force = false) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { count } = await supabase
        .from("photos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.user.id);
      setPhotoCount(count || 0);

      if ((count || 0) === 0) {
        setLoading(false);
        return;
      }

      if (!force) {
        const cacheKey = getCacheKey();
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            // Support both old format (array) and new format ({outfits, description})
            const outfitUrls = Array.isArray(parsed) ? parsed : parsed?.outfits;
            const desc = Array.isArray(parsed) ? null : parsed?.description || null;
            if (Array.isArray(outfitUrls) && outfitUrls.length > 0 && outfitUrls.some(Boolean)) {
              setOutfits(outfitUrls);
              setDescription(desc);
              setLoading(false);
              return;
            }
          } catch { /* invalid cache */ }
        }
      }

      const { data, error: fnError } = await supabase.functions.invoke("generate-outfits", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { force },
      });

      if (fnError) {
        console.error("Edge function error:", fnError);
        setError(t("outfits.errorGenerate"));
        setLoading(false);
        return;
      }

      if (data?.outfits) {
        setOutfits(data.outfits);
        setDescription(data.description || null);
        const cacheKey = getCacheKey();
        sessionStorage.setItem(cacheKey, JSON.stringify({ outfits: data.outfits, description: data.description }));
      } else if (data?.error) {
        setError(data.error);
      }
    } catch (e) {
      console.error("Fetch outfits error:", e);
      setError(t("outfits.errorConnection"));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const labels = [
    { title: t("outfits.look1"), icon: Sun, subtitle: t("outfits.look1Sub") },
    { title: t("outfits.look2"), icon: Sun, subtitle: t("outfits.look2Sub") },
    { title: t("outfits.look3"), icon: Moon, subtitle: t("outfits.look3Sub") },
    { title: t("outfits.look4"), icon: Moon, subtitle: t("outfits.look4Sub") },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shirt className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">{t("outfits.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("outfits.subtitle")}</p>
          </div>
        </div>
        {!loading && (
          <Button variant="ghost" size="icon" onClick={() => {
            sessionStorage.removeItem(getCacheKey());
            fetchOutfits(true);
          }} title={t("outfits.regenerate")}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {!loading && photoCount === 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl glass-cosmic border border-primary/20 text-center">
          <Camera className="w-12 h-12 text-primary mx-auto mb-4 opacity-60" />
          <p className="text-foreground font-semibold mb-2">{t("outfits.noPhotosTitle")}</p>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{t("outfits.noPhotosDesc")}</p>
          <Button variant="cosmic" size="sm" onClick={() => navigate("/profile")}>
            <Camera className="w-4 h-4 mr-2" />
            {t("outfits.goUploadPhotos")}
          </Button>
        </motion.div>
      )}

      {!loading && photoCount > 0 && photoCount < 5 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{t("outfits.improveWithPhotos")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("outfits.photoPrompt", { count: photoCount, max: 10 })}
            </p>
            <Button variant="ghost" size="sm" className="mt-2 text-amber-500 hover:text-amber-400 p-0 h-auto" onClick={() => navigate("/profile")}>
              <Camera className="w-4 h-4 mr-1" />
              {t("outfits.uploadMore")}
            </Button>
          </div>
        </motion.div>
      )}

      {photoCount === 0 ? null : loading ? (
        <div className="glass-cosmic rounded-2xl p-12 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <div className="text-center">
            <p className="text-foreground font-medium">{t("outfits.generating")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("outfits.generatingDesc")}</p>
          </div>
        </div>
      ) : error ? (
        <div className="glass-cosmic rounded-2xl p-8 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="cosmic-outline" size="sm" onClick={() => fetchOutfits(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("common.retry")}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {outfits.map((url, index) => {
              const label = labels[index];
              const Icon = label?.icon || Sun;
              return (
                <OutfitCard key={index} url={url} icon={Icon} title={label?.title} subtitle={label?.subtitle} index={index} onLightbox={setLightboxUrl} t={t} />
              );
            })}
          </div>
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 p-4 rounded-xl glass-cosmic border border-border/30"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                ✨ {description}
              </p>
            </motion.div>
          )}
        </>
      )}

      {lightboxUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxUrl(null)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={() => setLightboxUrl(null)}>
            <X className="w-8 h-8" />
          </button>
          <img src={lightboxUrl} alt="Outfit" className="max-w-full max-h-[90vh] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
          <a href={lightboxUrl} download="outfit.png" className="absolute top-4 left-4 z-10 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity" onClick={(e) => e.stopPropagation()}>
            {t("common.downloadImage")}
          </a>
        </div>
      )}
    </motion.section>
  );
};

export default DailyOutfits;

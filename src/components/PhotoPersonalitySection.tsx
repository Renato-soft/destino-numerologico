import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, RefreshCw, Camera } from "lucide-react";

interface PhotoPersonalitySectionProps {
  userName: string;
}

const PhotoPersonalitySection = ({ userName }: PhotoPersonalitySectionProps) => {
  const { t, i18n } = useTranslation();
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasPhotos, setHasPhotos] = useState<boolean | null>(null);
  const [error, setError] = useState(false);

  const lang = i18n.language?.substring(0, 2) || "it";

  const analyzePhotos = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke("analyze-photos", {
        body: { language: lang },
      });

      if (response.error) throw response.error;

      const data = response.data;
      if (data.reason === "no_photos" || data.reason === "no_photos_loaded") {
        setHasPhotos(false);
        return;
      }

      setHasPhotos(true);
      setDescription(data.description);
    } catch (e) {
      console.error("Photo analysis error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user has photos
    const checkPhotos = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { count } = await supabase
        .from("photos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.user.id);
      setHasPhotos((count ?? 0) > 0);
    };
    checkPhotos();
  }, []);

  if (hasPhotos === false) {
    return (
      <section className="glass-cosmic rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Camera className="w-8 h-8 text-primary/60" />
        </div>
        <h2 className="font-display text-xl font-bold">{t("photoAnalysis.title")}</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {t("photoAnalysis.noPhotos")}
        </p>
      </section>
    );
  }

  if (hasPhotos === null) return null;

  return (
    <section className="glass-cosmic rounded-2xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold">{t("photoAnalysis.title")}</h2>
        </div>
        {description && (
          <Button variant="ghost" size="sm" onClick={analyzePhotos} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            {t("photoAnalysis.regenerate")}
          </Button>
        )}
      </div>

      {!description && !loading && !error && (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm mb-4">{t("photoAnalysis.cta")}</p>
          <Button variant="cosmic-outline" onClick={analyzePhotos} disabled={loading}>
            <Eye className="w-4 h-4 mr-2" />
            {t("photoAnalysis.analyze")}
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8 gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("photoAnalysis.analyzing")}</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-destructive text-sm mb-3">{t("photoAnalysis.error")}</p>
          <Button variant="outline" size="sm" onClick={analyzePhotos}>
            {t("photoAnalysis.retry")}
          </Button>
        </div>
      )}

      {description && !loading && (
        <div className="space-y-4">
          <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{description}</p>
          <div className="pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground italic">
              {t("photoAnalysis.disclaimer")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoPersonalitySection;

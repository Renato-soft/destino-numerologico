import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Shirt, Sun, Moon, Loader2, RefreshCw, X, Camera, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DailyOutfits = () => {
  const [outfits, setOutfits] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const navigate = useNavigate();

  const fetchOutfits = async (force = false) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Check photo count
      const { count } = await supabase
        .from("photos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.user.id);
      setPhotoCount(count || 0);

      const { data, error: fnError } = await supabase.functions.invoke("generate-outfits", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { force },
      });

      if (fnError) {
        console.error("Edge function error:", fnError);
        setError("Impossibile generare gli outfit. Riprova più tardi.");
        setLoading(false);
        return;
      }

      if (data?.outfits) {
        setOutfits(data.outfits);
      } else if (data?.error) {
        setError(data.error);
      }
    } catch (e) {
      console.error("Fetch outfits error:", e);
      setError("Errore di connessione. Riprova più tardi.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const labels = [
    { title: "Look Giorno 1", icon: Sun, subtitle: "Casual-smart per il lavoro" },
    { title: "Look Giorno 2", icon: Sun, subtitle: "Alternativa diurna" },
    { title: "Look Sera 1", icon: Moon, subtitle: "Elegante per uscire" },
    { title: "Look Sera 2", icon: Moon, subtitle: "Alternativa serale" },
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
            <h2 className="font-display text-xl font-semibold">
              Outfit del Giorno
            </h2>
            <p className="text-sm text-muted-foreground">
              Abbigliamento consigliato in base alla tua vibrazione
            </p>
          </div>
        </div>
        {!loading && (
          <Button
            variant="ghost"
            size="icon"
             onClick={() => fetchOutfits(true)}
            title="Rigenera outfit"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Photo prompt banner */}
      {!loading && photoCount < 5 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Migliora i tuoi outfit con più foto!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Caricando più foto del tuo viso e del tuo corpo, l'AI potrà analizzare meglio espressioni, 
              colorito e corporatura per consigli ancora più personalizzati. Attualmente hai {photoCount} foto su 10.
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-amber-500 hover:text-amber-400 p-0 h-auto"
              onClick={() => navigate("/profile")}
            >
              <Camera className="w-4 h-4 mr-1" />
              Carica più foto →
            </Button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="glass-cosmic rounded-2xl p-12 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <div className="text-center">
            <p className="text-foreground font-medium">Generazione outfit in corso...</p>
            <p className="text-sm text-muted-foreground mt-1">
              L'AI sta creando 4 look personalizzati per te
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="glass-cosmic rounded-2xl p-8 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="cosmic-outline" size="sm" onClick={() => fetchOutfits(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Riprova
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {outfits.map((url, index) => {
            const label = labels[index];
            const Icon = label?.icon || Sun;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                className="glass-cosmic rounded-2xl overflow-hidden group"
              >
                <div className="p-3 flex items-center gap-2 border-b border-border/30">
                  <Icon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label?.title}</p>
                    <p className="text-xs text-muted-foreground">{label?.subtitle}</p>
                  </div>
                </div>
                {url ? (
                  <div
                    className="aspect-[3/4] cursor-pointer relative overflow-hidden"
                    onClick={() => setLightboxUrl(url)}
                  >
                    <img
                      src={url}
                      alt={label?.title || "Outfit"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center bg-muted/20">
                    <p className="text-sm text-muted-foreground">Non disponibile</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxUrl}
            alt="Outfit"
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <a
            href={lightboxUrl}
            download="outfit.png"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            Scarica immagine
          </a>
        </div>
      )}
    </motion.section>
  );
};

export default DailyOutfits;

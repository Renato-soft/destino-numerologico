import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Home,
  Sparkles,
  Building2,
  MapPin,
  Layers,
  Heart,
  Shield,
  Lightbulb,
} from "lucide-react";
import {
  calculateHouseVibration,
  houseVibrations,
  getHouseLifePathCompatibility,
  calculateFloorVibration,
} from "@/lib/houseNumerology";

export default function HouseAnalyzer() {
  const navigate = useNavigate();
  const [civicNumber, setCivicNumber] = useState("");
  const [city, setCity] = useState("");
  const [floor, setFloor] = useState("");
  const [lifePath, setLifePath] = useState<number | null>(null);
  const [result, setResult] = useState<{
    vibration: number;
    compatibility: { score: number; level: string; description: string } | null;
    floorInfo: { number: number; influence: string } | null;
  } | null>(null);

  useEffect(() => {
    const loadLifePath = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data } = await supabase
        .from("numerology_maps")
        .select("life_path")
        .eq("user_id", session.user.id)
        .order("computed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setLifePath(data.life_path);
    };
    loadLifePath();
  }, [navigate]);

  const handleAnalyze = () => {
    const trimmed = civicNumber.trim();
    if (!trimmed) return;
    const vibration = calculateHouseVibration(trimmed);
    if (vibration === 0) return;

    const compatibility = lifePath
      ? getHouseLifePathCompatibility(vibration, lifePath)
      : null;

    const floorInfo = floor.trim()
      ? calculateFloorVibration(parseInt(floor.trim(), 10) || 0)
      : null;

    setResult({ vibration, compatibility, floorInfo });
  };

  const meaning = result ? houseVibrations[result.vibration] : null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  const getGaugeOffset = (score: number) => {
    const circumference = 2 * Math.PI * 54;
    return circumference - (score / 100) * circumference;
  };

  return (
    <DashboardLayout title="Vibrazione Casa">
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-cosmic rounded-2xl p-6 space-y-5"
        >
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="w-4 h-4 text-primary" />
              Numero Civico *
            </Label>
            <Input
              placeholder="Es. 42, 7A, 15/B"
              value={civicNumber}
              onChange={(e) => setCivicNumber(e.target.value)}
              maxLength={10}
              className="bg-input/50 border-border/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Città (opzionale)
              </Label>
              <Input
                placeholder="Es. Milano"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={50}
                className="bg-input/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Layers className="w-4 h-4 text-muted-foreground" />
                Piano (opzionale)
              </Label>
              <Input
                type="number"
                placeholder="Es. 3"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                min={-5}
                max={200}
                className="bg-input/50 border-border/50"
              />
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!civicNumber.trim()}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Analizza Vibrazione
          </Button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && meaning && (
            <motion.div
              key={result.vibration}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* House visualization */}
              <div className="glass-cosmic rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                
                {/* Stylized house SVG */}
                <div className="relative mx-auto w-48 h-48 mb-6">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* House body */}
                    <rect x="40" y="90" width="120" height="90" rx="4"
                      className="fill-muted/30 stroke-primary/40" strokeWidth="2" />
                    {/* Roof */}
                    <polygon points="100,20 20,90 180,90"
                      className="fill-muted/20 stroke-primary/60" strokeWidth="2" />
                    {/* Door */}
                    <rect x="80" y="130" width="40" height="50" rx="3"
                      className="fill-primary/20 stroke-primary/50" strokeWidth="1.5" />
                    {/* Windows */}
                    <rect x="52" y="105" width="24" height="20" rx="2"
                      className="fill-accent/15 stroke-accent/40" strokeWidth="1" />
                    <rect x="124" y="105" width="24" height="20" rx="2"
                      className="fill-accent/15 stroke-accent/40" strokeWidth="1" />
                    {/* Number on door */}
                    <text x="100" y="162" textAnchor="middle"
                      className="fill-primary font-display text-2xl font-bold" fontSize="22">
                      {result.vibration}
                    </text>
                  </svg>
                  {/* Glow effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 blur-xl animate-pulse" />
                  </div>
                </div>

                <div className="relative">
                  <span className="text-4xl mb-2 block">{meaning.emoji}</span>
                  <h2 className="font-display text-2xl font-bold mb-1">
                    Casa {result.vibration}: {meaning.keyword}
                  </h2>
                  {city && (
                    <p className="text-sm text-muted-foreground mb-3">
                      📍 {city} — N° {civicNumber}
                    </p>
                  )}
                  <div className="flex justify-center gap-3 text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded-full bg-muted/40">
                      {meaning.element}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-muted/40">
                      {meaning.color}
                    </span>
                  </div>
                </div>
              </div>

              {/* Energy description */}
              <div className="glass-cosmic rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Energia dello Spazio
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {meaning.energy}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                    <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Ideale per</p>
                    <p className="text-sm text-muted-foreground">{meaning.ideal}</p>
                  </div>
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4">
                    <p className="text-xs font-semibold text-rose-400 mb-1">⚠️ Meno indicata per</p>
                    <p className="text-sm text-muted-foreground">{meaning.notIdeal}</p>
                  </div>
                </div>
              </div>

              {/* Floor influence */}
              {result.floorInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-cosmic rounded-2xl p-6"
                >
                  <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-accent" />
                    Influenza del Piano ({floor}° — Vibrazione {result.floorInfo.number})
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.floorInfo.influence}
                  </p>
                </motion.div>
              )}

              {/* Compatibility with Life Path */}
              {result.compatibility && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-cosmic rounded-2xl p-6"
                >
                  <h3 className="font-display font-semibold flex items-center gap-2 mb-5">
                    <Heart className="w-4 h-4 text-primary" />
                    Compatibilità con il tuo Destino ({lifePath})
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Gauge */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                        <circle cx="60" cy="60" r="54" fill="none"
                          className="stroke-muted/30" strokeWidth="8" />
                        <circle cx="60" cy="60" r="54" fill="none"
                          className={`${getScoreColor(result.compatibility.score).replace("text-", "stroke-")}`}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 54}`}
                          strokeDashoffset={getGaugeOffset(result.compatibility.score)}
                          style={{ transition: "stroke-dashoffset 1s ease-out" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(result.compatibility.score)}`}>
                          {result.compatibility.score}%
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {result.compatibility.level}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {result.compatibility.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Harmonization */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-cosmic rounded-2xl p-6"
              >
                <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  Armonizzazione Energetica
                </h3>
                <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {meaning.harmonization}
                  </p>
                </div>
              </motion.div>

              {/* Not logged in warning */}
              {!lifePath && (
                <div className="glass-cosmic rounded-2xl p-5 text-center">
                  <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Genera la tua{" "}
                    <Link to="/map" className="text-primary underline">Mappa Numerologica</Link>{" "}
                    per scoprire la compatibilità con il tuo Destino.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

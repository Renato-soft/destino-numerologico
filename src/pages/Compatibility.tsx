import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  ArrowLeft,
  Download,
  Loader2,
  Users,
  Heart,
  MessageCircle,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  Lock,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  calculatePersonBNumbers,
  calculateCompatibility,
  type PersonNumbers,
  type CompatibilityResult,
} from "@/lib/compatibility";
import { jsPDF } from "jspdf";

interface Profile {
  nome: string;
  cognome: string;
  birth_date: string;
}

const Compatibility = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myNumbers, setMyNumbers] = useState<PersonNumbers | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [personBNumbers, setPersonBNumbers] = useState<PersonNumbers | null>(null);

  // Form fields for Person B
  const [bNome, setBNome] = useState("");
  const [bCognome, setBCognome] = useState("");
  const [bBirthDate, setBBirthDate] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  const isPremium = false; // TODO: wire to actual premium status

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("nome, cognome, birth_date")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!profileData) { navigate("/onboarding"); return; }
    setProfile(profileData);

    // Load latest map for Person A numbers
    const { data: mapData } = await supabase
      .from("numerology_maps")
      .select("life_path, destiny_expression, soul, personality")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (mapData) {
      setMyNumbers({
        lifePath: mapData.life_path,
        expression: mapData.destiny_expression,
        soul: mapData.soul,
        personality: mapData.personality,
      });
    }

    setLoading(false);
  };

  const handleCalculate = () => {
    if (!myNumbers) {
      toast({ title: "Mappa mancante", description: "Genera prima la tua Mappa Numerologica.", variant: "destructive" });
      return;
    }
    if (!bNome.trim() || !bCognome.trim() || !bBirthDate) {
      toast({ title: "Dati incompleti", description: "Inserisci tutti i dati della Persona B.", variant: "destructive" });
      return;
    }

    setCalculating(true);
    try {
      const bNumbers = calculatePersonBNumbers(bNome.trim(), bCognome.trim(), bBirthDate);
      setPersonBNumbers(bNumbers);
      const compatibility = calculateCompatibility(myNumbers, bNumbers);
      setResult(compatibility);
    } catch {
      toast({ title: "Errore", description: "Errore nel calcolo.", variant: "destructive" });
    } finally {
      setCalculating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!result || !profile || !myNumbers || !personBNumbers) return;

    const doc = new jsPDF();
    const margin = 20;
    const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let y = 20;

    const addText = (text: string, fontSize = 11, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize * 0.5;
      if (y + lines.length * lineHeight > 280) { doc.addPage(); y = 20; }
      doc.text(lines, margin, y);
      y += lines.length * lineHeight + 4;
    };

    const addSection = (title: string) => {
      y += 6;
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, y);
      y += 10;
    };

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Analisi della Compatibilità Numerologica", margin, y);
    y += 12;

    addText(`${profile.nome} ${profile.cognome} vs ${bNome} ${bCognome}`);
    y += 4;

    addSection("Punteggi di Compatibilità");
    addText(`Compatibilità Generale: ${result.overall}%`);
    addText(`Compatibilità Emotiva: ${result.emotional}%`);
    addText(`Compatibilità Comunicativa: ${result.communicative}%`);
    addText(`Compatibilità Professionale: ${result.professional}%`);

    addSection("Confronto Numeri");
    addText(`Destino: ${myNumbers.lifePath} vs ${personBNumbers.lifePath} — ${result.details.lifePath.note}`);
    addText(`Anima: ${myNumbers.soul} vs ${personBNumbers.soul} — ${result.details.soul.note}`);
    addText(`Io: ${myNumbers.expression} vs ${personBNumbers.expression} — ${result.details.expression.note}`);
    addText(`Personalità: ${myNumbers.personality} vs ${personBNumbers.personality} — ${result.details.personality.note}`);

    addSection("Dinamica della Relazione");
    addText(result.dynamicDescription);

    addSection("Punti di Attrito");
    result.frictionPoints.forEach(p => addText(`• ${p}`));

    addSection("Suggerimenti Pratici");
    result.suggestions.forEach(s => addText(`• ${s}`));

    doc.save(`Compatibilità_${profile.nome}_${bNome}.pdf`);
  };

  const radarData = result ? [
    { subject: "Destino", A: result.details.lifePath.score, B: 100 },
    { subject: "Anima", A: result.details.soul.score, B: 100 },
    { subject: "Io", A: result.details.expression.score, B: 100 },
    { subject: "Personalità", A: result.details.personality.score, B: 100 },
    { subject: "Emotiva", A: result.emotional, B: 100 },
    { subject: "Professionale", A: result.professional, B: 100 },
  ] : [];

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
  const compatHeaderActions = result ? (
    <Button variant="cosmic-outline" size="sm" onClick={handleDownloadPdf}>
      <Download className="w-4 h-4 mr-2" />
      Scarica PDF
    </Button>
  ) : undefined;

  return (
    <DashboardLayout title="Compatibilità" headerActions={compatHeaderActions}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* My numbers */}
        {!myNumbers ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">Genera prima la tua Mappa</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Per calcolare la compatibilità, devi prima generare la tua Mappa Numerologica.
            </p>
            <Button variant="cosmic" size="xl" asChild>
              <Link to="/map"><Sparkles className="w-5 h-5 mr-2" />Vai alla Mappa</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Input form for Person B */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-cosmic rounded-2xl p-8">
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Analisi della Compatibilità
              </h1>
              <p className="text-muted-foreground mb-6">
                Inserisci i dati della persona con cui vuoi confrontare la tua mappa.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="bNome">Nome</Label>
                  <Input id="bNome" value={bNome} onChange={e => setBNome(e.target.value)} placeholder="Nome" className="input-cosmic" maxLength={50} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bCognome">Cognome</Label>
                  <Input id="bCognome" value={bCognome} onChange={e => setBCognome(e.target.value)} placeholder="Cognome" className="input-cosmic" maxLength={50} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bBirthDate">Data di nascita</Label>
                  <Input id="bBirthDate" type="date" value={bBirthDate} onChange={e => setBBirthDate(e.target.value)} className="input-cosmic" />
                </div>
              </div>

              <Button variant="cosmic" onClick={handleCalculate} disabled={calculating} className="w-full md:w-auto">
                {calculating ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Calcolo in corso...</>
                ) : (
                  <><Users className="w-5 h-5 mr-2" />Calcola Compatibilità</>
                )}
              </Button>
            </motion.div>

            {/* Results */}
            {result && personBNumbers && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                {/* Overall score */}
                <div className="glass-cosmic rounded-2xl p-8 text-center">
                  <h2 className="font-display text-xl font-bold mb-4">Compatibilità Generale</h2>
                  <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full mb-4">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                        strokeDasharray={`${(result.overall / 100) * 327} 327`}
                        strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                    <span className="absolute font-display text-3xl font-bold text-primary">{result.overall}%</span>
                  </div>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    {profile?.nome} & {bNome}
                  </p>
                </div>

                {/* Sub-scores */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: "Amore", value: result.emotional, icon: Heart, color: "from-rose-500 to-pink-500" },
                    { label: "Comunicazione", value: result.communicative, icon: MessageCircle, color: "from-blue-500 to-cyan-500" },
                    { label: "Lavoro", value: result.professional, icon: Briefcase, color: "from-amber-500 to-orange-500" },
                    { label: "Sfide", value: result.challenges, icon: AlertTriangle, color: "from-purple-500 to-violet-500" },
                    { label: "Crescita", value: result.growth, icon: Lightbulb, color: "from-emerald-500 to-teal-500" },
                  ].map(item => (
                    <div key={item.label} className="glass-cosmic rounded-xl p-6 text-center">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-display text-2xl font-bold mb-1">{item.value}%</p>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Radar chart */}
                <div className="glass-cosmic rounded-2xl p-8">
                  <h2 className="font-display text-xl font-bold mb-6 text-center">Grafico Comparativo</h2>
                  <div className="w-full h-[350px]">
                    <ResponsiveContainer>
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="hsl(232, 30%, 25%)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(220, 20%, 65%)", fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(220, 20%, 65%)", fontSize: 10 }} />
                        <Radar name="Compatibilità" dataKey="A" stroke="hsl(43, 89%, 58%)" fill="hsl(43, 89%, 58%)" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Number comparisons */}
                <div className="glass-cosmic rounded-2xl p-8">
                  <h2 className="font-display text-xl font-bold mb-6">Confronto Numeri</h2>
                  <div className="space-y-6">
                    {[
                      { label: "Destino", data: result.details.lifePath },
                      { label: "Anima", data: result.details.soul },
                      { label: "Io", data: result.details.expression },
                      { label: "Personalità", data: result.details.personality },
                    ].map(item => (
                      <div key={item.label} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-semibold">{item.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="number-circle w-10 h-10 text-lg">{item.data.a}</span>
                            <span className="text-muted-foreground text-sm">vs</span>
                            <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-secondary-foreground">{item.data.b}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.data.note}</p>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-700" style={{ width: `${item.data.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dinamica della relazione */}
                <div className="glass-cosmic rounded-2xl p-8">
                  <h2 className="font-display text-xl font-bold mb-4">Dinamica della Relazione</h2>
                  <p className="text-foreground/90 leading-relaxed">{result.dynamicDescription}</p>
                </div>

                {/* Sfide */}
                <div className="glass-cosmic rounded-2xl p-8">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-purple-400" />
                    Sfide della Relazione
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-4">{result.challengeDescription}</p>
                  {result.frictionPoints.slice(0, isPremium ? undefined : 1).map((point, i) => (
                    <p key={i} className="text-foreground/90 mb-3">• {point}</p>
                  ))}
                  {!isPremium && result.frictionPoints.length > 1 && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/50 flex items-center gap-3">
                      <Lock className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-semibold">Premium:</span> Sblocca tutti i {result.frictionPoints.length} punti di attrito.
                      </p>
                    </div>
                  )}
                </div>

                {/* Crescita */}
                <div className="glass-cosmic rounded-2xl p-8">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-emerald-400" />
                    Potenziale di Crescita
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-4">{result.growthDescription}</p>
                  {result.suggestions.slice(0, isPremium ? undefined : 1).map((s, i) => (
                    <p key={i} className="text-foreground/90 mb-3">• {s}</p>
                  ))}
                  {!isPremium && result.suggestions.length > 1 && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/50 flex items-center gap-3">
                      <Lock className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-semibold">Premium:</span> Accedi a tutti i suggerimenti personalizzati.
                      </p>
                    </div>
                  )}
                </div>

                {/* Dinamica della relazione */}
                <div className="glass-cosmic rounded-2xl p-8">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Punti di Attrito
                  </h2>
                  {result.frictionPoints.slice(0, isPremium ? undefined : 1).map((point, i) => (
                    <p key={i} className="text-foreground/90 mb-3">• {point}</p>
                  ))}
                  {!isPremium && result.frictionPoints.length > 1 && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/50 flex items-center gap-3">
                      <Lock className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-semibold">Premium:</span> Sblocca tutti i {result.frictionPoints.length} punti di attrito e i suggerimenti completi.
                      </p>
                    </div>
                  )}
                </div>

                {/* Suggestions - preview */}
                <div className="glass-cosmic rounded-2xl p-8">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Suggerimenti Pratici
                  </h2>
                  {result.suggestions.slice(0, isPremium ? undefined : 1).map((s, i) => (
                    <p key={i} className="text-foreground/90 mb-3">• {s}</p>
                  ))}
                  {!isPremium && result.suggestions.length > 1 && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/50 flex items-center gap-3">
                      <Lock className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-semibold">Premium:</span> Accedi a tutti i suggerimenti personalizzati per comunicare al meglio.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Compatibility;

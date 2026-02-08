import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  calculateLifePath,
  calculateExpression,
  calculateSoul,
  calculatePersonality,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculateLifeCycles,
  numberMeanings,
  masterMeanings,
  personalYearMeanings,
  destinyArchetypes,
} from "@/lib/numerology";
import {
  Sparkles,
  ArrowLeft,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface Profile {
  nome: string;
  cognome: string;
  birth_date: string;
}

interface NumerologyData {
  lifePath: number;
  expression: number;
  soul: number;
  personality: number;
  personalYear: number;
  personalMonth: number;
  cycles: ReturnType<typeof calculateLifeCycles>;
  rawCalculations: object;
}

const NumerologyMap = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [numerologyData, setNumerologyData] = useState<NumerologyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [existingMapId, setExistingMapId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("nome, cognome, birth_date")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!profileData) {
      navigate("/onboarding");
      return;
    }

    setProfile(profileData);

    // Check for existing map
    const { data: mapData } = await supabase
      .from("numerology_maps")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (mapData) {
      setExistingMapId(mapData.id);
      setNumerologyData({
        lifePath: mapData.life_path,
        expression: mapData.destiny_expression,
        soul: mapData.soul,
        personality: mapData.personality,
        personalYear: mapData.personal_year,
        personalMonth: mapData.personal_month || calculatePersonalMonth(mapData.personal_year, new Date().getMonth() + 1),
        cycles: mapData.cycles_json as ReturnType<typeof calculateLifeCycles>,
        rawCalculations: mapData.raw_calculations_json as object,
      });
    }

    setLoading(false);
  };

  const generateMap = async () => {
    if (!profile) return;

    setGenerating(true);

    try {
      const [year, month, day] = profile.birth_date.split("-").map(Number);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const fullName = `${profile.nome} ${profile.cognome}`;

      // Calculate all numbers
      const lifePath = calculateLifePath(day, month, year);
      const expression = calculateExpression(fullName);
      const soul = calculateSoul(fullName);
      const personality = calculatePersonality(fullName);
      const personalYear = calculatePersonalYear(day, month, currentYear);
      const personalMonth = calculatePersonalMonth(personalYear, currentMonth);
      const cycles = calculateLifeCycles(day, month, year);

      const rawCalculations = {
        birthDate: { day, month, year },
        fullName,
        currentYear,
        currentMonth,
        calculatedAt: new Date().toISOString(),
      };

      const data: NumerologyData = {
        lifePath,
        expression,
        soul,
        personality,
        personalYear,
        personalMonth,
        cycles,
        rawCalculations,
      };

      // Save to database
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: savedMap, error } = await supabase
        .from("numerology_maps")
        .insert({
          user_id: session.user.id,
          life_path: lifePath,
          destiny_expression: expression,
          soul,
          personality,
          personal_year: personalYear,
          personal_year_reference: currentYear,
          personal_month: personalMonth,
          cycles_json: cycles,
          raw_calculations_json: rawCalculations,
        })
        .select()
        .single();

      if (error) throw error;

      setNumerologyData(data);
      setExistingMapId(savedMap.id);

      toast({
        title: "Mappa generata!",
        description: "La tua mappa numerologica è pronta.",
      });
    } catch (error) {
      console.error("Error generating map:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione della mappa.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getNumberDescription = (num: number, type: 'lifePath' | 'expression' | 'soul' | 'personality') => {
    const baseNum = num > 9 ? (num === 11 ? 2 : num === 22 ? 4 : num === 33 ? 6 : num) : num;
    const meaning = numberMeanings[baseNum];
    const master = masterMeanings[num];
    const archetype = destinyArchetypes[baseNum];

    return { meaning, master, archetype };
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

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">La tua Mappa</span>
            </div>
          </div>

          {numerologyData && (
            <Button variant="cosmic-outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Scarica PDF
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {!numerologyData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">
              Genera la tua Mappa Numerologica
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Scopri i tuoi numeri personali e ricevi una lettura completa basata sulla numerologia pitagorica.
            </p>
            <Button
              variant="cosmic"
              size="xl"
              onClick={generateMap}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generazione in corso...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Genera la Mappa
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Premium header */}
            <div className="glass-cosmic rounded-2xl p-8 text-center">
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Mappa numerologica completa – Versione Premium
              </h1>
              <p className="text-muted-foreground text-lg">
                <span className="text-primary font-semibold">{profile?.nome}</span>,
                questa mappa numerologica è costruita secondo le regole della numerologia pitagorica classica,
                mantenendo coerenza numerica dall'inizio alla fine. L'analisi che segue integra i tuoi numeri
                principali in una lettura unitaria, chiara e approfondita.
              </p>
            </div>

            {/* Numbers grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Life Path", value: numerologyData.lifePath, key: 'lifePath' as const },
                { label: "Espressione", value: numerologyData.expression, key: 'expression' as const },
                { label: "Anima", value: numerologyData.soul, key: 'soul' as const },
                { label: "Personalità", value: numerologyData.personality, key: 'personality' as const },
              ].map((item) => (
                <div key={item.label} className="glass-cosmic rounded-xl p-6 text-center">
                  <div className="number-circle number-circle-lg mx-auto mb-3">
                    {item.value}
                  </div>
                  <p className="font-display font-semibold">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Life Path section */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="number-circle">{numerologyData.lifePath}</span>
                Cammino di Vita {numerologyData.lifePath}
              </h2>
              <div className="prose prose-invert max-w-none">
                {(() => {
                  const { meaning, master, archetype } = getNumberDescription(numerologyData.lifePath, 'lifePath');
                  return (
                    <>
                      <p className="text-foreground/90">
                        Il tuo Cammino di Vita {numerologyData.lifePath} rivela la direzione fondamentale della tua esistenza.
                        Le parole chiave che caratterizzano questo percorso sono: <strong>{meaning?.keywords.join(', ')}</strong>.
                        Questo numero indica che sei qui per sviluppare qualità di {meaning?.talents.join(', ')}.
                      </p>
                      <p className="text-foreground/90">
                        Il tuo percorso evolutivo ti chiede di {meaning?.evolution}. Nella quotidianità, questo si manifesta
                        nella tua capacità naturale di affrontare le situazioni con {meaning?.talents[0]}.
                        Tuttavia, dovrai fare attenzione alle ombre di questo numero: {meaning?.shadows.join(', ')}.
                      </p>
                      {master && (
                        <p className="text-primary/90 italic">
                          Come numero maestro, il {numerologyData.lifePath} porta con sé un'energia particolare:
                          {master.description}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </section>

            {/* Expression section */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="number-circle">{numerologyData.expression}</span>
                Numero di Espressione/Destino {numerologyData.expression}
              </h2>
              <div className="prose prose-invert max-w-none">
                {(() => {
                  const { meaning, archetype } = getNumberDescription(numerologyData.expression, 'expression');
                  return (
                    <>
                      <p className="text-foreground/90">
                        {archetype && <strong>Archetipo: {archetype.archetype}. </strong>}
                        Il tuo Numero di Espressione {numerologyData.expression}, derivato dalle lettere del tuo nome completo,
                        indica il modo in cui ti esprimi nel mondo e il tuo potenziale naturale.
                        {archetype && ` ${archetype.description}`}
                      </p>
                      <p className="text-foreground/90">
                        I tuoi talenti innati includono: {meaning?.talents.join(', ')}.
                        Nella vita quotidiana, questo si traduce nella capacità di {meaning?.evolution}.
                        Lavora consapevolmente sulle ombre ({meaning?.shadows.join(', ')}) per esprimere
                        al meglio le qualità positive di questo numero.
                      </p>
                    </>
                  );
                })()}
              </div>
            </section>

            {/* Soul section */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="number-circle">{numerologyData.soul}</span>
                Numero dell'Anima {numerologyData.soul}
              </h2>
              <div className="prose prose-invert max-w-none">
                {(() => {
                  const { meaning } = getNumberDescription(numerologyData.soul, 'soul');
                  return (
                    <>
                      <p className="text-foreground/90">
                        Il Numero dell'Anima {numerologyData.soul}, calcolato dalle vocali del tuo nome,
                        rivela i tuoi desideri più profondi e ciò che realmente ti motiva.
                        Le parole chiave sono: {meaning?.keywords.join(', ')}.
                      </p>
                      <p className="text-foreground/90">
                        Nel profondo del tuo cuore desideri esprimere {meaning?.talents.join(' e ')}.
                        Questa è la forza che ti spinge nelle scelte più importanti della vita.
                        Per soddisfare la tua anima, ricorda di {meaning?.evolution}.
                      </p>
                    </>
                  );
                })()}
              </div>
            </section>

            {/* Personality section */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="number-circle">{numerologyData.personality}</span>
                Numero della Personalità {numerologyData.personality}
              </h2>
              <div className="prose prose-invert max-w-none">
                {(() => {
                  const { meaning } = getNumberDescription(numerologyData.personality, 'personality');
                  return (
                    <>
                      <p className="text-foreground/90">
                        Il Numero della Personalità {numerologyData.personality}, derivato dalle consonanti,
                        rappresenta la maschera che mostri al mondo esterno e il modo in cui gli altri ti percepiscono.
                        I tratti caratteristici sono: {meaning?.keywords.join(', ')}.
                      </p>
                      <p className="text-foreground/90">
                        Gli altri ti vedono come una persona dotata di {meaning?.talents.join(', ')}.
                        Questa è l'immagine che proietti, anche se dentro di te potresti sentirti diversamente.
                        Lavorare sull'equilibrio tra personalità e anima ti aiuterà a {meaning?.evolution}.
                      </p>
                    </>
                  );
                })()}
              </div>
            </section>

            {/* Life Cycles section */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-6">Cicli della Vita</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Primo Ciclo della Vita",
                    cycle: numerologyData.cycles.firstCycle,
                    period: `dalla nascita (${numerologyData.cycles.firstCycle.startYear}) fino al passaggio tra ${numerologyData.cycles.firstCycle.endYear - 2} e ${numerologyData.cycles.firstCycle.endYear}`,
                  },
                  {
                    title: "Secondo Ciclo della Vita",
                    cycle: numerologyData.cycles.secondCycle,
                    period: `dal passaggio (${numerologyData.cycles.secondCycle.startYear}-${numerologyData.cycles.secondCycle.startYear + 2}) fino a ${numerologyData.cycles.secondCycle.endYear}`,
                  },
                  {
                    title: "Terzo Ciclo della Vita",
                    cycle: numerologyData.cycles.thirdCycle,
                    period: `dal passaggio (${numerologyData.cycles.thirdCycle.startYear}) in poi`,
                  },
                ].map((item, index) => {
                  const meaning = numberMeanings[item.cycle.number > 9 ? (item.cycle.number === 11 ? 2 : item.cycle.number === 22 ? 4 : 6) : item.cycle.number];
                  return (
                    <div key={index} className="border-l-2 border-primary/30 pl-6">
                      <h3 className="font-display font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Periodo: {item.period} • Numero del ciclo: {item.cycle.number}
                      </p>
                      <p className="text-foreground/90">
                        Questo ciclo, governato dal numero {item.cycle.number}, porta con sé l'energia di
                        {meaning?.keywords.join(', ')}. Durante questo periodo, sei chiamato a sviluppare
                        {meaning?.talents.join(' e ')}, imparando progressivamente a {meaning?.evolution}.
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Personal Year section */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="number-circle">{numerologyData.personalYear}</span>
                Anno Personale {new Date().getFullYear()}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/90 font-medium mb-4">
                  {personalYearMeanings[numerologyData.personalYear]}
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {[
                    { title: "Lavoro e Carriera", icon: "💼" },
                    { title: "Amore e Relazioni", icon: "❤️" },
                    { title: "Denaro e Gestione", icon: "💰" },
                    { title: "Benessere e Energia", icon: "🌿" },
                    { title: "Crescita Personale", icon: "🌟" },
                  ].map((area) => (
                    <div key={area.title} className="p-4 rounded-lg bg-background/50">
                      <h4 className="font-semibold mb-2">{area.icon} {area.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        In quest'ambito, l'Anno Personale {numerologyData.personalYear} ti invita a focalizzarti
                        su {numberMeanings[numerologyData.personalYear > 9 ? (numerologyData.personalYear === 11 ? 2 : numerologyData.personalYear === 22 ? 4 : 6) : numerologyData.personalYear]?.keywords[0]}.
                        È un periodo favorevole per {numberMeanings[numerologyData.personalYear > 9 ? (numerologyData.personalYear === 11 ? 2 : numerologyData.personalYear === 22 ? 4 : 6) : numerologyData.personalYear]?.evolution}.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Closing */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4">Approfondimenti disponibili</h2>
              <ul className="space-y-2 text-foreground/90">
                <li>– Proiezione mese per mese basata sull'Anno Personale</li>
                <li>– Analisi della giornata (oggi, domani o data specifica)</li>
                <li>– Date favorevoli per obiettivi concreti (colloqui, firmare contratti, relazioni sentimentali, etc...)</li>
                <li>– Spiegami il mio Life Path in modo pratico</li>
                <li>– Quali sono i miei talenti nascosti</li>
                <li>– Quale lavoro è in linea con la mia mappa</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Scrivimi quale approfondimento desideri e il periodo di riferimento. Oppure fammi una domanda
              </p>
              <Button variant="cosmic" className="mt-6" asChild>
                <Link to="/chat">Parla con l'Esperto AI</Link>
              </Button>
            </section>

            {/* Regenerate button */}
            <div className="text-center py-8">
              <Button
                variant="outline"
                onClick={generateMap}
                disabled={generating}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                Rigenera Mappa
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default NumerologyMap;

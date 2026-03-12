import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import {
  calculateLifePath,
  calculateExpression,
  calculateSoul,
  calculatePersonality,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculateLifeCycles,
  calculateQuintessenza,
  numberMeanings,
  masterMeanings,
  personalYearMeanings,
  destinyArchetypes,
} from "@/lib/numerology";
import { soulDescriptions } from "@/lib/soulDescriptions";
import { generateNumerologyPdf } from "@/lib/generatePdf";
import NumerologyPyramid from "@/components/NumerologyPyramid";
import {
  Sparkles,
  ArrowLeft,
  Download,
  RefreshCw,
  Loader2,
  ChevronDown,
  Lock,
  Crown,
} from "lucide-react";
import { getPersonalYearSectors, sectorMeta, type SectorKey } from "@/lib/personalYearSectors";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  quintessenza: number;
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
  const { canAccess } = useSubscription();
  const hasMapAccess = canAccess("/map");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

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

    const { data: mapData } = await supabase
      .from("numerology_maps")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (mapData) {
      setExistingMapId(mapData.id);
      const expression = mapData.destiny_expression;
      const lifePath = mapData.life_path;
      setNumerologyData({
        lifePath,
        expression,
        soul: mapData.soul,
        personality: mapData.personality,
        quintessenza: calculateQuintessenza(expression, lifePath),
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

      const lifePath = calculateLifePath(day, month, year);
      const expression = calculateExpression(fullName);
      const soul = calculateSoul(fullName);
      const personality = calculatePersonality(fullName);
      const quintessenza = calculateQuintessenza(expression, lifePath);
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
        quintessenza,
        personalYear,
        personalMonth,
        cycles,
        rawCalculations,
      };

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

  const getSoulDesc = (num: number) => {
    return soulDescriptions[num] || soulDescriptions[num > 9 ? (num === 11 ? 11 : num === 22 ? 22 : num % 9 || 9) : num];
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
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

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

          {numerologyData && profile && (
            <Button 
              variant="cosmic-outline" 
              size="sm"
              onClick={() => generateNumerologyPdf(profile, numerologyData, new Date().getFullYear())}
            >
              <Download className="w-4 h-4 mr-2" />
              Scarica PDF
            </Button>
          )}
        </div>
      </header>

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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Destino", value: numerologyData.lifePath, key: 'lifePath' as const },
                { label: "Io", value: numerologyData.expression, key: 'expression' as const },
                { label: "Anima", value: numerologyData.soul, key: 'soul' as const },
                { label: "Personalità", value: numerologyData.personality, key: 'personality' as const },
                { label: "Quintessenza", value: numerologyData.quintessenza, key: 'quintessenza' as const },
              ].map((item) => (
                <div key={item.label} className="glass-cosmic rounded-xl p-6 text-center">
                  <div className="number-circle number-circle-lg mx-auto mb-3">
                    {item.value}
                  </div>
                  <p className="font-display font-semibold">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Pyramid Diagram */}
            <NumerologyPyramid
              destino={numerologyData.lifePath}
              io={numerologyData.expression}
              anima={numerologyData.soul}
              persona={numerologyData.personality}
              quintessenza={numerologyData.quintessenza}
            />

            {/* Destino section - always visible */}
            {/* Destino (was Life Path) section */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="number-circle">{numerologyData.lifePath}</span>
                Destino {numerologyData.lifePath}
              </h2>
              <div className="prose prose-invert max-w-none">
                {(() => {
                  const { meaning, master, archetype } = getNumberDescription(numerologyData.lifePath, 'lifePath');
                  return (
                    <>
                      <p className="text-foreground/90">
                        Il tuo Destino {numerologyData.lifePath} rivela la direzione fondamentale della tua esistenza.
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

            {/* Remaining sections - blurred for free users */}
            <div className="relative">
              {!hasMapAccess && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-md rounded-2xl" />
                  <div className="relative z-30 text-center p-8 max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3">Sblocca la Mappa Completa</h3>
                    <p className="text-muted-foreground mb-6">
                      Acquista il piano Base per accedere alla mappa numerologica completa con tutti i numeri, 
                      i cicli della vita e l'analisi dell'anno personale.
                    </p>
                    <Button variant="cosmic" size="lg" asChild>
                      <Link to="/pricing">
                        <Crown className="w-5 h-5 mr-2" />
                        Scegli il tuo Piano
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
              <div className={!hasMapAccess ? "pointer-events-none select-none" : ""}>

            {/* Io (was Expression) section */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="number-circle">{numerologyData.expression}</span>
                Io {numerologyData.expression}
              </h2>
              <div className="prose prose-invert max-w-none">
                {(() => {
                  const { meaning, archetype } = getNumberDescription(numerologyData.expression, 'expression');
                  return (
                    <>
                      <p className="text-foreground/90">
                        {archetype && <strong>Archetipo: {archetype.archetype}. </strong>}
                        Il tuo numero dell'Io {numerologyData.expression}, derivato dalle lettere del tuo nome completo,
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

            {/* Soul section - Enhanced with soulDescriptions */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="number-circle">{numerologyData.soul}</span>
                Numero dell'Anima {numerologyData.soul}
              </h2>
              <div className="prose prose-invert max-w-none">
                {(() => {
                  const soulDesc = getSoulDesc(numerologyData.soul);
                  const { meaning } = getNumberDescription(numerologyData.soul, 'soul');
                  return (
                    <>
                      {soulDesc ? (
                        <>
                          <p className="text-primary/80 font-medium italic mb-4">
                            Visione: {soulDesc.vision}
                          </p>
                          <p className="text-foreground/90">
                            {soulDesc.description}
                          </p>
                          
                          <div className="mt-4 p-4 rounded-lg bg-background/50">
                            <h4 className="font-semibold text-sm mb-2 text-primary">I tuoi valori</h4>
                            <div className="flex flex-wrap gap-2">
                              {soulDesc.values.map((v, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-xs text-foreground/80">{v}</span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 p-4 rounded-lg bg-background/50">
                            <h4 className="font-semibold text-sm mb-2 text-amber-400">Le chiavi della Fortuna</h4>
                            <ul className="space-y-2">
                              {soulDesc.fortuneKeys.map((k, i) => (
                                <li key={i} className="text-sm text-foreground/80">✦ {k}</li>
                              ))}
                            </ul>
                          </div>

                          <p className="text-foreground/90 mt-4">
                            <strong>Ombra da trasformare:</strong> {soulDesc.shadow}
                          </p>

                          <p className="text-primary/80 italic mt-3 text-sm">
                            {soulDesc.keywords}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-foreground/90">
                            Il Numero dell'Anima {numerologyData.soul}, calcolato dalle vocali del tuo nome,
                            rivela i tuoi desideri più profondi e ciò che realmente ti motiva.
                            Le parole chiave sono: {meaning?.keywords.join(', ')}.
                          </p>
                          <p className="text-foreground/90">
                            Nel profondo del tuo cuore desideri esprimere {meaning?.talents.join(' e ')}.
                            Per soddisfare la tua anima, ricorda di {meaning?.evolution}.
                          </p>
                        </>
                      )}
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

            {/* Quintessenza section */}
            <section className="glass-cosmic rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="number-circle">{numerologyData.quintessenza}</span>
                Quintessenza {numerologyData.quintessenza}
              </h2>
              <div className="prose prose-invert max-w-none">
                {(() => {
                  const baseNum = numerologyData.quintessenza > 9 
                    ? (numerologyData.quintessenza === 11 ? 2 : numerologyData.quintessenza === 22 ? 4 : numerologyData.quintessenza) 
                    : numerologyData.quintessenza;
                  const meaning = numberMeanings[baseNum];
                  const master = masterMeanings[numerologyData.quintessenza];
                  return (
                    <>
                      <p className="text-foreground/90">
                        La Quintessenza è il numero che nasce dall'unione del tuo Io ({numerologyData.expression}) 
                        e del tuo Destino ({numerologyData.lifePath}): rappresenta la sintesi più elevata del tuo potenziale, 
                        l'area di eccellenza dove i tuoi talenti naturali incontrano la tua missione di vita.
                      </p>
                      <p className="text-foreground/90">
                        Il tuo numero di Quintessenza {numerologyData.quintessenza} indica che la tua area di massima espressione 
                        si trova nell'ambito di: <strong>{meaning?.keywords.join(', ')}</strong>. 
                        Quando riesci ad allineare il tuo modo di essere (Io) con la direzione della tua vita (Destino), 
                        attivi i talenti di {meaning?.talents.join(', ')}, trasformandoli nel tuo più grande dono.
                      </p>
                      {master && (
                        <p className="text-primary/90 italic">
                          Come numero maestro, la Quintessenza {numerologyData.quintessenza} porta con sé un'energia di trasformazione 
                          superiore: {master.description}
                        </p>
                      )}
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
                  {(Object.keys(sectorMeta) as SectorKey[]).map((sectorKey) => {
                    const meta = sectorMeta[sectorKey];
                    const sectors = getPersonalYearSectors(numerologyData.personalYear);
                    const sector = sectors[sectorKey];
                    return (
                      <Collapsible key={sectorKey}>
                        <div className="p-4 rounded-lg bg-background/50">
                          <h4 className="font-semibold mb-2">{meta.icon} {meta.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {sector.summary}
                          </p>
                          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                            Approfondisci
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3 pt-3 border-t border-border/30">
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              {sector.detail}
                            </p>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
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
                <li>– Spiegami il mio Destino in modo pratico</li>
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

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users, Sparkles, Star } from "lucide-react";
import { calculateLifePath } from "@/lib/numerology";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface HeroConversionProps {
  birthDate: string;
  setBirthDate: (date: string) => void;
}

const lifePathDescriptions: Record<number, { keywords: string; talents: string; shadow: string; evolution: string }> = {
  1: { keywords: "Iniziativa, autonomia, leadership", talents: "Indipendenza, coraggio, spirito pionieristico", shadow: "Egoismo, impulsività, difficoltà a collaborare", evolution: "Imparare a guidare senza dominare" },
  2: { keywords: "Collaborazione, sensibilità, relazione", talents: "Empatia, diplomazia, ascolto", shadow: "Dipendenza, insicurezza, paura del conflitto", evolution: "Sviluppare fiducia in sé" },
  3: { keywords: "Comunicazione, creatività, espressione", talents: "Entusiasmo, arte, socialità", shadow: "Dispersione, superficialità", evolution: "Dare forma concreta alle idee" },
  4: { keywords: "Struttura, stabilità, metodo", talents: "Affidabilità, costanza, concretezza", shadow: "Rigidità, paura del cambiamento", evolution: "Costruire senza irrigidirsi" },
  5: { keywords: "Cambiamento, libertà, esperienza", talents: "Adattabilità, curiosità", shadow: "Instabilità, eccessi", evolution: "Libertà con responsabilità" },
  6: { keywords: "Responsabilità, amore, armonia", talents: "Cura, senso estetico, protezione", shadow: "Controllo, sacrificio eccessivo", evolution: "Amare senza annullarsi" },
  7: { keywords: "Introspezione, ricerca, spiritualità", talents: "Analisi, profondità, intuizione", shadow: "Isolamento, diffidenza", evolution: "Fidarsi e condividere" },
  8: { keywords: "Potere, realizzazione, materia", talents: "Leadership, gestione, successo", shadow: "Materialismo, durezza", evolution: "Usare il potere con etica" },
  9: { keywords: "Umanità, chiusura, servizio", talents: "Compassione, visione ampia", shadow: "Vittimismo, dispersione emotiva", evolution: "Lasciare andare il passato" },
  11: { keywords: "Visione, intuizione, ispirazione", talents: "Consapevolezza, centratura, empatia profonda", shadow: "Ipersensibilità, tensione interiore", evolution: "Una nuova identità non egoica e più empatica" },
  22: { keywords: "Maestro costruttore, grandi progetti", talents: "Empatia, capacità di realizzare progetti concreti", shadow: "Pressione, perfezionismo", evolution: "Agire nel mondo in modo più consapevole" },
  33: { keywords: "Amore universale, servizio, guida", talents: "Comunicazione innovativa, leggerezza, amore", shadow: "Eccessiva responsabilità emotiva", evolution: "Comunicare per il massimo benessere dell'umanità" },
};

const HeroConversion = ({ birthDate, setBirthDate }: HeroConversionProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null);

  const handlePreview = () => {
    if (!birthDate) return;
    const [year, month, day] = birthDate.split("-").map(Number);
    const lp = calculateLifePath(day, month, year);
    setLifePathNumber(lp);
    setShowPreview(true);
  };

  const desc = lifePathNumber ? lifePathDescriptions[lifePathNumber] || lifePathDescriptions[lifePathNumber > 9 ? 9 : lifePathNumber] : null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-cosmic" />
      <div className="absolute inset-0 numerology-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-[10%] text-primary/15 font-display text-8xl font-bold select-none"
        animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        7
      </motion.div>
      <motion.div
        className="absolute top-40 right-[15%] text-secondary/15 font-display text-7xl font-bold select-none"
        animate={{ y: [0, 15, 0], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        11
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-[20%] text-primary/10 font-display text-9xl font-bold select-none"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        3
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Numerologia Pitagorica Autentica</span>
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
            <span className="text-foreground">La tua vita ha uno schema</span>
            <br />
            <span className="text-gradient-gold">Scoprilo in 60 secondi</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Perché ti succedono sempre le stesse cose?
            <br />
            La risposta è nei tuoi numeri.
          </p>

          {/* Birth date input + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="flex-1 h-14 rounded-xl border border-border bg-muted/50 px-4 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                placeholder="La tua data di nascita"
              />
              <Button
                variant="cosmic"
                size="xl"
                className="group whitespace-nowrap"
                onClick={handlePreview}
                disabled={!birthDate}
              >
                Ottieni una preview
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary/70" />
              <span>Nessuna carta richiesta</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary/70" />
              <span>Risultato immediato</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary/70" />
              <span>Già usato da oltre 1.000 persone</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-lg border-primary/20 bg-background">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
              <span className="font-display text-3xl font-bold text-primary">{lifePathNumber}</span>
            </div>
            <DialogTitle className="text-2xl font-display">
              Il tuo Numero del Destino è il {lifePathNumber}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Ecco un'anteprima di ciò che i tuoi numeri rivelano
            </DialogDescription>
          </DialogHeader>

          {desc && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Parole chiave</p>
                  <p className="text-sm text-foreground">{desc.keywords}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">I tuoi talenti</p>
                  <p className="text-sm text-foreground">{desc.talents}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">La tua sfida</p>
                  <p className="text-sm text-foreground">{desc.shadow}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Direzione evolutiva</p>
                  <p className="text-sm text-foreground">{desc.evolution}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-muted/50 border border-border p-3">
                <Star className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Questa è solo una piccola anteprima. La tua <span className="text-foreground font-medium">Mappa Numerologica completa</span> include numeri dell'anima, personalità, cicli di vita e molto altro.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button asChild variant="cosmic" size="lg" className="w-full group">
              <Link to={birthDate ? `/auth?date=${birthDate}` : "/auth"}>
                Registrati gratis per la mappa completa
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Gratis • Nessuna carta richiesta • Risultato immediato
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-primary rounded-full mt-2"
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroConversion;

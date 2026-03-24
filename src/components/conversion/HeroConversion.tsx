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

const lifePathDescriptions: Record<number, string> = {
  1: "Sei una persona nata per fare strada da sola. Hai un'energia forte, ti piace prendere decisioni e guidare gli altri. A volte puoi sembrare un po' testardo, ma è perché sai cosa vuoi. La tua sfida? Imparare a lavorare anche in squadra.",
  2: "Sei una persona che sente tutto. Capisci gli altri meglio di chiunque, sai ascoltare e creare armonia intorno a te. A volte però ti metti da parte troppo. La tua sfida? Credere di più in te stesso.",
  3: "Sei pieno di idee, creatività e voglia di esprimerti. La gente ama starti intorno perché porti energia e allegria. A volte rischi di disperdere le tue energie in troppe cose. La tua sfida? Dare forma concreta a quello che hai dentro.",
  4: "Sei una persona affidabile, concreta e organizzata. Quando fai qualcosa, la fai bene. A volte però fai fatica ad accettare i cambiamenti. La tua sfida? Restare solido senza diventare rigido.",
  5: "Sei nato per esplorare, cambiare e vivere esperienze nuove. La routine ti sta stretta e hai bisogno di libertà. A volte però rischi di esagerare. La tua sfida? Essere libero senza perdere il controllo.",
  6: "Sei una persona che ama prendersi cura degli altri. Hai un grande senso di responsabilità e ami l'armonia. A volte però ti sacrifichi troppo per gli altri. La tua sfida? Amare gli altri senza dimenticare te stesso.",
  7: "Sei una persona profonda, che ama pensare, analizzare e capire il senso delle cose. Hai una grande intuizione. A volte però tendi a isolarti un po' troppo. La tua sfida? Aprirti agli altri e fidarti.",
  8: "Sei nato per realizzare grandi cose. Hai una forza interiore enorme e sai come ottenere risultati. A volte però rischi di concentrarti troppo sul lato materiale. La tua sfida? Usare la tua forza per fare del bene.",
  9: "Sei una persona con un cuore grande e una visione ampia del mondo. Senti il bisogno di aiutare gli altri. A volte però fai fatica a lasciar andare il passato. La tua sfida? Guardare avanti con fiducia.",
  11: "Hai un'energia speciale. Sei molto intuitivo e senti le cose prima che accadano. Hai la capacità di ispirare chi ti sta intorno. A volte però ti senti diverso dagli altri. La tua sfida? Usare la tua sensibilità come un dono, non come un peso.",
  22: "Sei qui per costruire qualcosa di grande. Hai la capacità di trasformare le idee in realtà concrete che aiutano gli altri. A volte la pressione può sembrarti tanta. La tua sfida? Fidarti del tuo percorso e andare avanti un passo alla volta.",
  33: "Hai un amore enorme dentro di te. Sei qui per comunicare, ispirare e portare luce nella vita delle persone. A volte senti di portare il peso del mondo sulle spalle. La tua sfida? Dare amore senza dimenticare di darlo anche a te stesso.",
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

          {/* Destiny explanation */}
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4 leading-relaxed">
            Il Numero del Destino è come una bussola nascosta nella tua data di nascita. Ti dice chi sei, quali sono i tuoi superpoteri e dove sta andando la tua vita.
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
              Ecco cosa dicono i tuoi numeri su di te:
            </DialogDescription>
          </DialogHeader>

          {desc && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                <p className="text-sm text-foreground leading-relaxed">{desc}</p>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-muted/50 border border-border p-3">
                <Star className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Questo è solo un assaggio! Registrandoti gratis scoprirai <span className="text-foreground font-medium">molto di più su di te</span>: chi sei dentro, come ti vedono gli altri e cosa ti riserva il futuro.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button asChild variant="cosmic" size="lg" className="w-full group">
              <Link to={birthDate ? `/auth?date=${birthDate}&mode=signup` : "/auth?mode=signup"}>
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

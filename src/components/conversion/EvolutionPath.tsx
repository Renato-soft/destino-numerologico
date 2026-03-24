import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Unlock, Zap } from "lucide-react";

const milestones = [
  { day: "Giorno 1", title: "Chi sei davvero", description: "Scopri il tuo numero del destino", unlocked: true },
  { day: "Giorno 3", title: "Anima e Personalità", description: "Il tuo io interiore ed esteriore", unlocked: true },
  { day: "Giorno 7", title: "Anno Personale", description: "Le energie del tuo anno", unlocked: false },
  { day: "Giorno 10", title: "La tua energia nascosta", description: "Come vibrare al massimo", unlocked: false },
  { day: "Giorno 15", title: "Lezioni Karmiche", description: "Cosa devi ancora imparare", unlocked: false },
  { day: "Giorno 20", title: "Le tue relazioni", description: "Le tue affinità numerologiche", unlocked: false },
  { day: "Giorno 25", title: "Cicli della Vita", description: "Le fasi del tuo percorso", unlocked: false },
  { day: "Giorno 30", title: "Il tuo vero scopo", description: "La tua missione profonda", unlocked: false },
];

const EvolutionPath = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary-foreground text-sm font-medium mb-4">
            Percorso Progressivo
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Il tuo viaggio <span className="text-gradient-gold">numerologico personale</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            La tua crescita non è istantanea. Ogni fase della tua vita si sblocca passo dopo passo.
            <br />
            Nuovi insight si sbloccano progressivamente per guidarti nel tuo percorso.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
          {/* Timeline */}
          <div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-border/30" />
              <div className="space-y-6">
                {milestones.map((milestone) => (
                  <div key={milestone.day} className="flex items-start gap-4 pl-0">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      milestone.unlocked
                        ? "bg-gradient-to-br from-primary to-accent shadow-glow-gold"
                        : "bg-muted border border-border/50"
                    }`}>
                      {milestone.unlocked ? (
                        <Unlock className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className={`pt-1 ${!milestone.unlocked ? "opacity-60" : ""}`}>
                      <span className="text-xs text-primary font-medium">{milestone.day}</span>
                      <h4 className="font-display text-lg font-bold">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instant Unlock - sticky sidebar */}
          <div className="lg:sticky lg:top-24">
            <div className="text-center rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-primary/10 via-card to-card p-8 md:p-10 shadow-glow-gold">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-bold mb-6">
                <Zap className="w-4 h-4" />
                Non vuoi aspettare?
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Sblocca tutto <span className="text-gradient-gold">subito</span>
              </h3>
              <p className="text-muted-foreground text-base mb-6">
                Accedi immediatamente a tutte le analisi e scopri il tuo percorso completo senza attese.
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-primary">€9,99</span>
                <span className="text-muted-foreground">oggi</span>
              </div>
              <p className="text-xs text-muted-foreground mb-8">
                Poi €4,99/mese per continuare ad accedere ai contenuti giornalieri
              </p>
              <Button asChild variant="cosmic" size="xl" className="group w-full">
                <Link to="/auth">
                  Sblocca tutto ora
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EvolutionPath;

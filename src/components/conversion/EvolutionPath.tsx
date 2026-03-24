import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Unlock } from "lucide-react";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary-foreground text-sm font-medium mb-4">
            Percorso Progressivo
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Il tuo percorso <span className="text-gradient-gold">numerologico personale</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Le tue analisi si evolvono nel tempo, guidandoti passo dopo passo.
            <br />
            Nuovi insight si sbloccano progressivamente.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-border/30" />

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.day}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-4 pl-0"
                >
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild variant="cosmic" size="lg" className="group">
            <Link to="/auth">
              Scopri il tuo percorso
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EvolutionPath;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

const ResultPreview = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Anteprima
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Ecco cosa <span className="text-gradient-gold">scoprirai</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Mock result card */}
          <div className="rounded-2xl border border-primary/20 bg-card/80 overflow-hidden shadow-cosmic">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/15 to-accent/10 p-6 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="number-circle-lg">7</div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Il tuo Numero del Destino</p>
                  <h3 className="font-display text-2xl font-bold">Il Ricercatore</h3>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-display text-lg font-semibold text-primary mb-2">La tua essenza</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sei una persona profonda, analitica e intuitiva. La tua mente è sempre alla ricerca
                  di risposte e significati nascosti. Hai un forte bisogno di comprendere la realtà
                  al di là delle apparenze. La solitudine non ti spaventa: è il tuo spazio di crescita.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Anima", value: "3", name: "L'Espressivo" },
                  { label: "Personalità", value: "5", name: "L'Avventuriero" },
                  { label: "Anno Personale", value: "1", name: "Nuovo Inizio" },
                ].map((item) => (
                  <div key={item.label} className="text-center p-4 rounded-xl bg-muted/30 border border-border/30">
                    <div className="text-2xl font-display font-bold text-primary mb-1">{item.value}</div>
                    <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                    <div className="text-xs font-medium text-foreground/80">{item.name}</div>
                  </div>
                ))}
              </div>

              {/* Blurred preview */}
              <div className="relative">
                <div className="blur-sm select-none pointer-events-none space-y-3">
                  <h4 className="font-display text-lg font-semibold text-primary">Lezioni karmiche</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Le tue lezioni karmiche indicano aree di crescita essenziali in questa vita.
                    I numeri mancanti nel tuo nome rivelano le energie che devi sviluppare...
                  </p>
                  <h4 className="font-display text-lg font-semibold text-primary">Cicli della vita</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Il tuo primo ciclo formativo si conclude a 32 anni. Il secondo ciclo produttivo...
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-card via-card/80 to-transparent">
                  <div className="text-center">
                    <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium mb-4">Sblocca la tua analisi completa</p>
                    <Button asChild variant="cosmic" size="lg" className="group">
                      <Link to="/auth">
                        Vedi la tua analisi completa
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultPreview;

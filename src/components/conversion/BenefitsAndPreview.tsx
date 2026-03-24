import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Brain, Eye, Heart, Flame } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Capisci perché ti succedono sempre le stesse cose",
    description: "Ti mostriamo cosa si ripete nella tua vita e perché, così puoi cambiarlo.",
  },
  {
    icon: Eye,
    title: "Scopri i tuoi punti di forza nascosti",
    description: "Hai dei talenti che ancora non conosci. Noi ti aiutiamo a trovarli.",
  },
  {
    icon: Heart,
    title: "Ottieni chiarezza su amore, lavoro e decisioni",
    description: "I tuoi numeri ti dicono cosa funziona meglio per te in amore e nel lavoro.",
  },
  {
    icon: Flame,
    title: "Impara a usare la tua energia a tuo vantaggio",
    description: "Ogni giorno è diverso. Sapere qual è il momento giusto ti fa fare scelte migliori.",
  },
];

const BenefitsAndPreview = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-stretch">
          {/* Left: Benefits */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary-foreground text-sm font-medium mb-4">
                Perché funziona
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Questa non è <span className="text-gradient-gold">una semplice lettura</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4 flex-1">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-4 group-hover:shadow-glow-gold transition-shadow duration-300">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Result Preview */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Anteprima
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ecco cosa <span className="text-gradient-gold">scoprirai</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="rounded-2xl border border-primary/20 bg-card/80 overflow-hidden shadow-cosmic h-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/15 to-accent/10 p-5 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="number-circle-lg">7</div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Il tuo Numero del Destino</p>
                      <h3 className="font-display text-xl font-bold">Il Ricercatore</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5 flex-1 flex flex-col">
                  <div>
                    <h4 className="font-display text-base font-semibold text-primary mb-2">La tua essenza</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Sei intuitivo, analitico e profondamente introspettivo. Hai una forte connessione
                      con il tuo mondo interiore. La tua mente è sempre alla ricerca di risposte e
                      significati nascosti.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Anima", value: "3", name: "L'Espressivo" },
                      { label: "Personalità", value: "5", name: "L'Avventuriero" },
                      { label: "Anno Personale", value: "1", name: "Nuovo Inizio" },
                    ].map((item) => (
                      <div key={item.label} className="text-center p-3 rounded-xl bg-muted/30 border border-border/30">
                        <div className="text-xl font-display font-bold text-primary mb-0.5">{item.value}</div>
                        <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                        <div className="text-xs font-medium text-foreground/80">{item.name}</div>
                      </div>
                    ))}
                  </div>

                  {/* Blurred preview */}
                  <div className="relative flex-1">
                    <div className="blur-sm select-none pointer-events-none space-y-2">
                      <h4 className="font-display text-base font-semibold text-primary">Lezioni karmiche</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Le tue lezioni karmiche indicano aree di crescita essenziali in questa vita.
                        I numeri mancanti nel tuo nome rivelano le energie che devi sviluppare...
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-card via-card/80 to-transparent">
                      <div className="text-center">
                        <Star className="w-7 h-7 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium mb-3">Sblocca la tua analisi completa</p>
                        <Button asChild variant="cosmic" size="lg" className="group">
                          <Link to="/auth?mode=signup">
                            Registrati gratis
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
        </div>
      </div>
    </section>
  );
};

export default BenefitsAndPreview;

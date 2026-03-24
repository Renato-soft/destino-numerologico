import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Heart, Briefcase, DollarSign, Leaf, Star as StarIcon, TrendingUp, AlertTriangle, Sparkles, Shirt, Sun, Moon } from "lucide-react";

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

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
          {/* Card 1: Mappa Numerologica */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl border border-primary/20 bg-card/80 overflow-hidden shadow-cosmic">
              <div className="bg-gradient-to-r from-primary/15 to-accent/10 p-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="number-circle-lg">7</div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Il tuo Numero del Destino</p>
                    <h3 className="font-display text-2xl font-bold">Il Ricercatore</h3>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-display text-lg font-semibold text-primary mb-2">La tua essenza</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Sei intuitivo, analitico e profondamente introspettivo. Hai una forte connessione
                    con il tuo mondo interiore. La tua mente è sempre alla ricerca di risposte e
                    significati nascosti. La solitudine non ti spaventa: è il tuo spazio di crescita.
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

                <div className="relative">
                  <div className="blur-sm select-none pointer-events-none space-y-3">
                    <h4 className="font-display text-lg font-semibold text-primary">Lezioni karmiche</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Le tue lezioni karmiche indicano aree di crescita essenziali in questa vita.
                      I numeri mancanti nel tuo nome rivelano le energie che devi sviluppare...
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-card via-card/80 to-transparent">
                    <div className="text-center">
                      <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                      <p className="text-sm font-medium mb-4">Sblocca la tua analisi completa</p>
                      <Button asChild variant="cosmic" size="lg" className="group">
                        <Link to="/auth?mode=signup">
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

          {/* Card 2: Analisi del Giorno + Outfit */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >
            {/* Daily Analysis Preview */}
            <div className="rounded-2xl border border-primary/20 bg-card/80 overflow-hidden shadow-cosmic">
              <div className="bg-gradient-to-r from-primary/15 to-accent/10 p-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="number-circle w-10 h-10 text-lg">7</div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">Analisi del giorno</h3>
                    <p className="text-xs text-muted-foreground">
                      Vibrazione personale: <span className="text-primary font-semibold">7</span> · Anno Personale: <span className="text-primary font-semibold">7</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Motivational */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/15 via-accent/10 to-primary/5 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-foreground text-sm font-medium italic leading-relaxed">
                      "Giornata di illuminazione interiore. Oggi la tua mente penetra i misteri con chiarezza cristallina."
                    </p>
                  </div>
                </div>

                {/* Sectors grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Briefcase, title: "Lavoro e Carriera", forza: "Analisi, ricerca, strategia.", evita: "Evita l'eccesso di analisi." },
                    { icon: Heart, title: "Amore e Relazioni", forza: "Intimità profonda e conversazioni significative.", evita: "Evita il distacco emotivo." },
                    { icon: DollarSign, title: "Denaro e Gestione", forza: "Studia investimenti con calma.", evita: "Evita di ignorare le opportunità." },
                    { icon: Leaf, title: "Benessere e Energia", forza: "Meditazione, digiuno leggero.", evita: "Evita l'eccesso di caffeina." },
                  ].map((sector) => (
                    <div key={sector.title} className="rounded-xl border border-border/30 bg-muted/20 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <sector.icon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground">{sector.title}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <TrendingUp className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs text-foreground/80">{sector.forza}</p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">{sector.evita}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Outfit Preview */}
            <div className="rounded-2xl border border-primary/20 bg-card/80 overflow-hidden shadow-cosmic">
              <div className="bg-gradient-to-r from-primary/15 to-accent/10 p-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shirt className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">Outfit consigliato</h3>
                    <p className="text-xs text-muted-foreground">Look personalizzati in base alla tua vibrazione</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Look Giorno 1", subtitle: "Casual-smart per il lavoro", icon: Sun },
                    { title: "Look Giorno 2", subtitle: "Alternativa diurna", icon: Sun },
                    { title: "Look Sera 1", subtitle: "Elegante per uscire", icon: Moon },
                    { title: "Look Sera 2", subtitle: "Alternativa serale", icon: Moon },
                  ].map((look) => (
                    <div key={look.title} className="rounded-xl border border-border/30 bg-muted/20 overflow-hidden">
                      <div className="p-2.5 flex items-center gap-2">
                        <look.icon className="w-3.5 h-3.5 text-primary" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">{look.title}</p>
                          <p className="text-[10px] text-muted-foreground">{look.subtitle}</p>
                        </div>
                      </div>
                      <div className="aspect-[3/4] bg-gradient-to-b from-muted/40 to-muted/60 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/60" />
                        <div className="text-center z-10">
                          <Shirt className="w-8 h-8 text-muted-foreground/40 mx-auto mb-1" />
                          <p className="text-[10px] text-muted-foreground/60">AI Generated</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Blurred CTA overlay */}
                <div className="relative mt-4">
                  <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-t from-card to-transparent z-10" />
                  <div className="text-center pt-2">
                    <p className="text-sm font-medium mb-3">Scopri i tuoi look personalizzati ogni giorno</p>
                    <Button asChild variant="cosmic" size="sm" className="group">
                      <Link to="/auth?mode=signup">
                        Inizia ora
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResultPreview;

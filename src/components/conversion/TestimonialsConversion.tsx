import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Giulia M.",
    role: "Imprenditrice",
    text: "Non credevo nella numerologia finché non ho letto la mia mappa. Ha descritto la mia situazione con una precisione inquietante. Mi ha aiutata a capire perché ripetevo certi errori.",
    stars: 5,
  },
  {
    name: "Marco R.",
    role: "Sviluppatore Software",
    text: "Da razionalista scettico, devo ammettere che i numeri raccontano qualcosa di vero. L'analisi dell'anno personale mi ha dato una prospettiva diversa sulle mie scelte professionali.",
    stars: 5,
  },
  {
    name: "Francesca L.",
    role: "Psicologa",
    text: "Uso le analisi come strumento complementare nel mio lavoro di introspezione. I numeri offrono spunti di riflessione potentissimi. L'outfit del giorno poi è diventato un rituale!",
    stars: 5,
  },
  {
    name: "Alessandro D.",
    role: "Coach",
    text: "Il percorso dei 7 Pilastri è stato trasformativo. Ogni pilastro ha sbloccato consapevolezze profonde. Lo consiglio a tutti i miei clienti come punto di partenza.",
    stars: 5,
  },
];

const TestimonialsConversion = () => {
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
            Storie Reali
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Cosa dicono <span className="text-gradient-gold">gli utenti</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-border/50 bg-card/50"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                "{t.text}"
              </p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsConversion;

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Giulia R.",
    role: "Imprenditrice",
    text: "Mi ha descritto meglio di chiunque altro. Non credevo nella numerologia finché non ho letto la mia mappa. Una precisione inquietante.",
    stars: 5,
  },
  {
    name: "Marco D.",
    role: "Sviluppatore Software",
    text: "Inquietante quanto sia accurato. Da razionalista scettico, devo ammettere che i numeri raccontano qualcosa di vero.",
    stars: 5,
  },
  {
    name: "Laura S.",
    role: "Psicologa",
    text: "Mi ha aiutato a capire la mia direzione. Uso le analisi come strumento di riflessione quotidiano. L'outfit del giorno è diventato un rituale!",
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

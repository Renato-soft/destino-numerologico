import { motion } from "framer-motion";
import { Brain, Eye, Heart, Flame } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Comprendi te stesso",
    description: "Scopri le tue qualità nascoste, i tuoi talenti naturali e i blocchi che ti frenano.",
  },
  {
    icon: Eye,
    title: "Scopri gli schemi della tua vita",
    description: "Riconosci i pattern ricorrenti e impara a trasformarli a tuo vantaggio.",
  },
  {
    icon: Heart,
    title: "Ottieni chiarezza su amore e lavoro",
    description: "Capisci le dinamiche relazionali e professionali scritte nei tuoi numeri.",
  },
  {
    icon: Flame,
    title: "Usa la tua energia a tuo vantaggio",
    description: "Ogni giorno ha una vibrazione diversa. Impara a cavalcarla.",
  },
];

const Benefits = () => {
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
            Perché funziona
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Cosa scoprirai <span className="text-gradient-gold">su di te</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-5 group-hover:shadow-glow-gold transition-shadow duration-300">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

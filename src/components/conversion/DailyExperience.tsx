import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sun, Shirt, MessageCircle, TrendingUp } from "lucide-react";
import outfit0 from "@/assets/outfits/outfit0.jpg";
import outfit1 from "@/assets/outfits/outfit1.jpg";
import outfit2 from "@/assets/outfits/outfit2.jpg";
import outfit3 from "@/assets/outfits/outfit3.jpg";

const dailyFeatures = [
  { icon: Sun, title: "Scopri quando agire e quando aspettare", description: "Ogni giorno ha la sua energia. Ti diciamo com'è oggi la tua." },
  { icon: Shirt, title: "Ricevi consigli pratici ogni giorno", description: "Ti suggeriamo cosa fare, cosa indossare e come muoverti al meglio." },
  { icon: TrendingUp, title: "Allinea le tue scelte alla tua energia", description: "Consigli semplici e chiari su amore, lavoro e benessere." },
  { icon: MessageCircle, title: "Chat con consulente AI", description: "Fai tutte le domande che vuoi sui tuoi numeri e ricevi risposte subito." },
];

const outfitExamples = [
  { label: "Look Mattina", img: outfit0 },
  { label: "Look Pomeriggio", img: outfit1 },
  { label: "Look Sera", img: outfit2 },
  { label: "Look Speciale", img: outfit3 },
];

const DailyExperience = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Esperienza Quotidiana
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            La tua energia <span className="text-gradient-gold">cambia ogni giorno</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sapere come usarla e come vestirti può cambiare tutto.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto mb-12 items-center">
          {/* Left: feature descriptions in 2x2 grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {dailyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-5 rounded-2xl border border-border/30 bg-card/30"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display text-lg font-bold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Right: outfit examples in 2x2 grid, smaller */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 max-w-sm mx-auto lg:mx-0 lg:ml-auto"
          >
            {outfitExamples.map((outfit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-xl overflow-hidden border border-border/30 bg-card/30 group"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={outfit.img}
                    alt={outfit.label}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="py-1.5 text-center">
                  <p className="text-xs font-medium text-muted-foreground">{outfit.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild variant="cosmic" size="lg" className="group">
            <Link to="/auth">
              Ogni giorno ha la sua energia. Ti diciamo come sfruttarla al meglio
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default DailyExperience;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sun, Shirt, MessageCircle, TrendingUp } from "lucide-react";

const dailyFeatures = [
  { icon: Sun, title: "Energia del giorno", description: "Scopri la vibrazione della giornata e come sfruttarla" },
  { icon: Shirt, title: "Outfit consigliato", description: "Vestiti in sintonia con la tua energia numerologica" },
  { icon: TrendingUp, title: "Consigli mirati", description: "Indicazioni pratiche per amore, lavoro e salute" },
  { icon: MessageCircle, title: "Chat con l'esperto AI", description: "Domande e risposte sulla tua numerologia personale" },
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
            Ogni giorno ha una vibrazione diversa. Sapere come usarla può cambiare tutto.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          {dailyFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl border border-border/30 bg-card/30"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display text-lg font-bold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild variant="cosmic" size="lg" className="group">
            <Link to="/auth">
              Scopri oggi la tua energia
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default DailyExperience;

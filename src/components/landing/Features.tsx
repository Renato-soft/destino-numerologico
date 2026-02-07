import { motion } from "framer-motion";
import { 
  Map, 
  MessageCircle, 
  Smartphone, 
  FileText, 
  Calendar, 
  Sparkles 
} from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Mappa Numerologica Completa",
    description: "Calcolo di Life Path, Espressione, Anima, Personalità e Cicli della Vita secondo la numerologia pitagorica classica.",
  },
  {
    icon: MessageCircle,
    title: "Esperto AI Personale",
    description: "Chat con un consulente numerologico AI che conosce la tua mappa e ti guida quotidianamente.",
  },
  {
    icon: FileText,
    title: "Report PDF Premium",
    description: "Genera e scarica la tua mappa in formato PDF con lettura narrativa approfondita.",
  },
  {
    icon: Calendar,
    title: "Anno e Mese Personale",
    description: "Scopri le energie dell'anno e del mese corrente per prendere decisioni consapevoli.",
  },
  {
    icon: Sparkles,
    title: "Date Favorevoli",
    description: "Trova le date più propizie per i tuoi obiettivi: colloqui, firme, nuovi inizi.",
  },
  {
    icon: Smartphone,
    title: "Buongiorno Quotidiano",
    description: "Ricevi ogni mattina consigli personalizzati su WhatsApp per iniziare la giornata.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 numerology-pattern opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
            Funzionalità
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Tutto ciò che ti serve per
            <br />
            <span className="text-gradient-gold">esplorare il tuo destino</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un'esperienza completa di numerologia, dalla generazione della mappa
            alla guida quotidiana per le tue scelte.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-cosmic">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

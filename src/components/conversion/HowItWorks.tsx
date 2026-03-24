import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Hash, FileText, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: CalendarDays,
    number: "1",
    title: "Inserisci la tua data di nascita",
    description: "Bastano pochi secondi. Il tuo destino è codificato nella tua data.",
  },
  {
    icon: Hash,
    number: "2",
    title: "Calcoliamo il tuo numero",
    description: "Il nostro sistema applica la numerologia pitagorica autentica.",
  },
  {
    icon: FileText,
    number: "3",
    title: "Ricevi la tua analisi",
    description: "Una lettura personalizzata, chiara e immediatamente utile.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Semplicissimo
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Scopri tutto in meno di <span className="text-gradient-gold">60 secondi</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="number-circle mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
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
              Inizia ora
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

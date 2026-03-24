import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const InstantUnlock = () => {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-primary/10 via-card to-card p-8 md:p-12 shadow-glow-gold"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-bold mb-6">
            <Zap className="w-4 h-4" />
            Non vuoi aspettare?
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-4">
            Sblocca tutto <span className="text-gradient-gold">subito</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-lg mx-auto">
            Accedi immediatamente a tutte le analisi e scopri il tuo percorso completo senza attese.
          </p>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-primary">€9,99</span>
            <span className="text-muted-foreground">oggi</span>
          </div>
          <p className="text-xs text-muted-foreground mb-8">
            Poi €4,99/mese per continuare ad accedere ai contenuti giornalieri
          </p>
          <Button asChild variant="cosmic" size="xl" className="group">
            <Link to="/auth">
              Sblocca tutto ora
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default InstantUnlock;

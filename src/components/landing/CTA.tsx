import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-secondary/10 to-background" />

      <motion.div
        className="absolute top-10 left-10 text-primary/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Star className="w-32 h-32" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 text-primary/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <Star className="w-24 h-24" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Pronto a scoprire
            <br />
            <span className="text-gradient-gold">chi sei davvero?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            La tua mappa numerologica ti aspetta. Inizia oggi stesso il viaggio
            verso la consapevolezza di te stesso.
          </p>

          <Button asChild variant="cosmic" size="xl" className="group">
            <Link to="/auth">
              Crea il tuo profilo gratuito
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <p className="mt-6 text-sm text-muted-foreground">
            Registrazione gratuita • Nessuna carta di credito richiesta
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
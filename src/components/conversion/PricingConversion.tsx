import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Star, Sparkles, Gift, Crown } from "lucide-react";

const PricingConversion = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/15 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Prezzi trasparenti
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Scegli come vivere <span className="text-gradient-gold">la tua esperienza</span>
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Row 1: Free + Unlock Single */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* FREE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border/50 p-6 bg-card/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Gift className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                   <h3 className="font-display text-xl font-bold">Inizia gratuitamente</h3>
                   <p className="text-sm text-muted-foreground">Ottieni la tua prima analisi e scopri il tuo numero</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {["Accesso iniziale alla piattaforma", "Prime analisi numerologiche", "Inizio del percorso evolutivo"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="cosmic-outline" className="w-full group">
                <Link to="/auth">
                  Inizia gratis
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            {/* SINGLE UNLOCK €1,99 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border/50 p-6 bg-card/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Sblocchi Singoli</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-primary">€1,99</span>
                    <span className="text-sm text-muted-foreground">per analisi</span>
                  </div>
                </div>
              </div>
                 <p className="text-sm text-muted-foreground mb-4">
                   Sblocca singoli contenuti senza abbonamento.
                 </p>
              <ul className="space-y-3 mb-6">
                {["Accesso immediato alla singola analisi", "Nessun vincolo o abbonamento", "Paga solo quello che ti interessa"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="cosmic-outline" className="w-full group">
                <Link to="/auth">
                  Sblocca ora
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* MAIN OFFER: €9,99 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl border-2 border-primary/50 p-8 bg-gradient-to-b from-primary/10 via-card to-card shadow-glow-gold"
          >
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-bold shadow-glow-gold">
              <Crown className="w-4 h-4" />
              Offerta Consigliata — Miglior Valore
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-2">
              <div className="flex-1">
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                  Sblocca tutto subito
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-primary">€9,99</span>
                  <span className="text-muted-foreground">oggi</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Ottieni accesso immediato a tutte le analisi senza aspettare.
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Tutti i contenuti sbloccati subito",
                    "Accesso completo al percorso evolutivo",
                    "Tutte le funzionalità premium incluse",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground border-t border-border/30 pt-3">
                  Poi solo €4,99/mese per continuare ad accedere ai contenuti giornalieri.
                  <br />
                  Cancella quando vuoi.
                </p>
              </div>

              <div className="md:w-auto">
                <Button asChild variant="cosmic" size="xl" className="w-full md:w-auto group text-base">
                  <Link to="/auth">
                    Sblocca tutto ora
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* SUBSCRIPTION €4,99/mese */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border/50 p-6 bg-card/50"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center">
                    <Star className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Accesso Giornaliero Completo</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">€4,99</span>
                      <span className="text-sm text-muted-foreground">/mese</span>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "Analisi del giorno personalizzata",
                    "Outfit del giorno basato sulla vibrazione",
                    "Consigli quotidiani mirati",
                    "Accesso alla community",
                    "Chat con consulente numerologico AI",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-secondary shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-auto">
                <Button asChild variant="cosmic-outline" size="lg" className="w-full md:w-auto group">
                  <Link to="/auth">
                    Attiva abbonamento
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingConversion;

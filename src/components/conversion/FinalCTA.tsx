import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

interface FinalCTAProps {
  birthDate: string;
  setBirthDate: (date: string) => void;
  onPreview: () => void;
}

const FinalCTA = ({ birthDate, setBirthDate, onPreview }: FinalCTAProps) => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-cosmic" />
      <div className="absolute inset-0 numerology-pattern" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Il tuo destino è già scritto.
            <br />
            <span className="text-gradient-gold">Scoprilo ora.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Migliaia di persone hanno già scoperto il potere dei loro numeri.
            La tua lettura gratuita ti aspetta.
          </p>

          <div className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="flex-1 h-14 rounded-xl border border-border bg-muted/50 px-4 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
              <Button
                variant="cosmic"
                size="xl"
                className="group whitespace-nowrap"
                onClick={onPreview}
                disabled={!birthDate}
              >
                Ottieni una preview
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary/70" />
              <span>Nessuna carta richiesta</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary/70" />
              <span>Risultato immediato</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary/70" />
              <span>100% gratuito</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

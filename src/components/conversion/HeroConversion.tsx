import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users, Sparkles, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroConversionProps {
  birthDate: string;
  setBirthDate: (date: string) => void;
  onPreview: () => void;
}

const HeroConversion = ({ birthDate, setBirthDate, onPreview }: HeroConversionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Login button - fixed top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-2 text-foreground/80 hover:text-primary hover:bg-primary/10">
          <Link to="/community">
            <Users className="w-4 h-4" />
            Community
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="gap-2 bg-background/10 backdrop-blur-sm border-primary/30 hover:bg-primary/20">
          <Link to="/auth">
            <LogIn className="w-4 h-4" />
            Accedi
          </Link>
        </Button>
      </div>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-cosmic" />
      <div className="absolute inset-0 numerology-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Static floating elements (no animation) */}
      <div className="absolute top-20 left-[10%] text-primary/15 font-display text-8xl font-bold select-none opacity-15">7</div>
      <div className="absolute top-40 right-[15%] text-secondary/15 font-display text-7xl font-bold select-none opacity-10">11</div>
      <div className="absolute bottom-32 left-[20%] text-primary/10 font-display text-9xl font-bold select-none opacity-10">3</div>

      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">

        <div className="animate-fadeIn">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Numerologia Pitagorica Autentica</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.1]">
            <span className="text-foreground">Perchè ti succedono sempre le stesse cose?</span>
            <br />
            <span className="block mt-4 text-gradient-gold">Scoprilo in 60 secondi</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            La risposta è nella tua data di nascita!
          </p>

          {/* Birth date input + CTA */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full sm:flex-1 h-14 rounded-xl border border-border bg-muted/50 px-4 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all [color-scheme:dark]"
                aria-label="Data di nascita" />
              <Button
                variant="cosmic"
                size="xl"
                className="group whitespace-nowrap"
                onClick={onPreview}
                disabled={!birthDate}>
                Ottieni una preview
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Trust signals */}
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
              <span>Già usato da oltre 1.000 persone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Static scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroConversion;

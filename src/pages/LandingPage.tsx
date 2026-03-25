import { useState, lazy, Suspense } from "react";
import HeroConversion from "@/components/conversion/HeroConversion";
import { calculateLifePath } from "@/lib/numerology";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

// Lazy load below-fold sections
const BenefitsAndPreview = lazy(() => import("@/components/conversion/BenefitsAndPreview"));
const DailyExperience = lazy(() => import("@/components/conversion/DailyExperience"));
const EvolutionPath = lazy(() => import("@/components/conversion/EvolutionPath"));
const TestimonialsConversion = lazy(() => import("@/components/conversion/TestimonialsConversion"));
const AboutSection = lazy(() => import("@/components/conversion/AboutSection"));
const FAQSection = lazy(() => import("@/components/conversion/FAQSection"));
const FinalCTA = lazy(() => import("@/components/conversion/FinalCTA"));
const CommunityPreview = lazy(() => import("@/components/conversion/CommunityPreview"));
const FooterConversion = lazy(() => import("@/components/conversion/FooterConversion"));

const lifePathDescriptions: Record<number, string> = {
  1: "Sei una persona nata per fare strada da sola. Hai un'energia forte, ti piace prendere decisioni e guidare gli altri. A volte puoi sembrare un po' testardo, ma è perché sai cosa vuoi. La tua sfida? Imparare a lavorare anche in squadra.",
  2: "Sei una persona che sente tutto. Capisci gli altri meglio di chiunque, sai ascoltare e creare armonia intorno a te. A volte però ti metti da parte troppo. La tua sfida? Credere di più in te stesso.",
  3: "Sei pieno di idee, creatività e voglia di esprimerti. La gente ama starti intorno perché porti energia e allegria. A volte rischi di disperdere le tue energie in troppe cose. La tua sfida? Dare forma concreta a quello che hai dentro.",
  4: "Sei una persona affidabile, concreta e organizzata. Quando fai qualcosa, la fai bene. A volte però fai fatica ad accettare i cambiamenti. La tua sfida? Restare solido senza diventare rigido.",
  5: "Sei nato per esplorare, cambiare e vivere esperienze nuove. La routine ti sta stretta e hai bisogno di libertà. A volte però rischi di esagerare. La tua sfida? Essere libero senza perdere il controllo.",
  6: "Sei una persona che ama prendersi cura degli altri. Hai un grande senso di responsabilità e ami l'armonia. A volte però ti sacrifichi troppo per gli altri. La tua sfida? Amare gli altri senza dimenticare te stesso.",
  7: "Sei una persona profonda, che ama pensare, analizzare e capire il senso delle cose. Hai una grande intuizione. A volte però tendi a isolarti un po' troppo. La tua sfida? Aprirti agli altri e fidarti.",
  8: "Sei nato per realizzare grandi cose. Hai una forza interiore enorme e sai come ottenere risultati. A volte però rischi di concentrarti troppo sul lato materiale. La tua sfida? Usare la tua forza per fare del bene.",
  9: "Sei una persona con un cuore grande e una visione ampia del mondo. Senti il bisogno di aiutare gli altri. A volte però fai fatica a lasciar andare il passato. La tua sfida? Guardare avanti con fiducia.",
  11: "Hai un'energia speciale. Sei molto intuitivo e senti le cose prima che accadano. Hai la capacità di ispirare chi ti sta intorno. A volte però ti senti diverso dagli altri. La tua sfida? Usare la tua sensibilità come un dono, non come un peso.",
  22: "Sei qui per costruire qualcosa di grande. Hai la capacità di trasformare le idee in realtà concrete che aiutano gli altri. A volte la pressione può sembrarti tanta. La tua sfida? Fidarti del tuo percorso e andare avanti un passo alla volta.",
  33: "Hai un amore enorme dentro di te. Sei qui per comunicare, ispirare e portare luce nella vita delle persone. A volte senti di portare il peso del mondo sulle spalle. La tua sfida? Dare amore senza dimenticare di darlo anche a te stesso.",
};

const SectionFallback = () => (
  <div className="py-24 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const LandingPage = () => {
  const [birthDate, setBirthDate] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null);

  const handlePreview = () => {
    if (!birthDate) return;
    const [year, month, day] = birthDate.split("-").map(Number);
    const lp = calculateLifePath(day, month, year);
    setLifePathNumber(lp);
    setShowPreview(true);
  };

  const desc = lifePathNumber ? lifePathDescriptions[lifePathNumber] || lifePathDescriptions[lifePathNumber > 9 ? 9 : lifePathNumber] : null;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroConversion birthDate={birthDate} setBirthDate={setBirthDate} onPreview={handlePreview} />
      <Suspense fallback={<SectionFallback />}>
        <BenefitsAndPreview />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DailyExperience />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <EvolutionPath />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CommunityPreview />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsConversion />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FinalCTA birthDate={birthDate} setBirthDate={setBirthDate} onPreview={handlePreview} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FooterConversion />
      </Suspense>

      {/* Shared Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-lg border-primary/20 bg-background">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
              <span className="font-display text-3xl font-bold text-primary">{lifePathNumber}</span>
            </div>
            <DialogTitle className="text-2xl font-display">
              Il tuo Numero del Destino è il {lifePathNumber}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Il Numero del Destino è come una bussola nascosta nella tua data di nascita. Ti dice chi sei, quali sono i tuoi superpoteri e dove sta andando la tua vita.
            </DialogDescription>
          </DialogHeader>
          {desc && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                <p className="text-sm text-foreground leading-relaxed">{desc}</p>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 border border-border p-3">
                <Star className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Questo è solo un assaggio! Registrandoti gratis scoprirai <span className="text-foreground font-medium">molto di più su di te</span>: chi sei dentro, come ti vedono gli altri e cosa ti riserva il futuro.
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button asChild variant="cosmic" size="lg" className="w-full group">
              <Link to={birthDate ? `/auth?date=${birthDate}&mode=signup` : "/auth?mode=signup"}>
                Registrati gratis
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Gratis • Nessuna carta richiesta • Risultato immediato
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;

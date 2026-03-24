import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  // IT
  { name: "Giulia R.", role: "Imprenditrice", text: "Mi ha descritto meglio di chiunque altro. Non credevo nella numerologia finché non ho letto la mia mappa. Una precisione inquietante.", stars: 5, lang: "🇮🇹" },
  // EN
  { name: "Sarah K.", role: "Life Coach", text: "I was skeptical at first, but the accuracy of my numerology map left me speechless. It described patterns I've been living for years.", stars: 5, lang: "🇬🇧" },
  // HU
  { name: "Katalin N.", role: "Tanárnő", text: "Lenyűgöző, mennyire pontosan leírta az életutamat. A napi elemzések segítenek a döntéseimben. Mindenkinek ajánlom!", stars: 5, lang: "🇭🇺" },
  // FR
  { name: "Claire M.", role: "Architecte", text: "J'ai découvert des aspects de ma personnalité que je n'avais jamais compris. L'analyse quotidienne est devenue mon rituel du matin.", stars: 5, lang: "🇫🇷" },
  // BR
  { name: "Fernanda L.", role: "Designer", text: "Incrível como os números revelam tanto sobre nós. A análise diária me ajuda a tomar decisões mais conscientes todos os dias.", stars: 5, lang: "🇧🇷" },
  // IT
  { name: "Marco D.", role: "Sviluppatore Software", text: "Inquietante quanto sia accurato. Da razionalista scettico, devo ammettere che i numeri raccontano qualcosa di vero.", stars: 5, lang: "🇮🇹" },
  // EN
  { name: "James W.", role: "Entrepreneur", text: "The personal year analysis helped me time my business decisions perfectly. It's like having a strategic advisor based on numbers.", stars: 5, lang: "🇬🇧" },
  // HU
  { name: "László B.", role: "Mérnök", text: "Szkeptikus voltam, de a személyes éves elemzés megdöbbentően pontos volt. Az üzleti döntéseimet is ez alapján hozom meg.", stars: 5, lang: "🇭🇺" },
  // FR
  { name: "Antoine D.", role: "Professeur", text: "La précision de l'analyse m'a surpris. Les tenues quotidiennes sont un plus inattendu et amusant. Bravo pour cet outil unique!", stars: 5, lang: "🇫🇷" },
  // BR
  { name: "Carlos A.", role: "Psicólogo", text: "Como profissional da área, fiquei impressionado com a profundidade da análise. Os números realmente contam nossa história.", stars: 5, lang: "🇧🇷" },
  // IT
  { name: "Laura S.", role: "Psicologa", text: "Mi ha aiutato a capire la mia direzione. Uso le analisi come strumento di riflessione quotidiano. L'outfit del giorno è diventato un rituale!", stars: 5, lang: "🇮🇹" },
  // EN
  { name: "Emily T.", role: "Marketing Manager", text: "The daily outfit suggestion is such a fun bonus! But the real value is in how accurately the map describes my life path.", stars: 5, lang: "🇬🇧" },
  // HU
  { name: "Eszter V.", role: "Művész", text: "A numerológiai térkép teljesen új perspektívát adott az életemnek. A napi öltözék javaslat pedig fantasztikus bónusz!", stars: 5, lang: "🇭🇺" },
  // FR
  { name: "Sophie B.", role: "Médecin", text: "Un outil remarquable qui m'aide à mieux me comprendre. La carte numerologique est d'une justesse étonnante.", stars: 5, lang: "🇫🇷" },
  // BR
  { name: "Ana P.", role: "Empreendedora", text: "A mapa numerológica me surpreendeu pela precisão. Uso diariamente para entender melhor meus ciclos pessoais e profissionais.", stars: 5, lang: "🇧🇷" },
  // IT
  { name: "Alessandro F.", role: "Medico", text: "L'analisi dell'anno personale mi ha permesso di affrontare un periodo difficile con maggiore consapevolezza. Strumento prezioso.", stars: 5, lang: "🇮🇹" },
  // EN
  { name: "David R.", role: "Financial Analyst", text: "As someone who works with numbers daily, I appreciate the mathematical rigor behind this system. Surprisingly insightful.", stars: 5, lang: "🇬🇧" },
  // HU
  { name: "Zoltán K.", role: "Vállalkozó", text: "Hihetetlen, milyen pontosan írja le a személyiségemet és az élet kihívásait. A legjobb befektetés, amit magamba tettem.", stars: 5, lang: "🇭🇺" },
  // FR
  { name: "Lucie G.", role: "Journaliste", text: "En tant que journaliste, je suis habituée à vérifier les faits. Cette analyse m'a bluffée par sa pertinence et sa profondeur.", stars: 5, lang: "🇫🇷" },
  // BR
  { name: "Rafael M.", role: "Professor", text: "A tradição pitagórica ganha vida nesta plataforma. A análise é profunda, personalizada e incrivelmente precisa.", stars: 5, lang: "🇧🇷" },
  // IT
  { name: "Federica C.", role: "Artista", text: "I colori dell'outfit giornaliero risuonano con la mia energia. Ogni giorno è una piccola scoperta. Non posso più farne a meno!", stars: 5, lang: "🇮🇹" },
  // EN
  { name: "Olivia H.", role: "Yoga Teacher", text: "This tool perfectly complements my spiritual practice. The daily analysis gives me focus and intention for each day.", stars: 5, lang: "🇬🇧" },
  // FR
  { name: "Marc T.", role: "Chef d'entreprise", text: "J'utilise l'analyse de l'année personnelle pour planifier mes projets. Les résultats parlent d'eux-mêmes. Impressionnant.", stars: 5, lang: "🇫🇷" },
  // BR
  { name: "Juliana S.", role: "Advogada", text: "Comecei por curiosidade e agora não passo um dia sem consultar. A precisão da análise é realmente surpreendente.", stars: 5, lang: "🇧🇷" },
];

const ITEMS_PER_PAGE = 6; // 2 rows x 3 cols
const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);

const TestimonialsConversion = () => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setPage(next);
  }, []);

  const next = useCallback(() => goTo((page + 1) % totalPages, 1), [page, goTo]);
  const prev = useCallback(() => goTo((page - 1 + totalPages) % totalPages, -1), [page, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const currentItems = testimonials.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary-foreground text-sm font-medium mb-4">
            Storie Reali
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Cosa dicono <span className="text-gradient-gold">gli utenti</span>
          </h2>
        </motion.div>

        <div className="relative max-w-6xl mx-auto overflow-hidden" onMouseEnter={() => {}} onMouseLeave={() => {}}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {currentItems.map((t) => (
                <div
                  key={t.name}
                  className="p-5 rounded-2xl border border-border/50 bg-card/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                      ))}
                    </div>
                    <span className="text-lg">{t.lang}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3 italic line-clamp-4">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="p-2 rounded-full border border-border/50 hover:bg-muted/50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > page ? 1 : -1)}
                  className={`w-2 h-2 rounded-full transition-all ${i === page ? "bg-primary w-6" : "bg-muted-foreground/30"}`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2 rounded-full border border-border/50 hover:bg-muted/50 transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsConversion;

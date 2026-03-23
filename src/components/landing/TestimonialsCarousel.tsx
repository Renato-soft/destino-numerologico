import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  text: string;
  stars: number;
  flag: string;
}

const testimonials: Testimonial[] = [
  // 🇮🇹 Italiano (9)
  { name: "Giulia R.", text: "La mappa numerologica ha rivelato aspetti di me che non avevo mai considerato. Ora capisco perché certi schemi si ripetevano nella mia vita. Incredibile!", stars: 5, flag: "🇮🇹" },
  { name: "Marco D.", text: "Ho scoperto il mio anno personale e tutto ha iniziato ad avere senso. Le date favorevoli mi hanno aiutato a prendere decisioni importanti sul lavoro.", stars: 5, flag: "🇮🇹" },
  { name: "Francesca M.", text: "L'analisi di compatibilità con il mio compagno ci ha aperto gli occhi. Abbiamo capito come comunicare meglio e rispettare le nostre differenze.", stars: 5, flag: "🇮🇹" },
  { name: "Alessandro B.", text: "Il report avanzato di 20 pagine è stato come leggere la storia della mia anima. Ogni sezione era accurata e profonda. Vale ogni centesimo.", stars: 5, flag: "🇮🇹" },
  { name: "Chiara L.", text: "I 7 pilastri mi hanno dato una struttura per la crescita personale che non avevo mai trovato altrove. Ogni giorno è un passo avanti.", stars: 4, flag: "🇮🇹" },
  { name: "Roberto S.", text: "L'outfit del giorno basato sui miei numeri è un tocco geniale. I miei colleghi mi chiedono sempre perché sono così elegante ultimamente!", stars: 5, flag: "🇮🇹" },
  { name: "Valentina C.", text: "La chat con l'esperto AI è come avere un numerologo personale sempre a disposizione. Le risposte sono precise e illuminanti.", stars: 5, flag: "🇮🇹" },
  { name: "Davide P.", text: "Ho analizzato il nome del mio brand e ho capito perché non funzionava. Dopo il cambio suggerito, le vendite sono aumentate del 30%!", stars: 5, flag: "🇮🇹" },
  { name: "Simona T.", text: "L'analisi della casa mi ha fatto capire perché non mi sentivo a mio agio nel vecchio appartamento. Ora vivo in un indirizzo perfetto per me.", stars: 4, flag: "🇮🇹" },

  // 🇬🇧 English (9)
  { name: "Sarah K.", text: "This numerology map changed my perspective completely. The accuracy of the personality analysis gave me chills. I finally understand my life path.", stars: 5, flag: "🇬🇧" },
  { name: "James W.", text: "The personal year forecast was spot on. Every major event this year aligned perfectly with what the analysis predicted. Mind-blowing!", stars: 5, flag: "🇬🇧" },
  { name: "Emily H.", text: "I bought the compatibility analysis for my husband and me. It explained so much about our dynamic and how to grow together. Beautiful tool.", stars: 5, flag: "🇬🇧" },
  { name: "Michael T.", text: "The advanced report is worth every penny. Twenty pages of deep insights about my soul, destiny, and life phases. I keep re-reading it.", stars: 5, flag: "🇬🇧" },
  { name: "Charlotte B.", text: "The favorable dates feature helped me choose my wedding date. Everything went perfectly! I'm a believer now.", stars: 5, flag: "🇬🇧" },
  { name: "Daniel R.", text: "As a skeptic, I was surprised by how accurate the soul number analysis was. It described my deepest desires perfectly. Truly impressive.", stars: 4, flag: "🇬🇧" },
  { name: "Olivia M.", text: "The AI chat answered all my questions about my numbers in such a thoughtful way. It's like having a spiritual advisor on demand.", stars: 5, flag: "🇬🇧" },
  { name: "Thomas L.", text: "I used the brand analyzer for my startup name. The insights were incredibly practical and helped me rebrand successfully.", stars: 5, flag: "🇬🇧" },
  { name: "Sophie A.", text: "The daily outfit suggestions aligned with my numerological energy are such a fun and unique feature. Love starting my day with it!", stars: 4, flag: "🇬🇧" },

  // 🇭🇺 Hungarian (9)
  { name: "Katalin N.", text: "A numerológiai térképem teljesen megváltoztatta az önismeretemet. Végre értem, miért ismétlődtek bizonyos minták az életemben. Lenyűgöző!", stars: 5, flag: "🇭🇺" },
  { name: "Gábor F.", text: "A személyes évem elemzése döbbenetes pontossággal mutatta meg, mire számíthatok. Minden beigazolódott! Köszönöm ezt az eszközt.", stars: 5, flag: "🇭🇺" },
  { name: "Eszter V.", text: "A kompatibilitás elemzés megmutatta, miért működik olyan jól a kapcsolatunk a párommal, és hol kell még dolgoznunk. Nagyon hasznos!", stars: 5, flag: "🇭🇺" },
  { name: "László M.", text: "A részletes 20 oldalas riport olyan mély betekintést adott az életembe, amit semmilyen más eszköz nem tudott. Fantasztikus munka!", stars: 5, flag: "🇭🇺" },
  { name: "Boglárka S.", text: "A kedvező dátumok funkció segített kiválasztani az állásinterjúm időpontját. Megkaptam az állást! Véletlen? Nem hiszem.", stars: 5, flag: "🇭🇺" },
  { name: "Péter K.", text: "A 7 pillér program strukturáltan vezet a személyes fejlődés útján. Minden nap motiváltabb vagyok. Mindenkinek ajánlom!", stars: 4, flag: "🇭🇺" },
  { name: "Réka T.", text: "A márkaelemző segített megtalálni a tökéletes nevet a vállalkozásomnak. Az energia változás azonnali volt! Hihetetlen eszköz.", stars: 5, flag: "🇭🇺" },
  { name: "András H.", text: "Az AI chat személyre szabott válaszokat ad, mintha egy igazi numerológus ülne velem szemben. Minden kérdésemre pontos választ kaptam.", stars: 5, flag: "🇭🇺" },
  { name: "Zsófia B.", text: "A napi outfit javaslatok a numerológiai energiám alapján csodálatosak. A kollégáim mindig megkérdezik, mi a titkam!", stars: 4, flag: "🇭🇺" },

  // 🇧🇷 Português Brasileiro (8)
  { name: "Ana Paula S.", text: "O mapa numerológico revelou coisas sobre mim que eu nem imaginava. A precisão é surreal! Finalmente entendo meu caminho de vida.", stars: 5, flag: "🇧🇷" },
  { name: "Rafael O.", text: "A análise do ano pessoal foi certeira. Cada evento importante do meu ano coincidiu com as previsões. Estou impressionado!", stars: 5, flag: "🇧🇷" },
  { name: "Camila F.", text: "Fiz a análise de compatibilidade com meu namorado e foi revelador! Entendemos nossas diferenças e como nos complementamos.", stars: 5, flag: "🇧🇷" },
  { name: "Lucas M.", text: "O relatório avançado de 20 páginas é uma obra-prima. Cada seção trouxe insights profundos sobre minha alma e destino. Incrível!", stars: 5, flag: "🇧🇷" },
  { name: "Juliana R.", text: "As datas favoráveis me ajudaram a escolher o dia perfeito para abrir meu negócio. Tudo fluiu naturalmente desde então!", stars: 5, flag: "🇧🇷" },
  { name: "Pedro H.", text: "O chat com IA é como ter um numerólogo pessoal 24 horas. As respostas são profundas e personalizadas. Uso todos os dias!", stars: 5, flag: "🇧🇷" },
  { name: "Fernanda L.", text: "A análise do nome da minha marca mudou tudo! Depois de seguir as sugestões, meu Instagram cresceu 40% em um mês.", stars: 5, flag: "🇧🇷" },
  { name: "Thiago C.", text: "Os 7 pilares me deram uma estrutura de autoconhecimento que nunca encontrei em nenhum outro lugar. Transformador!", stars: 4, flag: "🇧🇷" },
];

const AUTOPLAY_INTERVAL = 4000;
const ITEMS_VISIBLE = 3;

const TestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  const getVisibleIndices = () => {
    const indices: number[] = [];
    for (let i = 0; i < ITEMS_VISIBLE; i++) {
      indices.push((current + i) % total);
    }
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary)/0.08)_0%,transparent_70%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Quote className="w-6 h-6 text-primary rotate-180" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Voci dal Cosmo
            </h2>
            <Quote className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Migliaia di persone hanno scoperto il loro destino numerologico
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <AnimatePresence mode="popLayout">
              {visibleIndices.map((idx, pos) => {
                const t = testimonials[idx];
                return (
                  <motion.div
                    key={`${idx}-${current}`}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: pos * 0.08 }}
                    className="relative group"
                  >
                    <div className="h-full rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors">
                      {/* Flag + Stars */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{t.flag}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.stars }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                          {Array.from({ length: 5 - t.stars }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-muted-foreground/30" />
                          ))}
                        </div>
                      </div>

                      {/* Quote */}
                      <p className="text-sm text-foreground/85 leading-relaxed flex-1 italic">
                        "{t.text}"
                      </p>

                      {/* Author */}
                      <div className="pt-2 border-t border-border/30">
                        <span className="text-sm font-medium text-primary">{t.name}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-8">
          {Array.from({ length: Math.min(total, 12) }).map((_, i) => {
            const dotIndex = Math.round((i / 11) * (total - 1));
            const isActive = dotIndex === current || (i === 11 && current >= dotIndex);
            return (
              <button
                key={i}
                onClick={() => setCurrent(dotIndex)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${dotIndex + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;

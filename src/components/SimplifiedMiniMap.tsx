import { motion } from "framer-motion";
import { Sparkles, Star, Heart, Shield, Sun } from "lucide-react";
import {
  calculateLifePath,
  calculateExpression,
  calculateSoul,
  calculatePersonality,
  calculateQuintessenza,
} from "@/lib/numerology";

interface SimplifiedMiniMapProps {
  nome: string;
  cognome: string;
  birthDate: string; // "YYYY-MM-DD"
}

// Simple, child-friendly descriptions for each number
const simpleLifePathDesc: Record<number, string> = {
  1: "Sei una persona che ama fare le cose a modo suo. Hai una forza speciale dentro di te che ti spinge a essere un leader naturale.",
  2: "Hai un cuore grande e sai ascoltare gli altri come pochi. Sei bravissimo a creare armonia intorno a te.",
  3: "Sei pieno di creatività e allegria! Le tue parole e le tue idee possono illuminare la giornata di chiunque.",
  4: "Sei affidabile come una roccia. Quando prometti qualcosa, la mantieni sempre. Le persone si fidano di te.",
  5: "Ami l'avventura e le novità! Hai bisogno di libertà e ogni giorno per te è un'occasione per scoprire qualcosa di nuovo.",
  6: "Sei il protettore del gruppo. Ti prendi cura degli altri con amore e sai creare un ambiente caldo e accogliente.",
  7: "Sei un pensatore profondo. Ti piace capire il perché delle cose e hai un'intuizione speciale.",
  8: "Hai una forza interiore incredibile. Sei capace di realizzare grandi cose e di ispirare gli altri con la tua determinazione.",
  9: "Hai un cuore generoso e una visione ampia del mondo. Vuoi fare la differenza e aiutare chi ti sta intorno.",
  11: "Hai un'intuizione fuori dal comune! Sei come un'antenna che capta cose che gli altri non vedono.",
  22: "Sei un grande costruttore di sogni. Hai la capacità rara di trasformare le idee più grandi in realtà concrete.",
  33: "Sei guidato dall'amore universale. La tua missione è portare luce e compassione nel mondo.",
};

const simpleSoulDesc: Record<number, string> = {
  1: "Nel profondo desideri essere indipendente e unico.",
  2: "Il tuo cuore cerca amore, pace e compagnia.",
  3: "La tua anima vuole esprimersi e creare bellezza.",
  4: "Dentro di te cerchi sicurezza e stabilità.",
  5: "La tua anima ha sete di libertà e nuove esperienze.",
  6: "Il tuo cuore desidera prendersi cura di chi ami.",
  7: "Dentro di te cerchi risposte e significato profondo.",
  8: "La tua anima aspira al successo e alla realizzazione.",
  9: "Il tuo cuore vuole aiutare il mondo a essere un posto migliore.",
  11: "La tua anima cerca ispirazione e risveglio spirituale.",
  22: "Dentro di te c'è il desiderio di costruire qualcosa di duraturo.",
  33: "La tua anima è guidata dall'amore incondizionato.",
};

const simplePersonalityDesc: Record<number, string> = {
  1: "Gli altri ti vedono come una persona forte e decisa.",
  2: "Appari come una persona gentile, calma e disponibile.",
  3: "Gli altri ti vedono come una persona solare e divertente.",
  4: "Appari come una persona seria, organizzata e affidabile.",
  5: "Gli altri ti vedono come una persona dinamica e avventurosa.",
  6: "Appari come una persona premurosa e responsabile.",
  7: "Gli altri ti vedono come una persona misteriosa e riflessiva.",
  8: "Appari come una persona autorevole e di successo.",
  9: "Gli altri ti vedono come una persona saggia e compassionevole.",
  11: "Appari come una persona carismatica e ispiratrice.",
  22: "Gli altri ti vedono come una persona capace di grandi imprese.",
  33: "Appari come una guida naturale piena di empatia.",
};

const icons = [
  { Icon: Sun, label: "Destino" },
  { Icon: Star, label: "Io" },
  { Icon: Heart, label: "Anima" },
  { Icon: Shield, label: "Personalità" },
  { Icon: Sparkles, label: "Quintessenza" },
];

const SimplifiedMiniMap = ({ nome, cognome, birthDate }: SimplifiedMiniMapProps) => {
  const [year, month, day] = birthDate.split("-").map(Number);
  const fullName = `${nome} ${cognome}`;

  const lifePath = calculateLifePath(day, month, year);
  const expression = calculateExpression(fullName);
  const soul = calculateSoul(fullName);
  const personality = calculatePersonality(fullName);
  const quintessenza = calculateQuintessenza(expression, lifePath);

  const numbers = [
    { value: lifePath, label: "Destino", desc: simpleLifePathDesc[lifePath] || simpleLifePathDesc[lifePath > 9 ? lifePath : 1] },
    { value: expression, label: "Io", desc: `Il tuo modo di esprimerti nel mondo è legato al numero ${expression}.` },
    { value: soul, label: "Anima", desc: simpleSoulDesc[soul] || simpleSoulDesc[soul > 9 ? soul : 1] },
    { value: personality, label: "Personalità", desc: simplePersonalityDesc[personality] || simplePersonalityDesc[personality > 9 ? personality : 1] },
    { value: quintessenza, label: "Quintessenza", desc: `Il numero ${quintessenza} rappresenta la sintesi di tutto ciò che sei.` },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-10"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">La tua anteprima numerologica</h2>
      </div>

      {/* Number circles */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {numbers.map((n, i) => {
          const { Icon } = icons[i];
          return (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="glass-cosmic rounded-xl p-3 text-center"
            >
              <Icon className="w-4 h-4 mx-auto mb-1 text-primary/70" />
              <div className="number-circle mx-auto mb-1 w-10 h-10 text-lg">{n.value}</div>
              <p className="text-[10px] text-muted-foreground font-medium">{n.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Simple descriptions */}
      <div className="space-y-3">
        {numbers.slice(0, 3).map((n, i) => (
          <motion.div
            key={n.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="rounded-xl border border-border/50 bg-card/50 p-4"
          >
            <p className="text-xs font-semibold text-primary mb-1">{n.label} — Numero {n.value}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{n.desc}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center italic">
        Questa è un'anteprima semplificata. Genera , dal menu a sinistram la Mappa Numerologica completa per un'analisi approfondita! ✨
      </p>
    </motion.section>
  );
};

export default SimplifiedMiniMap;

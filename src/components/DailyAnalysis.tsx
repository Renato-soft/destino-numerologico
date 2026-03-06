import { motion } from "framer-motion";
import { reduceNumber } from "@/lib/numerology";
import { sectorMeta, personalYearSectors, SectorKey } from "@/lib/personalYearSectors";
import { Heart, Briefcase, DollarSign, Leaf, Star, TrendingUp, AlertTriangle } from "lucide-react";

interface DailyAnalysisProps {
  personalYear: number;
  lifePath: number;
}

const sectorIcons: Record<SectorKey, React.ElementType> = {
  amore: Heart,
  lavoro: Briefcase,
  denaro: DollarSign,
  benessere: Leaf,
  crescita: Star,
};

// Day vibration descriptions with strengths and warnings per sector
const dayVibrationInsights: Record<number, Record<SectorKey, { forza: string; evita: string }>> = {
  1: {
    amore: { forza: "Prendi l'iniziativa: dichiara i tuoi sentimenti o proponi qualcosa di nuovo.", evita: "Evita di essere troppo autoritario o di imporre la tua visione al partner." },
    lavoro: { forza: "Giornata perfetta per lanciare idee, prendere decisioni e guidare progetti.", evita: "Evita di ignorare il contributo dei colleghi o di agire senza consultare il team." },
    denaro: { forza: "Buon momento per investimenti autonomi e decisioni finanziarie rapide.", evita: "Evita spese impulsive dettate dall'ego o acquisti per impressionare gli altri." },
    benessere: { forza: "Energia alta: ideale per iniziare un nuovo allenamento o routine salutare.", evita: "Evita di esagerare con lo sforzo fisico, rischi di strappi o sovraccarico." },
    crescita: { forza: "Momento di leadership interiore: fidati del tuo istinto e agisci.", evita: "Evita l'isolamento eccessivo: la forza non esclude la connessione." },
  },
  2: {
    amore: { forza: "Ascolta profondamente il partner. L'empatia oggi è il tuo superpotere.", evita: "Evita di sacrificarti troppo o di sopprimere i tuoi bisogni per compiacere." },
    lavoro: { forza: "Collabora, media, costruisci alleanze. Il lavoro di squadra porta risultati.", evita: "Evita conflitti diretti e decisioni unilaterali: oggi serve diplomazia." },
    denaro: { forza: "Buon giorno per trattative e accordi condivisi, joint venture.", evita: "Evita investimenti rischiosi o decisioni finanziarie sotto pressione emotiva." },
    benessere: { forza: "Attività dolci: yoga, meditazione, passeggiate nella natura.", evita: "Evita ambienti caotici e persone che drenano la tua energia." },
    crescita: { forza: "Sviluppa l'intelligenza emotiva e la capacità di ricevere.", evita: "Evita di confondere la gentilezza con la debolezza: mantieni i tuoi confini." },
  },
  3: {
    amore: { forza: "Flirta, divertiti, condividi risate. La leggerezza rafforza il legame.", evita: "Evita la superficialità: non scappare dalle conversazioni importanti." },
    lavoro: { forza: "Comunica, presenta, crea. La tua creatività oggi è magnetica.", evita: "Evita di disperdere energia su troppi progetti: scegli e concentrati." },
    denaro: { forza: "Opportunità legate alla comunicazione e alla visibilità sociale.", evita: "Evita spese eccessive per socializzare o apparire." },
    benessere: { forza: "Movimento espressivo: danza, sport di gruppo, attività creative.", evita: "Evita eccessi alimentari e notti troppo lunghe." },
    crescita: { forza: "Esprimi te stesso senza paura del giudizio altrui.", evita: "Evita di nasconderti dietro l'umorismo quando serve serietà." },
  },
  4: {
    amore: { forza: "Costruisci stabilità: piccoli gesti concreti valgono più delle parole.", evita: "Evita la rigidità emotiva: non tutto deve essere perfettamente organizzato." },
    lavoro: { forza: "Organizza, pianifica, struttura. Giornata eccellente per completare task.", evita: "Evita la resistenza al cambiamento e l'ossessione per i dettagli." },
    denaro: { forza: "Rivedi il budget, paga i debiti, pianifica risparmi a lungo termine.", evita: "Evita di bloccarti nella paura di spendere: investire è diverso da sprecare." },
    benessere: { forza: "Routine strutturata: palestra con programma, stretching, postura.", evita: "Evita di accumulare stress senza scaricarlo: il corpo tiene il conto." },
    crescita: { forza: "Disciplina e costanza: ogni piccolo passo costruisce grandi risultati.", evita: "Evita di sentirti limitato: la struttura è libertà, non prigione." },
  },
  5: {
    amore: { forza: "Avventura e novità: sorprendi il partner, esplora insieme.", evita: "Evita l'irrequietezza che sabota la stabilità: novità sì, tradimenti no." },
    lavoro: { forza: "Adattati, innova, proponi cambiamenti. La flessibilità viene premiata.", evita: "Evita decisioni impulsive come lasciare il lavoro senza un piano B." },
    denaro: { forza: "Opportunità improvvise: sii pronto a coglierle con lucidità.", evita: "Evita scommesse finanziarie rischiose e acquisti compulsivi." },
    benessere: { forza: "Sport all'aperto, avventure, nuove attività fisiche stimolanti.", evita: "Evita eccessi sensoriali: troppi stimoli affaticano il sistema nervoso." },
    crescita: { forza: "Espandi i tuoi orizzonti: viaggia, impara, sperimenta.", evita: "Evita di confondere la fuga con la libertà." },
  },
  6: {
    amore: { forza: "Dedica tempo alla famiglia e al partner. L'armonia domestica è al centro.", evita: "Evita di caricarti delle responsabilità altrui: aiutare non significa salvare." },
    lavoro: { forza: "Mentoring, cura del team, ruoli di responsabilità relazionale.", evita: "Evita il perfezionismo: fatto è meglio che perfetto." },
    denaro: { forza: "Investimenti nella casa, nella famiglia, nella qualità della vita.", evita: "Evita spese eccessive per gli altri trascurando te stesso." },
    benessere: { forza: "Cucina sana, ambienti armonici, cure termali e relax.", evita: "Evita di trascurare il tuo benessere per prenderti cura degli altri." },
    crescita: { forza: "Coltiva l'amore incondizionato e la responsabilità consapevole.", evita: "Evita il senso di colpa: puoi amare senza annullarti." },
  },
  7: {
    amore: { forza: "Intimità profonda e conversazioni significative con il partner.", evita: "Evita il distacco emotivo e l'isolamento: la solitudine non è solitudine dell'anima." },
    lavoro: { forza: "Analisi, ricerca, strategia. Giornata ideale per studio e riflessione.", evita: "Evita di rimandare le decisioni per eccesso di analisi (paralisi da analisi)." },
    denaro: { forza: "Studia investimenti con calma, fai ricerche approfondite prima di agire.", evita: "Evita di ignorare le opportunità per eccesso di prudenza." },
    benessere: { forza: "Meditazione, digiuno leggero, cura del sistema nervoso.", evita: "Evita l'eccesso di caffeina e stimolanti: il tuo sistema nervoso è già attivo." },
    crescita: { forza: "Autoanalisi, lettura, studio spirituale. La saggezza interiore emerge.", evita: "Evita il cinismo e lo scetticismo: non tutto deve essere dimostrato razionalmente." },
  },
  8: {
    amore: { forza: "Stabilità e sicurezza nella relazione. Dimostra il tuo impegno concreto.", evita: "Evita di usare il denaro o il potere come sostituti dell'affetto." },
    lavoro: { forza: "Affari, carriera, risultati concreti. Chiudi contratti e trattative.", evita: "Evita l'avidità e la competizione sleale: il karma dell'8 è immediato." },
    denaro: { forza: "Giornata potente per affari, negoziazioni e decisioni finanziarie importanti.", evita: "Evita la mentalità della scarsità: investi con fiducia ma con criterio." },
    benessere: { forza: "Allenamento intenso e strutturato: il corpo risponde alla sfida.", evita: "Evita di ignorare lo stress accumulato: il burnout è reale." },
    crescita: { forza: "Lavora sul tuo rapporto con il potere e l'abbondanza.", evita: "Evita di misurare il tuo valore in base ai risultati materiali." },
  },
  9: {
    amore: { forza: "Compassione, perdono, chiusura di cicli. Lascia andare ciò che non serve.", evita: "Evita di aggrapparti a relazioni finite: il lasciar andare apre nuove porte." },
    lavoro: { forza: "Concludi progetti, fai bilanci, prepara il terreno per il nuovo.", evita: "Evita di iniziare nuovi progetti importanti: è tempo di chiudere, non aprire." },
    denaro: { forza: "Dona, condividi, restituisci. La generosità viene ricambiata.", evita: "Evita di trattenere ossessivamente: il denaro bloccato ristagna." },
    benessere: { forza: "Detox fisico ed emotivo. Pulizia, purificazione, rilascio.", evita: "Evita la malinconia e il rimpianto: guarda avanti con gratitudine." },
    crescita: { forza: "Saggezza e compassione universale. Diventa un faro per gli altri.", evita: "Evita il vittimismo: le prove del 9 sono trasformative, non punizioni." },
  },
};

function getDayVibration(): number {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const sum = day + month + reduceNumber(year);
  return reduceNumber(sum);
}

const DailyAnalysis = ({ personalYear, lifePath }: DailyAnalysisProps) => {
  const dayVibe = getDayVibration();
  const sectors: SectorKey[] = ['lavoro', 'amore', 'denaro', 'benessere', 'crescita'];
  
  // Get insights for today's vibration (fallback to reduced if master number)
  const vibeKey = dayVibe > 9 ? reduceNumber(dayVibe % 10 + Math.floor(dayVibe / 10)) : dayVibe;
  const insights = dayVibrationInsights[vibeKey] || dayVibrationInsights[1];
  
  // Get personal year sector data for context
  const yearKey = personalYear > 9 ? reduceNumber(personalYear) : personalYear;
  const yearSectors = personalYearSectors[yearKey];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="number-circle w-12 h-12 text-xl">{dayVibe}</div>
        <div>
          <h2 className="font-display text-xl font-semibold">
            Analisi del giorno — {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-sm text-muted-foreground">
            Vibrazione del giorno: <span className="text-primary font-semibold">{dayVibe}</span> · Anno Personale: <span className="text-primary font-semibold">{personalYear}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sectors.map((sector, index) => {
          const Icon = sectorIcons[sector];
          const meta = sectorMeta[sector];
          const insight = insights[sector];

          return (
            <motion.div
              key={sector}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass-cosmic rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{meta.title}</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{insight.forza}</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{insight.evita}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default DailyAnalysis;

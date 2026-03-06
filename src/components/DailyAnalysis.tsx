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

// Motivational messages based on dayVibe + personalYear combo
const motivationalMessages: Record<string, string> = {
  "1-1": "Doppia energia di comando: oggi sei inarrestabile. Usa questa forza per iniziare ciò che hai sempre rimandato.",
  "1-2": "La tua riflessione interiore trova oggi il coraggio di manifestarsi. Agisci con equilibrio e determinazione.",
  "1-3": "L'iniziativa oggi si veste di creatività. Proponi quell'idea folle: ha più senso di quanto credi.",
  "1-4": "Struttura e iniziativa si fondono: è il giorno giusto per gettare le basi di qualcosa di solido e duraturo.",
  "1-5": "Libertà e comando: oggi rompi gli schemi con consapevolezza. Il cambiamento che inizi oggi ha radici profonde.",
  "1-6": "La tua leadership oggi si esprime nella cura degli altri. Guidare con il cuore è il vero potere.",
  "1-7": "La tua analisi profonda trova oggi la spinta per trasformarsi in azione concreta. Fidati della tua intuizione.",
  "1-8": "Potere su potere: giornata formidabile per affari e decisioni importanti. Il successo è a portata di mano.",
  "1-9": "Chiudi un capitolo con la forza di un leader. Il coraggio di lasciar andare apre porte straordinarie.",
  "2-1": "Oggi la collaborazione nasce da un'idea forte. Ascolta gli altri, ma non perdere la tua visione.",
  "2-2": "Sensibilità raddoppiata: sei un radar emotivo. Usa questo dono per creare armonia dove c'è tensione.",
  "2-3": "Diplomazia e creatività si abbracciano. Le tue parole oggi hanno il potere di guarire e ispirare.",
  "2-4": "Pazienza e collaborazione costruiscono ponti solidi. Ogni alleanza stretta oggi durerà nel tempo.",
  "2-5": "Adattabilità e sensibilità ti rendono il mediatore perfetto in situazioni caotiche. Sii l'ancora.",
  "2-6": "Amore e armonia al massimo: oggi ogni gesto gentile torna indietro moltiplicato.",
  "2-7": "Intuizione profonda: oggi ascolti ciò che gli altri non dicono. La tua empatia è chiaroveggenza.",
  "2-8": "La tua diplomazia apre le porte del potere. Negozia con grazia e ottieni più di quanto speri.",
  "2-9": "Compassione e cooperazione: oggi sei un guaritore naturale. Il tuo cuore grande fa la differenza.",
  "3-1": "Creatività esplosiva: le tue idee oggi hanno la forza di diventare realtà. Non censurarti.",
  "3-2": "La tua arte incontra la sensibilità. Ciò che crei oggi tocca il cuore delle persone.",
  "3-3": "Espressione pura: oggi il tuo carisma è incontenibile. Parla, crea, brilla senza freni.",
  "3-4": "La creatività trova struttura: è il giorno per trasformare un'idea brillante in un piano concreto.",
  "3-5": "Energia vulcanica: oggi tutto è possibile. Socializza, esplora, lascia il segno ovunque vai.",
  "3-6": "La tua creatività oggi è al servizio dell'amore. Un gesto artistico per chi ami vale più di mille parole.",
  "3-7": "L'ispirazione nasce dalla profondità. Oggi la tua creatività ha radici spirituali: lasciala fluire.",
  "3-8": "Carisma e ambizione: oggi la tua comunicazione apre porte importanti nel mondo degli affari.",
  "3-9": "Il tuo talento espressivo oggi chiude cicli creativi. Finisci quel progetto: è il momento.",
  "4-1": "Le fondamenta che costruisci oggi reggono una nuova grande iniziativa. Pianifica e agisci.",
  "4-2": "Metodo e collaborazione: oggi il lavoro di squadra produce risultati concreti e misurabili.",
  "4-3": "La disciplina incontra l'ispirazione. Oggi riesci a dare forma alle idee più ambiziose.",
  "4-4": "Solidità assoluta: oggi sei una roccia. Ogni sforzo costruisce qualcosa di permanente.",
  "4-5": "Ordine nel caos: oggi la tua capacità organizzativa trasforma l'imprevisto in opportunità.",
  "4-6": "Stabilità e cura: oggi costruisci sicurezza per te e per chi ami. Ogni dettaglio conta.",
  "4-7": "Studio e metodo: oggi la tua mente analitica raggiunge intuizioni straordinarie.",
  "4-8": "Disciplina e potere: oggi il tuo lavoro duro viene riconosciuto e ricompensato.",
  "4-9": "Completa con metodo ciò che hai iniziato. La chiusura ordinata apre spazi nuovi.",
  "5-1": "Cambiamento e coraggio: oggi sei il pioniere di una nuova avventura. Parti senza esitare.",
  "5-2": "La tua flessibilità oggi si esprime nella capacità di adattarti alle emozioni altrui con grazia.",
  "5-3": "Libertà creativa al massimo: oggi ogni esperienza diventa ispirazione. Vivi intensamente.",
  "5-4": "Il cambiamento trova struttura: oggi le novità si integrano nella tua routine in modo naturale.",
  "5-5": "Libertà totale: oggi il mondo è la tua tela. Attenzione solo a non disperdere troppa energia.",
  "5-6": "L'avventura oggi è al servizio dell'amore. Sorprendi chi ami con qualcosa di inaspettato.",
  "5-7": "La curiosità incontra la profondità. Oggi una scoperta apparentemente casuale cambia la tua prospettiva.",
  "5-8": "Rischio calcolato: oggi la tua audacia negli affari paga. Cogli l'attimo con intelligenza.",
  "5-9": "Lascia andare il vecchio per abbracciare il nuovo. Oggi il cambiamento è liberazione.",
  "6-1": "La cura degli altri oggi ti rende leader naturale. L'amore è la forma più alta di autorità.",
  "6-2": "Armonia doppia: oggi sei il cuore pulsante della tua comunità. Ogni relazione fiorisce.",
  "6-3": "L'amore si esprime attraverso la bellezza. Oggi crea qualcosa di bello per chi ti circonda.",
  "6-4": "Responsabilità e stabilità: oggi costruisci un nido sicuro. La tua dedizione è il dono più grande.",
  "6-5": "L'amore chiede libertà: oggi trova l'equilibrio tra cura e spazio personale.",
  "6-6": "Amore puro e incondizionato: oggi il tuo cuore è un rifugio per tutti. Non dimenticare te stesso.",
  "6-7": "La cura incontra la saggezza. Oggi le tue parole guariscono chi ti ascolta.",
  "6-8": "Responsabilità e abbondanza: oggi il tuo impegno per gli altri genera prosperità per tutti.",
  "6-9": "Amore universale: oggi chiudi con compassione ciò che non serve più per fare spazio al nuovo.",
  "7-1": "La tua saggezza interiore oggi trova il coraggio di esprimersi. Le tue intuizioni sono oro.",
  "7-2": "Profondità e sensibilità: oggi percepisci verità nascoste. Fidati delle tue sensazioni.",
  "7-3": "L'analisi incontra la creatività: oggi le tue riflessioni generano idee brillanti e originali.",
  "7-4": "Studio metodico: oggi ogni ricerca porta a scoperte significative. La pazienza ripaga.",
  "7-5": "La saggezza abbraccia il cambiamento. Oggi un'intuizione improvvisa apre nuovi orizzonti.",
  "7-6": "La riflessione profonda oggi si mette al servizio dell'amore. Comprendi ciò che il cuore sussurra.",
  "7-7": "Giornata di illuminazione interiore. Oggi la tua mente penetra i misteri con chiarezza cristallina.",
  "7-8": "L'intelletto guida il potere: oggi le tue strategie sono impeccabili. Agisci con precisione.",
  "7-9": "Saggezza e trascendenza: oggi comprendi il senso profondo delle prove che hai attraversato.",
  "8-1": "Potere e iniziativa: oggi sei il comandante del tuo destino. Ogni decisione è vincente.",
  "8-2": "Il potere oggi si esprime nella diplomazia. Le alleanze strategiche moltiplicano il successo.",
  "8-3": "Ambizione e carisma: oggi la tua comunicazione apre porte importanti. Presentati al meglio.",
  "8-4": "Potere e disciplina: oggi il tuo lavoro sistematico produce risultati straordinari.",
  "8-5": "L'ambizione incontra l'audacia: oggi i rischi calcolati portano grandi ricompense.",
  "8-6": "Il successo materiale oggi è al servizio dell'amore. Usa la tua forza per proteggere chi ami.",
  "8-7": "Strategia e intuizione: oggi le tue mosse sono guidate da una saggezza profonda.",
  "8-8": "Potenza totale: oggi l'universo amplifica ogni tua azione. Agisci con integrità e raccoglierai in abbondanza.",
  "8-9": "Il potere del lasciar andare: oggi chiudi affari e situazioni con maestria e visione a lungo termine.",
  "9-1": "Fine e nuovo inizio: oggi chiudi un ciclo con la forza di chi sa dove sta andando.",
  "9-2": "Il completamento oggi richiede delicatezza. Lascia andare con grazia e compassione.",
  "9-3": "La chiusura di un ciclo genera ispirazione. Oggi ciò che finisce diventa arte e insegnamento.",
  "9-4": "Concludi con ordine e metodo. Ogni finale ben gestito costruisce le basi del futuro.",
  "9-5": "Liberazione totale: oggi il vecchio crolla per fare spazio a qualcosa di completamente nuovo.",
  "9-6": "Chiudi con amore: oggi il perdono e la gratitudine sono le chiavi della trasformazione.",
  "9-7": "Comprensione profonda: oggi vedi il disegno più grande dietro ogni prova e ogni perdita.",
  "9-8": "Il bilancio finale rivela abbondanza nascosta. Oggi scopri quanto sei ricco dentro e fuori.",
  "9-9": "Trasformazione totale: oggi muore il vecchio te e nasce una versione più saggia e luminosa.",
};

function getMotivationalMessage(dayVibe: number, personalYear: number): string {
  const dv = dayVibe > 9 ? reduceNumber(dayVibe) : dayVibe;
  const py = personalYear > 9 ? reduceNumber(personalYear) : personalYear;
  return motivationalMessages[`${dv}-${py}`] || "Oggi è un giorno unico: ascolta la tua voce interiore e lasciati guidare dalla saggezza dei numeri.";
}

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
  
  // Get motivational message
  const motivation = getMotivationalMessage(dayVibe, personalYear);

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

      {/* Motivational message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.18 }}
        className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-primary/15 via-accent/10 to-primary/5 border border-primary/20"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <p className="text-foreground font-medium italic leading-relaxed">
            "{motivation}"
          </p>
        </div>
      </motion.div>

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
                  <TrendingUp className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{insight.forza}</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
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

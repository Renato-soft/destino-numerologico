// I 7 Pilastri del Destino – Contenuti per ogni modulo

export interface PillarContent {
  index: number;
  id: string;
  title: string;
  subtitle: string;
  icon: string; // emoji
  color: string; // tailwind gradient
  mapKey: "soul" | "destiny_expression" | "personality" | "life_path" | null;
  description: string;
  lightQualities: string[];
  shadowQualities: string[];
  exercise: {
    title: string;
    instructions: string[];
    reflection: string;
  };
  meditation: {
    title: string;
    duration: string;
    steps: string[]; // Short summary steps shown to user
    script: string; // Full guided meditation script with {nome} placeholder (hidden from UI)
  };
  badgeId: string;
  badgeName: string;
  badgeEmoji: string;
}

export const pillarsContent: PillarContent[] = [
  {
    index: 0,
    id: "anima",
    title: "L'Anima",
    subtitle: "Il tuo desiderio più profondo",
    icon: "💎",
    color: "from-violet-500 to-purple-600",
    mapKey: "soul",
    description: "Immagina di avere dentro di te un piccolo fuoco. Questo fuoco è il tuo desiderio più grande, quello che ti fa sentire davvero vivo e felice. È come quando desideri tantissimo un giocattolo nuovo o una gita speciale: quel desiderio profondo che ti guida.  Nella numerologia, questo desiderio si chiama 'Anima' e lo scopriamo guardando le vocali del tuo nome, come i suoni più veri che escono da te.",
    lightQualities: [
      "Amore (desiderare di volere bene a tutti, come quando abbracci forte un amico)",
      "Passione (fare ciò che ami con tutto il cuore, come costruire un castello di LEGO per ore)",
      "Intuizione (sentire cosa è giusto senza capire perché, come quando sai che pioverà prima di veder le nuvole)",
      "Creatività (inventare cose nuove e speciali, come un disegno coloratissimo)",
    ],
    shadowQualities: [
      "Egocentrismo (pensare solo a se stessi, come volere sempre la palla per giocare da soli)",
      "Incapacità di Amare (fare fatica a mostrare affetto, come non voler dare un bacio alla nonna)",
      "Mancanza di scopo (non sapere cosa fare nella vita, come girare a vuoto senza una meta nel parco giochi)",
      "Soddisfazione immediata (volere tutto e subito senza aspettare, come arrabbiarsi se non ti danno il gelato subito)",
    ],
    exercise: {
      title: "Il diario dei desideri segreti",
      instructions: [
        "Prendi un bel quaderno e delle matite colorate, sarà il tuo 'Diario dei Desideri Segreti'.",
        "Ogni sera, prima di dormire, pensa a qualcosa che ti ha fatto sentire davvero felice o emozionato durante il giorno. Scrivi o disegna qual era quel momento e perché ti è piaciuto tanto. Ad esempio, 'Oggi ho aiutato la mamma a cucinare, mi sentivo utile!'",
        "Pensa anche a quello che ti piacerebbe fare di più o che desideri fortemente per il futuro. Ad esempio, 'Vorrei tanto imparare a suonare la chitarra'.",
        "Non avere paura di scrivere desideri grandi o piccoli. Questo diario è solo per te.",
        "Dopo qualche settimana, rileggi il tuo diario. Vedrai che ci sono argomenti che tornano spesso, come 'aiutare gli altri' o 'creare cose nuove'. Questo ti darà un'idea del tuo fuoco interiore.",
      ],
      reflection: "Questo esercizio ti aiuta a capire cosa ti rende davvero felice e cosa desideri con tutto il cuore, il tuo 'fuoco' speciale.",
    },
    meditation: {
      title: "Meditazione del Cuore Profondo",
      duration: "10 minuti",
      steps: [
        "Chiudi gli occhi e porta l'attenzione al centro del petto.",
        "Immagina una luce calda che pulsa nel tuo cuore.",
        "Ad ogni respiro, la luce si espande lentamente.",
        "Chiedi silenziosamente: \"Cosa desidera veramente la mia Anima?\"",
        "Resta in ascolto per 3-5 minuti senza giudicare le risposte.",
        "Ringrazia e apri dolcemente gli occhi.",
      ],
      script: " Pace a te, {nome}. Sono un vecchio monaco e sono qui per guidarti. Siediti comodamente, caro mio, e permetti al tuo corpo di rilassarsi completamente. Lascia che le spalle si abbassino, che la fronte si distenda. Chiudi gli occhi dolcemente, come fiori che si riposano al tramonto. ... Ora, {nome}, porta la tua attenzione al tuo respiro. Senti l'aria fresca entrare ed uscire dal tuo corpo. Non forzarlo, lascialo fluire così come vuole. ... Immagina ora, proprio al centro del tuo petto, un piccolo puntino luminoso. È come una piccola scintilla, una luce delicata che brilla. Questa luce è il tuo desiderio più profondo, il tuo vero Sé, l'essenza di ciò che sei. ... Non devi fare nulla, solo osservarla. Lascia che questa scintilla, questa luce, diventi un po' più grande ad ogni respiro. Non è un fuoco che brucia, ma uno che riscalda, che illumina con dolcezza. ... Forse, mentre la osservi, ti verrà in mente qualcosa che ti rende davvero felice, qualcosa che ti fa sentire completo e in pace. Non afferrare quel pensiero, lascialo danzare nella tua mente come una leggera farfalla. ... Siamo solo osservatori in questo momento, {nome}. Osserviamo la purezza del tuo desiderio più sacro. È lì, sempre presente, anche quando la vita sembra confusa o rumorosa. ... Quando sei pronto, con calma, apri lentamente gli occhi, portando con te questa consapevolezza. Ricorda che questo seme luminoso è sempre dentro di te, pronto a guidarti.",
    },
    badgeId: "pillar_anima",
    badgeName: "Guardiano dell'Anima",
    badgeEmoji: "💎",
  },
  {
    index: 1,
    id: "espressione",
    title: "L'Io (Espressione)",
    subtitle: "Come ti manifesti nel mondo",
    icon: "🌟",
    color: "from-amber-500 to-orange-500",
    mapKey: "destiny_expression",
    description: "Immagina di essere un supereroe. Il tuo 'Io Espressione' è il tuo superpotere, il modo speciale in cui ti mostri al mondo. È come il tuo modo di giocare, di parlare, di aiutare gli altri. Alcuni sono bravi a disegnare, altri a raccontare storie, altri ancora a far ridere. Questo è il tuo modo unico di lasciare un 'segno' nel mondo, i tuoi talenti nascosti o evidenti.",
    lightQualities: [
      "Unicità (essere te stesso in modo speciale, come avere un taglio di capelli solo tuo)",
      "Talento (fare cose molto bene, come essere bravo a disegnare o a cantare)",
      "Influenza positiva (aiutare gli altri a stare bene, come quando fai un complimento a un amico e lo rendi felice)",
      "Spontaneità (essere naturale e vero, come ridere a crepapelle senza pensare a chi ti guarda)",
    ],
    shadowQualities: [
      "Timidezza eccessiva (non mostrarsi per paura, come volere giocare ma non chiedere mai di unirti al gruppo)",
      "Vanità (voler essere sempre al centro dell'attenzione, come fare i capricci se non ti guardano)",
      "Invisibilità (non mostrare ciò che si è davvero, come nascondere i propri disegni perché si ha paura che non piacciano)",
      "Mancanza di riconoscimento (sentire che nessuno vede i tuoi sforzi, come quando pulisci la stanza ma nessuno se ne accorge)",
    ],
    exercise: {
      title: "La scatola dei miei superpoteri",
      instructions: [
        "Prendi una scatola vecchia (di scarpe, di biscotti) e decorala come più ti piace: sarà la tua 'Scatola dei Superpoteri'.",
        "Pensa ai momenti in cui ti sei sentito davvero bravo o felice. Forse hai aiutato qualcuno, hai fatto un bel disegno, hai risolto un problema difficile.",
        "Su piccoli foglietti di carta, scrivi o disegna questi 'superpoteri' che hai usato. Ad esempio, 'Sono bravo ad ascoltare' o 'So fare i ponti con le costruzioni'.",
        "Metti i foglietti nella tua scatola. Puoi anche aggiungere oggetti che rappresentano i tuoi talenti, come un pastello se ti piace disegnare o una piccola palla se ti piace giocare.",
        "Ogni volta che ti senti triste o insicuro, apri la tua scatola e leggi i tuoi superpoteri. Ricorda quanto sei speciale e unico!",
      ],
      reflection: "Questa scatola ti aiuta a ricordare tutti i tuoi talenti e come li usi per mostrarti al mondo. È il tuo modo unico di 'brillare'.",
    },
    meditation: {
      title: "Meditazione della Luce Creativa",
      duration: "8 minuti",
      steps: [
        "Siediti comodamente e immagina una luce dorata sopra la tua testa.",
        "La luce scende lentamente e avvolge ogni parte del tuo corpo.",
        "Senti ogni cellula vibrare con la tua energia unica.",
        "Visualizza te stesso mentre esprimi il tuo talento più grande.",
        "Senti la gioia e la libertà di quell'espressione.",
        "Porta questa sensazione con te nella giornata.",
      ],
      script: " Benvenuto ancora, {nome}. Siediti comodamente e lascia che il tuo respiro diventi calmo e regolare. Sentiti radicato alla terra sotto di te, come un albero con le sue radici profonde... Chiudi gli occhi, {nome}, e porta l'attenzione al centro del tuo petto. Immagina che da lì parta un raggio di luce, un raggio colorato e brillante. Questa luce è la tua 'Espressione', il tuo modo unico di mostrarti al mondo. ... Forse è un raggio giallo, che simboleggia la tua gioia e la tua capacità di far ridere. O un raggio blu, che mostra la tua calma e la tua saggezza. O rosso, per la tua energia e il tuo coraggio. ... Non preoccuparti del colore, caro {nome}. Lascia che sia la tua luce a scegliersi. Senti come questo raggio si espande dal tuo corpo, toccando le persone e le cose intorno a te con gentilezza. ... Questo raggio rappresenta i tuoi talenti, le tue passioni, il modo in cui parli, come ti muovi, come risolvi i problemi. È il tuo modo speciale di interagire con il mondo. ... Senti la bellezza di questa luce unica. Non ci sono altre luci esattamente come la tua. È il tuo dono speciale per il mondo. ... Accetta e ama questa luce, {nome}. Non c'è bisogno di nasconderla o cambiarla. È perfetta così com'è. ... Quando ti sentirai pronto, con calma, apri gli occhi, e porta con te la consapevolezza della tua luce unica.",
    },
    badgeId: "pillar_espressione",
    badgeName: "Maestro dell'Espressione",
    badgeEmoji: "🌟",
  },
  {
    index: 2,
    id: "personalita",
    title: "La Personalità",
    subtitle: "La maschera e lo scudo",
    icon: "🎭",
    color: "from-emerald-500 to-teal-500",
    mapKey: "personality",
    description: "Pensa a quando vai ad una festa di carnevale e indossi un costume. Quello è il modo in cui gli altri ti vedono, la 'maschera' che mostri all'esterno. La tua 'Personalità' è un po' così: è come gli altri ti percepiscono quando ti incontrano per la prima volta. È il tuo 'vestito' esteriore, il tuo modo di presentarti al mondo, a volte diverso da come sei davvero dentro.",
    lightQualities: [
      "Flessibilità (adattarsi bene alle situazioni, come quando cambi gioco senza problemi)",
      "Simpatia (piacere agli altri, come quando tutti vogliono giocare con te)",
      "Affidabilità (si può contare su di te, come quando un amico ti affida un segreto)",
      "Spigliato (essere naturale e disinvolto, come fare una presentazione a scuola senza paura)",
    ],
    shadowQualities: [
      "Inautenticità (non essere te stesso, come fingere di essere interessato a qualcosa che non ti piace)",
      "Rigidità (non cambiare idea, come volere solo il tuo gioco e non provare gli altri)",
      "Superficialità (non andare in profondità, come parlare solo del tempo e non di cose importanti)",
      "Dipendenza dal giudizio (fare le cose per piacere agli altri, come scegliere i vestiti solo perché piacciono ai tuoi amici)",
    ],
    exercise: {
      title: "Lo specchio magico",
      instructions: [
        "Prendi un foglio di carta e dividilo in due colonne. Intitola una colonna 'Come mi vedo io' e l'altra 'Come credo mi vedano gli altri'.",
        "Nella prima colonna, scrivi cinque aggettivi che useresti per descrivere te stesso (ad esempio, 'timido', 'curioso', 'allegro', 'testardo', 'generoso').",
        "Nella seconda colonna, prova a immaginare cinque aggettivi che i tuoi amici o i tuoi genitori userebbero per descriverti. Non preoccuparti se sono diversi dalle tue idee. Ad esempio, 'socievole', 'disordinato', 'bravo a calcio'.",
        "Ora, scegli tre persone di cui ti fidi (un amico, un genitore, un insegnante) e chiedi loro: 'Se dovessi descrivermi con tre parole, quali sceglieresti?'.",
        "Confronta le risposte con quello che hai scritto. Vedrai che a volte c'è una differenza tra come ti senti dentro e come gli altri ti percepiscono. È normale!",
        "Rifletti: C'è qualche 'maschera' che indossi a volte? Come ti senti ad indossarla?",
      ],
      reflection: "Questo esercizio ti aiuta a capire come gli altri ti vedono. Non è sempre uguale a come ti senti dentro, ed è importante esserne consapevoli per essere più veri con te stesso e gli altri.",
    },
    meditation: {
      title: "Meditazione dello Specchio Interiore",
      duration: "10 minuti",
      steps: [
        "Chiudi gli occhi e immagina di stare davanti a uno specchio.",
        "Osserva l'immagine riflessa: questa è la tua Personalità.",
        "Ora guarda oltre lo specchio e vedi il tuo vero sé.",
        "Nota le differenze senza giudizio.",
        "Immagina che lo specchio diventi trasparente, unificando le due immagini.",
        "Respira profondamente e accogli l'integrazione.",
      ],
      script: " Respiriamo insieme, {nome}. Lascia che ogni espirazione sciolga un po' di tensione, che ogni inspirazione porti nuova calma. Immagina ora di essere un attore su un piccolo palco. ... Oggi, caro {nome}, non c'è pubblico. Sei solo tu. Immagina di indossare tanti abiti diversi, tanti costumi. Questo è ciò che mostriamo al mondo: la nostra 'Personalità'. ... Qualche volta indossiamo l'abito della 'persona forte', altre volte quello della 'persona divertente', o della 'persona timida'. Sono tutti modi di presentarti. ... Ora, con gli occhi della tua mente, togliti tutti questi abiti, un costume alla volta. Lascia che cadano ai tuoi piedi. Non c'è bisogno di nascondersi qui, in questo spazio sacro. ... Senti la leggerezza di non avere più addosso nessuna 'maschera'. Chi sei tu, senza nessun abito, senza nessun ruolo? Senti la tua pelle, la tua vera essenza. ... Non c'è nulla da cambiare, nulla da giudicare. Siamo solo esseri umani che, a volte, indossano abiti per sentirsi più sicuri o per essere accettati. ... Ma ricorda, la tua vera bellezza, la tua vera natura, è sotto ogni travestimento. ... Quando sarai pronto, {nome}, apri gli occhi. E porta con te la consapevolezza di chi sei, al di là di ciò che mostri al mondo.",
    },
    badgeId: "pillar_personalita",
    badgeName: "Alchimista della Personalità",
    badgeEmoji: "🎭",
  },
  {
    index: 3,
    id: "destino",
    title: "Il Destino",
    subtitle: "Il sentiero della tua vita",
    icon: "🧭",
    color: "from-blue-500 to-indigo-600",
    mapKey: "life_path",
    description: "Immagina la tua vita come un videogioco in cui devi superare diverse sfide per andare avanti. Il 'Destino' è un po' come la mappa di questo videogioco: ti mostra le sfide più importanti che incontrerai e le lezioni che dovrai imparare per diventare migliore. Non è qualcosa che non puoi cambiare, ma un sentiero che ti dà delle indicazioni su dove concentrare la tua energia. È il motivo per cui sei qui.",
    lightQualities: [
      "Saggezza (imparare dalle esperienze, come quando impari a non toccare la stufa bollente)",
      "Scopo (avere una meta chiara, come sapere che vuoi diventare un calciatore e allenarti ogni giorno)",
      "Realizzazione (sentirsi soddisfatti di ciò che si fa, come costruire un bellissimo Lego e sentirti orgoglioso)",
      "Resilienza (non arrendersi davanti alle difficoltà, come riprovare a salire sulla bici anche dopo una caduta)",
    ],
    shadowQualities: [
      "Rinuncia (abbandonare i propri sogni, come smettere di giocare a calcio perché hai paura di sbagliare un gol)",
      "Frustrazione (sentirsi arrabbiati e insoddisatti, come quando non riesci a risolvere un problema e ti innervosisci)",
      "Incertezza (non sapere cosa fare, come non sapere quale strada prendere in un bosco)",
      "Fatalismo (pensare che non si possa cambiare nulla, come credere che pioverà sempre e non uscire di casa)",
    ],
    exercise: {
      title: "Il mio 'Libro delle Avventure'",
      instructions: [
        "Prendi un quaderno nuovo che sarà il tuo 'Libro delle Avventure'.",
        "Pensa ai momenti più difficili che hai affrontato finora. Potrebbe essere stato un litigio con un amico, una difficoltà a scuola o una paura che hai superato. Scrivile o disegnale nel tuo libro.",
        "Ora, per ogni difficoltà, pensa: 'Cosa ho imparato da questa situazione?'. Scrivi la lezione appresa. Ad esempio, da un litigio con un amico, potresti aver imparato 'a chiedere scusa' o 'ad ascoltare di più'.",
        "Pensa anche ai tuoi sogni e desideri più grandi per il futuro. Quali 'avventure' vorresti vivere? Quali 'tesori' (come imparare una lingua, visitare un posto) vorresti trovare? Disegnali o scrivili.",
        "Ogni tanto, rileggi il tuo 'Libro delle Avventure'. Vedrai come le difficoltà ti hanno reso più forte e come i tuoi sogni ti danno la motivazione per andare avanti. Questo è il tuo 'Destino' in azione!",
      ],
      reflection: "Questo esercizio ti aiuta a vedere le sfide della vita come opportunità per imparare e crescere, e a capire il tuo scopo nel mondo.",
    },
    meditation: {
      title: "Meditazione del Sentiero",
      duration: "12 minuti",
      steps: [
        "Chiudi gli occhi e immagina di camminare su un sentiero in un bosco.",
        "Il sentiero rappresenta il tuo Destino. Osserva il paesaggio attorno.",
        "Guarda indietro e vedi da dove sei venuto. Onora il cammino fatto.",
        "Guarda avanti: cosa vedi? Lascia che l'intuizione ti mostri il prossimo passo.",
        "Senti la terra sotto i piedi e la fiducia nel tuo percorso.",
        "Apri gli occhi portando con te questa certezza interiore.",
      ],
      script: " Carissimo {nome}, prendi una posizione comoda e lascia che il tuo respiro ti porti in uno stato di calma profonda. ... Chiudi gli occhi, {nome}, e immagina di essere su un sentiero sereno in un bosco incantato. Questo sentiero è il tuo 'Destino', il cammino che la tua anima ha scelto. ... A volte il sentiero è largo e illuminato dal sole, e camminare è facile. Altre volte, ci sono delle salite, o qualche sasso sul cammino. Queste sono le lezioni che la vita ti offre. ... Non devi avere paura di queste lezioni, {nome}. Sono lì per farti diventare più saggio, più forte, più consapevole. Ogni sasso superato, ogni salita affrontata, ti mostra qualcosa di te stesso che non conoscevi. ... Senti che questo sentiero è tuo, e solo tuo. Non c'è un modo giusto o sbagliato di percorrerlo. ... Semplicemente, osserva il paesaggio. Cosa vedi? Forse alberi maestosi, fiori colorati, uccelli che cantano. C'è bellezza in ogni angolo del tuo cammino. ... Senti la saggezza che emerge dentro di te, la comprensione che ogni passo, anche quello più piccolo, ha un significato. ... Confida nel tuo cammino, {nome}. Ogni esperienza ti sta preparando per qualcosa di meraviglioso. ... Quando sei pronto, apri i tuoi occhi, e ricorda che ogni giorno è un passo su questo bellissimo sentiero della tua vita.",
    },
    badgeId: "pillar_destino",
    badgeName: "Navigatore del Destino",
    badgeEmoji: "🧭",
  },
  {
    index: 4,
    id: "lezioni_karmiche",
    title: "Lezioni Karmiche",
    subtitle: "I numeri assenti nella tua mappa",
    icon: "🔑",
    color: "from-red-500 to-rose-600",
    mapKey: null,
    description: "Immagina di avere una scatola di giochi, ma ti manca un pezzo importante per costruire il tuo castello preferito. Le 'Lezioni Karmiche' sono come quei pezzi mancanti nella tua scatola speciale. Sono le cose che non hai ancora imparato bene, le aree della vita in cui devi ancora crescere. Ad esempio, se ti manca il pezzo della 'pazienza', la vita ti presenterà situazioni in cui dovrai imparare ad aspettare.",
    lightQualities: [
      "Apprendimento (crescere e migliorare, come quando impari una nuova materia difficile)",
      "Completezza (sentirsi interi e senza mancanze, come avere tutti i pezzi del tuo gioco preferito)",
      "Superamento (affrontare e vincere le difficoltà, come risolvere un puzzle complicato)",
      "Consapevolezza (capire i propri punti deboli, come sapere che sei disordinato e cercare di mettere a posto)",
    ],
    shadowQualities: [
      "Difficoltà ricorrenti (ripetere gli stessi errori, come dimenticare sempre il quaderno a casa)",
      "Ostinazione (rifiutarsi di imparare, come non voler provare un nuovo cibo)",
      "Incompletezza (sentirsi che manca qualcosa, come avere un desiderio che non riesci a raggiungere)",
      "Frustrazione (sentirsi bloccati e arrabbiati, come quando non riesci a fare un esercizio di matematica)",
    ],
    exercise: {
      title: "Il mio 'puzzle' mancante",
      instructions: [
        "Prendi un foglio di carta e disegna un grande puzzle con molti pezzi. Poi, colora alcuni pezzi e lasciane altri bianchi.",
        "I pezzi bianchi sono le tue 'lezioni' o 'sfide' che devi ancora imparare. Pensa a quali situazioni ti mettono più spesso in difficoltà o ti fanno sentire a disagio. Ad esempio, 'fare matematica', 'condividere i giochi', 'fare silenzio quando gli altri parlano'. Scrivile nei pezzi bianchi.",
        "Ora, per ogni pezzo bianco, pensa a una piccola cosa che potresti fare per imparare quella lezione. Ad esempio, per 'fare matematica', potresti scrivere 'chiedere aiuto alla maestra' o 'provare a fare un problema in più ogni giorno'.",
        "Per 'condividere i giochi', potresti scrivere 'proporre ai miei amici di giocare insieme con il mio gioco nuovo'.",
        "Quando riesci a fare quella piccola cosa, colora il pezzo corrispondente. Non devi colorarli tutti subito, è un percorso!",
        "Ogni volta che colorerai un pezzo, festeggia il tuo successo. Stai completando il tuo 'puzzle' e diventando una persona più forte.",
      ],
      reflection: "Questo esercizio ti aiuta a capire quali sono le aree in cui devi ancora crescere e ti dà un modo pratico per iniziare a farlo, un pezzo alla volta.",
    },
    meditation: {
      title: "Meditazione dell'Integrazione Karmica",
      duration: "10 minuti",
      steps: [
        "Siediti in silenzio e pensa a una sfida ricorrente nella tua vita.",
        "Immagina questa sfida come una porta chiusa davanti a te.",
        "Nella tua mano appare una chiave dorata: è la consapevolezza.",
        "Inserisci la chiave e apri la porta. Cosa c'è dall'altra parte?",
        "Attraversa la porta e senti la nuova energia integrarsi in te.",
        "Ringrazia la lezione per ciò che ti ha insegnato.",
      ],
      script: " Lascia che il tuo respiro si approfondisca, {nome}. Senti il tuo corpo stabile, ma allo stesso tempo leggero. ... Chiudi gli occhi, mio caro, e immagina di essere in un giardino segreto, pieno di fiori meravigliosi. Ma in un angolo, c'è un piccolo pezzo di terra dove sembra mancare qualcosa. ... Questo pezzo di terra rappresenta le tue 'Lezioni Karmiche', quelle aree della tua vita dove c'è ancora spazio per crescere, per imparare. Sono come quei semi che non sono ancora sbocciati. ... Non sono mancanze, {nome}, ma opportunità. Pensaci, in questo piccolo angolo, cosa vorresti piantare? Quale fiore, quale pianta vorresti veder crescere? ... Forse è la pazienza, e immagini di piantare un piccolo seme e aspettare che spunti. Forse è la condivisione, e immagini di piantare un fiore e condividerlo con gli altri. ... Sentiti come un giardiniere amorevole che si prende cura di questo pezzo di terra. Non c'è giudizio, solo desiderio di nutrimento e crescita. ... Puoi portare acqua e luce a questo pezzo di terra, semplicemente con la tua intenzione e con la tua volontà di imparare. ... Sii gentile con te stesso, {nome}. Ogni seme ha bisogno del suo tempo per germogliare e fiorire. ... Quando ti sentirai pronto, apri i tuoi occhi, e ricorda che ogni giorno è una nuova occasione per coltivare questo giardino interiore.",
    },
    badgeId: "pillar_karma",
    badgeName: "Alchimista Karmico",
    badgeEmoji: "🔑",
  },
  {
    index: 5,
    id: "anno_personale",
    title: "Anno Personale",
    subtitle: "L'energia del tuo ciclo attuale",
    icon: "🌀",
    color: "from-cyan-500 to-blue-500",
    mapKey: null,
    description: "Immagina che ogni anno sia come un capitolo nuovo in un libro della tua vita. L' 'Anno Personale' è il 'titolo' di questo capitolo. Ti dice qual è il tema principale dell'anno, quale tipo di energia ti accompagnerà. Ad esempio, quest'anno potresti avere il capitolo dell' 'amicizia' e incontrerai tanti nuovi amici, oppure il capitolo dell' 'avventura' e vivrai esperienze emozionanti.",
    lightQualities: [
      "Opportunità (cogliere al volo le occasioni, come quando ti invitano a una festa e vai subito)",
      "Crescita (fare progressi e imparare, come quando impari a nuotare più velocemente)",
      "Focus (concentrarsi su un obiettivo, come voler leggere un libro intero e riuscirci)",
      "Rinnovamento (ricominciare con energia nuova, come l'inizio della scuola a settembre)",
    ],
    shadowQualities: [
      "Resistenza al cambiamento (avere paura del nuovo, come non voler provare un gioco diverso)",
      "Stagnazione (non fare progressi, come non imparare mai a pattinare)",
      "Disorientamento (non sapere cosa fare, come perdersi in un labirinto)",
      "Occasioni perse (non sfruttare i momenti giusti, come non chiedere un autografo al tuo eroe quando lo incontri)",
    ],
    exercise: {
      title: "Il mio 'Calendario Magico'",
      instructions: [
        "Prendi un calendario grande e colorato (o creane uno tu). Intitolalo 'Il mio Calendario Magico'.",
        "Pensa all'anno che sta per iniziare (o a quello in corso). Qual è la tua sensazione principale? Ti senti energico? desideroso di imparare? o forse hai voglia di fare cose nuove?",
        "Sulla parte alta del calendario, scrivi una parola o disegna un'immagine che rappresenti il 'tema' del tuo anno personale. Ad esempio, se senti che sarà un anno di 'nuove amicizie', disegna tanti bambini che ridono. Se senti che sarà un anno di 'scoperte', disegna una lente d'ingrandimento.",
        "Ogni mese, pensa a piccole azioni che si legano a quel tema. Se il tema è 'nuove amicizie', potresti segnare 'invitare un nuovo compagno a giocare' o 'aiutare qualcuno in difficoltà'.",
        "Alla fine dell'anno, guarda il tuo 'Calendario Magico'. Ti aiuterà a vedere come hai vissuto il 'capitolo' di quest'anno e cosa hai imparato.",
      ],
      reflection: "Questo esercizio ti aiuta a capire qual è l'energia principale di ogni anno della tua vita e a viverla al meglio, cogliendo le opportunità che si presentano.",
    },
    meditation: {
      title: "Meditazione del Ciclo",
      duration: "8 minuti",
      steps: [
        "Chiudi gli occhi e immagina un grande orologio cosmico.",
        "La lancetta indica il tuo Anno Personale attuale.",
        "Senti l'energia di questo numero avvolgerti.",
        "Chiedi: \"Come posso onorare al meglio questo ciclo?\"",
        "Ascolta le risposte che emergono spontaneamente.",
        "Concludi con un respiro profondo di accettazione.",
      ],
      script: " Ancora una volta, troviamo la pace nel respiro, {nome}. Lascia che il tuo corpo si rilassi e la tua mente si calmi. ... Immagina ora di essere su una spiaggia, al confine tra l'anno appena passato e l'anno che sta per arrivare. Senti la sabbia sotto i tuoi piedi, il suono delle onde, che è come il ritmo del tempo. ... Il sole sta tramontando dietro di te, salutando il vecchio anno con i suoi ricordi e le sue lezioni. Davanti a te, l'orizzonte si tinge dei colori vivaci dell'alba, annunciando l'anno nuovo. ... Questo nuovo anno, {nome}, ha una sua energia speciale, un suo tema, come il colore dominante di questa alba. Forse è un rosso energico, un blu calmo, un verde di crescita. ... Non devi sapere con la mente cos'è, semplicemente sentilo. Lascia che questa energia, questa vibrazione, ti avvolga. ... Cosa desideri portare in questo nuovo capitolo della tua vita? Quali semi vuoi piantare con l'energia di quest'anno? Non risposte complesse, solo un sentire, un'intenzione. ... Accogli questo nuovo ciclo, caro {nome}, con fiducia e apertura. Ogni anno ti offre doni e opportunità unici. ... Quando sei pronto, apri con dolcezza gli occhi, e porta con te la fresca energia del tuo 'Anno Personale'.",
    },
    badgeId: "pillar_anno",
    badgeName: "Guardiano del Ciclo",
    badgeEmoji: "🌀",
  },
  {
    index: 6,
    id: "visione_evolutiva",
    title: "Visione Evolutiva",
    subtitle: "La sintesi del tuo cammino",
    icon: "🦅",
    color: "from-fuchsia-500 to-purple-600",
    mapKey: null,
    description: "Immagina di essere il capitano di una nave molto speciale, che naviga attraverso l'oceano della vita. La 'Visione Evolutiva' è come la tua 'stella polare', la meta più alta del tuo viaggio, il motivo più importante per cui sei su questa nave. Non è solo ciò che vuoi diventare, ma chi vuoi essere per il mondo. È la tua missione più grande, il tuo contributo unico e prezioso.",
    lightQualities: [
      "Inspirazione (motivare gli altri con il tuo esempio, come essere un modello per i tuoi amici)",
      "Altruismo (aiutare gli altri senza chiedere nulla in cambio, come dare una mano a un compagno in difficoltà)",
      "Saggezza superiore (capire il senso più profondo delle cose, come sapere perché è importante essere gentili)",
      "Contributo (fare la differenza per il bene comune, come partecipare alla pulizia di un parco)",
    ],
    shadowQualities: [
      "Disillusione (perdere la speranza, come non credere più che le cose possano migliorare)",
      "Egoismo (pensare solo ai propri bisogni, come non voler condividere i tuoi giochi)",
      "Incomprensione (non capire il senso delle proprie azioni, come fare le cose senza un vero perché)",
      "Paura di osare (non seguire i propri ideali per paura, come non difendere un amico per paura di essere preso in giro)",
    ],
    exercise: {
      title: "La mia 'Mappa del Tesoro' della Vita",
      instructions: [
        "Prendi un grande foglio di carta, dei pennarelli, delle riviste da cui ritagliare immagini. Sarà la tua 'Mappa del Tesoro' della Vita.",
        "Pensa ai tuoi valori più importanti. Cosa è davvero importante per te? Ad esempio, 'l'amicizia', 'la natura', 'la giustizia', 'la gioia', 'la conoscenza'. Scrivili al centro del foglio.",
        "Ora, immagina di essere 'grande'. Cosa vorresti lasciare al mondo? Che tipo di persona vorresti essere ricordata? Ad esempio, 'una persona che ha aiutato gli animali' o 'una persona che ha inventato qualcosa di utile'. Scrivi o disegna queste idee intorno ai tuoi valori.",
        "Ritaglia immagini dalle riviste o disegna tu stesso ciò che rappresenta questi desideri e valori. Ad esempio, se ami la natura, puoi ritagliare alberi e fiumi. Se vuoi aiutare gli animali, puoi disegnare un cucciolo.",
        "Appendi la tua 'Mappa del Tesoro' in un posto dove tu possa vederla spesso. Ogni volta che la guardi, ti ricorderà la tua grande missione nella vita, la tua 'stella polare'.",
      ],
      reflection: "Questo esercizio ti aiuta a visualizzare la tua missione più alta, il tuo scopo più profondo nella vita, e a capire come vuoi contribuire a rendere il mondo un posto migliore.",
    },
    meditation: {
      title: "Meditazione della Visione Suprema",
      duration: "15 minuti",
      steps: [
        "Chiudi gli occhi e immagina di salire in alto, sempre più in alto.",
        "Dall'alto puoi vedere l'intero panorama della tua vita.",
        "Osserva i 6 pilastri precedenti come luci che brillano sotto di te.",
        "Vedi come si connettono formando un disegno unico: il tuo disegno.",
        "Senti la gratitudine per il tuo viaggio e la certezza del tuo cammino.",
        "Scendi dolcemente, portando con te la visione d'insieme.",
      ],
      script: " Carissimo {nome}, respira profondamente, sentiti leggero e libero. Lascia che la tua mente sia come un cielo limpido, senza nuvole. ... Chiudi gli occhi, e immagina di essere su una montagna molto alta, e puoi vedere tutto il paesaggio sotto di te. Da qui, vedi il tuo cammino, non solo un pezzo, ma tutta la strada che hai percorso e quella che ti aspetta. ... Alla fine di questo cammino, in lontananza, vedi una luce splendente. Questa luce, {nome}, è la tua 'Visione Evolutiva', la tua missione più alta, il dono più grande che puoi portare al mondo. ... Non è una meta concreta, ma un senso, un sentimento che ti guida. Forse è la gioia che vuoi condividere, la pace che vuoi creare, la bellezza che vuoi mostrare agli altri. ... Sentila nel tuo cuore, questa luce. È grande, luminosa, e ti riempie di un calore speciale. ... Non devi affrettarti a raggiungerla, {nome}. Ogni passo del tuo cammino ti porta sempre più vicino a questa luce, a questo scopo. Ogni azione, ogni pensiero, può essere guidato da questa visione. ... Ricorda, tu sei un essere unico e speciale, e porti un dono unico al mondo. Non c'è nessuno come te. ... Quando sarai pronto, {nome}, apri gli occhi, e porta con te la consapevolezza di questa luce guida, la tua 'stella polare' che ti illuminerà sempre.",
    },
    badgeId: "pillar_visione",
    badgeName: "Visionario Cosmico",
    badgeEmoji: "🦅",
  },
];

// Karmic lessons helper is in src/lib/karmicLessons.ts

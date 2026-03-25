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
      script: "Pace a te, {nome}.\n... ... ...\nTrova un luogo tranquillo.\n... ... ...\nSiediti comodamente.\n... ... ...\nChiudi dolcemente gli occhi.\n... ... ...\nSenti il tuo respiro.\n... ... ...\nEntra ed esce.\n... ... ...\nSenza sforzo.\n... ... ...\nOra porta la tua attenzione al tuo cuore.\n... ... ... ... ...\nImmagina una piccola luce lì.\n... ... ... ... ...\nÈ debole, forse.\n... ... ...\nMa è presente.\n... ... ... ... ...\nQuesta luce è l'essenza della tua Anima.\n... ... ...\nÈ il tuo desiderio più profondo.\n... ... ...\nIl tuo vero Sé.\n... ... ...\nLascia che questa luce cresca.\n... ... ... ... ...\nAd ogni respiro.\n... ... ...\nSi espande, calda e dolce.\n... ... ...\nSenti il suo calore.\n... ... ...\nSenti la sua pace.\n... ... ... ... ...\nCosa ti sussurra questa luce?\n... ... ... ... ...\nÈ la voce della tua Anima.\n... ... ...\nSenza parole.\n... ... ...\nSolo sensazioni.\n... ... ...\nAccoglila.\n... ... ...\nResta con questa sensazione.\n... ... ... ... ...\nLascia che ti riempia.\n... ... ...\nIl tuo intero essere.\n... ... ...\nSei luce.\n... ... ...\nSei Anima.\n... ... ...\nOra, gentilmente, riporta l'attenzione al tuo respiro.\n... ... ...\nSenti il corpo.\n... ... ...\nQuando sei pronto, apri gli occhi.\n... ... ...\nPorta questa luce con te.",
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
      script: "Benvenuto, {nome}.\n... ... ...\nSiediti in silenzio.\n... ... ...\nRilassa le spalle.\n... ... ...\nLascia andare ogni tensione.\n... ... ...\nFocalizzati sul tuo respiro.\n... ... ...\nLungo e profondo.\n... ... ...\nHai un dono, {nome}.\n... ... ...\nUna luce unica dentro di te.\n... ... ... ... ...\nNon è la luce dell'Anima.\n... ... ...\nMa è la tua espressione.\n... ... ...\nImmagina questa luce irradiare da te.\n... ... ... ... ...\nCome i raggi del sole.\n... ... ...\nOgni raggio è un tuo talento.\n... ... ...\nUna tua qualità.\n... ... ...\nLa tua capacità di amare.\n... ... ...\nDi creare.\n... ... ...\nDi comprendere.\n... ... ...\nLascia che questa luce si espanda all'esterno.\n... ... ... ... ...\nRiempie la stanza.\n... ... ...\nSi estende al mondo.\n... ... ...\nNon trattenerti.\n... ... ...\nNon aver paura di brillare.\n... ... ...\nOgni tua azione è un raggio.\n... ... ...\nOgni tua parola.\n... ... ...\nSii autentico.\n... ... ...\nLascia che il mondo veda la tua luce.\n... ... ... ... ...\nRespira profondamente.\n... ... ...\nSenti la gioia di questa espressione.\n... ... ...\nSenti la libertà.\n... ... ...\nQuando sei pronto, apri gli occhi.\n... ... ...\nE continua a irradiare.",
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
      script: "Pace a te, {nome}.\n... ... ...\nTrova la tua postura, {nome}.\n... ... ...\nCon la schiena dritta, ma non rigida.\n... ... ...\nIl tuo respiro è la tua ancora.\n... ... ...\nSempre presente.\n... ... ...\nNel corso della vita, indossiamo molte maschere.\n... ... ...\nPer piacere.\n... ... ...\nPer protezione.\n... ... ...\nPer adattarci.\n... ... ...\nQueste sono le nostre personalità.\n... ... ... ... ...\nImmagina di trovarti davanti a uno specchio.\n... ... ... ... ...\nGuarda la tua immagine riflessa.\n... ... ...\nQuale maschera indossi oggi?\n... ... ... ... ...\nLascia che questa maschera scivoli via.\n... ... ... ... ...\nDolcemente.\n... ... ...\nSenza giudizio.\n... ... ...\nPoi un'altra.\n... ... ...\nE un'altra ancora.\n... ... ... ... ...\nSotto tutte queste maschere.\n... ... ...\nC'è il tuo vero Sé.\n... ... ...\nNudo e autentico.\n... ... ...\nPuro.\n... ... ...\nSenza pretese.\n... ... ... ... ...\nGuarda questo Sé senza maschere.\n... ... ... ... ...\nLo riconosci?\n... ... ...\nCom'è?\n... ... ... ... ...\nNon ha bisogno di recitare.\n... ... ...\nNon ha bisogno di niente.\n... ... ...\nSolo di essere.\n... ... ...\nRespira in questa verità.\n... ... ...\nSenti la libertà di essere te stesso.\n... ... ...\nOra, con un sorriso interiore.\n... ... ...\nRiporta la tua attenzione al respiro.\n... ... ...\nE, quando pronto, apri gli occhi.",
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
      script: "Saluti a te, {nome}.\n... ... ...\nRespira profondamente.\n... ... ...\nLascia andare i pensieri della giornata.\n... ... ...\nCentrati nel qui e ora.\n... ... ...\nChiudi gli occhi.\n... ... ...\nImmagina di trovarti all'inizio di un sentiero.\n... ... ... ... ...\nÈ un sentiero nel profondo di un bosco antico.\n... ... ...\nQuesto è il sentiero del tuo Destino.\n... ... ...\nNon è una via già scritta.\n... ... ...\nMa un percorso da scoprire ad ogni passo.\n... ... ... ... ...\nInizia a camminare, {nome}.\n... ... ...\nSenti il terreno sotto i tuoi piedi.\n... ... ...\nGuarda gli alberi secolari.\n... ... ...\nVedi le foglie che cadono.\n... ... ... ... ...\nOgni curva del sentiero è una lezione.\n... ... ...\nOgni ostacolo, un'opportunità.\n... ... ...\nNon temere le zone d'ombra.\n... ... ...\nAnche lì c'è qualcosa da imparare.\n... ... ...\nE non affrettarti.\n... ... ...\nIl viaggio è la destinazione.\n... ... ... ... ...\nA volte il sentiero è chiaro.\n... ... ...\nAltre volte si perde un po'.\n... ... ...\nMa la tua Anima sa la direzione.\n... ... ...\nAscolta il suo sussurro.\n... ... ...\nRespira in questo cammino.\n... ... ...\nAccetta ogni passo.\n... ... ...\nSei sul tuo percorso.\n... ... ...\nDolcemente, torna al respiro.\n... ... ...\nSenti il tuo corpo.\n... ... ...\nE apri gli occhi, {nome}.",
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
      script: "Pace e serenità, {nome}.\n... ... ...\nRilassa il tuo corpo.\n... ... ...\nSvuota la tua mente.\n... ... ...\nSii presente nel tuo respiro.\n... ... ...\nLascia che sia morbido e naturale.\n... ... ...\nOra immagina un giardino segreto.\n... ... ... ... ...\nQuesto giardino è il tuo cuore, {nome}.\n... ... ...\nE dentro ci sono molti semi.\n... ... ...\nQuesti semi sono le tue Lezioni Karmiche.\n... ... ... ... ...\nAlcuni sono semi di gioia.\n... ... ...\nFrutto di azioni d'amore passate.\n... ... ...\nAltri sono semi di sfida.\n... ... ...\nOpportunità di crescita.\n... ... ... ... ...\nNon giudicare i semi.\n... ... ...\nAccoglili tutti.\n... ... ...\nGuarda il terreno del tuo giardino.\n... ... ...\nPreparalo con cura.\n... ... ...\nCon la consapevolezza.\n... ... ...\nE l'intenzione.\n... ... ... ... ...\nQuali semi vuoi piantare oggi?\n... ... ...\nQuale lezione vuoi affrontare con amore?\n... ... ...\nCon compassione per te stesso e per gli altri?\n... ... ... ... ...\nOgni respiro è acqua per questi semi.\n... ... ...\nOgni intenzione, luce.\n... ... ...\nRicorda, puoi scegliere come coltivarli.\n... ... ...\nCon pazienza.\n... ... ...\nCon gentilezza.\n... ... ...\nRespira profondamente nel tuo giardino.\n... ... ...\nSenti la promessa della crescita.\n... ... ...\nQuando sei pronto, apri gli occhi.\n... ... ...\nE porta la tua saggezza nel mondo.",
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
      script: "Che la pace sia con te, {nome}.\n... ... ...\nLascia che il tuo corpo si rilassi.\n... ... ...\nLascia che il tuo respiro diventi calmo.\n... ... ...\nSenti il tuo essere.\n... ... ...\nNel silenzio.\n... ... ...\nVisualizza te stesso su una spiaggia.\n... ... ... ... ...\nÈ una spiaggia al tramonto.\n... ... ...\nDietro di te, il vecchio anno svanisce.\n... ... ...\nLascia andare i ricordi.\n... ... ...\nLe gioie e i dolori.\n... ... ...\nLe lezioni apprese.\n... ... ... ... ...\nRingrazialo per tutto ciò che ti ha donato.\n... ... ...\nE lascialo andare.\n... ... ...\nCome le onde che si ritirano.\n... ... ...\nE ora, guarda avanti, {nome}.\n... ... ...\nL'orizzonte si tinge di nuovi colori.\n... ... ... ... ...\nDavanti a te si estende l'Anno Personale che verrà.\n... ... ...\nPuro e incontaminato.\n... ... ...\nCosa desideri portare con te?\n... ... ...\nQuali intenzioni vuoi che ti guidino?\n... ... ... ... ...\nSenti la sabbia tiepida sotto i piedi.\n... ... ...\nAscolta il suono delle onde nuove.\n... ... ...\nRespira l'aria fresca del futuro.\n... ... ...\nQuesto è il tuo nuovo inizio.\n... ... ...\nPieno di possibilità.\n... ... ...\nRimani in questa sensazione di rinnovamento.\n... ... ... ... ...\nQuando sei pronto, con un sorriso interiore.\n... ... ...\nApri gli occhi.\n... ... ...\nE saluta il nuovo anno con il cuore.",
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
      script: "Pace e gioia, {nome}.\n... ... ...\nSiediti comodamente.\n... ... ...\nChiudi gli occhi.\n... ... ...\nTrova il ritmo del tuo respiro.\n... ... ...\nLascia che ti plachi.\n... ... ...\nImmagina di scalare una montagna.\n... ... ... ... ...\nCon ogni passo, sali più in alto.\n... ... ...\nLasciati alle spalle le preoccupazioni.\n... ... ...\nLe piccolezze del quotidiano.\n... ... ...\nSenti la forza in te.\n... ... ... ... ...\nOra sei sulla cima, {nome}.\n... ... ... ... ...\nDavanti a te si apre una vista panoramica.\n... ... ...\nÈ la visione della tua intera vita.\n... ... ...\nNon solo il passato.\n... ... ...\nMa anche il potenziale futuro.\n... ... ... ... ...\nVedi il tuo percorso.\n... ... ...\nLe gioie.\n... ... ...\nLe sfide.\n... ... ...\nLe persone che hai incontrato.\n... ... ...\nOgni cosa ha avuto un senso.\n... ... ...\nTutto ti ha portato qui.\n... ... ... ... ...\nCosa vedi da questa altezza?\n... ... ...\nQuale disegno emerge?\n... ... ...\nQual è la tua Visione Evolutiva?\n... ... ... ... ...\nNon pensare troppo.\n... ... ...\nSolo osserva.\n... ... ...\nSenti.\n... ... ...\nC'è una saggezza profonda in questa visione.\n... ... ...\nIn questa consapevolezza.\n... ... ...\nRespira questa vastità.\n... ... ...\nAssorbi la pace.\n... ... ...\nResta in questo spazio di chiarezza.\n... ... ... ... ...\nQuando sei pronto, con gratitudine.\n... ... ...\nTorna dolcemente al tuo respiro.\n... ... ...\nApri gli occhi.\n... ... ...\nE porta la tua visione nel mondo.",
    },
    badgeId: "pillar_visione",
    badgeName: "Visionario Cosmico",
    badgeEmoji: "🦅",
  },
];

// Karmic lessons helper is in src/lib/karmicLessons.ts

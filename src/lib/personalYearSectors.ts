// Personal Year sector-specific interpretations
// Each number (1-9, 11, 22, 33) has unique text for each life sector

export interface SectorDetail {
  summary: string;
  detail: string;
}

export type SectorKey = 'lavoro' | 'amore' | 'denaro' | 'benessere' | 'crescita';

export const sectorMeta: Record<SectorKey, { title: string; icon: string }> = {
  lavoro: { title: 'Lavoro e Carriera', icon: '💼' },
  amore: { title: 'Amore e Relazioni', icon: '❤️' },
  denaro: { title: 'Denaro e Gestione', icon: '💰' },
  benessere: { title: 'Benessere e Energia', icon: '🌿' },
  crescita: { title: 'Crescita Personale', icon: '🌟' },
};

export const personalYearSectors: Record<number, Record<SectorKey, SectorDetail>> = {
  1: {
    lavoro: {
      summary: 'Anno di nuovi inizi professionali. È il momento ideale per lanciare progetti, cambiare ruolo o avviare un\'attività. La tua energia pionieristica è al massimo.',
      detail: 'L\'Anno Personale 1 nel lavoro segna un punto di svolta. Se hai rimandato decisioni importanti, ora è il momento di agire con coraggio. Potresti ricevere un\'opportunità inaspettata o sentire la spinta interiore a reinventarti professionalmente. Non aspettare che siano gli altri a proporti qualcosa: prendi l\'iniziativa. Le idee che semini quest\'anno porteranno frutti nei prossimi 9 anni del ciclo. Sii audace ma strategico: punta su ciò che ti rende unico e distinguiti.',
    },
    amore: {
      summary: 'Periodo di nuove connessioni o di rinnovamento nella relazione. L\'indipendenza e l\'autenticità sono fondamentali per attrarre rapporti sani.',
      detail: 'In amore, l\'Anno 1 ti chiede di mettere te stesso al centro. Se sei single, è un anno propizio per incontrare qualcuno di significativo, a patto che tu sia chiaro su ciò che vuoi. Se sei in coppia, sentirai il bisogno di ridefinire il tuo spazio all\'interno della relazione. Non si tratta di egoismo, ma di autenticità. Le relazioni che sopravvivono a quest\'anno lo fanno perché entrambi i partner rispettano la crescita individuale dell\'altro. Evita la dipendenza emotiva e coltiva la tua identità.',
    },
    denaro: {
      summary: 'Fase favorevole per investimenti iniziali e per seminare finanziariamente. Le entrate possono arrivare da nuove fonti o canali inediti.',
      detail: 'Finanziariamente, l\'Anno 1 è un anno di semina più che di raccolta immediata. Le risorse che investi ora — sia economiche che di tempo ed energia — costruiranno le basi per la prosperità futura. Potresti avere l\'impulso di fare un investimento audace o di aprire un nuovo flusso di entrate. Agisci con determinazione ma fai i conti: l\'entusiasmo non deve sostituire la pianificazione. Evita spese impulsive legate all\'ego e concentrati su investimenti che riflettano i tuoi veri valori.',
    },
    benessere: {
      summary: 'Energia alta e voglia di rinnovamento fisico. Anno ideale per iniziare nuove routine di salute, sport o alimentazione.',
      detail: 'Il tuo corpo riflette l\'energia di nuovo inizio dell\'Anno 1. È il momento perfetto per iniziare un programma di allenamento, adottare un nuovo regime alimentare o affrontare problemi di salute rimandati. L\'energia è abbondante ma può essere irregolare: potresti alternare periodi di grande vitalità a momenti di stanchezza mentre il corpo si adatta ai cambiamenti. Ascolta i segnali del tuo corpo e non forzare. La chiave è la costanza: le abitudini che crei ora ti accompagneranno per tutto il ciclo.',
    },
    crescita: {
      summary: 'Momento di definire chi sei veramente. Sviluppa la leadership interiore e il coraggio di seguire la tua visione unica.',
      detail: 'L\'Anno 1 è il più potente per la crescita personale perché segna l\'inizio di un nuovo ciclo di 9 anni. Tutto ciò che decidi, pensi e manifesti quest\'anno ha un impatto amplificato. Lavora sulla fiducia in te stesso e sulla capacità di prendere decisioni senza cercare continuamente l\'approvazione altrui. Potresti scoprire talenti nascosti o riscoprire passioni dimenticate. Il tema centrale è l\'autonomia: impara a stare bene con te stesso e le relazioni esterne miglioreranno di conseguenza.',
    },
  },
  2: {
    lavoro: {
      summary: 'Anno di collaborazione e pazienza professionale. Lavora in team, crea alleanze strategiche e non forzare i risultati.',
      detail: 'Nell\'Anno 2, la carriera avanza attraverso la diplomazia e la cooperazione. Non è il momento di mettersi in mostra o di agire da solisti: il successo arriva attraverso il lavoro di squadra e le alleanze strategiche. Potresti dover supportare il progetto di qualcun altro prima di vedere riconosciuti i tuoi meriti. La pazienza è fondamentale. Le trattative richiedono tempo e i dettagli contano più che mai. Se ti senti frustrato dalla lentezza, ricorda che stai costruendo relazioni professionali che saranno preziose negli anni a venire.',
    },
    amore: {
      summary: 'Anno dedicato all\'ascolto, alla sensibilità e all\'approfondimento emotivo. Le relazioni si rafforzano attraverso la vulnerabilità condivisa.',
      detail: 'L\'amore nell\'Anno 2 è fatto di sfumature, non di grandi gesti. Se sei in coppia, è il momento di approfondire l\'intimità emotiva, di ascoltare davvero il partner e di risolvere piccole incomprensioni prima che diventino muri. Se sei single, potresti incontrare qualcuno in contesti tranquilli e intimi piuttosto che in situazioni eclatanti. L\'attrazione si basa sulla connessione emotiva più che su quella fisica. Attenzione alla tendenza a sacrificarti eccessivamente: l\'empatia è un dono, ma non a scapito dei tuoi bisogni.',
    },
    denaro: {
      summary: 'Gestione prudente e collaborativa. Evita rischi finanziari e concentrati sul consolidamento. Le entrate possono arrivare da partnership.',
      detail: 'L\'Anno 2 finanziariamente richiede cautela e cooperazione. Non è il momento per investimenti rischiosi o decisioni finanziarie impulsive. Le opportunità economiche migliori arrivano attraverso collaborazioni, contratti condivisi o joint venture. Potresti ricevere aiuto finanziario da un partner o da un alleato. La chiave è la gestione attenta: rivedi il budget, elimina le spese superflue e crea un fondo di sicurezza. Le piccole decisioni finanziarie di quest\'anno avranno un impatto significativo nel lungo periodo.',
    },
    benessere: {
      summary: 'Sensibilità fisica ed emotiva accentuata. Prenditi cura del sistema nervoso con attività dolci: yoga, meditazione, passeggiate nella natura.',
      detail: 'Durante l\'Anno 2, il tuo corpo è più sensibile del solito. Potresti percepire lo stress e le emozioni altrui in modo più intenso, il che può manifestarsi come stanchezza, tensioni muscolari o disturbi del sonno. Le attività fisiche dolci sono preferibili a quelle intense: yoga, tai chi, nuoto, passeggiate nella natura. Dedica tempo alla cura emotiva: meditazione, journaling, bagni rilassanti. L\'alimentazione dovrebbe essere leggera e nutriente. Evita ambienti troppo caotici o relazioni tossiche che drenano la tua energia.',
    },
    crescita: {
      summary: 'Sviluppa l\'intelligenza emotiva e la capacità di ascolto profondo. Impara il valore della pazienza e della ricettività.',
      detail: 'La crescita personale nell\'Anno 2 passa attraverso la capacità di ricevere piuttosto che agire. Dopo l\'impulso pionieristico dell\'Anno 1, ora devi imparare l\'arte dell\'attesa, della diplomazia e dell\'ascolto. Potresti scoprire che la vera forza sta nella vulnerabilità e che le relazioni più significative nascono dalla disponibilità ad aprirsi. Lavora sull\'equilibrio tra dare e ricevere. Se tendi a dimenticarti dei tuoi bisogni per soddisfare quelli degli altri, quest\'anno ti insegnerà l\'importanza dei confini sani.',
    },
  },
  3: {
    lavoro: {
      summary: 'Anno di espansione creativa e comunicativa. Ideale per presentazioni, marketing, insegnamento o lancio di progetti artistici.',
      detail: 'L\'Anno 3 porta un\'ondata di creatività e carisma nel lavoro. È il momento di comunicare le tue idee, fare networking, presentare progetti e renderti visibile. Se lavori in ambiti creativi, artistici o comunicativi, quest\'anno può essere straordinario. Anche in settori più tradizionali, la tua capacità di ispirare e motivare sarà notata. Attenzione però alla dispersione: l\'entusiasmo può portarti ad avviare troppi progetti contemporaneamente senza completarne nessuno. Scegli le opportunità migliori e dedicati a quelle con focus.',
    },
    amore: {
      summary: 'Anno leggero e socievole in amore. Flirtare, divertirsi e condividere esperienze gioiose. Ma attenzione alla superficialità.',
      detail: 'L\'Anno 3 porta leggerezza e gioia nelle relazioni. Se sei single, la tua attrattività sociale è al massimo: partecipa a eventi, esci, socializza. L\'amore può arrivare attraverso la risata e la condivisione di passioni creative. Se sei in coppia, è il momento di riscoprire il divertimento insieme: viaggiare, provare cose nuove, ridere. Il rischio è la superficialità: potresti evitare conversazioni serie o problemi reali nascondendoti dietro la leggerezza. L\'equilibrio sta nel godersi la gioia senza fuggire dalla profondità quando serve.',
    },
    denaro: {
      summary: 'Flusso finanziario positivo legato alla creatività e alla comunicazione. Le spese sociali aumentano: bilancia divertimento e risparmio.',
      detail: 'Le finanze nell\'Anno 3 possono beneficiare della tua creatività e visibilità sociale. Opportunità di guadagno attraverso comunicazione, insegnamento, arte, social media o intrattenimento. Tuttavia, la tendenza a spendere per socializzare, vestirsi bene e divertirsi è forte. Non c\'è nulla di male nel goderti la vita, ma crea un budget per le spese "di piacere" e rispettalo. Le entrate possono essere irregolari: mesi abbondanti seguiti da periodi più magri. Diversifica le fonti e non dare per scontata la prosperità.',
    },
    benessere: {
      summary: 'Energia allegra ma a rischio dispersione. Cura la gola, la voce e il sistema respiratorio. Il movimento creativo (danza, sport di gruppo) è ideale.',
      detail: 'L\'Anno 3 porta energia vivace ma potenzialmente dispersiva. Il tuo corpo chiede movimento espressivo: danza, arti marziali creative, sport di squadra, teatro fisico. La gola e il sistema respiratorio potrebbero essere punti sensibili — cura la voce se la usi molto. L\'alimentazione tende a essere irregolare per via degli impegni sociali: cerca di mantenere pasti regolari anche quando sei fuori. Il rischio principale è l\'eccesso: troppo cibo, troppo alcol, troppo poco sonno. L\'equilibrio è la chiave per mantenere alta l\'energia tutto l\'anno.',
    },
    crescita: {
      summary: 'Esprimi te stesso senza paura del giudizio. Scopri i tuoi talenti creativi e impara a comunicare con autenticità.',
      detail: 'L\'Anno 3 è dedicato all\'espressione di sé. Qualunque sia la tua forma di creatività — scrivere, dipingere, cantare, cucinare, parlare in pubblico — quest\'anno ti chiede di coltivarla senza paura del giudizio. Potresti scoprire talenti che non sapevi di avere o riscoprire passioni abbandonate. La crescita passa anche attraverso la gioia: impara che essere felice non è superficiale ma è un atto di coraggio. Lavora sulla capacità di completare ciò che inizi e di dare struttura alla tua creatività.',
    },
  },
  4: {
    lavoro: {
      summary: 'Anno di costruzione solida. Impegno, disciplina e organizzazione portano risultati concreti. Non è tempo di scorciatoie.',
      detail: 'L\'Anno 4 nel lavoro richiede dedizione e metodo. È il momento di costruire fondamenta solide: organizzare processi, creare sistemi, pianificare a lungo termine. I risultati non saranno immediati né spettacolari, ma saranno duraturi. Potresti sentirti sovraccarico di responsabilità o annoiato dalla routine, ma la perseveranza è la tua alleata. Evita di cambiare lavoro per noia: spesso l\'Anno 4 premia chi resta e migliora dall\'interno. Se devi affrontare questioni legali, burocratiche o contrattuali, quest\'anno è favorevole per risolverle.',
    },
    amore: {
      summary: 'Anno di impegno e stabilità nelle relazioni. Costruisci basi solide con il partner. Le relazioni superficiali non sopravvivono.',
      detail: 'L\'Anno 4 in amore è concreto e serio. Se sei in coppia, potresti decidere di fare passi importanti: convivenza, matrimonio, acquisto di una casa insieme. Le relazioni vengono messe alla prova dalla routine e dalle responsabilità quotidiane. Le coppie che sopravvivono all\'Anno 4 escono rafforzate. Se sei single, potresti incontrare una persona stabile e affidabile, forse non il tipo che ti fa battere il cuore al primo sguardo, ma qualcuno su cui puoi contare. Lavora sulla comunicazione pratica e sulla condivisione delle responsabilità.',
    },
    denaro: {
      summary: 'Gestione rigorosa e pianificazione finanziaria. Costruisci un budget solido, riduci i debiti e investi nella sicurezza a lungo termine.',
      detail: 'Le finanze nell\'Anno 4 richiedono ordine e disciplina. È l\'anno ideale per creare o rivedere il budget, ridurre i debiti, pianificare risparmi e investimenti a lungo termine. Non è il momento per speculazioni o rischi finanziari. Le entrate sono stabili ma raramente straordinarie: il guadagno viene dal lavoro costante e metodico. Potresti avere spese legate alla casa, alle riparazioni o a questioni burocratiche. Ogni euro investito nella stabilità e nella sicurezza quest\'anno pagherà dividendi negli anni successivi.',
    },
    benessere: {
      summary: 'Attenzione alla rigidità fisica e allo stress da sovraccarico. Cura ossa, articolazioni e postura. Routine di salute regolari sono essenziali.',
      detail: 'L\'Anno 4 può essere fisicamente impegnativo. Lo stress lavorativo e le responsabilità tendono ad accumularsi nel corpo, specialmente nelle articolazioni, nella schiena e nelle spalle. La postura merita attenzione: considera osteopatia, fisioterapia o stretching regolare. L\'esercizio fisico dovrebbe essere strutturato e costante piuttosto che intenso: camminate quotidiane, palestra con programma, nuoto. L\'alimentazione deve essere regolare e bilanciata. Il sonno è fondamentale: crea una routine serale che ti aiuti a staccare dalle preoccupazioni del giorno.',
    },
    crescita: {
      summary: 'Costruisci la disciplina interiore e la resilienza. Impara il valore della costanza e della pazienza nel raggiungere gli obiettivi.',
      detail: 'La crescita dell\'Anno 4 passa attraverso la disciplina. Non è glamour, non è eccitante, ma è profondamente trasformativa. Impari che i risultati significativi richiedono tempo, impegno e costanza. Potresti sentirti limitato o frustrato dalla lentezza dei progressi, ma ogni piccolo passo conta. Lavora sulla capacità di trovare significato nella routine, di apprezzare il processo oltre il risultato. La meditazione strutturata, lo studio regolare e l\'organizzazione personale sono strumenti potenti quest\'anno.',
    },
  },
  5: {
    lavoro: {
      summary: 'Anno di cambiamento e avventura professionale. Viaggi, nuove opportunità, cambi di ruolo o settore. Adattabilità è la parola chiave.',
      detail: 'L\'Anno 5 scuote la routine lavorativa. Potresti cambiare lavoro, ruolo, sede o intero settore. I viaggi di lavoro aumentano e le opportunità arrivano da direzioni inaspettate. La tua capacità di adattamento è messa alla prova ma anche premiata. Non resistere al cambiamento: fluisci con esso. Se il tuo lavoro attuale ti soffoca, quest\'anno potresti finalmente avere il coraggio di cambiare. Attenzione però a non bruciare i ponti impulsivamente. Il cambiamento può essere pianificato: audace ma non irresponsabile.',
    },
    amore: {
      summary: 'Relazioni in movimento: nuovi incontri, attrazione magnetica, desiderio di libertà. Lealtà e libertà devono coesistere.',
      detail: 'L\'Anno 5 è elettrizzante per le relazioni. Se sei single, il tuo magnetismo è al massimo e gli incontri sono frequenti e intensi. Potresti innamorarti rapidamente o vivere avventure appassionate. Se sei in coppia, il bisogno di libertà e novità è forte: viaggiare insieme, sperimentare, rompere la routine è essenziale. Il rischio è la tentazione: la voglia di novità può portare a situazioni ambigue. La sfida è integrare il desiderio di libertà con l\'impegno verso le relazioni importanti. Comunicazione onesta e trasparente sono fondamentali.',
    },
    denaro: {
      summary: 'Flusso finanziario dinamico e imprevedibile. Opportunità improvvise ma anche spese inaspettate. Mantieni un fondo di emergenza.',
      detail: 'Le finanze nell\'Anno 5 sono un\'altalena. Entrate inaspettate possono arrivare da fonti nuove, viaggi o opportunità last-minute. Ma anche le spese sono imprevedibili: riparazioni, viaggi improvvisati, investimenti impulsivi. La chiave è la flessibilità con ancoraggio: mantieni sempre un fondo di emergenza e non spendere tutto ciò che guadagni. È un buon anno per diversificare le fonti di reddito e per esplorare nuovi modi di guadagnare. Evita di firmare contratti a lungo termine senza averli esaminati con cura.',
    },
    benessere: {
      summary: 'Energia frenetica che va incanalata. Attenzione ai cinque sensi e alle dipendenze. Sport dinamici e all\'aperto sono perfetti.',
      detail: 'L\'Anno 5 porta energia esplosiva ma anche il rischio di eccessi. Il corpo chiede movimento, stimoli e novità. Sport all\'aperto, avventure, viaggi attivi sono ideali. Il pericolo sta negli eccessi sensoriali: troppo cibo, alcol, adrenalina, stimolazione continua. I cinque sensi sono amplificati — usali consapevolmente. Potresti essere più sensibile a sostanze stimolanti. Il sistema nervoso è sotto pressione: alterna momenti di azione intensa a pause rigenerative. Sperimenta nuove forme di esercizio fisico per mantenere alto l\'interesse.',
    },
    crescita: {
      summary: 'Espandi i tuoi orizzonti attraverso l\'esperienza diretta. Viaggia, impara, sperimenta. La libertà responsabile è la lezione.',
      detail: 'L\'Anno 5 è un anno di espansione attraverso l\'esperienza. La crescita non avviene in un libro o in meditazione, ma sul campo: viaggiando, incontrando persone diverse, provando cose nuove. Potresti mettere in discussione credenze e abitudini consolidate. La lezione fondamentale è la libertà responsabile: puoi essere libero senza essere irresponsabile, puoi sperimentare senza distruggere ciò che hai costruito. Impara a distinguere tra la vera voglia di esplorare e la fuga dalle responsabilità.',
    },
  },
  6: {
    lavoro: {
      summary: 'Anno dedicato alla responsabilità e al servizio nel lavoro. Ruoli di cura, insegnamento, mentoring sono favoriti. L\'armonia nel team è prioritaria.',
      detail: 'L\'Anno 6 nel lavoro porta responsabilità e servizio. Potresti assumere un ruolo di guida, mentore o punto di riferimento per colleghi e collaboratori. Le professioni legate alla cura, all\'educazione, all\'estetica e al benessere sono particolarmente favorite. Il lavoro potrebbe richiedere più tempo del solito, specialmente se devi gestire situazioni familiari in parallelo. La sfida è non sacrificarti eccessivamente: stabilisci confini chiari tra lavoro e vita privata. La tua capacità di creare armonia nell\'ambiente lavorativo sarà il tuo punto di forza.',
    },
    amore: {
      summary: 'Anno centrale per le relazioni affettive. Famiglia, matrimonio, convivenza, impegno profondo. L\'amore maturo e responsabile è il tema.',
      detail: 'L\'Anno 6 è il più significativo per l\'amore e la famiglia. Se sei in coppia, le relazioni si approfondiscono e gli impegni si consolidano: matrimoni, nascite, decisioni importanti prese insieme. Se sei single, potresti incontrare qualcuno con cui costruire qualcosa di serio e duraturo. Il romanticismo è bello ma la sostanza conta di più. Attenzione alla tendenza a controllare il partner "per il suo bene": l\'amore non è possesso. La relazione più importante da curare quest\'anno è anche quella con la famiglia d\'origine: vecchie ferite possono essere guarite.',
    },
    denaro: {
      summary: 'Spese familiari e domestiche in primo piano. Investimenti nella casa e nella qualità della vita. Generosità equilibrata.',
      detail: 'Le finanze nell\'Anno 6 sono spesso legate alla famiglia e alla casa. Potresti investire in ristrutturazioni, arredamento, o in miglioramenti della qualità della vita familiare. Le spese per i figli, i genitori anziani o il partner possono aumentare. La tua generosità naturale è amplificata: assicurati di non dare più di quanto puoi permetterti. È un buon anno per pianificazione finanziaria familiare, assicurazioni sulla vita e investimenti nel benessere domestico. Le entrate tendono a essere stabili e legate a professioni di servizio.',
    },
    benessere: {
      summary: 'Anno di riequilibrio e cura profonda. Attenzione al cuore (emotivo e fisico), alla gola e al sistema immunitario.',
      detail: 'L\'Anno 6 chiede di prenderti cura di te come ti prendi cura degli altri. Il cuore — sia emotivo che fisico — è al centro: controlla la pressione, cura l\'alimentazione cardiaca, gestisci lo stress emotivo. La gola e la tiroide possono essere sensibili. Il tuo sistema immunitario risente dello stress da responsabilità: non trascurare il riposo. Attività come lo yoga, il pilates, i trattamenti spa e la cucina sana non sono lussi ma necessità. Crea bellezza intorno a te: l\'ambiente in cui vivi influenza profondamente il tuo benessere.',
    },
    crescita: {
      summary: 'Impara l\'amore incondizionato senza perdere te stesso. Responsabilità verso gli altri e verso se stessi devono bilanciarsi.',
      detail: 'La crescita dell\'Anno 6 è incentrata sull\'amore in tutte le sue forme. Impari la differenza tra amare e controllare, tra prendersi cura e sacrificarsi. Potresti affrontare questioni familiari irrisolte o scoprire che il tuo bisogno di armonia ti porta a evitare conflitti necessari. La lezione più grande è che l\'amore vero include anche i confini: dire "no" con amore è un atto di cura. Lavora sulla capacità di accettare l\'imperfezione — nelle relazioni, in te stesso, nella vita.',
    },
  },
  7: {
    lavoro: {
      summary: 'Anno di riflessione e studio professionale. Formazione, ricerca, analisi strategica. Evita decisioni affrettate: osserva e impara.',
      detail: 'L\'Anno 7 nel lavoro è introspettivo e analitico. Non è il momento di lanciare nuovi progetti ambiziosi, ma di studiare, analizzare e perfezionare ciò che esiste. La formazione professionale, i corsi di specializzazione e la ricerca sono favoriti. Potresti sentirti distaccato dall\'ambiente lavorativo o desiderare più solitudine per concentrarti. Ascolta questo bisogno: le intuizioni migliori arrivano nel silenzio. Se devi prendere decisioni importanti, prenditi tempo per riflettere. La qualità del pensiero conta più della quantità delle azioni.',
    },
    amore: {
      summary: 'Anno di introspezione nelle relazioni. Bisogno di spazio, solitudine e riflessione. Le relazioni superficiali perdono interesse.',
      detail: 'L\'Anno 7 porta un desiderio di profondità e autenticità nelle relazioni. Le conversazioni superficiali ti annoiano e cerchi connessioni significative. Se sei in coppia, potresti aver bisogno di più spazio personale — comunicalo con chiarezza al partner per evitare malintesi. Non è mancanza d\'amore, è bisogno di introspezione. Se sei single, potresti preferire la solitudine agli appuntamenti: va bene così. Le relazioni che nascono nell\'Anno 7 tendono a essere profonde e spirituali. Il rischio è l\'isolamento eccessivo: mantieni almeno poche relazioni significative.',
    },
    denaro: {
      summary: 'Gestione riflessiva e conservativa. Non è anno di grandi investimenti ma di analisi e comprensione dei flussi finanziari.',
      detail: 'Le finanze nell\'Anno 7 richiedono riflessione più che azione. Non è il momento per investimenti rischiosi, grandi acquisti o speculazioni. Piuttosto, analizza la tua situazione finanziaria in profondità: dove vanno i tuoi soldi? Quali investimenti rendono e quali no? Potresti scoprire sprechi nascosti o opportunità che avevi trascurato. Lo studio finanziario — libri, corsi, consulenze — è un ottimo investimento quest\'anno. Le entrate possono rallentare temporaneamente, ma la comprensione che acquisisci vale più del denaro immediato.',
    },
    benessere: {
      summary: 'Connessione mente-corpo essenziale. Meditazione, sonno di qualità e alimentazione consapevole. Attenzione al sistema nervoso e alla mente.',
      detail: 'L\'Anno 7 è profondamente mentale, e il corpo ne risente. Il sistema nervoso è sotto pressione per l\'intensa attività cerebrale. Il sonno potrebbe essere disturbato da pensieri eccessivi. La meditazione non è un optional ma una necessità: anche 10 minuti al giorno possono fare la differenza. L\'alimentazione dovrebbe essere leggera e nutriente per il cervello: omega-3, frutta secca, verdure a foglia verde. L\'esercizio fisico ideale è contemplativo: camminate nella natura, nuoto, yoga meditativo. Evita la sovrastimolazione digitale, specialmente prima di dormire.',
    },
    crescita: {
      summary: 'Anno di risveglio interiore e ricerca di verità. Spiritualità, filosofia, psicologia. Fidati della tua intuizione.',
      detail: 'L\'Anno 7 è il più spirituale del ciclo. La crescita avviene attraverso l\'introspezione, lo studio e la meditazione. Potresti sentirti attratto dalla filosofia, dalla psicologia, dalla spiritualità o dalle tradizioni sapienziali. Le domande profonde — "Chi sono veramente? Qual è il senso della mia vita?" — emergono con forza. Non cercare risposte rapide: lascia che le intuizioni maturino nel silenzio. È un anno in cui la tua intuizione è particolarmente acuta: impara a fidarti di essa anche quando la logica suggerisce altro. La solitudine consapevole è il tuo strumento di crescita più potente.',
    },
  },
  8: {
    lavoro: {
      summary: 'Anno di raccolta, risultati concreti e riconoscimento professionale. Il potere e la leadership sono al centro. Gestisci con etica.',
      detail: 'L\'Anno 8 è il momento del raccolto professionale. Gli sforzi degli anni precedenti cominciano a dare frutti visibili: promozioni, aumenti, riconoscimenti, espansione del business. Il tuo potere personale è al massimo e gli altri lo percepiscono. Usa questa energia con saggezza: la leadership etica e la gestione responsabile delle risorse sono fondamentali. Potresti trovarti a gestire budget importanti, team numerosi o progetti di grande portata. La sfida è non lasciarti corrompere dal successo: resta umile, ricorda da dove sei partito e condividi i risultati.',
    },
    amore: {
      summary: 'Le relazioni si bilanciano tra potere e intimità. Attenzione alla dinamica di controllo. L\'amore maturo richiede equilibrio e rispetto reciproco.',
      detail: 'L\'Anno 8 nelle relazioni porta la questione del potere in primo piano. Chi decide nella coppia? Come vengono gestiti i soldi? Chi ha l\'ultima parola? Queste domande, anche se scomode, meritano risposte oneste. Se sei in coppia, lavora sull\'equilibrio: né dominare né sottomettersi. Se sei single, il tuo carisma è attraente ma potresti attirare persone interessate al tuo status più che a te. Cerca relazioni basate sul rispetto reciproco e sulla condivisione equa delle responsabilità. L\'amore nell\'Anno 8 è concreto, adulto e costruttivo.',
    },
    denaro: {
      summary: 'Anno più prospero del ciclo. Entrate significative, investimenti produttivi, gestione del patrimonio. Il karma finanziario si manifesta.',
      detail: 'L\'Anno 8 è finanziariamente il più potente. Le entrate possono aumentare significativamente attraverso promozioni, bonus, investimenti maturi o nuovi contratti importanti. È il momento di pensare in grande: investimenti immobiliari, espansione del business, creazione di patrimonio. Ma il karma finanziario funziona in entrambe le direzioni: se hai gestito male il denaro in passato, quest\'anno potrebbe portare lezioni difficili. L\'etica finanziaria è fondamentale: guadagna con integrità, investi con saggezza, condividi con generosità. Il denaro è energia — lascialo fluire.',
    },
    benessere: {
      summary: 'Energia potente ma rischio di stress da performance. Cura il sistema cardiovascolare, la pressione e gestisci il carico di lavoro.',
      detail: 'L\'Anno 8 porta grande energia ma anche il rischio di bruciarla per eccesso di lavoro. Il corpo va trattato come un asset prezioso: manutenzione regolare, alimentazione di qualità, esercizio fisico costante. Il sistema cardiovascolare e la pressione sanguigna meritano attenzione. Lo stress da performance è il nemico principale: impara a delegare e a prenderti pause strategiche. L\'esercizio fisico ideale è quello che combina forza e resistenza: palestra, corsa, ciclismo. Non trascurare il riposo: il successo sostenibile richiede recupero adeguato.',
    },
    crescita: {
      summary: 'Confrontati con il tuo rapporto con il potere e la materia. Impara a manifestare abbondanza con integrità e responsabilità.',
      detail: 'L\'Anno 8 ti mette di fronte al tema del potere personale. Come lo usi? Lo cerchi o lo eviti? Lo gestisci con etica o ne abusi? Queste domande sono centrali per la tua crescita. Impara che il vero potere non è controllo sugli altri ma padronanza di te stesso. La manifestazione materiale è un\'abilità spirituale: non c\'è nulla di sbagliato nel desiderare l\'abbondanza, purché sia guadagnata con integrità e condivisa con generosità. Il tema karmico è forte: ciò che dai torna indietro amplificato, nel bene e nel male.',
    },
  },
  9: {
    lavoro: {
      summary: 'Anno di conclusione e trasformazione professionale. Chiudi capitoli, lascia andare progetti esauriti e prepara il terreno per il nuovo.',
      detail: 'L\'Anno 9 segna la fine del ciclo nel lavoro. È il momento di concludere progetti, chiudere collaborazioni che non funzionano più e fare bilanci onesti sulla tua carriera. Potresti sentirti spinto a cambiare radicalmente, ma prima di iniziare qualcosa di nuovo, assicurati di aver completato il vecchio. Il lavoro di servizio e orientato agli altri è particolarmente favorito: volontariato, mentoring, progetti sociali. Se il tuo lavoro attuale non riflette più chi sei, quest\'anno ti dà il permesso di lasciarlo andare con gratitudine per ciò che ti ha insegnato.',
    },
    amore: {
      summary: 'Anno di perdono, chiusura e compassione. Relazioni che hanno esaurito il loro scopo possono concludersi. L\'amore universale si espande.',
      detail: 'L\'Anno 9 in amore è intenso e trasformativo. Relazioni che hanno concluso il loro percorso possono terminare — non necessariamente con dolore, ma con la consapevolezza che hanno dato tutto ciò che potevano. Se sei in coppia, è il momento del perdono: lascia andare risentimenti e ferite accumulate. Se sei single, potresti vivere un incontro significativo con qualcuno che riflette il tuo percorso di crescita. L\'amore nell\'Anno 9 è compassionevole e altruistico: impari ad amare senza possedere, a dare senza aspettarti nulla in cambio.',
    },
    denaro: {
      summary: 'Anno di bilancio e generosità. Le finanze richiedono chiusura di vecchi conti e preparazione per il nuovo ciclo. Dona con consapevolezza.',
      detail: 'L\'Anno 9 finanziariamente è un anno di bilancio. Chiudi debiti residui, risolvi questioni finanziarie pendenti, fai chiarezza su ciò che possiedi e ciò che devi. La generosità è un tema forte: potresti sentire l\'impulso di donare, condividere o investire in cause che ti stanno a cuore. Fallo con consapevolezza, non per senso di colpa. Non è il momento ideale per iniziare grandi investimenti: aspetta il prossimo Anno 1 per seminare di nuovo. Concentrati sulla gratitudine per ciò che hai e sulla preparazione finanziaria per il nuovo ciclo.',
    },
    benessere: {
      summary: 'Rilascio emotivo e fisico. Il corpo si libera di tossine accumulate. Terapie di depurazione, detox emotivo e fisico sono favoriti.',
      detail: 'L\'Anno 9 è un anno di purificazione. Il corpo tende a rilasciare tossine accumulate — fisiche, emotive, energetiche. Potresti sperimentare sintomi di detox: stanchezza improvvisa, emotività accentuata, desiderio di cambiare alimentazione. Asseconda questi segnali. Programmi di depurazione, digiuni controllati, terapie olistiche e lavoro corporeo profondo sono particolarmente efficaci. Il rilascio emotivo è altrettanto importante: lascia andare rabbia, rancore e tristezza attraverso il movimento, la scrittura o il pianto liberatorio. Preparati a rinascere più leggero nel prossimo Anno 1.',
    },
    crescita: {
      summary: 'Chiudi il ciclo con saggezza. Perdona, lascia andare, celebra il percorso fatto. Prepara l\'anima per un nuovo inizio.',
      detail: 'L\'Anno 9 è il completamento del ciclo di 9 anni. Tutto ciò che hai imparato, vissuto e superato si cristallizza in saggezza. È il momento di perdonare — te stesso e gli altri — e di lasciare andare ciò che non serve più. Non aggrapparti a persone, situazioni o identità che hanno esaurito il loro scopo. La compassione — verso te stesso e verso il mondo — è il dono più grande di quest\'anno. Celebra il percorso fatto, onora le lezioni apprese e preparati con fiducia per il nuovo ciclo che inizierà. Ogni fine contiene in sé un nuovo inizio.',
    },
  },
  11: {
    lavoro: {
      summary: 'Anno di ispirazione e visione. Lavori creativi, spirituali e innovativi sono favoriti. La tua intuizione professionale è straordinaria.',
      detail: 'L\'Anno Personale 11 porta un\'energia visionaria nel lavoro. Le tue intuizioni professionali sono straordinariamente acute: fidati di esse anche quando sembrano irrazionali. Sei in grado di vedere opportunità che altri non vedono e di ispirare chi ti circonda. I lavori legati alla creatività, alla spiritualità, alla consulenza intuitiva e all\'innovazione sono particolarmente favoriti. La sfida è portare le tue visioni a terra: idee brillanti senza esecuzione pratica restano sogni. Cerca collaboratori pratici che possano dare forma concreta alle tue intuizioni.',
    },
    amore: {
      summary: 'Connessioni animiche e spirituali profonde. L\'amore trascende il quotidiano e tocca livelli di profondità rari.',
      detail: 'L\'Anno 11 porta relazioni di natura animica. Potresti incontrare qualcuno con cui senti una connessione inspiegabile, come se vi conosceste da sempre. Se sei in coppia, la relazione può raggiungere livelli di intimità e comprensione straordinari. Tuttavia, l\'alta vibrazione del numero 11 può anche amplificare la sensibilità emotiva: piccoli malintesi diventano drammi se non gestiti con consapevolezza. La sfida è mantenere i piedi per terra: l\'amore spirituale è meraviglioso, ma la relazione ha anche bisogno di quotidianità, praticità e normalità.',
    },
    denaro: {
      summary: 'Le finanze sono guidate dall\'intuizione. Possibili entrate da fonti ispirate o spirituali. Mantieni il radicamento pratico.',
      detail: 'Le finanze nell\'Anno 11 possono seguire percorsi non convenzionali. La tua intuizione può guidarti verso investimenti o opportunità che la logica non giustificherebbe ma che si rivelano profittevoli. Entrate possibili da attività spirituali, creative, artistiche o di consulenza intuitiva. Il rischio è l\'eccessiva idealizzazione: non puoi vivere solo di visioni, servono anche conti che tornano. Bilancia l\'ispirazione con la praticità. Se un\'opportunità finanziaria ti sembra "troppo bella per essere vera", probabilmente lo è. Fidati dell\'intuizione ma verifica con i numeri.',
    },
    benessere: {
      summary: 'Sistema nervoso ipersensibile. Essenziale proteggere la propria energia da ambienti tossici. Meditazione e radicamento sono vitali.',
      detail: 'L\'Anno 11 amplifica enormemente la sensibilità del sistema nervoso. Sei come un\'antenna che capta tutto: emozioni altrui, tensioni ambientali, energie sottili. Questo può essere un dono straordinario ma anche estenuante. Proteggi la tua energia: evita persone e ambienti tossici, limita la sovrastimolazione, crea rituali di pulizia energetica. La meditazione è essenziale, non opzionale. L\'alimentazione dovrebbe essere leggera e naturale. Il radicamento fisico — camminare a piedi nudi sulla terra, stare nella natura, fare lavori manuali — aiuta a bilanciare l\'alta vibrazione mentale.',
    },
    crescita: {
      summary: 'Risveglio spirituale e intuizione amplificata. Canale aperto verso dimensioni superiori. La sfida è integrare visione e realtà.',
      detail: 'L\'Anno 11 è un portale di risveglio. La tua coscienza si espande e potresti vivere esperienze di intuizione, sincronicità e comprensione profonda che ti lasciano senza fiato. Sogni vividi, déjà vu, presagi che si avverano sono comuni. Il numero maestro 11 ti chiede di fungere da canale tra l\'alto e il basso, tra la visione e la realtà. La sfida più grande è non perdersi nelle sfere elevate: la spiritualità autentica si manifesta nella vita quotidiana, nelle scelte concrete, nel modo in cui tratti le persone intorno a te.',
    },
  },
  22: {
    lavoro: {
      summary: 'Anno di costruzione visionaria. Progetti di grande portata, impatto duraturo. Sei il Maestro Costruttore: pensa in grande e agisci con metodo.',
      detail: 'L\'Anno 22 nel lavoro è eccezionale. Combini la visione dell\'11 con la concretezza del 4, creando la possibilità di realizzare progetti di grande impatto. Potresti trovarti a gestire iniziative che vanno oltre il tuo ambito personale: progetti comunitari, aziendali o sociali di ampio respiro. La tua capacità di trasformare visioni ambiziose in realtà concrete è al massimo. La sfida è la pressione: le aspettative — tue e degli altri — sono altissime. Delega, pianifica in fasi e accetta che anche i grandi progetti si costruiscono un mattone alla volta.',
    },
    amore: {
      summary: 'Relazioni che costruiscono qualcosa di grande insieme. Partnership di vita, progetti condivisi, famiglia come fondamento.',
      detail: 'L\'Anno 22 porta l\'amore nella dimensione della costruzione condivisa. Se sei in coppia, è il momento di costruire qualcosa di significativo insieme: una casa, una famiglia, un progetto che lasci un segno. La relazione diventa una partnership operativa oltre che emotiva. Se sei single, potresti incontrare qualcuno con cui condividi non solo l\'attrazione ma anche una visione comune del futuro. L\'amore nel 22 è maturo, concreto e orientato al lungo termine. La sfida è non sacrificare la tenerezza e l\'intimità sull\'altare dell\'efficienza e della produttività.',
    },
    denaro: {
      summary: 'Potenziale finanziario enorme per progetti strutturati e di lungo periodo. Investimenti immobiliari, business solidi, patrimonio duraturo.',
      detail: 'Le finanze nell\'Anno 22 possono raggiungere livelli eccezionali se gestite con visione e metodo. È l\'anno ideale per investimenti immobiliari, creazione di business strutturati, pianificazione patrimoniale di lungo termine. Il potenziale è enorme ma richiede disciplina: ogni decisione finanziaria dovrebbe essere valutata nel contesto del lungo periodo. I guadagni arrivano attraverso la costruzione paziente, non la speculazione. Potresti gestire budget importanti o risorse significative: fallo con responsabilità e trasparenza. Il successo finanziario nel 22 è duraturo se costruito su basi etiche.',
    },
    benessere: {
      summary: 'Il corpo deve sostenere grandi ambizioni. Fondamenta fisiche solide: alimentazione strutturata, esercizio regolare, sonno adeguato.',
      detail: 'L\'Anno 22 richiede un corpo forte per sostenere ambizioni elevate. Non puoi costruire grandi cose se le fondamenta fisiche sono deboli. L\'alimentazione deve essere strutturata e di alta qualità: carboidrati complessi, proteine complete, grassi sani. L\'esercizio fisico dovrebbe costruire sia forza che resistenza. Il sonno è non negoziabile: almeno 7-8 ore per permettere al corpo e alla mente di rigenerarsi. Lo stress è il nemico invisibile: implementa routine di gestione dello stress prima che si accumuli. Controlla regolarmente la salute: prevenzione è meglio che cura.',
    },
    crescita: {
      summary: 'Realizza la tua più alta visione in forma concreta. La sfida del Maestro Costruttore: unire ideale e reale, spirito e materia.',
      detail: 'L\'Anno 22 è il più potente per la manifestazione concreta delle tue visioni più elevate. Sei chiamato a essere un Maestro Costruttore: qualcuno che prende ideali astratti e li trasforma in realtà tangibili. Questo richiede un livello di disciplina, visione e resistenza fuori dal comune. La crescita personale passa attraverso l\'azione: non basta avere belle idee, devi realizzarle. La sfida è mantenere la connessione con lo scopo più alto mentre ti occupi dei dettagli pratici. Ogni mattone che posi è un atto spirituale se fatto con intenzione e integrità.',
    },
  },
  33: {
    lavoro: {
      summary: 'Anno di servizio e insegnamento al più alto livello. Lavori di cura, guarigione, educazione e guida compassionevole sono la tua vocazione.',
      detail: 'L\'Anno 33 nel lavoro ti chiama al servizio più elevato. Il tuo ruolo è quello di guida, guaritore, insegnante o mentore — non per ego ma per autentica compassione. Le professioni di cura, l\'insegnamento, la terapia, il counseling e il lavoro sociale sono straordinariamente favoriti. Potresti sentire che il tuo lavoro deve avere un impatto positivo sulla vita degli altri per avere senso. La sfida è non sovraccaricarti di responsabilità: anche il più compassionevole dei maestri ha bisogno di riposo. Impara a servire senza esaurirti.',
    },
    amore: {
      summary: 'Amore universale e incondizionato. Le relazioni diventano veicoli di guarigione e crescita reciproca. Compassione senza sacrificio.',
      detail: 'L\'Anno 33 eleva l\'amore alla dimensione universale. In coppia, la relazione diventa uno spazio sacro di crescita reciproca e guarigione. Potresti scoprire che amare il partner significa anche amarne le imperfezioni e sostenerne la crescita senza volerlo cambiare. Se sei single, l\'amore che cerchi è profondo, compassionevole e autentico — niente giochi o superficialità. La sfida del 33 è il sacrificio eccessivo: la tua natura compassionevole può portarti a dimenticare i tuoi bisogni. L\'amore più grande include anche l\'amore per te stesso.',
    },
    denaro: {
      summary: 'Denaro al servizio di una missione più alta. Le finanze fluiscono quando sono allineate con il tuo scopo. Generosità consapevole.',
      detail: 'Le finanze nell\'Anno 33 sono profondamente legate al tuo senso di missione. Il denaro tende a fluire più facilmente quando il tuo lavoro è allineato con il tuo scopo più alto. Potresti sentire l\'impulso di donare, finanziare cause benefiche o investire in progetti che migliorano la vita degli altri. Fallo con consapevolezza e senza senso di colpa per ciò che tieni per te: non puoi servire gli altri se sei in difficoltà finanziaria. L\'equilibrio tra generosità e autosufficienza è la chiave. Le entrate possono arrivare da fonti inaspettate quando sei allineato con il tuo scopo.',
    },
    benessere: {
      summary: 'Guarigione profonda — fisica, emotiva, spirituale. Il corpo è un tempio: trattalo con reverenza. Pratiche olistiche sono essenziali.',
      detail: 'L\'Anno 33 porta la possibilità di una guarigione profonda a tutti i livelli. Il corpo, le emozioni e lo spirito sono interconnessi come mai prima. Pratiche olistiche — reiki, agopuntura, ayurveda, meditazione profonda — sono particolarmente efficaci. Potresti scoprire capacità di guarigione in te stesso: le tue mani, le tue parole, la tua presenza possono avere un effetto curativo sugli altri. Ma prima devi guarire te stesso: vecchie ferite emotive, traumi non elaborati, schemi fisici cronici. Il tuo corpo è un tempio: alimentalo, muovilo e onoralo con reverenza.',
    },
    crescita: {
      summary: 'Il cammino del Maestro dell\'Amore Universale. Servizio, compassione e responsabilità cosmica. Guarisci te stesso per guarire il mondo.',
      detail: 'L\'Anno 33 è il pinnacolo della crescita spirituale nel ciclo numerologico. Sei chiamato a incarnare l\'Amore Universale — non come concetto astratto ma come pratica quotidiana. Ogni interazione diventa un\'opportunità di guarigione, ogni parola può essere un balsamo, ogni gesto può trasformare. La sfida è immensa: la responsabilità del 33 può schiacciare chi non è preparato. Il segreto è la semplicità: non devi salvare il mondo, devi amare autenticamente chi hai davanti. La crescita più profonda avviene nel quotidiano, nel piccolo gesto di compassione che trasforma l\'ordinario in sacro.',
    },
  },
};

export function getPersonalYearSectors(personalYear: number): Record<SectorKey, SectorDetail> {
  // For numbers not in the map, reduce to base
  if (personalYearSectors[personalYear]) {
    return personalYearSectors[personalYear];
  }
  // Fallback: reduce master numbers to base
  const base = personalYear === 11 ? 2 : personalYear === 22 ? 4 : personalYear === 33 ? 6 : personalYear;
  return personalYearSectors[base] || personalYearSectors[1];
}

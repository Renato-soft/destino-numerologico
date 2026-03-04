// Soul Number descriptions from knowledge base

export interface SoulDescription {
  vision: string;
  archetype: string;
  description: string;
  values: string[];
  shadow: string;
  fortuneKeys: string[];
  keywords: string;
  fullVision: string;
  motivation: string;
  fear: string;
}

export const soulDescriptions: Record<number, SoulDescription> = {
  1: {
    vision: "Intraprendere un'impresa coraggiosa",
    archetype: "Guerriero e Leader",
    description: "Il Numero dell'Anima 1 è legato all'archetipo del Guerriero e del Leader. Indica uno spirito intraprendente, determinato e pronto ad accettare grandi sfide. La vostra anima è motivata dal desiderio di affermare ideali elevati e di lasciare un segno concreto nel mondo.",
    values: ["Verità e onestà", "Forza morale e coerenza", "Giustizia e integrità", "Indipendenza e coraggio"],
    shadow: "La vostra grande forza può diventare eccesso di controllo o durezza. La vera vittoria non è dominare, ma guidare con equilibrio.",
    fortuneKeys: [
      "Definire obiettivi chiari: la fortuna si attiva quando avete una direzione precisa.",
      "Sentire la forza interiore: riconoscete il vostro potere personale e muovetevi con determinazione.",
      "Esprimere originalità e indipendenza: abbiate il coraggio di distinguervi."
    ],
    keywords: "Io sono. Io creo. Io combatto. Io vinco.",
    fullVision: "Migliorare il mondo, affermare ideali, ispirare gli altri a crescere.",
    motivation: "Essere pionieri, vincere, cambiare la realtà attraverso l'azione.",
    fear: "Fallimento, vulnerabilità.",
  },
  2: {
    vision: "Sentire con il cuore e creare armonia",
    archetype: "Pacificatore e Custode dell'Amore",
    description: "Il Numero dell'Anima 2 è legato all'archetipo del Pacificatore e del Custode dell'Amore. La vostra anima è guidata da una visione di pace, dolcezza e armonia. Siete venuti al mondo con il desiderio di creare relazioni autentiche e spazi in cui le persone possano sentirsi accolte.",
    values: ["Pace e armonia", "Sicurezza emotiva", "Amore e condivisione", "Cooperazione e amicizia", "Compassione e umiltà"],
    shadow: "La vostra grande sensibilità può portarvi a evitare i conflitti a ogni costo, reprimendo bisogni e emozioni. La crescita passa attraverso l'equilibrio: esprimere ciò che sentite senza temere di turbare gli altri.",
    fortuneKeys: [
      "Rallentare e ascoltare: la fortuna si attiva quando vi concedete tempo per sentire.",
      "Usare le emozioni come bussola: fiducia e serenità indicano la direzione giusta.",
      "Accogliere la vulnerabilità: la sensibilità non è debolezza, ma forza."
    ],
    keywords: "Io sento. Io condivido. Io partecipo. Io amo.",
    fullVision: "Creare un ambiente sicuro e sereno, portare pace nelle relazioni.",
    motivation: "Dare e ricevere amore in modo autentico e incondizionato.",
    fear: "Abbandono, solitudine.",
  },
  3: {
    vision: "Esprimersi ed espandere la gioia",
    archetype: "Creativo e Comunicatore",
    description: "Il Numero dell'Anima 3 è legato all'archetipo del Creativo e del Comunicatore. La vostra anima è solare, spontanea e gioiosa. Siete tornati per celebrare la vita, esprimere i vostri talenti e diffondere entusiasmo.",
    values: ["Gioia e positività", "Condivisione e partecipazione", "Amicizia e armonia", "Bellezza e creatività", "Fiducia e ottimismo"],
    shadow: "Il desiderio di piacere a tutti può rendervi dispersivi o superficiali. La crescita passa dall'autenticità: non dovete essere perfetti per essere amati.",
    fortuneKeys: [
      "Coltivare pensieri positivi: concentrarvi su ciò che funziona amplifica le opportunità.",
      "Valorizzare il vostro carisma: la spontaneità vi rende magnetici.",
      "Dare spazio alla creatività: lasciate andare la vergogna e il giudizio."
    ],
    keywords: "Io mi riconosco. Io mi esprimo. Io comunico. Io creo.",
    fullVision: "Diffondere felicità, ispirare ottimismo, essere messaggeri di luce.",
    motivation: "Celebrare l'esistenza ed esprimere i propri talenti.",
    fear: "Monotonia, mancanza di stimoli, grigiore emotivo.",
  },
  4: {
    vision: "Costruire il futuro su solide basi",
    archetype: "Costruttore e Custode",
    description: "Il Numero dell'Anima 4 è legato all'archetipo del Costruttore e del Custode. La vostra anima è guidata dal desiderio di creare stabilità, assumersi responsabilità e migliorare concretamente l'ambiente in cui vive.",
    values: ["Stabilità e sicurezza", "Responsabilità e rispetto", "Famiglia e tradizione", "Salute e benessere", "Ordine, disciplina e lavoro"],
    shadow: "La ricerca di stabilità può trasformarsi in rigidità. I cambiamenti possono spaventarvi. La vostra evoluzione passa attraverso la fiducia: la struttura è importante, ma la vita richiede anche flessibilità.",
    fortuneKeys: [
      "Riconoscere la vostra forza: avete una perseveranza straordinaria.",
      "Strutturare un progetto chiaro: pianificate e suddividete in fasi.",
      "Regolare i ritmi: cura del corpo e organizzazione mantengono energia e lucidità."
    ],
    keywords: "Io lavoro. Io organizzo. Io costruisco. Io realizzo.",
    fullVision: "Creare strutture solide che promuovano sicurezza, salute e benessere.",
    motivation: "Dare forma stabile alle idee e garantire protezione e sviluppo.",
    fear: "Caos, instabilità, cambiamento improvviso.",
  },
  5: {
    vision: "Dire di sì alla vita in perpetuo divenire",
    archetype: "Viaggiatore e Cercatore",
    description: "Il Numero dell'Anima 5 è legato all'archetipo del Viaggiatore e del Cercatore. La vostra anima è spinta dalla curiosità, dal desiderio di libertà e dall'attrazione per le nuove esperienze. Siete nati per esplorare e mettervi costantemente in gioco.",
    values: ["Libertà e indipendenza", "Cambiamento e avventura", "Ricerca e conoscenza", "Comunicazione e relazioni", "Gioia, piacere e trascendenza"],
    shadow: "La voglia di libertà può diventare fuga o evasione. La vera crescita avviene nell'equilibrio tra libertà e impegno consapevole.",
    fortuneKeys: [
      "Vivere nel presente: la fortuna arriva quando siete pienamente nel qui e ora.",
      "Accettare il cambiamento: la vita è un flusso costante.",
      "Cogliere le opportunità: apritevi e agite con coraggio."
    ],
    keywords: "Io desidero. Io ricerco. Io comunico. Io sperimento.",
    fullVision: "Dire di sì alla vita, esplorando e vivendo esperienze libere da pregiudizi.",
    motivation: "Cercare la verità e sperimentare il transpersonale.",
    fear: "Conformismo, restrizioni, prigionia.",
  },
  6: {
    vision: "Aiutare gli altri col potere dell'amore",
    archetype: "Caregiver e Mentore",
    description: "Il Numero dell'Anima 6 è legato all'archetipo del Caregiver e del Mentore. La vostra anima è guidata dal desiderio di donare amore, armonia e sostegno. La vostra missione è creare legami profondi e aiutare chi vi circonda a esprimere il proprio potenziale.",
    values: ["Famiglia e coppia", "Amore e compassione", "Educazione e servizio", "Bellezza e armonia", "Fedeltà e etica"],
    shadow: "La tendenza a voler salvare gli altri può portare a trascurare voi stessi. La vera realizzazione avviene quando unite il donare al saper ricevere.",
    fortuneKeys: [
      "Aprire il cuore: lasciate andare giudizio e resistenze.",
      "Sentirsi in famiglia: la fortuna arriva con relazioni basate su fiducia e intimità.",
      "Onorare se stessi: il vero amore non deve andare a scapito della vostra felicità."
    ],
    keywords: "Io amo. Io insegno. Io accudisco. Io creo.",
    fullVision: "Contribuire al benessere di chi vi circonda, educare con amore e verità.",
    motivation: "Prendersi cura degli altri con responsabilità e cuore aperto.",
    fear: "Egoismo e ingratitudine altrui.",
  },
  7: {
    vision: "Scoprire la verità attraverso introspezione e conoscenza",
    archetype: "Ricercatore e Saggio",
    description: "Il Numero dell'Anima 7 è legato all'archetipo del Ricercatore e del Saggio. La vostra anima è guidata dalla curiosità profonda e dal desiderio di comprendere i misteri della vita. Siete attratti dalla conoscenza, dalla spiritualità e dall'introspezione.",
    values: ["Ricerca della verità e conoscenza", "Saggezza e introspezione", "Spiritualità e intuizione", "Libertà interiore e autonomia", "Profondità e analisi"],
    shadow: "La tendenza all'isolamento può farvi sentire distaccati o soli. L'eccesso di analisi può bloccare l'azione. La vera crescita avviene unendo conoscenza e esperienza, mente e cuore.",
    fortuneKeys: [
      "Coltivare l'introspezione: dedicate tempo alla riflessione e alla meditazione.",
      "Fidarsi dell'intuizione: il vostro intuito è una bussola preziosa.",
      "Integrare conoscenza e azione: trasformare intuizioni in risultati concreti."
    ],
    keywords: "Io comprendo. Io scopro. Io rifletto. Io integro.",
    fullVision: "Esplorare i misteri della vita, sviluppare saggezza e consapevolezza.",
    motivation: "Conoscere se stessi e il mondo in profondità.",
    fear: "Ignoranza, superficialità, isolamento.",
  },
  8: {
    vision: "Realizzare il potere e l'abbondanza attraverso responsabilità e azione",
    archetype: "Leader e Realizzatore",
    description: "Il Numero dell'Anima 8 è legato all'archetipo del Leader e del Realizzatore. La vostra anima è guidata dal desiderio di successo, autorealizzazione e influenza positiva nel mondo. Siete spinti a trasformare le idee in risultati concreti.",
    values: ["Successo e realizzazione personale", "Potere responsabile e leadership", "Giustizia e integrità", "Abbondanza e prosperità", "Disciplina e determinazione"],
    shadow: "La ricerca di controllo o eccessivo attaccamento al successo può portare a stress e rigidità. La vera forza si manifesta unendo ambizione e equilibrio.",
    fortuneKeys: [
      "Assumersi responsabilità: guidare le situazioni con autorevolezza e coscienza.",
      "Agire con integrità: il successo reale nasce dal rispetto dei valori.",
      "Gestire le risorse con saggezza: amministrare tempo, denaro ed energie."
    ],
    keywords: "Io comando. Io realizzo. Io organizzo. Io prospero.",
    fullVision: "Manifestare successo e abbondanza attraverso leadership responsabile.",
    motivation: "Creare strutture solide e risultati concreti.",
    fear: "Perdita di controllo, fallimento, mancanza di sicurezza.",
  },
  9: {
    vision: "Servire il mondo e trasformare l'umanità",
    archetype: "Saggio Universale e Guaritore",
    description: "Il Numero dell'Anima 9 è legato all'archetipo del Saggio Universale e del Guaritore. La vostra anima è guidata dal desiderio di contribuire al bene comune, elevare la coscienza collettiva e portare armonia nel mondo.",
    values: ["Altruismo e servizio", "Compassione e empatia", "Saggezza e spiritualità", "Giustizia e umanità", "Amore universale e tolleranza"],
    shadow: "La tendenza a farsi carico di tutto può portare a sacrifici eccessivi e burnout. La vera forza nasce dall'equilibrio tra servizio agli altri e cura di sé stessi.",
    fortuneKeys: [
      "Servire con saggezza: dedicate le energie a cause giuste, bilanciando azione e riflessione.",
      "Espandere la coscienza: coltivate spiritualità ed empatia.",
      "Trasformare esperienza in saggezza: le vostre sfide diventano strumenti per aiutare gli altri."
    ],
    keywords: "Io servo. Io trasformo. Io comprendo. Io illumino.",
    fullVision: "Elevare l'umanità, diffondere armonia e amore universale.",
    motivation: "Contribuire al bene comune e lasciare un'impronta positiva nel mondo.",
    fear: "Egoismo, ingiustizia, isolamento.",
  },
  11: {
    vision: "Ispirare e illuminare attraverso l'intuizione",
    archetype: "Ispiratore e Visionario",
    description: "Il Numero dell'Anima 11 è un Numero Maestro, legato all'archetipo dell'Ispiratore e del Visionario. La vostra anima è guidata da una sensibilità straordinaria e da una forte connessione intuitiva. Siete qui per portare luce, consapevolezza e ispirazione.",
    values: ["Intuizione e ispirazione", "Spiritualità e visione elevata", "Sensibilità ed empatia", "Creatività e idealismo", "Verità interiore e autenticità"],
    shadow: "L'intensità emotiva può generare ansia, insicurezza o senso di inadeguatezza. La crescita passa attraverso il radicamento: gestire l'energia e trasformare l'ispirazione in azione concreta.",
    fortuneKeys: [
      "Fidarsi dell'intuizione: la vostra guida principale è interiore.",
      "Radicare le visioni: date forma concreta ai sogni attraverso piccoli passi.",
      "Proteggere la vostra energia: create spazi di silenzio e rigenerazione."
    ],
    keywords: "Io ispiro. Io illumino. Io intuisco. Io elevo.",
    fullVision: "Portare luce e consapevolezza, guidare attraverso l'esempio e l'ispirazione.",
    motivation: "Risvegliare coscienze e vivere una missione più grande del sé individuale.",
    fear: "Confusione, instabilità emotiva, non essere compresi.",
  },
  22: {
    vision: "Realizzare grandi progetti per il bene collettivo",
    archetype: "Maestro Costruttore e Visionario Pratico",
    description: "Il Numero dell'Anima 22 è un Numero Maestro, legato all'archetipo del Maestro Costruttore e del Visionario Pratico. La vostra anima è guidata dal desiderio di trasformare idee elevate in realtà concrete, creando opere durature per il bene di molti.",
    values: ["Visione e realizzazione pratica", "Leadership responsabile e integrità", "Saggezza applicata e disciplina", "Altruismo e servizio collettivo", "Stabilità e sicurezza per la comunità"],
    shadow: "La pressione di grandi responsabilità può generare ansia o perfezionismo. La vera forza nasce dall'equilibrio tra ambizione, saggezza e servizio.",
    fortuneKeys: [
      "Sognare in grande e agire con metodo: un piano dettagliato trasforma le intuizioni in risultati.",
      "Integrare visione e pragmatismo: unire idealismo e realtà.",
      "Servire il bene collettivo: la leadership responsabile genera riconoscimento e abbondanza."
    ],
    keywords: "Io realizzo. Io costruisco. Io organizzo. Io illumino.",
    fullVision: "Tradurre grandi idee in progetti concreti con impatto positivo sul mondo.",
    motivation: "Creare opere durature al servizio del bene collettivo.",
    fear: "Fallimento, inefficacia, mancanza di controllo.",
  },
};

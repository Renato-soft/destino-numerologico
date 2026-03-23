// Structured descriptions for each number following the template:
// synthesis, calculation, gifts, challenge, example, advice

export interface NumberTemplateDesc {
  synthesis: string;
  gifts: string;
  challenge: string;
  example: string;
  advice: string;
}

// Descriptions per number type per number value
// Types: destino, io, anima, personalita, quintessenza

type NumberType = 'destino' | 'io' | 'anima' | 'personalita' | 'quintessenza' | 'ciclo';

const calculationMethods: Record<NumberType, string> = {
  destino: "Si ricava dalla tua data di nascita: si sommano giorno, mese e anno, e si riducono a un numero solo.",
  io: "Si ricava dal tuo nome completo: ogni lettera ha un numero, si sommano tutti e si riducono a uno solo.",
  anima: "Si ricava dalle vocali del tuo nome completo: si sommano i loro valori e si riducono a un numero solo.",
  personalita: "Si ricava dalle consonanti del tuo nome completo: si sommano i loro valori e si riducono a un numero solo.",
  quintessenza: "Si ricava sommando il numero dell'Io e il numero del Destino, fino a ottenere una cifra sola (tranne 11 e 22).",
  ciclo: "I Cicli della Vita vengono dalla tua data di nascita: il primo dal mese, il secondo dal giorno, il terzo dall'anno.",
};

export function getCalculationMethod(type: NumberType): string {
  return calculationMethods[type];
}

// Per-type synthesis (what the number represents in that position)
const typeSynthesis: Record<NumberType, string> = {
  destino: "Mostra la strada che la vita ti chiede di percorrere, passo dopo passo.",
  io: "Mostra come ti presenti al mondo e cosa sai fare meglio.",
  anima: "Mostra cosa desideri davvero nel profondo del cuore.",
  personalita: "Mostra come ti vedono gli altri dall'esterno.",
  quintessenza: "È il punto più alto del tuo potenziale: dove i tuoi talenti e la tua missione si uniscono.",
  ciclo: "Mostra che tipo di energia domina in una fase precisa della tua vita.",
};

export function getTypeSynthesis(type: NumberType): string {
  return typeSynthesis[type];
}

// Template descriptions per number (1-9 + 11, 22, 33)
const templateDescriptions: Record<number, Partial<Record<NumberType, NumberTemplateDesc>>> = {
  1: {
    destino: {
      synthesis: "Il numero di chi fa le cose da solo, con coraggio e voglia di essere il primo.",
      gifts: "Sai prendere decisioni, non hai paura di iniziare qualcosa di nuovo, hai il coraggio di andare avanti anche quando gli altri si fermano.",
      challenge: "A volte pensi solo a te stesso e fai fatica a lavorare in squadra. Potresti voler comandare troppo, oppure non chiedere mai aiuto.",
      example: "Pensa a chi apre un'attività partendo da zero. O a chi prende una decisione importante quando tutti gli altri hanno paura. Chi cambia vita senza aspettare il permesso di nessuno.",
      advice: "Essere un leader non vuol dire comandare: vuol dire dare il buon esempio. Impara anche ad ascoltare gli altri e a lasciarti aiutare.",
    },
    io: {
      synthesis: "Ti fai notare perché sei deciso e sicuro di te. Sei uno che sa cosa vuole.",
      gifts: "Hai idee originali, sai decidere in fretta, la gente si fida di te perché trasmetti sicurezza.",
      challenge: "A volte sembri troppo duro o distante. Devi imparare a usare la tua forza senza far sentire gli altri piccoli.",
      example: "Sei quello a cui tutti chiedono consiglio nel gruppo. Quando c'è un problema, tutti guardano te.",
      advice: "Hai una voce forte: usala per dare coraggio agli altri, non per zittirli. Una parola gentile vale più di un ordine.",
    },
    anima: {
      synthesis: "Dentro di te vuoi essere libero, vero e padrone della tua vita.",
      gifts: "Hai un coraggio interiore enorme, vuoi essere autentico a tutti i costi e sai stare bene anche da solo.",
      challenge: "Il tuo bisogno di libertà può allontanare le persone. Potresti chiuderti per paura di perdere la tua indipendenza.",
      example: "Sei quello che sente un fuoco dentro che lo spinge a creare qualcosa di suo. Non riesci a fare finta di essere diverso da quello che sei.",
      advice: "Essere forti non vuol dire non aver bisogno di nessuno. Lascia entrare le persone giuste: la vera forza è anche saper chiedere aiuto.",
    },
    personalita: {
      synthesis: "La gente ti vede come una persona forte, sicura e che sa il fatto suo.",
      gifts: "Quando entri in una stanza la gente ti nota. Dai l'impressione di sapere sempre cosa fare.",
      challenge: "A volte sembri troppo freddo o difficile da avvicinare. La gente potrebbe avere paura di parlarti.",
      example: "Sei quello che quando entra in una stanza attira gli sguardi senza fare niente. Ti scelgono sempre come capo nei gruppi.",
      advice: "Ogni tanto fai vedere anche il tuo lato dolce. La gente si affeziona a chi è vero, non a chi sembra perfetto.",
    },
    quintessenza: {
      synthesis: "Dai il meglio di te quando prendi l'iniziativa e crei qualcosa dal nulla.",
      gifts: "Sai unire quello che sei con quello che fai e trasformarlo in azione. Hai la stoffa del pioniere.",
      challenge: "Fare troppo senza mai fermarti ti può esaurire. Impara quando è il momento di fare una pausa.",
      example: "Sei come l'inventore che ha un'idea geniale e la trasforma in realtà. Riesci a unire il cuore con l'azione.",
      advice: "Il tuo dono più grande è iniziare. Non aspettare che tutto sia perfetto: il primo passo è quello che conta di più.",
    },
  },
  2: {
    destino: {
      synthesis: "Il numero di chi sa stare con gli altri, ascoltare e creare pace.",
      gifts: "Capisci come si sentono le persone, sai mettere d'accordo tutti, ascolti davvero e sai far sentire gli altri importanti.",
      challenge: "A volte ti perdi nell'aiutare gli altri e ti dimentichi di te. Potresti aver paura dei litigi e non dire mai quello che pensi.",
      example: "Pensa a chi riesce a far fare pace a due amici che litigano. O a chi capisce come stai solo guardandoti in faccia.",
      advice: "Essere sensibili è un superpotere, non una debolezza. Ma ricordati anche di dire quello che vuoi tu: puoi voler bene senza perdere te stesso.",
    },
    io: {
      synthesis: "Ti esprimi con gentilezza e sai creare un ambiente dove tutti si sentono bene.",
      gifts: "Sai mettere d'accordo le persone, parli con delicatezza e riesci a creare legami veri tra la gente.",
      challenge: "A volte sembri troppo gentile e la gente potrebbe pensare che non hai opinioni tue. Devi imparare a dire la tua anche quando è scomodo.",
      example: "Sei quello che riesce a far lavorare insieme persone molto diverse. Con una parola dolce risolvi problemi che sembravano impossibili.",
      advice: "Essere gentili non vuol dire essere deboli. Dire quello che pensi con rispetto è il modo più bello di voler bene.",
    },
    anima: {
      synthesis: "Dentro di te vuoi pace, relazioni vere e sentirti al sicuro con le persone che ami.",
      gifts: "Senti le cose prima degli altri, sai creare legami profondi e hai bisogno di bellezza e armonia intorno a te.",
      challenge: "Per non litigare, a volte tieni tutto dentro e accumuli rabbia. Potresti mettere sempre gli altri prima di te.",
      example: "Sei quello che sente il dolore degli altri come se fosse il suo. Crei posti dove tutti si sentono a casa.",
      advice: "La pace vera non è evitare i problemi, ma affrontarli restando calmi. Impara a dire quello che senti.",
    },
    personalita: {
      synthesis: "La gente ti vede come una persona dolce, su cui si può contare e che mette a proprio agio.",
      gifts: "Quando sei presente, la gente si rilassa. Dai l'idea di essere una persona calma e affidabile.",
      challenge: "A volte sembri troppo buono e qualcuno potrebbe approfittarsene. Devi imparare a dire di no.",
      example: "Sei quello a cui tutti raccontano i segreti. Ti cercano quando stanno male perché sanno che li ascolterai.",
      advice: "Fai vedere anche la tua forza. Chi ti vuole bene davvero rispetta anche i tuoi no.",
    },
    quintessenza: {
      synthesis: "Dai il meglio di te quando unisci le persone e crei armonia intorno a te.",
      gifts: "Sai costruire ponti tra persone diverse e trasformare le differenze in ricchezza.",
      challenge: "A forza di aiutare tutti, rischi di dimenticarti di te. Trovare il tuo equilibrio è la lezione più importante.",
      example: "Sei come chi crea un gruppo dove persone diverse si capiscono e collaborano. Fai da collante.",
      advice: "Sei la colla che tiene insieme le cose. Ma ricorda: anche la colla ha bisogno di cura.",
    },
  },
  3: {
    destino: {
      synthesis: "Il numero di chi sa comunicare, creare e portare gioia nella vita degli altri.",
      gifts: "Hai un entusiasmo che contagia tutti, sai parlare bene, hai talento per l'arte e la creatività, e fai amicizia facilmente.",
      challenge: "Rischi di iniziare mille cose senza finirne nessuna. A volte usi le battute per non affrontare i problemi seri.",
      example: "Pensa all'artista che riesce a far emozionare la gente con le sue opere. O a chi sa spiegare le cose difficili in modo semplice e divertente.",
      advice: "La tua creatività è come un fiume: se non gli dai una direzione, si disperde. Scegli una cosa e dedicati con tutto te stesso: i risultati ti sorprenderanno.",
    },
    io: {
      synthesis: "Ti esprimi con vivacità e carisma. La gente ti ascolta volentieri perché sai comunicare.",
      gifts: "Sai raccontare, intrattenere e far ridere. Hai una creatività naturale e la gente è attratta dalla tua energia.",
      challenge: "A volte sembri poco serio o dispersivo. Devi imparare a dare sostanza a quello che dici.",
      example: "Sei quello che cattura l'attenzione di tutti con una storia. Trasformi ogni discorso in qualcosa di interessante.",
      advice: "Le parole hanno un potere enorme: usale per far crescere gli altri, non solo per far divertire.",
    },
    anima: {
      synthesis: "Dentro di te vuoi esprimerti, essere unico e goderti la bellezza della vita.",
      gifts: "Hai una creatività interiore naturale, sei ottimista, ami le cose belle e sai trovare la gioia nelle piccole cose.",
      challenge: "Il bisogno che gli altri ti apprezzino può portarti a nascondere quello che senti veramente. A volte usi la leggerezza per scappare dal dolore.",
      example: "Sei quello che si sente davvero vivo solo quando crea qualcosa. Trovi poesia anche nelle cose più semplici.",
      advice: "Non devi sempre essere il sole della festa. Anche la pioggia serve per far crescere i fiori: lascia che anche le emozioni difficili ti attraversino.",
    },
    personalita: {
      synthesis: "La gente ti vede come una persona solare, simpatica e piena di vita.",
      gifts: "Porti il buon umore ovunque vai. Hai il dono di alleggerire le situazioni pesanti e di far sorridere.",
      challenge: "A volte sembri poco serio e la gente potrebbe non prendere sul serio la tua profondità.",
      example: "Sei quello che viene invitato a tutte le feste perché sa creare l'atmosfera giusta. Porti luce ovunque arrivi.",
      advice: "Fai vedere anche il tuo lato profondo. Le amicizie più belle nascono quando ti mostri per quello che sei davvero.",
    },
    quintessenza: {
      synthesis: "Dai il meglio di te quando comunichi in modo creativo e porti gioia alle persone.",
      gifts: "Sai trasformare le idee in qualcosa che tocca il cuore della gente. La tua creatività ha un messaggio forte.",
      challenge: "Avere troppe idee e poca disciplina può bloccarti. Devi scegliere su cosa concentrarti.",
      example: "Sei come l'artista che riesce a cambiare il modo in cui le persone vedono le cose, usando la bellezza e le parole.",
      advice: "Hai il dono di far brillare le cose. Scegli cosa illuminare e dedicaci tutta la tua energia.",
    },
  },
  4: {
    destino: {
      synthesis: "Il numero di chi costruisce cose solide, con pazienza e metodo.",
      gifts: "Sei affidabile, costante e concreto. Sai costruire cose che durano nel tempo, passo dopo passo.",
      challenge: "A volte sei troppo rigido e hai paura dei cambiamenti. Ti attacchi alle abitudini e fai fatica ad accettare le novità.",
      example: "Pensa a chi costruisce una casa mattone dopo mattone. O al genitore che crea un ambiente sicuro per i figli. Chi costruisce un'azienda con pazienza e costanza.",
      advice: "Le fondamenta migliori sono quelle che sanno piegarsi. Un albero resiste alla tempesta perché è flessibile, non perché è rigido.",
    },
    io: {
      synthesis: "Ti esprimi con ordine, precisione e sai organizzare le cose come nessun altro.",
      gifts: "Sei affidabile, sai pianificare, curi i dettagli e ti esprimi in modo chiaro e concreto.",
      challenge: "A volte sembri troppo rigido o prevedibile. Devi dare spazio anche alla parte spontanea di te.",
      example: "Sei quello che trasforma il caos in ordine senza fatica. Tutti ti cercano quando serve un piano preciso.",
      advice: "L'ordine è il tuo superpotere, ma ogni tanto lasciati sorprendere dalla vita. Anche l'imprevisto può essere bello.",
    },
    anima: {
      synthesis: "Dentro di te vuoi sicurezza, stabilità e che ogni cosa sia al suo posto.",
      gifts: "Hai una costanza interiore rara, un forte senso del dovere e la pazienza di costruire le cose con calma.",
      challenge: "Il bisogno di controllare tutto può bloccarti. Potresti resistere ai cambiamenti per paura di quello che non conosci.",
      example: "Sei quello che trova pace quando il lavoro è fatto bene. Ti senti a casa quando tutto è in ordine.",
      advice: "La vera sicurezza non viene dalle cose esterne. Impara a sentirti stabile anche quando tutto cambia: è lì che cresci davvero.",
    },
    personalita: {
      synthesis: "La gente ti vede come una persona solida, seria e con i piedi per terra.",
      gifts: "Dai un senso di stabilità a chi ti sta intorno. La gente si fida di te perché sembri sempre preparato.",
      challenge: "A volte sembri noioso o troppo serio. La gente potrebbe non vedere il tuo lato creativo e divertente.",
      example: "Sei quello a cui tutti affidano le cose importanti. Ti scelgono sempre per i compiti più delicati.",
      advice: "Ogni tanto sorprendi la gente. Mostra il tuo lato giocoso: ti apprezzeranno ancora di più.",
    },
    quintessenza: {
      synthesis: "Dai il meglio di te quando costruisci qualcosa di importante che dura nel tempo.",
      gifts: "Sai dare una forma concreta alle idee e trasformare i sogni in cose reali e solide.",
      challenge: "Voler fare tutto perfetto può bloccarti. Non aspettare che sia tutto a posto per partire.",
      example: "Sei come chi costruisce cose che restano nel tempo e che servono a tante persone.",
      advice: "Costruisci con amore, non solo con metodo. Le cose che durano di più sono quelle in cui metti il cuore.",
    },
  },
  5: {
    destino: {
      synthesis: "Il numero di chi ama il cambiamento, la libertà e vivere tante esperienze diverse.",
      gifts: "Ti adatti a tutto, sei curioso, versatile, hai il coraggio di esplorare e sai reinventarti quando serve.",
      challenge: "Rischi di essere instabile e di esagerare. Potresti scappare dalle responsabilità inseguendo sempre qualcosa di nuovo.",
      example: "Pensa a chi impara più viaggiando che stando sui libri. O a chi cambia lavoro per seguire la sua passione. Chi trasforma ogni problema in un'opportunità.",
      advice: "La vera libertà non è scappare, ma scegliere con coscienza dove restare. Trova la tua stabilità anche nel movimento.",
    },
    io: {
      synthesis: "Ti esprimi con energia, sei sempre in movimento e ti attira tutto ciò che è nuovo.",
      gifts: "Ti adatti facilmente, comunichi con vivacità, sai cogliere le occasioni al volo e hai un'energia contagiosa.",
      challenge: "A volte sembri incostante o poco affidabile. Devi imparare a finire quello che inizi.",
      example: "Sei quello che si sente a casa ovunque. Trasformi ogni esperienza in una storia avvincente.",
      advice: "Si può andare in profondità anche restando fermi. Non tutto quello che luccica è oro: scegli con attenzione.",
    },
    anima: {
      synthesis: "Dentro di te vuoi libertà, avventura e la possibilità di provare tutto nella vita.",
      gifts: "Hai uno spirito libero, una gran sete di esperienze, la mente aperta e ti entusiasmi per le novità.",
      challenge: "Il tuo bisogno di libertà può impedirti di impegnarti davvero. Potresti scappare proprio quando le cose diventano serie.",
      example: "Sei quello che si sente soffocare dalla routine. Hai bisogno di sentire l'aria fresca in faccia per sentirti vivo.",
      advice: "L'avventura più grande è conoscerti. Non devi andare lontano per trovare quello che cerchi.",
    },
    personalita: {
      synthesis: "La gente ti vede come una persona energica, affascinante e piena di sorprese.",
      gifts: "Hai un fascino naturale, dai l'idea di libertà e avventura, e attrai la gente con la tua freschezza.",
      challenge: "A volte sembri superficiale o sfuggente. La gente potrebbe fare fatica a fidarsi della tua costanza.",
      example: "Sei quello che tutti vorrebbero come compagno di viaggio. Porti una ventata di novità ovunque arrivi.",
      advice: "Sii affascinante ma anche affidabile. La gente ha bisogno di sapere che può contare su di te.",
    },
    quintessenza: {
      synthesis: "Dai il meglio di te quando porti cambiamenti positivi e rinnovi le cose.",
      gifts: "Sai portare aria nuova dove serve e vedi possibilità dove gli altri vedono muri.",
      challenge: "L'irrequietezza può rovinare quello che costruisci. Impara a restare abbastanza per raccogliere i frutti.",
      example: "Sei come chi riesce a cambiare un intero ambiente con la sua energia e la sua voglia di novità.",
      advice: "Il cambiamento più forte è quello che nasce dalla consapevolezza, non dalla fuga.",
    },
  },
  6: {
    destino: {
      synthesis: "Il numero di chi si prende cura degli altri, ama la famiglia e cerca armonia in tutto.",
      gifts: "Sai proteggere e curare chi ami, crei bellezza e armonia intorno a te, hai un grande senso di responsabilità e un occhio per le cose belle.",
      challenge: "Rischi di sacrificarti troppo per gli altri e di confondere l'amore con il controllo. Potresti sentirti in colpa se non riesci ad aiutare tutti.",
      example: "Pensa al genitore che crea un ambiente sicuro senza soffocare. O a chi dedica la vita a rendere il mondo un posto più bello e giusto.",
      advice: "Non puoi dare acqua agli altri se il tuo bicchiere è vuoto. Prenditi cura di te con la stessa attenzione che dedichi agli altri.",
    },
    io: {
      synthesis: "Ti esprimi con calore e sai far sentire le persone amate e protette.",
      gifts: "Sai creare armonia, hai talento artistico, ti esprimi con amore e hai un bel senso estetico.",
      challenge: "A volte sembri troppo appiccicoso o protettivo. Devi imparare ad amare senza controllare.",
      example: "Sei quello che trasforma ogni posto in un luogo accogliente. Con la tua presenza fai sentire tutti importanti.",
      advice: "L'amore più grande è quello che lascia liberi. Vuoi bene senza togliere libertà a chi ami.",
    },
    anima: {
      synthesis: "Dentro di te vuoi amore, bellezza e la possibilità di prenderti cura di chi ti sta intorno.",
      gifts: "Sai amare senza condizioni, hai un senso della bellezza naturale, crei armonia e ti dedichi con tutto il cuore.",
      challenge: "Il bisogno di sentirti necessario può creare dipendenza. Potresti confondere il sacrificio con l'amore.",
      example: "Sei quello che vuole rendere bello ogni dettaglio. Ti illumini quando puoi prenderti cura di qualcuno.",
      advice: "Vuoi bene a te stesso come vuoi bene agli altri. La bellezza che cerchi fuori è già dentro di te.",
    },
    personalita: {
      synthesis: "La gente ti vede come una persona calda, responsabile e con buon gusto.",
      gifts: "Quando ci sei tu, la gente si sente al sicuro. Dai l'idea di essere affidabile e premuroso.",
      challenge: "A volte sembri troppo protettivo. La gente potrebbe sentirsi soffocata dalle tue attenzioni.",
      example: "Sei quello che organizza tutto per far stare bene gli altri. Ti scelgono sempre come confidente.",
      advice: "Lascia che gli altri facciano i propri errori. Si cresce attraverso l'esperienza, non attraverso la protezione.",
    },
    quintessenza: {
      synthesis: "Dai il meglio di te quando ami con consapevolezza e crei bellezza intorno a te.",
      gifts: "Sai trasformare gli ambienti e le relazioni grazie al tuo amore e alla tua cura.",
      challenge: "Volere tutto perfetto nelle relazioni può impedirti di accettare le imperfezioni della vita.",
      example: "Sei come chi crea una comunità dove le persone si sentono amate e rispettate.",
      advice: "La perfezione non esiste, ma la bellezza sì. La trovi proprio nelle imperfezioni: è lì che sta la magia.",
    },
  },
  7: {
    destino: {
      synthesis: "Il numero di chi pensa in profondità, cerca risposte e vuole capire il senso delle cose.",
      gifts: "Sai analizzare, pensi in modo profondo, hai una grande intuizione e cerchi sempre la verità.",
      challenge: "Rischi di isolarti dal mondo e chiuderti nella tua testa. Potresti diventare diffidente e fare fatica a fidarti degli altri.",
      example: "Pensa al ricercatore che dedica la vita a capire come funzionano le cose. O al filosofo che fa domande che nessuno si pone. Chi trova risposte dove gli altri non cercano.",
      advice: "La cosa più bella che puoi fare con quello che sai è condividerlo. Non aver paura di aprirti: la saggezza cresce quando la regali.",
    },
    io: {
      synthesis: "Ti esprimi con poche parole ma piene di significato. Vai sempre al cuore delle cose.",
      gifts: "Pensi in modo profondo, vai oltre le apparenze, e quando parli dici cose che contano davvero.",
      challenge: "A volte sembri distante o superiore. Devi imparare a spiegare le tue idee in modo semplice e accessibile.",
      example: "Sei quello che con due parole centra il punto. Tutti ti chiedono un parere perché vedono le cose in modo diverso da te.",
      advice: "Non tutto si capisce con la testa. Ogni tanto lascia spazio al cuore e alla pancia.",
    },
    anima: {
      synthesis: "Dentro di te vuoi capire, cercare la verità e avere momenti di pace e silenzio.",
      gifts: "Hai un'intuizione profonda, cerchi sempre un significato, sai stare in silenzio e hai una ricerca interiore naturale.",
      challenge: "Il bisogno di stare solo può diventare isolamento. Potresti usare la testa come scudo per non sentire le emozioni.",
      example: "Sei quello che ha bisogno di silenzio per ricaricarsi. Trovi pace quando puoi pensare e riflettere in tranquillità.",
      advice: "La verità che cerchi non è solo nei libri. A volte la risposta arriva quando smetti di cercarla e ti lasci andare.",
    },
    personalita: {
      synthesis: "La gente ti vede come una persona misteriosa, intelligente e che sa molte cose.",
      gifts: "Hai un'aria interessante, la gente ti rispetta e vorrebbe sapere cosa pensi davvero.",
      challenge: "A volte sembri freddo o impossibile da avvicinare. La gente potrebbe sentirsi a disagio con te.",
      example: "Sei quello di cui tutti vorrebbero conoscere i pensieri. Attrai le persone per la tua profondità e il tuo mistero.",
      advice: "Lasciati conoscere. Le persone che meritano il tuo tempo apprezzeranno la tua verità più del tuo mistero.",
    },
    quintessenza: {
      synthesis: "Dai il meglio di te quando cerchi la verità e la condividi con gli altri.",
      gifts: "Sai andare a fondo nelle cose e trasformare quello che impari in consigli utili per tutti.",
      challenge: "Pensare troppo può bloccarti. A volte bisogna agire prima di aver capito tutto.",
      example: "Sei come il maestro che trasforma la sua ricerca in insegnamenti semplici che cambiano la vita della gente.",
      advice: "La saggezza più grande è sapere che non sai tutto. Resta curioso e umile: la verità si mostra a chi è aperto.",
    },
  },
  8: {
    destino: {
      synthesis: "Il numero di chi sa gestire il potere, i soldi e le risorse con forza e visione.",
      gifts: "Sai guidare le persone, hai fiuto per gli affari, sei determinato e hai una visione chiara di dove vuoi arrivare.",
      challenge: "Rischi di pensare solo ai soldi e al successo, diventando duro con gli altri. Potresti usare il potere per controllare invece che per aiutare.",
      example: "Pensa a chi costruisce un'azienda di successo con onestà. O a chi usa le proprie risorse per fare del bene alla comunità. Chi crea ricchezza per sé e per gli altri.",
      advice: "Il vero potere non è quello che usi sugli altri, ma quello che usi su te stesso. Usa quello che hai con onestà e il successo durerà per sempre.",
    },
    io: {
      synthesis: "Ti esprimi con autorità e ambizione. Sai gestire persone e situazioni con sicurezza.",
      gifts: "Hai una visione chiara, sai organizzare, trasmetti forza e competenza, e hai un talento naturale per gestire le cose.",
      challenge: "A volte sembri troppo ambizioso o calcolatore. Devi far vedere anche il tuo lato umano e gentile.",
      example: "Sei quello che trasforma ogni situazione in un'opportunità. Vedi il potenziale dove gli altri vedono problemi.",
      advice: "Il successo senza un significato è vuoto. Chiediti sempre: per chi e per cosa sto lavorando?",
    },
    anima: {
      synthesis: "Dentro di te vuoi abbondanza, riconoscimento e lasciare un segno nel mondo.",
      gifts: "Hai un'ambizione sana, un forte senso di giustizia, vuoi fare cose eccellenti e hai una forza interiore enorme.",
      challenge: "Il bisogno di successo può renderti dipendente dal giudizio degli altri. Potresti confondere il tuo valore con i tuoi risultati.",
      example: "Sei quello che sente di essere nato per fare qualcosa di grande. Non ti accontenti mai della mediocrità.",
      advice: "Tu non sei i tuoi risultati. Il tuo valore non dipende da quello che possiedi o raggiungi. Vali per quello che sei.",
    },
    personalita: {
      synthesis: "La gente ti vede come una persona potente, ambiziosa e capace di grandi cose.",
      gifts: "Hai una presenza forte, dai l'idea di successo e competenza, e la gente si fida delle tue capacità.",
      challenge: "A volte fai un po' paura. La gente potrebbe temere di non essere all'altezza delle tue aspettative.",
      example: "Sei quello che tutti vorrebbero come socio. Trasmetti un'energia di determinazione e successo.",
      advice: "Fai vedere anche la tua generosità. Le persone più forti sono quelle che usano il loro potere per aiutare gli altri.",
    },
    quintessenza: {
      synthesis: "Dai il meglio di te quando crei abbondanza in modo onesto e generoso.",
      gifts: "Sai trasformare le idee in cose concrete e creare ricchezza che fa del bene a tutti.",
      challenge: "La tentazione di usare il potere solo per te stesso è la tua prova più grande. Devi trovare l'equilibrio tra avere e dare.",
      example: "Sei come chi costruisce aziende che creano valore per le persone, non solo profitto.",
      advice: "Il potere più grande è quello di fare del bene su larga scala. Usa le tue capacità per servire, non solo per accumulare.",
    },
  },
  9: {
    destino: {
      synthesis: "Il numero di chi ha un cuore grande, capisce il dolore degli altri e vuole lasciare il mondo un posto migliore.",
      gifts: "Sai perdonare, vedi le cose dall'alto, hai una saggezza che viene dall'esperienza e dai senza aspettarti niente in cambio.",
      challenge: "Rischi di caricarti i problemi di tutti sulle spalle. Potresti farti vittima o sprecare le tue energie cercando di aggiustare tutto senza curarti di te.",
      example: "Pensa al dottore che va a curare le persone in zone di guerra. O al nonno che insegna ai nipoti valori che durano per sempre. Chi perdona anche quando è difficile, perché capisce che siamo tutti fragili.",
      advice: "Non puoi salvare il mondo se prima non stai bene tu. Impara a lasciar andare le cose che non puoi cambiare: la vera saggezza è sapere cosa vale la pena tenere.",
    },
    io: {
      synthesis: "Ti esprimi con umanità e generosità. Hai una vocazione naturale ad aiutare gli altri.",
      gifts: "Vedi il quadro grande, sai ispirare compassione, e hai il talento di far sentire le persone capite e accolte.",
      challenge: "A volte sembri distaccato o troppo idealista. Devi restare con i piedi per terra anche quando sogni in grande.",
      example: "Sei quello che tocca il cuore delle persone con le parole e con i fatti. Ispiri gli altri a diventare persone migliori.",
      advice: "Non devi essere perfetto per fare la differenza. Anche un piccolo gesto di gentilezza può cambiare la giornata di qualcuno.",
    },
    anima: {
      synthesis: "Dentro di te vuoi fare qualcosa di buono per il mondo e aiutare l'umanità a crescere.",
      gifts: "Hai una compassione profonda, una saggezza dell'anima, sai perdonare e ami le persone in modo universale.",
      challenge: "Il bisogno di salvare gli altri può farti dimenticare te stesso. Potresti sentirti responsabile del dolore di tutti.",
      example: "Sei quello che sente un legame profondo con tutta l'umanità. Piangi per le ingiustizie anche quando non ti riguardano.",
      advice: "Aiutare non vuol dire sacrificarsi. Fai più bene al mondo quando sei in equilibrio e stai bene tu per primo.",
    },
    personalita: {
      synthesis: "La gente ti vede come una persona saggia, dal cuore grande e che capisce tutti.",
      gifts: "Hai una presenza calda, la gente si sente accolta da te, e dai l'idea di essere una persona profonda e comprensiva.",
      challenge: "A volte sembri troppo lontano o in un altro mondo. La gente potrebbe vederti come irraggiungibile.",
      example: "Sei quello che tutti rispettano per la sua onestà. Ti cercano perché sai capire senza giudicare.",
      advice: "Sii presente nella vita di tutti i giorni, non solo nelle grandi idee. La gente ha bisogno della tua umanità, non della tua perfezione.",
    },
    quintessenza: {
      synthesis: "Dai il meglio di te quando aiuti gli altri con consapevolezza e trasformi il dolore in saggezza.",
      gifts: "Sai trovare il significato profondo in ogni esperienza e guidare gli altri nei momenti di cambiamento.",
      challenge: "Il rischio è di sognare in grande senza fare niente di concreto. La saggezza senza azione non serve a nessuno.",
      example: "Sei come il maestro che ha attraversato le difficoltà della vita e ne ha tirato fuori lezioni che condivide con tutti.",
      advice: "La tua saggezza è il tuo dono più prezioso. Non tenerla per te: il mondo ha bisogno della tua luce.",
    },
  },
};

// Master numbers
templateDescriptions[11] = {
  destino: {
    synthesis: "Il numero maestro di chi ha una visione speciale, un'intuizione fuori dal comune e una sensibilità molto forte.",
    gifts: "Hai un sesto senso fortissimo, sai ispirare gli altri, sei molto sensibile e vedi cose che le altre persone non vedono.",
    challenge: "Vivi una tensione tra il mondo pratico e quello interiore. Puoi soffrire di ansia, sentirti troppo sensibile e pensare di non essere all'altezza della tua missione.",
    example: "Pensa a chi vede le cose prima degli altri e sa dove andrà il futuro. O all'artista che crea opere che sembrano venire da un altro mondo. A chi risveglia la coscienza delle persone.",
    advice: "Non devi portare questo peso da solo. Il tuo dono è come un canale: fai passare la luce, non la trattenere. Tieni i piedi per terra mentre guardi il cielo: la tua visione ha bisogno di basi solide.",
  },
  io: {
    synthesis: "Ti esprimi come una fonte di ispirazione, con una sensibilità e un'intuizione speciali.",
    gifts: "Sai ispirare le persone in profondità, la tua intuizione guida tutto quello che fai, e hai una sensibilità artistica fuori dal comune.",
    challenge: "Essere così sensibile può farti soffrire. La sfida è esprimere la tua visione senza farti travolgere.",
    example: "Sei quello che con le parole o i gesti tocca corde profonde nella gente. Il tuo lavoro sembra venire da una fonte speciale.",
    advice: "Sei un faro: la tua luce guida gli altri. Ma ricordati di riposare e di prenderti cura della tua fiamma.",
  },
  anima: {
    synthesis: "Dentro di te sei guidato da una visione più grande e dal bisogno di illuminare il cammino degli altri.",
    gifts: "Hai un'intuizione quasi magica, una sensibilità rara, un legame con qualcosa di più grande e la capacità di sentire cose invisibili.",
    challenge: "La tua sensibilità estrema può renderti fragile davanti all'energia degli altri. Potresti sentirti un pesce fuor d'acqua in questo mondo.",
    example: "Sei quello che percepisce cose che gli altri non vedono. Hai sogni che si avverano o intuizioni che si rivelano sempre giuste.",
    advice: "Il tuo dono è reale, non sei strano. Impara a proteggere la tua energia e a scegliere con chi condividere quello che vedi.",
  },
  personalita: {
    synthesis: "La gente ti vede come una persona speciale, intensa e con una luce particolare.",
    gifts: "Hai una presenza magnetica, ispiri le persone e dai l'idea di avere una profondità e una sensibilità uniche.",
    challenge: "A volte sembri troppo intenso o diverso. La gente potrebbe non capire la tua profondità.",
    example: "Sei quello che quando entra in una stanza cambia l'atmosfera. Ispiri gli altri semplicemente con la tua presenza.",
    advice: "Non tutti capiranno la tua luce, e va bene così. Circondati di persone che vedono il tuo valore.",
  },
  quintessenza: {
    synthesis: "Dai il meglio di te quando illumini gli altri con la tua visione e la tua intuizione.",
    gifts: "Sai trasformare l'ispirazione in qualcosa di concreto e utile, e hai il talento di risvegliare il potenziale nascosto delle persone.",
    challenge: "La tensione tra quello che vedi e la realtà può stancarti. Trova il modo di portare le tue intuizioni nel mondo reale.",
    example: "Sei come il maestro-visionario che trasforma le sue intuizioni in insegnamenti semplici che cambiano la vita della gente.",
    advice: "La tua visione è un dono per il mondo. Non lasciarla morire nell'indecisione: agisci con coraggio.",
  },
};

templateDescriptions[22] = {
  destino: {
    synthesis: "Il numero maestro del grande costruttore: chi è capace di realizzare progetti enormi che durano nel tempo.",
    gifts: "Hai una visione grandiosa, sai trasformare le grandi idee in cose concrete, sei un leader che trasforma, e sai unire i sogni con la pratica.",
    challenge: "Senti una pressione enorme, sia da te stesso che dagli altri. Potresti crollare sotto il peso delle aspettative o vivere in piccolo per paura della tua stessa grandezza.",
    example: "Pensa a chi fonda un'organizzazione che cambia le regole del gioco. O a chi crea sistemi che migliorano la vita di tantissime persone. Chi costruisce ponti tra l'impossibile e il possibile.",
    advice: "Sei nato per costruire qualcosa di grande, ma non devi farlo tutto in una volta. Ogni cattedrale è stata costruita una pietra alla volta. Inizia, e il progetto prenderà forma da solo.",
  },
  io: {
    synthesis: "Ti esprimi come un costruttore di visioni: sai trasformare l'impossibile in realtà.",
    gifts: "Vedi il progetto completo nella tua mente e lo realizzi passo dopo passo. Unisci il sogno con la pratica.",
    challenge: "La grandezza della tua visione può paralizzarti. La sfida è iniziare anche quando il traguardo sembra impossibile.",
    example: "Sei quello che riesce a presentare un'idea enorme in modo così concreto che tutti vogliono farne parte.",
    advice: "Non sottovalutare il potere del primo passo. Ogni grande opera inizia con un singolo gesto di coraggio.",
  },
  anima: {
    synthesis: "Dentro di te vuoi lasciare qualcosa di concreto che duri più a lungo di te.",
    gifts: "Pensi a lungo termine, sai pensare in grande e hai la determinazione di costruire qualcosa che serve al bene di tutti.",
    challenge: "Il peso della tua missione può schiacciarti. Potresti sentirti non all'altezza di quello che sei chiamato a fare.",
    example: "Sei quello che sente di avere una missione più grande di sé. Non riesci ad accontentarti di una vita normale.",
    advice: "Non devi essere perfetto per iniziare. Il mondo ha bisogno delle tue costruzioni imperfette più della tua perfezione ferma.",
  },
  personalita: {
    synthesis: "La gente ti vede come una persona visionaria ma concreta, capace di cose grandi.",
    gifts: "Hai una presenza autorevole, dai l'idea di essere competente e visionario, e la gente si fida dei tuoi grandi progetti.",
    challenge: "A volte sembri troppo ambizioso o distante. La gente potrebbe sentirsi piccola davanti a te.",
    example: "Sei quello che quando parla di un progetto fa credere a tutti che sia possibile. Ispiri fiducia anche nelle imprese più difficili.",
    advice: "Coinvolgi gli altri nella tua visione. I grandi costruttori non costruiscono da soli: sanno ispirare e far lavorare tutti insieme.",
  },
  quintessenza: {
    synthesis: "Dai il meglio di te quando realizzi cose concrete che servono a tante persone.",
    gifts: "Hai un talento unico nel trasformare i sogni in cose reali, e sai costruire cose che durano per le generazioni future.",
    challenge: "La perfezione è nemica del bene. Non aspettare le condizioni ideali: costruisci con quello che hai.",
    example: "Sei come chi crea organizzazioni, sistemi o opere che cambiano le regole del gioco per chi verrà dopo.",
    advice: "Sei il ponte tra il cielo e la terra. La tua missione è rendere concreto quello che gli altri possono solo sognare.",
  },
};

templateDescriptions[33] = {
  destino: {
    synthesis: "Il numero maestro dell'amore per tutti: una guida amorevole che dedica la vita agli altri.",
    gifts: "Ami senza condizioni, sai curare le ferite degli altri, guidi con dolcezza, ti dedichi al servizio e ispiri le persone a livello profondo.",
    challenge: "Rischi di sacrificarti completamente per gli altri, dimenticando che anche tu hai bisogno di essere curato. Potresti annullarti nel tentativo di aiutare tutti.",
    example: "Pensa al maestro che dedica la vita a far crescere gli altri. O a chi rinuncia ai propri interessi per un bene più grande. Alla persona che diventa un punto di riferimento per un'intera comunità.",
    advice: "L'amore per tutti inizia dall'amore per te stesso. Non puoi illuminare il mondo se la tua luce si è spenta. Prenditi cura di te con la stessa dolcezza che dai agli altri.",
  },
  io: {
    synthesis: "Ti esprimi come una guida amorevole che sa ispirare cambiamento attraverso la gentilezza.",
    gifts: "Sai curare con la tua sola presenza, esprimi un amore che va oltre il personale, e guidi le persone con dolcezza.",
    challenge: "Sacrificarti troppo può consumarti. La sfida è servire gli altri senza annullarti.",
    example: "Sei quello che con la sola presenza porta pace e guarigione. Il tuo amore trasforma chi ti sta intorno.",
    advice: "Aiuta con gioia, non con sacrificio. L'amore dato per obbligo non è amore, è una catena.",
  },
  anima: {
    synthesis: "Dentro di te vuoi amare e servire le persone con tutto quello che hai.",
    gifts: "Hai un amore immenso, una compassione senza limiti, e la capacità di vedere il bello in ogni persona.",
    challenge: "Potresti annullarti completamente per gli altri. Il confine tra dedizione e sacrificio è sottile.",
    example: "Sei quello che sente il dolore del mondo come se fosse suo. Non riesci a voltare le spalle a nessuno.",
    advice: "Anche i grandi maestri hanno bisogno di riposare. Il tuo amore è più forte quando nasce da un cuore pieno, non vuoto.",
  },
  personalita: {
    synthesis: "La gente ti vede come una persona luminosa, piena d'amore e che ispira tutti.",
    gifts: "La tua presenza cura, dai l'idea di essere saggio e pieno di compassione, e fai sentire tutti amati.",
    challenge: "A volte sembri troppo buono o ingenuo. Qualcuno potrebbe approfittare della tua generosità.",
    example: "Sei quello la cui presenza porta pace in ogni stanza. Ispiri gli altri a diventare più gentili.",
    advice: "La tua bontà non è debolezza. Ma impara a riconoscere chi merita davvero la tua energia.",
  },
  quintessenza: {
    synthesis: "Dai il meglio di te quando il tuo amore trasforma le cose e guidi gli altri con il cuore.",
    gifts: "Sai trasformare la sofferenza in saggezza e l'amore in una forza che cura tutti.",
    challenge: "Il peso di voler aiutare tutti può schiacciarti. Non sei responsabile della salvezza di ogni persona.",
    example: "Sei come il maestro-guaritore che con la propria vita diventa esempio di amore senza condizioni.",
    advice: "Sei una luce nel mondo. Ma anche la luce ha bisogno di essere alimentata. Prenditi cura della tua fiamma.",
  },
};

// Cycle-specific descriptions per number
const cycleDescriptions: Record<number, NumberTemplateDesc> = {
  1: {
    synthesis: "Un periodo di nuovi inizi: è il momento di fare le cose a modo tuo e prendere il comando.",
    gifts: "Coraggio di iniziare cose nuove, saper stare in piedi da solo, prendere decisioni importanti senza aspettare gli altri.",
    challenge: "Rischi di isolarti o di voler fare tutto da solo. L'egoismo può allontanare le persone che ami.",
    example: "Pensa al periodo in cui cambi lavoro, ti trasferisci o inizi un progetto tutto tuo. Il momento in cui smetti di aspettare il permesso degli altri.",
    advice: "Questo periodo ti chiede di osare. Non aver paura di stare da solo: è nella solitudine giusta che trovi la tua vera forza.",
  },
  2: {
    synthesis: "Un periodo in cui le relazioni contano più di tutto. È il momento di collaborare e avere pazienza.",
    gifts: "Sensibilità verso gli altri, capacità di mettere d'accordo le persone, empatia, saper creare legami veri.",
    challenge: "Potresti diventare troppo dipendente dagli altri o evitare i litigi a tutti i costi, perdendoti nel processo.",
    example: "Pensa al periodo dei matrimoni, delle amicizie profonde, delle collaborazioni importanti che ti cambiano la vita.",
    advice: "Questo periodo ti insegna che la vera forza è nel lavoro di squadra. Impara ad ascoltare, ma non dimenticare la tua voce.",
  },
  3: {
    synthesis: "Un periodo di creatività e comunicazione. È il momento di esprimerti e goderti la vita.",
    gifts: "La creatività fiorisce, sai comunicare meglio che mai, sei socievole e il tuo entusiasmo è contagioso.",
    challenge: "Iniziare mille cose senza finirne nessuna. Troppi stimoli e poca costanza possono bloccarti.",
    example: "Pensa al periodo in cui scopri un talento, inizi a scrivere, dipingere, cantare o ti dedichi a qualcosa che ti rappresenta.",
    advice: "Esprimi quello che senti senza paura. Ma ricorda: la creatività senza costanza resta un sogno nel cassetto.",
  },
  4: {
    synthesis: "Un periodo di costruzione e impegno. È il momento di mettere le basi per qualcosa di solido.",
    gifts: "Costanza, saper organizzare le cose, essere concreto, avere la forza di costruire qualcosa che dura.",
    challenge: "Essere troppo rigido e aver paura dei cambiamenti. Potresti sentirti intrappolato nella routine.",
    example: "Pensa al periodo in cui compri casa, stabilisci la carriera, crei una famiglia stabile o costruisci qualcosa di importante mattone dopo mattone.",
    advice: "Questo periodo richiede pazienza e lavoro costante. Non cercare scorciatoie: quello che costruisci adesso durerà a lungo.",
  },
  5: {
    synthesis: "Un periodo di cambiamento e libertà. Tutto si muove e niente resta uguale.",
    gifts: "Saper adattarsi, coraggio di cambiare, apertura al nuovo, capacità di reinventarsi, tanta energia.",
    challenge: "L'instabilità e la voglia di scappare possono portarti a evitare le responsabilità. Rischi di esagerare con gli eccessi.",
    example: "Pensa ai periodi dei viaggi, dei cambiamenti di lavoro, delle relazioni inaspettate. Tutto si muove e cambia in continuazione.",
    advice: "Abbraccia il cambiamento ma tieni un centro dentro di te. La vera libertà non è scappare, è scegliere con consapevolezza.",
  },
  6: {
    synthesis: "Un periodo dedicato alla famiglia, all'amore e alla cura delle persone che ami.",
    gifts: "Saper prenderti cura degli altri, senso della bellezza, dedizione alla famiglia, creare ambienti belli e accoglienti.",
    challenge: "Sacrificarti troppo e voler controllare tutto può esaurirti. Rischi di dimenticarti completamente di te stesso.",
    example: "Pensa al periodo in cui ti dedichi ai figli, alla famiglia, alla casa. Le relazioni diventano il centro di tutto.",
    advice: "Ama senza perdere te stesso. La cura più importante è quella che dai a te: solo da lì nasce un amore che dura.",
  },
  7: {
    synthesis: "Un periodo di riflessione e crescita interiore. È il momento di rallentare e guardarti dentro.",
    gifts: "Pensiero profondo, intuizione forte, voglia di capire, saggezza che nasce dal fermarsi a riflettere.",
    challenge: "Isolarti troppo e non fidarti di nessuno. Potresti pensare troppo e sentire troppo poco.",
    example: "Pensa al periodo in cui ti ritiri per studiare, meditare, fare terapia o iniziare un cammino di crescita personale.",
    advice: "Questo periodo ti chiede di rallentare e guardare dentro di te. Le risposte che cerchi non sono fuori, sono nel silenzio.",
  },
  8: {
    synthesis: "Un periodo di risultati concreti e successo. È il momento di raccogliere quello che hai seminato.",
    gifts: "Saper gestire le cose, fiuto per gli affari, forza di volontà, determinazione nel raggiungere i tuoi obiettivi.",
    challenge: "Pensare solo ai soldi e al successo può allontanarti dalle persone. Il potere senza cuore fa danni.",
    example: "Pensa al periodo delle promozioni, del successo economico, dei riconoscimenti nel lavoro. È il momento di raccogliere i frutti.",
    advice: "Usa il potere che questo periodo ti dà con saggezza. Il vero successo è quello che fa stare bene anche chi ti sta intorno.",
  },
  9: {
    synthesis: "Un periodo di chiusura e trasformazione. È il momento di lasciar andare e prepararsi a ricominciare.",
    gifts: "Compassione, visione ampia, saper lasciar andare le cose, saggezza che viene dall'esperienza.",
    challenge: "Aggrapparti al passato può impedirti di andare avanti. La nostalgia e il lamentarsi possono bloccarti.",
    example: "Pensa al periodo in cui chiudi relazioni, lavori o fasi della vita che hanno fatto il loro tempo. Fai i conti con il passato e ti prepari al nuovo.",
    advice: "Lascia andare con gratitudine. Ogni fine è un nuovo inizio nascosto. Le cose che sono davvero tue torneranno sempre.",
  },
  11: {
    synthesis: "Un periodo di risveglio interiore, con intuizioni forti e una sensibilità fuori dal comune.",
    gifts: "Intuizione fortissima, sensibilità elevata, capacità di ispirare, connessione con qualcosa di più grande.",
    challenge: "Essere troppo sensibile e teso può renderti fragile. Il peso di quello che senti può sembrare troppo.",
    example: "Pensa al periodo delle rivelazioni interiori, delle coincidenze frequenti, dei sogni significativi. Senti che qualcosa di più grande ti guida.",
    advice: "Non resistere a quello che senti: è il tuo dono. Tieni i piedi per terra con le abitudini quotidiane per sostenere l'intensità di questo periodo.",
  },
  22: {
    synthesis: "Un periodo per costruire qualcosa di grande che avrà un impatto su tante persone.",
    gifts: "Saper realizzare cose che sembrano impossibili, guidare con visione, unire sogni e pratica in modo unico.",
    challenge: "La pressione delle aspettative può schiacciarti. Potresti vivere in piccolo per paura della tua stessa grandezza.",
    example: "Pensa al periodo in cui un progetto importante della tua vita prende forma e ha un impatto che va ben oltre te.",
    advice: "Sei chiamato a costruire qualcosa di grande. Non farti spaventare dalle dimensioni: vai avanti un passo alla volta.",
  },
  33: {
    synthesis: "Un periodo dedicato ad aiutare gli altri con amore e a diventare una guida per chi ti circonda.",
    gifts: "Amore senza condizioni, capacità di curare, guida gentile, ispirazione per le persone intorno a te.",
    challenge: "Sacrificarti troppo e dimenticarti completamente di te. Rischi di dare tutto senza lasciare niente per te.",
    example: "Pensa al periodo in cui diventi un punto di riferimento per gli altri, un maestro, una guida. La gente cerca la tua luce.",
    advice: "Aiuta con amore, ma non dimenticarti di te stesso. La tua luce ha bisogno di essere alimentata.",
  },
};

export function getNumberTemplate(num: number, type: NumberType): NumberTemplateDesc | null {
  const baseNum = num > 9 && ![11, 22, 33].includes(num) ? num % 9 || 9 : num;
  if (type === 'ciclo') {
    return cycleDescriptions[baseNum] || null;
  }
  return templateDescriptions[baseNum]?.[type] || null;
}

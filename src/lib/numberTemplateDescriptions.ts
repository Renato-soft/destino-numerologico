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
  destino: "Si calcola dalla data di nascita (giorno + mese + anno, ridotti ciascuno a cifra singola, poi sommati e ridotti).",
  io: "Si calcola sommando il valore numerico di tutte le lettere del nome completo (tabella pitagorica).",
  anima: "Si calcola sommando il valore numerico delle sole vocali del nome completo.",
  personalita: "Si calcola sommando il valore numerico delle sole consonanti del nome completo.",
  quintessenza: "Si calcola sommando il numero dell'Io e il numero del Destino, riducendo il risultato a cifra singola (eccetto 11 e 22).",
};

export function getCalculationMethod(type: NumberType): string {
  return calculationMethods[type];
}

// Per-type synthesis (what the number represents in that position)
const typeSynthesis: Record<NumberType, string> = {
  destino: "Indica il percorso che emerge man mano che cresci e maturi.",
  io: "Rivela il modo in cui ti esprimi nel mondo e il tuo potenziale naturale.",
  anima: "Svela i desideri più profondi della tua anima e ciò che realmente ti motiva.",
  personalita: "Mostra la maschera che presenti al mondo e come gli altri ti percepiscono.",
  quintessenza: "Rappresenta la sintesi più elevata del tuo potenziale, dove talenti e missione si incontrano.",
};

export function getTypeSynthesis(type: NumberType): string {
  return typeSynthesis[type];
}

// Template descriptions per number (1-9 + 11, 22, 33)
const templateDescriptions: Record<number, Record<NumberType, NumberTemplateDesc>> = {
  1: {
    destino: {
      synthesis: "Il numero dell'indipendenza, del coraggio e della leadership naturale.",
      gifts: "Iniziativa, determinazione, capacità di aprire strade nuove, coraggio nell'agire da soli, spirito pionieristico.",
      challenge: "L'1 rischia di chiudersi nell'egoismo o nell'impulsività. Può voler dominare invece di guidare, oppure avere difficoltà a chiedere aiuto e collaborare.",
      example: "L'imprenditore che parte da zero con un'idea rivoluzionaria. Il leader che prende decisioni difficili quando nessun altro osa. Chi cambia vita senza aspettare il permesso di nessuno.",
      advice: "Guidare non significa controllare. La vera leadership nasce dall'esempio, non dall'imposizione. Impara a delegare e a valorizzare chi ti sta accanto.",
    },
    io: {
      synthesis: "Ti esprimi con autorevolezza e indipendenza, sei un leader naturale.",
      gifts: "Originalità, capacità decisionale, carisma, spirito d'iniziativa, autonomia nel pensiero e nell'azione.",
      challenge: "Potresti sembrare distante o prepotente. La sfida è esprimere la tua forza senza schiacciare gli altri.",
      example: "Chi in ogni gruppo diventa naturalmente il punto di riferimento. La persona a cui tutti chiedono consiglio perché trasmette sicurezza.",
      advice: "Il tuo modo di esprimerti è potente: usalo per ispirare, non per dominare. Le parole gentili hanno più impatto dei comandi.",
    },
    anima: {
      synthesis: "Nel profondo desideri autonomia, verità e la libertà di essere te stesso.",
      gifts: "Coraggio interiore, desiderio di autenticità, forza morale, capacità di stare soli senza sentirsi soli.",
      challenge: "Il bisogno di indipendenza può diventare isolamento. Potresti respingere l'intimità per paura di perdere la tua libertà.",
      example: "Chi sente un fuoco interiore che lo spinge a creare qualcosa di unico. La persona che non riesce a conformarsi perché sente che ha una missione.",
      advice: "Essere forti non significa non aver bisogno di nessuno. Lascia entrare le persone giuste: la vera forza è anche sapersi aprire.",
    },
    personalita: {
      synthesis: "Gli altri ti percepiscono come una persona forte, sicura e determinata.",
      gifts: "Presenza autorevole, immagine di sicurezza, capacità di ispirare fiducia, aspetto deciso e indipendente.",
      challenge: "Potresti sembrare freddo o inaccessibile. Gli altri potrebbero non avvicinarsi per timore della tua intensità.",
      example: "La persona che quando entra in una stanza attira l'attenzione senza dire nulla. Chi viene sempre scelto come leader nei gruppi.",
      advice: "Mostra anche la tua vulnerabilità ogni tanto. Le persone si legano a chi è autentico, non a chi sembra invincibile.",
    },
    quintessenza: {
      synthesis: "La tua massima espressione si trova nell'iniziativa e nella capacità di creare dal nulla.",
      gifts: "Visione pionieristica, capacità di unire talento e missione in azione concreta, leadership ispirata.",
      challenge: "La tensione tra essere e fare può portare a burnout. Devi imparare quando fermarti e quando agire.",
      example: "L'innovatore che trasforma un'idea visionaria in realtà concreta. Chi riesce a unire la propria essenza con l'azione nel mondo.",
      advice: "Il tuo dono più grande è iniziare. Non aspettare la perfezione: il primo passo è sempre il più importante.",
    },
  },
  2: {
    destino: {
      synthesis: "Il numero della collaborazione, della sensibilità e dell'armonia nelle relazioni.",
      gifts: "Empatia, diplomazia, capacità di ascolto profondo, mediazione naturale, sensibilità verso i bisogni altrui.",
      challenge: "Il 2 rischia di perdersi nell'altro, diventando dipendente o insicuro. Può evitare i conflitti a ogni costo, reprimendo i propri bisogni.",
      example: "Il terapeuta che riesce a sentire le emozioni degli altri prima ancora che vengano espresse. Il mediatore che trasforma un conflitto in un'opportunità di crescita.",
      advice: "La tua sensibilità è un dono, non una debolezza. Impara a mettere confini sani: puoi amare senza annullarti.",
    },
    io: {
      synthesis: "Ti esprimi con gentilezza, diplomazia e una naturale capacità di creare armonia.",
      gifts: "Capacità di mediazione, delicatezza nell'espressione, talento nel creare connessioni profonde tra le persone.",
      challenge: "Potresti sembrare indeciso o troppo accomodante. La sfida è esprimere la tua opinione anche quando è scomoda.",
      example: "Chi riesce a far collaborare persone molto diverse tra loro. La persona che con una parola gentile scioglie tensioni che sembravano irrisolvibili.",
      advice: "Non confondere la gentilezza con la debolezza. Dire quello che pensi con rispetto è il più grande atto di amore.",
    },
    anima: {
      synthesis: "Nel profondo desideri pace, connessione autentica e sicurezza emotiva.",
      gifts: "Intuizione emotiva, capacità di creare legami profondi, sensibilità artistica, bisogno di bellezza e armonia.",
      challenge: "Il desiderio di armonia può portarti a evitare ogni conflitto, accumulando frustrazione. Potresti sacrificare i tuoi bisogni per mantenere la pace.",
      example: "Chi sente fisicamente il disagio altrui. La persona che crea ambienti accoglienti dove tutti si sentono a casa.",
      advice: "La pace vera non è assenza di conflitto, ma la capacità di attraversarlo restando centrati. Esprimi ciò che senti.",
    },
    personalita: {
      synthesis: "Gli altri ti vedono come una persona dolce, affidabile e accogliente.",
      gifts: "Presenza rassicurante, immagine di calma e stabilità, capacità di mettere a proprio agio gli altri.",
      challenge: "Potresti sembrare troppo remissivo o privo di opinioni proprie. Gli altri potrebbero approfittare della tua disponibilità.",
      example: "La persona a cui tutti confidano i propri segreti. Chi viene cercato nei momenti difficili perché sa ascoltare.",
      advice: "Mostra anche la tua forza. Le persone che ti rispettano davvero apprezzano anche i tuoi no.",
    },
    quintessenza: {
      synthesis: "La tua massima espressione si trova nella capacità di unire, mediare e creare armonia.",
      gifts: "Talento nel tessere connessioni tra mondi diversi, sensibilità che diventa ponte tra le persone.",
      challenge: "Rischi di perderti nel servizio agli altri dimenticando te stesso. L'equilibrio è la tua lezione più importante.",
      example: "Chi riesce a creare comunità e spazi di incontro dove persone diverse trovano un terreno comune.",
      advice: "Sei il collante che tiene insieme le cose. Ma ricorda: anche il collante ha bisogno di cura.",
    },
  },
  3: {
    destino: {
      synthesis: "Il numero della creatività, della comunicazione e dell'espressione gioiosa.",
      gifts: "Entusiasmo contagioso, talento artistico e comunicativo, capacità di ispirare gioia, socialità naturale.",
      challenge: "Il 3 rischia di disperdersi in mille direzioni senza completare nulla. Può diventare superficiale o usare l'umorismo per evitare la profondità.",
      example: "L'artista che trasforma le emozioni in opere che toccano il cuore. Il comunicatore che sa rendere semplice anche il concetto più complesso.",
      advice: "La tua creatività è un fiume: senza argini si disperde. Scegli un canale e convoglia la tua energia: il risultato ti sorprenderà.",
    },
    io: {
      synthesis: "Ti esprimi con vivacità, carisma e una naturale capacità di comunicare.",
      gifts: "Eloquenza, capacità di intrattenere, creatività nell'espressione, magnetismo sociale.",
      challenge: "Potresti sembrare dispersivo o poco serio. La sfida è dare profondità alla tua comunicazione.",
      example: "Chi riesce a catturare l'attenzione di una stanza intera con una storia. La persona che trasforma ogni presentazione in un'esperienza coinvolgente.",
      advice: "Le parole hanno potere: usa il tuo dono per elevare, non solo per intrattenere.",
    },
    anima: {
      synthesis: "Nel profondo desideri esprimere la tua unicità e celebrare la bellezza della vita.",
      gifts: "Creatività interiore, ottimismo naturale, bisogno di bellezza, gioia spontanea.",
      challenge: "Il bisogno di approvazione può portarti a mascherare il tuo vero sentire. Potresti usare la leggerezza per evitare il dolore.",
      example: "Chi si sente vivo solo quando crea. La persona che trova poesia nelle piccole cose quotidiane.",
      advice: "Non devi essere sempre il sole della stanza. Anche la pioggia nutre il giardino: permetti anche alle emozioni difficili di attraversarti.",
    },
    personalita: {
      synthesis: "Gli altri ti percepiscono come una persona solare, carismatica e divertente.",
      gifts: "Presenza luminosa, capacità di alleggerire l'atmosfera, immagine di positività e creatività.",
      challenge: "Potresti sembrare frivolo o poco affidabile. Gli altri potrebbero non prendere sul serio la tua profondità.",
      example: "La persona che porta il buon umore ovunque vada. Chi viene invitato a ogni evento perché sa creare l'atmosfera giusta.",
      advice: "Mostra anche il tuo lato profondo. Le relazioni più significative nascono dalla vulnerabilità, non dalla performance.",
    },
    quintessenza: {
      synthesis: "La tua massima espressione si trova nella comunicazione creativa e nella capacità di ispirare gioia.",
      gifts: "Talento nel trasformare idee in forme espressive che toccano le persone, creatività al servizio di un messaggio.",
      challenge: "La dispersione è il tuo nemico: troppe idee e poca disciplina possono sabotare il tuo potenziale.",
      example: "L'artista-comunicatore che riesce a cambiare le prospettive delle persone attraverso la bellezza e la parola.",
      advice: "Hai il dono di far brillare le cose. Scegli cosa illuminare e dedicaci la tua energia migliore.",
    },
  },
  4: {
    destino: {
      synthesis: "Il numero della struttura, della stabilità e della costruzione solida.",
      gifts: "Affidabilità, costanza, senso pratico, capacità di costruire basi solide e durature, metodo e disciplina.",
      challenge: "Il 4 rischia di irrigidirsi nelle proprie abitudini e regole. Può temere il cambiamento e resistere all'innovazione per attaccamento alla sicurezza.",
      example: "L'architetto che progetta edifici destinati a durare secoli. Il genitore che crea un ambiente stabile e sicuro per la famiglia. Chi costruisce un'azienda mattone dopo mattone.",
      advice: "Le fondamenta migliori sono flessibili. Un albero con radici profonde resiste alla tempesta perché sa piegarsi, non perché è rigido.",
    },
    io: {
      synthesis: "Ti esprimi con metodo, precisione e una naturale capacità organizzativa.",
      gifts: "Affidabilità, capacità di pianificazione, attenzione ai dettagli, espressione concreta e strutturata.",
      challenge: "Potresti sembrare troppo rigido o prevedibile. La sfida è lasciar spazio alla spontaneità.",
      example: "Chi trasforma il caos in ordine con naturalezza. La persona che tutti cercano quando serve un piano concreto.",
      advice: "La struttura è il tuo superpotere, ma non dimenticare che anche l'improvvisazione ha il suo valore.",
    },
    anima: {
      synthesis: "Nel profondo desideri sicurezza, stabilità e un senso di ordine nella vita.",
      gifts: "Costanza interiore, senso del dovere, capacità di costruire con pazienza, bisogno di solidità.",
      challenge: "Il bisogno di controllo può bloccare la tua crescita. Potresti resistere ai cambiamenti necessari per paura dell'ignoto.",
      example: "Chi trova pace nel lavoro ben fatto. La persona che si sente a casa quando tutto è al suo posto.",
      advice: "La sicurezza vera non viene dall'esterno. Impara a sentirti stabile anche nel cambiamento: è lì che cresci davvero.",
    },
    personalita: {
      synthesis: "Gli altri ti vedono come una persona solida, affidabile e con i piedi per terra.",
      gifts: "Presenza stabile, immagine di competenza e serietà, capacità di trasmettere sicurezza.",
      challenge: "Potresti sembrare noioso o troppo conservatore. Gli altri potrebbero non vedere il tuo lato creativo.",
      example: "La persona a cui tutti affidano le responsabilità importanti. Chi viene scelto per gestire progetti critici.",
      advice: "Sorprendi ogni tanto. Mostra il tuo lato giocoso: le persone ti apprezzeranno ancora di più.",
    },
    quintessenza: {
      synthesis: "La tua massima espressione si trova nella capacità di costruire qualcosa di duraturo e significativo.",
      gifts: "Talento nel dare forma concreta alle visioni, capacità di trasformare le idee in realtà solide.",
      challenge: "Il perfezionismo può paralizzarti. Non aspettare che tutto sia perfetto per agire.",
      example: "Chi riesce a costruire strutture (fisiche o metaforiche) che resistono al tempo e servono la comunità.",
      advice: "Costruisci con amore, non solo con metodo. Le opere che durano sono quelle in cui hai messo il cuore.",
    },
  },
  5: {
    destino: {
      synthesis: "Il numero del cambiamento, della libertà e dell'esperienza diretta della vita.",
      gifts: "Adattabilità, curiosità insaziabile, versatilità, coraggio di esplorare, capacità di reinventarsi.",
      challenge: "Il 5 rischia di cadere nell'instabilità e negli eccessi. Può fuggire dalle responsabilità e dalla routine inseguendo stimoli continui.",
      example: "Il viaggiatore che impara più dalla strada che dai libri. L'imprenditore seriale che reinventa se stesso a ogni stagione. Chi trasforma ogni crisi in un'opportunità.",
      advice: "La vera libertà non è fuggire, ma scegliere consapevolmente dove restare. Trova la stabilità dentro il movimento.",
    },
    io: {
      synthesis: "Ti esprimi con dinamismo, versatilità e una naturale attrazione per il nuovo.",
      gifts: "Capacità di adattamento, comunicazione vivace, talento nel cogliere le opportunità, energia contagiosa.",
      challenge: "Potresti sembrare incostante o inaffidabile. La sfida è portare a termine ciò che inizi.",
      example: "Chi riesce a sentirsi a casa in qualsiasi contesto. La persona che trasforma ogni esperienza in una storia avvincente.",
      advice: "La profondità si trova anche restando fermi. Non tutto ciò che brilla è oro: scegli con discernimento.",
    },
    anima: {
      synthesis: "Nel profondo desideri libertà, avventura e la possibilità di sperimentare tutto.",
      gifts: "Spirito libero, sete di conoscenza esperienziale, apertura mentale, entusiasmo per la novità.",
      challenge: "Il bisogno di libertà può impedirti di impegnarti davvero. Potresti fuggire proprio quando la relazione o il progetto diventa profondo.",
      example: "Chi si sente soffocare dalla routine. La persona che ha bisogno di sentire il vento in faccia per sentirsi viva.",
      advice: "L'avventura più grande è conoscere te stesso. Non devi andare lontano per trovare ciò che cerchi.",
    },
    personalita: {
      synthesis: "Gli altri ti percepiscono come una persona dinamica, affascinante e imprevedibile.",
      gifts: "Presenza magnetica, immagine di avventura e libertà, capacità di attirare con il fascino della novità.",
      challenge: "Potresti sembrare superficiale o sfuggente. Gli altri potrebbero faticare a fidarsi della tua costanza.",
      example: "La persona che tutti vorrebbero come compagno di viaggio. Chi porta una ventata di freschezza ovunque arrivi.",
      advice: "Sii affascinante ma anche affidabile. Le persone hanno bisogno di sapere che possono contare su di te.",
    },
    quintessenza: {
      synthesis: "La tua massima espressione si trova nella capacità di trasformare e rinnovare.",
      gifts: "Talento nel portare cambiamento positivo, capacità di vedere possibilità dove altri vedono limiti.",
      challenge: "L'irrequietezza può sabotare le tue realizzazioni. Impara a restare abbastanza da raccogliere i frutti.",
      example: "Chi riesce a trasformare interi ambienti con la propria energia di rinnovamento e la capacità di ispirare il cambiamento.",
      advice: "Il cambiamento più potente è quello che nasce dalla consapevolezza, non dalla fuga.",
    },
  },
  6: {
    destino: {
      synthesis: "Il numero della responsabilità, dell'amore e dell'armonia familiare.",
      gifts: "Senso di cura e protezione, capacità di creare bellezza e armonia, responsabilità affettiva, senso estetico raffinato.",
      challenge: "Il 6 rischia di sacrificarsi eccessivamente per gli altri, confondendo l'amore con il controllo. Può diventare possessivo o sentirsi in colpa quando non riesce ad aiutare tutti.",
      example: "Il genitore che crea un nido sicuro senza soffocare. L'artista che trasforma gli spazi in luoghi di bellezza. Chi dedica la vita a rendere il mondo più bello e giusto.",
      advice: "Non puoi versare da una tazza vuota. Prenditi cura di te stesso con la stessa dedizione che riservi agli altri: solo così il tuo amore sarà sostenibile.",
    },
    io: {
      synthesis: "Ti esprimi con calore, senso estetico e una naturale vocazione alla cura.",
      gifts: "Capacità di creare armonia, talento artistico, espressione amorevole e protettiva, sensibilità estetica.",
      challenge: "Potresti sembrare invadente o troppo protettivo. La sfida è amare senza controllare.",
      example: "Chi trasforma ogni ambiente in un luogo accogliente. La persona che con la sua presenza fa sentire tutti importanti.",
      advice: "L'amore più grande è quello che lascia liberi. Esprimi la tua cura con rispetto per l'autonomia altrui.",
    },
    anima: {
      synthesis: "Nel profondo desideri amore, bellezza e la possibilità di prenderti cura degli altri.",
      gifts: "Amore incondizionato, senso estetico innato, capacità di creare armonia, dedizione affettiva.",
      challenge: "Il bisogno di essere necessari può portarti a creare dipendenza. Potresti confondere il sacrificio con l'amore.",
      example: "Chi sente il bisogno di rendere bello ogni dettaglio. La persona che si illumina quando può prendersi cura di qualcuno.",
      advice: "Amati come ami gli altri. La bellezza che cerchi fuori è già dentro di te.",
    },
    personalita: {
      synthesis: "Gli altri ti vedono come una persona calda, responsabile e con un forte senso estetico.",
      gifts: "Presenza rassicurante, immagine di affidabilità e calore, capacità di creare atmosfere accoglienti.",
      challenge: "Potresti sembrare troppo materno/paterno o controllante. Gli altri potrebbero sentirsi soffocati dalla tua premura.",
      example: "La persona che organizza tutto per il benessere degli altri. Chi viene sempre scelto come confidente e consigliere.",
      advice: "Lascia che gli altri commettano i propri errori. La crescita passa attraverso l'esperienza, non attraverso la protezione.",
    },
    quintessenza: {
      synthesis: "La tua massima espressione si trova nell'amore consapevole e nella creazione di bellezza.",
      gifts: "Talento nel trasformare gli ambienti e le relazioni attraverso l'amore e la cura, visione estetica elevata.",
      challenge: "Il perfezionismo affettivo può impedirti di accettare le imperfezioni della vita e delle persone.",
      example: "Chi riesce a creare comunità basate sull'amore e il rispetto, trasformando gli spazi in luoghi di guarigione.",
      advice: "La perfezione non esiste, ma la bellezza sì. Trova la bellezza nell'imperfezione: è lì che risiede la magia.",
    },
  },
  7: {
    destino: {
      synthesis: "Il numero dell'introspezione, della ricerca interiore e della conoscenza profonda.",
      gifts: "Capacità analitica, profondità di pensiero, intuizione, ricerca della verità, saggezza naturale.",
      challenge: "Il 7 rischia di isolarsi dal mondo, rifugiandosi nella mente. Può diventare diffidente, cinico o incapace di fidarsi degli altri.",
      example: "Il ricercatore che dedica la vita a comprendere i misteri dell'esistenza. Il filosofo che illumina con le sue riflessioni. Chi trova risposte che altri non sanno nemmeno cercare.",
      advice: "La conoscenza più preziosa è quella che si condivide. Non temere di aprirti: la saggezza cresce quando viene donata.",
    },
    io: {
      synthesis: "Ti esprimi con profondità, riservatezza e una naturale tendenza all'analisi.",
      gifts: "Pensiero profondo, capacità di andare oltre la superficie, espressione ponderata e significativa.",
      challenge: "Potresti sembrare distante o altezzoso. La sfida è comunicare le tue intuizioni in modo accessibile.",
      example: "Chi con poche parole riesce a cogliere l'essenza delle cose. La persona che tutti consultano per avere una prospettiva diversa.",
      advice: "Non tutto può essere compreso con la mente. Lascia spazio anche al cuore e all'esperienza diretta.",
    },
    anima: {
      synthesis: "Nel profondo desideri comprensione, solitudine creativa e verità.",
      gifts: "Intuizione profonda, bisogno di significato, capacità di meditazione, ricerca spirituale innata.",
      challenge: "Il bisogno di solitudine può diventare isolamento. Potresti usare l'intelletto come scudo per non sentire le emozioni.",
      example: "Chi ha bisogno di momenti di silenzio per ricaricarsi. La persona che trova pace nella contemplazione e nello studio.",
      advice: "La verità che cerchi non è solo nei libri. A volte la risposta arriva quando smetti di cercarla.",
    },
    personalita: {
      synthesis: "Gli altri ti percepiscono come una persona misteriosa, intelligente e riservata.",
      gifts: "Presenza enigmatica, immagine di profondità e saggezza, capacità di ispirare rispetto e curiosità.",
      challenge: "Potresti sembrare freddo o inaccessibile. Gli altri potrebbero sentirsi intimiditi dalla tua intensità intellettuale.",
      example: "La persona di cui tutti vorrebbero conoscere i pensieri. Chi attrae per la sua aura di mistero e profondità.",
      advice: "Lasciati conoscere. Le persone che meritano il tuo tempo apprezzeranno la tua autenticità più del tuo mistero.",
    },
    quintessenza: {
      synthesis: "La tua massima espressione si trova nella ricerca della verità e nella condivisione della saggezza.",
      gifts: "Talento nel penetrare i misteri della vita, capacità di trasformare la conoscenza in saggezza pratica.",
      challenge: "L'eccesso di analisi può paralizzarti. A volte bisogna agire prima di aver capito tutto.",
      example: "Il maestro che trasforma la sua ricerca interiore in insegnamenti che illuminano la vita degli altri.",
      advice: "La saggezza più grande è sapere di non sapere. Resta curioso e umile: la verità si rivela a chi è aperto.",
    },
  },
  8: {
    destino: {
      synthesis: "Il numero del potere, della realizzazione materiale e della gestione delle risorse.",
      gifts: "Capacità di leadership, senso degli affari, determinazione, visione strategica, talento nella gestione del potere.",
      challenge: "L'8 rischia di identificarsi con il successo materiale, diventando duro o materialista. Può usare il potere per controllare invece che per servire.",
      example: "Il manager che costruisce imperi con visione e integrità. L'imprenditore che crea ricchezza per sé e per la comunità. Chi usa le risorse per fare la differenza.",
      advice: "Il vero potere non è quello che eserciti sugli altri, ma quello che eserciti su te stesso. Usa le tue risorse con etica e il successo sarà duraturo.",
    },
    io: {
      synthesis: "Ti esprimi con autorità, ambizione e una naturale capacità di gestire risorse e persone.",
      gifts: "Visione strategica, capacità manageriale, espressione di forza e competenza, talento nell'organizzazione.",
      challenge: "Potresti sembrare troppo ambizioso o calcolatore. La sfida è mostrare anche il tuo lato umano.",
      example: "Chi riesce a trasformare ogni situazione in un'opportunità di crescita. La persona che vede il potenziale dove altri vedono problemi.",
      advice: "Il successo senza significato è vuoto. Chiediti sempre: per chi e per cosa sto costruendo?",
    },
    anima: {
      synthesis: "Nel profondo desideri abbondanza, riconoscimento e la capacità di lasciare un'impronta nel mondo.",
      gifts: "Ambizione costruttiva, senso di giustizia, desiderio di eccellenza, forza interiore.",
      challenge: "Il bisogno di successo può renderti dipendente dall'approvazione esterna. Potresti confondere il tuo valore con i tuoi risultati.",
      example: "Chi sente di essere nato per fare qualcosa di grande. La persona che non si accontenta della mediocrità.",
      advice: "Tu non sei i tuoi risultati. Il tuo valore è intrinseco e non dipende da ciò che possiedi o raggiungi.",
    },
    personalita: {
      synthesis: "Gli altri ti vedono come una persona potente, ambiziosa e capace di grandi cose.",
      gifts: "Presenza imponente, immagine di successo e competenza, capacità di ispirare fiducia nelle proprie capacità.",
      challenge: "Potresti sembrare intimidatorio o troppo orientato al risultato. Gli altri potrebbero avere paura di deluderti.",
      example: "La persona che tutti vorrebbero come socio in affari. Chi trasmette un'energia di successo e determinazione.",
      advice: "Mostra anche la tua generosità. Le persone più potenti sono quelle che usano il loro potere per sollevare gli altri.",
    },
    quintessenza: {
      synthesis: "La tua massima espressione si trova nella capacità di creare abbondanza con integrità.",
      gifts: "Talento nel trasformare visioni in realtà materiali, capacità di generare ricchezza che serve il bene comune.",
      challenge: "La tentazione del potere fine a se stesso è la tua prova più grande. L'equilibrio tra materia e spirito è la tua lezione.",
      example: "Chi riesce a costruire organizzazioni che generano valore economico e umano contemporaneamente.",
      advice: "Il potere più grande è quello di fare del bene su larga scala. Usa le tue capacità per servire, non solo per accumulare.",
    },
  },
  9: {
    destino: {
      synthesis: "Il numero dell'umanità, della compassione e del desiderio di lasciare il mondo migliore di come lo si è trovato.",
      gifts: "Compassione, visione universale, capacità di perdonare, saggezza acquisita dall'esperienza, generosità senza aspettarsi nulla in cambio.",
      challenge: "Il 9 rischia di portare il peso del mondo sulle spalle. Può cadere nel vittimismo o disperdere le energie cercando di aggiustare tutto e tutti senza prendersi cura di sé.",
      example: "Il medico senza frontiere che parte per una zona di guerra. L'artista che usa la sua opera per denunciare le ingiustizie. Il nonno che trasmette ai nipoti valori che durano per sempre. La persona che perdona anche quando non è facile, perché capisce la fragilità umana.",
      advice: "Non puoi salvare il mondo se prima non stai bene tu. Impara a lasciar andare ciò che non puoi controllare: la vera saggezza del 9 è sapere cosa vale la pena portare con sé.",
    },
    io: {
      synthesis: "Ti esprimi con umanità, generosità e una naturale vocazione al servizio degli altri.",
      gifts: "Visione ampia, capacità di ispirare compassione, talento nel vedere il quadro generale, espressione altruistica.",
      challenge: "Potresti sembrare distaccato o troppo idealista. La sfida è restare con i piedi per terra mentre guardi il cielo.",
      example: "Chi riesce a toccare il cuore delle persone con le parole e le azioni. La persona che ispira gli altri a diventare versioni migliori di se stessi.",
      advice: "Non devi essere perfetto per fare la differenza. Anche un piccolo gesto di gentilezza può cambiare la vita di qualcuno.",
    },
    anima: {
      synthesis: "Nel profondo desideri servire un bene più grande e contribuire all'evoluzione dell'umanità.",
      gifts: "Compassione profonda, saggezza dell'anima, capacità di perdonare, amore universale.",
      challenge: "Il bisogno di salvare gli altri può farti dimenticare te stesso. Potresti sentirti responsabile del dolore del mondo.",
      example: "Chi sente una connessione profonda con tutta l'umanità. La persona che piange per le ingiustizie anche quando non la riguardano.",
      advice: "Servire non significa sacrificarsi. Il tuo contributo al mondo è più grande quando sei in equilibrio.",
    },
    personalita: {
      synthesis: "Gli altri ti percepiscono come una persona saggia, compassionevole e con un cuore grande.",
      gifts: "Presenza calda e inclusiva, immagine di saggezza e comprensione, capacità di far sentire tutti accolti.",
      challenge: "Potresti sembrare troppo distante o etereo. Gli altri potrebbero vederti come irraggiungibile nella tua idealità.",
      example: "La persona che tutti rispettano per la sua integrità. Chi viene cercato per la sua capacità di comprendere senza giudicare.",
      advice: "Sii presente, non solo ideale. Le persone hanno bisogno della tua umanità, non della tua perfezione.",
    },
    quintessenza: {
      synthesis: "La tua massima espressione si trova nel servizio consapevole e nella capacità di trasformare il dolore in saggezza.",
      gifts: "Talento nel vedere il significato profondo delle esperienze, capacità di guidare gli altri attraverso le transizioni.",
      challenge: "Il rischio è di perderti nell'idealismo senza agire concretamente. La saggezza senza azione è sterile.",
      example: "Il maestro che ha attraversato le prove della vita e ne ha estratto insegnamenti universali che condivide con generosità.",
      advice: "La tua saggezza è il tuo dono più prezioso. Non tenerla per te: il mondo ha bisogno della tua luce.",
    },
  },
};

// Master numbers inherit base descriptions but with enhanced content
templateDescriptions[11] = {
  destino: {
    synthesis: "Il numero maestro della visione, dell'intuizione superiore e del risveglio spirituale.",
    gifts: "Intuizione straordinaria, capacità di ispirare, sensibilità elevata, visione che trascende l'ordinario, connessione con dimensioni superiori di coscienza.",
    challenge: "L'11 vive una tensione costante tra il piano materiale e quello spirituale. Può soffrire di ansia, ipersensibilità e sentirsi inadeguato alla grandezza della propria missione.",
    example: "Il visionario che anticipa i tempi e vede ciò che altri non riescono a percepire. L'artista ispirato che canalizza messaggi universali. Il leader spirituale che risveglia le coscienze.",
    advice: "Non devi portare questo peso da solo. Il tuo dono è un canale, non un fardello. Radicati nella terra mentre guardi il cielo: la tua visione ha bisogno di fondamenta solide per realizzarsi.",
  },
  io: {
    synthesis: "Ti esprimi come un canale di ispirazione, con una sensibilità e un'intuizione fuori dal comune.",
    gifts: "Capacità di ispirare profondamente, intuizione che guida l'espressione, sensibilità artistica e spirituale elevata.",
    challenge: "L'ipersensibilità può renderti vulnerabile. La sfida è esprimere la tua visione senza sentirti sopraffatto.",
    example: "Chi con le parole o le azioni riesce a toccare corde profonde nelle persone. L'artista il cui lavoro sembra provenire da una fonte superiore.",
    advice: "Sei un faro: la tua luce guida gli altri. Ma ricorda di alimentare la tua fiamma con cura e riposo.",
  },
  anima: {
    synthesis: "Nel profondo sei guidato da una visione superiore e dal bisogno di illuminare il cammino degli altri.",
    gifts: "Intuizione mistica, sensibilità raffinata, connessione con il trascendente, capacità di percepire l'invisibile.",
    challenge: "La tua sensibilità estrema può renderti vulnerabile all'energia altrui. Potresti sentirti un alieno in questo mondo.",
    example: "Chi percepisce cose che gli altri non vedono. La persona che ha sogni profetici o intuizioni che si rivelano sempre esatte.",
    advice: "Il tuo dono è reale, non sei 'strano'. Impara a proteggere la tua energia e a scegliere con chi condividere la tua visione.",
  },
  personalita: {
    synthesis: "Gli altri ti percepiscono come una persona carismatica, intensa e dotata di una luce particolare.",
    gifts: "Presenza magnetica, aura di ispirazione, immagine di profondità spirituale e sensibilità unica.",
    challenge: "Potresti sembrare troppo intenso o 'diverso'. Gli altri potrebbero non comprendere la tua profondità.",
    example: "La persona che entra in una stanza e cambia l'energia. Chi ispira gli altri semplicemente con la propria presenza.",
    advice: "Non tutti comprenderanno la tua luce, e va bene così. Circondati di persone che riconoscono il tuo valore.",
  },
  quintessenza: {
    synthesis: "La tua massima espressione si trova nell'illuminare gli altri con la tua visione e intuizione.",
    gifts: "Capacità di trasformare l'ispirazione in guida concreta, talento nel risvegliare il potenziale nascosto degli altri.",
    challenge: "La tensione tra visione e realtà può logorarti. Trova il modo di ancorare le tue intuizioni al mondo concreto.",
    example: "Il maestro-visionario che trasforma intuizioni in insegnamenti pratici che cambiano la vita delle persone.",
    advice: "La tua visione è un dono per il mondo. Non lasciarla morire nell'indecisione: agisci con coraggio.",
  },
};

templateDescriptions[22] = {
  destino: {
    synthesis: "Il numero maestro del costruttore cosmico, capace di realizzare grandi progetti con impatto duraturo.",
    gifts: "Visione architettonica, capacità di manifestare grandi idee nella materia, leadership trasformativa, combinazione unica di idealismo e pragmatismo.",
    challenge: "Il 22 porta il peso di aspettative enormi, sia proprie che altrui. Può crollare sotto la pressione o limitarsi a vivere come un 4 per paura della propria grandezza.",
    example: "Il fondatore di un'organizzazione che cambia le regole del gioco. L'architetto di sistemi che migliorano la vita di milioni. Chi costruisce ponti tra il possibile e l'impossibile.",
    advice: "Sei nato per costruire qualcosa di grande, ma non devi farlo tutto in una volta. Ogni cattedrale è stata costruita una pietra alla volta. Inizia, e il progetto prenderà forma.",
  },
  io: {
    synthesis: "Ti esprimi come un costruttore di visioni, capace di trasformare l'impossibile in realtà.",
    gifts: "Capacità di vedere il progetto completo e realizzarlo passo dopo passo, espressione che combina visione e pragmatismo.",
    challenge: "L'enormità della tua visione può paralizzarti. La sfida è iniziare anche quando il traguardo sembra impossibile.",
    example: "Chi riesce a presentare un'idea rivoluzionaria in modo così concreto che tutti vogliono farne parte.",
    advice: "Non sottovalutare il potere del primo passo. Ogni grande opera inizia con un singolo gesto di coraggio.",
  },
  anima: {
    synthesis: "Nel profondo desideri lasciare un'eredità concreta che sopravviva al tempo.",
    gifts: "Visione a lungo termine, capacità di pensare in grande, determinazione a servizio di un bene superiore.",
    challenge: "Il peso della tua missione può schiacciarti. Potresti sentirti inadeguato alla grandezza di ciò che sei chiamato a fare.",
    example: "Chi sente di avere una missione più grande di sé. La persona che non riesce ad accontentarsi di una vita ordinaria.",
    advice: "Non devi essere perfetto per iniziare. Il mondo ha bisogno delle tue costruzioni imperfette più della tua perfezione immobile.",
  },
  personalita: {
    synthesis: "Gli altri ti vedono come una persona visionaria ma concreta, capace di grandi imprese.",
    gifts: "Presenza autorevole, immagine di competenza e visione, capacità di ispirare fiducia nei grandi progetti.",
    challenge: "Potresti sembrare troppo ambizioso o distante. Gli altri potrebbero sentirsi piccoli di fronte alla tua grandezza.",
    example: "La persona che quando parla di un progetto fa credere a tutti che sia possibile. Chi ispira fiducia anche nelle imprese più audaci.",
    advice: "Includi gli altri nella tua visione. I grandi costruttori non costruiscono da soli: sanno ispirare e delegare.",
  },
  quintessenza: {
    synthesis: "La tua massima espressione si trova nella realizzazione concreta di visioni che servono l'umanità.",
    gifts: "Talento unico nel trasformare ideali in strutture concrete, capacità di costruire eredità durature.",
    challenge: "La perfezione è nemica del bene. Non aspettare le condizioni ideali: costruisci con ciò che hai.",
    example: "Chi riesce a creare organizzazioni, sistemi o opere che cambiano le regole del gioco per le generazioni future.",
    advice: "Sei il ponte tra il cielo e la terra. La tua missione è rendere concreto ciò che altri possono solo sognare.",
  },
};

templateDescriptions[33] = {
  destino: {
    synthesis: "Il numero maestro dell'amore universale, della guida compassionevole e del servizio all'umanità.",
    gifts: "Amore incondizionato, capacità di guarigione, leadership compassionevole, dedizione al servizio, ispirazione spirituale.",
    challenge: "Il 33 porta il rischio del martirio e del sacrificio totale. Può annullarsi completamente per gli altri, dimenticando che anche chi serve ha bisogno di essere servito.",
    example: "Il maestro che dedica la vita a elevare la coscienza degli altri. Chi rinuncia ai propri interessi per un bene più grande. La figura di riferimento che ispira intere comunità.",
    advice: "L'amore universale inizia dall'amore per te stesso. Non puoi illuminare il mondo se la tua fiamma si è spenta. Prenditi cura di te con la stessa compassione che offri agli altri.",
  },
  io: {
    synthesis: "Ti esprimi come una guida amorevole, capace di ispirare trasformazione attraverso la compassione.",
    gifts: "Capacità di guarire con la presenza, espressione di amore universale, talento nel guidare con gentilezza.",
    challenge: "Il sacrificio eccessivo può consumarti. La sfida è servire senza annullarti.",
    example: "Chi con la sola presenza riesce a portare pace e guarigione. La persona il cui amore trasforma chi le sta intorno.",
    advice: "Servi con gioia, non con sacrificio. L'amore che dona per obbligo non è amore, è catena.",
  },
  anima: {
    synthesis: "Nel profondo desideri amare e servire l'umanità con tutto il tuo essere.",
    gifts: "Amore cosmico, compassione senza limiti, capacità di vedere il divino in ogni persona.",
    challenge: "Potresti annullarti completamente nel servizio agli altri. Il confine tra dedizione e martirio è sottile.",
    example: "Chi sente il dolore del mondo come proprio. La persona che non riesce a voltare le spalle a nessuno.",
    advice: "Anche i grandi maestri riposano. Il tuo amore è più potente quando nasce da un cuore pieno, non vuoto.",
  },
  personalita: {
    synthesis: "Gli altri ti percepiscono come una figura luminosa, amorevole e ispiratrice.",
    gifts: "Presenza che guarisce, immagine di saggezza e compassione, capacità di far sentire tutti amati e accolti.",
    challenge: "Potresti sembrare troppo buono o ingenuo. Gli altri potrebbero approfittare della tua generosità.",
    example: "La persona la cui presenza porta pace in ogni stanza. Chi ispira gli altri a diventare più compassionevoli.",
    advice: "La tua bontà non è debolezza. Ma impara a riconoscere chi merita davvero la tua energia.",
  },
  quintessenza: {
    synthesis: "La tua massima espressione si trova nell'amore che trasforma e nella guida compassionevole.",
    gifts: "Talento nel trasformare la sofferenza in saggezza e l'amore in forza di guarigione collettiva.",
    challenge: "Il peso della responsabilità cosmica può essere schiacciante. Non sei responsabile della salvezza di tutti.",
    example: "Il maestro-guaritore che con la propria vita diventa esempio di amore incondizionato e servizio consapevole.",
    advice: "Sei una luce nel mondo. Ma anche la luce ha bisogno di essere alimentata. Prenditi cura della tua fiamma.",
  },
};

export function getNumberTemplate(num: number, type: NumberType): NumberTemplateDesc | null {
  const baseNum = num > 9 && ![11, 22, 33].includes(num) ? num % 9 || 9 : num;
  return templateDescriptions[baseNum]?.[type] || null;
}

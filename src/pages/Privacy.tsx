import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const Privacy = () => {
  const lastUpdated = "12 marzo 2026";
  const appName = "Destino Numerologico";
  const ownerName = "[Nome del Titolare / Ragione Sociale]";
  const ownerAddress = "[Indirizzo sede legale]";
  const ownerEmail = "privacy@destinonumerologico.com";
  const websiteUrl = "https://destino-numerologico.lovable.app";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="font-display text-lg font-semibold text-foreground">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-invert max-w-none space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Informativa sulla Privacy
            </h1>
            <p className="text-muted-foreground">
              Ultimo aggiornamento: {lastUpdated}
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              1. Titolare del Trattamento
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il Titolare del trattamento dei dati personali è <strong className="text-foreground">{ownerName}</strong>, 
              con sede in {ownerAddress}. Per qualsiasi richiesta relativa al trattamento dei dati personali, 
              è possibile contattare il Titolare all'indirizzo email: <a href={`mailto:${ownerEmail}`} className="text-primary hover:underline">{ownerEmail}</a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              2. Base Giuridica del Trattamento
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il trattamento dei dati personali si fonda sulle seguenti basi giuridiche, ai sensi dell'art. 6 del Regolamento (UE) 2016/679 (GDPR):
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Consenso</strong>: per la creazione dell'account e l'utilizzo del servizio.</li>
              <li><strong className="text-foreground">Esecuzione del contratto</strong>: per l'erogazione dei servizi acquistati.</li>
              <li><strong className="text-foreground">Obbligo legale</strong>: per adempiere a obblighi fiscali e normativi.</li>
              <li><strong className="text-foreground">Legittimo interesse</strong>: per migliorare i servizi e prevenire frodi.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              3. Dati Personali Raccolti
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Raccogliamo le seguenti categorie di dati personali:
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-4">3.1 Dati forniti direttamente dall'utente</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Nome e cognome</li>
              <li>Indirizzo email</li>
              <li>Data di nascita</li>
              <li>Sesso (facoltativo)</li>
              <li>Numero di telefono WhatsApp (facoltativo)</li>
              <li>Foto del profilo (facoltative)</li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground mt-4">3.2 Dati raccolti automaticamente</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Indirizzo IP</li>
              <li>Tipo di browser e dispositivo</li>
              <li>Dati di navigazione e interazione con il servizio</li>
              <li>Fuso orario e preferenze linguistiche</li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground mt-4">3.3 Dati di pagamento</h3>
            <p className="text-muted-foreground leading-relaxed">
              I dati di pagamento (carta di credito, dati bancari) sono gestiti direttamente da <strong className="text-foreground">Stripe, Inc.</strong> in qualità 
              di responsabile del trattamento. {appName} non memorizza né ha accesso ai dati completi della carta di credito.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              4. Finalità del Trattamento
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I dati personali sono trattati per le seguenti finalità:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Creazione e gestione dell'account utente</li>
              <li>Erogazione dei servizi di analisi numerologica personalizzata</li>
              <li>Gestione degli abbonamenti e dei pagamenti</li>
              <li>Invio di notifiche relative al servizio (es. report giornalieri via WhatsApp, se autorizzato)</li>
              <li>Miglioramento e personalizzazione dell'esperienza utente</li>
              <li>Conformità agli obblighi legali e fiscali</li>
              <li>Prevenzione di abusi e attività fraudolente</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              5. Conservazione dei Dati
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I dati personali sono conservati per il tempo strettamente necessario al perseguimento delle finalità 
              per cui sono stati raccolti. In particolare:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Dati dell'account</strong>: conservati fino alla cancellazione dell'account da parte dell'utente.</li>
              <li><strong className="text-foreground">Dati di pagamento</strong>: conservati per il periodo previsto dalla normativa fiscale (10 anni).</li>
              <li><strong className="text-foreground">Dati di navigazione</strong>: conservati per un massimo di 26 mesi.</li>
              <li><strong className="text-foreground">Contenuti generati</strong> (mappe, report, chat): conservati fino alla cancellazione dell'account.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              6. Condivisione dei Dati con Terze Parti
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I dati personali possono essere condivisi con i seguenti soggetti terzi, esclusivamente per le finalità indicate:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Stripe, Inc.</strong> – per la gestione dei pagamenti (con sede negli USA, conforme alle Clausole Contrattuali Standard UE).</li>
              <li><strong className="text-foreground">Supabase, Inc.</strong> – per l'hosting del database e l'autenticazione (infrastruttura cloud con data center nell'UE ove disponibile).</li>
              <li><strong className="text-foreground">Provider di AI</strong> – per la generazione di contenuti personalizzati (i dati sono anonimizzati quando possibile).</li>
              <li><strong className="text-foreground">Resend</strong> – per l'invio di email transazionali.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Non vendiamo, scambiamo o cediamo in alcun modo i dati personali a terzi per scopi di marketing.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              7. Trasferimento dei Dati Extra-UE
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Alcuni dei nostri fornitori di servizi hanno sede al di fuori dello Spazio Economico Europeo (SEE). 
              In tali casi, il trasferimento dei dati avviene nel rispetto del Capo V del GDPR, attraverso:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Decisioni di adeguatezza della Commissione Europea</li>
              <li>Clausole Contrattuali Standard (SCC) approvate dalla Commissione Europea</li>
              <li>Data Privacy Framework UE-USA, ove applicabile</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              8. Diritti dell'Interessato
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ai sensi degli articoli 15-22 del GDPR, l'utente ha il diritto di:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Accesso</strong>: ottenere conferma del trattamento e copia dei propri dati personali.</li>
              <li><strong className="text-foreground">Rettifica</strong>: ottenere la correzione di dati inesatti o incompleti.</li>
              <li><strong className="text-foreground">Cancellazione</strong> ("diritto all'oblio"): ottenere la cancellazione dei propri dati, nei casi previsti dalla legge.</li>
              <li><strong className="text-foreground">Limitazione del trattamento</strong>: richiedere la sospensione del trattamento in determinati casi.</li>
              <li><strong className="text-foreground">Portabilità dei dati</strong>: ricevere i propri dati in formato strutturato, di uso comune e leggibile da dispositivo automatico.</li>
              <li><strong className="text-foreground">Opposizione</strong>: opporsi al trattamento basato su legittimo interesse.</li>
              <li><strong className="text-foreground">Revoca del consenso</strong>: revocare in qualsiasi momento il consenso prestato, senza pregiudizio per la liceità del trattamento basato sul consenso prima della revoca.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Per esercitare i propri diritti, l'utente può inviare una richiesta a <a href={`mailto:${ownerEmail}`} className="text-primary hover:underline">{ownerEmail}</a>. 
              Risponderemo entro 30 giorni dalla ricezione della richiesta.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              9. Cookie e Tecnologie Simili
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il sito utilizza cookie tecnici strettamente necessari per il funzionamento del servizio (es. gestione della sessione di autenticazione). 
              Utilizziamo inoltre il <strong className="text-foreground">localStorage</strong> del browser per memorizzare preferenze utente e dati di sessione.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Non utilizziamo cookie di profilazione o tracciamento per finalità pubblicitarie di terze parti.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              10. Sicurezza dei Dati
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati, 
              perdita, distruzione o alterazione, tra cui:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Crittografia dei dati in transito (HTTPS/TLS)</li>
              <li>Crittografia dei dati a riposo nel database</li>
              <li>Controllo degli accessi basato su ruoli (Row Level Security)</li>
              <li>Autenticazione sicura con verifica email</li>
              <li>Gestione sicura delle chiavi API tramite variabili d'ambiente</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              11. Trattamento dei Dati dei Minori
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il servizio non è destinato a minori di 16 anni. Non raccogliamo consapevolmente dati personali 
              di soggetti di età inferiore ai 16 anni. Qualora venissimo a conoscenza di aver raccolto dati 
              di un minore, provvederemo alla loro cancellazione immediata.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              12. Reclami
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Qualora l'utente ritenga che il trattamento dei propri dati personali violi il GDPR, ha il diritto 
              di proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali:
            </p>
            <div className="bg-muted/30 rounded-xl p-4 mt-2 text-muted-foreground">
              <p><strong className="text-foreground">Garante per la protezione dei dati personali</strong></p>
              <p>Piazza Venezia, 11 – 00187 Roma</p>
              <p>Email: <a href="mailto:garante@gpdp.it" className="text-primary hover:underline">garante@gpdp.it</a></p>
              <p>PEC: <a href="mailto:protocollo@pec.gpdp.it" className="text-primary hover:underline">protocollo@pec.gpdp.it</a></p>
              <p>Sito web: <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.garanteprivacy.it</a></p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              13. Modifiche alla Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ci riserviamo il diritto di modificare la presente informativa in qualsiasi momento. Le modifiche 
              saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento. In caso 
              di modifiche sostanziali, notificheremo gli utenti tramite email o avviso all'interno dell'applicazione.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              14. Contatti
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Per qualsiasi domanda o richiesta relativa alla presente informativa sulla privacy, è possibile contattarci:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Email: <a href={`mailto:${ownerEmail}`} className="text-primary hover:underline">{ownerEmail}</a></li>
              <li>Sito web: <a href={websiteUrl} className="text-primary hover:underline">{websiteUrl}</a></li>
            </ul>
          </section>

          <div className="border-t border-border/50 pt-8 mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Questa informativa è redatta ai sensi del Regolamento (UE) 2016/679 (GDPR) e del D.Lgs. 196/2003 
              (Codice Privacy), come modificato dal D.Lgs. 101/2018.
            </p>
            <Link to="/" className="inline-block mt-6 text-primary hover:underline text-sm">
              ← Torna alla Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;

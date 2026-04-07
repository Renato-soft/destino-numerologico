import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const Terms = () => {
  const lastUpdated = "12 marzo 2026";
  const appName = "Destino Numerologico";
  const ownerName = "Renato Reale";
  const ownerAddress = "Piazzetta Reale - Monreale";
  const ownerEmail = "legal@numerologicaldestiny.com";
  const websiteUrl = "https://numerologicaldestiny.com";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h1 className="font-display text-lg font-semibold text-foreground">Termini e Condizioni</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-invert max-w-none space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Termini e Condizioni d'Uso
            </h1>
            <p className="text-muted-foreground">Ultimo aggiornamento: {lastUpdated}</p>
          </div>

          {/* Art. 1 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 1 — Definizioni e ambito di applicazione
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I presenti Termini e Condizioni (di seguito "Termini") disciplinano l'accesso e l'utilizzo della
              piattaforma <strong className="text-foreground">{appName}</strong> (di seguito "Servizio"),
              accessibile tramite il sito web <strong className="text-foreground">{websiteUrl}</strong> e
              relative applicazioni, gestita da <strong className="text-foreground">{ownerName}</strong>,
              con sede in <strong className="text-foreground">{ownerAddress}</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              L'utilizzo del Servizio implica l'accettazione integrale e incondizionata dei presenti Termini,
              ai sensi degli artt. 1341 e 1342 del Codice Civile italiano e della Direttiva UE 2011/83 (diritti
              dei consumatori), del Regolamento UE 2016/679 (GDPR), del D.Lgs. 206/2005 (Codice del Consumo) e
              del D.Lgs. 70/2003 (commercio elettronico).
            </p>
          </section>

          {/* Art. 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 2 — Descrizione del Servizio
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {appName} è una piattaforma digitale che offre analisi numerologiche, report personalizzati,
              strumenti di compatibilità, chat con assistente AI e contenuti formativi basati sulla numerologia.
              Il Servizio è fornito a scopo informativo, educativo e di intrattenimento.
            </p>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-muted-foreground leading-relaxed text-sm">
                <strong className="text-foreground">⚠️ Avvertenza importante:</strong> Le analisi numerologiche
                fornite dal Servizio non costituiscono consulenza medica, psicologica, finanziaria o legale.
                L'Utente riconosce che la numerologia è una disciplina esoterica e che i risultati forniti hanno
                valore puramente indicativo e di intrattenimento.
              </p>
            </div>
          </section>

          {/* Art. 3 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 3 — Registrazione e account
            </h2>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>Per accedere al Servizio è necessario creare un account fornendo dati veritieri, completi e aggiornati.</li>
              <li>L'Utente deve avere almeno 16 anni di età ai sensi dell'art. 8 del GDPR. Per utenti tra 16 e 18 anni, l'iscrizione deve essere autorizzata da un genitore o tutore legale.</li>
              <li>L'Utente è responsabile della custodia delle proprie credenziali e di ogni attività svolta tramite il proprio account.</li>
              <li>In caso di accesso non autorizzato o violazione della sicurezza dell'account, l'Utente è tenuto a darne tempestiva comunicazione a <strong className="text-foreground">{ownerEmail}</strong>.</li>
              <li>Il Titolare si riserva il diritto di sospendere o eliminare account che violino i presenti Termini.</li>
            </ul>
          </section>

          {/* Art. 4 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 4 — Piani di abbonamento e pagamenti
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il Servizio offre diversi livelli di accesso:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li><strong className="text-foreground">Prova Gratuita (24 ore):</strong> accesso limitato alla Mini-Mappa, Analisi del Giorno, Chat e Date Favorevoli.</li>
              <li><strong className="text-foreground">Abbonamento Mensile (€4,99/mese):</strong> accesso completo a Mappa Numerologica, Anno Personale, Pilastri della Crescita, Chat AI, Report Avanzato, Outfit del Giorno e Community.</li>
              <li><strong className="text-foreground">Servizi Pay-Per-Use (€1,99 ciascuno):</strong> Analizzatore Brand, Vibrazione Casa, Compatibilità e Date Favorevoli — acquistabili singolarmente con accesso di 24 ore.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              I pagamenti sono gestiti tramite la piattaforma sicura <strong className="text-foreground">Stripe</strong>,
              conforme allo standard PCI-DSS. Il Titolare non memorizza né accede ai dati delle carte di pagamento.
            </p>
          </section>

          {/* Art. 5 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 5 — Diritto di recesso e rimborsi
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ai sensi degli artt. 52-59 del D.Lgs. 206/2005 (Codice del Consumo) e della Direttiva UE 2011/83:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>
                <strong className="text-foreground">Abbonamenti ricorrenti (Pro e Gold):</strong> l'Utente
                consumatore ha diritto di recedere entro 14 giorni dalla data di sottoscrizione, senza dover
                fornire alcuna motivazione, salvo che il servizio digitale sia stato integralmente eseguito con
                il suo previo consenso espresso e la rinuncia al diritto di recesso.
              </li>
              <li>
                <strong className="text-foreground">Pagamento una tantum (Base):</strong> il diritto di
                recesso si applica entro 14 giorni dall'acquisto, a condizione che il contenuto digitale non
                sia già stato integralmente fruito.
              </li>
              <li>
                La cancellazione dell'abbonamento può essere effettuata in qualsiasi momento tramite il portale
                clienti Stripe accessibile dalla pagina Profilo. La cancellazione ha effetto alla fine del
                periodo di fatturazione corrente.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Per esercitare il diritto di recesso, inviare comunicazione a{" "}
              <strong className="text-foreground">{ownerEmail}</strong> indicando i propri dati identificativi
              e la data dell'acquisto.
            </p>
          </section>

          {/* Art. 6 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 6 — Proprietà intellettuale
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tutti i contenuti del Servizio — inclusi ma non limitati a testi, grafiche, loghi, immagini,
              algoritmi, software, report generati e materiale didattico — sono di proprietà esclusiva del
              Titolare o dei rispettivi licenzianti e sono protetti dalla normativa italiana ed europea in
              materia di diritto d'autore (L. 633/1941, Direttiva UE 2019/790).
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>È vietata la riproduzione, distribuzione, modifica o utilizzo commerciale dei contenuti senza autorizzazione scritta.</li>
              <li>I report generati per l'Utente possono essere utilizzati esclusivamente per uso personale e non commerciale.</li>
              <li>L'Utente conserva la proprietà dei dati personali forniti (nome, data di nascita, ecc.).</li>
            </ul>
          </section>

          {/* Art. 7 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 7 — Obblighi e responsabilità dell'Utente
            </h2>
            <p className="text-muted-foreground leading-relaxed">L'Utente si impegna a:</p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>Utilizzare il Servizio in conformità alle leggi vigenti e ai presenti Termini.</li>
              <li>Non utilizzare il Servizio per fini illeciti, fraudolenti o lesivi dei diritti di terzi.</li>
              <li>Non tentare di accedere a funzionalità o dati non autorizzati, né di aggirare i sistemi di sicurezza.</li>
              <li>Non pubblicare contenuti offensivi, diffamatori, discriminatori o illegali nella sezione Community.</li>
              <li>Non condividere o rivendere le credenziali di accesso o i contenuti premium.</li>
              <li>Non utilizzare sistemi automatizzati (bot, scraper) per accedere al Servizio.</li>
            </ul>
          </section>

          {/* Art. 8 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 8 — Limitazione di responsabilità
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Nei limiti consentiti dalla legge e fatto salvo quanto previsto dall'art. 130 del Codice del Consumo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>Il Servizio è fornito "così com'è" e "come disponibile", senza garanzie di alcun tipo, esplicite o implicite.</li>
              <li>Il Titolare non garantisce che il Servizio sia privo di errori, interruzioni o vulnerabilità di sicurezza.</li>
              <li>Il Titolare non è responsabile per decisioni prese dall'Utente sulla base delle analisi numerologiche fornite.</li>
              <li>La responsabilità complessiva del Titolare, ove applicabile, è limitata all'importo effettivamente pagato dall'Utente nei 12 mesi precedenti l'evento che ha dato origine alla responsabilità.</li>
              <li>Il Titolare non è responsabile per danni indiretti, incidentali, consequenziali o punitivi.</li>
            </ul>
          </section>

          {/* Art. 9 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 9 — Contenuti generati dall'intelligenza artificiale
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il Servizio utilizza modelli di intelligenza artificiale per generare analisi, report e risposte
              nella chat. Ai sensi del Regolamento UE sull'Intelligenza Artificiale (AI Act — Reg. UE 2024/1689):
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>I contenuti generati dall'AI sono chiaramente identificati come tali.</li>
              <li>L'AI è utilizzata come strumento di supporto e non sostituisce il giudizio umano.</li>
              <li>I risultati dell'AI possono contenere imprecisioni o errori; l'Utente è invitato a valutarli criticamente.</li>
              <li>I dati forniti dall'Utente nelle interazioni con l'AI sono trattati in conformità alla Privacy Policy.</li>
            </ul>
          </section>

          {/* Art. 10 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 10 — Community e contenuti degli utenti
            </h2>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>I contenuti pubblicati nella sezione Community restano di proprietà dell'Utente, che concede al Titolare una licenza non esclusiva, gratuita e mondiale per visualizzarli, distribuirli e moderarli all'interno della piattaforma.</li>
              <li>Il Titolare si riserva il diritto di rimuovere contenuti che violino i presenti Termini o le leggi vigenti, ai sensi del Regolamento UE 2022/2065 (Digital Services Act).</li>
              <li>L'Utente può segnalare contenuti inappropriati tramite l'apposita funzione di segnalazione.</li>
              <li>Il Titolare non è responsabile dei contenuti pubblicati dagli utenti nella Community.</li>
            </ul>
          </section>

          {/* Art. 11 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 11 — Protezione dei dati personali
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il trattamento dei dati personali è disciplinato dalla nostra{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, redatta in
              conformità al Regolamento UE 2016/679 (GDPR) e al D.Lgs. 196/2003 (Codice della Privacy) come
              modificato dal D.Lgs. 101/2018.
            </p>
          </section>

          {/* Art. 12 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 12 — Modifiche ai Termini
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il Titolare si riserva il diritto di modificare i presenti Termini in qualsiasi momento. Le
              modifiche saranno comunicate all'Utente tramite email o notifica sulla piattaforma con almeno
              15 giorni di preavviso. L'uso continuato del Servizio dopo tale periodo costituisce accettazione
              delle modifiche. In caso di modifiche sostanziali, sarà richiesto un nuovo consenso esplicito.
            </p>
          </section>

          {/* Art. 13 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 13 — Sospensione e risoluzione
            </h2>
            <p className="text-muted-foreground leading-relaxed">Il Titolare si riserva il diritto di:</p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>Sospendere o terminare l'accesso dell'Utente in caso di violazione dei presenti Termini.</li>
              <li>Interrompere temporaneamente il Servizio per manutenzione o aggiornamenti, con preavviso ove possibile.</li>
              <li>Cessare definitivamente il Servizio con almeno 30 giorni di preavviso e rimborso pro-rata degli abbonamenti attivi.</li>
            </ul>
          </section>

          {/* Art. 14 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 14 — Legge applicabile e foro competente
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I presenti Termini sono regolati dalla legge italiana. Per le controversie con consumatori
              residenti nell'UE, si applicano le disposizioni inderogabili del Regolamento UE 1215/2012
              (Bruxelles I-bis) e della normativa nazionale a tutela del consumatore.
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>Per consumatori: foro del luogo di residenza o domicilio del consumatore, ai sensi dell'art. 66-bis del Codice del Consumo.</li>
              <li>Per utenti non consumatori: foro esclusivo di Palermo.</li>
              <li>
                Per la risoluzione alternativa delle controversie (ADR), l'Utente consumatore può ricorrere alla
                piattaforma ODR dell'Unione Europea:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </li>
            </ul>
          </section>

          {/* Art. 15 */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-foreground border-b border-border/50 pb-2">
              Art. 15 — Disposizioni finali
            </h2>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
              <li>L'eventuale invalidità di una o più clausole dei presenti Termini non inficia la validità delle restanti clausole.</li>
              <li>La mancata applicazione di un diritto previsto dai presenti Termini non costituisce rinuncia allo stesso.</li>
              <li>I presenti Termini, unitamente alla Privacy Policy, costituiscono l'intero accordo tra l'Utente e il Titolare.</li>
            </ul>
          </section>

          {/* Contatti */}
          <section className="mt-12 p-6 rounded-xl border border-border/50 bg-card/50">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">Contatti</h2>
            <p className="text-muted-foreground leading-relaxed">
              Per qualsiasi domanda relativa ai presenti Termini e Condizioni:
            </p>
            <ul className="list-none text-muted-foreground mt-3 space-y-1">
              <li>📧 Email: <strong className="text-foreground">{ownerEmail}</strong></li>
              <li>📍 Indirizzo: <strong className="text-foreground">{ownerAddress}</strong></li>
              <li>🌐 Sito: <strong className="text-foreground">{websiteUrl}</strong></li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground text-center pt-8 border-t border-border/30">
            © {new Date().getFullYear()} {appName}. Tutti i diritti riservati.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Terms;

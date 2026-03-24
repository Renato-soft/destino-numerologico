import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "È davvero accurato?",
    answer: "La numerologia pitagorica è un sistema millenario di autoconoscenza. Non è una scienza esatta, ma uno strumento di riflessione potentissimo. I nostri utenti restano costantemente sorpresi dalla precisione delle analisi. Ti invitiamo a provare gratuitamente e giudicare tu stesso.",
  },
  {
    question: "Come funziona il calcolo?",
    answer: "Utilizziamo la numerologia pitagorica classica, il metodo più antico e consolidato. I tuoi numeri sono calcolati dalla tua data di nascita e dal tuo nome completo alla nascita, seguendo regole precise e verificate.",
  },
  {
    question: "È gratuito?",
    answer: "Sì, puoi iniziare gratuitamente senza inserire dati di pagamento. La prima analisi è completamente gratuita. Se decidi di sbloccare contenuti premium, i pagamenti sono gestiti in modo sicuro. Puoi cancellare in qualsiasi momento.",
  },
  {
    question: "I miei dati sono sicuri?",
    answer: "Assolutamente sì. Utilizziamo crittografia avanzata e non condividiamo mai i tuoi dati con terze parti. I tuoi dati personali sono protetti secondo le normative GDPR europee.",
  },
  {
    question: "In cosa si differenzia dagli oroscopi?",
    answer: "Gli oroscopi sono generici e basati solo sul mese di nascita. La numerologia pitagorica utilizza la tua data di nascita esatta e il tuo nome completo per calcolare numeri unici e personali. Il risultato è un'analisi su misura, non una previsione generica valida per milioni di persone.",
  },
  {
    question: "Quanto tempo ci vuole per ricevere l'analisi?",
    answer: "L'analisi è istantanea. Inserisci la tua data di nascita e in pochi secondi ricevi la tua mappa numerologica completa. Ogni giorno puoi consultare l'analisi giornaliera aggiornata con suggerimenti pratici per la tua giornata.",
  },
  {
    question: "Posso cancellare il mio account in qualsiasi momento?",
    answer: "Certo. Non ci sono vincoli né obblighi. Puoi cancellare il tuo account e tutti i tuoi dati in qualsiasi momento direttamente dalle impostazioni del profilo. Nessuna domanda, nessuna complicazione.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Domande <span className="text-gradient-gold">frequenti</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="rounded-xl border border-border/50 bg-card/50 px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-display text-base font-semibold py-5 hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;

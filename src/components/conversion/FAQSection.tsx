import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quanto è accurata la numerologia?",
    answer: "La numerologia pitagorica è un sistema millenario di autoconoscenza. Non è una scienza esatta, ma uno strumento di riflessione potentissimo. I nostri utenti restano costantemente sorpresi dalla precisione delle analisi. Ti invitiamo a provare gratuitamente e giudicare tu stesso.",
  },
  {
    question: "Come funziona il pagamento?",
    answer: "Puoi iniziare gratuitamente senza inserire dati di pagamento. Se decidi di sbloccare contenuti premium, i pagamenti sono gestiti in modo sicuro tramite Stripe. Puoi cancellare l'abbonamento in qualsiasi momento.",
  },
  {
    question: "Come vengono calcolati i numeri?",
    answer: "Utilizziamo la numerologia pitagorica classica, il metodo più antico e consolidato. I tuoi numeri sono calcolati dalla tua data di nascita e dal tuo nome completo alla nascita, seguendo regole precise e verificate.",
  },
  {
    question: "I miei dati sono al sicuro?",
    answer: "Assolutamente sì. Utilizziamo crittografia avanzata e non condividiamo mai i tuoi dati con terze parti. I tuoi dati personali sono protetti secondo le normative GDPR europee.",
  },
  {
    question: "Posso cancellare l'abbonamento quando voglio?",
    answer: "Sì, puoi cancellare l'abbonamento in qualsiasi momento con un click. Non ci sono vincoli o penali. Continuerai ad avere accesso fino alla fine del periodo già pagato.",
  },
  {
    question: "Cosa include l'offerta da €9,99?",
    answer: "Con €9,99 sblocchi immediatamente tutte le analisi del percorso evolutivo senza dover aspettare. Include: mappa completa, anno personale, lezioni karmiche, compatibilità, cicli della vita e molto altro. Poi solo €4,99/mese per i contenuti giornalieri.",
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

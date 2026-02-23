import { motion } from "framer-motion";

const numbers = [
  { num: 1, meaning: "Iniziativa", desc: "Indipendenza, leadership e nuovi inizi", color: "from-red-500 to-orange-500" },
  { num: 2, meaning: "Collaborazione", desc: "Diplomazia, sensibilità e relazioni", color: "from-blue-400 to-cyan-400" },
  { num: 3, meaning: "Espressione", desc: "Creatività, comunicazione e gioia", color: "from-yellow-400 to-amber-400" },
  { num: 4, meaning: "Struttura", desc: "Stabilità, disciplina e concretezza", color: "from-green-500 to-emerald-500" },
  { num: 5, meaning: "Libertà", desc: "Cambiamento, avventura e adattabilità", color: "from-purple-400 to-pink-400" },
  { num: 6, meaning: "Armonia", desc: "Famiglia, responsabilità e amore", color: "from-rose-400 to-pink-500" },
  { num: 7, meaning: "Introspezione", desc: "Ricerca interiore, spiritualità e analisi", color: "from-indigo-400 to-violet-400" },
  { num: 8, meaning: "Potere", desc: "Ambizione, abbondanza e autorità", color: "from-amber-500 to-orange-500" },
  { num: 9, meaning: "Umanità", desc: "Compassione, saggezza e completamento", color: "from-teal-400 to-cyan-500" },
];

const masterNumbers = [
  { num: 11, meaning: "Visione", desc: "Intuizione e ispirazione" },
  { num: 22, meaning: "Costruttore", desc: "Realizzazione di grandi progetti" },
  { num: 33, meaning: "Maestro", desc: "Amore universale e servizio" },
];

const NumbersShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* Base numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            I <span className="text-gradient-gold">9 Numeri</span> Fondamentali
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ogni numero porta un'energia unica che influenza la tua personalità e il tuo percorso.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          {numbers.map((item, index) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="relative p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mx-auto mb-3`}>
                    <span className="text-2xl font-display font-bold text-white">
                      {item.num}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-semibold mb-1 text-foreground">
                    {item.meaning}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Master numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
            I <span className="text-gradient-gold">Numeri Maestri</span>
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Vibrazioni elevate che richiedono consapevolezza e responsabilità.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {masterNumbers.map((item, index) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 text-center overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="number-circle mx-auto mb-4 group-hover:pulse-gold">
                    {item.num}
                  </div>
                  <h4 className="font-display text-xl font-semibold mb-2 text-foreground">
                    {item.meaning}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NumbersShowcase;

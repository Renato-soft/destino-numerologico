import { motion } from "framer-motion";
import { BookOpen, Award, Users } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Chi siamo
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Una passione <span className="text-gradient-gold">autentica</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Photo placeholder */}
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-b from-muted/50 to-card border border-border/50 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-display font-bold text-primary-foreground">DN</span>
                </div>
                <p className="text-sm text-muted-foreground">Destino Numerologico</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Destino Numerologico nasce da anni di studio della numerologia pitagorica
                e dalla volontà di rendere questa conoscenza millenaria accessibile a tutti.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Non siamo un oroscopo generico. Ogni analisi è calcolata sulla tua data di
                nascita e il tuo nome completo, secondo la tradizione pitagorica autentica.
                I risultati sono personali, precisi e pratici.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: BookOpen, label: "Numerologia Pitagorica", value: "Autentica" },
                  { icon: Award, label: "Analisi", value: "Personalizzate" },
                  { icon: Users, label: "Utenti", value: "Migliaia" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-sm font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

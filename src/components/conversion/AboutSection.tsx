import { BookOpen, Award, Users } from "lucide-react";
import founderPhoto from "@/assets/founder-photo.jpg";

const AboutSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Chi <span className="text-gradient-gold">sono</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-[2fr_3fr] gap-8 items-start">
            <div className="rounded-2xl border border-border/50 overflow-hidden">
              <img src={founderPhoto} alt="Fondatore di Destino Numerologico" className="w-full h-auto object-cover" loading="lazy" decoding="async" />
            </div>

            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Mi chiamo Renato R. e da sempre studio i modelli nascosti che influenzano la realtà, con un forte interesse per numerologia, fisica quantistica e informatica. Il mio obiettivo è unire approcci antichi e logica moderna per creare strumenti realmente utili nella vita quotidiana.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Negli anni ho sviluppato questo sistema per rendere la numerologia più chiara, accessibile e concreta: non teoria astratta, ma indicazioni pratiche che puoi usare ogni giorno.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A differenza degli oroscopi generici, ogni analisi è calcolata sulla tua data di nascita e sul tuo nome completo, seguendo i principi della tradizione pitagorica. Questo permette di ottenere risultati personalizzati, coerenti e basati su schemi numerici precisi.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Il risultato? Una lettura che non si limita a descriverti, ma ti aiuta a capire come agire, scegliere e interpretare ciò che stai vivendo.
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

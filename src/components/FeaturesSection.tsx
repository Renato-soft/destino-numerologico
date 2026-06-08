import { useLanguage } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { Route, MessageCircle, Flame, Star } from 'lucide-react';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Route, title: t.features.f1Title, desc: t.features.f1Desc },
    { icon: MessageCircle, title: t.features.f2Title, desc: t.features.f2Desc },
    { icon: Flame, title: t.features.f3Title, desc: t.features.f3Desc },
    { icon: Star, title: t.features.f4Title, desc: t.features.f4Desc },
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl mb-4">{t.features.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.features.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

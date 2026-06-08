import { useLanguage } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { Calculator, Search, Heart } from 'lucide-react';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: Calculator, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, num: '01' },
    { icon: Search, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, num: '02' },
    { icon: Heart, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, num: '03' },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl mb-4">{t.howItWorks.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-card-gradient border border-border rounded-2xl p-8 text-center glow-accent hover:border-accent/30 transition-colors"
            >
              <span className="absolute top-4 right-4 font-heading text-5xl text-muted/30">{step.num}</span>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

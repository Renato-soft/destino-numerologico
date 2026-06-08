import { useLanguage } from '@/i18n/LanguageContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const WaitlistSection = () => {
  const { t } = useLanguage();
  const { open } = useAuthModal();

  return (
    <section id="waitlist" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="font-heading text-4xl md:text-5xl mb-4">{t.waitlist.title}</h2>
          <p className="text-muted-foreground text-lg mb-10">{t.waitlist.subtitle}</p>

          <div className="space-y-3">
            <button
              onClick={() => open('register')}
              className="w-full px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg glow-primary hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {t.waitlist.cta}
            </button>
            <button
              onClick={() => open('login')}
              className="w-full px-8 py-4 rounded-xl border border-border text-muted-foreground font-medium hover:text-foreground hover:border-foreground/30 transition-all"
            >
              {t.auth.signInLink}
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">{t.waitlist.privacy}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default WaitlistSection;

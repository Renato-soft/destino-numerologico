import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { open } = useAuthModal();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero overflow-hidden pt-20">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            {t.hero.badge}
          </span>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl leading-tight mb-6">
            {t.hero.title}{' '}
            <span className="text-gradient-gold italic">{t.hero.titleHighlight}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {isAuthenticated ? (
              <Link
                to="/app/dashboard"
                className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-lg glow-primary hover:opacity-90 transition-all"
              >
                {t.app.navDashboard}
              </Link>
            ) : (
              <button
                onClick={() => open('register')}
                className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-lg glow-primary hover:opacity-90 transition-all"
              >
                {t.hero.cta}
              </button>
            )}
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: t.hero.stat1, label: t.hero.stat1Label },
              { value: t.hero.stat2, label: t.hero.stat2Label },
              { value: t.hero.stat3, label: t.hero.stat3Label },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                className="text-center"
              >
                <div className="font-heading text-3xl md:text-4xl text-gradient-gold">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

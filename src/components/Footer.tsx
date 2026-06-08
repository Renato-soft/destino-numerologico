import { useLanguage } from '@/i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto px-6 text-center">
        <span className="font-heading text-xl text-gradient-gold">NumFlame</span>
        <p className="text-muted-foreground text-sm mt-2">{t.footer.tagline}</p>
        <p className="text-muted-foreground/50 text-xs mt-4">{t.footer.rights}</p>
      </div>
    </footer>
  );
};

export default Footer;

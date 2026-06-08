import { useLanguage } from '@/i18n/LanguageContext';
import { Lang, langLabels } from '@/i18n/translations';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { open } = useAuthModal();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#" className="font-heading text-2xl text-gradient-gold tracking-tight">
          NumFlame
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-body text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">{t.nav.howItWorks}</a>
          <a href="#features" className="hover:text-foreground transition-colors">{t.nav.features}</a>
          {isAuthenticated ? (
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              {t.app.navDashboard}
            </Link>
          ) : (
            <>
              <button
                onClick={() => open('login')}
                className="hover:text-foreground transition-colors"
              >
                {t.auth.signInLink}
              </button>
              <button
                onClick={() => open('register')}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                {t.nav.waitlist}
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile auth button */}
          {!isAuthenticated && (
            <button
              onClick={() => open('login')}
              className="md:hidden text-sm text-primary font-medium"
            >
              {t.auth.signInLink}
            </button>
          )}
          {isAuthenticated && (
            <Link to="/app/dashboard" className="md:hidden text-sm text-primary font-medium">
              {t.app.navDashboard}
            </Link>
          )}

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{langLabels[lang]}</span>
              <span className="sm:hidden">{lang.toUpperCase()}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-xl py-1 min-w-[140px] z-50">
                {(Object.keys(langLabels) as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${l === lang ? 'text-primary font-medium' : 'text-foreground'}`}
                  >
                    {langLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

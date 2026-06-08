import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Flame, LayoutDashboard, Heart, User, LogOut } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Lang, langLabels } from '@/i18n/translations';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export default function AppLayout() {
  const { t, lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const a = t.app;

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const navItems = [
    { to: '/app/dashboard', icon: LayoutDashboard, label: a.navDashboard },
    { to: '/app/soulmates',  icon: Heart,           label: a.navSoulmates },
    { to: '/app/profile',    icon: User,            label: a.navProfile },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-heading text-xl text-gradient-gold">NumFlame</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
              >
                <Globe className="w-3.5 h-3.5" />
                {lang.toUpperCase()}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-xl py-1 min-w-[130px] z-50">
                  {(Object.keys(langLabels) as Lang[]).map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition ${l === lang ? 'text-primary font-medium' : 'text-foreground'}`}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
              {user?.firstName?.[0]?.toUpperCase() ?? '?'}
            </div>

            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
              title={a.signOut}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-16 pb-20 md:pb-6">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs transition ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

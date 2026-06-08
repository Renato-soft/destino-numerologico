import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { toast } from 'sonner';

export default function AuthModal() {
  const { t } = useLanguage();
  const { isOpen, tab, setTab, close } = useAuthModal();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // reset form when tab or open state changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
    setShowPwd(false);
  }, [tab, isOpen]);

  // lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError(t.auth.errorPassword); return; }

    setLoading(true);
    try {
      if (tab === 'login') {
        const user = await signIn(email, password);
        close();
        navigate(user.onboardingComplete ? '/app/dashboard' : '/onboarding');
      } else {
        await signUp(email, password);
        close();
        navigate('/onboarding');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'CONFIRM_EMAIL') {
        // Registrazione ok ma email confirmation abilitata
        setError('');
        close();
        toast.info(t.auth.confirmEmailSent ?? 'Check your inbox and click the confirmation link to continue.');
      } else if (msg.toLowerCase().includes('invalid login') || msg.toLowerCase().includes('invalid credentials')) {
        setError(t.auth.errorInvalid);
      } else if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setError(t.auth.errorExists ?? msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel — slides up on mobile, fade+scale on desktop */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,  y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="fixed z-50 inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full md:w-[420px] bg-card border border-border md:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Drag handle (mobile only) */}
              <div className="md:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="font-heading text-xl text-gradient-gold">NumFlame</span>
                </div>
                <button
                  onClick={close}
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mx-6 mt-2 rounded-xl bg-muted p-1 gap-1">
                {(['login', 'register'] as const).map(t_ => (
                  <button
                    key={t_}
                    onClick={() => setTab(t_)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      tab === t_
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t_ === 'login' ? t.auth.loginCta : t.auth.registerCta}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: tab === 'login' ? -16 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: tab === 'login' ? 16 : -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-muted-foreground text-sm mb-5">
                      {tab === 'login' ? t.auth.loginSubtitle : t.auth.registerSubtitle}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1.5">{t.auth.email}</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          autoComplete="email"
                          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1.5">{t.auth.password}</label>
                        <div className="relative">
                          <input
                            type={showPwd ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                            className="w-full px-4 py-3 pr-11 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                          >
                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Error */}
                      {error && (
                        <p className="text-sm text-destructive">{error}</p>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-base glow-primary hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {loading
                          ? '…'
                          : tab === 'login'
                            ? t.auth.loginCta
                            : t.auth.registerCta}
                      </button>
                    </form>

                    {/* Switch tab link */}
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      {tab === 'login' ? t.auth.noAccount : t.auth.haveAccount}{' '}
                      <button
                        onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
                        className="text-primary hover:underline font-medium"
                      >
                        {tab === 'login' ? t.auth.signUpLink : t.auth.signInLink}
                      </button>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

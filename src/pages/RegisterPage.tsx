import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t.auth.errorPassword);
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      navigate('/onboarding');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'CONFIRM_EMAIL') {
        toast.success(t.auth.confirmEmailSent);
      } else if (/already registered|already exists/i.test(msg)) {
        toast.error(t.auth.errorExists);
      } else if (/rate limit/i.test(msg)) {
        toast.error(t.auth.errorRateLimit);
      } else {
        toast.error(msg || t.auth.errorInvalid);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <Flame className="w-7 h-7 text-primary" />
          <span className="font-heading text-3xl text-gradient-gold">NumFlame</span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h1 className="font-heading text-3xl mb-1">{t.auth.registerTitle}</h1>
          <p className="text-muted-foreground mb-8">{t.auth.registerSubtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">{t.auth.email}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">{t.auth.password}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-lg glow-primary hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? '…' : t.auth.registerCta}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t.auth.haveAccount}{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              {t.auth.signInLink}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

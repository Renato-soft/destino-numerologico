import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 6) {
      toast.error(t.auth.errorInvalid);
      return;
    }
    setLoading(true);
    try {
      const user = await signIn(email, password);
      if (!user) {
        toast.error(t.auth.errorInvalid);
        return;
      }
      if (!user.onboardingComplete) {
        navigate('/onboarding');
      } else {
        navigate('/app/dashboard');
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
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <Flame className="w-7 h-7 text-primary" />
          <span className="font-heading text-3xl text-gradient-gold">NumFlame</span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h1 className="font-heading text-3xl mb-1">{t.auth.loginTitle}</h1>
          <p className="text-muted-foreground mb-8">{t.auth.loginSubtitle}</p>

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
              {loading ? '…' : t.auth.loginCta}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t.auth.noAccount}{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              {t.auth.signUpLink}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

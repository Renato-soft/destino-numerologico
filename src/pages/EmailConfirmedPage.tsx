import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/i18n/LanguageContext';

type Status = 'loading' | 'success' | 'error';

export default function EmailConfirmedPage() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check for error params in hash or query string
    const hash = window.location.hash.slice(1);
    const search = window.location.search.slice(1);
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(search);

    if (hashParams.get('error') || queryParams.get('error')) {
      const desc =
        hashParams.get('error_description') ??
        queryParams.get('error_description') ??
        '';
      setErrorMsg(desc.replace(/\+/g, ' '));
      setStatus('error');
      return;
    }

    // PKCE flow: exchange authorization code for session
    const code = queryParams.get('code');
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            setErrorMsg(error.message);
            setStatus('error');
          } else {
            setStatus('success');
            // Sign out so the user goes through the normal login flow
            supabase.auth.signOut();
          }
        });
      return;
    }

    // Hash-based flow: Supabase auto-processes the access_token in the hash.
    // Listen for the resulting SIGNED_IN event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setStatus('success');
          supabase.auth.signOut();
        }
      }
    );

    // Also handle the case where the hash was already consumed before we mounted
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus('success');
        supabase.auth.signOut();
      }
    });

    // Fallback timeout — if nothing fires the link is invalid
    const timer = setTimeout(() => {
      setStatus(s => (s === 'loading' ? 'error' : s));
    }, 10_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

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

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl text-center">
          {status === 'loading' && (
            <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-5" />
              <h1 className="font-heading text-3xl mb-2">{t.auth.confirmTitle}</h1>
              <p className="text-muted-foreground mb-8">{t.auth.confirmSubtitle}</p>
              <Link
                to="/login"
                className="inline-block w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-lg glow-primary hover:opacity-90 transition-all"
              >
                {t.auth.confirmCta}
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-14 h-14 text-destructive mx-auto mb-5" />
              <h1 className="font-heading text-3xl mb-2">{t.auth.confirmErrorTitle}</h1>
              <p className="text-muted-foreground mb-8">
                {errorMsg || t.auth.confirmErrorSub}
              </p>
              <Link
                to="/register"
                className="inline-block w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-lg glow-primary hover:opacity-90 transition-all"
              >
                {t.auth.registerCta}
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

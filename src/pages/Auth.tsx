import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Mail, Lock, ArrowLeft, Eye, EyeOff, LogOut, Globe } from "lucide-react";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language?.startsWith("en") ? "en" : "it");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const emailSchema = z.string().email(t("auth.invalidEmail"));
  const passwordSchema = z.string().min(6, t("auth.passwordMin"));

  const changeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({ variant: "destructive", title: t("auth.invalidCredentials"), description: t("auth.invalidCredentialsDesc") });
          } else if (error.message.includes("Email not confirmed")) {
            toast({ variant: "destructive", title: t("auth.emailNotConfirmed"), description: t("auth.emailNotConfirmedDesc") });
          } else throw error;
          return;
        }

        // Load user language preference
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase.from("profiles").select("language").eq("user_id", session.user.id).maybeSingle();
          if (profile?.language) {
            i18n.changeLanguage(profile.language as string);
          }
        }

        toast({ title: t("auth.loginSuccess"), description: t("auth.loginSuccessDesc") });
        navigate("/dashboard");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: redirectUrl, data: { language: selectedLanguage } },
        });
        if (error) {
          if (error.message.includes("User already registered")) {
            toast({ variant: "destructive", title: t("auth.userExists"), description: t("auth.userExistsDesc") });
            setIsLogin(true);
          } else throw error;
          return;
        }
        toast({ title: t("auth.registerSuccess"), description: t("auth.registerSuccessDesc") });
        navigate("/onboarding");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: t("common.error"), description: error.message || t("auth.genericError") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 numerology-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t("common.backToHome")}
          </Link>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            {t("common.logout")}
          </button>
        </div>

        <div className="glass-cosmic rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-semibold">{t("common.appName")}</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-center mb-2">
            {isLogin ? t("auth.welcomeBack") : t("auth.startJourney")}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isLogin ? t("auth.loginSubtitle") : t("auth.registerSubtitle")}
          </p>

          {/* Language selector (visible in registration) */}
          {!isLogin && (
            <div className="mb-6 space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t("auth.language")}
              </Label>
              <div className="flex gap-3">
                {[
                  { value: "it", label: "🇮🇹 Italiano" },
                  { value: "en", label: "🇬🇧 English" },
                ].map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => changeLanguage(lang.value)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedLanguage === lang.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email" type="email" placeholder="la-tua@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                  className="pl-10 input-cosmic" required
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                  className="pl-10 pr-10 input-cosmic" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" variant="cosmic" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isLogin ? t("auth.loggingIn") : t("auth.registering")}
                </span>
              ) : (
                isLogin ? t("auth.login") : t("auth.register")
              )}
            </Button>
          </form>

          <p className="text-center mt-6 text-muted-foreground">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }} className="text-primary hover:underline font-medium">
              {isLogin ? t("auth.switchToRegister") : t("auth.switchToLogin")}
            </button>
          </p>

          {!isLogin && (
            <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-sm text-foreground font-medium mb-1">{t("auth.photoNotice")}</p>
              <p className="text-xs text-muted-foreground">{t("auth.photoNoticeDesc")}</p>
              <p className="text-xs text-muted-foreground mt-2">{t("auth.emailConfirmNotice")}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

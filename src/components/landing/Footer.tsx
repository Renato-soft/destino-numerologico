import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">{t("common.appName")}</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerPrivacy")}</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerTerms")}</Link>
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerLogin")}</Link>
          </nav>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {t("common.appName")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

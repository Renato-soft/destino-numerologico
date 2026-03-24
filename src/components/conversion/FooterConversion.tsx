import { Link } from "react-router-dom";

const FooterConversion = () => {
  return (
    <footer className="py-12 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-gradient-gold">Destino Numerologico</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Termini</Link>
            <a href="mailto:info@destinonumerologico.com" className="hover:text-foreground transition-colors">Contatti</a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Destino Numerologico. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterConversion;

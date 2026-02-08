import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  User,
  Check,
  Loader2,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

interface Profile {
  nome: string;
  cognome: string;
  birth_date: string;
  timezone: string | null;
  created_at: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("nome, cognome, birth_date, timezone, created_at")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading profile:", error);
    } else if (data) {
      setProfile(data);
      setNome(data.nome);
      setCognome(data.cognome);
      setBirthDate(data.birth_date);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!nome.trim() || !cognome.trim() || !birthDate) {
      toast({
        title: "Campi obbligatori",
        description: "Compila tutti i campi richiesti.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          nome: nome.trim(),
          cognome: cognome.trim(),
          birth_date: birthDate,
        })
        .eq("user_id", session.user.id);

      if (error) throw error;

      toast({
        title: "Profilo aggiornato",
        description: "I tuoi dati sono stati salvati correttamente.",
      });

      setProfile({
        ...profile!,
        nome: nome.trim(),
        cognome: cognome.trim(),
        birth_date: birthDate,
      });
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il profilo.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateMap = () => {
    navigate("/map");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold">Profilo</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile form */}
          <div className="glass-cosmic rounded-2xl p-6 space-y-6">
            <div className="text-center pb-4 border-b border-border/50">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-display font-bold text-primary-foreground mb-4">
                {nome.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display text-xl font-semibold">
                {nome} {cognome}
              </h2>
              {profile?.created_at && (
                <p className="text-sm text-muted-foreground">
                  Iscritto dal {format(new Date(profile.created_at), "d MMMM yyyy")}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="cognome">Cognome</Label>
              <Input
                id="cognome"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="birthDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data di nascita
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button
              variant="cosmic"
              className="w-full"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Salva Modifiche
                </>
              )}
            </Button>
          </div>

          {/* Regenerate map */}
          <div className="glass-cosmic rounded-xl p-6">
            <h3 className="font-display font-semibold mb-2">Rigenera la Mappa</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Se hai modificato i tuoi dati, puoi rigenerare la mappa numerologica
              per ottenere calcoli aggiornati.
            </p>
            <Button
              variant="cosmic-outline"
              className="w-full"
              onClick={handleRegenerateMap}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Rigenera Mappa Numerologica
            </Button>
          </div>

          {/* Timezone info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Fuso orario: {profile?.timezone || "Europe/Rome"}</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;

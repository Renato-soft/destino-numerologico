import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { 
  Sparkles, 
  User, 
  Calendar, 
  Camera, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Upload,
  LogOut
} from "lucide-react";
import { z } from "zod";

const nameSchema = z.string().min(2, "Minimo 2 caratteri").max(50, "Massimo 50 caratteri");
const dateSchema = z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato: gg/mm/aaaa");

interface FormData {
  nome: string;
  cognome: string;
  birthDate: string;
  sesso: string;
  photos: {
    face: File | null;
    fullFront: File | null;
    fullSide: File | null;
  };
}

const steps = [
  { id: 1, title: "I tuoi dati", icon: User },
  { id: 2, title: "Le tue foto", icon: Camera },
  { id: 3, title: "Conferma", icon: Check },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cognome: "",
    birthDate: "",
    sesso: "",
    photos: {
      face: null,
      fullFront: null,
      fullSide: null,
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if onboarding is already completed
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        navigate("/dashboard");
      }
    };

    checkAuth();
  }, [navigate]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    const nomeResult = nameSchema.safeParse(formData.nome);
    if (!nomeResult.success) {
      newErrors.nome = nomeResult.error.errors[0].message;
    }

    const cognomeResult = nameSchema.safeParse(formData.cognome);
    if (!cognomeResult.success) {
      newErrors.cognome = cognomeResult.error.errors[0].message;
    }

    if (!formData.sesso) {
      newErrors.sesso = "Seleziona il tuo sesso";
    }

    const dateResult = dateSchema.safeParse(formData.birthDate);
    if (!dateResult.success) {
      newErrors.birthDate = dateResult.error.errors[0].message;
    } else {
      // Validate actual date
      const [day, month, year] = formData.birthDate.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      if (isNaN(date.getTime()) || date > new Date()) {
        newErrors.birthDate = "Data non valida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.photos.face) {
      newErrors.face = "Foto viso richiesta";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (type: keyof FormData["photos"]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File troppo grande",
          description: "La foto deve essere inferiore a 5MB",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        photos: { ...prev.photos, [type]: file },
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews((prev) => ({
          ...prev,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors[type]) {
        setErrors((prev) => ({ ...prev, [type]: undefined }));
      }
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non autenticato");

      const userId = session.user.id;

      // Parse birth date
      const [day, month, year] = formData.birthDate.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);

      // Upload photos
      const photoUploads = await Promise.all(
        Object.entries(formData.photos)
          .filter(([_, file]) => file !== null)
          .map(async ([type, file]) => {
            const fileExt = file!.name.split(".").pop();
            const filePath = `${userId}/${type}_${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
              .from("user-photos")
              .upload(filePath, file!);

            if (uploadError) throw uploadError;

            return {
              type: type === "fullFront" ? "full_front" : type === "fullSide" ? "full_side" : type,
              path: filePath,
            };
          })
      );

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: userId,
        nome: formData.nome,
        cognome: formData.cognome,
        birth_date: birthDate.toISOString().split("T")[0],
        sesso: formData.sesso,
        onboarding_completed: true,
      } as any);

      if (profileError) throw profileError;

      // Save photo references
      if (photoUploads.length > 0) {
        const { error: photosError } = await supabase.from("photos").insert(
          photoUploads.map((photo) => ({
            user_id: userId,
            type: photo.type,
            storage_path: photo.path,
          }))
        );

        if (photosError) throw photosError;
      }

      toast({
        title: "Profilo completato!",
        description: "Ora puoi generare la tua mappa numerologica.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: error.message || "Si è verificato un errore. Riprova.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateInput = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    
    // Format as dd/mm/yyyy
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 numerology-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logout button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Esci
          </button>
        </div>
        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 transition-all ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-cosmic rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold">
              Destino Numerologico
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Personal Data */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold text-center mb-2">
                  Raccontaci di te
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  I tuoi dati sono fondamentali per calcolare la mappa numerologica
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      placeholder="Il tuo nome"
                      value={formData.nome}
                      onChange={(e) => {
                        setFormData({ ...formData, nome: e.target.value });
                        if (errors.nome) setErrors({ ...errors, nome: "" });
                      }}
                      className="input-cosmic"
                    />
                    {errors.nome && (
                      <p className="text-sm text-destructive">{errors.nome}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cognome">Cognome</Label>
                    <Input
                      id="cognome"
                      placeholder="Il tuo cognome"
                      value={formData.cognome}
                      onChange={(e) => {
                        setFormData({ ...formData, cognome: e.target.value });
                        if (errors.cognome) setErrors({ ...errors, cognome: "" });
                      }}
                      className="input-cosmic"
                    />
                    {errors.cognome && (
                      <p className="text-sm text-destructive">{errors.cognome}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Sesso</Label>
                    <div className="flex gap-3">
                      {[
                        { value: "M", label: "Uomo" },
                        { value: "F", label: "Donna" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, sesso: option.value });
                            if (errors.sesso) setErrors({ ...errors, sesso: "" });
                          }}
                          className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                            formData.sesso === option.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50 text-muted-foreground"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {errors.sesso && (
                      <p className="text-sm text-destructive">{errors.sesso}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data di nascita</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="birthDate"
                        placeholder="gg/mm/aaaa"
                        value={formData.birthDate}
                        onChange={(e) => {
                          const formatted = formatDateInput(e.target.value);
                          setFormData({ ...formData, birthDate: formatted });
                          if (errors.birthDate) setErrors({ ...errors, birthDate: "" });
                        }}
                        className="pl-10 input-cosmic"
                        maxLength={10}
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="text-sm text-destructive">{errors.birthDate}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold text-center mb-2">
                  Le tue foto
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  La foto in primo piano è <span className="font-semibold text-foreground">obbligatoria</span> per fornirti ogni giorno consigli di abbigliamento personalizzati, 
                  basati sul tuo aspetto fisico, il tuo colorito e la tua corporatura.
                </p>
                <p className="text-sm text-muted-foreground text-center mb-2">
                  💡 <span className="font-medium text-foreground">Consiglio:</span> carica anche le foto a figura intera per ottenere suggerimenti di outfit ancora più precisi, 
                  basati sulla tua corporatura reale.
                </p>
                <p className="text-xs text-muted-foreground text-center mb-8 italic">
                  Le foto sono private e visibili solo a te. Verranno utilizzate esclusivamente per generare suggerimenti di outfit su misura.
                </p>

                <div className="grid gap-4">
                  {[
                    { key: "face" as const, label: "Viso (obbligatoria)", required: true },
                    { key: "fullFront" as const, label: "Figura intera frontale (consigliata)", required: false },
                    { key: "fullSide" as const, label: "Figura intera laterale (consigliata)", required: false },
                  ].map((photo) => (
                    <div key={photo.key} className="space-y-2">
                      <Label>{photo.label}</Label>
                      <label
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          photoPreviews[photo.key]
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        {photoPreviews[photo.key] ? (
                          <div className="relative w-full h-full">
                            <img
                              src={photoPreviews[photo.key]}
                              alt={photo.label}
                              className="w-full h-full object-contain rounded-xl"
                            />
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="w-8 h-8" />
                            <span className="text-sm">Clicca per caricare</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange(photo.key)}
                        />
                      </label>
                      {errors[photo.key] && (
                        <p className="text-sm text-destructive">{errors[photo.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold text-center mb-2">
                  Conferma i tuoi dati
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  Verifica che tutto sia corretto
                </p>

                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome</span>
                      <span className="font-medium">{formData.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cognome</span>
                      <span className="font-medium">{formData.cognome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sesso</span>
                      <span className="font-medium">{formData.sesso === "M" ? "Uomo" : "Donna"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data di nascita</span>
                      <span className="font-medium">{formData.birthDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Foto caricate</span>
                      <span className="font-medium">
                        {Object.values(formData.photos).filter(Boolean).length}/3
                      </span>
                    </div>
                  </div>

                  {/* Photo previews */}
                  <div className="flex gap-2 justify-center">
                    {Object.entries(photoPreviews).map(([key, url]) => (
                      <div key={key} className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Cliccando "Completa" accetti i nostri termini di servizio e la privacy policy.
                    Le tue foto saranno conservate in modo sicuro.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Indietro
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                variant="cosmic"
                onClick={handleNext}
                className="flex-1"
              >
                Avanti
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="cosmic"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Salvataggio...
                  </span>
                ) : (
                  "Completa"
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;

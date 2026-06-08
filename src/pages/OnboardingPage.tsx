import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronLeft, Camera, X, Star } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { calculateDestinyNumber, calculateSoulNumber, calculateExpressionNumber, displayNumber, isMasterNumber } from '@/lib/numerology';
import { toast } from 'sonner';

// Local type for in-progress photo before Supabase upload
type LocalPhoto = { id: string; file: File; previewUrl: string };

// ─── Step 1: Numerological identity ──────────────────────────────────────────

function Step1({
  firstName, setFirstName,
  lastName, setLastName,
  birthDate, setBirthDate,
  gender, setGender,
  lookingFor, setLookingFor,
  onNext,
}: {
  firstName: string; setFirstName: (v: string) => void;
  lastName: string; setLastName: (v: string) => void;
  birthDate: string; setBirthDate: (v: string) => void;
  gender: 'M' | 'F' | 'N'; setGender: (v: 'M' | 'F' | 'N') => void;
  lookingFor: 'M' | 'F' | 'B'; setLookingFor: (v: 'M' | 'F' | 'B') => void;
  onNext: () => void;
}) {
  const { t } = useLanguage();
  const to = t.onboarding;

  const canPreview = firstName.trim() && lastName.trim() && birthDate;
  const destiny    = canPreview ? calculateDestinyNumber(birthDate)           : null;
  const soul       = canPreview ? calculateSoulNumber(firstName, lastName)    : null;
  const expression = canPreview ? calculateExpressionNumber(firstName, lastName) : null;

  const numberBadge = (label: string, n: number) => (
    <div className="text-center">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-heading mx-auto mb-1 border ${isMasterNumber(n) ? 'border-accent bg-accent/20 text-accent' : 'border-primary/40 bg-primary/10 text-primary'}`}>
        {displayNumber(n)}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl mb-1">{to.step1Title}</h2>
        <p className="text-muted-foreground text-sm">{to.step1Subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">{to.firstName}</label>
          <input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">{to.lastName}</label>
          <input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">{to.birthDate}</label>
        <input
          type="date"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm text-muted-foreground mb-2">{to.gender}</label>
        <div className="flex gap-2">
          {(['M', 'F', 'N'] as const).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${gender === g ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
            >
              {g === 'M' ? to.genderM : g === 'F' ? to.genderF : to.genderN}
            </button>
          ))}
        </div>
      </div>

      {/* Looking for */}
      <div>
        <label className="block text-sm text-muted-foreground mb-2">{to.lookingFor}</label>
        <div className="flex gap-2">
          {(['M', 'F', 'B'] as const).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => setLookingFor(l)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${lookingFor === l ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
            >
              {l === 'M' ? to.lookingM : l === 'F' ? to.lookingF : to.lookingB}
            </button>
          ))}
        </div>
      </div>

      {/* Live numerology preview */}
      {canPreview && destiny !== null && soul !== null && expression !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 border border-border rounded-2xl p-4"
        >
          <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-widest">{to.yourNumbers}</p>
          <div className="flex justify-around">
            {numberBadge(to.destinyLabel, destiny)}
            {numberBadge(to.soulLabel, soul)}
            {numberBadge(to.expressionLabel, expression)}
          </div>
        </motion.div>
      )}

      <button
        onClick={onNext}
        disabled={!firstName.trim() || !lastName.trim() || !birthDate}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-lg glow-primary hover:opacity-90 transition disabled:opacity-40"
      >
        {to.next}
      </button>
    </div>
  );
}

// ─── Step 2: Photos ───────────────────────────────────────────────────────────

function Step2({
  photos,
  setPhotos,
  onNext,
  onBack,
}: {
  photos: LocalPhoto[];
  setPhotos: (photos: LocalPhoto[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useLanguage();
  const to = t.onboarding;
  const fileRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      photos.forEach(p => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (photos.length >= 20) {
      toast.error(to.maxPhotos);
      return;
    }
    const newPhotos: LocalPhoto[] = [
      ...photos,
      ...files.slice(0, 20 - photos.length).map(file => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ];
    setPhotos(newPhotos);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removePhoto = (id: string) => {
    const removed = photos.find(p => p.id === id);
    if (removed) URL.revokeObjectURL(removed.previewUrl);
    setPhotos(photos.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl mb-1">{to.step2Title}</h2>
        <p className="text-muted-foreground text-sm">{to.step2Subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, idx) => (
          <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={photo.previewUrl} alt="" className="w-full h-full object-cover" />
            {idx === 0 && (
              <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5 inline mr-0.5" />main
              </div>
            )}
            <button
              onClick={() => removePhoto(photo.id)}
              className="absolute top-1 right-1 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {photos.length < 20 && (
          <button
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition"
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs">{to.addPhoto}</span>
          </button>
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground">{photos.length}/20 {to.maxPhotos}</p>

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAdd} />

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition flex items-center justify-center gap-1">
          <ChevronLeft className="w-4 h-4" /> {to.back}
        </button>
        <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
          {to.next}
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Bio & city ───────────────────────────────────────────────────────

function Step3({
  city, setCity,
  bio, setBio,
  onFinish,
  onBack,
  loading,
}: {
  city: string; setCity: (v: string) => void;
  bio: string; setBio: (v: string) => void;
  onFinish: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  const { t } = useLanguage();
  const to = t.onboarding;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl mb-1">{to.step3Title}</h2>
        <p className="text-muted-foreground text-sm">{to.step3Subtitle}</p>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">{to.cityLabel}</label>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">{to.bioLabel}</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder={to.bioPlaceholder}
          rows={3}
          maxLength={200}
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
        />
        <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/200</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition flex items-center justify-center gap-1">
          <ChevronLeft className="w-4 h-4" /> {to.back}
        </button>
        <button
          onClick={onFinish}
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? '…' : to.finish}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { t } = useLanguage();
  const { updateProfile, uploadPhoto } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]           = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender]       = useState<'M' | 'F' | 'N'>('N');
  const [lookingFor, setLookingFor] = useState<'M' | 'F' | 'B'>('B');
  const [photos, setPhotos]       = useState<LocalPhoto[]>([]);
  const [city, setCity]           = useState('');
  const [bio, setBio]             = useState('');
  const [loading, setLoading]     = useState(false);

  const to = t.onboarding;

  const handleFinish = async () => {
    setLoading(true);
    try {
      // 1. Save text fields and mark onboarding complete
      await updateProfile({
        firstName,
        lastName,
        birthDate,
        gender,
        lookingFor,
        bio,
        city,
        onboardingComplete: true,
      });

      // 2. Upload photos sequentially to preserve order
      for (let i = 0; i < photos.length; i++) {
        await uploadPhoto(photos[i].file, i);
      }

      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    enter:  { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit:   { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-heading text-xl text-gradient-gold">NumFlame</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {to.step} {step} {to.of} 3
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <Step1
                  firstName={firstName} setFirstName={setFirstName}
                  lastName={lastName}   setLastName={setLastName}
                  birthDate={birthDate} setBirthDate={setBirthDate}
                  gender={gender}       setGender={setGender}
                  lookingFor={lookingFor} setLookingFor={setLookingFor}
                  onNext={() => setStep(2)}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <Step2
                  photos={photos}
                  setPhotos={setPhotos}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <Step3
                  city={city}   setCity={setCity}
                  bio={bio}     setBio={setBio}
                  onFinish={handleFinish}
                  onBack={() => setStep(2)}
                  loading={loading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

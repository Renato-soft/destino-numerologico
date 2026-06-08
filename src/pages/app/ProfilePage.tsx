import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Star, Pencil, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useNumerologyTexts } from '@/i18n/numerologyTranslations';
import { useAuth } from '@/contexts/AuthContext';
import { UserPhoto } from '@/lib/auth';
import { displayNumber, isMasterNumber } from '@/lib/numerology';
import { toast } from 'sonner';

// ─── Photo grid ───────────────────────────────────────────────────────────────

function PhotoGrid({ photos, onAdd, onRemove }: {
  photos: UserPhoto[];
  onAdd: (files: FileList) => void;
  onRemove: (photo: UserPhoto) => void;
}) {
  const { t } = useLanguage();
  const a = t.app;
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-lg">{a.profPhotos}</h3>
        <span className="text-xs text-muted-foreground">{photos.length}/20</span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {photos.map((photo, idx) => (
          <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={photo.url} alt="" className="w-full h-full object-cover" />
            {idx === 0 && (
              <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5" /> main
              </div>
            )}
            <button
              onClick={() => onRemove(photo)}
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
            <Camera className="w-5 h-5" />
            <span className="text-xs">{a.profAddPhoto}</span>
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => {
          if (e.target.files) {
            onAdd(e.target.files);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}

// ─── Edit info form ───────────────────────────────────────────────────────────

function EditInfoForm({ onSave, onCancel }: {
  onSave: (data: { firstName: string; lastName: string; birthDate: string; bio: string; city: string }) => void;
  onCancel: () => void;
}) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const a = t.app;

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName,  setLastName]  = useState(user?.lastName ?? '');
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? '');
  const [bio,       setBio]       = useState(user?.bio ?? '');
  const [city,      setCity]      = useState(user?.city ?? '');

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">{a.profFirstName}</label>
          <input value={firstName} onChange={e => setFirstName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">{a.profLastName}</label>
          <input value={lastName} onChange={e => setLastName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">{a.profBirthDate}</label>
        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm" />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">{a.profCity}</label>
        <input value={city} onChange={e => setCity(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm" />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">{a.profBio}</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} maxLength={200}
          className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none text-sm" />
        <p className="text-xs text-muted-foreground/60 text-right">{bio.length}/200</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground transition text-sm">
          {a.profCancel}
        </button>
        <button
          onClick={() => onSave({ firstName, lastName, birthDate, bio, city })}
          disabled={!firstName.trim() || !lastName.trim() || !birthDate}
          className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition text-sm disabled:opacity-40 flex items-center justify-center gap-1"
        >
          <Check className="w-4 h-4" /> {a.profSave}
        </button>
      </div>
    </div>
  );
}

// ─── Number pill ──────────────────────────────────────────────────────────────

function NumPill({ label, value }: { label: string; value: number }) {
  const { t } = useLanguage();
  const { numberMeanings } = useNumerologyTexts();
  const a = t.app;
  const [open, setOpen] = useState(false);
  const meaning = numberMeanings[value];
  const isMaster = isMasterNumber(value);

  return (
    <div
      className={`rounded-xl border p-3 cursor-pointer transition ${isMaster ? 'border-accent/30 bg-accent/5' : 'border-border bg-card'} ${open ? 'shadow-md' : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-heading text-lg shrink-0 ${isMaster ? 'border-accent/40 text-accent' : 'border-primary/30 text-primary'}`}>
            {displayNumber(value)}
          </div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            {meaning && <p className="text-xs text-muted-foreground">{meaning.keywords.join(' · ')}</p>}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </div>
      {open && meaning && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-border/50 space-y-1 text-xs text-muted-foreground"
        >
          <p><span className="text-foreground/70 font-medium">{a.dashTalents}:</span> {meaning.talents}</p>
          <p><span className="text-foreground/70 font-medium">{a.dashShadow}:</span> {meaning.shadow}</p>
          <p><span className="text-foreground/70 font-medium">{a.dashEvolution}:</span> {meaning.evolution}</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, updateProfile, uploadPhoto, deletePhoto } = useAuth();
  const a = t.app;

  const [editing, setEditing] = useState(false);

  if (!user) return null;
  const num = user.numerology;
  const mainPhoto = user.photos[0]?.url ?? null;

  const handleAddPhotos = async (files: FileList) => {
    if (user.photos.length >= 20) {
      toast.error(a.profMaxPhotos);
      return;
    }
    const toAdd = Array.from(files).slice(0, 20 - user.photos.length);
    try {
      for (let i = 0; i < toAdd.length; i++) {
        await uploadPhoto(toAdd[i], user.photos.length + i);
      }
      toast.success(a.profSaved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleRemovePhoto = async (photo: UserPhoto) => {
    try {
      await deletePhoto(photo);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleSaveInfo = async (data: { firstName: string; lastName: string; birthDate: string; bio: string; city: string }) => {
    try {
      await updateProfile(data);
      setEditing(false);
      toast.success(a.profSaved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-primary/30 shrink-0">
          {mainPhoto ? (
            <img src={mainPhoto} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-heading text-3xl text-primary">
              {user.firstName?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-heading text-2xl">{user.firstName} {user.lastName}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </motion.div>

      {/* Edit info */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg">{a.profEditInfo}</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Pencil className="w-3.5 h-3.5" /> {a.profEditInfo}
            </button>
          )}
        </div>

        {!editing ? (
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            {[
              { label: a.profFirstName, val: user.firstName },
              { label: a.profLastName,  val: user.lastName },
              { label: a.profBirthDate, val: user.birthDate },
              { label: a.profCity,      val: user.city },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium">{val || '—'}</p>
              </div>
            ))}
            {user.bio && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">{a.profBio}</p>
                <p className="font-medium">{user.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <EditInfoForm onSave={handleSaveInfo} onCancel={() => setEditing(false)} />
        )}
      </div>

      {/* Photos */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <PhotoGrid photos={user.photos} onAdd={handleAddPhotos} onRemove={handleRemovePhoto} />
      </div>

      {/* Numerology numbers */}
      {num && (
        <div className="space-y-3">
          <h3 className="font-heading text-lg">{a.dashMyMap}</h3>
          {[
            { label: t.numbers.destiny,      value: num.destiny },
            { label: t.numbers.soul,         value: num.soul },
            { label: t.numbers.expression,   value: num.expression },
            { label: t.numbers.persona,      value: num.persona },
            { label: t.numbers.quintessence, value: num.quintessence },
          ].map(({ label, value }) => (
            <NumPill key={label} label={label} value={value} />
          ))}
        </div>
      )}
    </div>
  );
}

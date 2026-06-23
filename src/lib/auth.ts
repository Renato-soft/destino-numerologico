/**
 * NumFlame — Auth & Profile (Supabase)
 */
import { supabase, getPhotoUrl } from './supabase';
import { calculateFullProfile, NumerologyProfile } from './numerology';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserPhoto {
  id: string;
  storagePath: string;
  displayOrder: number;
  url: string; // public URL from Storage
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'M' | 'F' | 'N';
  lookingFor: 'M' | 'F' | 'B';
  bio: string;
  city: string;
  photos: UserPhoto[];
  numerology: NumerologyProfile;
  onboardingComplete: boolean;
}

// ─── DB row → UserProfile ─────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProfile(row: any, photoRows: any[] = []): UserProfile {
  const firstName = row.first_name ?? '';
  const lastName  = row.last_name  ?? '';
  const birthDate = row.birth_date ?? '';

  const numerology =
    firstName && lastName && birthDate
      ? calculateFullProfile(firstName, lastName, birthDate)
      : ({} as NumerologyProfile);

  const photos: UserPhoto[] = (photoRows ?? [])
    .sort((a, b) => a.display_order - b.display_order)
    .map(p => ({
      id:           p.id,
      storagePath:  p.storage_path,
      displayOrder: p.display_order,
      url:          getPhotoUrl(p.storage_path),
    }));

  return {
    id:                 row.id,
    email:              row.email ?? '',
    firstName,
    lastName,
    birthDate,
    gender:             (row.gender     ?? 'N') as UserProfile['gender'],
    lookingFor:         (row.looking_for ?? 'B') as UserProfile['lookingFor'],
    bio:                row.bio  ?? '',
    city:               row.city ?? '',
    photos,
    numerology,
    onboardingComplete: row.onboarding_complete ?? false,
  };
}

// ─── Load profile from DB ─────────────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const [{ data: profile }, { data: photos }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('user_photos').select('*').eq('user_id', userId).order('display_order'),
  ]);

  if (!profile) return null;
  return mapProfile(profile, photos ?? []);
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function register(email: string, password: string): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error('No user returned from signUp');

  // Se la sessione è null la conferma email è abilitata → l'utente non è
  // ancora autenticato e non può leggere/scrivere il proprio profilo.
  if (!data.session) {
    throw new Error('CONFIRM_EMAIL');
  }

  // Assicuriamo che il client usi la sessione appena ottenuta
  await supabase.auth.setSession(data.session);

  // Il trigger crea la riga profiles automaticamente; attendiamo con retry
  for (let i = 0; i < 10; i++) {
    const profile = await fetchProfile(data.user.id);
    if (profile) return profile;
    await new Promise(r => setTimeout(r, 500));
  }

  // Fallback: il trigger potrebbe aver avuto un ritardo, inseriamo manualmente
  await supabase
    .from('profiles')
    .insert({ id: data.user.id, email: data.user.email ?? '' })
    .maybeSingle();                    // ignora conflict se nel frattempo è arrivato

  for (let i = 0; i < 5; i++) {
    const profile = await fetchProfile(data.user.id);
    if (profile) return profile;
    await new Promise(r => setTimeout(r, 400));
  }

  throw new Error('Profile not created in time');
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('No user returned from signIn');

  let profile = await fetchProfile(data.user.id);

  // Fallback: se il trigger non ha creato il profilo (raro), lo creiamo ora
  if (!profile) {
    await supabase
      .from('profiles')
      .insert({ id: data.user.id, email: data.user.email ?? '' })
      .maybeSingle();
    profile = await fetchProfile(data.user.id);
  }

  if (!profile) throw new Error('Profile not found');
  return profile;
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

// ─── Update profile ──────────────────────────────────────────────────────────

export interface ProfileUpdate {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: UserProfile['gender'];
  lookingFor?: UserProfile['lookingFor'];
  bio?: string;
  city?: string;
  onboardingComplete?: boolean;
}

export async function updateProfile(
  userId: string,
  patch: ProfileUpdate
): Promise<UserProfile> {
  const fn = patch.firstName;
  const ln = patch.lastName;
  const bd = patch.birthDate;

  // Ricalcola numeri numerologici se cambiano dati anagrafici
  let numFields = {};
  if (fn && ln && bd) {
    const n = calculateFullProfile(fn, ln, bd);
    numFields = {
      num_destiny:         n.destiny,
      num_soul:            n.soul,
      num_expression:      n.expression,
      num_persona:         n.persona,
      num_quintessence:    n.quintessence,
      num_personal_year:   n.personalYear,
      num_personal_month:  n.personalMonth,
      num_personal_day:    n.personalDay,
      num_shadow_main:     n.shadow.main,
      num_shadow_youth:    n.shadow.youth,
      num_shadow_maturity: n.shadow.maturity,
      num_cycle_first:     n.lifeCycles.first,
      num_cycle_second:    n.lifeCycles.second,
      num_cycle_third:     n.lifeCycles.third,
    };
  }

  const dbPatch: Record<string, unknown> = {
    ...(patch.firstName         !== undefined && { first_name:          patch.firstName }),
    ...(patch.lastName          !== undefined && { last_name:           patch.lastName }),
    ...(patch.birthDate         !== undefined && { birth_date:          patch.birthDate }),
    ...(patch.gender            !== undefined && { gender:              patch.gender }),
    ...(patch.lookingFor        !== undefined && { looking_for:         patch.lookingFor }),
    ...(patch.bio               !== undefined && { bio:                 patch.bio }),
    ...(patch.city              !== undefined && { city:                patch.city }),
    ...(patch.onboardingComplete !== undefined && { onboarding_complete: patch.onboardingComplete }),
    ...numFields,
  };

  const { error } = await supabase
    .from('profiles')
    .update(dbPatch)
    .eq('id', userId);

  if (error) throw error;

  const profile = await fetchProfile(userId);
  if (!profile) throw new Error('Profile not found after update');
  return profile;
}

// ─── Photos ───────────────────────────────────────────────────────────────────

export async function uploadPhoto(
  userId: string,
  file: File,
  displayOrder: number
): Promise<UserPhoto> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('user-photos')
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) throw uploadError;

  const { data: row, error: dbError } = await supabase
    .from('user_photos')
    .insert({ user_id: userId, storage_path: storagePath, display_order: displayOrder })
    .select()
    .single();

  if (dbError) throw dbError;

  return {
    id:           row.id,
    storagePath:  row.storage_path,
    displayOrder: row.display_order,
    url:          getPhotoUrl(storagePath),
  };
}

export async function deletePhoto(photo: UserPhoto): Promise<void> {
  await Promise.all([
    supabase.storage.from('user-photos').remove([photo.storagePath]),
    supabase.from('user_photos').delete().eq('id', photo.id),
  ]);
}

export async function reorderPhotos(
  userId: string,
  orderedIds: string[]
): Promise<void> {
  await Promise.all(
    orderedIds.map((id, idx) =>
      supabase
        .from('user_photos')
        .update({ display_order: idx })
        .eq('id', id)
        .eq('user_id', userId)
    )
  );
}

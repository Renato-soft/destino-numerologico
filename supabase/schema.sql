-- ============================================================
-- NumFlame — Database Schema
-- Esegui questo file nel SQL Editor di Supabase
-- https://supabase.com/dashboard/project/viqnjvscvbohfbtcnjch/sql
-- ============================================================

-- ─── PROFILES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email           TEXT NOT NULL DEFAULT '',
  first_name      TEXT NOT NULL DEFAULT '',
  last_name       TEXT NOT NULL DEFAULT '',
  birth_date      DATE,
  gender          TEXT DEFAULT 'N' CHECK (gender IN ('M','F','N')),
  looking_for     TEXT DEFAULT 'B' CHECK (looking_for IN ('M','F','B')),
  bio             TEXT DEFAULT '',
  city            TEXT DEFAULT '',

  -- Numerology cache (calcolato al salvataggio del profilo)
  num_destiny          SMALLINT,
  num_soul             SMALLINT,
  num_expression       SMALLINT,
  num_persona          SMALLINT,
  num_quintessence     SMALLINT,
  num_personal_year    SMALLINT,
  num_personal_month   SMALLINT,
  num_personal_day     SMALLINT,
  num_shadow_main      SMALLINT,
  num_shadow_youth     SMALLINT,
  num_shadow_maturity  SMALLINT,
  num_cycle_first      SMALLINT,
  num_cycle_second     SMALLINT,
  num_cycle_third      SMALLINT,

  onboarding_complete  BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─── USER PHOTOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_photos (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  storage_path   TEXT NOT NULL,
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WAITLIST ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.waitlist (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  birth_date  DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist    ENABLE ROW LEVEL SECURITY;

-- Profiles: ogni utente autenticato può leggere i profili completi (per il matching)
DROP POLICY IF EXISTS "Authenticated users can read profiles"    ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"             ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"             ON public.profiles;

CREATE POLICY "Authenticated users can read profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Photos: lettura per tutti gli autenticati, scrittura solo al proprietario
DROP POLICY IF EXISTS "Authenticated users can view photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can manage own photos"         ON public.user_photos;

CREATE POLICY "Authenticated users can view photos"
  ON public.user_photos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own photos"
  ON public.user_photos FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Waitlist: inserimento pubblico, lettura solo propria riga
DROP POLICY IF EXISTS "Anyone can join waitlist"   ON public.waitlist;
DROP POLICY IF EXISTS "Users read own waitlist row" ON public.waitlist;

CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users read own waitlist row"
  ON public.waitlist FOR SELECT
  USING (true);

-- ─── TRIGGER: crea profilo alla registrazione ────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── TRIGGER: aggiorna updated_at ────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── STORAGE BUCKET ──────────────────────────────────────────
-- Crea il bucket (idempotente)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy storage: chiunque può leggere (bucket pubblico)
DROP POLICY IF EXISTS "Public read user photos"  ON storage.objects;
DROP POLICY IF EXISTS "Owners can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Owners can delete photos" ON storage.objects;

CREATE POLICY "Public read user photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-photos');

CREATE POLICY "Owners can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Owners can delete photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

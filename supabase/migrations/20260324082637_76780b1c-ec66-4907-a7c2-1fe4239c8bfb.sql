
CREATE TABLE public.feature_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key text UNIQUE NOT NULL,
  feature_label text NOT NULL,
  unlock_after_days integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_schedule ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read (needed to check unlock status)
CREATE POLICY "Anyone authenticated can read feature_schedule"
  ON public.feature_schedule FOR SELECT TO authenticated
  USING (true);

-- Insert default features
INSERT INTO public.feature_schedule (feature_key, feature_label, unlock_after_days) VALUES
  ('daily_analysis', 'Analisi Giornaliera', 0),
  ('map', 'Mappa Numerologica', 0),
  ('outfits', 'Outfit del Giorno', 0),
  ('personal_year', 'Anno Personale', 5),
  ('pillars', '9 Pilastri', 7),
  ('dates', 'Date Favorevoli', 10),
  ('chat', 'Chat AI', 7),
  ('community', 'Community', 3),
  ('brand', 'Brand Analyzer', 0),
  ('house', 'Casa Vibrazione', 0),
  ('compatibility', 'Compatibilità', 0),
  ('advanced_report', 'Report Avanzato', 0);

INSERT INTO storage.buckets (id, name, public)
VALUES ('meditation-music', 'meditation-music', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read meditation music"
ON storage.objects FOR SELECT
USING (bucket_id = 'meditation-music');

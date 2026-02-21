
-- Create storage bucket for AI-generated outfit images
INSERT INTO storage.buckets (id, name, public) VALUES ('generated-images', 'generated-images', false);

-- Users can view their own generated images
CREATE POLICY "Users can view their own generated images"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow service role to insert (edge function uses service role)
CREATE POLICY "Service role can insert generated images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'generated-images');

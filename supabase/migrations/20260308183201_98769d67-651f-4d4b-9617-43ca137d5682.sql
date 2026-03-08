
CREATE TABLE public.advanced_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'generating',
  sections jsonb NOT NULL DEFAULT '{}',
  edited_sections jsonb,
  generated_at timestamp with time zone,
  finalized_at timestamp with time zone,
  pdf_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.advanced_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports" ON public.advanced_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" ON public.advanced_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON public.advanced_reports
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" ON public.advanced_reports
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_advanced_reports_updated_at
  BEFORE UPDATE ON public.advanced_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

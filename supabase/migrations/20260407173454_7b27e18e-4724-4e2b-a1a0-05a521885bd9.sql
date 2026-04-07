
CREATE TABLE public.user_service_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  service_key text NOT NULL,
  granted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, service_key)
);

ALTER TABLE public.user_service_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own overrides"
  ON public.user_service_overrides
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

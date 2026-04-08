
-- Table for admin-managed promotions
CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration_hours integer NOT NULL DEFAULT 48,
  is_active boolean NOT NULL DEFAULT false,
  activated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Everyone can read promotions (landing page needs this)
CREATE POLICY "Anyone can view active promotions"
  ON public.promotions FOR SELECT
  USING (true);

-- Table to track user claims of promotions
CREATE TABLE public.user_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  promotion_id uuid NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, promotion_id)
);

ALTER TABLE public.user_promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own promotion claims"
  ON public.user_promotions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim promotions"
  ON public.user_promotions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at on promotions
CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- Pillar progress tracking
CREATE TABLE public.pillar_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pillar_index integer NOT NULL CHECK (pillar_index >= 0 AND pillar_index <= 6),
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  started_at timestamp with time zone,
  exercise_completed boolean NOT NULL DEFAULT false,
  meditation_completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, pillar_index)
);

ALTER TABLE public.pillar_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pillar progress" ON public.pillar_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pillar progress" ON public.pillar_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pillar progress" ON public.pillar_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Badges earned
CREATE TABLE public.pillar_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id text NOT NULL,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

ALTER TABLE public.pillar_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges" ON public.pillar_badges
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" ON public.pillar_badges
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

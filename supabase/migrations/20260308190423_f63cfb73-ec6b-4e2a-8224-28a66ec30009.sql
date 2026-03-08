
-- Notifications table
CREATE TABLE public.community_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  actor_name text NOT NULL,
  type text NOT NULL, -- 'reaction' or 'comment'
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  post_preview text NOT NULL DEFAULT '',
  vibration integer,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.community_notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.community_notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON public.community_notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Allow inserts from authenticated (triggers run as table owner, but we also need app inserts)
CREATE POLICY "Authenticated can insert notifications" ON public.community_notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Function: create notification on reaction
CREATE OR REPLACE FUNCTION public.notify_on_reaction()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  post_owner uuid;
  post_text text;
  actor text;
BEGIN
  SELECT user_id, left(content, 80) INTO post_owner, post_text
    FROM community_posts WHERE id = NEW.post_id;

  IF post_owner IS NULL OR post_owner = NEW.user_id THEN
    RETURN NEW;
  END IF;

  SELECT nome INTO actor FROM profiles WHERE user_id = NEW.user_id LIMIT 1;

  INSERT INTO community_notifications (user_id, actor_name, type, post_id, post_preview, vibration)
  VALUES (post_owner, COALESCE(actor, 'Qualcuno'), 'reaction', NEW.post_id, COALESCE(post_text, ''), NEW.vibration);

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_reaction
  AFTER INSERT ON public.community_reactions
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_reaction();

-- Function: create notification on comment
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  post_owner uuid;
  post_text text;
BEGIN
  SELECT user_id, left(content, 80) INTO post_owner, post_text
    FROM community_posts WHERE id = NEW.post_id;

  IF post_owner IS NULL OR post_owner = NEW.user_id THEN
    RETURN NEW;
  END IF;

  INSERT INTO community_notifications (user_id, actor_name, type, post_id, post_preview)
  VALUES (post_owner, NEW.author_name, 'comment', NEW.post_id, COALESCE(post_text, ''));

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_comment
  AFTER INSERT ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_notifications;

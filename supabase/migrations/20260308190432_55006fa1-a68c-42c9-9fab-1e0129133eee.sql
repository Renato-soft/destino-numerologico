
DROP POLICY "Authenticated can insert notifications" ON public.community_notifications;
CREATE POLICY "Only triggers can insert notifications" ON public.community_notifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

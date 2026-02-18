
-- Drop all restrictive policies and recreate as permissive

-- profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);

-- numerology_maps
DROP POLICY IF EXISTS "Users can insert their own maps" ON public.numerology_maps;
DROP POLICY IF EXISTS "Users can update their own maps" ON public.numerology_maps;
DROP POLICY IF EXISTS "Users can view their own maps" ON public.numerology_maps;

CREATE POLICY "Users can insert their own maps" ON public.numerology_maps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own maps" ON public.numerology_maps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own maps" ON public.numerology_maps FOR SELECT USING (auth.uid() = user_id);

-- chat_sessions
DROP POLICY IF EXISTS "Users can insert their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON public.chat_sessions;

CREATE POLICY "Users can insert their own chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- chat_messages
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.chat_messages;

CREATE POLICY "Users can insert their own messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);

-- photos
DROP POLICY IF EXISTS "Users can insert their own photos" ON public.photos;
DROP POLICY IF EXISTS "Users can update their own photos" ON public.photos;
DROP POLICY IF EXISTS "Users can view their own photos" ON public.photos;
DROP POLICY IF EXISTS "Users can delete their own photos" ON public.photos;

CREATE POLICY "Users can insert their own photos" ON public.photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own photos" ON public.photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own photos" ON public.photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own photos" ON public.photos FOR DELETE USING (auth.uid() = user_id);

-- daily_reports
DROP POLICY IF EXISTS "Users can view their own reports" ON public.daily_reports;

CREATE POLICY "Users can view their own reports" ON public.daily_reports FOR SELECT USING (auth.uid() = user_id);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

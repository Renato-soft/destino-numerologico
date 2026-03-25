
-- Allow anonymous users to read community posts (for landing page preview)
CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT TO anon USING (true);

-- Allow anonymous users to read community comments
CREATE POLICY "Anyone can view comments" ON public.community_comments FOR SELECT TO anon USING (true);

-- Allow anonymous users to read community reactions
CREATE POLICY "Anyone can view reactions" ON public.community_reactions FOR SELECT TO anon USING (true);

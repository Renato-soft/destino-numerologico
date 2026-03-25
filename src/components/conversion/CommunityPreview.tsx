import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, ArrowRight, Sparkles } from "lucide-react";

const vibrationEmojis: Record<number, string> = {
  1: "🔥", 2: "🤝", 3: "🎨", 4: "🏛️", 5: "🌪️", 6: "💝", 7: "🔮", 8: "💎", 9: "🌍",
};

interface PreviewPost {
  id: string;
  author_name: string;
  content: string;
  personal_year: number | null;
  created_at: string;
  comment_count: number;
  reactions: { vibration: number; count: number }[];
}

const formatTimeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}g`;
};

export default function CommunityPreview() {
  const [posts, setPosts] = useState<PreviewPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: postsData } = await supabase
        .from("community_posts")
        .select("id, author_name, content, personal_year, created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!postsData || postsData.length === 0) { setLoading(false); return; }

      const postIds = postsData.map(p => p.id);
      const [commentsRes, reactionsRes] = await Promise.all([
        supabase.from("community_comments").select("post_id").in("post_id", postIds),
        supabase.from("community_reactions").select("post_id, vibration").in("post_id", postIds),
      ]);

      const commentCounts: Record<string, number> = {};
      (commentsRes.data || []).forEach(c => {
        commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1;
      });

      const reactionsByPost: Record<string, Record<number, number>> = {};
      (reactionsRes.data || []).forEach(r => {
        if (!reactionsByPost[r.post_id]) reactionsByPost[r.post_id] = {};
        reactionsByPost[r.post_id][r.vibration] = (reactionsByPost[r.post_id][r.vibration] || 0) + 1;
      });

      setPosts(postsData.map(p => ({
        ...p,
        comment_count: commentCounts[p.id] || 0,
        reactions: Object.entries(reactionsByPost[p.id] || {}).map(([v, c]) => ({
          vibration: Number(v), count: c as number,
        })),
      })));
      setLoading(false);
    };
    load();
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Community attiva
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Unisciti a chi ha già scoperto{" "}
            <span className="text-gradient-gold">il potere dei numeri</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Migliaia di persone condividono esperienze, scoperte e consigli nella nostra community numerologica
          </p>
        </motion.div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-cosmic transition-all duration-300"
            >
              {/* Author */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold text-primary">
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.author_name}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span>{formatTimeAgo(post.created_at)}</span>
                    {post.personal_year && (
                      <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        Anno {post.personal_year}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 mb-3">
                {post.content}
              </p>

              {/* Reactions + comments */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {post.reactions.slice(0, 3).map((r) => (
                    <span
                      key={r.vibration}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted/30 text-[10px] text-muted-foreground"
                    >
                      {vibrationEmojis[r.vibration]} {r.count}
                    </span>
                  ))}
                </div>
                {post.comment_count > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MessageCircle className="w-3 h-3" />
                    {post.comment_count}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="cosmic" size="lg" asChild className="group">
              <Link to="/community">
                <Users className="w-5 h-5 mr-2" />
                Esplora la Community
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/auth?mode=signup">
                <Sparkles className="w-5 h-5 mr-2" />
                Registrati e partecipa
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Gratis • Nessuna carta richiesta • Unisciti alla conversazione
          </p>
        </motion.div>
      </div>
    </section>
  );
}

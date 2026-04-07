import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Users,
  Send,
  MessageCircle,
  Flag,
  Trash2,
  ChevronDown,
  Filter,
  Sparkles,
  Bell,
  X,
} from "lucide-react";

// Vibrational reaction emojis for numbers 1-9
const vibrationEmojis: Record<number, { emoji: string; label: string }> = {
  1: { emoji: "🔥", label: "Iniziativa" },
  2: { emoji: "🤝", label: "Armonia" },
  3: { emoji: "🎨", label: "Creatività" },
  4: { emoji: "🏛️", label: "Stabilità" },
  5: { emoji: "🌪️", label: "Cambiamento" },
  6: { emoji: "💝", label: "Amore" },
  7: { emoji: "🔮", label: "Intuizione" },
  8: { emoji: "💎", label: "Potere" },
  9: { emoji: "🌍", label: "Saggezza" },
};

interface Post {
  id: string;
  user_id: string;
  author_name: string;
  content: string;
  personal_year: number | null;
  created_at: string;
  comments: Comment[];
  reactions: Reaction[];
}

interface Comment {
  id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface Reaction {
  id: string;
  user_id: string;
  vibration: number;
}

const GUIDELINES = [
  "Condividi con rispetto e autenticità",
  "Offri supporto costruttivo",
  "Rispetta la privacy altrui",
  "Niente spam o promozioni",
];

export default function Community() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [personalYear, setPersonalYear] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("community_notifications" as any)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    setNotifications(data || []);
  }, [userId]);

  const markAllRead = async () => {
    if (!userId) return;
    await (supabase.from("community_notifications" as any) as any)
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
    setNotifications((prev) => prev.map((n: any) => ({ ...n, read: true })));
  };

  const loadPosts = useCallback(async () => {
    let query = supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (filterYear) {
      query = query.eq("personal_year", filterYear);
    }

    const { data: postsData } = await query;
    if (!postsData) { setPosts([]); return; }

    const postIds = postsData.map((p) => p.id);

    const [commentsRes, reactionsRes] = await Promise.all([
      supabase.from("community_comments").select("*").in("post_id", postIds).order("created_at", { ascending: true }),
      supabase.from("community_reactions").select("*").in("post_id", postIds),
    ]);

    const commentsMap: Record<string, Comment[]> = {};
    (commentsRes.data || []).forEach((c) => {
      if (!commentsMap[c.post_id]) commentsMap[c.post_id] = [];
      commentsMap[c.post_id].push(c);
    });

    const reactionsMap: Record<string, Reaction[]> = {};
    (reactionsRes.data || []).forEach((r) => {
      if (!reactionsMap[r.post_id]) reactionsMap[r.post_id] = [];
      reactionsMap[r.post_id].push(r);
    });

    setPosts(
      postsData.map((p) => ({
        ...p,
        comments: commentsMap[p.id] || [],
        reactions: reactionsMap[p.id] || [],
      }))
    );
  }, [filterYear]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);

        const [profileRes, mapRes] = await Promise.all([
          supabase.from("profiles").select("nome").eq("user_id", session.user.id).maybeSingle(),
          supabase.from("numerology_maps").select("personal_year").eq("user_id", session.user.id)
            .order("computed_at", { ascending: false }).limit(1).maybeSingle(),
        ]);

        if (profileRes.data) setUserName(profileRes.data.nome);
        if (mapRes.data) setPersonalYear(mapRes.data.personal_year);
      }

      await loadPosts();
      setLoading(false);
    };
    init();
  }, [loadPosts]);

  // Load notifications when userId is available
  useEffect(() => {
    if (userId) loadNotifications();
  }, [userId, loadNotifications]);

  // Realtime subscription + auto-refresh every 2 minutes
  useEffect(() => {
    const channel = supabase
      .channel("community-posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => {
        loadPosts();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_notifications" }, () => {
        loadNotifications();
      })
      .subscribe();

    const refreshInterval = setInterval(() => {
      loadPosts();
      loadNotifications();
    }, 2 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(refreshInterval);
    };
  }, [loadPosts, loadNotifications]);

  const handleCreatePost = async () => {
    const trimmed = newPostContent.trim();
    if (!trimmed || !userId) return;
    if (trimmed.length > 1000) {
      toast({ title: "Il messaggio è troppo lungo (max 1000 caratteri)", variant: "destructive" });
      return;
    }
    setPosting(true);

    const { error } = await supabase.from("community_posts").insert({
      user_id: userId,
      author_name: userName || "Anonimo",
      content: trimmed,
      personal_year: personalYear,
    });

    if (error) {
      toast({ title: "Errore nella pubblicazione", variant: "destructive" });
    } else {
      setNewPostContent("");
      await loadPosts();
    }
    setPosting(false);
  };

  const handleDeletePost = async (postId: string) => {
    await supabase.from("community_posts").delete().eq("id", postId);
    await loadPosts();
  };

  const handleReact = async (postId: string, vibration: number) => {
    if (!userId) return;

    const existing = posts
      .find((p) => p.id === postId)
      ?.reactions.find((r) => r.user_id === userId);

    if (existing) {
      if (existing.vibration === vibration) {
        await supabase.from("community_reactions").delete().eq("id", existing.id);
      } else {
        await supabase.from("community_reactions").update({ vibration }).eq("id", existing.id);
      }
    } else {
      await supabase.from("community_reactions").insert({ post_id: postId, user_id: userId, vibration });
    }
    await loadPosts();
  };

  const handleAddComment = async (postId: string) => {
    const text = (commentTexts[postId] || "").trim();
    if (!text || !userId) return;
    if (text.length > 500) {
      toast({ title: "Commento troppo lungo (max 500 caratteri)", variant: "destructive" });
      return;
    }

    await supabase.from("community_comments").insert({
      post_id: postId,
      user_id: userId,
      author_name: userName || "Anonimo",
      content: text,
    });

    setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
    await loadPosts();
  };

  const handleDeleteComment = async (commentId: string) => {
    await supabase.from("community_comments").delete().eq("id", commentId);
    await loadPosts();
  };

  const handleReport = async (postId: string) => {
    if (!userId || !reportReason.trim()) return;
    await supabase.from("community_reports").insert({
      post_id: postId,
      reporter_id: userId,
      reason: reportReason.trim(),
    });
    setReportingId(null);
    setReportReason("");
    toast({ title: "Segnalazione inviata. Grazie!" });
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "ora";
    if (diffMins < 60) return `${diffMins}m fa`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h fa`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}g fa`;
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const communityHeaderActions = (
    <div className="flex items-center gap-1">
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto rounded-xl border border-border bg-background shadow-2xl z-[9999]"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifiche</h3>
                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">Nessuna notifica</p>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((n: any) => (
                    <div
                      key={n.id}
                      className={`p-3 text-sm hover:bg-muted/50 cursor-pointer transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                      onClick={() => setShowNotifications(false)}
                    >
                      <p className="font-medium">
                        {n.type === "reaction"
                          ? `${n.actor_name} ha reagito ${vibrationEmojis[n.vibration]?.emoji || "✨"} al tuo post`
                          : `${n.actor_name} ha commentato il tuo post`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">"{n.post_preview}"</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTime(n.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowGuidelines(!showGuidelines)}
        className="text-xs text-muted-foreground"
      >
        Linee guida
      </Button>
    </div>
  );

  return (
    <DashboardLayout title="Community" headerActions={communityHeaderActions}>
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-5">
        {/* Guidelines */}
        <AnimatePresence>
          {showGuidelines && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-cosmic rounded-2xl p-5 space-y-2">
                <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Linee Guida della Community
                </h3>
                <ul className="space-y-1">
                  {GUIDELINES.map((g, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Post - only for logged-in users */}
        {userId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-cosmic rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold text-primary">
                {userName?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-sm font-medium">{userName || "Utente"}</p>
                {personalYear && (
                  <p className="text-[10px] text-muted-foreground">Anno Personale {personalYear}</p>
                )}
              </div>
            </div>
            <Textarea
              placeholder="Condividi la tua esperienza, una riflessione o una domanda..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              maxLength={1000}
              className="bg-input/50 border-border/50 min-h-[80px] resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {newPostContent.length}/1000
              </span>
              <Button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || posting}
                size="sm"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                <Send className="w-4 h-4 mr-1" />
                Pubblica
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-cosmic rounded-2xl p-5 text-center space-y-3"
          >
            <p className="text-sm text-muted-foreground">
              Registrati per partecipare alla discussione e condividere le tue esperienze!
            </p>
            <Button variant="cosmic" size="sm" asChild>
              <Link to="/auth?mode=signup">
                <Sparkles className="w-4 h-4 mr-2" />
                Registrati gratis
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs text-muted-foreground"
          >
            <Filter className="w-3.5 h-3.5 mr-1" />
            Filtra per Anno Personale
            <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
          {filterYear && (
            <Button variant="ghost" size="sm" onClick={() => setFilterYear(null)} className="text-xs text-primary">
              ✕ Anno {filterYear}
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => (
                  <Button
                    key={y}
                    variant={filterYear === y ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setFilterYear(filterYear === y ? null : y); }}
                    className={`text-xs ${filterYear === y ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "border-border/50"}`}
                  >
                    Anno {y}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Feed */}
        {posts.length === 0 && (
          <div className="glass-cosmic rounded-2xl p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {filterYear ? `Nessun post per Anno Personale ${filterYear}` : "Nessun post ancora. Sii il primo!"}
            </p>
          </div>
        )}

        {posts.map((post, i) => {
          const myReaction = post.reactions.find((r) => r.user_id === userId);
          const reactionCounts: Record<number, number> = {};
          post.reactions.forEach((r) => {
            reactionCounts[r.vibration] = (reactionCounts[r.vibration] || 0) + 1;
          });
          const commentsOpen = expandedComments.has(post.id);

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-cosmic rounded-2xl overflow-hidden"
            >
              {/* Post header */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary/40 to-primary/20 flex items-center justify-center text-sm font-bold text-foreground">
                      {post.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{post.author_name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{formatTime(post.created_at)}</span>
                        {post.personal_year && (
                          <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            Anno {post.personal_year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {post.user_id === userId && (
                      <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    )}
                    {post.user_id !== userId && (
                      <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setReportingId(reportingId === post.id ? null : post.id)}>
                        <Flag className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Report form */}
                <AnimatePresence>
                  {reportingId === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-3 space-y-2">
                        <p className="text-xs text-muted-foreground">Motivo della segnalazione:</p>
                        <Textarea
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          maxLength={300}
                          placeholder="Descrivi il problema..."
                          className="min-h-[60px] text-xs bg-input/50 border-border/30 resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => { setReportingId(null); setReportReason(""); }}>
                            Annulla
                          </Button>
                          <Button size="sm" className="text-xs h-7 bg-destructive text-destructive-foreground" onClick={() => handleReport(post.id)} disabled={!reportReason.trim()}>
                            Segnala
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Vibrational reactions */}
              <div className="px-5 pb-3">
                <div className="flex flex-wrap gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => {
                    const count = reactionCounts[v] || 0;
                    const isActive = myReaction?.vibration === v;
                    return (
                      <button
                        key={v}
                        onClick={() => userId ? handleReact(post.id, v) : navigate("/auth?mode=signup")}
                        className={`
                          flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all
                          ${isActive
                            ? "bg-primary/20 border border-primary/40 text-primary"
                            : "bg-muted/30 border border-transparent hover:bg-muted/50 text-muted-foreground"
                          }
                        `}
                        title={vibrationEmojis[v].label}
                      >
                        <span className="text-sm">{vibrationEmojis[v].emoji}</span>
                        {count > 0 && <span>{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comments toggle */}
              <div className="border-t border-border/20">
                <button
                  onClick={() => toggleComments(post.id)}
                  className="w-full px-5 py-2.5 flex items-center gap-2 text-xs text-muted-foreground hover:bg-muted/10 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {post.comments.length > 0
                    ? `${post.comments.length} comment${post.comments.length > 1 ? "i" : "o"}`
                    : "Commenta"
                  }
                  <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${commentsOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {commentsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 space-y-3">
                        {/* Existing comments */}
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted/40 flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0 mt-0.5">
                              {comment.author_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="rounded-xl bg-muted/20 px-3 py-2">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-medium">{comment.author_name}</span>
                                  <span className="text-[10px] text-muted-foreground">{formatTime(comment.created_at)}</span>
                                </div>
                                <p className="text-xs text-foreground/80 whitespace-pre-wrap">{comment.content}</p>
                              </div>
                            </div>
                            {comment.user_id === userId && (
                              <Button variant="ghost" size="icon" className="w-6 h-6 flex-shrink-0" onClick={() => handleDeleteComment(comment.id)}>
                                <Trash2 className="w-3 h-3 text-muted-foreground" />
                              </Button>
                            )}
                          </div>
                        ))}

                        {/* New comment input - only for logged-in users */}
                        {userId ? (
                          <div className="flex gap-2 items-end">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                              {userName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <Textarea
                                value={commentTexts[post.id] || ""}
                                onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                placeholder="Scrivi un commento..."
                                maxLength={500}
                                className="min-h-[36px] text-xs bg-input/30 border-border/30 resize-none py-2"
                              />
                              <Button
                                size="icon"
                                className="w-9 h-9 flex-shrink-0 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                                onClick={() => handleAddComment(post.id)}
                                disabled={!(commentTexts[post.id] || "").trim()}
                              >
                                <Send className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <Button variant="ghost" size="sm" className="text-xs text-primary" asChild>
                              <Link to="/auth?mode=signup">Registrati per commentare</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

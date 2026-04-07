import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  ArrowLeft,
  Send,
  Loader2,
  User,
  Bot,
  Plus,
  X,
  Download,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  imageUrl?: string;
}

interface Profile {
  nome: string;
  cognome: string;
  birth_date: string;
}

interface NumerologyContext {
  destino: number;
  io: number;
  soul: number;
  personality: number;
  personalYear: number;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [numerologyContext, setNumerologyContext] = useState<NumerologyContext | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("nome, cognome, birth_date")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!profileData) {
      navigate("/onboarding");
      return;
    }

    setProfile(profileData);

    // Load numerology data
    const { data: mapData } = await supabase
      .from("numerology_maps")
      .select("life_path, destiny_expression, soul, personality, personal_year")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (mapData) {
      setNumerologyContext({
        destino: mapData.life_path,
        io: mapData.destiny_expression,
        soul: mapData.soul,
        personality: mapData.personality,
        personalYear: mapData.personal_year,
      });
    }

    // Get or create chat session
    const { data: existingSession } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSession) {
      setSessionId(existingSession.id);

      // Load messages
      const { data: messagesData } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", existingSession.id)
        .order("created_at", { ascending: true });

      if (messagesData) {
        setMessages(messagesData.map(m => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          created_at: m.created_at,
          imageUrl: (m.metadata as any)?.imageUrl || undefined,
        })));
      }
    } else {
      // Create new session
      const { data: newSession, error } = await supabase
        .from("chat_sessions")
        .insert({ user_id: session.user.id })
        .select()
        .single();

      if (newSession) {
        setSessionId(newSession.id);
      }
    }

    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || sending || !sessionId) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      // Save user message
      const { data: savedUserMessage } = await supabase
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          user_id: session.user.id,
          role: "user",
          content: userMessage,
        })
        .select()
        .single();

      // Call AI edge function
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke("chat-numerology", {
        body: {
          message: userMessage,
          profile,
          numerologyContext,
          userId: currentSession?.user?.id,
          conversationHistory: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (aiError) throw aiError;

      const assistantContent = aiResponse?.response || "Mi dispiace, non sono riuscito a elaborare la tua richiesta. Riprova.";
      const outfitImageUrl = aiResponse?.imageUrl || null;

      // Save assistant message (store image URL in metadata)
      const { data: savedAssistantMessage } = await supabase
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          user_id: session.user.id,
          role: "assistant",
          content: assistantContent,
          metadata: outfitImageUrl ? { imageUrl: outfitImageUrl } : {},
        })
        .select()
        .single();

      // Update messages
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== tempUserMessage.id);
        return [
          ...updated,
          savedUserMessage ? {
            id: savedUserMessage.id,
            role: "user" as const,
            content: savedUserMessage.content,
            created_at: savedUserMessage.created_at,
          } : tempUserMessage,
          {
            id: savedAssistantMessage?.id || `ai-${Date.now()}`,
            role: "assistant" as const,
            content: assistantContent,
            created_at: savedAssistantMessage?.created_at || new Date().toISOString(),
            imageUrl: outfitImageUrl || undefined,
          },
        ];
      });

      // Update session timestamp
      await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", sessionId);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Errore",
        description: "Non sono riuscito a inviare il messaggio. Riprova.",
        variant: "destructive",
      });
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: newSession } = await supabase
      .from("chat_sessions")
      .insert({ user_id: session.user.id })
      .select()
      .single();

    if (newSession) {
      setSessionId(newSession.id);
      setMessages([]);
    }
  };

  const quickQuestions = [
    "Qual è il significato profondo del mio numero del destino?",
    "Che energia porta il mese di oggi per me?",
    "Come posso sfruttare al meglio il mio anno personale?",
    "Dimmi qualcosa sulla mia anima e personalità",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Caricamento chat...</p>
        </div>
      </div>
    );
  }

  const chatHeaderActions = (
    <Button variant="ghost" size="sm" onClick={startNewChat}>
      <Plus className="w-4 h-4 mr-2" />
      Nuova Chat
    </Button>
  );

  return (
    <DashboardLayout title="Esperto Numerologico" headerActions={chatHeaderActions}>
      <div className="flex flex-col flex-1 h-[calc(100vh-73px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/20 to-purple-500/20 flex items-center justify-center">
                <Bot className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Ciao {profile?.nome}!
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Sono il tuo consulente numerologico personale. Posso aiutarti a interpretare la tua mappa,
                suggerirti date favorevoli e molto altro.
              </p>

              {numerologyContext && (
                <div className="mb-8 p-4 glass-cosmic rounded-xl inline-block">
                  <p className="text-sm text-muted-foreground mb-2">I tuoi numeri:</p>
                  <div className="flex gap-3 justify-center">
                    <span className="number-circle text-sm">{numerologyContext.destino}</span>
                    <span className="number-circle text-sm">{numerologyContext.io}</span>
                    <span className="number-circle text-sm">{numerologyContext.soul}</span>
                    <span className="number-circle text-sm">{numerologyContext.personality}</span>
                  </div>
                </div>
              )}

              <div className="grid gap-2 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-2">Prova a chiedermi:</p>
                {quickQuestions.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4"
                    onClick={() => {
                      setInput(q);
                    }}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 mb-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "glass-cosmic rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={message.imageUrl}
                          alt="Look suggerito"
                          className="rounded-xl max-w-full w-full max-h-80 object-cover border border-border/30 cursor-pointer hover:opacity-90 transition-opacity"
                          loading="lazy"
                          onClick={() => setLightboxUrl(message.imageUrl!)}
                        />
                        <p className="text-xs text-muted-foreground mt-1 italic">✨ Look generato — tocca per ingrandire e scaricare</p>
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 mb-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-cosmic rounded-2xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxUrl(null)}
          >
            <div className="absolute top-4 right-4 flex gap-2">
              <a
                href={lightboxUrl}
                download="look-numerologico.png"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Download className="w-5 h-5 text-white" />
              </a>
              <button
                onClick={() => setLightboxUrl(null)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <img
              src={lightboxUrl}
              alt="Look suggerito"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrivi un messaggio..."
              disabled={sending}
              className="flex-1 bg-muted/50"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              variant="cosmic"
              size="icon"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </footer>
      </div>
    </DashboardLayout>
  );
};

export default Chat;

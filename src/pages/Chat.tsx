import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Profile {
  nome: string;
  cognome: string;
  birth_date: string;
}

interface NumerologyContext {
  lifePath: number;
  expression: number;
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
        lifePath: mapData.life_path,
        expression: mapData.destiny_expression,
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
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke("chat-numerology", {
        body: {
          message: userMessage,
          profile,
          numerologyContext,
          conversationHistory: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (aiError) throw aiError;

      const assistantContent = aiResponse?.response || "Mi dispiace, non sono riuscito a elaborare la tua richiesta. Riprova.";

      // Save assistant message
      const { data: savedAssistantMessage } = await supabase
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          user_id: session.user.id,
          role: "assistant",
          content: assistantContent,
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
    "Come sarà la mia giornata di oggi?",
    "Quali date sono favorevoli questo mese?",
    "Spiegami il mio Life Path",
    "Quali lavori sono in linea con la mia mappa?",
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display text-lg font-semibold block">Esperto Numerologico</span>
                <span className="text-xs text-muted-foreground">Consulente AI</span>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={startNewChat}>
            <Plus className="w-4 h-4 mr-2" />
            Nuova Chat
          </Button>
        </div>
      </header>

      {/* Messages */}
      <main className="relative z-10 flex-1 overflow-y-auto">
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
                    <span className="number-circle text-sm">{numerologyContext.lifePath}</span>
                    <span className="number-circle text-sm">{numerologyContext.expression}</span>
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
      </main>

      {/* Input */}
      <footer className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-xl">
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
  );
};

export default Chat;

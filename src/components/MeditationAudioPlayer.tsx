import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeditationAudioPlayerProps {
  script: string;
  userName: string;
}

export default function MeditationAudioPlayer({ script, userName }: MeditationAudioPlayerProps) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlay = async () => {
    if (playing && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
      return;
    }

    setLoading(true);
    try {
      const personalizedScript = script.replace(/\{nome\}/g, userName);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meditation-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: personalizedScript }),
        }
      );

      if (!response.ok) {
        throw new Error(`Errore TTS: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setPlaying(false);
        toast({
          title: "Errore audio",
          description: "Non è stato possibile riprodurre la meditazione.",
          variant: "destructive",
        });
      };

      await audio.play();
      setPlaying(true);
    } catch (error) {
      console.error("Meditation TTS error:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile generare l'audio della meditazione. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePlay}
      disabled={loading}
      variant={playing ? "destructive" : "cosmic"}
      size="lg"
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Preparazione della meditazione...
        </>
      ) : playing ? (
        <>
          <Square className="w-5 h-5 mr-2" />
          Ferma la meditazione
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 mr-2" />
          🧘 Comincia la meditazione
        </>
      )}
    </Button>
  );
}

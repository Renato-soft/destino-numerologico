import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sound prompts for each pillar
const PILLAR_SOUNDS: Record<number, string> = {
  0: "Soft Tibetan singing bowl resonating slowly with gentle wind and distant nature ambience, peaceful meditation drone",
  1: "Warm ambient pad with soft crystal chimes and gentle flowing water, creative and uplifting meditation atmosphere",
  2: "Deep resonant bell with soft rain and gentle breathing sounds, introspective calm meditation ambience",
  3: "Gentle forest ambience with birds, soft wind through trees, and distant flowing stream, peaceful nature meditation",
  4: "Low frequency drone with soft metallic resonance and gentle heartbeat rhythm, deep transformative meditation",
  5: "Ocean waves gently lapping shore with distant wind chimes and soft ambient pad, cyclical calming meditation",
  6: "Ethereal choir-like ambient pad with soft high-pitched tones and gentle cosmic drone, transcendent meditation atmosphere",
};

interface MeditationAudioPlayerProps {
  pillarIndex: number;
}

export default function MeditationAudioPlayer({ pillarIndex }: MeditationAudioPlayerProps) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    setLoading(false);
  };

  const handlePlay = async () => {
    if (playing || loading) {
      handleStop();
      return;
    }

    setLoading(true);

    try {
      const prompt = PILLAR_SOUNDS[pillarIndex] || PILLAR_SOUNDS[0];

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meditation-music`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ pillarIndex, prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`Errore: ${response.status}`);
      }

      const data = await response.json();

      const audio = new Audio(data.url);
      audio.loop = true; // Loop the ambient sound
      audio.volume = 0.6;
      audioRef.current = audio;

      audio.onerror = () => {
        setPlaying(false);
        toast({
          title: "Errore audio",
          description: "Non è stato possibile riprodurre la musica.",
          variant: "destructive",
        });
      };

      await audio.play();
      setLoading(false);
      setPlaying(true);
    } catch (error) {
      console.error("Meditation music error:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile caricare la musica di meditazione. Riprova.",
        variant: "destructive",
      });
      setLoading(false);
      setPlaying(false);
    }
  };

  return (
    <Button
      onClick={playing || loading ? handleStop : handlePlay}
      variant={playing ? "destructive" : "cosmic"}
      size="lg"
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Preparazione musica...
        </>
      ) : playing ? (
        <>
          <Square className="w-5 h-5 mr-2" />
          Ferma la musica
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

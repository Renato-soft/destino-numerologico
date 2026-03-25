import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NATURE_AUDIO_VERSION = "20260325-v2";

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
      const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/meditation-music/pillar_${pillarIndex}.mp3`;

      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = 0.6;
      audioRef.current = audio;

      audio.oncanplaythrough = () => {
        setLoading(false);
        setPlaying(true);
      };

      audio.onerror = () => {
        setLoading(false);
        setPlaying(false);
        toast({
          title: "Errore audio",
          description: "Non è stato possibile riprodurre la musica di meditazione.",
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
        description: "Non è stato possibile avviare la musica. Riprova.",
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
          Caricamento...
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

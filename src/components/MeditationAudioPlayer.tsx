import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeditationAudioPlayerProps {
  pillarIndex: number;
  userName: string;
  meditationSteps: string[];
}

const MONK_NAME = "Maestro Arjun";

function buildMeditationScript(userName: string, steps: string[]): string {
  // Build intro
  const intro = `Ciao ${userName}, mi chiamo ${MONK_NAME}, e sono qui per guidarti in questa meditazione.

Ti invito a mettere il telefono in modalità silenziosa, togliendo suoneria e vibrazione, così da non essere disturbato.

Siediti in una posizione comoda, con la schiena dritta ma rilassata, e chiudi dolcemente gli occhi.

Tra qualche istante comincerò a guidarti. Prenditi questo momento per sistemarti e prepararti.`;

  // 30 seconds of silence approximation using pauses
  const longPause = "\n... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...\n";
  
  // 10 seconds pause between steps
  const stepPause = "\n... ... ... ... ... ... ... ... ... ...\n";

  let script = intro + longPause;

  script += "Bene, cominciamo.\n" + stepPause;

  steps.forEach((step, i) => {
    // If first step mentions sitting/posizione, integrate rather than repeat
    if (i === 0 && /sied|posizione|comodo/i.test(step)) {
      script += `Hai già trovato la tua posizione. ${step.replace(/[Ss]iediti[^.]*\./g, "").trim()}\n`;
    } else {
      script += `${step}\n`;
    }
    
    if (i < steps.length - 1) {
      script += stepPause;
    }
  });

  script += stepPause;
  script += `Bene ${userName}, la meditazione è terminata. Quando sei pronto, apri dolcemente gli occhi e torna al presente, portando con te questa sensazione di pace.`;

  return script;
}

export default function MeditationAudioPlayer({ pillarIndex, userName, meditationSteps }: MeditationAudioPlayerProps) {
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
      const script = buildMeditationScript(userName, meditationSteps);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meditation-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: script }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = 0.9;
      audioRef.current = audio;

      audio.onended = () => {
        setPlaying(false);
      };

      await audio.play();
      setLoading(false);
      setPlaying(true);
    } catch (error) {
      console.error("Meditation TTS error:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile avviare la meditazione guidata. Riprova.",
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
          Preparazione meditazione...
        </>
      ) : playing ? (
        <>
          <Square className="w-5 h-5 mr-2" />
          Ferma la meditazione
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 mr-2" />
          🧘 Comincia la meditazione guidata
        </>
      )}
    </Button>
  );
}

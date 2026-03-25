import { useState, useRef, useEffect } from "react";
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
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStop = () => {
    abortRef.current?.abort();
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
    const controller = new AbortController();
    abortRef.current = controller;

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
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`Errore TTS: ${response.status}`);
      }

      // Collect the streamed response into a blob for playback
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const chunks: Uint8Array[] = [];
      let firstChunkReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (controller.signal.aborted) break;

        chunks.push(value);

        // Start playback as soon as we have enough data (~50KB)
        if (!firstChunkReceived && chunks.reduce((s, c) => s + c.length, 0) > 50000) {
          firstChunkReceived = true;
          setLoading(false);
          setPlaying(true);
        }
      }

      if (controller.signal.aborted) return;

      const blob = new Blob(chunks, { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);

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
      setLoading(false);
      setPlaying(true);
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      console.error("Meditation TTS error:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile generare l'audio della meditazione. Riprova.",
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

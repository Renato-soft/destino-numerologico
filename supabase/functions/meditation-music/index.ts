import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!ELEVENLABS_API_KEY) {
    return new Response(JSON.stringify({ error: "ELEVENLABS_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { pillarIndex, prompt } = await req.json();

    if (typeof pillarIndex !== "number" || !prompt) {
      return new Response(JSON.stringify({ error: "Missing pillarIndex or prompt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const filePath = `pillar_${pillarIndex}.mp3`;

    // Check if already generated
    const { data: files } = await supabase.storage
      .from("meditation-music")
      .list("", { search: filePath });

    if (files && files.length > 0 && files.some(f => f.name === filePath)) {
      const { data: publicUrl } = supabase.storage
        .from("meditation-music")
        .getPublicUrl(filePath);

      return new Response(JSON.stringify({ url: publicUrl.publicUrl, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate ambient sound via ElevenLabs Sound Effects API
    console.log(`Generating meditation sound for pillar ${pillarIndex}: ${prompt}`);

    const response = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: prompt,
        duration_seconds: 22,
        prompt_influence: 0.5,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`ElevenLabs SFX API error [${response.status}]:`, errorBody);
      return new Response(
        JSON.stringify({ error: `Sound generation failed: ${response.status}`, details: errorBody }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("meditation-music")
      .upload(filePath, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to store sound" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: publicUrl } = supabase.storage
      .from("meditation-music")
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ url: publicUrl.publicUrl, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Meditation music error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

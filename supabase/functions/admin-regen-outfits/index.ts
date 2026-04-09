import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { user_ids } = await req.json();
    if (!Array.isArray(user_ids) || user_ids.length === 0) {
      return new Response(JSON.stringify({ error: "user_ids required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const results: Record<string, string> = {};

    for (const uid of user_ids) {
      console.log(`Triggering regeneration for ${uid}...`);
      try {
        const resp = await fetch(`${supabaseUrl}/functions/v1/generate-outfits`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
            "apikey": lovableApiKey,
          },
          body: JSON.stringify({ force: true, target_user_id: uid }),
        });
        const text = await resp.text();
        results[uid] = `${resp.status}: ${text.slice(0, 200)}`;
        console.log(`  ${uid}: ${resp.status}`);
      } catch (e) {
        results[uid] = `error: ${e.message}`;
      }
    }

    return new Response(JSON.stringify({ results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

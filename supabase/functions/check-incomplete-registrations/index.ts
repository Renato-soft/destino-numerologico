import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { data: incompleteProfiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("user_id, created_at, nome, cognome")
      .eq("onboarding_completed", false);

    if (profilesError) throw profilesError;

    if (!incompleteProfiles || incompleteProfiles.length === 0) {
      return new Response(JSON.stringify({ message: "No incomplete registrations found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const results = { reminders: 0, deletions: 0, errors: [] as string[] };

    for (const profile of incompleteProfiles) {
      const createdAt = new Date(profile.created_at);
      const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      try {
        const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(profile.user_id);
        if (userError || !userData?.user?.email) {
          results.errors.push(`Could not get email for user ${profile.user_id}`);
          continue;
        }

        const email = userData.user.email;
        const nome = profile.nome || "Utente";

        if (hoursElapsed >= 48) {
          console.log(`Deleting user ${profile.user_id} (${email}) - 48h+ without completing onboarding`);

          await sendEmailWithResend(resendApiKey, email, nome, "deletion");

          await adminClient.from("photos").delete().eq("user_id", profile.user_id);
          await adminClient.from("chat_messages").delete().eq("user_id", profile.user_id);
          await adminClient.from("chat_sessions").delete().eq("user_id", profile.user_id);
          await adminClient.from("numerology_maps").delete().eq("user_id", profile.user_id);
          await adminClient.from("daily_reports").delete().eq("user_id", profile.user_id);
          await adminClient.from("profiles").delete().eq("user_id", profile.user_id);

          const { error: deleteError } = await adminClient.auth.admin.deleteUser(profile.user_id);
          if (deleteError) {
            results.errors.push(`Failed to delete user ${profile.user_id}: ${deleteError.message}`);
          } else {
            results.deletions++;
          }

        } else if (hoursElapsed >= 24) {
          console.log(`Sending reminder to ${email} - 24h+ without completing onboarding`);
          await sendEmailWithResend(resendApiKey, email, nome, "reminder");
          results.reminders++;
        }
      } catch (err) {
        results.errors.push(`Error processing user ${profile.user_id}: ${err.message}`);
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendEmailWithResend(
  resendApiKey: string,
  toEmail: string,
  nome: string,
  type: "reminder" | "deletion"
) {
  const subject = type === "reminder"
    ? "📸 Completa la tua registrazione su Destino Numerologico"
    : "⚠️ La tua utenza su Destino Numerologico verrà cancellata";

  const html = type === "reminder"
    ? `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">Destino Numerologico</h1>
        </div>
        <h2 style="color: #1a1a2e; font-size: 20px;">Ciao ${nome}! 👋</h2>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Abbiamo notato che non hai ancora completato la registrazione su <strong>Destino Numerologico</strong>.</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Per offrirti consigli di stile personalizzati basati sulla tua fisionomia, abbiamo bisogno delle tue <strong>3 foto</strong> (viso, figura intera frontale e laterale).</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">È il passo fondamentale per sbloccare tutti i suggerimenti di outfit su misura per te!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://destino-numerologico.lovable.app" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Completa la registrazione</a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">⏰ Hai ancora 24 ore per completare la registrazione prima che l'account venga rimosso.</p>
        <p style="color: #aaa; font-size: 11px; text-align: center;">Se non hai creato tu questo account, ignora questa email.</p>
      </div>`
    : `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">Destino Numerologico</h1>
        </div>
        <h2 style="color: #1a1a2e; font-size: 20px;">Ciao ${nome},</h2>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Purtroppo non hai completato la registrazione su <strong>Destino Numerologico</strong> entro 48 ore.</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Per motivi di sicurezza e per mantenere la qualità del servizio, la tua utenza è stata cancellata.</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Se desideri riprovare, puoi registrarti nuovamente in qualsiasi momento!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://destino-numerologico.lovable.app" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Registrati di nuovo</a>
        </div>
        <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 30px;">Se non hai creato tu questo account, ignora questa email.</p>
      </div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: "Destino Numerologico <onboarding@resend.dev>",
      to: [toEmail],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Resend API error [${response.status}]: ${errorData}`);
  }

  console.log(`Email (${type}) sent successfully to ${toEmail}`);
}

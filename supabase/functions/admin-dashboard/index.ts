import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAILS = ["regnew01@gmail.com", "realerenato@gmail.com", "maria732008@live.it"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      return new Response(JSON.stringify({ error: "Accesso negato" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userRole = user.email === "regnew01@gmail.com" ? "superadmin" : user.email === "realerenato@gmail.com" ? "admin" : "viewer";

    // Determine action from query string or body
    const url = new URL(req.url);
    let action = url.searchParams.get("action") || "overview";

    // Check if body has action (for POST requests)
    let body: any = null;
    if (req.method === "POST") {
      try {
        body = await req.json();
        if (body?.action) action = body.action;
      } catch { /* no body */ }
    }

    // ===== UPDATE SCHEDULE =====
    if (action === "update-schedule") {
      if (userRole !== "superadmin") {
        return new Response(JSON.stringify({ error: "Accesso negato" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const schedules = body?.schedules as Record<string, number>;
      if (!schedules) {
        return new Response(JSON.stringify({ error: "Dati mancanti" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      for (const [featureKey, days] of Object.entries(schedules)) {
        await supabase
          .from("feature_schedule")
          .update({ unlock_after_days: days, updated_at: new Date().toISOString() })
          .eq("feature_key", featureKey);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "overview") {
      // Get all users from auth
      const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const users = authUsers?.users || [];

      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const totalUsers = users.length;
      const newToday = users.filter(u => u.created_at?.startsWith(todayStr)).length;
      const newLast3Days = users.filter(u => {
        if (!u.created_at) return false;
        return new Date(u.created_at) >= threeDaysAgo;
      }).length;

      // Stripe data
      const stripeKey = (Deno.env.get("STRIPE_SECRET_KEY") ?? "").trim();
      let stripeData: any = { totalRevenue: 0, revenueByProduct: {}, churned: [] };

      if (stripeKey && !stripeKey.startsWith("pk_")) {
        const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

        let totalRevenue = 0;
        const revenueByProduct: Record<string, number> = {};
        
        const charges = await stripe.charges.list({ limit: 100 });
        for (const charge of charges.data) {
          if (charge.status === "succeeded" && !charge.refunded) {
            totalRevenue += charge.amount;
          }
        }

        const activeSubs = await stripe.subscriptions.list({ status: "active", limit: 100 });
        const canceledSubs = await stripe.subscriptions.list({ status: "canceled", limit: 100 });

        const invoices = await stripe.invoices.list({ limit: 100, status: "paid" });
        for (const inv of invoices.data) {
          for (const line of (inv.lines?.data || [])) {
            const prodName = line.description || "Abbonamento";
            revenueByProduct[prodName] = (revenueByProduct[prodName] || 0) + (line.amount || 0);
          }
        }

        const sessions = await stripe.checkout.sessions.list({ limit: 100 });
        for (const sess of sessions.data) {
          if (sess.payment_status === "paid" && sess.mode === "payment") {
            const key = "Acquisti singoli";
            revenueByProduct[key] = (revenueByProduct[key] || 0) + (sess.amount_total || 0);
          }
        }

        const churnedEmails = canceledSubs.data.map(s => s.customer).filter(Boolean);
        const churnedCustomers: string[] = [];
        for (const custId of churnedEmails) {
          try {
            const cust = await stripe.customers.retrieve(custId as string);
            if (cust && !cust.deleted && cust.email) {
              churnedCustomers.push(cust.email);
            }
          } catch { /* skip */ }
        }

        stripeData = {
          totalRevenue: totalRevenue / 100,
          revenueByProduct: Object.fromEntries(
            Object.entries(revenueByProduct).map(([k, v]) => [k, (v as number) / 100])
          ),
          activeSubscriptions: activeSubs.data.length,
          canceledSubscriptions: canceledSubs.data.length,
          churned: churnedCustomers,
        };
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, nome, cognome, birth_date, sesso, created_at");

      const loginCounts: Record<string, number> = {};
      let loginsToday = 0;
      let loginsLast3Days = 0;
      try {
        const { data: auditRows } = await supabase
          .schema("auth" as any)
          .from("audit_log_entries")
          .select("payload, created_at")
          .in("payload->>action", ["login"]);

        const nowDate = new Date();
        const todayStart = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).toISOString();
        const threeDaysAgoLogin = new Date(nowDate);
        threeDaysAgoLogin.setDate(threeDaysAgoLogin.getDate() - 3);
        const threeDaysAgoStr = threeDaysAgoLogin.toISOString();

        if (auditRows) {
          for (const row of auditRows) {
            const payload = typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;
            const actorId = payload?.actor_id;
            if (actorId) {
              loginCounts[actorId] = (loginCounts[actorId] || 0) + 1;
            }
            const createdAt = row.created_at;
            if (createdAt) {
              if (createdAt >= todayStart) loginsToday++;
              if (createdAt >= threeDaysAgoStr) loginsLast3Days++;
            }
          }
        }
      } catch (e) {
        console.error("Could not read audit log:", e);
      }

      const userList = (profiles || []).map(p => {
        const authUser = users.find(u => u.id === p.user_id);
        const entry: any = {
          user_id: p.user_id,
          nome: p.nome,
          cognome: userRole === "viewer" ? (p.cognome ? p.cognome.charAt(0) + "." : "") : p.cognome,
          created_at: p.created_at,
          sesso: p.sesso,
          last_sign_in_at: authUser?.last_sign_in_at || null,
          login_count: loginCounts[p.user_id] || 0,
        };
        if (userRole !== "viewer") {
          entry.email = authUser?.email || "N/A";
        }
        return entry;
      });

      return new Response(JSON.stringify({
        role: userRole,
        totalUsers,
        newToday,
        newLast3Days,
        stripe: stripeData,
        users: userList,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "user-detail") {
      if (userRole !== "superadmin") {
        return new Response(JSON.stringify({ error: "Accesso negato" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const targetUserId = url.searchParams.get("user_id");
      if (!targetUserId) {
        return new Response(JSON.stringify({ error: "user_id richiesto" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: photos } = await supabase
        .from("photos")
        .select("type, storage_path")
        .eq("user_id", targetUserId);

      const photoUrls = photos
        ? (await Promise.all(
            photos.map(async (photo) => {
              const { data } = await supabase.storage
                .from("user-photos")
                .createSignedUrl(photo.storage_path, 3600);
              return data?.signedUrl ? { type: photo.type, url: data.signedUrl } : null;
            })
          )).filter(Boolean) as { type: string; url: string }[]
        : [];

      const { data: outfitFiles } = await supabase.storage
        .from("user-photos")
        .list(`${targetUserId}/outfits`);

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const cutoffDate = threeDaysAgo.toISOString().split("T")[0];

      let recentOutfits: { date: string; label: string; url: string }[] = [];
      if (outfitFiles) {
        const recentFiles = outfitFiles.filter(f => {
          const dateMatch = f.name.match(/^(\d{4}-\d{2}-\d{2})_/);
          return dateMatch && dateMatch[1] >= cutoffDate;
        });

        recentOutfits = (await Promise.all(
          recentFiles.map(async (file) => {
            const { data } = await supabase.storage
              .from("user-photos")
              .createSignedUrl(`${targetUserId}/outfits/${file.name}`, 3600);
            if (!data?.signedUrl) return null;
            const dateMatch = file.name.match(/^(\d{4}-\d{2}-\d{2})_v\d+_(.+)\.png$/);
            return {
              date: dateMatch?.[1] || "",
              label: dateMatch?.[2] || file.name,
              url: data.signedUrl,
            };
          })
        )).filter(Boolean) as { date: string; label: string; url: string }[];
      }

      recentOutfits.sort((a, b) => b.date.localeCompare(a.date));

      return new Response(JSON.stringify({
        photos: photoUrls,
        outfits: recentOutfits,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Azione non valida" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-dashboard error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

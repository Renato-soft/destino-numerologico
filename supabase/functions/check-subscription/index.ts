import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Base plan product ID (one-time payment)
const BASE_PRODUCT_ID = "prod_U8ShObzMBDIryb";

// Gold plan product ID
const GOLD_PRODUCT_ID = "prod_U8ReMeQZ3qtLHN";

// Manual overrides: emails that get Gold access without payment
const GOLD_OVERRIDES: string[] = ["regnew01@gmail.com", "maria732008@live.it"];

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

const unsubscribedResponse = (extra: Record<string, unknown> = {}) =>
  new Response(
    JSON.stringify({
      subscribed: false,
      product_id: null,
      subscription_end: null,
      ...extra,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    },
  );

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  try {
    logStep("Function started");

    const stripeKey = (Deno.env.get("STRIPE_SECRET_KEY") ?? "").trim();
    if (!stripeKey) {
      logStep("Missing STRIPE_SECRET_KEY");
      return unsubscribedResponse({ error: "Stripe key is not configured" });
    }

    if (stripeKey.startsWith("pk_")) {
      logStep("Invalid Stripe key type configured", { keyPrefix: "pk_" });
      return unsubscribedResponse({ error: "Stripe secret key is misconfigured" });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { email: user.email });

    // Check manual overrides first
    if (GOLD_OVERRIDES.includes(user.email.toLowerCase())) {
      logStep("Manual Gold override found", { email: user.email });
      return new Response(
        JSON.stringify({
          subscribed: true,
          product_id: GOLD_PRODUCT_ID,
          subscription_end: null,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found");
      return unsubscribedResponse();
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Check active subscriptions (Pro/Gold)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      const productId = subscription.items.data[0].price.product;
      logStep("Active subscription found", { productId, subscriptionEnd });

      return new Response(
        JSON.stringify({
          subscribed: true,
          product_id: productId,
          subscription_end: subscriptionEnd,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    // Check one-time purchases (Base plan)
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 100,
    });

    const hasBasePurchase = sessions.data.some((session) => {
      return session.payment_status === "paid" && session.mode === "payment";
    });

    if (hasBasePurchase) {
      logStep("One-time Base purchase found");
      return new Response(
        JSON.stringify({
          subscribed: true,
          product_id: BASE_PRODUCT_ID,
          subscription_end: null,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    logStep("No active subscription or purchase");
    return unsubscribedResponse();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });

    const isStripeKeyTypeError = errorMessage.includes("publishable API key");
    if (isStripeKeyTypeError) {
      return unsubscribedResponse({ error: "Stripe secret key is misconfigured" });
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

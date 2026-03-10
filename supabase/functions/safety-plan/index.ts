import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a compassionate, trauma-informed safety planning assistant for survivors of domestic violence. The user has answered an intake questionnaire. Based solely on their answers, generate a prioritized safety checklist of 6 to 8 specific, actionable items tailored to their situation. Lead with the most urgent items first. Use plain, calm language. Never use clinical or legal jargon. Never be alarmist. Format the output as a numbered list only — no preamble, no closing remarks. Each item should be one to two sentences maximum. If the user has children, always include a child-specific item. If the user has no access to funds, always include a financial safety item. If the user has no ID access, always include an ID alternatives item. End every checklist with this exact item regardless of other answers: "Save the National Domestic Violence Hotline number somewhere safe: 1-800-799-7233."`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { answers } = await req.json();
    const ANTHROPIC_API_KEY = Deno.env.get("AnthropicAPI");
    if (!ANTHROPIC_API_KEY) throw new Error("AnthropicAPI secret is not configured");

    const userMessage = `Here are my intake answers:
- Children living with me: ${answers.children}
- Access to money/bank account: ${answers.finances}
- Access to identification documents: ${answers.documents}
- Trusted person outside the home: ${answers.trustedPerson}
- Timeline for leaving: ${answers.timeline}

Please generate my personalized safety checklist.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("Anthropic API error:", status, t);
      throw new Error("Anthropic API error");
    }

    const data = await response.json();
    const plan = data.content?.[0]?.text || "";

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("safety-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

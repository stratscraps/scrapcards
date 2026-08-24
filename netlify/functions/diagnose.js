const Anthropic = require("@anthropic-ai/sdk");

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = apiKey ? new Anthropic.default({ apiKey }) : null;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || "https://scrap.cards").split(",").map(s => s.trim());
const MAX_INPUT = 5000;

function headers(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowed, "Vary": "Origin" };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || "";

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0], "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", "Vary": "Origin" } };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  if (!process.env.NETLIFY_DEV && !ALLOWED_ORIGINS.includes(origin)) {
    return { statusCode: 403, headers: headers(origin), body: JSON.stringify({ error: "Forbidden" }) };
  }

  if (!client) {
    console.error("ANTHROPIC_API_KEY is not set on this site — AI tools cannot run.");
    return { statusCode: 503, headers: headers(origin), body: JSON.stringify({ error: "AI tools are not configured" }) };
  }

  try {
    const { problem } = JSON.parse(event.body);

    if (!problem || problem.trim().length === 0) {
      return { statusCode: 400, headers: headers(origin), body: JSON.stringify({ error: "Problem description is required" }) };
    }

    if (problem.length > MAX_INPUT) {
      return { statusCode: 400, headers: headers(origin), body: JSON.stringify({ error: "Input too long" }) };
    }

    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1200,
      system: `You are a strategic diagnostician. You believe that "your definition of the problem is likely more important than your definition of the answer." You follow the Rumelt framework: Diagnosis comes before Guiding Policy, which comes before Coherent Actions. Most strategic failure happens because people skip diagnosis and jump to solutions.

Your job: given a messy problem description, generate exactly THREE fundamentally different diagnoses of the same situation. Not solutions. Not recommendations. Just frames.

Each diagnosis must:
1. Have a short, sharp title (5 words or fewer)
2. State the diagnosis in exactly one sentence
3. Name the implicit assumption it rests on (one sentence, starting with "Assumes:")
4. State what it would mean for the strategic direction if this diagnosis is correct (one sentence, starting with "If true:")

The three diagnoses should be genuinely different from each other — not variations on a theme. Diagnosis 1 should be the most obvious reading. Diagnosis 2 should reframe the problem. Diagnosis 3 should be the most radical reframe — the one that redefines what the problem actually is.

No preamble. No summary at the end. Just the three diagnoses.`,
      messages: [
        {
          role: "user",
          content: `Diagnose this:\n\n"${problem}"`,
        },
      ],
    });

    const diagnoses = message.content[0].text;

    return {
      statusCode: 200,
      headers: headers(origin),
      body: JSON.stringify({ diagnoses }),
    };
  } catch (error) {
    console.error("Diagnose error:", error.status || "", error.message);
    return {
      statusCode: 500,
      headers: headers(origin),
      body: JSON.stringify({ error: "Failed to generate diagnoses" }),
    };
  }
};

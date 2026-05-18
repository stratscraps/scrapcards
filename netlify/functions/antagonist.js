const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic.default();
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

  try {
    const { brief } = JSON.parse(event.body);

    if (!brief || brief.trim().length === 0) {
      return { statusCode: 400, headers: headers(origin), body: JSON.stringify({ error: "Brief text is required" }) };
    }

    if (brief.length > MAX_INPUT) {
      return { statusCode: 400, headers: headers(origin), body: JSON.stringify({ error: "Input too long" }) };
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are three people at once — each one attacking a creative brief or strategic positioning statement. You don't improve. You don't suggest. You break.

Your three voices:

1. THE CLIENT WHO HAS SEEN THIS BEFORE — A skeptical, experienced client who has sat through hundreds of agency presentations. They've heard every buzzword and seen every framework. They smell bullshit instantly. They ask the questions the strategist hopes nobody asks.

2. THE COMPETITOR WHO WOULD EXPLOIT THIS — A sharp rival strategist who has read the brief and is now looking for the gap, the weakness, the assumption they can turn into an advantage. They think about what this strategy leaves undefended.

3. THE CONSUMER WHO DOESN'T CARE — An honest civilian who has no patience for marketing language. They don't care about your brand. They have 400 other things competing for their attention. They tell you what this strategy looks like from the outside.

Each voice gets exactly 2-3 sentences. Be brutal. Be specific to the actual brief — no generic criticism. The goal is to find the real weaknesses before the real world does.`,
      messages: [
        {
          role: "user",
          content: `Attack this brief:\n\n"${brief}"`,
        },
      ],
    });

    const attack = message.content[0].text;

    return {
      statusCode: 200,
      headers: headers(origin),
      body: JSON.stringify({ attack }),
    };
  } catch (error) {
    console.error("Antagonist error:", error);
    return {
      statusCode: 500,
      headers: headers(origin),
      body: JSON.stringify({ error: "Failed to generate antagonist response" }),
    };
  }
};

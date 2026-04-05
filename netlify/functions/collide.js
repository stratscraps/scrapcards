const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic.default();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { quotes } = JSON.parse(event.body);

    if (!quotes || quotes.length < 2) {
      return { statusCode: 400, body: JSON.stringify({ error: "Need at least 2 quotes" }) };
    }

    const quotesText = quotes
      .map((q, i) => `Quote ${i + 1}: "${q.text}"${q.author ? ` — ${q.author}` : ""}`)
      .join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: `You are a provocative strategic thinker. You find non-obvious connections, tensions, and collisions between ideas. You are sharp, concise, and intellectually fearless. Never hedge. Never be safe. Never explain what the quotes mean individually — only what they reveal TOGETHER.`,
      messages: [
        {
          role: "user",
          content: `These two ideas were never meant to sit next to each other. What do they reveal when forced together? What tension, agreement, or provocation emerges?\n\n${quotesText}\n\nWrite exactly 2-3 sentences. Be provocative, not academic. No preamble.`,
        },
      ],
    });

    const collision = message.content[0].text;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collision }),
    };
  } catch (error) {
    console.error("Collide error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate collision" }),
    };
  }
};

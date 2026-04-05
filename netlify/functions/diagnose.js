const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic.default();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { problem } = JSON.parse(event.body);

    if (!problem || problem.trim().length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Problem description is required" }) };
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diagnoses }),
    };
  } catch (error) {
    console.error("Diagnose error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate diagnoses" }),
    };
  }
};

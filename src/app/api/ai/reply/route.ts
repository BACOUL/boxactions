import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Body = {
  content?: string;
  channel?: "sms" | "email" | "whatsapp" | "messenger";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const content = body.content?.trim();

    if (!content) {
      return Response.json(
        { error: "Missing content" },
        { status: 400 },
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: [
        {
          role: "system",
          content:
            "You generate short, clear, professional replies for incoming customer messages. Keep the reply concise, polite, directly usable, and appropriate for SMS. Answer in the same language as the incoming message.",
        },
        {
          role: "user",
          content,
        },
      ],
    });

    const reply =
      response.output_text?.trim() ||
      "Bonjour, merci pour votre message. Je reviens vers vous rapidement.";

    return Response.json({ reply });
  } catch {
    return Response.json(
      { error: "Failed to generate reply" },
      { status: 500 },
    );
  }
}

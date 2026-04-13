import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type GenerateReplyInput = {
  content: string;
  channel?: "sms" | "email" | "whatsapp" | "messenger";
};

export async function generateReply(
  input: GenerateReplyInput,
): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-5.4",
    input: [
      {
        role: "system",
        content:
          "You generate short, clear, professional replies for incoming customer messages. Keep the response concise, polite, and directly usable for a real business conversation by SMS.",
      },
      {
        role: "user",
        content: input.content,
      },
    ],
  });

  return response.output_text?.trim() || "Bonjour, merci pour votre message.";
}

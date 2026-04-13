// src/ai/generateReply.ts

export type GenerateReplyInput = {
  content: string;
  channel?: "sms" | "email" | "whatsapp" | "messenger";
};

export async function generateReply(
  input: GenerateReplyInput,
): Promise<string> {
  const text = input.content.toLowerCase().trim();

  if (text.includes("dispo") || text.includes("rendez-vous")) {
    return "Bonjour, oui, je peux vous proposer demain à 18h. Est-ce que cela vous conviendrait ?";
  }

  if (text.includes("prix") || text.includes("tarif")) {
    return "Bonjour, merci pour votre message. Pouvez-vous me préciser votre demande afin que je vous donne le bon tarif ?";
  }

  if (text.includes("facture")) {
    return "Bonjour, bien sûr. Je regarde cela et je reviens vers vous rapidement avec la facture demandée.";
  }

  if (text.includes("merci")) {
    return "Bonjour, avec plaisir. Je reste à votre disposition si besoin.";
  }

  return "Bonjour, merci pour votre message. Je reviens vers vous rapidement.";
}

export type MessageIntent =
  | "availability_request"
  | "pricing_request"
  | "invoice_request"
  | "gratitude"
  | "general_request";

export type MessagePriority = "low" | "medium" | "high";

export type ClassifiedMessage = {
  intent: MessageIntent;
  priority: MessagePriority;
  summary: string;
};

export async function classifyMessage(content: string): Promise<ClassifiedMessage> {
  const text = content.toLowerCase().trim();

  if (text.includes("dispo") || text.includes("rendez-vous")) {
    return {
      intent: "availability_request",
      priority: "high",
      summary: "Customer is asking for availability or an appointment",
    };
  }

  if (text.includes("prix") || text.includes("tarif") || text.includes("devis")) {
    return {
      intent: "pricing_request",
      priority: "medium",
      summary: "Customer is asking for pricing information",
    };
  }

  if (text.includes("facture")) {
    return {
      intent: "invoice_request",
      priority: "medium",
      summary: "Customer is asking for an invoice",
    };
  }

  if (text.includes("merci")) {
    return {
      intent: "gratitude",
      priority: "low",
      summary: "Customer is thanking or acknowledging",
    };
  }

  return {
    intent: "general_request",
    priority: "medium",
    summary: "General incoming message",
  };
}

// src/test-sms-flow.ts

import { createMessage, updateMessageStatus } from "./messages/message.service";
import { createSuggestion } from "./suggestions/suggestion.service";
import { createDecision } from "./decisions/decision.service";
import {
  createExecution,
  updateExecutionStatus,
} from "./executions/execution.service";
import type { Message, Suggestion } from "./types";

/**
 * Temporary fake AI reply generator.
 * Replace this later with your real OpenAI/Gemini call.
 */
async function generateReply(input: string): Promise<string> {
  const text = input.toLowerCase();

  if (text.includes("dispo") || text.includes("rendez-vous")) {
    return "Bonjour, oui, je peux vous proposer demain à 18h. Est-ce que cela vous conviendrait ?";
  }

  if (text.includes("prix") || text.includes("tarif")) {
    return "Bonjour, merci pour votre message. Pouvez-vous me préciser votre demande afin que je vous donne le bon tarif ?";
  }

  return "Bonjour, merci pour votre message. Je reviens vers vous rapidement.";
}

/**
 * Temporary fake SMS sender.
 * Replace this later with Twilio or another provider.
 */
async function sendSms(to: string, body: string): Promise<{ providerId: string }> {
  console.log("\n--- SMS SENT ---");
  console.log("TO:", to);
  console.log("BODY:", body);
  console.log("----------------\n");

  return {
    providerId: `fake_sms_${Date.now()}`,
  };
}

/**
 * Simulates the full V1 flow:
 * 1. Receive SMS
 * 2. Create Message
 * 3. Generate AI reply
 * 4. Create Suggestion
 * 5. Simulate user decision
 * 6. Create Execution
 * 7. Send SMS
 */
export async function receiveFakeSms(content: string) {
  console.log("1. Incoming fake SMS received");

  const message = createMessage({
    conversationId: "conv_demo_1",
    channel: "sms",
    from: "+33600000000",
    to: "+33700000000",
    content,
    receivedAt: new Date().toISOString(),
    status: "new",
    metadata: {
      provider: "fake",
      providerMessageId: `fake_in_${Date.now()}`,
      contactName: "Demo Contact",
    },
  });

  console.log("2. Message created:", {
    id: message.id,
    content: message.content,
    status: message.status,
  });

  const reply = await generateReply(message.content);

  const suggestion = createSuggestion({
    messageId: message.id,
    type: "reply_sms",
    summary: "AI-generated SMS reply suggestion",
    proposedText: reply,
    confidence: 0.87,
    context: {
      detectedIntent: "general_request",
      priority: "medium",
      suggestedActionLabel: "Reply",
    },
  });

  updateMessageStatus(message.id, "suggested");

  console.log("3. Suggestion created:", {
    id: suggestion.id,
    messageId: suggestion.messageId,
    proposedText: suggestion.proposedText,
  });

  /**
   * Simulate user action here.
   * Change "approve" to "edit" or "cancel" to test other paths.
   */
  const simulatedAction: "approve" | "edit" | "cancel" = "approve";

  if (simulatedAction === "cancel") {
    const decision = createDecision({
      messageId: message.id,
      suggestionId: suggestion.id,
      action: "cancel",
      decidedBy: "demo_user",
    });

    updateMessageStatus(message.id, "cancelled");

    console.log("4. Decision created:", decision);
    console.log("5. Flow stopped: user cancelled");
    return;
  }

  const editedText =
    simulatedAction === "edit"
      ? `${suggestion.proposedText} Merci de votre retour.`
      : null;

  const decision = createDecision({
    messageId: message.id,
    suggestionId: suggestion.id,
    action: simulatedAction,
    editedText,
    decidedBy: "demo_user",
  });

  updateMessageStatus(message.id, simulatedAction === "edit" ? "edited" : "approved");

  console.log("4. Decision created:", {
    id: decision.id,
    action: decision.action,
    editedText: decision.editedText,
  });

  const finalBody = decision.action === "edit" && decision.editedText
    ? decision.editedText
    : suggestion.proposedText ?? "";

  const execution = createExecution({
    messageId: message.id,
    suggestionId: suggestion.id,
    decisionId: decision.id,
    type: "send_sms",
    status: "pending",
    payload: {
      to: message.from,
      body: finalBody,
    },
  });

  console.log("5. Execution created:", {
    id: execution.id,
    type: execution.type,
    status: execution.status,
    payload: execution.payload,
  });

  try {
    const result = await sendSms(message.from, finalBody);

    updateExecutionStatus(execution.id, "done", {
      result,
    });

    updateMessageStatus(message.id, "executed");

    console.log("6. Execution completed successfully");
    console.log("7. Message flow finished");
  } catch (error) {
    updateExecutionStatus(execution.id, "failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    updateMessageStatus(message.id, "failed");

    console.error("6. Execution failed:", error);
  }
}

/**
 * Run directly for manual local testing.
 */
async function main() {
  await receiveFakeSms("Bonjour, vous êtes dispo demain ?");
}

main().catch((error) => {
  console.error("Fatal error in test flow:", error);
});

import { createMessage, updateMessageStatus } from "./messages/message.service";
import { createSuggestion } from "./suggestions/suggestion.service";
import { createDecision } from "./decisions/decision.service";
import {
  createExecution,
  updateExecutionStatus,
} from "./executions/execution.service";
import { generateReply } from "./ai/generateReply";
import { classifyMessage } from "./ai/classifyMessage";
import { sendSms } from "./executions/sendSms";

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

  const classification = await classifyMessage(message.content);

  console.log("3. Message classified:", classification);

  const reply = await generateReply({
    content: message.content,
    channel: "sms",
  });

  const suggestion = createSuggestion({
    messageId: message.id,
    type: "reply_sms",
    summary: classification.summary,
    proposedText: reply,
    confidence: 0.87,
    context: {
      detectedIntent: classification.intent,
      priority: classification.priority,
      suggestedActionLabel: "Reply",
    },
  });

  updateMessageStatus(message.id, "suggested");

  console.log("4. Suggestion created:", {
    id: suggestion.id,
    messageId: suggestion.messageId,
    proposedText: suggestion.proposedText,
  });

  const simulatedAction: "approve" | "edit" | "cancel" = "approve";

  if (simulatedAction === "cancel") {
    const decision = createDecision({
      messageId: message.id,
      suggestionId: suggestion.id,
      action: "cancel",
      decidedBy: "demo_user",
    });

    updateMessageStatus(message.id, "cancelled");

    console.log("5. Decision created:", decision);
    console.log("6. Flow stopped: user cancelled");
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

  console.log("5. Decision created:", {
    id: decision.id,
    action: decision.action,
    editedText: decision.editedText,
  });

  const finalBody =
    decision.action === "edit" && decision.editedText
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

  console.log("6. Execution created:", {
    id: execution.id,
    type: execution.type,
    status: execution.status,
    payload: execution.payload,
  });

  try {
    const result = await sendSms({
      to: message.from,
      body: finalBody,
    });

    updateExecutionStatus(execution.id, "done", {
      result,
    });

    updateMessageStatus(message.id, "executed");

    console.log("7. Execution completed successfully");
    console.log("8. Message flow finished");
  } catch (error) {
    updateExecutionStatus(execution.id, "failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    updateMessageStatus(message.id, "failed");

    console.error("7. Execution failed:", error);
  }
}

async function main() {
  await receiveFakeSms("Bonjour, vous êtes dispo demain ?");
}

main().catch((error) => {
  console.error("Fatal error in test flow:", error);
});

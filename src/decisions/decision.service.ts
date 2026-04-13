import type { Decision } from "../types";

const decisions = new Map<string, Decision>();

export function createDecision(
  input: Omit<Decision, "id" | "decidedAt">,
): Decision {
  const decision: Decision = {
    id: crypto.randomUUID(),
    decidedAt: new Date().toISOString(),
    ...input,
  };

  decisions.set(decision.id, decision);
  return decision;
}

export function getDecisionById(id: string): Decision | null {
  return decisions.get(id) ?? null;
}

export function getDecisionByMessageId(messageId: string): Decision | null {
  const found = Array.from(decisions.values()).find(
    (decision) => decision.messageId === messageId,
  );

  return found ?? null;
}

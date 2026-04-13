import type { Suggestion } from "../types";

const suggestions = new Map<string, Suggestion>();

export function createSuggestion(
  input: Omit<Suggestion, "id" | "createdAt">,
): Suggestion {
  const suggestion: Suggestion = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  suggestions.set(suggestion.id, suggestion);
  return suggestion;
}

export function getSuggestionById(id: string): Suggestion | null {
  return suggestions.get(id) ?? null;
}

export function getSuggestionByMessageId(messageId: string): Suggestion | null {
  const found = Array.from(suggestions.values()).find(
    (suggestion) => suggestion.messageId === messageId,
  );

  return found ?? null;
}

import type { Message } from "../types";

const messages = new Map<string, Message>();

export function createMessage(input: Omit<Message, "id">): Message {
  const message: Message = {
    id: crypto.randomUUID(),
    ...input,
  };

  messages.set(message.id, message);
  return message;
}

export function getMessageById(id: string): Message | null {
  return messages.get(id) ?? null;
}

export function listMessages(): Message[] {
  return Array.from(messages.values()).sort((a, b) =>
    b.receivedAt.localeCompare(a.receivedAt),
  );
}

export function updateMessageStatus(
  id: string,
  status: Message["status"],
): Message | null {
  const message = messages.get(id);
  if (!message) return null;

  const updated: Message = {
    ...message,
    status,
  };

  messages.set(id, updated);
  return updated;
}

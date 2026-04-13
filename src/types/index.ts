export type Channel = "sms" | "email" | "whatsapp" | "messenger";

export type MessageStatus =
  | "new"
  | "suggested"
  | "approved"
  | "edited"
  | "cancelled"
  | "executed"
  | "failed";

export type Message = {
  id: string;
  conversationId: string;
  channel: Channel;
  from: string;
  to: string;
  content: string;
  subject?: string | null;
  receivedAt: string;
  status: MessageStatus;
};

export type SuggestionType =
  | "reply_sms"
  | "reply_email"
  | "create_appointment"
  | "send_invoice"
  | "send_followup";

export type Suggestion = {
  id: string;
  messageId: string;
  type: SuggestionType;
  summary: string;
  proposedText?: string | null;
  confidence?: number | null;
  createdAt: string;
};

export type DecisionAction = "approve" | "edit" | "cancel";

export type Decision = {
  id: string;
  messageId: string;
  suggestionId: string;
  action: DecisionAction;
  editedText?: string | null;
  decidedAt: string;
  decidedBy: string;
};

export type ExecutionType =
  | "send_sms"
  | "send_email"
  | "create_calendar_event"
  | "send_invoice_file";

export type ExecutionStatus = "pending" | "done" | "failed";

export type Execution = {
  id: string;
  messageId: string;
  suggestionId: string;
  decisionId: string;
  type: ExecutionType;
  status: ExecutionStatus;
  payload: Record<string, unknown>;
  executedAt?: string | null;
  createdAt: string;
};

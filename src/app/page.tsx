"use client";

import { useMemo, useState } from "react";

type MessageStatus = "new" | "suggested" | "approved" | "cancelled";

type InboxMessage = {
  id: string;
  channel: "sms";
  from: string;
  preview: string;
  content: string;
  receivedAt: string;
  status: MessageStatus;
};

type GeneratedReplyResponse = {
  reply: string;
};

const initialMessages: InboxMessage[] = [
  {
    id: "1",
    channel: "sms",
    from: "+33 6 84 12 45 77",
    preview: "Bonjour, vous êtes dispo demain ?",
    content: "Bonjour, vous êtes dispo demain ?",
    receivedAt: "17:42",
    status: "new",
  },
  {
    id: "2",
    channel: "sms",
    from: "+33 6 11 98 22 40",
    preview: "Pouvez-vous m'envoyer votre tarif ?",
    content: "Pouvez-vous m'envoyer votre tarif ?",
    receivedAt: "16:18",
    status: "suggested",
  },
  {
    id: "3",
    channel: "sms",
    from: "+33 7 55 21 90 13",
    preview: "Merci, c'est confirmé pour mardi.",
    content: "Merci, c'est confirmé pour mardi.",
    receivedAt: "15:03",
    status: "approved",
  },
  {
    id: "4",
    channel: "sms",
    from: "+33 6 72 40 18 66",
    preview: "Bonjour, je voudrais déplacer le rendez-vous.",
    content: "Bonjour, je voudrais déplacer le rendez-vous.",
    receivedAt: "13:27",
    status: "new",
  },
];

function statusLabel(status: MessageStatus) {
  switch (status) {
    case "new":
      return "Nouveau";
    case "suggested":
      return "Réponse prête";
    case "approved":
      return "Traité";
    case "cancelled":
      return "Annulé";
    default:
      return status;
  }
}

function statusClasses(status: MessageStatus) {
  switch (status) {
    case "new":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "suggested":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "cancelled":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default function HomePage() {
  const [messages, setMessages] = useState<InboxMessage[]>(initialMessages);
  const [selectedId, setSelectedId] = useState<string>(initialMessages[0].id);
  const [suggestedReply, setSuggestedReply] = useState("");
  const [editedReply, setEditedReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const selectedMessage = useMemo(
    () => messages.find((m) => m.id === selectedId) ?? messages[0],
    [messages, selectedId],
  );

  const canGenerate = !!selectedMessage && !isLoading;
  const canApprove = suggestedReply.trim().length > 0 && !isLoading;

  async function handleGenerateReply() {
    if (!selectedMessage) return;

    setIsLoading(true);
    setStatusMessage("");
    setIsEditing(false);

    try {
      const response = await fetch("/api/ai/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: selectedMessage.content,
          channel: "sms",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reply");
      }

      const data = (await response.json()) as GeneratedReplyResponse;
      setSuggestedReply(data.reply);
      setEditedReply(data.reply);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === selectedMessage.id
            ? { ...msg, status: "suggested" }
            : msg,
        ),
      );
    } catch {
      setStatusMessage("Erreur lors de la génération de la réponse.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleApprove() {
    if (!selectedMessage || !suggestedReply.trim()) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === selectedMessage.id ? { ...msg, status: "approved" } : msg,
      ),
    );

    setStatusMessage("Réponse validée. En V1, le SMS partirait ici.");
  }

  function handleStartEdit() {
    if (!suggestedReply.trim()) return;
    setEditedReply(suggestedReply);
    setIsEditing(true);
    setStatusMessage("");
  }

  function handleSaveEdit() {
    if (!editedReply.trim()) return;
    setSuggestedReply(editedReply);
    setIsEditing(false);
    setStatusMessage("Réponse modifiée. Vous pouvez maintenant la valider.");
  }

  function handleCancel() {
    if (!selectedMessage) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === selectedMessage.id ? { ...msg, status: "cancelled" } : msg,
      ),
    );

    setSuggestedReply("");
    setEditedReply("");
    setIsEditing(false);
    setStatusMessage("Aucune réponse envoyée.");
  }

  function handleSelectMessage(id: string) {
    setSelectedId(id);
    setSuggestedReply("");
    setEditedReply("");
    setIsEditing(false);
    setStatusMessage("");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-3xl border border-[#D9E5F2] bg-white px-5 py-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full border border-[#D9E5F2] bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#0B3A63]">
              BoxActions
            </span>
            <span className="inline-flex rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#0F766E]">
              V1 SMS Inbox
            </span>
          </div>

          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[#0B3A63] sm:text-4xl">
            Turn messages into actions
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#475569] sm:text-base">
            Centralisez vos messages, laissez l’IA proposer une réponse, puis
            validez, modifiez ou annulez en quelques secondes.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-[#D9E5F2] bg-white shadow-sm">
            <div className="border-b border-[#E5EDF5] px-4 py-4">
              <h2 className="text-lg font-semibold text-[#0B3A63]">Inbox</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Messages entrants à traiter
              </p>
            </div>

            <div className="divide-y divide-[#EEF2F7]">
              {messages.map((message) => {
                const isSelected = message.id === selectedId;

                return (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() => handleSelectMessage(message.id)}
                    className={`w-full px-4 py-4 text-left transition ${
                      isSelected
                        ? "bg-[#F3F8FC]"
                        : "bg-white hover:bg-[#FAFCFF]"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-[#0F172A]">
                        {message.from}
                      </span>
                      <span className="text-xs text-[#64748B]">
                        {message.receivedAt}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-sm text-[#475569]">
                      {message.preview}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-[#EEF6FF] px-2 py-1 text-[11px] font-medium text-[#0B3A63]">
                        SMS
                      </span>
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-medium ${statusClasses(
                          message.status,
                        )}`}
                      >
                        {statusLabel(message.status)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-[#D9E5F2] bg-white shadow-sm">
            <div className="border-b border-[#E5EDF5] px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#0B3A63]">
                    Message details
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Réponse assistée par IA
                  </p>
                </div>

                {selectedMessage ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full bg-[#EEF6FF] px-2 py-1 text-xs font-medium text-[#0B3A63]">
                      {selectedMessage.channel.toUpperCase()}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${statusClasses(
                        selectedMessage.status,
                      )}`}
                    >
                      {statusLabel(selectedMessage.status)}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {selectedMessage ? (
              <div className="space-y-5 px-5 py-5">
                <div className="rounded-2xl border border-[#E5EDF5] bg-[#FAFCFF] p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {selectedMessage.from}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {selectedMessage.receivedAt}
                    </p>
                  </div>

                  <p className="text-sm leading-6 text-[#334155]">
                    {selectedMessage.content}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0B3A63]">
                      Suggested reply
                    </h3>
                    <p className="mt-1 text-sm text-[#64748B]">
                      Réponse générée pour ce message
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateReply}
                    disabled={!canGenerate}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#0B3A63] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#092F50] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? "Génération..." : "Proposer une réponse"}
                  </button>
                </div>

                {!isEditing ? (
                  <div className="min-h-[220px] rounded-2xl border border-[#E5EDF5] bg-white p-4 text-sm leading-6 text-[#334155] shadow-sm">
                    {suggestedReply ? (
                      suggestedReply
                    ) : (
                      <span className="text-[#94A3B8]">
                        La réponse proposée apparaîtra ici.
                      </span>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={editedReply}
                    onChange={(e) => setEditedReply(e.target.value)}
                    rows={10}
                    className="min-h-[220px] w-full resize-none rounded-2xl border border-[#CBD5E1] bg-white px-4 py-4 text-sm text-[#0F172A] outline-none transition focus:border-[#15B097] focus:ring-2 focus:ring-[#15B097]/20"
                  />
                )}

                <div className="flex flex-wrap gap-3">
                  {!isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={!canApprove}
                        className="inline-flex items-center justify-center rounded-2xl bg-[#15B097] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#129680] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Valider
                      </button>

                      <button
                        type="button"
                        onClick={handleStartEdit}
                        disabled={!canApprove}
                        className="inline-flex items-center justify-center rounded-2xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-semibold text-[#0B3A63] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center justify-center rounded-2xl border border-[#F1D5DB] bg-white px-4 py-3 text-sm font-semibold text-[#B42318] transition hover:bg-[#FFF5F5]"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="inline-flex items-center justify-center rounded-2xl bg-[#15B097] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#129680]"
                      >
                        Enregistrer
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedReply(suggestedReply);
                        }}
                        className="inline-flex items-center justify-center rounded-2xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-semibold text-[#0B3A63] transition hover:bg-[#F8FAFC]"
                      >
                        Revenir
                      </button>
                    </>
                  )}
                </div>

                {statusMessage ? (
                  <div className="rounded-2xl border border-[#D9E5F2] bg-[#F8FAFC] px-4 py-3 text-sm text-[#334155]">
                    {statusMessage}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="px-5 py-12 text-sm text-[#64748B]">
                Sélectionnez un message.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
            }

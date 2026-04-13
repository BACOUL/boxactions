"use client";

import { useMemo, useState } from "react";

type GeneratedReplyResponse = {
  reply: string;
};

export default function HomePage() {
  const [incomingMessage, setIncomingMessage] = useState(
    "Bonjour, vous êtes dispo demain ?",
  );
  const [suggestedReply, setSuggestedReply] = useState("");
  const [editedReply, setEditedReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");

  const canGenerate = useMemo(
    () => incomingMessage.trim().length > 0 && !isLoading,
    [incomingMessage, isLoading],
  );

  const canApprove = useMemo(
    () => suggestedReply.trim().length > 0 && !isLoading,
    [suggestedReply, isLoading],
  );

  async function handleGenerateReply() {
    if (!incomingMessage.trim()) return;

    setIsLoading(true);
    setStatus("");
    setIsEditing(false);

    try {
      const response = await fetch("/api/ai/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: incomingMessage,
          channel: "sms",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reply");
      }

      const data = (await response.json()) as GeneratedReplyResponse;
      setSuggestedReply(data.reply);
      setEditedReply(data.reply);
    } catch {
      setStatus("Erreur lors de la génération de la réponse.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleApprove() {
    if (!suggestedReply.trim()) return;
    setStatus("SMS validé. En V1, le SMS serait envoyé ici.");
  }

  function handleStartEdit() {
    if (!suggestedReply.trim()) return;
    setEditedReply(suggestedReply);
    setIsEditing(true);
    setStatus("");
  }

  function handleSaveEdit() {
    if (!editedReply.trim()) return;
    setSuggestedReply(editedReply);
    setIsEditing(false);
    setStatus("Réponse modifiée. Vous pouvez maintenant la valider.");
  }

  function handleCancel() {
    setSuggestedReply("");
    setEditedReply("");
    setIsEditing(false);
    setStatus("Aucune réponse envoyée.");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0B172A]">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <div className="mb-2 inline-flex rounded-full border border-[#D6E4F0] bg-white px-3 py-1 text-xs font-medium text-[#0B3A63]">
            BoxActions — V1 SMS
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0B3A63]">
            From message to action
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
            Recevez un message, générez une réponse IA, puis validez, modifiez
            ou annulez.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-[#D6E4F0] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0B3A63]">
                Message reçu
              </h2>
              <span className="rounded-full bg-[#EEF6FF] px-2 py-1 text-xs font-medium text-[#0B3A63]">
                SMS
              </span>
            </div>

            <label
              htmlFor="incoming-message"
              className="mb-2 block text-sm font-medium text-[#334155]"
            >
              Contenu du message
            </label>

            <textarea
              id="incoming-message"
              value={incomingMessage}
              onChange={(e) => setIncomingMessage(e.target.value)}
              rows={10}
              className="w-full resize-none rounded-xl border border-[#CBD5E1] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#15B097] focus:ring-2 focus:ring-[#15B097]/20"
              placeholder="Collez ici le SMS reçu..."
            />

            <button
              type="button"
              onClick={handleGenerateReply}
              disabled={!canGenerate}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#0B3A63] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#092F50] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Génération en cours..." : "Générer une réponse"}
            </button>
          </section>

          <section className="rounded-2xl border border-[#D6E4F0] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0B3A63]">
                Réponse proposée
              </h2>
              <span className="rounded-full bg-[#ECFDF5] px-2 py-1 text-xs font-medium text-[#0F766E]">
                IA
              </span>
            </div>

            {!isEditing ? (
              <div className="min-h-[232px] rounded-xl border border-dashed border-[#CBD5E1] bg-[#FAFCFF] p-3 text-sm leading-6 text-[#334155]">
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
                className="min-h-[232px] w-full resize-none rounded-xl border border-[#CBD5E1] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#15B097] focus:ring-2 focus:ring-[#15B097]/20"
              />
            )}

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={!canApprove}
                    className="inline-flex items-center justify-center rounded-xl bg-[#15B097] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#129680] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Valider
                  </button>

                  <button
                    type="button"
                    onClick={handleStartEdit}
                    disabled={!canApprove}
                    className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-semibold text-[#0B3A63] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center rounded-xl border border-[#F1D5DB] bg-white px-4 py-3 text-sm font-semibold text-[#B42318] transition hover:bg-[#FFF5F5]"
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="inline-flex items-center justify-center rounded-xl bg-[#15B097] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#129680]"
                  >
                    Enregistrer
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedReply(suggestedReply);
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-semibold text-[#0B3A63] transition hover:bg-[#F8FAFC] sm:col-span-2"
                  >
                    Revenir
                  </button>
                </>
              )}
            </div>

            {status ? (
              <div className="mt-4 rounded-xl border border-[#D6E4F0] bg-[#F8FAFC] px-3 py-3 text-sm text-[#334155]">
                {status}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
                    }

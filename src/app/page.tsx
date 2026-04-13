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
    from: "Thomas Martin",
    preview: "Bonjour, vous êtes dispo demain ?",
    content: "Bonjour, vous êtes dispo demain ?",
    receivedAt: "17:42",
    status: "new",
  },
  {
    id: "2",
    channel: "sms",
    from: "Julie Bernard",
    preview: "Pouvez-vous m'envoyer votre tarif ?",
    content: "Pouvez-vous m'envoyer votre tarif ?",
    receivedAt: "16:18",
    status: "suggested",
  },
  {
    id: "3",
    channel: "sms",
    from: "Marc Petit",
    preview: "Merci, c'est confirmé pour mardi.",
    content: "Merci, c'est confirmé pour mardi.",
    receivedAt: "15:03",
    status: "approved",
  },
  {
    id: "4",
    channel: "sms",
    from: "Sophie Laurent",
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

function statusClass(status: MessageStatus) {
  switch (status) {
    case "new":
      return "badge badge-warn";
    case "suggested":
      return "badge badge-info";
    case "approved":
      return "badge badge-success";
    case "cancelled":
      return "badge badge-muted";
    default:
      return "badge badge-muted";
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
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #f4f7fb;
          color: #0f172a;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(21, 176, 151, 0.08), transparent 28%),
            radial-gradient(circle at top right, rgba(11, 58, 99, 0.08), transparent 30%),
            #f4f7fb;
        }

        .container {
          max-width: 1380px;
          margin: 0 auto;
        }

        .hero {
          background: linear-gradient(135deg, #0b3a63 0%, #123f72 55%, #0f5b7a 100%);
          color: white;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 18px 50px rgba(11, 58, 99, 0.18);
          margin-bottom: 22px;
          position: relative;
          overflow: hidden;
        }

        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.14), transparent 22%);
          pointer-events: none;
        }

        .hero-top {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .pill-dark {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .pill-accent {
          background: rgba(21, 176, 151, 0.16);
          color: #d9fff7;
          border: 1px solid rgba(217, 255, 247, 0.16);
        }

        .hero h1 {
          margin: 0;
          font-size: 44px;
          line-height: 1.04;
          font-weight: 800;
          letter-spacing: -0.04em;
          max-width: 760px;
        }

        .hero p {
          margin: 14px 0 0;
          font-size: 17px;
          line-height: 1.65;
          max-width: 760px;
          color: rgba(255, 255, 255, 0.86);
        }

        .layout {
          display: grid;
          grid-template-columns: 360px minmax(0, 1fr);
          gap: 20px;
        }

        .panel {
          background: white;
          border: 1px solid #dbe5f0;
          border-radius: 24px;
          box-shadow: 0 10px 32px rgba(15, 23, 42, 0.06);
          overflow: hidden;
        }

        .panel-header {
          padding: 22px 22px 16px;
          border-bottom: 1px solid #edf2f7;
        }

        .panel-title {
          margin: 0;
          color: #0b3a63;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .panel-subtitle {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.55;
        }

        .inbox-list {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .message-card {
          width: 100%;
          border: 1px solid #e8eef5;
          background: #ffffff;
          border-radius: 18px;
          padding: 14px;
          text-align: left;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .message-card:hover {
          transform: translateY(-1px);
          border-color: #c9d7e7;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
        }

        .message-card.active {
          border-color: #0b3a63;
          background: linear-gradient(180deg, #f8fbff 0%, #f2f7fc 100%);
          box-shadow: 0 12px 28px rgba(11, 58, 99, 0.1);
        }

        .message-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .message-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .message-time {
          font-size: 12px;
          color: #64748b;
          flex-shrink: 0;
        }

        .message-preview {
          margin: 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.5;
          min-height: 42px;
        }

        .message-bottom {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid transparent;
        }

        .badge-channel {
          background: #eef6ff;
          color: #0b3a63;
          border-color: #dbeafe;
        }

        .badge-warn {
          background: #fff8e7;
          color: #9a6700;
          border-color: #f9df9b;
        }

        .badge-info {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        }

        .badge-success {
          background: #ecfdf3;
          color: #047857;
          border-color: #bbf7d0;
        }

        .badge-muted {
          background: #f8fafc;
          color: #475569;
          border-color: #e2e8f0;
        }

        .detail-body {
          padding: 22px;
        }

        .detail-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .detail-meta h3 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #0b3a63;
          letter-spacing: -0.02em;
        }

        .detail-meta p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .detail-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .received-card {
          background: linear-gradient(180deg, #f9fbfe 0%, #f3f7fb 100%);
          border: 1px solid #e4edf6;
          border-radius: 20px;
          padding: 18px;
          margin-bottom: 22px;
        }

        .received-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .received-name {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .received-time {
          font-size: 12px;
          color: #64748b;
        }

        .received-content {
          margin: 0;
          font-size: 16px;
          line-height: 1.7;
          color: #334155;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .section-head h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #0b3a63;
        }

        .section-head p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #64748b;
        }

        .primary-btn {
          appearance: none;
          border: none;
          background: linear-gradient(135deg, #0b3a63 0%, #12517c 100%);
          color: white;
          padding: 12px 18px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.18s ease;
          box-shadow: 0 8px 20px rgba(11, 58, 99, 0.18);
        }

        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(11, 58, 99, 0.24);
        }

        .primary-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .reply-box {
          min-height: 240px;
          border: 1px solid #dbe7f3;
          background: white;
          border-radius: 20px;
          padding: 18px;
          font-size: 16px;
          line-height: 1.75;
          color: #1e293b;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .reply-empty {
          color: #94a3b8;
        }

        .reply-editor {
          width: 100%;
          min-height: 240px;
          border: 1px solid #cbd5e1;
          background: white;
          border-radius: 20px;
          padding: 18px;
          font-size: 16px;
          line-height: 1.7;
          color: #0f172a;
          resize: vertical;
          outline: none;
        }

        .reply-editor:focus {
          border-color: #15b097;
          box-shadow: 0 0 0 4px rgba(21, 176, 151, 0.14);
        }

        .action-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
        }

        .success-btn,
        .secondary-btn,
        .danger-btn {
          appearance: none;
          border: none;
          border-radius: 14px;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .success-btn {
          background: linear-gradient(135deg, #15b097 0%, #10917d 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(21, 176, 151, 0.18);
        }

        .success-btn:hover {
          transform: translateY(-1px);
        }

        .secondary-btn {
          background: white;
          color: #0b3a63;
          border: 1px solid #cbd5e1;
        }

        .secondary-btn:hover {
          background: #f8fafc;
        }

        .danger-btn {
          background: white;
          color: #b42318;
          border: 1px solid #f1d5db;
        }

        .danger-btn:hover {
          background: #fff5f5;
        }

        .success-btn:disabled,
        .secondary-btn:disabled,
        .danger-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .status-box {
          margin-top: 16px;
          border: 1px solid #dbe7f3;
          background: #f8fbff;
          border-radius: 16px;
          padding: 14px 16px;
          color: #334155;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 980px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .hero h1 {
            font-size: 36px;
          }
        }

        @media (max-width: 640px) {
          .page {
            padding: 14px;
          }

          .hero {
            padding: 20px;
            border-radius: 20px;
          }

          .hero h1 {
            font-size: 31px;
          }

          .panel,
          .message-card,
          .received-card,
          .reply-box,
          .reply-editor {
            border-radius: 18px;
          }

          .panel-header,
          .detail-body {
            padding: 16px;
          }

          .inbox-list {
            padding: 10px;
          }

          .message-card {
            padding: 12px;
          }

          .reply-box,
          .reply-editor {
            min-height: 200px;
            font-size: 15px;
          }

          .action-row {
            flex-direction: column;
          }

          .success-btn,
          .secondary-btn,
          .danger-btn,
          .primary-btn {
            width: 100%;
          }
        }
      `}</style>

      <main className="page">
        <div className="container">
          <section className="hero">
            <div className="hero-top">
              <span className="pill pill-dark">BoxActions</span>
              <span className="pill pill-accent">V1 SMS Inbox</span>
            </div>

            <h1>Turn messages into actions</h1>
            <p>
              Centralisez vos messages, laissez l’IA proposer une réponse, puis
              validez, modifiez ou annulez en quelques secondes.
            </p>
          </section>

          <section className="layout">
            <aside className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Inbox</h2>
                <p className="panel-subtitle">Messages entrants à traiter</p>
              </div>

              <div className="inbox-list">
                {messages.map((message) => {
                  const isActive = selectedId === message.id;

                  return (
                    <button
                      key={message.id}
                      type="button"
                      className={`message-card ${isActive ? "active" : ""}`}
                      onClick={() => handleSelectMessage(message.id)}
                    >
                      <div className="message-top">
                        <span className="message-name">{message.from}</span>
                        <span className="message-time">{message.receivedAt}</span>
                      </div>

                      <p className="message-preview">{message.preview}</p>

                      <div className="message-bottom">
                        <span className="badge badge-channel">SMS</span>
                        <span className={statusClass(message.status)}>
                          {statusLabel(message.status)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="panel">
              <div className="panel-header">
                <div className="detail-top">
                  <div className="detail-meta">
                    <h3>Message details</h3>
                    <p>Réponse assistée par IA</p>
                  </div>

                  {selectedMessage ? (
                    <div className="detail-tags">
                      <span className="badge badge-channel">
                        {selectedMessage.channel.toUpperCase()}
                      </span>
                      <span className={statusClass(selectedMessage.status)}>
                        {statusLabel(selectedMessage.status)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {selectedMessage ? (
                <div className="detail-body">
                  <div className="received-card">
                    <div className="received-top">
                      <span className="received-name">{selectedMessage.from}</span>
                      <span className="received-time">
                        {selectedMessage.receivedAt}
                      </span>
                    </div>

                    <p className="received-content">{selectedMessage.content}</p>
                  </div>

                  <div className="section-head">
                    <div>
                      <h4>Suggested reply</h4>
                      <p>Réponse générée pour ce message</p>
                    </div>

                    <button
                      type="button"
                      className="primary-btn"
                      onClick={handleGenerateReply}
                      disabled={!selectedMessage || isLoading}
                    >
                      {isLoading ? "Génération..." : "Proposer une réponse"}
                    </button>
                  </div>

                  {!isEditing ? (
                    <div className="reply-box">
                      {suggestedReply ? (
                        suggestedReply
                      ) : (
                        <span className="reply-empty">
                          La réponse proposée apparaîtra ici.
                        </span>
                      )}
                    </div>
                  ) : (
                    <textarea
                      className="reply-editor"
                      value={editedReply}
                      onChange={(e) => setEditedReply(e.target.value)}
                    />
                  )}

                  <div className="action-row">
                    {!isEditing ? (
                      <>
                        <button
                          type="button"
                          className="success-btn"
                          onClick={handleApprove}
                          disabled={!canApprove}
                        >
                          Valider
                        </button>

                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={handleStartEdit}
                          disabled={!canApprove}
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          className="danger-btn"
                          onClick={handleCancel}
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="success-btn"
                          onClick={handleSaveEdit}
                        >
                          Enregistrer
                        </button>

                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => {
                            setIsEditing(false);
                            setEditedReply(suggestedReply);
                          }}
                        >
                          Revenir
                        </button>
                      </>
                    )}
                  </div>

                  {statusMessage ? (
                    <div className="status-box">{statusMessage}</div>
                  ) : null}
                </div>
              ) : null}
            </section>
          </section>
        </div>
      </main>
    </>
  );
                                       }

export default function Home() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.container}>
          {/* LOGO + BRAND */}
          <div style={styles.brand}>
            <span style={styles.logo}>BoxActions</span>
          </div>

          {/* HEADLINE */}
          <h1 style={styles.h1}>
            Vous recevez un SMS.
            <br />
            BoxActions prépare la réponse.
            <br />
            Vous validez en un clic.
          </h1>

          {/* SUBTITLE */}
          <p style={styles.subtitle}>
            La boîte de réception intelligente pour les professionnels.
            <br />
            Répondez plus vite à vos clients, sans perdre le contrôle.
          </p>

          {/* CTA */}
          <div style={styles.ctaWrapper}>
            <button style={styles.cta}>Tester la V1</button>
            <p style={styles.micro}>
              Aucune réponse envoyée sans validation
            </p>
          </div>

          {/* MOCK VISUAL */}
          <div style={styles.mock}>
            <div style={styles.sms}>
              <p style={styles.smsText}>
                Bonjour, vous êtes dispo demain ?
              </p>
            </div>

            <div style={styles.reply}>
              <p style={styles.replyText}>
                Oui, je peux vous proposer 18h. Cela vous convient ?
              </p>

              <button style={styles.validateBtn}>Valider</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    margin: 0,
    backgroundColor: "#F8FAFC",
    fontFamily: "Inter, sans-serif",
  },

  hero: {
    padding: "80px 20px",
    background:
      "linear-gradient(135deg, #0B3A63 0%, #0f4c81 100%)",
    color: "white",
    textAlign: "center" as const,
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  brand: {
    marginBottom: "20px",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "700",
    opacity: 0.9,
  },

  h1: {
    fontSize: "42px",
    lineHeight: "1.2",
    fontWeight: "800",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "18px",
    opacity: 0.85,
    marginBottom: "30px",
  },

  ctaWrapper: {
    marginBottom: "50px",
  },

  cta: {
    backgroundColor: "#15B097",
    border: "none",
    padding: "14px 26px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    color: "white",
  },

  micro: {
    marginTop: "10px",
    fontSize: "13px",
    opacity: 0.8,
  },

  mock: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
    alignItems: "center",
  },

  sms: {
    backgroundColor: "white",
    color: "#0B3A63",
    padding: "14px 18px",
    borderRadius: "14px",
    maxWidth: "300px",
    textAlign: "left" as const,
  },

  smsText: {
    margin: 0,
  },

  reply: {
    backgroundColor: "#E6FFFA",
    color: "#0B3A63",
    padding: "14px 18px",
    borderRadius: "14px",
    maxWidth: "300px",
    textAlign: "left" as const,
  },

  replyText: {
    marginBottom: "10px",
  },

  validateBtn: {
    backgroundColor: "#15B097",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export type EngineTestCase = {
  id: string;
  label: string;
  input: string;
  expectedIntent:
    | "availability_request"
    | "pricing_request"
    | "invoice_request"
    | "gratitude"
    | "general_request";
};

export const engineTestCases: EngineTestCase[] = [
  {
    id: "case_01",
    label: "Availability request",
    input: "Bonjour, vous êtes dispo demain ?",
    expectedIntent: "availability_request",
  },
  {
    id: "case_02",
    label: "Pricing request",
    input: "Pouvez-vous m'envoyer votre tarif ?",
    expectedIntent: "pricing_request",
  },
  {
    id: "case_03",
    label: "Confirmation message",
    input: "Merci, c'est confirmé pour mardi.",
    expectedIntent: "gratitude",
  },
  {
    id: "case_04",
    label: "Reschedule request",
    input: "Bonjour, je voudrais déplacer le rendez-vous.",
    expectedIntent: "availability_request",
  },
  {
    id: "case_05",
    label: "Invoice request",
    input: "Envoyez-moi la facture du 23 avril.",
    expectedIntent: "invoice_request",
  },
  {
    id: "case_06",
    label: "Opening hours request",
    input: "Vous êtes ouverts samedi ?",
    expectedIntent: "general_request",
  },
  {
    id: "case_07",
    label: "Short confirmation",
    input: "Ok pour 18h.",
    expectedIntent: "general_request",
  },
  {
    id: "case_08",
    label: "Simple gratitude",
    input: "Merci beaucoup.",
    expectedIntent: "gratitude",
  },
  {
    id: "case_09",
    label: "Missed call",
    input: "J’ai essayé de vous appeler.",
    expectedIntent: "general_request",
  },
  {
    id: "case_10",
    label: "Earlier time request",
    input: "Pouvez-vous passer plus tôt ?",
    expectedIntent: "availability_request",
  },
];

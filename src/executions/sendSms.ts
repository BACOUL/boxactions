export type SendSmsInput = {
  to: string;
  body: string;
};

export type SendSmsResult = {
  providerId: string;
};

export async function sendSms(input: SendSmsInput): Promise<SendSmsResult> {
  console.log("\n--- SMS SENT ---");
  console.log("TO:", input.to);
  console.log("BODY:", input.body);
  console.log("----------------\n");

  return {
    providerId: `fake_sms_${Date.now()}`,
  };
}

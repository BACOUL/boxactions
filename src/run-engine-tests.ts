import { classifyMessage } from "./ai/classifyMessage";
import { generateReply } from "./ai/generateReply";
import { engineTestCases } from "./test-cases";

async function runEngineTests() {
  console.log("====================================");
  console.log("BOXACTIONS ENGINE TESTS");
  console.log("====================================\n");

  for (const testCase of engineTestCases) {
    const classification = await classifyMessage(testCase.input);
    const reply = await generateReply({
      content: testCase.input,
      channel: "sms",
    });

    const intentMatches = classification.intent === testCase.expectedIntent;

    console.log(`--- ${testCase.id} | ${testCase.label} ---`);
    console.log("INPUT:");
    console.log(testCase.input);
    console.log("");
    console.log("EXPECTED INTENT:");
    console.log(testCase.expectedIntent);
    console.log("");
    console.log("DETECTED INTENT:");
    console.log(classification.intent);
    console.log("");
    console.log("PRIORITY:");
    console.log(classification.priority);
    console.log("");
    console.log("SUMMARY:");
    console.log(classification.summary);
    console.log("");
    console.log("REPLY:");
    console.log(reply);
    console.log("");
    console.log("INTENT MATCH:");
    console.log(intentMatches ? "YES" : "NO");
    console.log("\n");
  }

  console.log("====================================");
  console.log("END OF TESTS");
  console.log("====================================");
}

runEngineTests().catch((error) => {
  console.error("Engine test runner failed:", error);
});

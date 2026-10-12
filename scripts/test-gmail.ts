import { sendEmail } from "../src/lib/gmail";
import { config } from "dotenv";

config({ path: ".env.local" });

async function test() {
  try {
    console.log("Testing Gmail API...");
    const res = await sendEmail("test@example.com", "Test Subject", "Test Body");
    console.log("Success:", res);
  } catch (e: any) {
    console.error("Error sending email:", e.message);
    if (e.response) {
      console.error("Response data:", e.response.data);
    }
  }
}

test();

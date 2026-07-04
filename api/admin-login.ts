import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkCredentials, checkPin, createToken } from "../server/adminAuth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  try {
    const { email, password, pin } = req.body as { email?: string; password?: string; pin?: string };
    if (!email || !password || !pin) {
      return res.status(400).json({ success: false, error: "Email, password and PIN required" });
    }

    // Generic message on any failure — don't reveal which factor was wrong.
    if (!checkCredentials(email, password) || !checkPin(pin)) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = createToken(email);
    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac, timingSafeEqual } from "crypto";

// NOTE: this auth logic is duplicated in api/leads.ts rather than imported
// from a shared file. Vercel's serverless function bundler does not reliably
// trace/include relative imports that live outside the /api directory
// (confirmed via a real ERR_MODULE_NOT_FOUND at runtime), so each function
// is kept fully self-contained instead.

const TOKEN_LIFETIME_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function createToken(email: string): string {
  const expires = Date.now() + TOKEN_LIFETIME_MS;
  const payload = Buffer.from(`${email}:${expires}`).toString("base64url");
  const signature = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function checkCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;

  const emailBuf = Buffer.from(email);
  const expectedEmailBuf = Buffer.from(adminEmail);
  const emailMatches =
    emailBuf.length === expectedEmailBuf.length && timingSafeEqual(emailBuf, expectedEmailBuf);

  const passBuf = Buffer.from(password);
  const expectedPassBuf = Buffer.from(adminPassword);
  const passMatches =
    passBuf.length === expectedPassBuf.length && timingSafeEqual(passBuf, expectedPassBuf);

  return emailMatches && passMatches;
}

function checkPin(pin: string): boolean {
  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) return false;

  const pinBuf = Buffer.from(pin);
  const expectedPinBuf = Buffer.from(adminPin);
  return pinBuf.length === expectedPinBuf.length && timingSafeEqual(pinBuf, expectedPinBuf);
}

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

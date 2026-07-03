import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_LIFETIME_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

export function createToken(email: string): string {
  const expires = Date.now() + TOKEN_LIFETIME_MS;
  const payload = Buffer.from(`${email}:${expires}`).toString("base64url");
  const signature = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = createHmac("sha256", getSecret()).update(payload).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    const expires = Number(decoded.split(":").pop());
    return Number.isFinite(expires) && Date.now() < expires;
  } catch {
    return false;
  }
}

export function checkCredentials(email: string, password: string): boolean {
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

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import { createHmac, timingSafeEqual } from "crypto";

// NOTE: this auth logic is duplicated in api/admin-login.ts rather than
// imported from a shared file — see the comment there for why.
// See the comment in api/leads.ts about why this uses `pg` rather than
// @vercel/postgres (that package doesn't actually work with Supabase).

function getConnectionString(): string {
  const candidateUrlVars = [
    "POSTGRES_URL",
    "tamesisstorage_POSTGRES_URL",
    "tamesisstorage_POSTGRES_URL_NON_POOLING",
    "tamesisstorage_DATABASE_URL",
    "tamesisstorage_POSTGRES_PRISMA_URL",
  ];
  for (const key of candidateUrlVars) {
    if (process.env[key]) {
      return process.env[key] as string;
    }
  }

  const host = process.env.tamesisstorage_POSTGRES_HOST;
  const database = process.env.tamesisstorage_POSTGRES_DATABASE;
  const password = process.env.tamesisstorage_POSTGRES_PASSWORD;
  const user = process.env.tamesisstorage_POSTGRES_USER || "postgres";

  if (host && database && password) {
    return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
  }

  throw new Error(
    "No Postgres connection string or host/database/user/password env vars found (checked tamesisstorage_ prefixed variables)"
  );
}

// The connection string from Supabase/Vercel includes "?sslmode=require",
// which newer versions of pg-connection-string treat as an alias for
// "verify-full" (strict certificate chain + hostname verification) —
// overriding any explicit `ssl` option passed separately, and causing a
// SELF_SIGNED_CERT_IN_CHAIN error against Supabase's cert chain. Stripping
// sslmode from the URL and relying purely on the explicit ssl object below
// avoids that.
function buildPool(connectionString: string): Pool {
  let cleaned = connectionString;
  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");
    cleaned = url.toString();
  } catch {
    // Leave as-is if it doesn't parse as a standard URL.
  }
  return new Pool({ connectionString: cleaned, ssl: { rejectUnauthorized: false } });
}

let pool: Pool | null = null;
let poolInitError: string | null = null;
try {
  pool = buildPool(getConnectionString());
} catch (err) {
  poolInitError = err instanceof Error ? err.message : "Unknown database configuration error";
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function verifyToken(token: string | undefined | null): boolean {
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

// Example submissions only, for demoing the admin dashboard — not real customers.
const SAMPLE_LEADS: { formType: string; fields: Record<string, string>; status: string; daysAgo: number }[] = [
  {
    formType: "callback",
    fields: { name: "Sarah Whitfield", phone: "07700 900123", service: "Bathroom Refurbishment", message: "Please call after 5pm, at work during the day." },
    status: "new",
    daysAgo: 0,
  },
  {
    formType: "quote",
    fields: {
      name: "James Okonkwo",
      company: "",
      phone: "07700 900456",
      email: "james.okonkwo@example.com",
      propertyType: "Residential — Flat",
      sector: "Landlords",
      service: "Leak Detection",
      description: "Water stain appearing on the ceiling below the upstairs bathroom, needs investigating urgently.",
      preferredDate: "",
    },
    status: "contacted",
    daysAgo: 1,
  },
  {
    formType: "contact",
    fields: {
      name: "Riverside Housing Association",
      phone: "020 7946 0958",
      email: "maintenance@riversidehousing-example.co.uk",
      reason: "Contract / Sector Enquiry",
      message: "Looking to discuss a planned maintenance contract across our Croydon estate, approximately 120 units.",
    },
    status: "quoted",
    daysAgo: 2,
  },
  {
    formType: "report-repair",
    fields: {
      name: "Priya Anand",
      phone: "07700 900789",
      address: "14 Fulham Park Road, London SW6",
      issue: "Kitchen tap dripping constantly and washer needs replacing.",
      access: "Key held by neighbour at number 16",
    },
    status: "won",
    daysAgo: 4,
  },
  {
    formType: "emergency",
    fields: {
      name: "Michael Torres",
      phone: "07700 900321",
      address: "22 Camden High Street, London NW1",
      type: "No Heating or Hot Water",
      details: "Boiler stopped working overnight, no heating or hot water in the property.",
    },
    status: "won",
    daysAgo: 5,
  },
  {
    formType: "careers",
    fields: {
      fullName: "Daniel Osei",
      phone: "07700 900654",
      email: "daniel.osei@example.com",
      experience: "5 years as a multi-trade engineer, previously with a housing association contractor in East London.",
      role: "Multi-Trade Engineer",
    },
    status: "new",
    daysAgo: 3,
  },
  {
    formType: "callback",
    fields: { name: "Grovewood Property Management", phone: "020 3488 1122", service: "Void Property Refurbishment", message: "Portfolio of 8 units, would like a call to discuss a standing arrangement." },
    status: "lost",
    daysAgo: 7,
  },
  {
    formType: "quote",
    fields: {
      name: "Amara Chukwu",
      company: "",
      phone: "07700 900987",
      email: "amara.chukwu@example.com",
      propertyType: "Residential — House",
      sector: "Residential Homeowners",
      service: "Painting & Decorating",
      description: "Whole ground floor needs repainting after some water damage repairs, roughly 90sqm.",
      preferredDate: "",
    },
    status: "new",
    daysAgo: 0,
  },
  {
    formType: "callback",
    fields: { name: "Tom Bracewell", phone: "07700 900234", service: "Electrical Services", message: "Fuse box tripping intermittently, would like to talk through options before booking." },
    status: "contacted",
    daysAgo: 1,
  },
  {
    formType: "contact",
    fields: {
      name: "Southbank Managing Agents",
      phone: "020 3488 7766",
      email: "ops@southbank-example.co.uk",
      reason: "Contract / Sector Enquiry",
      message: "We manage a portfolio of 6 buildings and are reviewing our current maintenance contractor. Keen to discuss.",
    },
    status: "quoted",
    daysAgo: 6,
  },
  {
    formType: "emergency",
    fields: {
      name: "Elena Vasquez",
      phone: "07700 900567",
      address: "9 Islington Green, London N1",
      type: "Flooding / Burst Pipe",
      details: "Burst pipe under the kitchen sink, water coming through into the flat below.",
    },
    status: "contacted",
    daysAgo: 0,
  },
  {
    formType: "report-repair",
    fields: {
      name: "Robert Kaminski",
      phone: "07700 900345",
      address: "31 Wandsworth Bridge Road, London SW6",
      issue: "Bedroom window not closing properly, draught coming through.",
      access: "Tenant will be home after 4pm",
    },
    status: "new",
    daysAgo: 2,
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!verifyToken(token)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (!pool) {
    console.error("Postgres pool init error:", poolInitError);
    return res.status(500).json({ success: false, error: "Database not configured" });
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        form_type TEXT NOT NULL,
        fields JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';`);
    await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';`);

    for (const lead of SAMPLE_LEADS) {
      await pool.query(
        `INSERT INTO leads (form_type, fields, status, created_at)
         VALUES ($1, $2, $3, now() - ($4::text || ' days')::interval);`,
        [lead.formType, JSON.stringify(lead.fields), lead.status, lead.daysAgo]
      );
    }

    return res.status(200).json({ success: true, inserted: SAMPLE_LEADS.length });
  } catch (err) {
    console.error("Seed leads error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}

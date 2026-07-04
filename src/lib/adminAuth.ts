const TOKEN_KEY = "tamesis_admin_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(
  email: string,
  password: string,
  pin: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, pin }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Login failed" };
    }
    setAdminToken(data.token);
    return { success: true };
  } catch {
    return { success: false, error: "Network error — please try again" };
  }
}

export interface Lead {
  id: number;
  form_type: string;
  fields: Record<string, string>;
  status: string;
  notes: string;
  created_at: string;
}

export async function fetchLeads(): Promise<{ success: boolean; leads?: Lead[]; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: "Not logged in" };

  try {
    const res = await fetch("/api/leads", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      if (res.status === 401) clearAdminToken();
      return { success: false, error: data.error || "Failed to load leads" };
    }
    return { success: true, leads: data.leads };
  } catch {
    return { success: false, error: "Network error — please try again" };
  }
}

export async function updateLead(
  id: number,
  updates: { status?: string; notes?: string }
): Promise<{ success: boolean; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: "Not logged in" };

  try {
    const res = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...updates }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to update lead" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error — please try again" };
  }
}

export async function seedSampleLeads(): Promise<{ success: boolean; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: "Not logged in" };

  try {
    const res = await fetch("/api/seed-leads", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to add sample leads" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error — please try again" };
  }
}

export async function fetchSettings(): Promise<{ success: boolean; notifyEmail?: string; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: "Not logged in" };

  try {
    const res = await fetch("/api/settings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to load settings" };
    }
    return { success: true, notifyEmail: data.settings?.notify_email || "" };
  } catch {
    return { success: false, error: "Network error — please try again" };
  }
}

export async function updateNotifyEmail(notifyEmail: string): Promise<{ success: boolean; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: "Not logged in" };

  try {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notifyEmail }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to save settings" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error — please try again" };
  }
}

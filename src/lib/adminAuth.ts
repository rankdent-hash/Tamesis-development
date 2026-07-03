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

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
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

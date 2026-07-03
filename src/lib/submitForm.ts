export async function submitForm(formType: string, fields: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formType, fields }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}

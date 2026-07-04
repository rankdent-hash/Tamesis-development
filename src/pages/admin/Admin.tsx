import { useEffect, useState, type FormEvent } from "react";
import { LogOut, Mail, Lock, AlertCircle, RefreshCw, Inbox, KeyRound } from "lucide-react";
import { Seo } from "../../components/Seo";
import { Button } from "../../components/ui/button";
import { adminLogin, fetchLeads, getAdminToken, clearAdminToken, type Lead } from "../../lib/adminAuth";

const FORM_LABELS: Record<string, string> = {
  "hero-quote": "Hero Quote Form",
  quote: "Quote Request",
  contact: "Contact Form",
  "report-repair": "Report a Repair",
  emergency: "Emergency Callout",
  careers: "Careers Application",
};

function getService(lead: Lead): string {
  const f = lead.fields;
  return f.service || f.reason || f.type || f.role || (lead.form_type === "report-repair" ? "Repair" : "—");
}

function getMessage(lead: Lead): string {
  const f = lead.fields;
  return f.message || f.description || f.issue || f.details || f.experience || "";
}

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function Admin() {
  const [authed, setAuthed] = useState(!!getAdminToken());

  return (
    <div className="min-h-screen bg-navy-50">
      <Seo title="Admin" description="Tamesis Development Ltd admin panel." path="/admin" />
      {authed ? <LeadsDashboard onLogout={() => setAuthed(false)} /> : <LoginForm onSuccess={() => setAuthed(true)} />}
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<"credentials" | "pin">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep("pin");
  };

  const handleFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await adminLogin(email, password, pin);
    setSubmitting(false);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || "Login failed");
      setPin("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="w-12 h-12 mx-auto rounded-lg bg-navy-900 text-orange-400 font-display font-bold text-xl flex items-center justify-center">
            T
          </span>
          <h1 className="mt-4 font-display font-bold text-navy-900 text-2xl">Admin Login</h1>
          <p className="mt-1 text-sm text-slate">Tamesis Development Ltd</p>
        </div>

        {step === "credentials" ? (
          <form onSubmit={handleContinue} className="rounded-2xl border-2 border-navy-900 bg-white p-7 shadow-card space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700" />
              <input
                type="email"
                placeholder="Email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center">
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="rounded-2xl border-2 border-navy-900 bg-white p-7 shadow-card space-y-4">
            <div>
              <p className="text-sm text-navy-800 mb-1">Enter your security PIN</p>
              <p className="text-xs text-slate-light mb-3">Signing in as {email}</p>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700" />
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="PIN"
                  required
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-3 text-sm tracking-widest focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center" disabled={submitting}>
              {submitting ? "Verifying..." : "Sign In"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setError(null);
              }}
              className="w-full text-center text-xs text-slate hover:text-navy-900 transition-colors"
            >
              Back
            </button>

            {error && (
              <p className="flex items-center gap-1.5 justify-center text-xs text-red-600">
                <AlertCircle size={13} /> {error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function LeadsDashboard({ onLogout }: { onLogout: () => void }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchLeads();
    setLoading(false);
    if (result.success) {
      setLeads(result.leads || []);
    } else {
      setError(result.error || "Failed to load leads");
      if (result.error === "Not logged in" || result.error === "Unauthorized") {
        onLogout();
      }
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    onLogout();
  };

  return (
    <div>
      <header className="bg-navy-900 text-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-white/10 text-orange-400 font-display font-bold flex items-center justify-center">
              T
            </span>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">Leads</h1>
              <p className="text-xs text-navy-100/60 font-accent">Tamesis Development Ltd — Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              <LogOut size={13} /> Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
        {loading && <p className="text-sm text-slate">Loading leads...</p>}

        {error && (
          <p className="flex items-center gap-1.5 text-sm text-red-600 mb-4">
            <AlertCircle size={14} /> {error}
          </p>
        )}

        {!loading && leads && leads.length === 0 && (
          <div className="rounded-2xl border-2 border-navy-100 bg-white p-12 text-center">
            <Inbox size={32} className="mx-auto text-slate-light" />
            <p className="mt-3 text-sm text-slate">
              No leads yet. Submissions from the website's forms will appear here.
            </p>
          </div>
        )}

        {!loading && leads && leads.length > 0 && (
          <div className="rounded-2xl border-2 border-navy-900 bg-white shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50 border-b-2 border-navy-900 text-left">
                  <th className="px-4 py-3 font-accent text-xs uppercase tracking-wide text-navy-700">Date &amp; Time</th>
                  <th className="px-4 py-3 font-accent text-xs uppercase tracking-wide text-navy-700">Form</th>
                  <th className="px-4 py-3 font-accent text-xs uppercase tracking-wide text-navy-700">Name</th>
                  <th className="px-4 py-3 font-accent text-xs uppercase tracking-wide text-navy-700">Contact</th>
                  <th className="px-4 py-3 font-accent text-xs uppercase tracking-wide text-navy-700">Service</th>
                  <th className="px-4 py-3 font-accent text-xs uppercase tracking-wide text-navy-700">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {leads.map((lead) => {
                  const { date, time } = formatDate(lead.created_at);
                  const message = getMessage(lead);
                  const isExpanded = expanded === lead.id;
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-navy-50/50 cursor-pointer align-top"
                      onClick={() => setExpanded(isExpanded ? null : lead.id)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-navy-900">{date}</div>
                        <div className="text-xs text-slate-light font-accent">{time}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-semibold">
                          {FORM_LABELS[lead.form_type] || lead.form_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-navy-900 whitespace-nowrap">
                        {lead.fields.name || lead.fields.fullName || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.fields.phone && <div>{lead.fields.phone}</div>}
                        {lead.fields.email && <div className="text-xs text-slate">{lead.fields.email}</div>}
                        {!lead.fields.phone && !lead.fields.email && "—"}
                      </td>
                      <td className="px-4 py-3">{getService(lead)}</td>
                      <td className="px-4 py-3 max-w-xs">
                        {isExpanded ? (
                          <div className="space-y-1">
                            {Object.entries(lead.fields).map(([k, v]) => (
                              <div key={k}>
                                <span className="text-xs text-slate-light capitalize">{k}: </span>
                                <span className="text-navy-900">{v}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="line-clamp-2 text-slate">{message || "—"}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

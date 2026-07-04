import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  LogOut,
  Mail,
  Lock,
  AlertCircle,
  RefreshCw,
  Inbox,
  KeyRound,
  Sparkles,
  Save,
  Settings as SettingsIcon,
  CheckCircle2,
  TrendingUp,
  LayoutDashboard,
  FileText,
  Phone,
  AlertTriangle,
  Wrench,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { Seo } from "../../components/Seo";
import { Button } from "../../components/ui/button";
import {
  adminLogin,
  fetchLeads,
  updateLead,
  seedSampleLeads,
  fetchSettings,
  updateNotifyEmail,
  getAdminToken,
  clearAdminToken,
  type Lead,
} from "../../lib/adminAuth";
import { cn } from "../../lib/utils";

const FORM_LABELS: Record<string, string> = {
  "hero-quote": "Quick Quote",
  quote: "Quote Request",
  contact: "Contact Form",
  "report-repair": "Report a Repair",
  emergency: "Emergency Callout",
  careers: "Careers Application",
  callback: "Callback Request",
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new: { label: "New", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  contacted: { label: "Contacted", bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  quoted: { label: "Quoted", bg: "bg-navy-50", text: "text-navy-700", dot: "bg-navy-700" },
  won: { label: "Won", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  lost: { label: "Lost", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const STATUS_ORDER = ["new", "contacted", "quoted", "won", "lost"];

// Sidebar sections — each maps to a set of form_type values to show, or
// "all"/"settings"/"dashboard" for the special views.
const NAV_SECTIONS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, types: null },
  { key: "all", label: "All Leads", icon: Inbox, types: "all" as const },
  { key: "quote", label: "Quote Requests", icon: FileText, types: ["quote"] },
  { key: "callback", label: "Callback Requests", icon: Phone, types: ["hero-quote", "callback"] },
  { key: "contact", label: "Contact Enquiries", icon: MessageSquare, types: ["contact"] },
  { key: "emergency", label: "Emergency Callouts", icon: AlertTriangle, types: ["emergency"] },
  { key: "repair", label: "Repair Requests", icon: Wrench, types: ["report-repair"] },
  { key: "careers", label: "Careers", icon: Briefcase, types: ["careers"] },
] as const;

function getService(lead: Lead): string {
  const f = lead.fields;
  return f.service || f.reason || f.type || f.role || (lead.form_type === "report-repair" ? "Repair" : "—");
}

function getMessage(lead: Lead): string {
  const f = lead.fields;
  return f.message || f.description || f.issue || f.details || f.experience || "";
}

function formatDate(iso: string): { relative: string } {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);
  let relative = "";
  if (diffHrs < 1) relative = "Just now";
  else if (diffHrs < 24) relative = `${Math.floor(diffHrs)}h ago`;
  else relative = `${Math.floor(diffHrs / 24)}d ago`;
  return { relative };
}

export function Admin() {
  const [authed, setAuthed] = useState(!!getAdminToken());

  return (
    <div className="min-h-screen bg-navy-50">
      <Seo title="Admin" description="Tamesis Development Ltd admin panel." path="/admin" />
      {authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <LoginForm onSuccess={() => setAuthed(true)} />}
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

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<string>("dashboard");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchLeads();
    setLoading(false);
    if (result.success) {
      setLeads(result.leads || []);
    } else {
      setError(result.error || "Failed to load leads");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    const result = await seedSampleLeads();
    setSeeding(false);
    if (result.success) {
      load();
    } else {
      setError(result.error || "Failed to add sample leads");
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    onLogout();
  };

  const activeNav = NAV_SECTIONS.find((n) => n.key === section);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-navy-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-navy-800">
          <span className="w-9 h-9 rounded-lg bg-white/10 text-orange-400 font-display font-bold flex items-center justify-center shrink-0">
            T
          </span>
          <div>
            <h1 className="font-display font-bold text-sm leading-tight">Tamesis Admin</h1>
            <p className="text-[10px] text-navy-100/60 font-accent">Customer follow-up</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_SECTIONS.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors text-left",
                section === item.key ? "bg-orange-500 text-navy-950" : "text-navy-100/75 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={16} className="shrink-0" />
              {item.label}
            </button>
          ))}

          <div className="pt-3 mt-3 border-t border-navy-800">
            <button
              onClick={() => setSection("settings")}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors text-left",
                section === "settings" ? "bg-orange-500 text-navy-950" : "text-navy-100/75 hover:bg-white/5 hover:text-white"
              )}
            >
              <SettingsIcon size={16} className="shrink-0" />
              Email Settings
            </button>
          </div>
        </nav>

        <div className="p-3 border-t border-navy-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-navy-100/75 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b-2 border-navy-900 px-8 py-5 flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-display font-bold text-navy-900 text-xl">
            {section === "settings" ? "Email Settings" : activeNav?.label || "Dashboard"}
          </h2>
          {section !== "settings" && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-1.5 rounded-full border-2 border-navy-900 px-4 py-2 text-xs font-semibold hover:bg-navy-900 hover:text-white transition-colors disabled:opacity-60"
              >
                <Sparkles size={13} /> {seeding ? "Adding..." : "Add Sample Leads"}
              </button>
              <button
                onClick={load}
                className="flex items-center gap-1.5 rounded-full border-2 border-navy-900 px-4 py-2 text-xs font-semibold hover:bg-navy-900 hover:text-white transition-colors"
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          )}
        </header>

        <main className="p-8">
          {section === "settings" ? (
            <SettingsPanel />
          ) : (
            <LeadsView
              leads={leads}
              loading={loading}
              error={error}
              onSeed={handleSeed}
              seeding={seeding}
              typeFilter={activeNav?.types ?? "all"}
              showDashboardStats={section === "dashboard"}
              onStatusChange={(lead, status) => {
                setLeads((prev) => (prev ? prev.map((l) => (l.id === lead.id ? { ...l, status } : l)) : prev));
                updateLead(lead.id, { status });
              }}
              onSaveNote={(lead, notes) => {
                setLeads((prev) => (prev ? prev.map((l) => (l.id === lead.id ? { ...l, notes } : l)) : prev));
                updateLead(lead.id, { notes });
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings().then((result) => {
      setLoading(false);
      if (result.success) {
        setNotifyEmail(result.notifyEmail || "");
      } else {
        setError(result.error || "Failed to load settings");
      }
    });
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    const result = await updateNotifyEmail(notifyEmail);
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || "Failed to save");
    }
  };

  return (
    <div className="max-w-xl">
      <p className="text-sm text-slate">
        Every form submission on the website (quote requests, contact enquiries, emergency callouts, etc.) sends an
        email via Resend to the address below. Update it here any time — no need to touch code or Vercel settings.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-slate">Loading...</p>
      ) : (
        <form onSubmit={handleSave} className="mt-6 rounded-2xl border-2 border-navy-900 bg-white p-7 shadow-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Notification Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700" />
              <input
                type="email"
                required
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={saving}>
            <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
          </Button>

          {saved && (
            <p className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle2 size={13} /> Saved — future submissions will be sent here.
            </p>
          )}
          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-600">
              <AlertCircle size={13} /> {error}
            </p>
          )}
        </form>
      )}

      <div className="mt-6 rounded-2xl border border-navy-100 bg-navy-50 p-5">
        <p className="text-xs text-slate-light leading-relaxed">
          <strong className="text-navy-700">Note:</strong> the Resend API key itself (which authorizes sending email
          at all) is set separately as a <code className="text-navy-900">RESEND_API_KEY</code> environment variable
          in Vercel, not here — that's a one-time technical setup step, whereas this email address is something
          you're expected to change from time to time and shouldn't need a developer for.
        </p>
      </div>
    </div>
  );
}

function LeadsView({
  leads,
  loading,
  error,
  onSeed,
  seeding,
  typeFilter,
  showDashboardStats,
  onStatusChange,
  onSaveNote,
}: {
  leads: Lead[] | null;
  loading: boolean;
  error: string | null;
  onSeed: () => void;
  seeding: boolean;
  typeFilter: "all" | readonly string[];
  showDashboardStats: boolean;
  onStatusChange: (lead: Lead, status: string) => void;
  onSaveNote: (lead: Lead, notes: string) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const scopedLeads = useMemo(() => {
    if (!leads) return [];
    if (typeFilter === "all") return leads;
    return leads.filter((l) => (typeFilter as readonly string[]).includes(l.form_type));
  }, [leads, typeFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: scopedLeads.length };
    for (const status of STATUS_ORDER) c[status] = 0;
    scopedLeads.forEach((l) => {
      c[l.status] = (c[l.status] || 0) + 1;
    });
    return c;
  }, [scopedLeads]);

  const thisWeekCount = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return scopedLeads.filter((l) => new Date(l.created_at).getTime() > weekAgo).length;
  }, [scopedLeads]);

  const filteredLeads = useMemo(() => {
    let result = statusFilter === "all" ? scopedLeads : scopedLeads.filter((l) => l.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((l) => {
        const name = (l.fields.name || l.fields.fullName || "").toLowerCase();
        const phone = (l.fields.phone || "").toLowerCase();
        const email = (l.fields.email || "").toLowerCase();
        return name.includes(q) || phone.includes(q) || email.includes(q);
      });
    }
    return result;
  }, [scopedLeads, statusFilter, search]);

  return (
    <div>
      {!loading && leads && scopedLeads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border-2 border-navy-900 bg-white p-5">
            <div className="flex items-center gap-2 text-slate-light">
              <Inbox size={14} />
              <span className="text-xs font-accent uppercase tracking-wide">Total</span>
            </div>
            <p className="mt-2 font-display font-bold text-navy-900 text-2xl">{counts.all}</p>
          </div>
          <div className="rounded-2xl border-2 border-navy-900 bg-white p-5">
            <div className="flex items-center gap-2 text-slate-light">
              <TrendingUp size={14} />
              <span className="text-xs font-accent uppercase tracking-wide">This Week</span>
            </div>
            <p className="mt-2 font-display font-bold text-navy-900 text-2xl">{thisWeekCount}</p>
          </div>
          <div className="rounded-2xl border-2 border-navy-900 bg-white p-5">
            <div className="flex items-center gap-2 text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs font-accent uppercase tracking-wide">New</span>
            </div>
            <p className="mt-2 font-display font-bold text-navy-900 text-2xl">{counts.new}</p>
          </div>
          <div className="rounded-2xl border-2 border-navy-900 bg-white p-5">
            <div className="flex items-center gap-2 text-green-600">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs font-accent uppercase tracking-wide">Won</span>
            </div>
            <p className="mt-2 font-display font-bold text-navy-900 text-2xl">{counts.won}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {!loading &&
            leads &&
            scopedLeads.length > 0 &&
            ["all", ...STATUS_ORDER].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold border transition-colors",
                  statusFilter === s
                    ? "bg-navy-900 text-white border-navy-900"
                    : "bg-white text-navy-700 border-navy-200 hover:border-navy-900"
                )}
              >
                {s === "all" ? "All" : STATUS_CONFIG[s].label} ({counts[s] || 0})
              </button>
            ))}
        </div>

        {scopedLeads.length > 0 && (
          <input
            type="text"
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full border-2 border-navy-900 px-4 py-2 text-xs w-56 focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none"
          />
        )}
      </div>

      {loading && <p className="text-sm text-slate">Loading leads...</p>}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600 mb-4">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      {!loading && leads && scopedLeads.length === 0 && (
        <div className="rounded-2xl border-2 border-navy-100 bg-white p-12 text-center">
          <Inbox size={32} className="mx-auto text-slate-light" />
          <h3 className="mt-4 font-display font-semibold text-navy-900 text-lg">
            {showDashboardStats ? "No leads yet" : "Nothing here yet"}
          </h3>
          <p className="mt-2 text-sm text-slate max-w-sm mx-auto">
            {showDashboardStats
              ? "Submissions from the website's forms will appear here automatically. Add some examples to see how it looks first."
              : "Submissions of this type will show up here as they come in."}
          </p>
          {showDashboardStats && (
            <Button variant="primary" className="mt-5" onClick={onSeed} disabled={seeding}>
              <Sparkles size={14} /> {seeding ? "Adding..." : "Add Sample Leads"}
            </Button>
          )}
        </div>
      )}

      {!loading && scopedLeads.length > 0 && filteredLeads.length === 0 && (
        <div className="rounded-2xl border-2 border-navy-100 bg-white p-10 text-center">
          <p className="text-sm text-slate">No leads match this filter or search.</p>
        </div>
      )}

      {!loading && filteredLeads.length > 0 && (
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const { relative } = formatDate(lead.created_at);
            const message = getMessage(lead);
            const service = getService(lead);
            const isExpanded = expanded === lead.id;
            const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
            const name = lead.fields.name || lead.fields.fullName || "Unknown";

            return (
              <div
                key={lead.id}
                className={cn(
                  "rounded-2xl border-2 bg-white shadow-card transition-colors",
                  isExpanded ? "border-orange-500" : "border-navy-900"
                )}
              >
                <div
                  className="flex flex-wrap items-center gap-4 p-5 cursor-pointer"
                  onClick={() => {
                    setExpanded(isExpanded ? null : lead.id);
                    setNoteDraft(lead.notes || "");
                  }}
                >
                  <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", statusCfg.dot)} />

                  <div className="min-w-[140px]">
                    <p className="font-display font-semibold text-navy-900">{name}</p>
                    <p className="text-xs text-slate-light">{relative}</p>
                  </div>

                  <span className="inline-flex rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-semibold shrink-0">
                    {FORM_LABELS[lead.form_type] || lead.form_type}
                  </span>

                  <div className="text-sm text-slate min-w-[140px]">
                    {lead.fields.phone && <div>{lead.fields.phone}</div>}
                    {lead.fields.email && <div className="text-xs">{lead.fields.email}</div>}
                  </div>

                  <div className="text-sm text-navy-800 min-w-[120px]">{service}</div>

                  <p className="flex-1 min-w-[160px] text-sm text-slate line-clamp-1">{message || "—"}</p>

                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold border-0 outline-none cursor-pointer shrink-0",
                      statusCfg.bg,
                      statusCfg.text
                    )}
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_CONFIG[s].label}
                      </option>
                    ))}
                  </select>
                </div>

                {isExpanded && (
                  <div className="border-t border-navy-100 p-5 bg-navy-50/50 rounded-b-2xl space-y-5">
                    <div>
                      <h4 className="text-xs font-accent uppercase tracking-wide text-navy-700 mb-2">
                        Full Submission
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        {Object.entries(lead.fields).map(([k, v]) => (
                          <div key={k} className="text-sm">
                            <span className="text-slate-light capitalize">{k}: </span>
                            <span className="text-navy-900">{v || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-accent uppercase tracking-wide text-navy-700 mb-2">
                        Follow-up Notes
                      </label>
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        rows={2}
                        placeholder="e.g. Called 3pm, left voicemail. Follow up Thursday."
                        className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none resize-none bg-white"
                      />
                      <Button variant="primary" size="sm" className="mt-3" onClick={() => onSaveNote(lead, noteDraft)}>
                        <Save size={13} /> Save Note
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

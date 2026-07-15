import { useEffect, useMemo, useState } from "react";
import { Phone, TrendingUp, Calendar, MapPin, RefreshCw } from "lucide-react";
import { fetchCallClicks, type CallClick } from "../../lib/adminAuth";

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

function labelForPhone(raw: string): string {
  const clean = normalizePhone(raw);
  if (clean.endsWith("2034883737")) return "Booking Line (020 3488 3737)";
  if (clean.endsWith("7379021500")) return "WhatsApp (07379 021500)";
  return raw || "Unknown number";
}

function isWithinDays(isoDate: string, days: number): boolean {
  const clicked = new Date(isoDate).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return clicked >= cutoff;
}

export function CallTracking() {
  const [clicks, setClicks] = useState<CallClick[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchCallClicks();
    setLoading(false);
    if (result.success) {
      setClicks(result.clicks || []);
    } else {
      setError(result.error || "Failed to load call click data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    if (!clicks) return null;

    const last7 = clicks.filter((c) => isWithinDays(c.created_at, 7));
    const last30 = clicks.filter((c) => isWithinDays(c.created_at, 30));

    const byPhone = new Map<string, number>();
    for (const c of clicks) {
      const label = labelForPhone(c.phone_number);
      byPhone.set(label, (byPhone.get(label) || 0) + 1);
    }

    const byPage = new Map<string, number>();
    for (const c of clicks) {
      byPage.set(c.page_path, (byPage.get(c.page_path) || 0) + 1);
    }
    const topPages = [...byPage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    return {
      total: clicks.length,
      last7: last7.length,
      last30: last30.length,
      byPhone: [...byPhone.entries()].sort((a, b) => b[1] - a[1]),
      topPages,
      recent: clicks.slice(0, 25),
    };
  }, [clicks]);

  if (loading) {
    return <div className="text-sm text-slate-light py-12 text-center">Loading call click data…</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 text-red-700 text-sm p-5">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          onClick={load}
          className="flex items-center gap-1.5 rounded-full border-2 border-navy-900 px-4 py-2 text-xs font-semibold hover:bg-navy-900 hover:text-white transition-colors"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Top-line stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border-2 border-navy-900 bg-white p-5">
          <div className="flex items-center gap-2 text-slate-light text-xs font-accent uppercase tracking-widest mb-2">
            <Phone size={14} /> Total Clicks
          </div>
          <div className="font-display font-bold text-3xl text-navy-900">{stats.total}</div>
        </div>
        <div className="rounded-2xl border-2 border-navy-900 bg-white p-5">
          <div className="flex items-center gap-2 text-slate-light text-xs font-accent uppercase tracking-widest mb-2">
            <TrendingUp size={14} /> Last 7 Days
          </div>
          <div className="font-display font-bold text-3xl text-navy-900">{stats.last7}</div>
        </div>
        <div className="rounded-2xl border-2 border-navy-900 bg-white p-5">
          <div className="flex items-center gap-2 text-slate-light text-xs font-accent uppercase tracking-widest mb-2">
            <Calendar size={14} /> Last 30 Days
          </div>
          <div className="font-display font-bold text-3xl text-navy-900">{stats.last30}</div>
        </div>
      </div>

      {stats.total === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-navy-200 p-10 text-center text-sm text-slate-light">
          No phone clicks recorded yet. This starts filling in as soon as visitors tap a "Call Now" link
          anywhere on the site.
        </div>
      ) : (
        <>
          {/* By phone number */}
          <div>
            <h3 className="font-display font-semibold text-navy-900 text-sm mb-3">Clicks by Phone Number</h3>
            <div className="rounded-2xl border-2 border-navy-900 bg-white overflow-hidden">
              {stats.byPhone.map(([label, count], i) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-5 py-3 text-sm ${i !== 0 ? "border-t border-navy-100" : ""}`}
                >
                  <span className="text-navy-800">{label}</span>
                  <span className="font-display font-bold text-navy-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top pages */}
          <div>
            <h3 className="font-display font-semibold text-navy-900 text-sm mb-3 flex items-center gap-1.5">
              <MapPin size={14} /> Top Pages Driving Calls
            </h3>
            <div className="rounded-2xl border-2 border-navy-900 bg-white overflow-hidden">
              {stats.topPages.map(([path, count], i) => (
                <div
                  key={path}
                  className={`flex items-center justify-between px-5 py-3 text-sm gap-4 ${i !== 0 ? "border-t border-navy-100" : ""}`}
                >
                  <span className="text-navy-800 font-mono text-xs truncate">{path}</span>
                  <span className="font-display font-bold text-navy-900 shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <h3 className="font-display font-semibold text-navy-900 text-sm mb-3">Recent Clicks</h3>
            <div className="rounded-2xl border-2 border-navy-900 bg-white overflow-hidden">
              {stats.recent.map((c, i) => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between px-5 py-3 text-xs gap-4 ${i !== 0 ? "border-t border-navy-100" : ""}`}
                >
                  <span className="text-navy-800 font-mono truncate">{c.page_path}</span>
                  <span className="text-slate-light shrink-0">{labelForPhone(c.phone_number)}</span>
                  <span className="text-slate-light shrink-0">{new Date(c.created_at).toLocaleString("en-GB")}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

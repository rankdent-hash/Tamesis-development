export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-3">
        <span className="w-10 h-10 rounded-lg bg-navy-900 text-blue-400 font-display font-bold text-lg flex items-center justify-center animate-pulse">
          T
        </span>
        <span className="text-xs font-accent uppercase tracking-widest text-slate-light">Loading</span>
      </div>
    </div>
  );
}

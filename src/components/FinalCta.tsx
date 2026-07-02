export function FinalCta() {
  return (
    <section className="relative py-24 lg:py-32 bg-navy-950 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-50" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
        <h2 className="font-display font-bold text-white text-3xl lg:text-5xl leading-tight text-balance max-w-3xl mx-auto">
          Looking for a Reliable Property Maintenance Partner?
        </h2>
        <p className="mt-6 text-navy-100/75 max-w-2xl mx-auto leading-relaxed">
          Whether you require responsive repairs, planned maintenance, refurbishment or construction services, our
          experienced team is ready to help.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="/quote"
            className="rounded-full bg-orange-500 text-navy-950 px-9 py-4 text-sm font-bold shadow-card hover:bg-orange-400 hover:shadow-card-hover transition-all"
          >
            Request a Quote
          </a>
          <a
            href="/contact"
            className="rounded-full border border-white/30 text-white px-9 py-4 text-sm font-bold hover:bg-white/10 transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}

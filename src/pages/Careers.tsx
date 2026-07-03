import { useState, type FormEvent } from "react";
import { MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { AnimateIn } from "../components/AnimateIn";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/button";
import { vacancies, benefits } from "../data/content";

export function Careers() {
  const [selectedRole, setSelectedRole] = useState<string>(vacancies[0].title);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No backend wired up yet — swap this for a real submit handler
    // (e.g. POST to an API route or a form service) when ready.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.careers.title} description={seoMeta.careers.description} path="/careers" />
      <Header />
      <main>
        <PageHero
          eyebrow="Careers"
          title="Build Your Career With Tamesis"
          subtitle="We're always looking for reliable, skilled tradespeople and support staff to join our directly employed teams across London."
          breadcrumb="Careers"
        />

        {/* Why join us */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Why Join Us</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Consistent Work, Real Support
              </h2>
            </AnimateIn>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((benefit) => (
                <div key={benefit.name} className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                  <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon name={benefit.icon} size={20} strokeWidth={1.75} />
                  </span>
                  <span className="font-display font-semibold text-navy-900 text-sm">{benefit.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vacancies */}
        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Current Vacancies</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Open Roles
              </h2>
            </AnimateIn>

            <div className="mt-10 rounded-2xl bg-white border border-navy-100 shadow-card divide-y divide-navy-100 overflow-hidden">
              {vacancies.map((role) => (
                <div key={role.title} className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div>
                    <h3 className="font-display font-semibold text-navy-900 text-lg">{role.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {role.location}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {role.type}</span>
                    </div>
                  </div>
                  <Button
                    variant={selectedRole === role.title ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedRole(role.title);
                      setSubmitted(false);
                      document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application form */}
        <section id="application-form" className="py-24 lg:py-32 scroll-mt-24">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Application</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl leading-tight text-balance">
                Apply Now
              </h2>
              <p className="mt-3 text-slate">Applying for: <span className="font-semibold text-navy-900">{selectedRole}</span></p>
            </div>

            {submitted ? (
              <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center">
                <CheckCircle2 size={32} className="mx-auto text-blue-600" />
                <h3 className="mt-4 font-display font-semibold text-navy-900 text-lg">Application Received</h3>
                <p className="mt-2 text-sm text-slate">
                  Thanks — a member of our team will be in touch about the {selectedRole} role shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-2xl border border-navy-100 bg-white p-8 shadow-card">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-navy-800 mb-1.5">Full Name</label>
                    <input id="fullName" name="fullName" type="text" required className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-navy-800 mb-1.5">Phone</label>
                    <input id="phone" name="phone" type="tel" required className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-navy-800 mb-1.5">Email</label>
                  <input id="email" name="email" type="email" required className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-navy-800 mb-1.5">Relevant Experience</label>
                  <textarea id="experience" name="experience" rows={4} required className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none resize-none" />
                </div>
                <Button type="submit" variant="primary" className="w-full justify-center">
                  Submit Application
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

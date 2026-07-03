import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";

export function ComingSoon({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-40 pb-24 px-6">
        <div className="text-center max-w-lg">
          <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">
            Page in progress
          </span>
          <h1 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl">{title}</h1>
          <p className="mt-4 text-slate leading-relaxed">
            This page is being built next. In the meantime, get in touch and our team will help directly.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="primary" onClick={() => (navigate("/quote"))}>
              Request a Quote
            </Button>
            <Button variant="outline" onClick={() => (navigate("/"))}>
              Back to Home
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

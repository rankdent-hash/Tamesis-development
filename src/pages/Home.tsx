import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Sectors } from "../components/Sectors";
import { WhyChoose } from "../components/WhyChoose";
import { Projects } from "../components/Projects";
import { Process } from "../components/Process";
import { Reviews } from "../components/Reviews";
import { Coverage } from "../components/Coverage";
import { EmergencyCallout } from "../components/EmergencyCallout";
import { News } from "../components/News";
import { FinalCta } from "../components/FinalCta";
import { Footer } from "../components/Footer";

export function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <About />
        <Services />
        <Sectors />
        <WhyChoose />
        <Projects />
        <Process />
        <Reviews />
        <Coverage />
        <EmergencyCallout />
        <News />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

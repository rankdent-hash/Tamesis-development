import { Services } from "../components/Services";
import { About } from "../components/About";
import { WhyChoose } from "../components/WhyChoose";
import { Process } from "../components/Process";
import { Reviews } from "../components/Reviews";
import { Coverage } from "../components/Coverage";
import { EmergencyCallout } from "../components/EmergencyCallout";
import { News } from "../components/News";
import { FinalCta } from "../components/FinalCta";
import { Footer } from "../components/Footer";

/** The part of the home page below the first screen - loaded after the hero has painted. */
export default function HomeSections() {
  return (
    <>
      <Services />
      <About />
      <WhyChoose />
      <Process />
      <Reviews />
      <Coverage />
      <EmergencyCallout />
      <News />
      <FinalCta />
      <Footer />
    </>
  );
}

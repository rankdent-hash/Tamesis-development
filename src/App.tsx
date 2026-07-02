import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { SectorsPage } from "./pages/SectorsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { Careers } from "./pages/Careers";
import { Contact } from "./pages/Contact";
import { ServiceTemplate } from "./pages/ServiceTemplate";
import { ServicesPage } from "./pages/ServicesPage";
import { ComingSoon } from "./pages/ComingSoon";
import { services, sectors } from "./data/content";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<ServicesPage />} />
        {services.map((s) => (
          <Route key={s.slug} path={`/services/${s.slug}`} element={<ServiceTemplate service={s} />} />
        ))}
        <Route path="/sectors" element={<SectorsPage />} />
        {sectors.map((s) => (
          <Route key={s.name} path={`/sectors/${s.name.toLowerCase().replace(/\s+/g, "-")}`} element={<ComingSoon title={s.name} />} />
        ))}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quote" element={<ComingSoon title="Request a Quote" />} />
        <Route path="/report-repair" element={<ComingSoon title="Report a Repair" />} />
        <Route path="/emergency" element={<ComingSoon title="Emergency Callout" />} />
        <Route path="/coverage" element={<ComingSoon title="Coverage Areas" />} />
        <Route path="/news" element={<ComingSoon title="Latest News" />} />
        <Route path="/privacy-policy" element={<ComingSoon title="Privacy Policy" />} />
        <Route path="/cookie-policy" element={<ComingSoon title="Cookie Policy" />} />
        <Route path="/terms" element={<ComingSoon title="Terms" />} />
        <Route path="*" element={<ComingSoon title="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

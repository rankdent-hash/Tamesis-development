import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { ComingSoon } from "./pages/ComingSoon";
import { services, sectors } from "./data/content";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<ComingSoon title="About Us" />} />
        <Route path="/services" element={<ComingSoon title="Services" />} />
        {services.map((s) => (
          <Route key={s.slug} path={`/services/${s.slug}`} element={<ComingSoon title={s.name} />} />
        ))}
        <Route path="/sectors" element={<ComingSoon title="Sectors" />} />
        {sectors.map((s) => (
          <Route key={s.name} path={`/sectors/${s.name.toLowerCase().replace(/\s+/g, "-")}`} element={<ComingSoon title={s.name} />} />
        ))}
        <Route path="/projects" element={<ComingSoon title="Projects" />} />
        <Route path="/reviews" element={<ComingSoon title="Reviews" />} />
        <Route path="/careers" element={<ComingSoon title="Careers" />} />
        <Route path="/contact" element={<ComingSoon title="Contact" />} />
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

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { SectorsPage } from "./pages/SectorsPage";
import { HousingAssociations } from "./pages/sectors/HousingAssociations";
import { LocalAuthorities } from "./pages/sectors/LocalAuthorities";
import { PropertyManagement } from "./pages/sectors/PropertyManagement";
import { CommercialClients } from "./pages/sectors/CommercialClients";
import { Landlords } from "./pages/sectors/Landlords";
import { ResidentialHomeowners } from "./pages/sectors/ResidentialHomeowners";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { Careers } from "./pages/Careers";
import { Contact } from "./pages/Contact";
import { Quote } from "./pages/Quote";
import { ReportRepair } from "./pages/ReportRepair";
import { Emergency } from "./pages/Emergency";
import { Coverage } from "./pages/Coverage";
import { News } from "./pages/News";
import { PrivacyPolicy } from "./pages/legal/PrivacyPolicy";
import { CookiePolicy } from "./pages/legal/CookiePolicy";
import { Terms } from "./pages/legal/Terms";
import { ServiceTemplate } from "./pages/ServiceTemplate";
import { ServicesPage } from "./pages/ServicesPage";
import { ComingSoon } from "./pages/ComingSoon";
import { services } from "./data/content";

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
        <Route path="/sectors/housing-associations" element={<HousingAssociations />} />
        <Route path="/sectors/local-authorities" element={<LocalAuthorities />} />
        <Route path="/sectors/property-management-companies" element={<PropertyManagement />} />
        <Route path="/sectors/commercial-clients" element={<CommercialClients />} />
        <Route path="/sectors/landlords" element={<Landlords />} />
        <Route path="/sectors/residential-homeowners" element={<ResidentialHomeowners />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/report-repair" element={<ReportRepair />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/coverage" element={<Coverage />} />
        <Route path="/news" element={<News />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<ComingSoon title="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

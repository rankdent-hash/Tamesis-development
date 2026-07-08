import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SiteSchema } from "./components/SiteSchema";
import { StickyMobileCall } from "./components/StickyMobileCall";
import { InternalLinkInterceptor } from "./components/InternalLinkInterceptor";
import { PageLoader } from "./components/PageLoader";
import { services, retiredServiceRedirects } from "./data/content";

// Every route is code-split into its own chunk so the initial load only
// fetches what's needed for the page the visitor actually lands on.
const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const ServiceTemplate = lazy(() => import("./pages/ServiceTemplate").then((m) => ({ default: m.ServiceTemplate })));
const LocationRoute = lazy(() => import("./pages/LocationTemplate").then((m) => ({ default: m.LocationRoute })));
const ServiceLocationRoute = lazy(() => import("./pages/ServiceLocationTemplate").then((m) => ({ default: m.ServiceLocationRoute })));
const SectorsPage = lazy(() => import("./pages/SectorsPage").then((m) => ({ default: m.SectorsPage })));
const HousingAssociations = lazy(() => import("./pages/sectors/HousingAssociations").then((m) => ({ default: m.HousingAssociations })));
const LocalAuthorities = lazy(() => import("./pages/sectors/LocalAuthorities").then((m) => ({ default: m.LocalAuthorities })));
const PropertyManagement = lazy(() => import("./pages/sectors/PropertyManagement").then((m) => ({ default: m.PropertyManagement })));
const CommercialClients = lazy(() => import("./pages/sectors/CommercialClients").then((m) => ({ default: m.CommercialClients })));
const Landlords = lazy(() => import("./pages/sectors/Landlords").then((m) => ({ default: m.Landlords })));
const ResidentialHomeowners = lazy(() => import("./pages/sectors/ResidentialHomeowners").then((m) => ({ default: m.ResidentialHomeowners })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage })));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage").then((m) => ({ default: m.ReviewsPage })));
const Careers = lazy(() => import("./pages/Careers").then((m) => ({ default: m.Careers })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const Quote = lazy(() => import("./pages/Quote").then((m) => ({ default: m.Quote })));
const ReportRepair = lazy(() => import("./pages/ReportRepair").then((m) => ({ default: m.ReportRepair })));
const Emergency = lazy(() => import("./pages/Emergency").then((m) => ({ default: m.Emergency })));
const Coverage = lazy(() => import("./pages/Coverage").then((m) => ({ default: m.Coverage })));
const News = lazy(() => import("./pages/News").then((m) => ({ default: m.News })));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy").then((m) => ({ default: m.CookiePolicy })));
const SitemapPage = lazy(() => import("./pages/SitemapPage").then((m) => ({ default: m.SitemapPage })));
const ThankYou = lazy(() => import("./pages/ThankYou").then((m) => ({ default: m.ThankYou })));
const BlogPage = lazy(() => import("./pages/BlogPage").then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage").then((m) => ({ default: m.BlogPostPage })));
const Admin = lazy(() => import("./pages/admin/Admin").then((m) => ({ default: m.Admin })));
const Terms = lazy(() => import("./pages/legal/Terms").then((m) => ({ default: m.Terms })));
const ComingSoon = lazy(() => import("./pages/ComingSoon").then((m) => ({ default: m.ComingSoon })));

function App() {
  return (
    <BrowserRouter>
      <SiteSchema />
      <StickyMobileCall />
      <InternalLinkInterceptor />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          {services.map((s) => (
            <Route key={s.slug} path={`/services/${s.slug}`} element={<ServiceTemplate service={s} />} />
          ))}
          {Object.entries(retiredServiceRedirects).map(([oldSlug, newSlug]) => (
            <Route key={oldSlug} path={`/services/${oldSlug}`} element={<Navigate to={`/services/${newSlug}`} replace />} />
          ))}
          <Route path="/services/:serviceSlug/:locationSlug" element={<ServiceLocationRoute />} />
          <Route path="/property-maintenance/:locationSlug" element={<LocationRoute />} />
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
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<ComingSoon title="Page Not Found" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

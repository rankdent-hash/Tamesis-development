import { lazy, Suspense } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";

// Everything below the first screen (including the footer and the 3D house
// tour) lives in its own chunk. The header, hero text and call-to-actions are
// in the initial bundle so they paint first; this loads right after.
const HomeSections = lazy(() => import("./HomeSections"));

export function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.home.title} description={seoMeta.home.description} path="/" />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Suspense fallback={<div className="min-h-[70vh]" aria-hidden="true" />}>
          <HomeSections />
        </Suspense>
      </main>
    </div>
  );
}

import { lazy, Suspense } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import { LatexIntro } from "~/components/LatexIntro";
import { BASE_URL } from "~/lib/site-routes";
import { seo } from "~/lib/seo";

export function meta() {
  return [
    ...seo("/"),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "LaTeX Renderer",
        description:
          "Free online LaTeX formula editor with live preview. Export to PNG, JPG, SVG, PDF. Convert tables between LaTeX, MATLAB, Python, and C++ formats.",
        url: `${BASE_URL}/`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Visual LaTeX formula editor",
          "Live MathJax preview",
          "Export to PNG, JPG, SVG, PDF",
          "Table editor with format conversion",
          "URL-based formula sharing",
        ],
        author: {
          "@type": "Organization",
          name: "quebi.de",
          url: "https://quebi.de/",
        },
      },
    },
  ];
}

// Lazy + client-only: the editor pulls in MathLive, Three.js, and code that
// reads window at first render, none of which can run in the prerender. The
// prerendered HTML ships the crawlable <LatexIntro/> instead.
const EditorApp = lazy(() =>
  import("../../src/components/App").then((m) => ({ default: m.App })),
);

export default function Home() {
  const intro = <LatexIntro />;
  return (
    <ClientOnly fallback={intro}>
      {() => (
        <Suspense fallback={intro}>
          <EditorApp />
        </Suspense>
      )}
    </ClientOnly>
  );
}

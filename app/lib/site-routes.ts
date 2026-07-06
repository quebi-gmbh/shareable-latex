/**
 * Single source of truth for the site's routes and per-page metadata.
 *
 * Drives three things so they can never drift apart:
 *   - react-router.config.ts  -> prerender() list
 *   - app/lib/seo.ts          -> per-route <title>/description/canonical/OG tags
 *   - scripts/prebuild.ts     -> sitemap.xml + robots.txt
 *
 * Plain data only (no JSX / no `~` alias imports) so it can be imported from
 * the React Router config and the Node build scripts, which run outside Vite.
 */
import { EXAMPLES } from "./examples";

export const BASE_URL = "https://latex.quebi.de";
export const SITE = "LaTeX Renderer";

export interface RouteMeta {
  /** URL path, beginning with "/". */
  path: string;
  /** Display name — used as the <title> stem. */
  name: string;
  /** 1–2 sentence description for meta + social cards. */
  description: string;
  /** Use `name` verbatim as the title instead of appending the site name. */
  exactTitle?: boolean;
}

const STATIC_ROUTES: RouteMeta[] = [
  {
    path: "/",
    name: "LaTeX Renderer — Create, Export & Share LaTeX Formulas",
    description:
      "Free online LaTeX formula editor with live preview. Export to PNG, JPG, SVG, PDF. Convert tables between LaTeX, MATLAB, Python, and C++ formats. Share formulas via URL.",
    exactTitle: true,
  },
  {
    path: "/examples",
    name: "LaTeX Formula Examples",
    description:
      "A gallery of ready-to-use LaTeX formulas — the quadratic formula, Euler's identity, integrals, summations, and more. Open any one in the editor to render, tweak, and export.",
  },
];

const EXAMPLE_ROUTES: RouteMeta[] = EXAMPLES.map((e) => ({
  path: `/examples/${e.slug}`,
  name: `${e.name} in LaTeX`,
  description: e.description,
}));

export const ROUTES: RouteMeta[] = [...STATIC_ROUTES, ...EXAMPLE_ROUTES];

/** Just the paths, for prerender() and sitemap generation. */
export const SITE_ROUTES = ROUTES.map((r) => r.path);

/** Look up a route's metadata by path. Throws if unknown (build-time guard). */
export function routeMeta(path: string): RouteMeta {
  const r = ROUTES.find((x) => x.path === path);
  if (!r)
    throw new Error(
      `No route metadata defined for "${path}" in app/lib/site-routes.ts`,
    );
  return r;
}

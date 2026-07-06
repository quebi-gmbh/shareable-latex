/**
 * Pre-build step (run via tsx before `react-router build`). Generates the
 * static SEO assets from the shared route registry so they can never drift
 * from the actual set of prerendered routes:
 *
 *   - public/sitemap.xml
 *   - public/robots.txt
 *
 * Both land in public/ and are copied into build/client by the RR build.
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BASE_URL, SITE_ROUTES } from "../app/lib/site-routes";

const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(here, "..", "public");

const LASTMOD = process.env.SITEMAP_LASTMOD ?? new Date().toISOString().slice(0, 10);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...SITE_ROUTES.map((u) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${u === "/" ? "/" : u}</loc>`,
      `    <lastmod>${LASTMOD}</lastmod>`,
      `    <changefreq>monthly</changefreq>`,
      `    <priority>${u === "/" ? "1.0" : "0.7"}</priority>`,
      "  </url>",
    ].join("\n"),
  ),
  "</urlset>",
  "",
].join("\n");

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${BASE_URL}/sitemap.xml`,
  "",
].join("\n");

await writeFile(join(PUBLIC, "sitemap.xml"), sitemap);
await writeFile(join(PUBLIC, "robots.txt"), robots);

console.log(
  `prebuild: sitemap.xml (${SITE_ROUTES.length} urls) + robots.txt written to public/`,
);

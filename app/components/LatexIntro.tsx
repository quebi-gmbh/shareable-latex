import { Link } from "react-router";
import { Header } from "../../src/components/Header";
import { Footer } from "../../src/components/Footer";
import { StaticBackground } from "./StaticBackground";

const FEATURES = [
  "WYSIWYG visual editor (MathLive) and raw LaTeX mode",
  "Live preview rendered with MathJax",
  "Export to PNG, JPG, SVG, and PDF",
  "Table editor converting between LaTeX, MATLAB, Python, NumPy, and C++",
  "Every formula saved in the URL for instant sharing",
];

/**
 * The server-safe shell rendered during prerender and while the client-only
 * editor loads. It carries the real <h1>, an intro paragraph, and a crawlable
 * feature list so the prerendered HTML has genuine, indexable content, then a
 * skeleton placeholder where the interactive editor mounts on the client.
 */
export function LatexIntro() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[#030712]">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <StaticBackground />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <Header />

        <main className="mx-auto w-full max-w-3xl flex-1 p-6">
          <div className="flex flex-col gap-6">
            <h1 className="sr-only">
              LaTeX Renderer — create, export, and share LaTeX formulas
            </h1>
            <p className="text-center text-[#9ca3af]">
              A free online LaTeX formula editor with live preview. Type in a
              visual editor or raw LaTeX, render instantly, export to PNG, JPG,
              SVG, or PDF, and share any formula through its URL.
            </p>

            <ul className="mx-auto flex max-w-xl list-disc flex-col gap-1 pl-6 text-sm text-[#9ca3af]">
              {FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <p className="text-center text-sm text-[#9ca3af]">
              New to LaTeX? Browse{" "}
              <Link
                to="/examples"
                className="font-medium text-[#2dd4a8] hover:text-[#f9fafb]"
              >
                ready-made formula examples
              </Link>
              .
            </p>

            {/* Editor mounts here on the client. */}
            <div
              aria-hidden="true"
              className="h-64 animate-pulse rounded-xl border border-[rgba(45,212,168,0.1)] bg-[rgba(11,17,32,0.6)]"
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

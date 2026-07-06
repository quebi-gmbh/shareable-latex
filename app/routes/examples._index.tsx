import { Link } from "react-router";
import { PageShell } from "~/components/PageShell";
import { EXAMPLES } from "~/lib/examples";
import { seo } from "~/lib/seo";

export function meta() {
  return seo("/examples");
}

export default function ExamplesIndex() {
  return (
    <PageShell>
      <article className="flex flex-col gap-8 py-4">
        <header className="flex flex-col gap-3 text-center">
          <h1 className="bg-gradient-to-br from-[#f9fafb] to-[#2dd4a8] bg-clip-text text-3xl font-bold text-transparent">
            LaTeX Formula Examples
          </h1>
          <p className="mx-auto max-w-2xl text-[#9ca3af]">
            A gallery of common LaTeX formulas — from the quadratic formula to
            Euler's identity. Open any one in the editor to render it live, tweak
            the source, and export to PNG, SVG, or PDF.
          </p>
        </header>

        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {EXAMPLES.map((e) => (
            <li key={e.slug}>
              <Link
                to={`/examples/${e.slug}`}
                className="block h-full rounded-xl border border-[rgba(45,212,168,0.12)] bg-[rgba(11,17,32,0.6)] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(45,212,168,0.4)] hover:shadow-[0_0_24px_rgba(45,212,168,0.15)]"
              >
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#2dd4a8]">
                  {e.category}
                </span>
                <h2 className="mb-1 text-lg font-semibold text-[#f9fafb]">
                  {e.name}
                </h2>
                <code className="block break-all font-mono text-sm text-[#9ca3af]">
                  {e.latex}
                </code>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </PageShell>
  );
}

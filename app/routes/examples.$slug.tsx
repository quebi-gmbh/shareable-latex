import { Link, useParams } from "react-router";
import { ArrowRight } from "lucide-react";
import { PageShell } from "~/components/PageShell";
import { EXAMPLES, editorHref, findExample } from "~/lib/examples";
import { seo } from "~/lib/seo";

export function meta({ params }: { params: { slug?: string } }) {
  const ex = params.slug ? findExample(params.slug) : undefined;
  if (!ex) return [{ title: "Example not found — LaTeX Renderer" }];
  return seo(`/examples/${ex.slug}`);
}

export default function ExamplePage() {
  const { slug } = useParams();
  const ex = slug ? findExample(slug) : undefined;

  if (!ex) {
    return (
      <PageShell>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-[#f9fafb]">
            Example not found
          </h1>
          <p className="text-[#9ca3af]">
            That formula example doesn't exist.
          </p>
          <Link
            to="/examples"
            className="font-medium text-[#2dd4a8] hover:text-[#f9fafb]"
          >
            Browse all examples
          </Link>
        </div>
      </PageShell>
    );
  }

  const related = EXAMPLES.filter((e) => e.slug !== ex.slug).slice(0, 4);

  return (
    <PageShell>
      <article className="flex flex-col gap-8 py-4">
        <nav className="text-sm text-[#6b7280]">
          <Link to="/examples" className="hover:text-[#2dd4a8]">
            Examples
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-[#9ca3af]">{ex.name}</span>
        </nav>

        <header className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-[#2dd4a8]">
            {ex.category}
          </span>
          <h1 className="bg-gradient-to-br from-[#f9fafb] to-[#2dd4a8] bg-clip-text text-3xl font-bold text-transparent">
            {ex.name} in LaTeX
          </h1>
          <p className="max-w-2xl text-[#9ca3af]">{ex.explanation}</p>
        </header>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9ca3af]">
            LaTeX source
          </h2>
          <pre className="overflow-x-auto rounded-xl border border-[rgba(45,212,168,0.12)] bg-[rgba(11,17,32,0.8)] p-4">
            <code className="font-mono text-sm text-[#f9fafb]">{ex.latex}</code>
          </pre>
        </section>

        <div>
          <Link
            to={editorHref(ex)}
            className="inline-flex items-center gap-2 rounded-lg border border-[rgba(45,212,168,0.4)] bg-[rgba(45,212,168,0.1)] px-5 py-2.5 font-medium text-[#2dd4a8] transition duration-300 hover:bg-[rgba(45,212,168,0.2)] hover:text-[#f9fafb]"
          >
            Open in editor
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <p className="mt-2 text-xs text-[#6b7280]">
            Renders live — then export to PNG, JPG, SVG, or PDF.
          </p>
        </div>

        <section className="flex flex-col gap-3 border-t border-[rgba(45,212,168,0.1)] pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9ca3af]">
            More examples
          </h2>
          <ul className="flex flex-wrap gap-2 p-0">
            {related.map((r) => (
              <li key={r.slug} className="list-none">
                <Link
                  to={`/examples/${r.slug}`}
                  className="inline-block rounded-full border border-[rgba(45,212,168,0.2)] bg-[rgba(45,212,168,0.06)] px-3 py-1 text-sm text-[#2dd4a8] hover:border-[rgba(45,212,168,0.5)] hover:text-[#f9fafb]"
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </PageShell>
  );
}

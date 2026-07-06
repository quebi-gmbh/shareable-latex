import type { ReactNode } from "react";
import { Sigma } from "lucide-react";
import { Link } from "react-router";
import { Footer } from "../../src/components/Footer";
import { StaticBackground } from "./StaticBackground";

/**
 * Static, fully-prerenderable layout for content pages (the examples gallery
 * and individual example pages). Shares the app's look via StaticBackground and
 * reuses the app Footer, but uses a link-home header instead of the interactive
 * one so the whole page renders without any client JS.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[#030712]">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <StaticBackground />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="relative z-10 border-b border-[rgba(45,212,168,0.1)] bg-gradient-to-b from-[rgba(3,7,18,0.9)] to-transparent px-8 py-6 backdrop-blur-md">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-[#f9fafb] transition-colors hover:text-[#2dd4a8]"
          >
            <Sigma
              size={24}
              aria-hidden="true"
              className="text-[#2dd4a8] drop-shadow-[0_0_8px_rgba(45,212,168,0.5)]"
            />
            <span className="text-xl font-bold">LaTeX Renderer</span>
          </Link>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 p-6">{children}</main>

        <Footer />
      </div>
    </div>
  );
}

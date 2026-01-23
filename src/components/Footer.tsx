import { GithubIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-t from-[rgba(3,7,18,0.9)] to-transparent backdrop-blur-md border-t border-[rgba(45,212,168,0.1)] py-6 px-8 text-center">
      <p className="flex items-center justify-center gap-2 text-sm text-[#9ca3af] mb-1">
        <span>Powered by</span>
        <a
          href="https://www.mathjax.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="MathJax website"
          className="text-[#2dd4a8] font-medium transition-all duration-300 hover:text-[#f9fafb] hover:drop-shadow-[0_0_10px_rgba(45,212,168,0.5)] focus-visible:outline-2 focus-visible:outline-[#2dd4a8] focus-visible:outline-offset-2 focus-visible:rounded-sm"
        >
          MathJax
        </a>
        <span>&</span>
        <a
          href="https://github.com/arnog/mathlive"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="MathLive on GitHub"
          className="text-[#2dd4a8] font-medium transition-all duration-300 hover:text-[#f9fafb] hover:drop-shadow-[0_0_10px_rgba(45,212,168,0.5)] focus-visible:outline-2 focus-visible:outline-[#2dd4a8] focus-visible:outline-offset-2 focus-visible:rounded-sm"
        >
          MathLive
        </a>
        <span>&</span>
        <a
          href="https://lexical.dev/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Lexical website"
          className="text-[#2dd4a8] font-medium transition-all duration-300 hover:text-[#f9fafb] hover:drop-shadow-[0_0_10px_rgba(45,212,168,0.5)] focus-visible:outline-2 focus-visible:outline-[#2dd4a8] focus-visible:outline-offset-2 focus-visible:rounded-sm"
        >
          Lexical
        </a>
      </p>
      <p className="flex items-center justify-center gap-2 text-xs text-[#6b7280]">
        <span>Built by</span>
        <a
          href="https://quebi.de/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2dd4a8] font-medium transition-all duration-300 hover:text-[#f9fafb] hover:drop-shadow-[0_0_10px_rgba(45,212,168,0.5)]"
        >
          quebi.de
        </a>
        <span>|</span>
        <a
          href="https://github.com/quebi-gmbh/shareable-latex"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="text-[#9ca3af] transition-all duration-300 hover:text-[#f9fafb] hover:drop-shadow-[0_0_10px_rgba(45,212,168,0.5)]"
        >
          <GithubIcon size={16} />
        </a>
      </p>
    </footer>
  );
}

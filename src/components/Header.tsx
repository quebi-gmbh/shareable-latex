import { Sigma } from 'lucide-react';

export function Header() {
  return (
    <header className="relative z-10 bg-gradient-to-b from-[rgba(3,7,18,0.9)] to-transparent backdrop-blur-md border-b border-[rgba(45,212,168,0.1)] py-6 px-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Sigma
          size={28}
          aria-hidden="true"
          className="text-[#2dd4a8] drop-shadow-[0_0_8px_rgba(45,212,168,0.5)]"
        />
        <h1 className="text-2xl font-bold bg-gradient-to-br from-[#f9fafb] to-[#2dd4a8] bg-clip-text text-transparent">
          LaTeX Renderer
        </h1>
      </div>
      <p className="text-sm text-[#9ca3af] tracking-wide">
        Render and share beautiful mathematical formulas
      </p>
    </header>
  );
}

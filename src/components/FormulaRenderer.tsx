import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AlertCircle } from "lucide-react";
import { useMathJax } from "../hooks/useMathJax";

// Preprocess LaTeX to replace MathLive-specific commands with standard LaTeX
const preprocessLatex = (latex: string): string => {
  return latex
    .replace(/\\exponentialE\b/g, "\\mathrm{e}")
    .replace(/\\imaginaryI\b/g, "\\mathrm{i}")
    .replace(/\\placeholder\{([^}]*)\}/g, "\\boxed{$1}")
    .replace(/\\placeholder\b(?!\{)/g, "\\square"); // \placeholder without braces
};

export interface FormulaRendererRef {
  getSvgElement: () => SVGSVGElement | null;
}

interface FormulaRendererProps {
  latex: string;
  displayMode?: boolean;
}

export const FormulaRenderer = forwardRef<
  FormulaRendererRef,
  FormulaRendererProps
>(function FormulaRenderer({ latex, displayMode = true }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { ready: mathJaxReady, error: mathJaxError } = useMathJax();

  // Track latest latex to avoid stale renders
  const latestLatex = useRef(latex);
  latestLatex.current = latex;

  // Expose SVG element to parent components
  useImperativeHandle(ref, () => ({
    getSvgElement: () => containerRef.current?.querySelector("svg") ?? null,
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    // Handle empty input
    if (!latex.trim()) {
      containerRef.current.innerHTML = "";
      setError(null);
      return;
    }

    // Wait for MathJax to be ready
    if (!mathJaxReady) return;

    // Handle MathJax loading error
    if (mathJaxError) {
      setError(mathJaxError);
      return;
    }

    const render = async () => {
      if (!containerRef.current || !window.MathJax?.tex2svgPromise) return;

      setError(null);

      try {
        // Reset TeX state for clean rendering
        window.MathJax.texReset?.();

        // Convert LaTeX to SVG (preprocess to handle MathLive-specific commands)
        const processedLatex = preprocessLatex(latex);
        const node = await window.MathJax.tex2svgPromise(processedLatex, {
          display: displayMode,
        });

        // Check if this render is still relevant (latex hasn't changed)
        if (latestLatex.current !== latex) return;

        // Clear previous content and append new SVG
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(node);

        // Update MathJax document state
        window.MathJax.startup.document.clear();
        window.MathJax.startup.document.updateDocument();

        setError(null);
      } catch (e) {
        // Check if this error is still relevant
        if (latestLatex.current !== latex) return;

        const errorMessage =
          e instanceof Error ? e.message : "Unknown error rendering formula";
        setError(errorMessage);

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      }
    };

    render();
  }, [latex, displayMode, mathJaxReady, mathJaxError]);

  return (
    <section
      className="formula-renderer relative bg-gradient-to-br from-[rgba(17,24,39,0.5)] to-[rgba(6,182,212,0.05)] border border-[rgba(45,212,168,0.1)] rounded-sm overflow-hidden border-2"
      aria-labelledby="output-heading"
    >
      <h2 id="output-heading" className="sr-only">
        Rendered Formula
      </h2>
      <div className="relative p-12 min-h-32 flex flex-col items-center justify-center">
        {!latex.trim() && !error && (
          <p className="text-[#6b7280] italic tracking-wide">
            Your formula will appear here
          </p>
        )}
        {!mathJaxReady && latex.trim() && !error && (
          <p className="text-[#6b7280] italic tracking-wide">
            Loading renderer...
          </p>
        )}
        <div
          ref={containerRef}
          className="mathjax-output text-2xl overflow-x-auto max-w-full text-[#f9fafb]"
          aria-live="polite"
          aria-atomic="true"
        />
        {error && (
          <div
            className="flex items-start gap-2 text-[#f87171] text-sm p-4 bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)] rounded-sm mt-4 max-w-full break-words"
            role="alert"
          >
            <AlertCircle
              size={18}
              aria-hidden="true"
              className="shrink-0 mt-0.5"
            />
            <span>{error}</span>
          </div>
        )}
      </div>
    </section>
  );
});

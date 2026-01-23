import { useState, useEffect } from "react";

const MATHJAX_CDN = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";

// MathJax configuration - must be set before script loads
const initMathJaxConfig = () => {
  if (typeof window !== "undefined" && !window.MathJax) {
    (window as unknown as { MathJax: object }).MathJax = {
      tex: {
        packages: ["base", "ams", "newcommand", "autoload", "require"],
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"],
        ],
        displayMath: [
          ["$$", "$$"],
          ["\\[", "\\]"],
        ],
        macros: {
          // Custom macros for MathLive compatibility
          placeholder: ["\\boxed{#1}", 1], // Render placeholder as boxed content
          imaginaryI: "\\mathrm{i}", // Imaginary unit
          exponentialE: "\\mathrm{e}", // Euler's number
        },
      },
      svg: {
        fontCache: "local", // Self-contained SVGs for PDF export
        scale: 1,
        minScale: 0.5,
      },
      startup: {
        typeset: false, // React controls typesetting
      },
    };
  }
};

export function useMathJax(): { ready: boolean; error: string | null } {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Configure before loading - must happen first
    initMathJaxConfig();

    // Already loaded
    if (typeof window.MathJax?.tex2svgPromise === "function") {
      setReady(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      `script[src="${MATHJAX_CDN}"]`,
    );
    if (existingScript) {
      const handleLoad = () => setReady(true);
      existingScript.addEventListener("load", handleLoad);
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    // Load MathJax script
    const script = document.createElement("script");
    script.src = MATHJAX_CDN;
    script.async = true;
    script.id = "mathjax-script";

    script.onload = () => {
      // Wait for MathJax to fully initialize
      if (window.MathJax?.startup?.promise) {
        window.MathJax.startup.promise
          .then(() => {
            setReady(true);
          })
          .catch((err: Error) => {
            setError(err.message);
          });
      } else {
        setReady(true);
      }
    };

    script.onerror = () => {
      setError("Failed to load MathJax");
    };

    document.head.appendChild(script);
  }, []);

  return { ready, error };
}

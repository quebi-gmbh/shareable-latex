/**
 * Encodes a LaTeX formula for use in URL parameters.
 * Uses encodeURIComponent for safe handling of special characters
 * like \, {, }, ^, _, etc.
 */
export function encodeFormula(latex: string): string {
  return encodeURIComponent(latex);
}

/**
 * Decodes a URL-encoded LaTeX formula.
 * Handles potential URIError for malformed sequences.
 */
export function decodeFormula(encoded: string): string {
  try {
    return decodeURIComponent(encoded);
  } catch {
    console.error('Failed to decode formula');
    return '';
  }
}

/**
 * Extracts formula from current URL search params.
 */
export function getFormulaFromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  const formula = params.get('formula');
  return formula ? decodeFormula(formula) : '';
}

/**
 * Updates URL with encoded formula without page reload.
 */
export function updateUrlWithFormula(latex: string): void {
  const url = new URL(window.location.href);
  if (latex) {
    url.searchParams.set('formula', encodeFormula(latex));
  } else {
    url.searchParams.delete('formula');
  }
  window.history.replaceState({}, '', url.toString());
}

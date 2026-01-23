/**
 * Utilities for parsing, validating, and formatting fractions
 */

export interface ParsedFraction {
  numerator: number;
  denominator: number;
}

/**
 * Check if a string represents a fraction (e.g., "1/3", "-2/5")
 */
export function isFraction(value: string): boolean {
  if (!value) return false;
  return /^-?\d+\/-?\d+$/.test(value.trim());
}

/**
 * Parse a fraction string into numerator and denominator
 * Normalizes sign to always be on numerator
 * Returns null if invalid or denominator is 0
 */
export function parseFraction(value: string): ParsedFraction | null {
  const match = value.trim().match(/^(-?\d+)\/(-?\d+)$/);
  if (!match) return null;

  let numerator = parseInt(match[1], 10);
  let denominator = parseInt(match[2], 10);

  if (denominator === 0) return null;

  // Normalize: sign always on numerator
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }

  return { numerator, denominator };
}

/**
 * Format a parsed fraction as a simple string "n/d"
 */
export function formatFractionSimple(frac: ParsedFraction): string {
  return `${frac.numerator}/${frac.denominator}`;
}

/**
 * Format a parsed fraction as LaTeX \frac{n}{d}
 */
export function formatFractionLatex(frac: ParsedFraction): string {
  const sign = frac.numerator < 0 ? '-' : '';
  return `${sign}\\frac{${Math.abs(frac.numerator)}}{${frac.denominator}}`;
}

/**
 * Format a parsed fraction as Python Fraction(n, d)
 */
export function formatFractionPython(frac: ParsedFraction): string {
  return `Fraction(${frac.numerator}, ${frac.denominator})`;
}

/**
 * Check if value is numeric (integer, decimal, scientific notation) or a fraction
 */
export function isNumericOrFraction(value: string): boolean {
  if (!value || value.trim() === '') return false;
  const trimmed = value.trim();
  // Standard numeric
  if (/^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(trimmed)) return true;
  // Fraction (must have non-zero denominator)
  if (isFraction(trimmed)) {
    const frac = parseFraction(trimmed);
    return frac !== null;
  }
  return false;
}

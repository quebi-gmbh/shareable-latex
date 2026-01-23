export type ArrayFormat =
  | 'latex'           // tabular environment (not MathJax compatible)
  | 'latex-array'     // \begin{array} - MathJax compatible
  | 'latex-matrix'    // \begin{matrix} - no delimiters
  | 'latex-pmatrix'   // \begin{pmatrix} - parentheses ( )
  | 'latex-bmatrix'   // \begin{bmatrix} - square brackets [ ]
  | 'latex-Bmatrix'   // \begin{Bmatrix} - curly braces { }
  | 'latex-vmatrix'   // \begin{vmatrix} - vertical bars | |
  | 'latex-Vmatrix'   // \begin{Vmatrix} - double vertical bars || ||
  | 'matlab'
  | 'python'
  | 'cpp';

// MathJax-compatible formats that can be previewed and downloaded
export const MATHJAX_COMPATIBLE_FORMATS: ArrayFormat[] = [
  'latex-array',
  'latex-matrix',
  'latex-pmatrix',
  'latex-bmatrix',
  'latex-Bmatrix',
  'latex-vmatrix',
  'latex-Vmatrix',
];

export function isMathJaxCompatible(format: ArrayFormat): boolean;

export interface FormatConfig {
  id: ArrayFormat;
  label: string;
  description: string;
  placeholder: string;
}

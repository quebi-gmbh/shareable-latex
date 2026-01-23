import type { ArrayFormat, FormatConfig } from '../types/arrayFormat';
import type { ParsedTable } from '../types/table';
import { parseLatexTable } from './latexTableParser';
import { serializeTableToLatex } from './latexTableSerializer';
import {
  parseLatexArray,
  parseLatexMatrix,
  parseLatexPmatrix,
  parseLatexBmatrix,
  parseLatexBmatrixCurly,
  parseLatexVmatrix,
  parseLatexVmatrixDouble,
} from './latexArrayParser';
import {
  serializeToLatexArray,
  serializeToLatexMatrix,
  serializeToLatexPmatrix,
  serializeToLatexBmatrix,
  serializeToLatexBmatrixCurly,
  serializeToLatexVmatrix,
  serializeToLatexVmatrixDouble,
} from './latexArraySerializer';
import { parseMatlabArray } from './matlabArrayParser';
import { serializeTableToMatlab } from './matlabArraySerializer';
import { parsePythonArray } from './pythonArrayParser';
import { serializeTableToPython } from './pythonArraySerializer';
import { parseCppArray } from './cppArrayParser';
import { serializeTableToCpp } from './cppArraySerializer';

// MathJax-compatible formats that support preview and download
const MATHJAX_COMPATIBLE_FORMATS: ArrayFormat[] = [
  'latex-array',
  'latex-matrix',
  'latex-pmatrix',
  'latex-bmatrix',
  'latex-Bmatrix',
  'latex-vmatrix',
  'latex-Vmatrix',
];

/**
 * Check if a format is MathJax-compatible (can be previewed/downloaded)
 */
export function isMathJaxCompatible(format: ArrayFormat): boolean {
  return MATHJAX_COMPATIBLE_FORMATS.includes(format);
}

export const FORMAT_CONFIGS: Record<ArrayFormat, FormatConfig> = {
  latex: {
    id: 'latex',
    label: 'LaTeX (tabular)',
    description: 'LaTeX tabular environment (not previewable)',
    placeholder: `\\begin{tabular}{|c|c|c|}
\\hline
Header 1 & Header 2 & Header 3 \\\\
\\hline
Cell 1 & Cell 2 & Cell 3 \\\\
\\hline
\\end{tabular}`,
  },
  'latex-array': {
    id: 'latex-array',
    label: 'array',
    description: 'LaTeX array environment',
    placeholder: `\\begin{array}{ccc}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{array}`,
  },
  'latex-matrix': {
    id: 'latex-matrix',
    label: 'matrix',
    description: 'Matrix with no delimiters',
    placeholder: `\\begin{matrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{matrix}`,
  },
  'latex-pmatrix': {
    id: 'latex-pmatrix',
    label: 'pmatrix ( )',
    description: 'Matrix with parentheses',
    placeholder: `\\begin{pmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{pmatrix}`,
  },
  'latex-bmatrix': {
    id: 'latex-bmatrix',
    label: 'bmatrix [ ]',
    description: 'Matrix with square brackets',
    placeholder: `\\begin{bmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{bmatrix}`,
  },
  'latex-Bmatrix': {
    id: 'latex-Bmatrix',
    label: 'Bmatrix { }',
    description: 'Matrix with curly braces',
    placeholder: `\\begin{Bmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{Bmatrix}`,
  },
  'latex-vmatrix': {
    id: 'latex-vmatrix',
    label: 'vmatrix | |',
    description: 'Matrix with vertical bars (determinant)',
    placeholder: `\\begin{vmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{vmatrix}`,
  },
  'latex-Vmatrix': {
    id: 'latex-Vmatrix',
    label: 'Vmatrix || ||',
    description: 'Matrix with double vertical bars (norm)',
    placeholder: `\\begin{Vmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{Vmatrix}`,
  },
  matlab: {
    id: 'matlab',
    label: 'MATLAB',
    description: 'MATLAB array or cell array',
    placeholder: `[1, 2, 3; 4, 5, 6; 7, 8, 9]`,
  },
  python: {
    id: 'python',
    label: 'Python',
    description: 'Python/NumPy 2D array',
    placeholder: `[[1, 2, 3], [4, 5, 6], [7, 8, 9]]`,
  },
  cpp: {
    id: 'cpp',
    label: 'C++',
    description: 'C++ initializer list',
    placeholder: `{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}`,
  },
};

export const FORMAT_ORDER: ArrayFormat[] = [
  'latex',
  'latex-array',
  'latex-matrix',
  'latex-pmatrix',
  'latex-bmatrix',
  'latex-Bmatrix',
  'latex-vmatrix',
  'latex-Vmatrix',
  'matlab',
  'python',
  'cpp',
];

type Parser = (input: string) => ParsedTable | null;
type Serializer = (table: ParsedTable) => string;

const parsers: Record<ArrayFormat, Parser> = {
  latex: parseLatexTable,
  'latex-array': parseLatexArray,
  'latex-matrix': parseLatexMatrix,
  'latex-pmatrix': parseLatexPmatrix,
  'latex-bmatrix': parseLatexBmatrix,
  'latex-Bmatrix': parseLatexBmatrixCurly,
  'latex-vmatrix': parseLatexVmatrix,
  'latex-Vmatrix': parseLatexVmatrixDouble,
  matlab: parseMatlabArray,
  python: parsePythonArray,
  cpp: parseCppArray,
};

const serializers: Record<ArrayFormat, Serializer> = {
  latex: serializeTableToLatex,
  'latex-array': serializeToLatexArray,
  'latex-matrix': serializeToLatexMatrix,
  'latex-pmatrix': serializeToLatexPmatrix,
  'latex-bmatrix': serializeToLatexBmatrix,
  'latex-Bmatrix': serializeToLatexBmatrixCurly,
  'latex-vmatrix': serializeToLatexVmatrix,
  'latex-Vmatrix': serializeToLatexVmatrixDouble,
  matlab: serializeTableToMatlab,
  python: serializeTableToPython,
  cpp: serializeTableToCpp,
};

/**
 * Get parser for specified format
 */
export function getParser(format: ArrayFormat): Parser {
  return parsers[format];
}

/**
 * Get serializer for specified format
 */
export function getSerializer(format: ArrayFormat): Serializer {
  return serializers[format];
}

/**
 * Parse content using the specified format
 */
export function parseFormat(content: string, format: ArrayFormat): ParsedTable | null {
  return parsers[format](content);
}

/**
 * Serialize table to the specified format
 */
export function serializeFormat(table: ParsedTable, format: ArrayFormat): string {
  return serializers[format](table);
}

/**
 * Convert content from one format to another via ParsedTable
 */
export function convertFormat(
  content: string,
  fromFormat: ArrayFormat,
  toFormat: ArrayFormat
): { result: string; error?: string } {
  // Same format, no conversion needed
  if (fromFormat === toFormat) {
    return { result: content };
  }

  // Parse with source format
  const table = parsers[fromFormat](content);

  if (!table) {
    return {
      result: content,
      error: `Unable to parse ${FORMAT_CONFIGS[fromFormat].label} format`,
    };
  }

  // Serialize to target format
  const result = serializers[toFormat](table);

  return { result };
}

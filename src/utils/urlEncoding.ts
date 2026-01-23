import type { InputMode } from '../components/InputModeToggle';
import type { ArrayFormat } from '../types/arrayFormat';
import type { TableAlignment } from '../types/table';

export interface TableStyle {
  hasHeaderRow: boolean;
  hasOuterBorders: boolean;
  hasColumnSeparators: boolean;
  hasRowSeparators: boolean;
  columnAlignments: TableAlignment[];
}

export interface UrlState {
  formula: string;
  mode: InputMode;
  tableCode: string;
  format: ArrayFormat;
  style: TableStyle;
}

const DEFAULT_STYLE: TableStyle = {
  hasHeaderRow: true,
  hasOuterBorders: true,
  hasColumnSeparators: true,
  hasRowSeparators: true,
  columnAlignments: ['center', 'center', 'center'],
};

const VALID_MODES: InputMode[] = ['visual', 'text', 'table'];
const VALID_FORMATS: ArrayFormat[] = [
  'latex', 'latex-array', 'latex-matrix', 'latex-pmatrix',
  'latex-bmatrix', 'latex-Bmatrix', 'latex-vmatrix', 'latex-Vmatrix',
  'matlab', 'python', 'cpp'
];

function isValidMode(mode: string | null): mode is InputMode {
  return mode !== null && VALID_MODES.includes(mode as InputMode);
}

function isValidFormat(format: string | null): format is ArrayFormat {
  return format !== null && VALID_FORMATS.includes(format as ArrayFormat);
}

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

/**
 * Encodes table styling properties into a compact string.
 * Format: "HOCS:alignments" where HOCS are 0/1 flags and alignments are l/c/r.
 * Example: "1101:lcr" = header on, borders on, col-sep off, row-sep on, left/center/right alignments
 */
export function encodeTableStyle(style: TableStyle): string {
  const flags = [
    style.hasHeaderRow ? '1' : '0',
    style.hasOuterBorders ? '1' : '0',
    style.hasColumnSeparators ? '1' : '0',
    style.hasRowSeparators ? '1' : '0',
  ].join('');

  const alignments = style.columnAlignments
    .map(a => a === 'left' ? 'l' : a === 'right' ? 'r' : 'c')
    .join('');

  return `${flags}:${alignments}`;
}

/**
 * Decodes a compact style string back to TableStyle object.
 */
export function decodeTableStyle(encoded: string): TableStyle | null {
  const [flags, alignments] = encoded.split(':');
  if (!flags || flags.length !== 4) return null;

  return {
    hasHeaderRow: flags[0] === '1',
    hasOuterBorders: flags[1] === '1',
    hasColumnSeparators: flags[2] === '1',
    hasRowSeparators: flags[3] === '1',
    columnAlignments: (alignments || '').split('').map(c =>
      c === 'l' ? 'left' : c === 'r' ? 'right' : 'center'
    ) as TableAlignment[],
  };
}

/**
 * Extracts full application state from URL parameters.
 */
export function getStateFromUrl(): UrlState {
  const params = new URLSearchParams(window.location.search);

  const formula = params.get('formula');
  const mode = params.get('mode');
  const tableCode = params.get('tableCode');
  const format = params.get('format');
  const styleStr = params.get('style');

  return {
    formula: formula ? decodeFormula(formula) : '',
    mode: isValidMode(mode) ? mode : 'visual',
    tableCode: tableCode ? decodeFormula(tableCode) : '',
    format: isValidFormat(format) ? format : 'latex',
    style: styleStr ? (decodeTableStyle(styleStr) || DEFAULT_STYLE) : DEFAULT_STYLE,
  };
}

/**
 * Updates URL with partial state without page reload.
 * Omits default values for cleaner URLs.
 */
export function updateUrlWithState(state: Partial<UrlState>): void {
  const url = new URL(window.location.href);

  if (state.formula !== undefined) {
    if (state.formula) {
      url.searchParams.set('formula', encodeFormula(state.formula));
    } else {
      url.searchParams.delete('formula');
    }
  }

  if (state.mode !== undefined) {
    if (state.mode !== 'visual') {
      url.searchParams.set('mode', state.mode);
    } else {
      url.searchParams.delete('mode');
    }
  }

  if (state.tableCode !== undefined) {
    if (state.tableCode) {
      url.searchParams.set('tableCode', encodeFormula(state.tableCode));
    } else {
      url.searchParams.delete('tableCode');
    }
  }

  if (state.format !== undefined) {
    if (state.format && state.format !== 'latex') {
      url.searchParams.set('format', state.format);
    } else {
      url.searchParams.delete('format');
    }
  }

  if (state.style !== undefined) {
    const encoded = encodeTableStyle(state.style);
    const defaultEncoded = encodeTableStyle(DEFAULT_STYLE);
    if (encoded !== defaultEncoded) {
      url.searchParams.set('style', encoded);
    } else {
      url.searchParams.delete('style');
    }
  }

  window.history.replaceState({}, '', url.toString());
}

export function getDefaultStyle(): TableStyle {
  return { ...DEFAULT_STYLE, columnAlignments: [...DEFAULT_STYLE.columnAlignments] };
}

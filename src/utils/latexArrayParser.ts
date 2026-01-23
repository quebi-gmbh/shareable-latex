import type { ParsedTable, TableRow, TableHorizontalAlignment } from '../types/table';

type MatrixEnvironment = 'array' | 'matrix' | 'pmatrix' | 'bmatrix' | 'Bmatrix' | 'vmatrix' | 'Vmatrix';

/**
 * Parse column specification from array environment
 * e.g., "lcr" -> ['left', 'center', 'right']
 */
function parseColumnSpec(spec: string): TableHorizontalAlignment[] {
  const alignments: TableHorizontalAlignment[] = [];

  for (const char of spec) {
    switch (char) {
      case 'l':
        alignments.push('left');
        break;
      case 'c':
        alignments.push('center');
        break;
      case 'r':
        alignments.push('right');
        break;
      // Skip any other characters (like |, spaces, etc.)
    }
  }

  return alignments;
}

/**
 * Parse content of a matrix/array environment into rows
 */
function parseMatrixContent(content: string, columnCount: number): TableRow[] {
  // Split by \\ (row separator), handling escaped backslashes
  const rowStrings = content
    .split(/\\\\/)
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  const rows: TableRow[] = [];

  for (const rowStr of rowStrings) {
    // Split by & (cell separator)
    const cellStrings = rowStr.split('&').map((c) => c.trim());

    const cells = cellStrings.map((content) => ({
      content,
    }));

    // Pad with empty cells if needed
    while (cells.length < columnCount) {
      cells.push({ content: '' });
    }

    rows.push({ cells });
  }

  return rows;
}

/**
 * Generic parser for matrix environments
 */
function parseMatrixEnvironment(
  latex: string,
  environment: MatrixEnvironment
): ParsedTable | null {
  const envRegex = new RegExp(
    `\\\\begin\\{${environment}\\}(?:\\{([^}]*)\\})?([\\s\\S]*?)\\\\end\\{${environment}\\}`,
    'i'
  );

  const match = latex.match(envRegex);
  if (!match) {
    return null;
  }

  const colSpec = match[1] || ''; // Column specification (only for array)
  const content = match[2].trim();

  if (!content) {
    return null;
  }

  // Parse column alignments from spec, or infer from content
  let columnAlignments: TableHorizontalAlignment[];

  if (colSpec) {
    columnAlignments = parseColumnSpec(colSpec);
  } else {
    // Infer column count from first row
    const firstRow = content.split(/\\\\/)[0];
    const columnCount = (firstRow.match(/&/g) || []).length + 1;
    // Default to center alignment for matrix environments
    columnAlignments = Array(columnCount).fill('center');
  }

  const columnCount = columnAlignments.length || 1;
  const rows = parseMatrixContent(content, columnCount);

  if (rows.length === 0) {
    return null;
  }

  // Ensure column count matches actual data
  const actualColumnCount = Math.max(
    columnCount,
    ...rows.map((r) => r.cells.length)
  );

  // Pad alignments if needed
  while (columnAlignments.length < actualColumnCount) {
    columnAlignments.push('center');
  }

  return {
    rows,
    columnCount: actualColumnCount,
    columnAlignments,
    columnVerticalAlignments: Array(actualColumnCount).fill('middle'),
    hasHeaderRow: false,
    hasOuterBorders: false,
    hasColumnSeparators: false,
    hasRowSeparators: false,
  };
}

/**
 * Parse \begin{array}{...}...\end{array}
 */
export function parseLatexArray(latex: string): ParsedTable | null {
  return parseMatrixEnvironment(latex, 'array');
}

/**
 * Parse \begin{matrix}...\end{matrix}
 */
export function parseLatexMatrix(latex: string): ParsedTable | null {
  return parseMatrixEnvironment(latex, 'matrix');
}

/**
 * Parse \begin{pmatrix}...\end{pmatrix}
 */
export function parseLatexPmatrix(latex: string): ParsedTable | null {
  return parseMatrixEnvironment(latex, 'pmatrix');
}

/**
 * Parse \begin{bmatrix}...\end{bmatrix}
 */
export function parseLatexBmatrix(latex: string): ParsedTable | null {
  return parseMatrixEnvironment(latex, 'bmatrix');
}

/**
 * Parse \begin{Bmatrix}...\end{Bmatrix}
 */
export function parseLatexBmatrixCurly(latex: string): ParsedTable | null {
  return parseMatrixEnvironment(latex, 'Bmatrix');
}

/**
 * Parse \begin{vmatrix}...\end{vmatrix}
 */
export function parseLatexVmatrix(latex: string): ParsedTable | null {
  return parseMatrixEnvironment(latex, 'vmatrix');
}

/**
 * Parse \begin{Vmatrix}...\end{Vmatrix}
 */
export function parseLatexVmatrixDouble(latex: string): ParsedTable | null {
  return parseMatrixEnvironment(latex, 'Vmatrix');
}

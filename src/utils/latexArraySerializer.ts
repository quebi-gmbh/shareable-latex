import type { ParsedTable } from '../types/table';

type MatrixEnvironment = 'array' | 'matrix' | 'pmatrix' | 'bmatrix' | 'Bmatrix' | 'vmatrix' | 'Vmatrix';

/**
 * Build column specification for array environment
 * Unlike tabular, array uses simple l/c/r without pipes for borders
 */
function buildArrayColumnSpec(table: ParsedTable): string {
  return table.columnAlignments
    .map((align) => {
      switch (align) {
        case 'left':
          return 'l';
        case 'center':
          return 'c';
        case 'right':
          return 'r';
        default:
          return 'c';
      }
    })
    .join('');
}

/**
 * Serialize table to a LaTeX matrix/array environment
 */
function serializeToMatrixEnvironment(
  table: ParsedTable,
  environment: MatrixEnvironment
): string {
  if (!table || table.rows.length === 0) {
    return '';
  }

  const rows: string[] = [];

  for (const row of table.rows) {
    const cellContents = row.cells.map((cell) => cell.content || '');
    rows.push(cellContents.join(' & '));
  }

  // array environment requires column specification, matrix environments don't
  if (environment === 'array') {
    const colSpec = buildArrayColumnSpec(table);
    return `\\begin{array}{${colSpec}}\n${rows.join(' \\\\\n')}\n\\end{array}`;
  }

  return `\\begin{${environment}}\n${rows.join(' \\\\\n')}\n\\end{${environment}}`;
}

/**
 * Serialize to \begin{array}{...}...\end{array}
 */
export function serializeToLatexArray(table: ParsedTable): string {
  return serializeToMatrixEnvironment(table, 'array');
}

/**
 * Serialize to \begin{matrix}...\end{matrix} (no delimiters)
 */
export function serializeToLatexMatrix(table: ParsedTable): string {
  return serializeToMatrixEnvironment(table, 'matrix');
}

/**
 * Serialize to \begin{pmatrix}...\end{pmatrix} (parentheses)
 */
export function serializeToLatexPmatrix(table: ParsedTable): string {
  return serializeToMatrixEnvironment(table, 'pmatrix');
}

/**
 * Serialize to \begin{bmatrix}...\end{bmatrix} (square brackets)
 */
export function serializeToLatexBmatrix(table: ParsedTable): string {
  return serializeToMatrixEnvironment(table, 'bmatrix');
}

/**
 * Serialize to \begin{Bmatrix}...\end{Bmatrix} (curly braces)
 */
export function serializeToLatexBmatrixCurly(table: ParsedTable): string {
  return serializeToMatrixEnvironment(table, 'Bmatrix');
}

/**
 * Serialize to \begin{vmatrix}...\end{vmatrix} (vertical bars - determinant)
 */
export function serializeToLatexVmatrix(table: ParsedTable): string {
  return serializeToMatrixEnvironment(table, 'vmatrix');
}

/**
 * Serialize to \begin{Vmatrix}...\end{Vmatrix} (double vertical bars - norm)
 */
export function serializeToLatexVmatrixDouble(table: ParsedTable): string {
  return serializeToMatrixEnvironment(table, 'Vmatrix');
}

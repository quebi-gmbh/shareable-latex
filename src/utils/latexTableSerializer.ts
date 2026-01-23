import type { ParsedTable, TableCell, TableAlignment } from '../types/table';

/**
 * Serialize a ParsedTable structure back to LaTeX tabular format
 */
export function serializeTableToLatex(table: ParsedTable): string {
  if (!table || table.rows.length === 0) {
    return '';
  }

  // Build column specification
  const colSpec = buildColumnSpec(table);

  // Build rows
  const rowStrings: string[] = [];

  // Add top border if outer borders enabled
  if (table.hasOuterBorders) {
    rowStrings.push('\\hline');
  }

  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cellStrings = row.cells.map((cell, cellIdx) =>
      formatCell(cell, table.columnAlignments[cellIdx])
    );

    rowStrings.push(cellStrings.join(' & ') + ' \\\\');

    // Add hline after header row if hasHeaderRow is enabled
    if (i === 0 && table.hasHeaderRow) {
      rowStrings.push('\\hline');
    }
    // Add row separator if enabled (but not duplicate after header)
    else if (table.hasRowSeparators) {
      rowStrings.push('\\hline');
    }
    // Add bottom border if specified on this row
    else if (row.hasBottomBorder) {
      rowStrings.push('\\hline');
    }
    // Add final border if outer borders enabled and it's the last row
    else if (i === table.rows.length - 1 && table.hasOuterBorders) {
      rowStrings.push('\\hline');
    }
  }

  return `\\begin{tabular}{${colSpec}}\n${rowStrings.join('\n')}\n\\end{tabular}`;
}

function buildColumnSpec(table: ParsedTable): string {
  const parts: string[] = [];

  if (table.hasOuterBorders) {
    parts.push('|');
  }

  for (let i = 0; i < table.columnAlignments.length; i++) {
    const align = table.columnAlignments[i];
    switch (align) {
      case 'left':
        parts.push('l');
        break;
      case 'center':
        parts.push('c');
        break;
      case 'right':
        parts.push('r');
        break;
    }

    // Add column separator between columns (not after last)
    if (table.hasColumnSeparators && i < table.columnAlignments.length - 1) {
      parts.push('|');
    }
  }

  if (table.hasOuterBorders) {
    parts.push('|');
  }

  return parts.join('');
}

function formatCell(
  cell: TableCell,
  _defaultAlignment: TableAlignment
): string {
  const content = cell.content || '';

  // Handle multicolumn
  if (cell.colSpan && cell.colSpan > 1) {
    const alignChar =
      cell.alignment === 'left' ? 'l' : cell.alignment === 'right' ? 'r' : 'c';
    return `\\multicolumn{${cell.colSpan}}{${alignChar}}{${content}}`;
  }

  return content;
}

/**
 * Generate a default LaTeX table template
 */
export function generateDefaultTableLatex(rows: number = 3, cols: number = 3): string {
  const colSpec = '|' + 'c|'.repeat(cols);

  const rowStrings: string[] = ['\\hline'];

  for (let i = 0; i < rows; i++) {
    const cells = Array(cols)
      .fill('')
      .map((_, j) => (i === 0 ? `Header ${j + 1}` : `Cell ${i},${j + 1}`));
    rowStrings.push(cells.join(' & ') + ' \\\\');
    rowStrings.push('\\hline');
  }

  return `\\begin{tabular}{${colSpec}}\n${rowStrings.join('\n')}\n\\end{tabular}`;
}

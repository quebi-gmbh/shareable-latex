import type { ParsedTable } from '../types/table';

/**
 * Serialize ParsedTable to MATLAB array syntax
 * Uses cell array syntax {'a', 'b'} if any non-numeric content is detected
 */
export function serializeTableToMatlab(table: ParsedTable): string {
  if (!table || table.rows.length === 0) {
    return '[]';
  }

  // Check if we need cell array syntax (any non-numeric values)
  const needsCellArray = table.rows.some(row =>
    row.cells.some(cell => !isNumeric(cell.content))
  );

  const rowStrings: string[] = [];

  for (const row of table.rows) {
    const cellStrings = row.cells.map(cell => {
      const content = cell.content || '';
      if (needsCellArray) {
        return formatMatlabString(content);
      }
      return content || '0';
    });
    rowStrings.push(cellStrings.join(', '));
  }

  const content = rowStrings.join('; ');

  if (needsCellArray) {
    return '{' + content + '}';
  }
  return '[' + content + ']';
}

function isNumeric(value: string): boolean {
  if (!value || value.trim() === '') return true; // Empty treated as 0
  const trimmed = value.trim();
  // Check for valid MATLAB numeric: integers, decimals, scientific notation
  return /^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(trimmed);
}

function formatMatlabString(value: string): string {
  // If it's a number, return as-is
  if (isNumeric(value)) {
    return value || '0';
  }
  // Escape single quotes by doubling them
  const escaped = value.replace(/'/g, "''");
  return `'${escaped}'`;
}

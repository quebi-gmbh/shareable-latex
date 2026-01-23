import type { ParsedTable } from '../types/table';
import { isNumericOrFraction } from './fractionUtils';

/**
 * Serialize ParsedTable to MATLAB array syntax
 * Uses cell array syntax {'a', 'b'} if any non-numeric content is detected
 * Fractions like 1/3 are valid MATLAB numeric expressions
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
  return isNumericOrFraction(value);
}

function formatMatlabString(value: string): string {
  // If it's a number or fraction, return as-is
  if (isNumeric(value)) {
    return value || '0';
  }
  // Escape single quotes by doubling them
  const escaped = value.replace(/'/g, "''");
  return `'${escaped}'`;
}

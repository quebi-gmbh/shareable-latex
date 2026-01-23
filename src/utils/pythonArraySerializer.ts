import type { ParsedTable } from '../types/table';
import { isNumericOrFraction } from './fractionUtils';

/**
 * Serialize ParsedTable to Python array syntax
 * Fractions like 1/3 are valid Python expressions (evaluate to float)
 */
export function serializeTableToPython(table: ParsedTable): string {
  if (!table || table.rows.length === 0) {
    return '[]';
  }

  const rowStrings: string[] = [];

  for (const row of table.rows) {
    const cellStrings = row.cells.map(cell => {
      const content = cell.content || '';
      return formatPythonValue(content);
    });
    rowStrings.push('[' + cellStrings.join(', ') + ']');
  }

  return '[' + rowStrings.join(', ') + ']';
}

function formatPythonValue(value: string): string {
  if (!value || value.trim() === '') {
    return "''";
  }

  // If it's a number or fraction, return as-is
  if (isNumericOrFraction(value)) {
    return value;
  }

  // Escape backslashes and quotes
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");

  return `'${escaped}'`;
}

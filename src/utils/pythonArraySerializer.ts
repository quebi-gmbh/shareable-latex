import type { ParsedTable } from '../types/table';

/**
 * Serialize ParsedTable to Python/NumPy array syntax
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

function isNumeric(value: string): boolean {
  if (!value || value.trim() === '') return false;
  const trimmed = value.trim();
  // Check for valid Python numeric: integers, decimals, scientific notation
  return /^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(trimmed);
}

function formatPythonValue(value: string): string {
  if (!value || value.trim() === '') {
    return "''";
  }

  // If it's a number, return as-is
  if (isNumeric(value)) {
    return value;
  }

  // Escape backslashes and quotes
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");

  return `'${escaped}'`;
}

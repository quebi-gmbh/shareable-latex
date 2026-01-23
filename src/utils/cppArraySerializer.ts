import type { ParsedTable } from '../types/table';

/**
 * Serialize ParsedTable to C++ initializer list syntax
 */
export function serializeTableToCpp(table: ParsedTable): string {
  if (!table || table.rows.length === 0) {
    return '{}';
  }

  const rowStrings: string[] = [];

  for (const row of table.rows) {
    const cellStrings = row.cells.map(cell => {
      const content = cell.content || '';
      return formatCppValue(content);
    });
    rowStrings.push('{' + cellStrings.join(', ') + '}');
  }

  return '{' + rowStrings.join(', ') + '}';
}

function isNumeric(value: string): boolean {
  if (!value || value.trim() === '') return false;
  const trimmed = value.trim();
  // Check for valid C++ numeric: integers, decimals, scientific notation
  // Also allows suffixes like f, l, u, etc.
  return /^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[fFlLuU]*$/.test(trimmed);
}

function formatCppValue(value: string): string {
  if (!value || value.trim() === '') {
    return '""';
  }

  // If it's a number, return as-is
  if (isNumeric(value)) {
    return value;
  }

  // Escape backslashes and double quotes
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

  return `"${escaped}"`;
}

import type { ParsedTable } from '../types/table';
import { isFraction, parseFraction, isNumericOrFraction } from './fractionUtils';

/**
 * Serialize ParsedTable to C++ initializer list syntax
 * Fractions are converted to float division (1.0/3.0) to preserve precision
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

function isNumericWithSuffix(value: string): boolean {
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

  // Check for fraction - convert to float division for precision
  if (isFraction(value)) {
    const frac = parseFraction(value);
    if (frac) {
      return `${frac.numerator}.0/${frac.denominator}.0`;
    }
  }

  // If it's a number (with optional suffix), return as-is
  if (isNumericWithSuffix(value)) {
    return value;
  }

  // Also check standard numeric without suffix
  if (isNumericOrFraction(value)) {
    return value;
  }

  // Escape backslashes and double quotes
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

  return `"${escaped}"`;
}

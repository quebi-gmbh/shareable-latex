import type { ParsedTable } from '../types/table';
import { isFraction, parseFraction, formatFractionPython, isNumericOrFraction } from './fractionUtils';

/**
 * Serialize ParsedTable to NumPy array syntax with Fraction support
 * Output: np.array([[Fraction(1, 3), 2], ...])
 * Includes import statements when fractions are present
 */
export function serializeTableToNumpy(table: ParsedTable): string {
  if (!table || table.rows.length === 0) {
    return 'np.array([])';
  }

  // Check if any fractions are present - if so, need Fraction import
  const hasFractions = table.rows.some(row =>
    row.cells.some(cell => isFraction(cell.content))
  );

  const rowStrings: string[] = [];

  for (const row of table.rows) {
    const cellStrings = row.cells.map(cell => {
      const content = cell.content || '';
      return formatNumpyValue(content);
    });
    rowStrings.push('[' + cellStrings.join(', ') + ']');
  }

  const arrayContent = 'np.array([' + rowStrings.join(', ') + '])';

  if (hasFractions) {
    return `from fractions import Fraction\nimport numpy as np\n${arrayContent}`;
  }

  return `import numpy as np\n${arrayContent}`;
}

function formatNumpyValue(value: string): string {
  if (!value || value.trim() === '') {
    return "''";
  }

  // Check for fraction first - convert to Fraction(n, d)
  if (isFraction(value)) {
    const frac = parseFraction(value);
    if (frac) {
      return formatFractionPython(frac);
    }
  }

  // Standard numeric - return as-is
  if (isNumericOrFraction(value)) {
    return value;
  }

  // String value - escape and quote
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
  return `'${escaped}'`;
}

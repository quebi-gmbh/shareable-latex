import type { ParsedTable, TableRow, TableCell } from '../types/table';

/**
 * Parse NumPy array syntax into ParsedTable
 * Supports: np.array([[1, 2], [3, 4]]) and Fraction(n, d) values
 * Also handles import statements at the beginning
 */
export function parseNumpyArray(input: string): ParsedTable | null {
  let trimmed = input.trim();
  if (!trimmed) return null;

  // Remove import statements if present
  trimmed = trimmed
    .replace(/^from\s+fractions\s+import\s+Fraction\s*/m, '')
    .replace(/^import\s+numpy\s+as\s+np\s*/m, '')
    .trim();

  // Extract the array content from np.array([...])
  const match = trimmed.match(/^np\.array\s*\(\s*\[([\s\S]*)\]\s*\)$/);
  if (!match) {
    // Also try without np.array wrapper (just nested lists)
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      return parseNestedLists(trimmed.slice(1, -1).trim());
    }
    return null;
  }

  const content = match[1].trim();
  return parseNestedLists(content);
}

function parseNestedLists(content: string): ParsedTable | null {
  // Handle empty array
  if (!content) {
    return {
      rows: [],
      columnCount: 0,
      columnAlignments: [],
      hasHeaderRow: false,
      hasOuterBorders: false,
      hasColumnSeparators: false,
      hasRowSeparators: false,
    };
  }

  // Parse nested arrays
  const rowArrays = parseNestedArrays(content);
  if (!rowArrays) return null;

  const rows: TableRow[] = [];
  let maxCols = 0;

  for (const rowContent of rowArrays) {
    const cellStrings = splitByCellSeparator(rowContent);
    const cells: TableCell[] = cellStrings.map(cellStr => ({
      content: cleanCellContent(cellStr.trim()),
      alignment: 'center' as const,
    }));

    if (cells.length > maxCols) {
      maxCols = cells.length;
    }

    rows.push({
      cells,
      hasBottomBorder: false,
    });
  }

  if (rows.length === 0) return null;

  // Normalize row lengths
  for (const row of rows) {
    while (row.cells.length < maxCols) {
      row.cells.push({ content: '', alignment: 'center' });
    }
  }

  return {
    rows,
    columnCount: maxCols,
    columnAlignments: Array(maxCols).fill('center'),
    hasHeaderRow: false,
    hasOuterBorders: false,
    hasColumnSeparators: false,
    hasRowSeparators: false,
  };
}

function parseNestedArrays(content: string): string[] | null {
  const arrays: string[] = [];
  let depth = 0;
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    // Track string state
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
      current += char;
      continue;
    }

    if (inString) {
      current += char;
      if (char === stringChar && content[i - 1] !== '\\') {
        inString = false;
      }
      continue;
    }

    if (char === '[') {
      if (depth === 0) {
        current = '';
      } else {
        current += char;
      }
      depth++;
    } else if (char === ']') {
      depth--;
      if (depth === 0) {
        arrays.push(current);
        current = '';
      } else {
        current += char;
      }
    } else if (char === ',' && depth === 0) {
      // Skip commas between arrays at depth 0
      continue;
    } else if (depth > 0) {
      current += char;
    }
  }

  return arrays.length > 0 ? arrays : null;
}

function splitByCellSeparator(rowContent: string): string[] {
  const cells: string[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < rowContent.length; i++) {
    const char = rowContent[i];

    // Track string state
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
      current += char;
      continue;
    }

    if (inString) {
      current += char;
      if (char === stringChar && rowContent[i - 1] !== '\\') {
        inString = false;
      }
      continue;
    }

    // Track bracket/paren depth
    if (char === '[' || char === '(' || char === '{') {
      depth++;
      current += char;
    } else if (char === ']' || char === ')' || char === '}') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    cells.push(current);
  }

  return cells;
}

function cleanCellContent(content: string): string {
  let cleaned = content.trim();

  // Convert Fraction(n, d) back to n/d
  const fractionMatch = cleaned.match(/^Fraction\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/);
  if (fractionMatch) {
    return `${fractionMatch[1]}/${fractionMatch[2]}`;
  }

  // Remove surrounding quotes
  if ((cleaned.startsWith("'") && cleaned.endsWith("'")) ||
      (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
    cleaned = cleaned.slice(1, -1);
    // Unescape
    cleaned = cleaned.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  return cleaned;
}

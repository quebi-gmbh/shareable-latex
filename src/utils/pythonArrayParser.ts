import type { ParsedTable, TableRow, TableCell } from '../types/table';

/**
 * Parse Python/NumPy 2D array syntax into ParsedTable
 * Supports: [[a, b], [c, d]] and [['a', 'b'], ['c', 'd']]
 */
export function parsePythonArray(input: string): ParsedTable | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Must start with [[ and end with ]]
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return null;
  }

  // Remove outer brackets
  const content = trimmed.slice(1, -1).trim();

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

  // Remove surrounding quotes
  if ((cleaned.startsWith("'") && cleaned.endsWith("'")) ||
      (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
    cleaned = cleaned.slice(1, -1);
    // Unescape
    cleaned = cleaned.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  return cleaned;
}

/**
 * Generate a default Python array
 */
export function generateDefaultPythonArray(rows: number = 3, cols: number = 3): string {
  const rowStrings: string[] = [];

  for (let i = 0; i < rows; i++) {
    const cells: string[] = [];
    for (let j = 0; j < cols; j++) {
      cells.push(String(i * cols + j + 1));
    }
    rowStrings.push('[' + cells.join(', ') + ']');
  }

  return '[' + rowStrings.join(', ') + ']';
}

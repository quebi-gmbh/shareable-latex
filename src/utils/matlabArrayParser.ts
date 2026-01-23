import type { ParsedTable, TableRow, TableCell } from '../types/table';

/**
 * Parse MATLAB array syntax into ParsedTable
 * Supports: [a, b; c, d] (numeric) and {'a', 'b'; 'c', 'd'} (cell array)
 */
export function parseMatlabArray(input: string): ParsedTable | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try numeric array first: [...]
  const numericMatch = trimmed.match(/^\[([\s\S]*)\]$/);
  if (numericMatch) {
    return parseArrayContent(numericMatch[1], false);
  }

  // Try cell array: {...}
  const cellMatch = trimmed.match(/^\{([\s\S]*)\}$/);
  if (cellMatch) {
    return parseArrayContent(cellMatch[1], true);
  }

  return null;
}

function parseArrayContent(content: string, isCellArray: boolean): ParsedTable | null {
  const trimmed = content.trim();

  // Handle empty array
  if (!trimmed) {
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

  // Split by semicolons for rows (but not within quotes or brackets)
  const rowStrings = splitByRowSeparator(trimmed);

  const rows: TableRow[] = [];
  let maxCols = 0;

  for (const rowStr of rowStrings) {
    const cellStrings = splitByCellSeparator(rowStr.trim(), isCellArray);
    const cells: TableCell[] = cellStrings.map(cellStr => ({
      content: cleanCellContent(cellStr.trim(), isCellArray),
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

function splitByRowSeparator(content: string): string[] {
  const rows: string[] = [];
  let current = '';
  let depth = 0;
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
      // Check for escaped quotes ('' in MATLAB) or end of string
      if (char === stringChar) {
        if (content[i + 1] === stringChar) {
          // Escaped quote
          current += content[i + 1];
          i++;
        } else {
          inString = false;
        }
      }
      continue;
    }

    // Track bracket depth
    if (char === '[' || char === '{' || char === '(') {
      depth++;
      current += char;
    } else if (char === ']' || char === '}' || char === ')') {
      depth--;
      current += char;
    } else if (char === ';' && depth === 0) {
      rows.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    rows.push(current);
  }

  return rows;
}

function splitByCellSeparator(rowContent: string, isCellArray: boolean): string[] {
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
      if (char === stringChar) {
        if (rowContent[i + 1] === stringChar) {
          current += rowContent[i + 1];
          i++;
        } else {
          inString = false;
        }
      }
      continue;
    }

    // Track bracket depth
    if (char === '[' || char === '{' || char === '(') {
      depth++;
      current += char;
    } else if (char === ']' || char === '}' || char === ')') {
      depth--;
      current += char;
    } else if ((char === ',' || (char === ' ' && !isCellArray)) && depth === 0) {
      // MATLAB allows space as separator in numeric arrays
      if (char === ',' || (char === ' ' && current.trim())) {
        if (current.trim()) {
          cells.push(current);
          current = '';
        }
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    cells.push(current);
  }

  return cells;
}

function cleanCellContent(content: string, isCellArray: boolean): string {
  let cleaned = content.trim();

  // Remove surrounding quotes for cell arrays
  if (isCellArray) {
    if ((cleaned.startsWith("'") && cleaned.endsWith("'")) ||
        (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
      cleaned = cleaned.slice(1, -1);
      // Unescape doubled quotes
      cleaned = cleaned.replace(/''/g, "'").replace(/""/g, '"');
    }
  }

  return cleaned;
}

/**
 * Generate a default MATLAB array
 */
export function generateDefaultMatlabArray(rows: number = 3, cols: number = 3): string {
  const rowStrings: string[] = [];

  for (let i = 0; i < rows; i++) {
    const cells: string[] = [];
    for (let j = 0; j < cols; j++) {
      cells.push(String(i * cols + j + 1));
    }
    rowStrings.push(cells.join(', '));
  }

  return '[' + rowStrings.join('; ') + ']';
}

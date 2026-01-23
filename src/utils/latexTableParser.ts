import type { ParsedTable, TableRow, TableCell, TableAlignment } from '../types/table';

/**
 * Parse a LaTeX tabular environment into structured data
 */
export function parseLatexTable(latex: string): ParsedTable | null {
  const trimmed = latex.trim();
  if (!trimmed) return null;

  // Match \begin{tabular}{...} content \end{tabular}
  const envMatch = trimmed.match(
    /\\begin\{tabular\}\{([^}]*)\}([\s\S]*?)\\end\{tabular\}/
  );

  if (!envMatch) return null;

  const columnSpec = envMatch[1];
  const content = envMatch[2].trim();

  // Parse column specification
  const { alignments, hasColumnSeparators, hasOuterBorders } = parseColumnSpec(columnSpec);

  // Split into rows by \\ (handling optional spacing like \\[2pt])
  const rowStrings = content
    .split(/\\\\(?:\s*\[[^\]]*\])?\s*/)
    .map(r => r.trim())
    .filter(r => r.length > 0);

  const rows: TableRow[] = [];
  let currentRowHasBottomBorder = false;
  let hlineCount = 0;
  let hasHeaderRow = false;

  for (let i = 0; i < rowStrings.length; i++) {
    let rowContent = rowStrings[i];

    // Check for \hline, \toprule, \midrule, \bottomrule at the start
    const hlineMatch = rowContent.match(/^\\(hline|toprule|midrule|bottomrule)\s*/);
    if (hlineMatch) {
      hlineCount++;
      // If we have a previous row, mark it as having a bottom border
      if (rows.length > 0) {
        rows[rows.length - 1].hasBottomBorder = true;
      }
      // If this is after the first row, it indicates a header row
      if (rows.length === 1 && (hlineMatch[1] === 'hline' || hlineMatch[1] === 'midrule')) {
        hasHeaderRow = true;
      }
      rowContent = rowContent.slice(hlineMatch[0].length);
    }

    // Check for trailing \hline
    const trailingHline = rowContent.match(/\s*\\(hline|toprule|midrule|bottomrule)\s*$/);
    if (trailingHline) {
      currentRowHasBottomBorder = true;
      hlineCount++;
      rowContent = rowContent.slice(0, -trailingHline[0].length);
    }

    // Skip empty row content (could be just \hline)
    if (!rowContent.trim()) {
      continue;
    }

    // Parse cells
    const cells = parseRowCells(rowContent, alignments);

    rows.push({
      cells,
      hasBottomBorder: currentRowHasBottomBorder,
    });

    currentRowHasBottomBorder = false;
  }

  if (rows.length === 0) return null;

  // Determine if all rows have separators (excluding first/last for outer borders)
  const hasRowSeparators = hlineCount >= rows.length;

  return {
    rows,
    columnCount: alignments.length,
    columnAlignments: alignments,
    hasHeaderRow,
    hasOuterBorders,
    hasColumnSeparators,
    hasRowSeparators,
  };
}

function parseColumnSpec(spec: string): {
  alignments: TableAlignment[];
  hasColumnSeparators: boolean;
  hasOuterBorders: boolean;
} {
  const alignments: TableAlignment[] = [];
  const pipePositions: number[] = [];
  let position = 0;
  let i = 0;

  while (i < spec.length) {
    const char = spec[i];

    switch (char) {
      case 'l':
        alignments.push('left');
        position++;
        break;
      case 'c':
        alignments.push('center');
        position++;
        break;
      case 'r':
        alignments.push('right');
        position++;
        break;
      case 'p':
      case 'm':
      case 'b':
        // p/m/b{width} columns - treat as left-aligned
        alignments.push('left');
        position++;
        // Skip the {width} part
        if (spec[i + 1] === '{') {
          const closeIdx = spec.indexOf('}', i + 2);
          if (closeIdx !== -1) {
            i = closeIdx;
          }
        }
        break;
      case '|':
        pipePositions.push(position);
        break;
      // Skip other characters like @{}, >{}, etc.
      case '@':
      case '>':
      case '<':
        if (spec[i + 1] === '{') {
          const closeIdx = spec.indexOf('}', i + 2);
          if (closeIdx !== -1) {
            i = closeIdx;
          }
        }
        break;
    }
    i++;
  }

  // Determine border types based on pipe positions
  const hasOuterBorders = pipePositions.includes(0) && pipePositions.includes(alignments.length);

  // Has column separators if there are pipes between columns
  const hasColumnSeparators = pipePositions.some(p => p > 0 && p < alignments.length);

  return { alignments, hasColumnSeparators, hasOuterBorders };
}

function parseRowCells(
  rowContent: string,
  alignments: TableAlignment[]
): TableCell[] {
  // Split by & but handle nested braces
  const cellStrings = splitByCellSeparator(rowContent);

  const cells: TableCell[] = [];

  for (let i = 0; i < cellStrings.length; i++) {
    const cellContent = cellStrings[i].trim();

    // Check for \multicolumn{n}{align}{content}
    const multicolMatch = cellContent.match(
      /\\multicolumn\{(\d+)\}\{([^}]*)\}\{([\s\S]*)\}/
    );

    if (multicolMatch) {
      const colSpan = parseInt(multicolMatch[1], 10);
      const alignSpec = multicolMatch[2];
      const content = multicolMatch[3];

      let alignment: TableAlignment = 'center';
      if (alignSpec.includes('l')) alignment = 'left';
      else if (alignSpec.includes('r')) alignment = 'right';

      cells.push({
        content,
        colSpan,
        alignment,
      });
    } else {
      cells.push({
        content: cellContent,
        alignment: alignments[i] || 'left',
      });
    }
  }

  return cells;
}

function splitByCellSeparator(content: string): string[] {
  const cells: string[] = [];
  let current = '';
  let braceDepth = 0;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '{') {
      braceDepth++;
      current += char;
    } else if (char === '}') {
      braceDepth--;
      current += char;
    } else if (char === '&' && braceDepth === 0) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

/**
 * Create a default empty table with the specified dimensions
 */
export function createEmptyTable(rows: number = 3, cols: number = 3): ParsedTable {
  const columnAlignments: TableAlignment[] = Array(cols).fill('center');

  const tableRows: TableRow[] = [];
  for (let i = 0; i < rows; i++) {
    const cells: TableCell[] = [];
    for (let j = 0; j < cols; j++) {
      cells.push({
        content: i === 0 ? `Header ${j + 1}` : '',
        alignment: 'center',
      });
    }
    tableRows.push({
      cells,
      hasBottomBorder: false,
    });
  }

  return {
    rows: tableRows,
    columnCount: cols,
    columnAlignments,
    hasHeaderRow: true,
    hasOuterBorders: true,
    hasColumnSeparators: true,
    hasRowSeparators: true,
  };
}

export type TableAlignment = 'left' | 'center' | 'right';

export interface TableCell {
  content: string;
  colSpan?: number;
  rowSpan?: number;
  alignment?: TableAlignment;
}

export interface TableRow {
  cells: TableCell[];
  hasBottomBorder?: boolean;
}

export interface ParsedTable {
  rows: TableRow[];
  columnCount: number;
  columnAlignments: TableAlignment[];
  hasHeaderRow: boolean;
  hasOuterBorders: boolean;
  hasColumnSeparators: boolean;
  hasRowSeparators: boolean;
}

export type SyncSource = 'latex' | 'lexical' | 'format-change' | 'none';

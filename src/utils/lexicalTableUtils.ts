import type { LexicalEditor } from 'lexical';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import {
  $createTableNode,
  $createTableRowNode,
  $createTableCellNode,
  $isTableNode,
  $isTableRowNode,
  $isTableCellNode,
  TableCellHeaderStates,
  type TableNode,
  type TableCellNode,
} from '@lexical/table';
import type { ParsedTable, TableRow, TableCell, TableAlignment } from '../types/table';

// Store table metadata outside of Lexical (since Lexical doesn't store our custom properties)
let tableMetadata: {
  hasHeaderRow: boolean;
  hasOuterBorders: boolean;
  hasColumnSeparators: boolean;
  hasRowSeparators: boolean;
  columnAlignments: TableAlignment[];
} = {
  hasHeaderRow: true,
  hasOuterBorders: true,
  hasColumnSeparators: true,
  hasRowSeparators: true,
  columnAlignments: ['center', 'center', 'center'],
};

export function getTableMetadata() {
  return {
    ...tableMetadata,
    columnAlignments: [...tableMetadata.columnAlignments],
  };
}

export function setTableMetadata(metadata: Partial<typeof tableMetadata>) {
  tableMetadata = { ...tableMetadata, ...metadata };
}

/**
 * Update the header state of cells in the first row
 */
export function updateTableHeaderState(editor: LexicalEditor, hasHeaderRow: boolean): void {
  editor.update(() => {
    const root = $getRoot();
    const children = root.getChildren();

    // Find the first table node
    const tableNode = children.find($isTableNode) as TableNode | undefined;
    if (!tableNode) return;

    const rows = tableNode.getChildren();
    if (rows.length === 0) return;

    const firstRow = rows[0];
    if (!$isTableRowNode(firstRow)) return;

    // Update header state for all cells in the first row
    firstRow.getChildren().forEach((cellNode) => {
      if ($isTableCellNode(cellNode)) {
        const typedCell = cellNode as TableCellNode;
        typedCell.setHeaderStyles(
          hasHeaderRow ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS
        );
      }
    });
  });
}

/**
 * Extract table data from a Lexical editor state
 */
export function extractTableFromEditor(editor: LexicalEditor): ParsedTable | null {
  let result: ParsedTable | null = null;

  editor.getEditorState().read(() => {
    const root = $getRoot();
    const children = root.getChildren();

    // Find the first table node
    const tableNode = children.find($isTableNode) as TableNode | undefined;
    if (!tableNode) return;

    const rows: TableRow[] = [];
    let columnCount = 0;

    tableNode.getChildren().forEach((rowNode) => {
      if (!$isTableRowNode(rowNode)) return;

      const cells: TableCell[] = [];

      rowNode.getChildren().forEach((cellNode) => {
        if (!$isTableCellNode(cellNode)) return;

        const content = cellNode.getTextContent();
        const colSpan = cellNode.getColSpan();
        const rowSpan = cellNode.getRowSpan();

        cells.push({
          content,
          colSpan: colSpan > 1 ? colSpan : undefined,
          rowSpan: rowSpan > 1 ? rowSpan : undefined,
          alignment: tableMetadata.columnAlignments[cells.length] || 'center',
        });
      });

      if (cells.length > 0) {
        rows.push({
          cells,
          hasBottomBorder: false,
        });
        columnCount = Math.max(columnCount, cells.length);
      }
    });

    if (rows.length === 0) return;

    // Ensure columnAlignments array matches column count
    while (tableMetadata.columnAlignments.length < columnCount) {
      tableMetadata.columnAlignments.push('center');
    }

    result = {
      rows,
      columnCount,
      columnAlignments: tableMetadata.columnAlignments.slice(0, columnCount),
      hasHeaderRow: tableMetadata.hasHeaderRow,
      hasOuterBorders: tableMetadata.hasOuterBorders,
      hasColumnSeparators: tableMetadata.hasColumnSeparators,
      hasRowSeparators: tableMetadata.hasRowSeparators,
    };
  });

  return result;
}

/**
 * Create Lexical table nodes from a ParsedTable structure
 */
export function createLexicalTableFromParsed(table: ParsedTable): TableNode {
  // Update metadata from parsed table
  tableMetadata = {
    hasHeaderRow: table.hasHeaderRow,
    hasOuterBorders: table.hasOuterBorders,
    hasColumnSeparators: table.hasColumnSeparators,
    hasRowSeparators: table.hasRowSeparators,
    columnAlignments: [...table.columnAlignments],
  };

  const tableNode = $createTableNode();

  table.rows.forEach((row, rowIndex) => {
    const rowNode = $createTableRowNode();

    row.cells.forEach((cell) => {
      // First row cells are headers if hasHeaderRow is true
      const headerState =
        rowIndex === 0 && table.hasHeaderRow
          ? TableCellHeaderStates.ROW
          : TableCellHeaderStates.NO_STATUS;

      const cellNode = $createTableCellNode(headerState, cell.colSpan || 1);

      if (cell.rowSpan && cell.rowSpan > 1) {
        cellNode.setRowSpan(cell.rowSpan);
      }

      // Add text content
      const paragraph = $createParagraphNode();
      if (cell.content) {
        paragraph.append($createTextNode(cell.content));
      }
      cellNode.append(paragraph);

      rowNode.append(cellNode);
    });

    tableNode.append(rowNode);
  });

  return tableNode;
}

/**
 * Update the Lexical editor with a new table structure
 */
export function updateEditorWithTable(
  editor: LexicalEditor,
  table: ParsedTable
): void {
  editor.update(() => {
    const root = $getRoot();
    root.clear();

    const tableNode = createLexicalTableFromParsed(table);
    root.append(tableNode);
  });
}

/**
 * Create an empty table in the editor
 */
export function createEmptyEditorTable(
  editor: LexicalEditor,
  rows: number = 3,
  cols: number = 3
): void {
  // Initialize metadata for new table
  tableMetadata = {
    hasHeaderRow: true,
    hasOuterBorders: true,
    hasColumnSeparators: true,
    hasRowSeparators: true,
    columnAlignments: Array(cols).fill('center') as TableAlignment[],
  };

  editor.update(() => {
    const root = $getRoot();
    root.clear();

    const tableNode = $createTableNode();

    for (let i = 0; i < rows; i++) {
      const rowNode = $createTableRowNode();

      for (let j = 0; j < cols; j++) {
        const headerState =
          i === 0
            ? TableCellHeaderStates.ROW
            : TableCellHeaderStates.NO_STATUS;

        const cellNode = $createTableCellNode(headerState, 1);
        const paragraph = $createParagraphNode();

        // Add default header text for first row
        if (i === 0) {
          paragraph.append($createTextNode(`Header ${j + 1}`));
        }

        cellNode.append(paragraph);
        rowNode.append(cellNode);
      }

      tableNode.append(rowNode);
    }

    root.append(tableNode);
  });
}

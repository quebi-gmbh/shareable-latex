import { useCallback } from 'react';
import type { LexicalEditor } from 'lexical';
import { $getSelection, $getRoot, $createTextNode, $isParagraphNode } from 'lexical';
import {
  $insertTableRowAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableColumnAtSelection,
  $isTableSelection,
  $isTableNode,
  $isTableRowNode,
  $isTableCellNode,
  type TableCellNode,
} from '@lexical/table';
import { getTableMetadata, setTableMetadata, updateTableHeaderState } from '../utils/lexicalTableUtils';
import { triggerTableStyleUpdate } from '../components/LexicalTableEditor';
import type { TableAlignment } from '../types/table';

/**
 * Check if a number string is in international format
 * International format uses period as decimal separator (e.g., 3.14, 1234.56)
 */
function isInternationalFormat(text: string): boolean {
  // Check if text contains comma-based decimal numbers (non-international)
  // German/European: 3,14 or 1.234,56
  const hasCommaDecimal = /\d,\d/.test(text);
  return !hasCommaDecimal;
}

/**
 * Convert non-international number formats to international format
 * Detects and converts formats like:
 * - German/European: 1.234,56 → 1234.56 (period thousand sep, comma decimal)
 * - Simple comma decimal: 3,14 → 3.14
 * Skips conversion if already in international format
 */
function convertToInternationalFormat(text: string): string {
  // Skip if already in international format
  if (isInternationalFormat(text)) {
    return text;
  }

  // Handle full German/European format: 1.234,56 or 1.234.567,89 → 1234.56 or 1234567.89
  let result = text.replace(
    /\b(\d{1,3}(?:\.\d{3})+),(\d+)\b/g,
    (_, intPart, decPart) => intPart.replace(/\./g, '') + '.' + decPart
  );
  // Handle simple comma decimal: 3,14 → 3.14
  result = result.replace(/\b(\d+),(\d+)\b/g, '$1.$2');
  return result;
}

export interface TableActions {
  // Structure actions
  insertRowAbove: () => void;
  insertRowBelow: () => void;
  insertColumnLeft: () => void;
  insertColumnRight: () => void;
  deleteRow: () => void;
  deleteColumn: () => void;

  // Format actions
  toggleHeaderRow: () => void;
  toggleOuterBorders: () => void;
  toggleColumnSeparators: () => void;
  toggleRowSeparators: () => void;
  setColumnAlignment: (colIndex: number, alignment: TableAlignment) => void;
  setAllColumnsAlignment: (alignment: TableAlignment) => void;

  // Number format conversion
  convertGermanToInternational: () => void;

  // Getters for current state
  getMetadata: () => {
    hasHeaderRow: boolean;
    hasOuterBorders: boolean;
    hasColumnSeparators: boolean;
    hasRowSeparators: boolean;
    columnAlignments: TableAlignment[];
  };
}

export function useTableActions(
  editor: LexicalEditor | null,
  onTableChange?: () => void
): TableActions {
  const triggerChange = useCallback(() => {
    if (onTableChange) {
      // Small delay to allow Lexical to update
      setTimeout(onTableChange, 10);
    }
  }, [onTableChange]);

  // Structure actions
  const insertRowAbove = useCallback(() => {
    if (!editor) return;
    editor.update(() => {
      $insertTableRowAtSelection(false);
    });
    triggerChange();
  }, [editor, triggerChange]);

  const insertRowBelow = useCallback(() => {
    if (!editor) return;
    editor.update(() => {
      $insertTableRowAtSelection(true);
    });
    triggerChange();
  }, [editor, triggerChange]);

  const insertColumnLeft = useCallback(() => {
    if (!editor) return;
    editor.update(() => {
      $insertTableColumnAtSelection(false);
    });
    // Update column alignments
    const metadata = getTableMetadata();
    metadata.columnAlignments.push('center');
    setTableMetadata({ columnAlignments: metadata.columnAlignments });
    triggerChange();
  }, [editor, triggerChange]);

  const insertColumnRight = useCallback(() => {
    if (!editor) return;
    editor.update(() => {
      $insertTableColumnAtSelection(true);
    });
    // Update column alignments
    const metadata = getTableMetadata();
    metadata.columnAlignments.push('center');
    setTableMetadata({ columnAlignments: metadata.columnAlignments });
    triggerChange();
  }, [editor, triggerChange]);

  const deleteRow = useCallback(() => {
    if (!editor) return;
    editor.update(() => {
      $deleteTableRowAtSelection();
    });
    triggerChange();
  }, [editor, triggerChange]);

  const deleteColumn = useCallback(() => {
    if (!editor) return;
    editor.update(() => {
      $deleteTableColumnAtSelection();
    });
    // Update column alignments
    const metadata = getTableMetadata();
    if (metadata.columnAlignments.length > 1) {
      metadata.columnAlignments.pop();
      setTableMetadata({ columnAlignments: metadata.columnAlignments });
    }
    triggerChange();
  }, [editor, triggerChange]);

  // Format actions
  const toggleHeaderRow = useCallback(() => {
    if (!editor) return;
    const metadata = getTableMetadata();
    const newHasHeaderRow = !metadata.hasHeaderRow;
    setTableMetadata({ hasHeaderRow: newHasHeaderRow });
    // Update the Lexical editor cells to reflect the header state
    updateTableHeaderState(editor, newHasHeaderRow);
    triggerTableStyleUpdate();
    triggerChange();
  }, [editor, triggerChange]);

  const toggleOuterBorders = useCallback(() => {
    const metadata = getTableMetadata();
    setTableMetadata({ hasOuterBorders: !metadata.hasOuterBorders });
    triggerTableStyleUpdate();
    triggerChange();
  }, [triggerChange]);

  const toggleColumnSeparators = useCallback(() => {
    const metadata = getTableMetadata();
    setTableMetadata({ hasColumnSeparators: !metadata.hasColumnSeparators });
    triggerTableStyleUpdate();
    triggerChange();
  }, [triggerChange]);

  const toggleRowSeparators = useCallback(() => {
    const metadata = getTableMetadata();
    setTableMetadata({ hasRowSeparators: !metadata.hasRowSeparators });
    triggerTableStyleUpdate();
    triggerChange();
  }, [triggerChange]);

  const setColumnAlignment = useCallback(
    (colIndex: number, alignment: TableAlignment) => {
      const metadata = getTableMetadata();
      const newAlignments = [...metadata.columnAlignments];
      if (colIndex >= 0 && colIndex < newAlignments.length) {
        newAlignments[colIndex] = alignment;
        setTableMetadata({ columnAlignments: newAlignments });
        triggerTableStyleUpdate();
        triggerChange();
      }
    },
    [triggerChange]
  );

  const setAllColumnsAlignment = useCallback(
    (alignment: TableAlignment) => {
      const metadata = getTableMetadata();
      const newAlignments = metadata.columnAlignments.map(() => alignment);
      setTableMetadata({ columnAlignments: newAlignments });
      triggerTableStyleUpdate();
      triggerChange();
    },
    [triggerChange]
  );

  const getMetadata = useCallback(() => {
    return getTableMetadata();
  }, []);

  // Number format conversion: German to International
  const convertGermanToInternational = useCallback(() => {
    if (!editor) return;

    editor.update(() => {
      const selection = $getSelection();
      const cellsToConvert: TableCellNode[] = [];

      // Check if we have a table selection (multiple cells selected)
      if ($isTableSelection(selection)) {
        // Get selected cells from table selection
        const nodes = selection.getNodes();
        nodes.forEach((node) => {
          if ($isTableCellNode(node)) {
            cellsToConvert.push(node);
          }
        });
      } else {
        // No table selection - apply to all cells in the table
        const root = $getRoot();
        const children = root.getChildren();
        const tableNode = children.find($isTableNode);

        if (tableNode) {
          tableNode.getChildren().forEach((rowNode) => {
            if ($isTableRowNode(rowNode)) {
              rowNode.getChildren().forEach((cellNode) => {
                if ($isTableCellNode(cellNode)) {
                  cellsToConvert.push(cellNode);
                }
              });
            }
          });
        }
      }

      // Convert content in each cell
      cellsToConvert.forEach((cellNode) => {
        const textContent = cellNode.getTextContent();
        const convertedText = convertToInternationalFormat(textContent);

        if (convertedText !== textContent) {
          // Update cell content
          const children = cellNode.getChildren();
          children.forEach((child) => {
            if ($isParagraphNode(child)) {
              child.clear();
              child.append($createTextNode(convertedText));
            }
          });
        }
      });
    });

    triggerChange();
  }, [editor, triggerChange]);

  return {
    insertRowAbove,
    insertRowBelow,
    insertColumnLeft,
    insertColumnRight,
    deleteRow,
    deleteColumn,
    toggleHeaderRow,
    toggleOuterBorders,
    toggleColumnSeparators,
    toggleRowSeparators,
    setColumnAlignment,
    setAllColumnsAlignment,
    convertGermanToInternational,
    getMetadata,
  };
}

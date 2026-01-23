import { useCallback } from 'react';
import type { LexicalEditor } from 'lexical';
import {
  $insertTableRowAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableColumnAtSelection,
} from '@lexical/table';
import { getTableMetadata, setTableMetadata, updateTableHeaderState } from '../utils/lexicalTableUtils';
import { triggerTableStyleUpdate } from '../components/LexicalTableEditor';
import type { TableAlignment } from '../types/table';

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
    getMetadata,
  };
}

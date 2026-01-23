import { useEffect, useCallback, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import type { EditorState, LexicalEditor } from 'lexical';
import type { ParsedTable, SyncSource } from '../types/table';
import { extractTableFromEditor, updateEditorWithTable, createEmptyEditorTable, getTableMetadata } from '../utils/lexicalTableUtils';
import { TableToolbar } from './TableToolbar';

const lexicalTableTheme = {
  table: 'lexical-table',
  tableCell: 'lexical-table-cell',
  tableCellHeader: 'lexical-table-cell-header',
  tableRow: 'lexical-table-row',
  tableSelected: 'lexical-table-selected',
  tableCellSelected: 'lexical-table-cell-selected',
};

// Move initialConfig outside component to prevent recreation on every render
const initialConfig = {
  namespace: 'TableEditor',
  theme: lexicalTableTheme,
  nodes: [TableNode, TableCellNode, TableRowNode],
  onError: (error: Error) => {
    console.error('Lexical error:', error);
  },
};

interface LexicalTableEditorProps {
  parsedTable: ParsedTable | null;
  onTableChange: (table: ParsedTable) => void;
  syncSourceRef: React.MutableRefObject<SyncSource>;
}

interface TableSyncPluginProps {
  parsedTable: ParsedTable | null;
  syncSourceRef: React.MutableRefObject<SyncSource>;
}

function TableSyncPlugin({ parsedTable, syncSourceRef }: TableSyncPluginProps) {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only update from external source (LaTeX) when syncSource is 'latex' or initial load
    if (syncSourceRef.current === 'lexical') return;

    // On initial mount, set up the table
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (parsedTable) {
        updateEditorWithTable(editor, parsedTable);
      } else {
        createEmptyEditorTable(editor, 3, 3);
      }
      return;
    }

    // Only update if source is explicitly 'latex' (user edited textarea)
    if (syncSourceRef.current === 'latex' && parsedTable) {
      updateEditorWithTable(editor, parsedTable);
    }
  }, [editor, parsedTable, syncSourceRef]);

  return null;
}

interface ChangeHandlerPluginProps {
  onChange: (table: ParsedTable) => void;
  syncSourceRef: React.MutableRefObject<SyncSource>;
}

function ChangeHandlerPlugin({ onChange, syncSourceRef }: ChangeHandlerPluginProps) {
  const [editor] = useLexicalComposerContext();

  const handleChange = useCallback(
    (_editorState: EditorState, _editor: LexicalEditor) => {
      // Don't trigger onChange if the change came from external source
      if (syncSourceRef.current === 'latex') return;

      const table = extractTableFromEditor(editor);
      if (table) {
        onChange(table);
      }
    },
    [editor, onChange, syncSourceRef]
  );

  return <OnChangePlugin onChange={handleChange} ignoreSelectionChange />;
}

function ToolbarChangePlugin({ onTableChange, syncSourceRef }: { onTableChange: (table: ParsedTable) => void; syncSourceRef: React.MutableRefObject<SyncSource> }) {
  const [editor] = useLexicalComposerContext();

  const handleToolbarChange = useCallback(() => {
    // Mark that change came from lexical/toolbar
    syncSourceRef.current = 'lexical';

    const table = extractTableFromEditor(editor);
    if (table) {
      onTableChange(table);
    }

    // Reset after a short delay
    setTimeout(() => {
      syncSourceRef.current = 'none';
    }, 50);
  }, [editor, onTableChange, syncSourceRef]);

  // Expose the handler via a ref that TableToolbar can access
  return <TableToolbar onTableChange={handleToolbarChange} />;
}

// Global function to trigger style reapplication (set by TableStylePlugin)
let applyTableStylesGlobal: (() => void) | null = null;

export function triggerTableStyleUpdate() {
  if (applyTableStylesGlobal) {
    applyTableStylesGlobal();
  }
}

// Plugin to apply dynamic styling based on table metadata
function TableStylePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Find the container element
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const applyStyles = () => {
      const metadata = getTableMetadata();
      const table = rootElement.querySelector('table');
      if (!table) return;

      // Apply table-level classes for borders
      table.classList.toggle('table-outer-borders', metadata.hasOuterBorders);
      table.classList.toggle('table-col-separators', metadata.hasColumnSeparators);
      table.classList.toggle('table-row-separators', metadata.hasRowSeparators);
      table.classList.toggle('table-has-header', metadata.hasHeaderRow);

      // Apply column alignments to cells
      const rows = table.querySelectorAll('tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('th, td');
        cells.forEach((cell, colIndex) => {
          // Horizontal alignment
          const hAlign = metadata.columnAlignments[colIndex] || 'center';
          cell.classList.remove('cell-align-left', 'cell-align-center', 'cell-align-right');
          cell.classList.add(`cell-align-${hAlign}`);
        });
      });
    };

    // Register the global function
    applyTableStylesGlobal = applyStyles;

    // Apply styles initially and on editor updates
    applyStyles();

    const removeListener = editor.registerUpdateListener(() => {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(applyStyles);
    });

    return () => {
      removeListener();
      applyTableStylesGlobal = null;
    };
  }, [editor]);

  return null;
}

export function LexicalTableEditor({
  parsedTable,
  onTableChange,
  syncSourceRef,
}: LexicalTableEditorProps) {
  return (
    <div className="lexical-table-editor">
      <label className="block text-sm font-medium text-[#9ca3af] mb-2 tracking-wide">
        Visual Table Editor
      </label>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarChangePlugin onTableChange={onTableChange} syncSourceRef={syncSourceRef} />
        <div className="lexical-table-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="lexical-content-editable"
                aria-label="Table editor"
              />
            }
            placeholder={
              <div className="lexical-placeholder">
                Edit the table cells...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <TablePlugin hasCellMerge={false} hasCellBackgroundColor={false} />
          <HistoryPlugin />
          <TableSyncPlugin parsedTable={parsedTable} syncSourceRef={syncSourceRef} />
          <ChangeHandlerPlugin onChange={onTableChange} syncSourceRef={syncSourceRef} />
          <TableStylePlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}

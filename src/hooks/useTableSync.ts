import { useState, useCallback, useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { createEmptyTable } from '../utils/latexTableParser';
import { generateDefaultTableLatex } from '../utils/latexTableSerializer';
import {
  FORMAT_CONFIGS,
  getParser,
  getSerializer,
  convertFormat,
} from '../utils/formatRegistry';
import type { ParsedTable, SyncSource } from '../types/table';
import type { ArrayFormat, FormatConfig } from '../types/arrayFormat';

interface UseTableSyncOptions {
  initialCode?: string;
  initialFormat?: ArrayFormat;
  debounceMs?: number;
}

interface UseTableSyncReturn {
  code: string;
  parsedTable: ParsedTable | null;
  parseError: string | null;
  handleCodeChange: (value: string) => void;
  handleLexicalChange: (table: ParsedTable) => void;
  syncSourceRef: React.MutableRefObject<SyncSource>;
  format: ArrayFormat;
  setFormat: (format: ArrayFormat) => void;
  formatConfig: FormatConfig;
}

export function useTableSync(options: UseTableSyncOptions = {}): UseTableSyncReturn {
  const {
    initialCode = '',
    initialFormat = 'latex',
    debounceMs = 300,
  } = options;

  const [format, setFormatState] = useState<ArrayFormat>(initialFormat);
  const [code, setCode] = useState<string>(initialCode || generateDefaultTableLatex());
  const [parsedTable, setParsedTable] = useState<ParsedTable | null>(() => {
    if (initialCode) {
      return getParser(initialFormat)(initialCode);
    }
    return createEmptyTable(3, 3);
  });
  const [parseError, setParseError] = useState<string | null>(null);

  // Use ref for sync source to avoid timing issues with state updates
  const syncSourceRef = useRef<SyncSource>('none');

  // Debounce code input for parsing
  const debouncedCode = useDebounce(code, debounceMs);

  // Parse code when it changes (debounced)
  useEffect(() => {
    // Skip if the change came from Lexical or format change
    if (syncSourceRef.current === 'lexical' || syncSourceRef.current === 'format-change') {
      return;
    }

    if (!debouncedCode.trim()) {
      setParsedTable(null);
      setParseError(null);
      return;
    }

    try {
      const parser = getParser(format);
      const table = parser(debouncedCode);
      if (table) {
        setParsedTable(table);
        setParseError(null);
      } else {
        setParseError(`Unable to parse ${FORMAT_CONFIGS[format].label} format.`);
      }
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Unknown parse error');
    }
  }, [debouncedCode, format]);

  // Handle textarea changes
  const handleCodeChange = useCallback((value: string) => {
    syncSourceRef.current = 'latex';
    setCode(value);

    // Reset sync source after debounce period + buffer
    setTimeout(() => {
      syncSourceRef.current = 'none';
    }, debounceMs + 50);
  }, [debounceMs]);

  // Handle Lexical editor changes
  const handleLexicalChange = useCallback((table: ParsedTable) => {
    syncSourceRef.current = 'lexical';
    setParsedTable(table);

    // Serialize using current format
    const serializer = getSerializer(format);
    const serialized = serializer(table);
    setCode(serialized);
    setParseError(null);

    // Keep syncSource as 'lexical' longer to prevent feedback loop
    setTimeout(() => {
      syncSourceRef.current = 'none';
    }, 100);
  }, [format]);

  // Handle format change with conversion
  const setFormat = useCallback((newFormat: ArrayFormat) => {
    if (newFormat === format) return;

    syncSourceRef.current = 'format-change';

    // Convert current content to new format
    const { result, error } = convertFormat(code, format, newFormat);

    if (error) {
      setParseError(error);
    } else {
      setCode(result);
      setParseError(null);
    }

    setFormatState(newFormat);

    // Reset sync source after a delay
    setTimeout(() => {
      syncSourceRef.current = 'none';
    }, 100);
  }, [format, code]);

  return {
    code,
    parsedTable,
    parseError,
    handleCodeChange,
    handleLexicalChange,
    syncSourceRef,
    format,
    setFormat,
    formatConfig: FORMAT_CONFIGS[format],
  };
}

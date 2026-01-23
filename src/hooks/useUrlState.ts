import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getStateFromUrl,
  updateUrlWithState,
  getDefaultStyle,
  type UrlState,
  type TableStyle,
} from '../utils/urlEncoding';
import type { InputMode } from '../components/InputModeToggle';
import type { ArrayFormat } from '../types/arrayFormat';

interface UseUrlStateReturn {
  formula: string;
  setFormula: (formula: string) => void;
  mode: InputMode;
  setMode: (mode: InputMode) => void;
  tableCode: string;
  setTableCode: (code: string) => void;
  format: ArrayFormat;
  setFormat: (format: ArrayFormat) => void;
  style: TableStyle;
  setStyle: (style: TableStyle) => void;
  updateTableState: (updates: {
    code?: string;
    format?: ArrayFormat;
    style?: TableStyle;
  }) => void;
}

export function useUrlState(): UseUrlStateReturn {
  const [state, setState] = useState<UrlState>(() => getStateFromUrl());

  const updateTimeoutRef = useRef<number | null>(null);
  const pendingUpdatesRef = useRef<Partial<UrlState>>({});

  const flushUrlUpdate = useCallback(() => {
    if (Object.keys(pendingUpdatesRef.current).length > 0) {
      updateUrlWithState(pendingUpdatesRef.current);
      pendingUpdatesRef.current = {};
    }
  }, []);

  const scheduleUrlUpdate = useCallback((updates: Partial<UrlState>) => {
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = window.setTimeout(flushUrlUpdate, 150);
  }, [flushUrlUpdate]);

  const setFormula = useCallback((formula: string) => {
    setState(prev => ({ ...prev, formula }));
    scheduleUrlUpdate({ formula });
  }, [scheduleUrlUpdate]);

  const setMode = useCallback((mode: InputMode) => {
    setState(prev => ({ ...prev, mode }));
    updateUrlWithState({ mode });
  }, []);

  const setTableCode = useCallback((tableCode: string) => {
    setState(prev => ({ ...prev, tableCode }));
    scheduleUrlUpdate({ tableCode });
  }, [scheduleUrlUpdate]);

  const setFormat = useCallback((format: ArrayFormat) => {
    setState(prev => ({ ...prev, format }));
    scheduleUrlUpdate({ format });
  }, [scheduleUrlUpdate]);

  const setStyle = useCallback((style: TableStyle) => {
    setState(prev => ({ ...prev, style }));
    scheduleUrlUpdate({ style });
  }, [scheduleUrlUpdate]);

  const updateTableState = useCallback((updates: {
    code?: string;
    format?: ArrayFormat;
    style?: TableStyle;
  }) => {
    setState(prev => ({
      ...prev,
      ...(updates.code !== undefined && { tableCode: updates.code }),
      ...(updates.format !== undefined && { format: updates.format }),
      ...(updates.style !== undefined && { style: updates.style }),
    }));

    const urlUpdates: Partial<UrlState> = {};
    if (updates.code !== undefined) urlUpdates.tableCode = updates.code;
    if (updates.format !== undefined) urlUpdates.format = updates.format;
    if (updates.style !== undefined) urlUpdates.style = updates.style;

    scheduleUrlUpdate(urlUpdates);
  }, [scheduleUrlUpdate]);

  useEffect(() => {
    const handlePopState = () => {
      setState(getStateFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
        flushUrlUpdate();
      }
    };
  }, [flushUrlUpdate]);

  return {
    formula: state.formula,
    setFormula,
    mode: state.mode,
    setMode,
    tableCode: state.tableCode,
    setTableCode,
    format: state.format,
    setFormat,
    style: state.style || getDefaultStyle(),
    setStyle,
    updateTableState,
  };
}

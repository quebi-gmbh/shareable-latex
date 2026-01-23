import { useState, useEffect, useCallback } from 'react';
import { getFormulaFromUrl, updateUrlWithFormula } from '../utils/urlEncoding';

export function useFormulaUrl() {
  const [formula, setFormulaState] = useState<string>(() => getFormulaFromUrl());

  const setFormula = useCallback((newFormula: string) => {
    setFormulaState(newFormula);
    updateUrlWithFormula(newFormula);
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setFormulaState(getFormulaFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [formula, setFormula] as const;
}

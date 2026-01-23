interface MathJaxSVGOptions {
  display?: boolean;
  em?: number;
  ex?: number;
  containerWidth?: number;
  scale?: number;
}

interface MathJaxStartup {
  document: {
    clear: () => void;
    updateDocument: () => void;
  };
  promise: Promise<void>;
}

interface MathJaxObject {
  tex2svg: (tex: string, options?: MathJaxSVGOptions) => HTMLElement;
  tex2svgPromise: (tex: string, options?: MathJaxSVGOptions) => Promise<HTMLElement>;
  texReset: () => void;
  getMetricsFor: (node: HTMLElement, display?: boolean) => MathJaxSVGOptions;
  startup: MathJaxStartup;
}

interface MathJaxConfig {
  tex?: {
    packages?: string[];
    inlineMath?: [string, string][];
    displayMath?: [string, string][];
  };
  svg?: {
    fontCache?: 'local' | 'global' | 'none';
    scale?: number;
    minScale?: number;
  };
  startup?: {
    typeset?: boolean;
    ready?: () => void;
    pageReady?: () => void;
  };
}

declare global {
  interface Window {
    MathJax: MathJaxObject & MathJaxConfig;
  }
}

export {};

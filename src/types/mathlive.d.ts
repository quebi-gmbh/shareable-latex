import type { MathfieldElement } from 'mathlive';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> & {
          'virtual-keyboard-mode'?: 'manual' | 'auto' | 'off';
          'math-virtual-keyboard-policy'?: 'auto' | 'manual' | 'sandboxed';
          ref?: React.Ref<MathfieldElement>;
        },
        MathfieldElement
      >;
    }
  }
}

export {};

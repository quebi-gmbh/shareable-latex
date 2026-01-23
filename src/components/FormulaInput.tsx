import { InputModeToggle, type InputMode } from './InputModeToggle';
import { MathLiveEditor } from './MathLiveEditor';
import { TextInput } from './TextInput';
import { TableEditor } from './TableEditor';
import type { ArrayFormat } from '../types/arrayFormat';
import type { TableStyle } from '../utils/urlEncoding';

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  tableCode?: string;
  onTableCodeChange?: (code: string) => void;
  tableFormat?: ArrayFormat;
  onTableFormatChange?: (format: ArrayFormat) => void;
  tableStyle?: TableStyle;
  onTableStyleChange?: (style: TableStyle) => void;
}

export function FormulaInput({
  value,
  onChange,
  mode,
  onModeChange,
  tableCode,
  onTableCodeChange,
  tableFormat,
  onTableFormatChange,
  tableStyle,
  onTableStyleChange,
}: FormulaInputProps) {
  return (
    <section aria-labelledby="input-heading">
      <h2 id="input-heading" className="sr-only">Formula Input</h2>
      <InputModeToggle mode={mode} onModeChange={onModeChange} />
      <div>
        {mode === 'visual' ? (
          <MathLiveEditor value={value} onChange={onChange} />
        ) : mode === 'text' ? (
          <TextInput value={value} onChange={onChange} />
        ) : (
          <TableEditor
            initialCode={tableCode}
            initialFormat={tableFormat}
            initialStyle={tableStyle}
            onCodeChange={onTableCodeChange}
            onFormatChange={onTableFormatChange}
            onStyleChange={onTableStyleChange}
          />
        )}
      </div>
    </section>
  );
}

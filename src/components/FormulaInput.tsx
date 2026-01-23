import { InputModeToggle, type InputMode } from './InputModeToggle';
import { MathLiveEditor } from './MathLiveEditor';
import { TextInput } from './TextInput';
import { TableEditor } from './TableEditor';

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
}

export function FormulaInput({ value, onChange, mode, onModeChange }: FormulaInputProps) {
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
          <TableEditor />
        )}
      </div>
    </section>
  );
}

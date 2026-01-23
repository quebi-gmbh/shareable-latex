import { useRef, useEffect } from "react";
import "mathlive";
import type { MathfieldElement } from "mathlive";

interface MathLiveEditorProps {
  value: string;
  onChange: (latex: string) => void;
}

export function MathLiveEditor({ value, onChange }: MathLiveEditorProps) {
  const mathFieldRef = useRef<MathfieldElement | null>(null);

  useEffect(() => {
    const mathField = mathFieldRef.current;
    if (mathField && mathField.value !== value) {
      mathField.value = value;
    }
  }, [value]);

  useEffect(() => {
    const mathField = mathFieldRef.current;
    if (!mathField) return;

    const handleInput = () => {
      onChange(mathField.value);
    };

    mathField.addEventListener("input", handleInput);
    return () => mathField.removeEventListener("input", handleInput);
  }, [onChange]);

  return (
    <div className="mathlive-editor w-full flex flex-col gap-1">
      <label
        id="mathlive-label"
        className="block text-sm font-medium text-[#9ca3af] mb-2 tracking-wide"
      >
        Visual Editor
      </label>
      <div className="">
        <math-field
          ref={mathFieldRef as React.RefObject<MathfieldElement>}
          virtual-keyboard-mode="manual"
          aria-labelledby="mathlive-label"
        />
      </div>
    </div>
  );
}

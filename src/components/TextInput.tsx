import { TextField, Label, TextArea } from "react-aria-components";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      className="flex flex-col w-full"
    >
      <Label className="block text-sm font-medium text-[#9ca3af] mb-2 tracking-wide">
        LaTeX Formula
      </Label>
      <TextArea
        placeholder="Enter LaTeX formula, e.g., \frac{1}{2} or \int_0^\infty e^{-x^2} dx"
        rows={3}
        className="w-full px-4 py-2 border border-1 border-[rgba(45,212,168,0.1)] rounded-sm font-mono text-lg leading-relaxed bg-[rgba(17,24,39,0.5)] text-[#f9fafb] resize-y min-h-20 transition-all duration-300 placeholder:text-[#6b7280] focus:outline-none focus:border-[rgba(45,212,168,0.5)] focus:shadow-[0_0_30px_rgba(45,212,168,0.15),inset_0_0_20px_rgba(45,212,168,0.05)]"
      />
    </TextField>
  );
}

import { ToggleButton } from "react-aria-components";
import { PenLine, Code, Table } from "lucide-react";

export type InputMode = "visual" | "text" | "table";

interface InputModeToggleProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
}

const toggleButtonClasses = `
  flex items-center gap-1 py-2 px-4
  border border-[rgba(45,212,168,0.1)] rounded-sm
  bg-gradient-to-br from-[rgba(45,212,168,0.05)] to-transparent
  text-[#9ca3af] font-sans text-sm font-medium
  cursor-pointer transition-all duration-300
  hover:bg-gradient-to-br hover:from-[rgba(45,212,168,0.1)] hover:to-transparent
  hover:border-[rgba(45,212,168,0.3)] hover:text-[#f9fafb] hover:shadow-[0_0_30px_rgba(45,212,168,0.15)]
  data-[selected=true]:bg-gradient-to-br data-[selected=true]:from-[rgba(45,212,168,0.2)] data-[selected=true]:to-[rgba(6,182,212,0.1)]
  data-[selected=true]:text-[#2dd4a8] data-[selected=true]:border-[rgba(45,212,168,0.5)] data-[selected=true]:shadow-[0_0_30px_rgba(45,212,168,0.15)]
  focus-visible:outline-2 focus-visible:outline-[#2dd4a8] focus-visible:outline-offset-2 border-2
`;

export function InputModeToggle({ mode, onModeChange }: InputModeToggleProps) {
  return (
    <div
      className="flex gap-2 mb-4"
      role="group"
      aria-label="Input mode selection"
    >
      <ToggleButton
        isSelected={mode === "visual"}
        onChange={() => onModeChange("visual")}
        aria-label="Visual editor mode"
        className={toggleButtonClasses}
      >
        <PenLine size={18} aria-hidden="true" />
        <span>Visual</span>
      </ToggleButton>
      <ToggleButton
        isSelected={mode === "text"}
        onChange={() => onModeChange("text")}
        aria-label="LaTeX text input mode"
        className={toggleButtonClasses}
      >
        <Code size={18} aria-hidden="true" />
        <span>LaTeX</span>
      </ToggleButton>
      <ToggleButton
        isSelected={mode === "table"}
        onChange={() => onModeChange("table")}
        aria-label="Table editor mode"
        className={toggleButtonClasses}
      >
        <Table size={18} aria-hidden="true" />
        <span>Tables</span>
      </ToggleButton>
    </div>
  );
}

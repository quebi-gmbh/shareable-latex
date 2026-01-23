import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Label,
} from "react-aria-components";
import { ChevronDown, Check } from "lucide-react";
import type { ArrayFormat } from "../types/arrayFormat";
import { FORMAT_CONFIGS, FORMAT_ORDER } from "../utils/formatRegistry";

interface FormatSelectorProps {
  format: ArrayFormat;
  onFormatChange: (format: ArrayFormat) => void;
  disabled?: boolean;
}

const buttonClassName =
  "flex items-center gap-2 py-1.5 px-3 bg-[rgba(17,24,39,0.5)] text-[#f9fafb] border border-[rgba(45,212,168,0.2)] rounded-sm font-sans text-[0.875rem] cursor-pointer transition-all duration-300 hover:border-[rgba(45,212,168,0.5)] hover:bg-[rgba(45,212,168,0.1)] focus-visible:outline-2 focus-visible:outline-[#2dd4a8] focus-visible:outline-offset-2 data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed";

const menuItemClassName =
  "flex items-center gap-3 px-4 py-2.5 text-[#f9fafb] cursor-pointer rounded-sm outline-none hover:bg-[rgba(45,212,168,0.15)] focus:bg-[rgba(45,212,168,0.15)] data-[focused]:bg-[rgba(45,212,168,0.15)]";

const popoverClassName =
  "bg-[rgba(17,24,39,0.95)] border border-[rgba(45,212,168,0.2)] rounded-sm shadow-xl backdrop-blur-sm overflow-hidden border-1";

export function FormatSelector({
  format,
  onFormatChange,
  disabled,
}: FormatSelectorProps) {
  const currentConfig = FORMAT_CONFIGS[format];

  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm text-[#9ca3af]">Format:</Label>
      <MenuTrigger>
        <Button
          isDisabled={disabled}
          className={buttonClassName}
          aria-label="Select array format"
        >
          <span>{currentConfig.label}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </Button>
        <Popover className={popoverClassName}>
          <Menu
            onAction={(key) => onFormatChange(key as ArrayFormat)}
            className="outline-none p-1"
          >
            {FORMAT_ORDER.map((fmt) => (
              <MenuItem key={fmt} id={fmt} className={menuItemClassName}>
                <span className="flex-1">{FORMAT_CONFIGS[fmt].label}</span>
                {fmt === format && (
                  <Check
                    size={16}
                    className="text-[#2dd4a8]"
                    aria-hidden="true"
                  />
                )}
              </MenuItem>
            ))}
          </Menu>
        </Popover>
      </MenuTrigger>
    </div>
  );
}

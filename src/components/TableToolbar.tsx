import { useState, useRef, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  Plus,
  Minus,
  RowsIcon,
  Columns3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Square,
  SquareDashed,
  Grid3X3,
  TableIcon,
  ChevronDown,
} from "lucide-react";
import { useTableActions } from "../hooks/useTableActions";

interface TableToolbarProps {
  onTableChange?: () => void;
}

interface DropdownProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function Dropdown({
  label,
  icon,
  children,
  isOpen,
  onToggle,
  onClose,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium whitespace-nowrap rounded-md border cursor-pointer transition-all duration-150
          ${
            isOpen
              ? "text-[#2dd4a8] bg-[rgba(45,212,168,0.2)] border-[rgba(45,212,168,0.4)]"
              : "text-[#d1d5db] bg-[rgba(45,212,168,0.05)] border-[rgba(45,212,168,0.15)] hover:text-[#f9fafb] hover:bg-[rgba(45,212,168,0.15)] hover:border-[rgba(45,212,168,0.3)]"
          }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon}
        <span className="hidden min-[400px]:inline">{label}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 min-w-40 bg-[rgba(17,24,39,0.98)] border border-[rgba(45,212,168,0.3)] rounded-lg p-1 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 animate-[dropdownIn_0.15s_ease-out]">
          {children}
        </div>
      )}
    </div>
  );
}

export function TableToolbar({ onTableChange }: TableToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const actions = useTableActions(editor, onTableChange);
  const metadata = actions.getMetadata();

  const handleAction = (action: () => void) => {
    action();
  };

  const closeDropdown = () => setOpenDropdown(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const btnBase =
    "relative flex items-center justify-center w-8 h-8 rounded-md border cursor-pointer transition-all duration-150 border-1";
  const btnDefault =
    "text-[#d1d5db] bg-[rgba(45,212,168,0.05)] border-[rgba(45,212,168,0.15)] hover:text-[#f9fafb] hover:bg-[rgba(45,212,168,0.15)] hover:border-[rgba(45,212,168,0.3)] active:scale-95";
  const btnActive =
    "text-[#2dd4a8] bg-[rgba(45,212,168,0.2)] border-[rgba(45,212,168,0.4)]";
  const btnDanger =
    "text-[#f87171] bg-[rgba(248,113,113,0.05)] border-[rgba(248,113,113,0.15)] hover:text-[#fca5a5] hover:bg-[rgba(248,113,113,0.15)] hover:border-[rgba(248,113,113,0.3)] active:scale-95";

  const badgeBase = "absolute text-[#2dd4a8]";
  const badgeDanger = "absolute text-[#f87171]";

  const dropdownItemBase =
    "flex items-center gap-2 w-full px-3 py-2 rounded-md border-none cursor-pointer transition-all duration-150 text-[0.8125rem] text-left whitespace-nowrap";
  const dropdownItemDefault =
    "text-[#d1d5db] bg-transparent hover:text-[#f9fafb] hover:bg-[rgba(45,212,168,0.15)]";
  const dropdownItemActive = "text-[#2dd4a8]";
  const dropdownItemDanger =
    "text-[#f87171] hover:text-[#fca5a5] hover:bg-[rgba(248,113,113,0.15)]";

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-[rgba(17,24,39,0.8)] border border-1 border-[rgba(45,212,168,0.15)] rounded-lg mb-2 flex-wrap">
      {/* Row actions - visible on wider screens */}
      <div className="hidden sm:flex items-center gap-0.5">
        <button
          onClick={() => handleAction(actions.insertRowAbove)}
          className={`${btnBase} ${btnDefault}`}
          title="Add row above"
        >
          <RowsIcon size={14} />
          <Plus size={8} className={`${badgeBase} top-0.5 left-0.5`} />
        </button>
        <button
          onClick={() => handleAction(actions.insertRowBelow)}
          className={`${btnBase} ${btnDefault}`}
          title="Add row below"
        >
          <RowsIcon size={14} />
          <Plus size={8} className={`${badgeBase} bottom-0.5 left-0.5`} />
        </button>
        <button
          onClick={() => handleAction(actions.deleteRow)}
          className={`${btnBase} ${btnDanger}`}
          title="Delete row"
        >
          <RowsIcon size={14} />
          <Minus size={8} className={`${badgeDanger} top-0.5 left-0.5`} />
        </button>
      </div>

      {/* Row dropdown for narrow screens */}
      <div className="flex sm:hidden items-center gap-0.5">
        <Dropdown
          label="Rows"
          icon={<RowsIcon size={14} />}
          isOpen={openDropdown === "rows"}
          onToggle={() => toggleDropdown("rows")}
          onClose={closeDropdown}
        >
          <button
            onClick={() => {
              handleAction(actions.insertRowAbove);
              closeDropdown();
            }}
            className={`${dropdownItemBase} ${dropdownItemDefault}`}
          >
            <Plus size={12} /> Add row above
          </button>
          <button
            onClick={() => {
              handleAction(actions.insertRowBelow);
              closeDropdown();
            }}
            className={`${dropdownItemBase} ${dropdownItemDefault}`}
          >
            <Plus size={12} /> Add row below
          </button>
          <button
            onClick={() => {
              handleAction(actions.deleteRow);
              closeDropdown();
            }}
            className={`${dropdownItemBase} ${dropdownItemDanger}`}
          >
            <Minus size={12} /> Delete row
          </button>
        </Dropdown>
      </div>

      {/* Column actions - visible on wider screens */}
      <div className="hidden sm:flex items-center gap-0.5">
        <button
          onClick={() => handleAction(actions.insertColumnLeft)}
          className={`${btnBase} ${btnDefault}`}
          title="Add column left"
        >
          <Columns3 size={14} />
          <Plus size={8} className={`${badgeBase} top-0.5 left-0.5`} />
        </button>
        <button
          onClick={() => handleAction(actions.insertColumnRight)}
          className={`${btnBase} ${btnDefault}`}
          title="Add column right"
        >
          <Columns3 size={14} />
          <Plus size={8} className={`${badgeBase} top-0.5 right-0.5`} />
        </button>
        <button
          onClick={() => handleAction(actions.deleteColumn)}
          className={`${btnBase} ${btnDanger}`}
          title="Delete column"
        >
          <Columns3 size={14} />
          <Minus size={8} className={`${badgeDanger} top-0.5 left-0.5`} />
        </button>
      </div>

      {/* Column dropdown for narrow screens */}
      <div className="flex sm:hidden items-center gap-0.5">
        <Dropdown
          label="Cols"
          icon={<Columns3 size={14} />}
          isOpen={openDropdown === "cols"}
          onToggle={() => toggleDropdown("cols")}
          onClose={closeDropdown}
        >
          <button
            onClick={() => {
              handleAction(actions.insertColumnLeft);
              closeDropdown();
            }}
            className={`${dropdownItemBase} ${dropdownItemDefault}`}
          >
            <Plus size={12} /> Add column left
          </button>
          <button
            onClick={() => {
              handleAction(actions.insertColumnRight);
              closeDropdown();
            }}
            className={`${dropdownItemBase} ${dropdownItemDefault}`}
          >
            <Plus size={12} /> Add column right
          </button>
          <button
            onClick={() => {
              handleAction(actions.deleteColumn);
              closeDropdown();
            }}
            className={`${dropdownItemBase} ${dropdownItemDanger}`}
          >
            <Minus size={12} /> Delete column
          </button>
        </Dropdown>
      </div>

      <div className="w-px h-6 bg-[rgba(45,212,168,0.2)] mx-1" />

      {/* Format toggles - visible on wider screens */}
      <div className="hidden sm:flex items-center gap-0.5">
        <button
          onClick={() => handleAction(actions.toggleHeaderRow)}
          className={`${btnBase} ${metadata.hasHeaderRow ? btnActive : btnDefault}`}
          title="Toggle header row"
        >
          <TableIcon size={14} />
        </button>
        <button
          onClick={() => handleAction(actions.toggleOuterBorders)}
          className={`${btnBase} ${metadata.hasOuterBorders ? btnActive : btnDefault}`}
          title="Toggle outer borders"
        >
          <Square size={14} />
        </button>
        <button
          onClick={() => handleAction(actions.toggleColumnSeparators)}
          className={`${btnBase} ${metadata.hasColumnSeparators ? btnActive : btnDefault}`}
          title="Toggle column separators"
        >
          <SquareDashed size={14} />
        </button>
        <button
          onClick={() => handleAction(actions.toggleRowSeparators)}
          className={`${btnBase} ${metadata.hasRowSeparators ? btnActive : btnDefault}`}
          title="Toggle row separators"
        >
          <Grid3X3 size={14} />
        </button>
      </div>

      {/* Format dropdown for narrow screens */}
      <div className="flex sm:hidden items-center gap-0.5">
        <Dropdown
          label="Format"
          icon={<TableIcon size={14} />}
          isOpen={openDropdown === "format"}
          onToggle={() => toggleDropdown("format")}
          onClose={closeDropdown}
        >
          <button
            onClick={() => handleAction(actions.toggleHeaderRow)}
            className={`${dropdownItemBase} ${metadata.hasHeaderRow ? dropdownItemActive : dropdownItemDefault}`}
          >
            <TableIcon size={12} /> Header row{" "}
            {metadata.hasHeaderRow ? "✓" : ""}
          </button>
          <button
            onClick={() => handleAction(actions.toggleOuterBorders)}
            className={`${dropdownItemBase} ${metadata.hasOuterBorders ? dropdownItemActive : dropdownItemDefault}`}
          >
            <Square size={12} /> Outer borders{" "}
            {metadata.hasOuterBorders ? "✓" : ""}
          </button>
          <button
            onClick={() => handleAction(actions.toggleColumnSeparators)}
            className={`${dropdownItemBase} ${metadata.hasColumnSeparators ? dropdownItemActive : dropdownItemDefault}`}
          >
            <SquareDashed size={12} /> Column separators{" "}
            {metadata.hasColumnSeparators ? "✓" : ""}
          </button>
          <button
            onClick={() => handleAction(actions.toggleRowSeparators)}
            className={`${dropdownItemBase} ${metadata.hasRowSeparators ? dropdownItemActive : dropdownItemDefault}`}
          >
            <Grid3X3 size={12} /> Row separators{" "}
            {metadata.hasRowSeparators ? "✓" : ""}
          </button>
        </Dropdown>
      </div>

      <div className="hidden sm:block w-px h-6 bg-[rgba(45,212,168,0.2)] mx-1" />

      {/* Horizontal Alignment (column-specific) - always in dropdown */}
      <div className="flex items-center gap-0.5">
        <Dropdown
          label="Alignment"
          icon={<AlignCenter size={14} />}
          isOpen={openDropdown === "halign"}
          onToggle={() => toggleDropdown("halign")}
          onClose={closeDropdown}
        >
          <div className="px-2 py-1 text-[0.6875rem] text-[#6b7280] uppercase tracking-wide">
            All Columns
          </div>
          <button
            onClick={() => {
              handleAction(() => actions.setAllColumnsAlignment("left"));
              closeDropdown();
            }}
            className={`${dropdownItemBase} ${dropdownItemDefault}`}
          >
            <AlignLeft size={12} /> Left
          </button>
          <button
            onClick={() => {
              handleAction(() => actions.setAllColumnsAlignment("center"));
              closeDropdown();
            }}
            className={`${dropdownItemBase} ${dropdownItemDefault}`}
          >
            <AlignCenter size={12} /> Center
          </button>
          <button
            onClick={() => {
              handleAction(() => actions.setAllColumnsAlignment("right"));
              closeDropdown();
            }}
            className={`${dropdownItemBase} ${dropdownItemDefault}`}
          >
            <AlignRight size={12} /> Right
          </button>
          {metadata.columnAlignments.length > 0 && (
            <>
              <div className="h-px bg-[rgba(45,212,168,0.2)] my-1" />
              <div className="px-2 py-1 text-[0.6875rem] text-[#6b7280] uppercase tracking-wide">
                Per Column
              </div>
              {metadata.columnAlignments.map((align, idx) => (
                <div key={idx} className="flex items-center gap-1 px-2 py-1">
                  <span className="text-[0.75rem] text-[#9ca3af] w-12">
                    Col {idx + 1}:
                  </span>
                  <button
                    onClick={() =>
                      handleAction(() =>
                        actions.setColumnAlignment(idx, "left"),
                      )
                    }
                    className={`p-1 rounded border-1 ${align === "left" ? "border-[rgba(45,212,168,0.5)] bg-[rgba(45,212,168,0.2)] text-[#2dd4a8]" : "border-transparent text-[#9ca3af] hover:text-[#f9fafb]"}`}
                    title="Left"
                  >
                    <AlignLeft size={12} />
                  </button>
                  <button
                    onClick={() =>
                      handleAction(() =>
                        actions.setColumnAlignment(idx, "center"),
                      )
                    }
                    className={`p-1 rounded border-1 ${align === "center" ? "border-[rgba(45,212,168,0.5)] bg-[rgba(45,212,168,0.2)] text-[#2dd4a8]" : "border-transparent text-[#9ca3af] hover:text-[#f9fafb]"}`}
                    title="Center"
                  >
                    <AlignCenter size={12} />
                  </button>
                  <button
                    onClick={() =>
                      handleAction(() =>
                        actions.setColumnAlignment(idx, "right"),
                      )
                    }
                    className={`p-1 rounded border-1 ${align === "right" ? "border-[rgba(45,212,168,0.5)] bg-[rgba(45,212,168,0.2)] text-[#2dd4a8]" : "border-transparent text-[#9ca3af] hover:text-[#f9fafb]"}`}
                    title="Right"
                  >
                    <AlignRight size={12} />
                  </button>
                </div>
              ))}
            </>
          )}
        </Dropdown>
      </div>
    </div>
  );
}

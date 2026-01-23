import { useRef } from "react";
import { TextField, Label, TextArea } from "react-aria-components";
import { AlertCircle } from "lucide-react";
import { LexicalTableEditor } from "./LexicalTableEditor";
import { FormatSelector } from "./FormatSelector";
import { TablePreview, TablePreviewRef } from "./TablePreview";
import { DownloadRasterMenu, DownloadVectorMenu } from "./DownloadMenu";
import { useTableSync } from "../hooks/useTableSync";
import { isMathJaxCompatible } from "../utils/formatRegistry";
import type { ArrayFormat } from "../types/arrayFormat";
import type { TableStyle } from "../utils/urlEncoding";

interface TableEditorProps {
  initialCode?: string;
  initialFormat?: ArrayFormat;
  initialStyle?: TableStyle;
  onCodeChange?: (code: string) => void;
  onFormatChange?: (format: ArrayFormat) => void;
  onStyleChange?: (style: TableStyle) => void;
}

export function TableEditor({
  initialCode,
  initialFormat,
  initialStyle,
  onCodeChange,
  onFormatChange,
  onStyleChange,
}: TableEditorProps) {
  const {
    code,
    parsedTable,
    parseError,
    handleCodeChange,
    handleLexicalChange,
    syncSourceRef,
    format,
    setFormat,
    formatConfig,
  } = useTableSync({
    initialCode,
    initialFormat,
    initialStyle,
    onCodeChange,
    onFormatChange,
    onStyleChange,
  });

  const previewRef = useRef<TablePreviewRef>(null);

  // Check if current format supports MathJax preview
  const canPreview = isMathJaxCompatible(format);
  const hasValidTable = !!parsedTable && parsedTable.rows.length > 0;

  return (
    <div className="table-editor flex flex-col gap-4">
      {/* Format Selector */}
      <div className="flex justify-start">
        <FormatSelector format={format} onFormatChange={setFormat} />
      </div>

      {/* Code Input Pane */}
      <div className="flex-1">
        <TextField
          value={code}
          onChange={handleCodeChange}
          className="flex flex-col w-full"
        >
          <Label className="block text-sm font-medium text-[#9ca3af] mb-2 tracking-wide">
            {formatConfig.label} Code
          </Label>
          <TextArea
            placeholder={formatConfig.placeholder}
            rows={8}
            className="w-full p-4 border border-[rgba(45,212,168,0.1)] rounded-sm font-mono text-[0.875rem] leading-relaxed bg-[rgba(17,24,39,0.5)] text-[#f9fafb] resize-y min-h-32 transition-all duration-300 placeholder:text-[#6b7280] focus:outline-none focus:border-[rgba(45,212,168,0.5)] focus:shadow-[0_0_30px_rgba(45,212,168,0.15),inset_0_0_20px_rgba(45,212,168,0.05)] border-1"
          />
        </TextField>
        {parseError && (
          <div
            className="flex items-start gap-2 text-[#f87171] text-sm p-3 bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)] rounded-md mt-2"
            role="alert"
          >
            <AlertCircle
              size={16}
              aria-hidden="true"
              className="shrink-0 mt-0.5"
            />
            <span>{parseError}</span>
          </div>
        )}
      </div>

      {/* Lexical Visual Editor Pane */}
      <div className="flex-1">
        <LexicalTableEditor
          parsedTable={parsedTable}
          onTableChange={handleLexicalChange}
          syncSourceRef={syncSourceRef}
        />
      </div>

      {/* LaTeX Preview - only shown for MathJax-compatible formats */}
      {canPreview && (
        <>
          <TablePreview ref={previewRef} latex={code} />

          {/* Download Options */}
          <div className="flex justify-center gap-3">
            <DownloadRasterMenu
              formulaRef={previewRef}
              disabled={!hasValidTable}
            />
            <DownloadVectorMenu
              formulaRef={previewRef}
              disabled={!hasValidTable}
            />
          </div>
        </>
      )}
    </div>
  );
}

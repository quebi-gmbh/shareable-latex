import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";
import { Image, FileCode, Loader2 } from "lucide-react";
import type { FormulaRendererRef } from "./FormulaRenderer";
import {
  downloadPngHighres,
  downloadPngLowres,
  downloadJpgHighres,
  downloadJpgLowres,
  downloadSvg,
  downloadPdfVector,
} from "../utils/download";

interface DownloadMenuProps {
  formulaRef: React.RefObject<FormulaRendererRef | null>;
  disabled?: boolean;
}

type RasterFormat = "png-highres" | "png-lowres" | "jpg-highres" | "jpg-lowres";
type VectorFormat = "svg" | "pdf";

const RASTER_OPTIONS: { id: RasterFormat; label: string }[] = [
  { id: "png-highres", label: "PNG (High-res)" },
  { id: "png-lowres", label: "PNG (Low-res)" },
  { id: "jpg-highres", label: "JPG (High-res)" },
  { id: "jpg-lowres", label: "JPG (Low-res)" },
];

const VECTOR_OPTIONS: { id: VectorFormat; label: string }[] = [
  { id: "svg", label: "SVG" },
  { id: "pdf", label: "PDF" },
];

const buttonClassName =
  "flex items-center gap-2 py-2 px-4 bg-gradient-to-br from-[rgba(45,212,168,0.2)] to-[rgba(6,182,212,0.1)] text-[#2dd4a8] border border-[rgba(45,212,168,0.5)] rounded-sm font-sans text-[0.875rem] font-semibold cursor-pointer transition-all duration-300 shadow-[0_0_30px_rgba(45,212,168,0.15)] hover:bg-gradient-to-br hover:from-[rgba(45,212,168,0.3)] hover:to-[rgba(6,182,212,0.2)] hover:border-[#2dd4a8] hover:shadow-[0_0_60px_rgba(45,212,168,0.25)] hover:-translate-y-0.5 active:translate-y-0 data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:shadow-none focus-visible:outline-2 focus-visible:outline-[#2dd4a8] focus-visible:outline-offset-2 border-1";

const menuItemClassName =
  "flex items-center gap-3 px-4 py-2.5 text-[#f9fafb] cursor-pointer rounded-sm outline-none hover:bg-[rgba(45,212,168,0.15)] focus:bg-[rgba(45,212,168,0.15)] data-[focused]:bg-[rgba(45,212,168,0.15)]";

const popoverClassName =
  "bg-[rgba(17,24,39,0.95)] border border-[rgba(45,212,168,0.2)] rounded-sm shadow-xl backdrop-blur-sm overflow-hidden border-1";

export function DownloadRasterMenu({
  formulaRef,
  disabled,
}: DownloadMenuProps) {
  const [downloading, setDownloading] = useState<RasterFormat | null>(null);

  const handleDownload = async (format: RasterFormat) => {
    const svg = formulaRef.current?.getSvgElement();
    if (!svg) return;

    setDownloading(format);

    try {
      switch (format) {
        case "png-highres":
          await downloadPngHighres(svg);
          break;
        case "png-lowres":
          await downloadPngLowres(svg);
          break;
        case "jpg-highres":
          await downloadJpgHighres(svg);
          break;
        case "jpg-lowres":
          await downloadJpgLowres(svg);
          break;
      }
    } catch (error) {
      console.error(`Failed to download ${format}:`, error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <MenuTrigger>
      <Button
        isDisabled={disabled || downloading !== null}
        aria-label="Download raster image"
        className={buttonClassName}
      >
        {downloading ? (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        ) : (
          <Image size={18} aria-hidden="true" />
        )}
        <span>Raster</span>
      </Button>
      <Popover className={popoverClassName}>
        <Menu
          onAction={(key) => handleDownload(key as RasterFormat)}
          className="outline-none p-1"
        >
          {RASTER_OPTIONS.map(({ id, label }) => (
            <MenuItem key={id} id={id} className={menuItemClassName}>
              <span>{label}</span>
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export function DownloadVectorMenu({
  formulaRef,
  disabled,
}: DownloadMenuProps) {
  const [downloading, setDownloading] = useState<VectorFormat | null>(null);

  const handleDownload = async (format: VectorFormat) => {
    const svg = formulaRef.current?.getSvgElement();
    if (!svg) return;

    setDownloading(format);

    try {
      switch (format) {
        case "svg":
          downloadSvg(svg);
          break;
        case "pdf":
          await downloadPdfVector(svg);
          break;
      }
    } catch (error) {
      console.error(`Failed to download ${format}:`, error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <MenuTrigger>
      <Button
        isDisabled={disabled || downloading !== null}
        aria-label="Download vector image"
        className={buttonClassName}
      >
        {downloading ? (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        ) : (
          <FileCode size={18} aria-hidden="true" />
        )}
        <span>Vector</span>
      </Button>
      <Popover className={popoverClassName}>
        <Menu
          onAction={(key) => handleDownload(key as VectorFormat)}
          className="outline-none p-1"
        >
          {VECTOR_OPTIONS.map(({ id, label }) => (
            <MenuItem key={id} id={id} className={menuItemClassName}>
              <span>{label}</span>
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
